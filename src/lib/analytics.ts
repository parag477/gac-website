import { publicPages } from "./public-pages.ts";
export const analyticsPreferenceKey = "gac-analytics-consent";
export type AnalyticsEvent =
  "programme_select" | "inquiry_start" | "generate_lead" | "whatsapp_click";

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  gacAnalyticsAllowed?: boolean;
};

export function analyticsWindow(): AnalyticsWindow {
  return window as AnalyticsWindow;
}

const publicPaths = new Set<string>([
  ...publicPages.map((page) => page.path),
  "/privacy",
  "/terms",
]);
export function analyticsPath(pathname: string): string | null {
  // No query strings, inquiry messages, unknown paths or admin URLs enter analytics.
  return publicPaths.has(pathname) ? pathname : null;
}

export function analyticsProgramme(value: unknown): string {
  return [
    "live-mentorship",
    "individual-mentorship",
    "strategy-master",
    "help-me-choose",
  ].includes(String(value))
    ? String(value)
    : "help-me-choose";
}

export function trackEvent(
  event: AnalyticsEvent,
  programme: string,
  destination?: "support" | "community",
) {
  if (typeof window === "undefined") return;
  const w = analyticsWindow();
  const path = analyticsPath(window.location.pathname);
  if (!w.gacAnalyticsAllowed || !w.gtag || !path) return;
  w.gtag("event", event, {
    programme: analyticsProgramme(programme),
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    ...(destination ? { destination } : {}),
  });
}
