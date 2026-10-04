import { EnquiryError, saveEnquiry, validateEnquiry } from "@/lib/enquiries";
import { programmes } from "@/lib/content";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (
    origin &&
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
  if (!request.headers.get("content-type")?.includes("application/json"))
    return Response.json(
      { error: "Expected a JSON enquiry." },
      { status: 415 },
    );
  try {
    // Bound the actual streamed body, including requests without Content-Length.
    const reader = request.body?.getReader();
    if (!reader) throw new EnquiryError("Your enquiry was empty.");
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 16000) {
          await reader.cancel();
          throw new EnquiryError("Your enquiry is too long.", 413);
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    let data: unknown;
    try {
      data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      throw new EnquiryError("Please check your enquiry and try again.");
    }
    const enquiry = validateEnquiry(data, [
      "Help me choose",
      ...programmes.filter((p) => p.kind !== "coming-soon").map((p) => p.title),
    ]);
    const result = saveEnquiry(enquiry);
    return Response.json(
      { success: true, id: result.id },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof EnquiryError)
      return Response.json({ error: error.message }, { status: error.status });
    console.error(
      "Enquiry storage failed",
      error instanceof Error ? error.name : "Unknown error",
    );
    return Response.json(
      { error: "We couldn’t save your enquiry. Please try again shortly." },
      { status: 500 },
    );
  }
}
