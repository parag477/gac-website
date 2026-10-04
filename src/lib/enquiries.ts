import { randomUUID } from "node:crypto";
import { withDatabase } from "./database.ts";

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
export async function saveEnquiry(enquiry: Enquiry, databasePath?: string) {
  return withDatabase("enquiries", databasePath, async (db) => {
    const tx = await db.transaction("write");
    try {
      const existing = (
        await tx.execute({
          sql: "SELECT id,name,email,programme,message FROM enquiries WHERE request_id=?",
          args: [enquiry.requestId],
        })
      ).rows[0];
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
        await tx.commit();
        return { id: existing.id as string };
      }
      const recent = (
        await tx.execute({
          sql: "SELECT COUNT(*) AS count FROM enquiries WHERE email=? AND created_at>?",
          args: [enquiry.email, new Date(Date.now() - 3600000).toISOString()],
        })
      ).rows[0];
      if (Number(recent?.count) >= 5)
        throw new EnquiryError(
          "You’ve sent several enquiries. Please try again in an hour.",
          429,
        );
      const id = randomUUID();
      await tx.execute({
        sql: "INSERT INTO enquiries (id,request_id,name,email,programme,message,created_at) VALUES (?,?,?,?,?,?,?)",
        args: [
          id,
          enquiry.requestId,
          enquiry.name,
          enquiry.email,
          enquiry.programme,
          enquiry.message,
          new Date().toISOString(),
        ],
      });
      await tx.commit();
      return { id };
    } finally {
      tx.close();
    }
  });
}
