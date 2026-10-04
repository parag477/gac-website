import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { validateEnquiry, saveEnquiry } from "../src/lib/enquiries.ts";
const allowed = ["Help me choose", "Live Mentorship Program"];
const sample = () => ({
  name: "Test Learner",
  email: "test@example.com",
  programme: allowed[1],
  message: "I would like to understand the programme.",
  requestId: randomUUID(),
});
test("rejects invalid input and unavailable programmes", () => {
  for (const patch of [
    { email: "invalid" },
    { name: " " },
    { message: "x".repeat(2001) },
    { programme: "Algo Core" },
    { requestId: "invalid" },
  ])
    assert.throws(() => validateEnquiry({ ...sample(), ...patch }, allowed));
  assert.equal(
    validateEnquiry(
      { ...sample(), name: " Test ", email: "TEST@example.com" },
      allowed,
    ).email,
    "test@example.com",
  );
});
test("persists enquiry, handles safe retries and limits repeated submissions", async () => {
  const dir = mkdtempSync(join(tmpdir(), "gac-enquiries-"));
  const path = join(dir, "records.sqlite");
  try {
    const data = validateEnquiry(sample(), allowed);
    const first = await saveEnquiry(data, path);
    assert.equal((await saveEnquiry(data, path)).id, first.id);
    await assert.rejects(
      saveEnquiry({ ...data, message: "Changed payload" }, path),
      /refresh/,
    );
    const db = new DatabaseSync(path);
    const row = db.prepare("SELECT * FROM enquiries").get();
    assert.equal(row?.name, data.name);
    assert.equal(row?.message, data.message);
    assert.equal(row?.status, "new");
    assert.equal(
      db.prepare("SELECT COUNT(*) AS count FROM enquiries").get()?.count,
      1,
    );
    db.close();
    for (let i = 0; i < 4; i++)
      await saveEnquiry({ ...data, requestId: randomUUID() }, path);
    await assert.rejects(
      saveEnquiry({ ...data, requestId: randomUUID() }, path),
      /hour/,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
