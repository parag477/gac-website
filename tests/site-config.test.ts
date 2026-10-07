import test from "node:test";
import assert from "node:assert/strict";
import {
  canonicalOrigin,
  isSiteIndexable,
  productionOrigin,
} from "../src/lib/site-config.ts";

test("production discovery is enabled by default but an explicit pause is respected", () => {
  assert.equal(
    isSiteIndexable({ VERCEL_ENV: "production", NODE_ENV: "production" }),
    true,
  );
  assert.equal(
    isSiteIndexable({ VERCEL_ENV: "production", SITE_INDEXABLE: "false" }),
    false,
  );
  assert.equal(
    isSiteIndexable({ VERCEL_ENV: "production", SITE_INDEXABLE: "true" }),
    true,
  );
});

test("preview and development never inherit an indexing opt-in", () => {
  for (const VERCEL_ENV of ["preview", "development"]) {
    assert.equal(
      isSiteIndexable({
        VERCEL_ENV,
        SITE_INDEXABLE: "true",
        NODE_ENV: "production",
      }),
      false,
    );
  }
  for (const NODE_ENV of ["development", "test"]) {
    assert.equal(isSiteIndexable({ NODE_ENV, SITE_INDEXABLE: "true" }), false);
  }
  assert.equal(isSiteIndexable({ NODE_ENV: "production" }), false);
  assert.equal(
    isSiteIndexable({ NODE_ENV: "production", SITE_INDEXABLE: "true" }),
    true,
  );
});

test("canonical origins agree with the live www redirect even with the legacy env value", () => {
  for (const value of [
    undefined,
    "https://greenarccommune.com",
    "http://greenarccommune.com/",
    "https://www.greenarccommune.com/path?x=1",
  ]) {
    assert.equal(canonicalOrigin(value), productionOrigin);
  }
  assert.equal(
    canonicalOrigin("https://example.com/path?x=1"),
    "https://example.com",
  );
  assert.throws(() => canonicalOrigin("not-a-url"));
  assert.throws(() => canonicalOrigin("javascript:alert(1)"));
  assert.throws(() => canonicalOrigin("https://user:password@example.com"));
});
