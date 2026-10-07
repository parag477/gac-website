import type { Metadata, Viewport } from "next";
import "@fontsource-variable/dm-sans";
import "@fontsource/cormorant-garamond/500-italic.css";
import "./globals.css";
import { site } from "@/lib/content";
import { Header, Footer } from "@/components/site-shell";
import { homeDescription, homeTitle, siteIndexable } from "@/lib/seo";
import { Analytics } from "@/components/analytics";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${homeTitle} | ${site.name}`,
    template: "%s | Green Arc Commune",
  },
  description: homeDescription,
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    ...(process.env.BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
      : {}),
  },
  robots: { index: siteIndexable, follow: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title: "Green Arc Commune",
    description: homeDescription,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#173c30" };
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer analyticsEnabled={siteIndexable} />
        {siteIndexable && (
          <Analytics
            measurementId={
              process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-HNQPN4JFE7"
            }
          />
        )}
      </body>
    </html>
  );
}
