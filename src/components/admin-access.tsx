"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
export function AdminAccess({ setup }: { setup: boolean }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const router = useRouter();
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch(`/api/admin/${setup ? "signup" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="admin-access" onSubmit={submit}>
      <fieldset disabled={busy}>
        <h1>{setup ? "Create your admin account." : "Welcome back."}</h1>
        <p>
          {setup
            ? "Set up your private enquiry workspace."
            : "Log in to view your website enquiries."}
        </p>
        <label>
          Email address
          <input
            type="email"
            name="email"
            autoComplete="username"
            required
            maxLength={200}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            autoComplete={setup ? "new-password" : "current-password"}
            minLength={12}
            maxLength={128}
            required
          />
        </label>
        {setup && (
          <>
            <small>Use at least 12 characters.</small>
            <label>
              Private setup code
              <input
                type="password"
                name="setupKey"
                autoComplete="off"
                required
              />
            </label>
            <p className="admin-hint">
              On the live site, enter the value of ADMIN_SETUP_KEY saved for
              Production in Vercel. Your local setup file works only if you set
              the same value there. Signup closes after the first account.
            </p>
          </>
        )}
        <button className="button button-dark" disabled={busy}>
          {busy ? "Please wait…" : setup ? "Create account" : "Log in"}
        </button>
        {error && (
          <p role="alert" className="admin-error">
            {error}
          </p>
        )}
      </fieldset>
    </form>
  );
}
export function AdminLogout() {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <div>
      <button
        className="text-link"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const response = await fetch("/api/admin/logout", {
              method: "POST",
            });
            if (!response.ok) throw new Error();
            router.refresh();
          } catch {
            setError("Could not log out. Try again.");
          } finally {
            setBusy(false);
          }
        }}
      >
        Log out
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
