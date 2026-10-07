import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/programmes/mastery",
        destination: "/programmes/strategy-master",
        permanent: true,
      },
      {
        source: "/programmes/live-room",
        destination: "/?programme=live-mentorship#contact",
        permanent: true,
      },
      {
        source: "/programmes/individual",
        destination: "/?programme=individual-mentorship#contact",
        permanent: true,
      },
      {
        source: "/programmes/live-mentorship",
        destination: "/?programme=live-mentorship#contact",
        permanent: false,
      },
      {
        source: "/programmes/individual-mentorship",
        destination: "/?programme=individual-mentorship#contact",
        permanent: false,
      },
      {
        source: "/programmes/algo-core",
        destination: "/#programmes",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      // Security headers for all pages.
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      // AI discovery headers for public pages.
      ...[
        "/",
        "/programmes",
        "/programmes/strategy-master",
        "/about/shubham-soni",
        "/stories/member-story",
        "/privacy",
        "/terms",
      ].map((source) => ({
        source,
        headers: [{ key: "Link", value: '</llms.txt>; rel="describedby"' }],
      })),
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};
export default config;
