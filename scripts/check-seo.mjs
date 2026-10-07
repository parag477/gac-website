import assert from "node:assert/strict";

const base = process.argv[2] || "http://127.0.0.1:3101";
const expectIndexable = !process.argv.includes("--preview");
const origin = "https://www.greenarccommune.com";
const cache = new Map();
const decode = (s) => s.replaceAll("&amp;", "&").replaceAll("&#x27;", "'");
async function page(path) {
  if (!cache.has(path)) cache.set(path, (async () => {
    const response = await fetch(new URL(path, base));
    return { response, text: await response.text() };
  })());
  return cache.get(path);
}
async function checkLink(value, source) {
  const url = new URL(decode(value), origin);
  if (url.origin !== origin) return;
  const { response, text } = await page(url.pathname + url.search);
  assert.equal(response.status, 200, `${source}: broken link ${value}`);
  if (url.hash && response.headers.get("content-type")?.includes("text/html")) {
    const ids = [...text.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.ok(ids.includes(decodeURIComponent(url.hash.slice(1))), `${source}: missing anchor ${value}`);
  }
}
const sitemap = await page("/sitemap.xml");
assert.equal(sitemap.response.status, 200);
const urls = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => decode(m[1]));
assert.equal(urls.length, new Set(urls).size, "duplicate sitemap URLs");
for (const path of ["/", "/programmes", "/programmes/strategy-master", "/about/shubham-soni", "/stories/member-story"])
  assert.ok(urls.includes(`${origin}${path}`), `sitemap missing ${path}`);
for (const url of urls) {
  assert.equal(new URL(url).origin, origin, "sitemap host");
  const path = new URL(url).pathname;
  assert.ok(!path.startsWith("/admin") && !path.startsWith("/api"));
  const { response, text: html } = await page(path);
  assert.equal(response.status, 200, `${path}: status`);
  const robots = html.match(/<meta name="robots" content="([^"]+)"/g) || [];
  assert.ok(robots.length, `${path}: robots missing`);
  assert.equal(robots.some(tag => tag.includes("noindex")), !expectIndexable, `${path}: indexing`);
  for (const [label, pattern] of [["canonical", /<link rel="canonical" href="([^"]+)"/], ["social URL", /<meta property="og:url" content="([^"]+)"/]])
    assert.equal(new URL(html.match(pattern)?.[1]).href, url, `${path}: ${label}`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path}: h1`);
  assert.ok(!html.includes("support@greenarc.com"), `${path}: old email`);
  assert.ok(response.headers.get("link")?.includes("/llms.txt"), `${path}: AI discovery header`);
  const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
  const ids = [...visible.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, new Set(ids).size, `${path}: duplicate DOM IDs`);
  for (const m of visible.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) await checkLink(m[1], path);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  assert.ok(schemas.length, `${path}: JSON-LD missing`);
  async function walk(value) {
    if (!value || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      if (["@id", "url", "item"].includes(key) && typeof child === "string" && child.startsWith(origin)) await checkLink(child, `${path} JSON-LD`);
      else if (typeof child === "object") await walk(child);
    }
  }
  for (const schema of schemas) await walk(schema);
  console.log(`PASS ${path}: metadata, indexing, schema URLs, DOM anchors and internal links`);
}
const robots = await page("/robots.txt");
assert.equal(robots.response.status, 200);
assert.ok(robots.response.headers.get("content-type")?.includes("text/plain"));
assert.equal(/^Disallow: \/$/m.test(robots.text), !expectIndexable, "robots crawl policy");
if (expectIndexable) assert.ok(robots.text.includes(`Sitemap: ${origin}/sitemap.xml`));
for (const path of ["/llms.txt", "/llms-full.txt"]) {
  const { response, text } = await page(path);
  assert.equal(response.status, 200);
  assert.ok(response.headers.get("content-type")?.includes("text/plain"));
  assert.ok(text.startsWith("# Green Arc Commune"));
  assert.equal(response.headers.get("x-robots-tag")?.includes("noindex") || false, !expectIndexable);
  for (const m of text.matchAll(/\]\(([^)]+)\)/g)) await checkLink(m[1], path);
  if (path === "/llms-full.txt") {
    assert.ok(text.includes("Hindi"));
    assert.ok(text.includes("₹3,999"));
  }
}
for (const [slug, code, location] of [
  ["mastery",308,"/programmes/strategy-master"],
  ["live-room",308,"/?programme=live-mentorship#contact"],
  ["individual",308,"/?programme=individual-mentorship#contact"],
  ["live-mentorship",307,"/?programme=live-mentorship#contact"],
  ["individual-mentorship",307,"/?programme=individual-mentorship#contact"],
  ["algo-core",307,"/#programmes"],
]) {
  const r = await fetch(new URL(`/programmes/${slug}`, base), {redirect:"manual"});
  assert.equal(r.status, code, slug);
  assert.equal(r.headers.get("location"), location, slug);
}
assert.equal((await page("/seo-check-missing-page")).response.status,404);
const api = (await page("/api/enquiries")).response;
assert.equal(api.status,405);
assert.equal(api.headers.get("x-robots-tag"),"noindex, nofollow");
const admin = (await page("/admin")).response;
assert.equal(admin.headers.get("x-robots-tag"),"noindex, nofollow");
console.log(`PASS ${urls.length} public pages; crawler files, AI links, six redirects, 404, and private route headers`);
