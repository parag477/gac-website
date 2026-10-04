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

test("protected first-account signup, password hashing and session lifecycle", async () => {
  const dir = mkdtempSync(join(tmpdir(), "gac-admin-"));
  const path = join(dir, "admin.sqlite");
  try {
    assert.equal(await hasAdmin(path), false);
    const data = {
      email: "owner@example.com",
      password: "A-test-password-only-2026",
      setupKey: "test-key",
    };
    await assert.rejects(
      registerAdmin({ ...data, setupKey: "wrong" }, "test-key", path),
    );
    await assert.rejects(registerAdmin(data, undefined, path));
    const id = await registerAdmin(data, "test-key", path);
    assert.equal(await hasAdmin(path), true);
    await assert.rejects(
      registerAdmin(
        { ...data, email: "another@example.com" },
        "test-key",
        path,
      ),
      /already exists/,
    );
    await assert.rejects(
      loginAdmin(data.email, "An-incorrect-password", path),
      /incorrect/,
    );
    await assert.rejects(
      loginAdmin("missing@example.com", data.password, path),
      /incorrect/,
    );
    assert.equal(
      await loginAdmin("OWNER@example.com", data.password, path),
      id,
    );
    const token = await createSession(id, path);
    assert.equal((await getSession(token, path))?.email, data.email);
    assert.equal(await getSession("bad-token", path), null);
    const db = new DatabaseSync(path);
    const user = db.prepare("SELECT * FROM admins").get();
    assert.notEqual(user?.password_hash, data.password);
    assert.equal(
      db.prepare("SELECT token_hash FROM sessions").get()?.token_hash === token,
      false,
    );
    await revokeSession(token, path);
    assert.equal(await getSession(token, path), null);
    const expired = await createSession(id, path);
    db.exec("UPDATE sessions SET expires=0");
    assert.equal(await getSession(expired, path), null);
    db.close();
    for (let i = 0; i < 10; i++) await limitAuth("test-client", path);
    await assert.rejects(limitAuth("test-client", path), /Too many/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
