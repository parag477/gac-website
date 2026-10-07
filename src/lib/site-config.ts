export const productionOrigin = "https://www.greenarccommune.com";

export function canonicalOrigin(configured?: string): string {
  if (!configured) return productionOrigin;
  const url = new URL(configured);
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin.");
  if (["greenarccommune.com", "www.greenarccommune.com"].includes(url.hostname))
    return productionOrigin;
  return url.origin;
}

type IndexingEnvironment = {
  VERCEL_ENV?: string;
  SITE_INDEXABLE?: string;
  NODE_ENV?: string;
};

// A copied production flag must never make a Vercel preview indexable.
export function isSiteIndexable(env: IndexingEnvironment): boolean {
  if (env.VERCEL_ENV && env.VERCEL_ENV !== "production") return false;
  if (env.NODE_ENV === "development" || env.NODE_ENV === "test") return false;
  if (env.SITE_INDEXABLE !== undefined) return env.SITE_INDEXABLE === "true";
  return env.VERCEL_ENV === "production";
}
