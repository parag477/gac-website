import { cookies } from "next/headers";
import Link from "next/link";
import { getSession, hasAdmin } from "@/lib/admin-auth";
import { listEnquiries } from "@/lib/admin-enquiries";
import { AdminAccess, AdminLogout } from "@/components/admin-access";
import { Brand } from "@/components/site-shell";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin · Enquiries",
  robots: { index: false, follow: false },
};
export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const admin = getSession((await cookies()).get("gac_admin")?.value);
  if (!admin)
    return (
      <main id="main" className="admin-page">
        <div className="admin-top">
          <Brand />
          <Link href="/">Back to website</Link>
        </div>
        <AdminAccess setup={!hasAdmin()} />
      </main>
    );
  const query = await searchParams;
  const q = typeof query.q === "string" ? query.q.slice(0, 200) : "";
  const requestedPage = Math.max(
    1,
    Math.min(100000, parseInt(query.page || "1", 10) || 1),
  );
  const { rows, total, page } = listEnquiries(q, requestedPage);
  const pages = Math.max(1, Math.ceil(total / 30));
  return (
    <main id="main" className="admin-page">
      <div className="admin-top">
        <Brand />
        <div>
          <span>{admin.email}</span>
          <AdminLogout />
        </div>
      </div>
      <header className="admin-heading">
        <div>
          <h1>Enquiries</h1>
          <p>
            {total} {total === 1 ? "enquiry" : "enquiries"}
            {q ? " matching your search" : " received through your website"}
          </p>
        </div>
        <Link href="/">View website ↗</Link>
      </header>
      <form className="admin-search" action="/admin">
        <label htmlFor="admin-search">Search name, email or programme</label>
        <div>
          <input
            id="admin-search"
            name="q"
            defaultValue={q}
            maxLength={200}
            placeholder="Search enquiries"
          />
          <button className="button button-dark">Search</button>
          {q && <Link href="/admin">Clear</Link>}
        </div>
      </form>
      {rows.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Received</th>
                <th>Person</th>
                <th>Programme</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <time dateTime={row.created_at}>
                      {new Date(row.created_at).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </time>
                    <small>IST</small>
                  </td>
                  <td>
                    <strong>{row.name}</strong>
                    <a href={`mailto:${row.email}`}>{row.email}</a>
                  </td>
                  <td>{row.programme}</td>
                  <td>
                    <p>{row.message}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty">
          <h2>
            {q
              ? "No matching enquiries."
              : "Your first enquiry will appear here."}
          </h2>
          <p>
            {q
              ? "Try another name, email or programme."
              : "New form submissions are saved automatically. Refresh this page to see the latest enquiries."}
          </p>
        </div>
      )}
      <nav className="admin-pagination" aria-label="Enquiry pages">
        {page > 1 && (
          <Link href={`/admin?q=${encodeURIComponent(q)}&page=${page - 1}`}>
            ← Previous
          </Link>
        )}
        <span>
          Page {page} of {pages}
        </span>
        {page < pages && (
          <Link href={`/admin?q=${encodeURIComponent(q)}&page=${page + 1}`}>
            Next →
          </Link>
        )}
      </nav>
    </main>
  );
}
