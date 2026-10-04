import { createClient, type Client } from "@libsql/client";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

type DatabaseKind = "enquiries" | "admin";
const initialized = new Map<DatabaseKind, Promise<void>>();

async function ensureSchema(kind: DatabaseKind, db: Client, remote: boolean) {
  let ready = remote ? initialized.get(kind) : undefined;
  if (!ready) {
    ready = db
      .batch(
        kind === "enquiries"
          ? [
              `CREATE TABLE IF NOT EXISTS enquiries (
              id TEXT PRIMARY KEY, request_id TEXT NOT NULL UNIQUE,
              name TEXT NOT NULL, email TEXT NOT NULL,
              programme TEXT NOT NULL, message TEXT NOT NULL,
              status TEXT NOT NULL DEFAULT 'new', created_at TEXT NOT NULL
            )`,
              "CREATE INDEX IF NOT EXISTS enquiries_email_created ON enquiries(email, created_at)",
            ]
          : [
              "CREATE TABLE IF NOT EXISTS admins (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, salt TEXT NOT NULL)",
              "CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, admin_id TEXT NOT NULL, expires INTEGER NOT NULL)",
              "CREATE TABLE IF NOT EXISTS attempts (bucket TEXT PRIMARY KEY, count INTEGER NOT NULL, resets INTEGER NOT NULL)",
            ],
      )
      .then(() => undefined);
    if (remote) initialized.set(kind, ready);
  }
  try {
    await ready;
  } catch (error) {
    if (remote) initialized.delete(kind);
    throw error;
  }
}

/** Vercel's filesystem is not persistent. A remote libSQL URL is required there. */
export function openDatabase(kind: DatabaseKind, path?: string): Client {
  if (!path && process.env.TURSO_DATABASE_URL) {
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!authToken)
      throw new Error("TURSO_AUTH_TOKEN is required with TURSO_DATABASE_URL");
    if (
      process.env.VERCEL &&
      !/^(libsql|https):\/\//.test(process.env.TURSO_DATABASE_URL)
    )
      throw new Error("TURSO_DATABASE_URL must be a remote URL on Vercel");
    return createClient({ url: process.env.TURSO_DATABASE_URL, authToken });
  }

  if (!path && process.env.VERCEL)
    throw new Error(
      "Persistent storage is not configured: set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN on Vercel",
    );

  const file =
    path ||
    process.env[kind === "enquiries" ? "ENQUIRIES_DB_PATH" : "ADMIN_DB_PATH"] ||
    resolve(process.cwd(), `data/${kind}.sqlite`);
  mkdirSync(dirname(file), { recursive: true, mode: 0o700 });
  return createClient({ url: `file:${file}` });
}

export async function withDatabase<T>(
  kind: DatabaseKind,
  path: string | undefined,
  action: (db: Client) => Promise<T>,
): Promise<T> {
  const db = openDatabase(kind, path);
  try {
    await ensureSchema(
      kind,
      db,
      !path && Boolean(process.env.TURSO_DATABASE_URL),
    );
    return await action(db);
  } finally {
    db.close();
  }
}
