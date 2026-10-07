import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { siteIndexable } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!siteIndexable) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [
      // Default: allow public discovery, block private routes.
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      // AI search-discovery bots — explicitly welcome.
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "Claude-SearchBot",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "Perplexity-User",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: "Claude-User",
        allow: "/",
        disallow: "/api/",
      },
      // Training-only bots — block model training, not search discovery.
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "Google-Extended",
        disallow: "/",
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
