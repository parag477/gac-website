import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { publicPages } from "@/lib/public-pages";
import { siteModifiedDate } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages.map((page) => ({
    url: new URL(page.path, site.url).href,
    lastModified: new Date(siteModifiedDate),
    changeFrequency: page.path === "/" ? "weekly" : "monthly",
    priority: page.path === "/" ? 1.0 : page.path === "/programmes/strategy-master" ? 0.9 : 0.8,
  }));
}
