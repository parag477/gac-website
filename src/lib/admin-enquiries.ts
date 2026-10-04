import { DatabaseSync } from "node:sqlite";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
export type EnquiryRow = {
  id: string;
  name: string;
  email: string;
  programme: string;
  message: string;
  status: string;
  created_at: string;
};
export function listEnquiries(search: string, page: number) {
  const path =
    process.env.ENQUIRIES_DB_PATH ||
    resolve(process.cwd(), "data/enquiries.sqlite");
  if (!existsSync(path)) return { rows: [] as EnquiryRow[], total: 0, page: 1 };
  const db = new DatabaseSync(path, { readOnly: true });
  try {
    if (
      !db
        .prepare(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='enquiries'",
        )
        .get()
    )
      return { rows: [] as EnquiryRow[], total: 0, page: 1 };
    const q = "%" + search.replace(/[\\%_]/g, "\\$&") + "%";
    const where =
      "WHERE name LIKE ? ESCAPE '\\' OR email LIKE ? ESCAPE '\\' OR programme LIKE ? ESCAPE '\\'";
    const total = Number(
      db
        .prepare(`SELECT COUNT(*) AS count FROM enquiries ${where}`)
        .get(q, q, q)?.count || 0,
    );
    page = Math.max(1, Math.min(page, Math.max(1, Math.ceil(total / 30))));
    const rows = db
      .prepare(
        `SELECT id,name,email,programme,message,status,created_at FROM enquiries ${where} ORDER BY created_at DESC,id DESC LIMIT 30 OFFSET ?`,
      )
      .all(q, q, q, (page - 1) * 30) as EnquiryRow[];
    return { rows, total, page };
  } finally {
    db.close();
  }
}
