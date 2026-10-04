import type { MetadataRoute } from "next";
import { programmes, site } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, priority: 1 },
    ...programmes
      .filter((p) => p.kind === "page")
      .map((p) => ({
        url: `${site.url}/programmes/${p.slug}`,
        priority: 0.8,
      })),
  ];
}
