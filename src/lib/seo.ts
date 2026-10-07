import type { Metadata } from "next";
import { site } from "@/lib/content";
import { isSiteIndexable } from "@/lib/site-config";

export const siteIndexable = isSiteIndexable(process.env);
export const homeTitle = "Gold Trading Education & Mentorship";
export const homeDescription =
  "Learn about gold/XAUUSD with Shubham Soni. Explore live mentorship, individual guidance and the Strategy Master Program at Green Arc Commune.";

// Content publication date for freshness signals.
// Update when substantive page content changes.
export const sitePublishedDate = "2026-10-07";
export const siteModifiedDate = "2026-10-07";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = new URL(path, site.url).href;
  const fullTitle = `${title} | ${site.name}`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: site.name,
      title: fullTitle,
      description,
      url,
      images: [
        {
          url: `${site.url}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Green Arc Commune - Gold trading education with Shubham Soni",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${site.url}/opengraph-image`],
    },
  };
}

// These fragment URLs correspond to existing homepage sections.
export const organisationId = `${site.url}/#commune`;
export const founderId = `${site.url}/#founder`;
export const websiteId = `${site.url}/`;

export function breadcrumbGraph(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, site.url).href,
    })),
  };
}

export function webPageGraph(
  path: string,
  name: string,
  description: string,
  dates?: { datePublished?: string; dateModified?: string },
) {
  return {
    "@type": "WebPage",
    "@id": new URL(path, site.url).href,
    url: new URL(path, site.url).href,
    name,
    description,
    inLanguage: "en-IN",
    isPartOf: { "@id": websiteId },
    publisher: { "@id": organisationId },
    ...(dates?.datePublished ? { datePublished: dates.datePublished } : {}),
    ...(dates?.dateModified ? { dateModified: dates.dateModified } : {}),
  };
}

/** FAQPage structured data — +40% GEO visibility per Princeton research. */
export function faqPageGraph(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** VideoObject structured data for video search discovery. */
export function videoObjectGraph(opts: {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl?: string;
  uploadDate?: string;
  duration?: string;
}) {
  return {
    "@type": "VideoObject",
    name: opts.name,
    description: opts.description,
    thumbnailUrl: new URL(opts.thumbnailUrl, site.url).href,
    ...(opts.contentUrl
      ? { contentUrl: new URL(opts.contentUrl, site.url).href }
      : {}),
    ...(opts.uploadDate ? { uploadDate: opts.uploadDate } : {}),
    ...(opts.duration ? { duration: opts.duration } : {}),
  };
}

export function organisationGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": organisationId,
        name: site.name,
        legalName: site.name,
        url: `${site.url}/`,
        email: site.email,
        description:
          "Gold/XAUUSD trading education, mentorship and community with Shubham Soni.",
        logo: {
          "@type": "ImageObject",
          url: `${site.url}/images/green-arc-logo.png`,
        },
        founder: { "@id": founderId },
        foundingDate: "2019",
        sameAs: [site.instagram, site.whatsapp, site.youtube].filter(Boolean),
      },
      {
        "@type": "Person",
        "@id": founderId,
        name: "Shubham Soni",
        url: `${site.url}/about/shubham-soni`,
        image: `${site.url}/images/shubham-soni.jpg`,
        jobTitle: "Founder, Trader and Educator",
        description:
          "Founder of Green Arc Commune with 7+ years of trading experience and expertise in gold trading.",
        worksFor: { "@id": organisationId },
        knowsAbout: [
          "Gold Trading",
          "XAUUSD",
          "Trading Education",
          "Risk Management",
          "Market Analysis",
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: site.name,
        url: `${site.url}/`,
        publisher: { "@id": organisationId },
        inLanguage: "en-IN",
      },
    ],
  };
}
