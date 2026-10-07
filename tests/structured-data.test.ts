import test from "node:test";
import assert from "node:assert/strict";
import { serializeStructuredData } from "../src/lib/structured-data.ts";

test("structured data cannot close its script tag and preserves decoded content", () => {
  const data = {
    name: "A < B",
    description: '</script><script>alert("x")</script>',
    text: "Hindi हिंदी & gold",
  };
  const encoded = serializeStructuredData(data);
  assert.equal(encoded.includes("<"), false);
  assert.deepEqual(JSON.parse(encoded), data);
});
