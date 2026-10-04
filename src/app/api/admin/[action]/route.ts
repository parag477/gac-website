import { cookies } from "next/headers";
import {
  AuthError,
  createSession,
  loginAdmin,
  registerAdmin,
  revokeSession,
  limitAuth,
} from "@/lib/admin-auth";
export const runtime = "nodejs";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ action: string }> },
) {
  const { action } = await params;
  if (!["login", "signup", "logout"].includes(action))
    return Response.json({ error: "Not found" }, { status: 404 });
  const origin = request.headers.get("origin");
  if (
    !origin ||
    ![
      new URL(request.url).origin,
      `http://${request.headers.get("host")}`,
      `https://${request.headers.get("host")}`,
    ].includes(origin)
  )
    return Response.json(
      { error: "Please submit from this website." },
      { status: 403 },
    );
  const jar = await cookies();
  try {
    if (action === "logout") {
      revokeSession(jar.get("gac_admin")?.value);
      jar.delete("gac_admin");
      return Response.json({ success: true });
    }
    if (!request.headers.get("content-type")?.includes("application/json"))
      throw new AuthError("Invalid request.", 415);
    // Global throttle is deliberately independent of untrusted forwarded-IP headers.
    limitAuth("all-auth", undefined, 200);
    const reader = request.body?.getReader();
    if (!reader) throw new AuthError("Invalid request.");
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > 4096) {
          await reader.cancel();
          throw new AuthError("Request too large.", 413);
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    let data;
    try {
      data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      throw new AuthError("Invalid request.");
    }
    if (!data || typeof data !== "object")
      throw new AuthError("Invalid request.");
    if (typeof data.email === "string")
      limitAuth(`${action}:${data.email.trim().toLowerCase()}`);
    const id =
      action === "signup"
        ? registerAdmin(data, process.env.ADMIN_SETUP_KEY)
        : loginAdmin(data.email, data.password);
    const token = createSession(id);
    jar.set("gac_admin", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 86400,
    });
    return Response.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof AuthError)
      return Response.json({ error: error.message }, { status: error.status });
    console.error("Admin authentication failed");
    return Response.json(
      { error: "Unable to sign in. Please try again." },
      { status: 500 },
    );
  }
}
