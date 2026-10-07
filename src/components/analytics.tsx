"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  analyticsPath,
  analyticsPreferenceKey,
  analyticsWindow,
  trackEvent,
} from "@/lib/analytics";

type Consent = "granted" | "denied" | null;

export function Analytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent | "loading">("loading");
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const lastPage = useRef<string | null>(null);
  const initialized = useRef(false);
  const settingsButton = useRef<HTMLElement | null>(null);
  const firstChoice = useRef<HTMLButtonElement>(null);
  const path = analyticsPath(pathname);

  useEffect(() => {
    const loadPreference = () => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(analyticsPreferenceKey);
      } catch {
        /* Memory-only preference when storage is unavailable. */
      }
      setConsent(stored === "granted" || stored === "denied" ? stored : null);
    };
    loadPreference();
    const open = () => {
      settingsButton.current = document.activeElement as HTMLElement;
      setPreferencesOpen(true);
      requestAnimationFrame(() => firstChoice.current?.focus());
    };
    window.addEventListener("analytics-preferences", open);
    window.addEventListener("storage", loadPreference);
    return () => {
      window.removeEventListener("analytics-preferences", open);
      window.removeEventListener("storage", loadPreference);
    };
  }, []);

  useEffect(() => {
    const w = analyticsWindow();
    const allowed = consent === "granted" && path !== null;
    w.gacAnalyticsAllowed = allowed;
    (window as unknown as Record<string, unknown>)[
      `ga-disable-${measurementId}`
    ] = !allowed;
    if (!allowed) {
      if (consent === "denied") {
        w.gtag?.("consent", "update", { analytics_storage: "denied" });
        clearAnalyticsCookies();
      }
      lastPage.current = null;
      return;
    }
    if (!loaded || !w.gtag || lastPage.current === path) return;
    lastPage.current = path;
    const pageLocation = `${window.location.origin}${path}`;
    w.gtag("set", {
      page_location: pageLocation,
      page_referrer: safeReferrer(),
    });
    w.gtag("event", "page_view", {
      page_location: pageLocation,
      page_title: document.title,
    });
  }, [consent, path, loaded, measurementId]);

  useEffect(() => {
    const click = (event: MouseEvent) => {
      const anchor =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (!anchor) return;
      if (anchor.dataset.programme)
        trackEvent("programme_select", anchor.dataset.programme);
      const url = new URL(anchor.href);
      if (url.hostname === "wa.me")
        trackEvent("whatsapp_click", "strategy-master", "support");
      if (url.hostname === "whatsapp.com")
        trackEvent("whatsapp_click", "help-me-choose", "community");
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);

  function choose(value: Exclude<Consent, null>) {
    try {
      localStorage.setItem(analyticsPreferenceKey, value);
    } catch {
      /* The current visit still respects this choice. */
    }
    const w = analyticsWindow();
    w.gacAnalyticsAllowed = value === "granted" && path !== null;
    (window as unknown as Record<string, unknown>)[
      `ga-disable-${measurementId}`
    ] = !w.gacAnalyticsAllowed;
    if (value === "denied") {
      clearAnalyticsCookies();
    }
    w.gtag?.("consent", "update", { analytics_storage: value });
    setConsent(value);
    setPreferencesOpen(false);
    settingsButton.current?.focus();
  }

  if (!path) return null;
  return (
    <>
      {consent === "granted" && (
        <Script
          id="gac-google-analytics"
          src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          strategy="afterInteractive"
          onReady={() => {
            const w = analyticsWindow();
            if (initialized.current) {
              w.gtag?.("consent", "update", { analytics_storage: "granted" });
              setLoaded(true);
              return;
            }
            initialized.current = true;
            w.dataLayer ||= [];
            w.gtag ||= function () {
              // gtag's documented dataLayer protocol uses an Arguments entry.
              // eslint-disable-next-line prefer-rest-params
              w.dataLayer!.push(arguments);
            };
            w.gtag("consent", "default", {
              analytics_storage: "granted",
              ad_storage: "denied",
              ad_user_data: "denied",
              ad_personalization: "denied",
            });
            w.gtag("js", new Date());
            w.gtag("config", measurementId, {
              send_page_view: false,
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
              page_location: `${window.location.origin}${path}`,
              page_referrer: safeReferrer(),
            });
            setLoaded(true);
          }}
        />
      )}
      {(consent === null || preferencesOpen) && (
        <section
          className="analytics-notice"
          aria-label="Analytics preferences"
        >
          <p>
            Help us understand what’s useful. May we use optional analytics
            cookies? Your form answers stay private.{" "}
            <Link href="/privacy">Privacy details</Link>
          </p>
          <div>
            <button
              ref={firstChoice}
              type="button"
              onClick={() => choose("denied")}
            >
              No thanks
            </button>
            <button type="button" onClick={() => choose("granted")}>
              Allow analytics
            </button>
          </div>
        </section>
      )}
    </>
  );
}

function safeReferrer(): string {
  try {
    return document.referrer ? new URL(document.referrer).origin : "";
  } catch {
    return "";
  }
}

function clearAnalyticsCookies() {
  for (const entry of document.cookie.split(";")) {
    const name = entry.trim().split("=")[0];
    if (name === "_ga" || name.startsWith("_ga_")) {
      for (const domain of ["", window.location.hostname, ".greenarccommune.com"])
        document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ""}`;
    }
  }
}
