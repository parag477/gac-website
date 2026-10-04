import { withDatabase } from "./database.ts";

export type EnquiryRow = {
  id: string;
  name: string;
  email: string;
  programme: string;
  message: string;
  status: string;
  created_at: string;
};

export async function listEnquiries(search: string, page: number) {
  return withDatabase("enquiries", undefined, async (db) => {
    const q = "%" + search.replace(/[\\%_]/g, "\\$&") + "%";
    const where =
      "WHERE name LIKE ? ESCAPE '\\' OR email LIKE ? ESCAPE '\\' OR programme LIKE ? ESCAPE '\\'";
    const total = Number(
      (
        await db.execute({
          sql: `SELECT COUNT(*) AS count FROM enquiries ${where}`,
          args: [q, q, q],
        })
      ).rows[0]?.count || 0,
    );
    page = Math.max(1, Math.min(page, Math.max(1, Math.ceil(total / 30))));
    const result = await db.execute({
      sql: `SELECT id,name,email,programme,message,status,created_at FROM enquiries ${where} ORDER BY created_at DESC,id DESC LIMIT 30 OFFSET ?`,
      args: [q, q, q, (page - 1) * 30],
    });
    return { rows: result.rows as unknown as EnquiryRow[], total, page };
  });
}
