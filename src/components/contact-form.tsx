"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { programmes } from "@/lib/content";
export function ContactForm({ programme }: { programme?: string }) {
  const [choice, setChoice] = useState(programme || "Help me choose");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const requestId = useRef<string | null>(null);
  const submitting = useRef(false);
  const select = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    function choose(slug: string) {
      if (submitting.current) return;
      const p = programmes.find(
        (p) => p.slug === slug && p.kind !== "coming-soon",
      );
      if (p) {
        setChoice(p.title);
        setStatus("idle");
        requestId.current = null;
      }
    }
    const initial = new URLSearchParams(window.location.search).get(
      "programme",
    );
    if (initial) choose(initial);
    function onChoose(event: Event) {
      choose((event as CustomEvent<string>).detail);
      select.current?.focus({ preventScroll: true });
    }
    window.addEventListener("programme-selected", onChoose);
    return () => window.removeEventListener("programme-selected", onChoose);
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setStatus("sending");
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      requestId.current ||= crypto.randomUUID();
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(data),
          requestId: requestId.current,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(
          result.error || "We couldn’t save your enquiry. Please try again.",
        );
      setStatus("success");
      form.reset();
      setChoice(programme || "Help me choose");
      requestId.current = null;
    } catch (error) {
      setError(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "The request timed out. Please try again.",
      );
      setStatus("error");
    } finally {
      submitting.current = false;
    }
  }
  return (
    <form
      className="contact-form"
      onSubmit={submit}
      onChange={() => {
        if (!submitting.current) {
          setStatus("idle");
          requestId.current = null;
        }
      }}
      aria-busy={status === "sending"}
    >
      <fieldset disabled={status === "sending"} className="contact-fields">
        <div className="form-row">
          <label>
            Your name
            <input
              name="name"
              autoComplete="name"
              placeholder="What should we call you?"
              required
              maxLength={100}
            />
          </label>
          <label>
            Email address
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              maxLength={200}
            />
          </label>
        </div>
        <label>
          I’m interested in
          <select
            ref={select}
            name="programme"
            value={choice}
            onChange={(e) => setChoice(e.target.value)}
          >
            <option>Help me choose</option>
            {programmes
              .filter((p) => p.kind !== "coming-soon")
              .map((p) => (
                <option key={p.slug}>{p.title}</option>
              ))}
          </select>
        </label>
        <label>
          A little about you
          <textarea
            name="message"
            placeholder="Where are you in your trading journey?"
            rows={3}
            maxLength={2000}
            required
          />
        </label>
        <div className="form-end">
          <p>
            We’ll use these details to respond to your enquiry.{" "}
            <Link href="/privacy">Privacy details</Link>
          </p>
          <button className="button button-lime" type="submit">
            {status === "sending" ? "Sending…" : "Send my enquiry"}
            <ArrowUpRight size={18} />
          </button>
        </div>
      </fieldset>
      {status === "success" && (
        <div className="form-result" role="status">
          <Check size={20} />
          <div>
            <strong>Thank you. Your enquiry has been received.</strong>
            <p>
              We’ve saved your details. The Green Arc Commune team will be in
              touch.
            </p>
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="form-result form-error" role="alert">
          <p>{error} Your details are still in the form.</p>
        </div>
      )}
    </form>
  );
}
