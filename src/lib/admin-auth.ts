import {
  createHash,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { type Client } from "@libsql/client";
import { withDatabase } from "./database.ts";

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");

async function withAdminDatabase<T>(
  path: string | undefined,
  action: (db: Client) => Promise<T>,
) {
  return withDatabase("admin", path, action);
}

export async function hasAdmin(path?: string) {
  return withAdminDatabase(path, async (db) =>
    Boolean((await db.execute("SELECT id FROM admins LIMIT 1")).rows[0]),
  );
}

export async function limitAuth(bucket: string, path?: string, ceiling = 10) {
  return withAdminDatabase(path, async (db) => {
    const now = Date.now();
    const result = await db.execute({
      sql: `INSERT INTO attempts(bucket,count,resets) VALUES(?,1,?)
        ON CONFLICT(bucket) DO UPDATE SET
          count=CASE WHEN resets < ? THEN 1 ELSE count+1 END,
          resets=CASE WHEN resets < ? THEN excluded.resets ELSE resets END
        RETURNING count`,
      args: [hash(bucket), now + 15 * 60000, now, now],
    });
    if (Number(result.rows[0]?.count) > ceiling)
      throw new AuthError(
        "Too many attempts. Please try again in 15 minutes.",
        429,
      );
  });
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

export async function registerAdmin(
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
  return withAdminDatabase(path, async (db) => {
    const tx = await db.transaction("write");
    try {
      if ((await tx.execute("SELECT id FROM admins LIMIT 1")).rows[0])
        throw new AuthError(
          "An admin account already exists. Please log in.",
          409,
        );
      const id = randomUUID();
      await tx.execute({
        sql: "INSERT INTO admins(id,email,password_hash,salt) VALUES(?,?,?,?)",
        args: [id, email, passwordHash, salt],
      });
      await tx.commit();
      return id;
    } finally {
      tx.close();
    }
  });
}

export async function loginAdmin(
  emailValue: unknown,
  passwordValue: unknown,
  path?: string,
) {
  const { email, password } = credentials(emailValue, passwordValue);
  return withAdminDatabase(path, async (db) => {
    const row = (
      await db.execute({
        sql: "SELECT * FROM admins WHERE email=?",
        args: [email],
      })
    ).rows[0];
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
  });
}

export async function createSession(adminId: string, path?: string) {
  const token = randomBytes(32).toString("hex");
  return withAdminDatabase(path, async (db) => {
    await db.execute({
      sql: "INSERT INTO sessions(token_hash,admin_id,expires) VALUES(?,?,?)",
      args: [hash(token), adminId, Date.now() + 7 * 86400000],
    });
    return token;
  });
}

export async function getSession(
  token: string | undefined,
  path?: string,
): Promise<{ id: string; email: string } | null> {
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  return withAdminDatabase(path, async (db) => {
    const row = (
      await db.execute({
        sql: "SELECT a.id,a.email FROM sessions s JOIN admins a ON a.id=s.admin_id WHERE s.token_hash=? AND s.expires>?",
        args: [hash(token), Date.now()],
      })
    ).rows[0];
    return row ? { id: row.id as string, email: row.email as string } : null;
  });
}

export async function revokeSession(token: string | undefined, path?: string) {
  if (!token) return;
  return withAdminDatabase(path, async (db) => {
    await db.execute({
      sql: "DELETE FROM sessions WHERE token_hash=?",
      args: [hash(token)],
    });
  });
}
