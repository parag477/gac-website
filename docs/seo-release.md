# SEO / GEO / AEO implementation audit — 7 October 2026

Implemented locally; not pushed or deployed. The strategic plan remains in `seo-geo-aeo-plan.md`. This audit extends the earlier foundation with connected public content, AI-readable endpoints, verified entity anchors, confirmed offer data and automated route/link checks. Search inclusion, citations and field performance still require deployed/account evidence.

## Included

- Shared production/preview indexing policy. Production on Vercel defaults to indexable; explicit `SITE_INDEXABLE=false` is respected. Preview and Development cannot be made indexable by copying `SITE_INDEXABLE=true`.
- Canonicals, sitemap, metadata and entity URLs use the live `www` host. A legacy apex `NEXT_PUBLIC_SITE_URL` is normalised automatically. Root URL slash serialisation is equivalent and normalised in the smoke checks.
- Gold/XAUUSD-focused search descriptions and titles, route-specific social metadata, updated share image.
- Organisation, founder and website entity graph, plus Strategy Master WebPage/Course markup. The owner-confirmed ₹3,999 Strategy Master webinar-subscriber offer and Hindi teaching language are visible and represented in Course/Offer data. No invented ratings, awards, deadlines or accreditation. Course markup is semantic; it does not guarantee a rich result.
- Permanent redirects for the three known legacy programme URLs, with existing inquiry selection behavior preserved. Current inquiry routes and Coming Soon redirect temporarily. Unknown pages still return 404.
- Admin and API noindex response headers; admin authentication unchanged. Admin is not blocked by robots so crawlers can see its noindex response. APIs are excluded from crawling.
- Owner-confirmed `support@greenarccommune.com` in contact content, privacy text and organisation schema.
- Two factual FAQs and gold/XAUUSD context in the existing homepage copy. Hero wording, images, card layout and section order remain intact.
- Consent-based GA4 integration for owner property `G-HNQPN4JFE7`, optional environment override, footer preferences, and an accurate analytics paragraph on the existing privacy page.
- `page_view`, `programme_select`, `inquiry_start`, `generate_lead` and `whatsapp_click`. The lead event runs only after the enquiry API acknowledges persistence. Admin/unknown paths and free-form input are excluded by the custom event helper.

## Vercel settings and deployment

In **Production** environment settings:

```text
NEXT_PUBLIC_SITE_URL=https://www.greenarccommune.com
SITE_INDEXABLE=true
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-HNQPN4JFE7
```

The URL and measurement ID already have correct defaults. An old `SITE_INDEXABLE=false` must be removed or changed; this release deliberately respects an explicit indexing pause. Redeploy after environment changes because marketing pages and robots metadata are built statically.

Keep the existing apex → www Vercel redirect. Preview deployments remain noindex through the environment guard. Do not promote an old preview artifact with baked-in metadata and assume its indexing changes automatically; build the Production deployment in its intended environment.

## Required GA4 property setup

In the Web data stream for `G-HNQPN4JFE7`:

