import type { Metadata, Viewport } from "next";
import "@fontsource-variable/dm-sans";
import "@fontsource/cormorant-garamond/500-italic.css";
import "./globals.css";
import { site } from "@/lib/content";
import { Header, Footer } from "@/components/site-shell";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Green Arc Commune — Learn the market. Grow together.",
    template: "%s | Green Arc Commune",
  },
  description:
    "Trading education with Shubham Soni. Explore live learning, cohort mentorship, one-to-one guidance and algorithmic tools at Green Arc Commune.",
  robots: { index: process.env.SITE_INDEXABLE === "true", follow: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title: "Green Arc Commune",
    description: "Learn the market. Build your process. Grow together.",
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
        <Footer />
      </body>
    </html>
  );
}
