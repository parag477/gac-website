import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import {
  hasAdmin,
  registerAdmin,
  loginAdmin,
  createSession,
  getSession,
  revokeSession,
  limitAuth,
} from "../src/lib/admin-auth.ts";
test("protected first-account signup, password hashing and session lifecycle", () => {
  const dir = mkdtempSync(join(tmpdir(), "gac-admin-"));
  const path = join(dir, "admin.sqlite");
  try {
    assert.equal(hasAdmin(path), false);
    const data = {
      email: "owner@example.com",
      password: "A-test-password-only-2026",
      setupKey: "test-key",
    };
    assert.throws(() =>
      registerAdmin({ ...data, setupKey: "wrong" }, "test-key", path),
    );
    assert.throws(() => registerAdmin(data, undefined, path));
    const id = registerAdmin(data, "test-key", path);
    assert.equal(hasAdmin(path), true);
    assert.throws(
      () =>
        registerAdmin(
          { ...data, email: "another@example.com" },
          "test-key",
          path,
        ),
      /already exists/,
    );
    assert.throws(
      () => loginAdmin(data.email, "An-incorrect-password", path),
      /incorrect/,
    );
    assert.throws(
      () => loginAdmin("missing@example.com", data.password, path),
      /incorrect/,
    );
    assert.equal(loginAdmin("OWNER@example.com", data.password, path), id);
    const token = createSession(id, path);
    assert.equal(getSession(token, path)?.email, data.email);
    assert.equal(getSession("bad-token", path), null);
    const db = new DatabaseSync(path);
    const user = db.prepare("SELECT * FROM admins").get();
    assert.notEqual(user?.password_hash, data.password);
    assert.equal(
      db.prepare("SELECT token_hash FROM sessions").get()?.token_hash === token,
      false,
    );
    revokeSession(token, path);
    assert.equal(getSession(token, path), null);
    const expired = createSession(id, path);
    db.exec("UPDATE sessions SET expires=0");
    assert.equal(getSession(expired, path), null);
    db.close();
    for (let i = 0; i < 10; i++) limitAuth("test-client", path);
    assert.throws(() => limitAuth("test-client", path), /Too many/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
