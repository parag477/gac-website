import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { listEnquiries } from "../src/lib/admin-enquiries.ts";
import { saveEnquiry } from "../src/lib/enquiries.ts";
test("admin search preserves literal wildcards and clamps pagination", async () => {
  const dir = mkdtempSync(join(tmpdir(), "gac-admin-list-"));
  const path = join(dir, "enquiries.sqlite");
  const old = process.env.ENQUIRIES_DB_PATH;
  process.env.ENQUIRIES_DB_PATH = path;
  try {
    assert.equal((await listEnquiries("", 999)).page, 1);
    await saveEnquiry(
      {
        name: "Test % learner",
        email: "test@example.com",
        programme: "Live Mentorship Program",
        message: "Test message",
        requestId: randomUUID(),
      },
      path,
    );
    assert.equal((await listEnquiries("", 999)).rows.length, 1);
    assert.equal((await listEnquiries("", 999)).page, 1);
    assert.equal((await listEnquiries("%", 1)).total, 1);
    assert.equal((await listEnquiries("_", 1)).total, 0);
    assert.equal((await listEnquiries("' OR 1=1 --", 1)).total, 0);
  } finally {
    if (old === undefined) delete process.env.ENQUIRIES_DB_PATH;
    else process.env.ENQUIRIES_DB_PATH = old;
    rmSync(dir, { recursive: true, force: true });
  }
});
