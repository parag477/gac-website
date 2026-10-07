import test from "node:test";
import assert from "node:assert/strict";
import {
  analyticsPath,
  analyticsProgramme,
  trackEvent,
} from "../src/lib/analytics.ts";

test("analytics excludes private paths, queries, unknown content and arbitrary programme values", () => {
  assert.equal(
    analyticsPath("/programmes/strategy-master"),
    "/programmes/strategy-master",
  );
  for (const path of [
    "/admin",
    "/admin?q=someone@example.com",
    "/api/enquiries",
    "/?email=someone@example.com",
    "/unknown-personal-value",
  ]) {
    assert.equal(analyticsPath(path), null);
  }
  assert.equal(analyticsProgramme("strategy-master"), "strategy-master");
  assert.equal(analyticsProgramme("person@example.com"), "help-me-choose");
  assert.doesNotThrow(() => trackEvent("generate_lead", "strategy-master"));
});

test("events require consent, exclude admin activity and only contain approved dimensions", () => {
  const calls: unknown[][] = [];
  const fakeWindow = {
    location: { pathname: "/", origin: "https://www.greenarccommune.com" },
    gacAnalyticsAllowed: false,
    gtag: (...args: unknown[]) => calls.push(args),
  };
  Object.defineProperty(globalThis, "window", {
    value: fakeWindow,
    configurable: true,
  });
  try {
    trackEvent("generate_lead", "strategy-master");
    assert.equal(calls.length, 0);
    fakeWindow.gacAnalyticsAllowed = true;
    trackEvent("generate_lead", "person@example.com");
    assert.deepEqual(calls, [
      [
        "event",
        "generate_lead",
        {
          programme: "help-me-choose",
          page_path: "/",
          page_location: "https://www.greenarccommune.com/",
        },
      ],
    ]);
    fakeWindow.location.pathname = "/admin";
    trackEvent("inquiry_start", "strategy-master");
    assert.equal(calls.length, 1);
  } finally {
    Reflect.deleteProperty(globalThis, "window");
  }
});