1. Set its website URL to `https://www.greenarccommune.com`.
2. **Turn off Enhanced Measurement** for this integration. Page views, relevant clicks and form success are manually instrumented. Google notes that history-based automatic page views can still run when `send_page_view:false` is set; account configuration must disable them. Automatic form/outbound events are also unnecessary here. [Google pageview guidance](https://developers.google.com/analytics/devguides/collection/ga4/views)
3. Mark `generate_lead` as a key event. Keep `whatsapp_click` separate: it represents intent, not a saved inquiry or confirmed conversation.
4. If needed, register event-scoped custom dimensions `programme` and `destination`. Decide data retention and document the actual setting in the final policy.
5. After deployment, allow analytics in a test browser and verify one page view per navigation and one lead event after a successful test enquiry in Realtime/DebugView. Check denied consent sends no Google tag requests. Do not infer delivery from a local dataLayer alone.

The code does not send form values, database IDs, arbitrary URLs or query strings as custom event dimensions. Page locations are sanitised and referrers reduced to origins. Advertising consent stays denied. Automatic Google behavior also depends on the property settings above, which have not been changed or verified from this workspace. Campaign UTM attribution is not implemented in this release; adding it requires a deliberate allowlist/privacy review rather than copying arbitrary URL parameters.

The consent UI uses basic opt-in loading: no Google script before acceptance. Browser preferences can be changed in the footer. Declining disables subsequent collection and clears accessible GA cookies. This does not erase previously collected data. See [Google consent documentation](https://developers.google.com/tag-platform/security/guides/consent).

## Search Console and Bing

Verify ownership as planned, then submit `https://www.greenarccommune.com/sitemap.xml`. Inspect the homepage and Strategy Master after deployment and confirm crawling/indexing is allowed and the selected canonical agrees with `www`. Check old URLs and links before adding further migration redirects. Do not promise immediate indexing or use sitemap submission as proof of inclusion.

## Validation

Verified locally on 7 October 2026: lint, TypeScript, all 11 tests and the production build passed. The HTTP smoke check passed against both production-mode port 3101 and development port 3100, including their different indexing policies. Desktop/mobile browser checks confirmed the uncropped Strategy Master image, no Google script before/after declining consent, preference reopening, and Live → Individual → Live selection updates. No real GA4 lead was sent during verification.

Commands:

```sh
npm run lint
npm run typecheck
npm test
SITE_INDEXABLE=true VERCEL_ENV=production npm run build
# Start on an unused port with a dedicated test database if testing submissions.
npm run start -- --port 3101
node scripts/check-seo.mjs http://127.0.0.1:3101
# Existing development server:
node scripts/check-seo.mjs http://127.0.0.1:3100 --preview
```

The HTTP smoke check covers status, indexing tags, canonical and social URLs, JSON-LD parsing, one primary heading, updated email, robots, sitemap inventory, a permanent legacy redirect, genuine 404 and noindex API response. Unit tests cover production/preview indexing, canonical normalisation and analytics consent/path/parameter filtering alongside existing persistence/authentication tests.

Browser verification checks the existing Strategy Master layout, mobile preference controls, decline/reopen behavior, and repeated homepage programme selections. GA4 account receipt, Google Rich Results Test, field Core Web Vitals, Search Console and Bing indexing require deployment/account verification; none is claimed from the local build.

## Re-audit changes

- Founder and organisation identifiers now resolve to actual `/#founder` and `/#commune` sections. Schema entity identifiers do not technically require DOM anchors, but the requested convention is now enforced. Course and offer URLs resolve to `#curriculum` and `#offer` on Strategy Master.
- Added human-readable `/programmes`, `/about/shubham-soni`, and `/stories/member-story` pages. They use existing shared facts, owner photos/video, unique metadata, visible breadcrumbs and matching schema. Footer and contextual links make them discoverable. No city-page or keyword-combination spam was generated.
- Expanded sitemap to five canonical, indexable public pages. Draft policies and private/redirecting routes remain excluded. No fabricated modification dates.
- Added `/llms.txt` and `/llms-full.txt` as static text route responses generated from shared visible content. They include current programmes, founder, official channels, Hindi teaching, offer eligibility, FAQs and historical-review context. Public page `Link` headers point to `/llms.txt`. These are real HTTP files even though Next.js generates them rather than storing duplicate copies under `public/`.
- Existing `/robots.txt` remains a Next.js metadata route. It allows production public crawling and disallows API crawling; previews block crawling. A wildcard rule covers AI user agents too. No rule is advertised as overriding a crawler’s own policies.
- Corrected JSON-LD escaping to preserve valid decoded text while preventing script-tag breakout; added a regression test.
- Added shared, visible FAQ answers for Hindi teaching and the ₹3,999 webinar-subscriber offer. Kept English page-language metadata; Course teaching language is `hi`.
- Member video has a dedicated watch page with a server-rendered video source, native controls and no automatic media preload. Its short description is correctly named `description`, not `transcript`. No speaker identity, transcript or upload date was inferred. Video rich-result markup is intentionally withheld until a real publication date and accurate transcript/captions are available.
- Added context that older reviews may mention historical programme names or former staff. Quotes themselves remain intact.
- Analytics now supplies sanitized page locations on custom events, handles cross-tab denial and avoids duplicate tag initialization. Comparison-page programme selections are tracked through the existing allowlisted helper.

## Final verification

Lint, TypeScript, 11 tests, and the production build pass. The expanded HTTP audit verifies all five public pages: status, index policy, canonical/OG URLs, single H1, duplicate IDs, schema URL/anchor resolution, internal links, discovery headers, crawler text responses, sitemap inventory, all six redirects, true 404, and admin/API noindex headers. Production and development policies are checked separately.

Desktop programme comparison and mobile founder/member-video/Strategy Master layouts were inspected in the browser. Mobile founder, video and strategy pages had no horizontal overflow at a 390px viewport. The strategy poster remains uncropped. The browser had no Google tag script under denied consent. The previously validated inquiry selection and submission workflows were preserved; the expanded audit does not submit real enquiries or send GA lead events.

Performance evidence is limited to the implementation and browser rendering, not a performance trace. Public marketing pages are prerendered; fonts are self-hosted; the new video uses `preload="none"`; images use existing responsive handling. No Lighthouse/DevTools trace tool was available in this session, and no Core Web Vitals score or estimated speed improvement is claimed. Measure the deployed site using PageSpeed Insights/Search Console and prioritize actual LCP, INP and CLS failures before further visual changes.

## Owner and account dependencies

1. **Deployment/indexing:** deploy these changes. Remove an old production `SITE_INDEXABLE=false` or set it to `true`, then build/redeploy. On the previous live inspection, production was still noindex with crawling blocked. Source fixes alone cannot change an existing deployment.
2. **Search accounts:** verify Search Console and Bing, submit the sitemap and inspect the five pages. Optional `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` environment variables support meta-tag verification. DNS verification can be used instead. No verification tokens were supplied.
3. **Analytics:** complete the GA4 property settings above and verify actual event receipt. Do not claim successful delivery based only on local tests.
4. **Policy content:** legal name Green Arc Commune is confirmed. Proposed refund terms are in `refund-policy-draft.md`, awaiting approval. Programme durations/schedules, recording access and inquiry/analytics retention are not confirmed. Existing legal pages remain explicitly draft/noindex until these facts and business terms are settled. No refund route is advertised before it exists.
5. **Original evidence:** supply accurate video captions/transcript and publication date; replace remaining illustrative stock photographs as desired. No new stock images were added. Founder and watch pages reuse owner-supplied assets. Existing image provenance is recorded in `public/images/SOURCES.md` where available.
6. **Ongoing editorial work:** original, reviewed lessons and credible third-party references require real expertise and publication work. This release does not manufacture case studies, legal permissions, credentials, rankings or AI citations. The programmatic SEO skill was used to assess scalable page opportunities; thin keyword permutations are not useful pages.

## Source guidance

- [Google AI search guidance](https://developers.google.com/search/docs/appearance/ai-features): standard search eligibility and helpful public content remain central; no special AI file guarantees inclusion.
- [llms.txt proposal](https://llmstxt.org/): curated Markdown discovery; an optional convention, not a universal engine requirement. `llms-full.txt` supplements it with shared public facts.
- [Google structured-data guidance](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data): markup must represent actual page content; eligibility does not guarantee display.
- [Google video guidance](https://developers.google.com/search/docs/appearance/video): a dedicated accessible watch page improves discoverability; incomplete/fabricated metadata is not a substitute for accurate source details.

No external account changes, outreach, DNS edits, Git push or deployment were performed.
