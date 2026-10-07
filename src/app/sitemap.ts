import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { publicPages } from "@/lib/public-pages";
export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages.map((page) => ({
    url: new URL(page.path, site.url).href,
  }));
}
