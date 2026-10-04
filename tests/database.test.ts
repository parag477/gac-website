import { test } from "node:test";
import assert from "node:assert/strict";
import { openDatabase } from "../src/lib/database.ts";

test("Vercel requires persistent hosted database configuration", () => {
  const old = {
    vercel: process.env.VERCEL,
    url: process.env.TURSO_DATABASE_URL,
    token: process.env.TURSO_AUTH_TOKEN,
  };
  try {
    process.env.VERCEL = "1";
    delete process.env.TURSO_DATABASE_URL;
    delete process.env.TURSO_AUTH_TOKEN;
    assert.throws(
      () => openDatabase("enquiries"),
      /Persistent storage is not configured/,
    );
    assert.throws(
      () => openDatabase("admin"),
      /Persistent storage is not configured/,
    );
    process.env.TURSO_DATABASE_URL = "libsql://example.turso.io";
    assert.throws(() => openDatabase("enquiries"), /TURSO_AUTH_TOKEN/);
    process.env.TURSO_DATABASE_URL = "file:/tmp/not-persistent.sqlite";
    process.env.TURSO_AUTH_TOKEN = "test-token";
    assert.throws(() => openDatabase("enquiries"), /remote URL/);
  } finally {
    for (const [key, value] of [
      ["VERCEL", old.vercel],
      ["TURSO_DATABASE_URL", old.url],
      ["TURSO_AUTH_TOKEN", old.token],
    ] as const) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
