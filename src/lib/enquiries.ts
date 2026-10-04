import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";

export type Enquiry = {
  name: string;
  email: string;
  programme: string;
  message: string;
  requestId: string;
};
export class EnquiryError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}
export function validateEnquiry(
  input: unknown,
  allowedProgrammes: readonly string[],
): Enquiry {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new EnquiryError("Please check your enquiry and try again.");
  const data = input as Record<string, unknown>;
  const read = (key: string, max: number) => {
    const value = data[key];
    if (typeof value !== "string" || !value.trim() || value.trim().length > max)
      throw new EnquiryError(`Please enter a valid ${key}.`);
    return value.trim();
  };
  const name = read("name", 100),
    email = read("email", 200).toLowerCase(),
    programme = read("programme", 100),
    message = read("message", 2000),
    requestId = read("requestId", 36);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new EnquiryError("Please enter a valid email address.");
  if (!allowedProgrammes.includes(programme))
    throw new EnquiryError("Please select an available programme.");
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      requestId,
    )
  )
    throw new EnquiryError("Please refresh the page and try again.");
  return { name, email, programme, message, requestId };
}
// Keep this file on a persistent disk in production; never expose it under public/.
export function saveEnquiry(
  enquiry: Enquiry,
  databasePath = process.env.ENQUIRIES_DB_PATH ||
    resolve(process.cwd(), "data/enquiries.sqlite"),
) {
  mkdirSync(dirname(databasePath), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(databasePath);
  try {
    db.exec("PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;");
    db.exec(`CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY, request_id TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
      email TEXT NOT NULL, programme TEXT NOT NULL, message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new', created_at TEXT NOT NULL
    ); CREATE INDEX IF NOT EXISTS enquiries_email_created ON enquiries(email, created_at);`);
    db.exec("BEGIN IMMEDIATE");
    const existing = db
      .prepare(
        "SELECT id,name,email,programme,message FROM enquiries WHERE request_id=?",
      )
      .get(enquiry.requestId);
    if (existing) {
      if (
        existing.name !== enquiry.name ||
        existing.email !== enquiry.email ||
        existing.programme !== enquiry.programme ||
        existing.message !== enquiry.message
      )
        throw new EnquiryError(
          "Please refresh the page before sending a new enquiry.",
          409,
        );
      db.exec("COMMIT");
      return { id: existing.id as string };
    }
    const recent = db
      .prepare(
        "SELECT COUNT(*) AS count FROM enquiries WHERE email=? AND created_at>?",
      )
      .get(enquiry.email, new Date(Date.now() - 3600000).toISOString());
    if (Number(recent?.count) >= 5)
      throw new EnquiryError(
        "You’ve sent several enquiries. Please try again in an hour.",
        429,
      );
    const id = randomUUID();
    db.prepare(
      "INSERT INTO enquiries (id,request_id,name,email,programme,message,created_at) VALUES (?,?,?,?,?,?,?)",
    ).run(
      id,
      enquiry.requestId,
      enquiry.name,
      enquiry.email,
      enquiry.programme,
      enquiry.message,
      new Date().toISOString(),
    );
    db.exec("COMMIT");
    return { id };
  } finally {
    db.close();
  }
}
