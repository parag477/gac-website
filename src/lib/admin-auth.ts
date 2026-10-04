import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  createHash,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}
const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
function database(
  path = process.env.ADMIN_DB_PATH ||
    resolve(process.cwd(), "data/admin.sqlite"),
) {
  mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(path);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS admins (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, salt TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, admin_id TEXT NOT NULL, expires INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS attempts (bucket TEXT PRIMARY KEY, count INTEGER NOT NULL, resets INTEGER NOT NULL);`);
  return db;
}
export function hasAdmin(path?: string) {
  const db = database(path);
  try {
    return !!db.prepare("SELECT id FROM admins LIMIT 1").get();
  } finally {
    db.close();
  }
}
export function limitAuth(bucket: string, path?: string, ceiling = 10) {
  const db = database(path);
  try {
    const now = Date.now();
    db.prepare("DELETE FROM attempts WHERE resets<?").run(now);
    const row = db
      .prepare(
        `INSERT INTO attempts(bucket,count,resets) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1 RETURNING count`,
      )
      .get(hash(bucket), now + 15 * 60000);
    if (Number(row?.count) > ceiling)
      throw new AuthError(
        "Too many attempts. Please try again in 15 minutes.",
        429,
      );
  } finally {
    db.close();
  }
}
function credentials(email: unknown, password: unknown) {
  if (
    typeof email !== "string" ||
    email.length > 200 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof password !== "string" ||
    password.length < 12 ||
    password.length > 128
  )
    throw new AuthError(
      "Enter a valid email and a password of 12–128 characters.",
    );
  return { email: email.trim().toLowerCase(), password };
}
export function registerAdmin(
  input: { email: unknown; password: unknown; setupKey: unknown },
  expectedKey: string | undefined,
  path?: string,
) {
  if (
    !expectedKey ||
    typeof input.setupKey !== "string" ||
    !timingSafeEqual(
      Buffer.from(hash(input.setupKey)),
      Buffer.from(hash(expectedKey)),
    )
  )
    throw new AuthError("The setup code is not valid.", 403);
  const { email, password } = credentials(input.email, input.password);
  const salt = randomBytes(16).toString("hex");
  const passwordHash = scryptSync(password, salt, 64).toString("hex");
  const db = database(path);
  try {
    db.exec("BEGIN IMMEDIATE");
    if (db.prepare("SELECT id FROM admins LIMIT 1").get())
      throw new AuthError(
        "An admin account already exists. Please log in.",
        409,
      );
    const id = randomUUID();
    db.prepare("INSERT INTO admins VALUES(?,?,?,?)").run(
      id,
      email,
      passwordHash,
      salt,
    );
    db.exec("COMMIT");
    return id;
  } finally {
    db.close();
  }
}
export function loginAdmin(
  emailValue: unknown,
  passwordValue: unknown,
  path?: string,
) {
  const { email, password } = credentials(emailValue, passwordValue);
  const db = database(path);
  try {
    const row = db.prepare("SELECT * FROM admins WHERE email=?").get(email);
    const salt =
      typeof row?.salt === "string"
        ? row.salt
        : "00000000000000000000000000000000";
    const candidate = scryptSync(password, salt, 64);
    const expected =
      typeof row?.password_hash === "string"
        ? Buffer.from(row.password_hash, "hex")
        : Buffer.alloc(64);
    if (!timingSafeEqual(candidate, expected) || !row)
      throw new AuthError("Email or password is incorrect.", 401);
    return row.id as string;
  } finally {
    db.close();
  }
}
export function createSession(adminId: string, path?: string) {
  const token = randomBytes(32).toString("hex");
  const db = database(path);
  try {
    db.prepare("DELETE FROM sessions WHERE expires<?").run(Date.now());
    db.prepare("INSERT INTO sessions VALUES(?,?,?)").run(
      hash(token),
      adminId,
      Date.now() + 7 * 86400000,
    );
    return token;
  } finally {
    db.close();
  }
}
export function getSession(
  token: string | undefined,
  path?: string,
): { id: string; email: string } | null {
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const db = database(path);
  try {
    const row = db
      .prepare(
        "SELECT a.id,a.email FROM sessions s JOIN admins a ON a.id=s.admin_id WHERE s.token_hash=? AND s.expires>?",
      )
      .get(hash(token), Date.now());
    return row ? { id: row.id as string, email: row.email as string } : null;
  } finally {
    db.close();
  }
}
export function revokeSession(token: string | undefined, path?: string) {
  if (!token) return;
  const db = database(path);
  try {
    db.prepare("DELETE FROM sessions WHERE token_hash=?").run(hash(token));
  } finally {
    db.close();
  }
}
