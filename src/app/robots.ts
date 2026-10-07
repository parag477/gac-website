import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { siteIndexable } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(siteIndexable
        ? { allow: "/", disallow: "/api/" }
        : { disallow: "/" }),
    },
    ...(siteIndexable ? { sitemap: `${site.url}/sitemap.xml` } : {}),
  };
}
