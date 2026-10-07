# Green Arc Commune: SEO, GEO and AEO plan

Prepared 6 October 2026. Status: proposed strategy for review; no website changes or deployment made.

## 1. Objective and agreed scope

Help India-based gold/XAUUSD learners discover Green Arc Commune, understand Shubham Soni’s teaching, choose an appropriate programme, and submit a qualified inquiry or contact support on WhatsApp. Website content will be in English. The owner will set up Google Search Console, Google Analytics and Bing Webmaster Tools.

This is a site-wide planning exercise. It covers technical discovery, on-page content, reputation, search intent, AI answers, measurement and a controlled programmatic publishing process. Implementation follows review of this plan.

Success means relevant discovery and qualified inquiries, alongside accurate descriptions of the business in search and AI answers. Traffic, rankings and citations are supporting measures. We cannot promise rankings, indexing, AI recommendations or a fixed number of leads.

Preserve the approved visual direction: the mountain/chart hero, “Find your gold / perspective.” typography, storytelling section order, existing image card and uncropped Strategy Master image. Preserve the primary programme actions: Live and Individual select the inquiry form; Strategy Master opens its page and contacts support on WhatsApp; Algo Core stays noninteractive and Coming Soon. SEO content additions should be designed around these constraints.

## 2. What the audit actually found

Evidence combines repository inspection and direct public HTTP requests on 6 October 2026. The web search reader returned an older homepage, while direct HTTPS requests returned the current Next.js website. The findings below use the direct responses for deployment status. An initial Python certificate-store problem was bypassed by using the system curl client with normal certificate verification; it is not evidence of a website certificate defect.

| Priority | Finding | Evidence | Planned resolution |
|---|---|---|---|
| P0 | Live marketing pages request exclusion from search | Homepage and `/programmes/strategy-master` return `noindex, follow` | Enable production indexing and verify deployed HTML and headers |
| P0 | Live crawling is blocked site-wide | `/robots.txt` returns `User-Agent: *` and `Disallow: /` | Permit public discovery; maintain private-route protections separately |
| P0 | Conflicting preferred host signals | Apex redirects with 308 to `https://www.greenarccommune.com/`; canonical links and sitemap use the apex | Standardise on the current final `www` host unless historical Search Console evidence justifies another choice |
| P1 | Public legal content still describes a prototype | `/privacy` is live with “Development preview”; both legal source files contain pending-policy copy | Publish owner-approved business policies and accurate data handling information |
| P1 | Metadata does not reflect the current offer | Root description advertises cohort mentorship and algorithmic tools; Algo Core is unavailable | Rewrite around gold/XAUUSD education and active mentorship; keep Algo availability explicit |
| P1 | Main offer details are embedded in an image | Strategy Master poster shows live sessions, recordings and a ₹3,999 webinar offer, while adjacent HTML says to ask about fees | Confirm current terms, then present essential information in readable HTML within the existing page design |
| P1 | Business identity needs consistency checks | `site.email` is `support@greenarc.com`; website domain differs | Owner confirms the correct public mailbox; use consistently across site and profiles |
| P1 | Reviews retain historical context | Reviews mention Mastery, Live Room, Anunay and Algo Core despite current programme/team changes | Preserve genuine quotations; confirm dates and attribution, clarify historical context where needed |
| P1 | Video is difficult to discover independently | Player/source appear only after selecting a story; supplied “transcript” is a one-sentence description and no captions file is assigned | Produce an accurate transcript/captions and decide whether a dedicated, useful story page is warranted |
| P1 | No analytics integration found in inspected source | No GA/gtag integration found; owner says accounts will be set up | Add agreed measurement after properties are available |
| P2 | Search coverage is small | Sitemap contains homepage and Strategy Master only | Build focused information pages after facts and intent are validated |
| P2 | Social previews are generic | Strategy page inherits homepage Open Graph title/description | Add route-specific social metadata with canonical URLs |

Existing strengths: server-rendered marketing copy, homepage and programme canonical tags, an XML sitemap, an EducationalOrganization JSON-LD block, founder attribution, descriptive image alternatives, native FAQ disclosure elements and dedicated admin noindex. A deliberately missing public path returned HTTP 404. The live legacy `/programmes/mastery` ultimately reaches Strategy Master; inspect the intermediate status before deciding whether to make it permanent.

The source controls indexing with `SITE_INDEXABLE === "true"` in `src/app/layout.tsx` and `src/app/robots.ts`. Public responses confirm the resulting blockage, but do not expose the exact production environment setting. Inspect Vercel configuration rather than assuming the environment variable is absent.

Not measured yet: Search Console coverage/history, keyword search volumes, backlink profile, Core Web Vitals field data, conversion rate, or repeatable AI citation rates. This report does not invent scores or treat search-tool results as an India-localised rank tracker.

## 3. Strategic choices

| Approach | Benefit | Limitation | Decision |
|---|---|---|---|
| Technical repair only | Fastest way to remove current discovery barriers | Two sparse marketing URLs offer limited search coverage | Necessary first release, insufficient alone |
| Technical repair + focused educational authority | Connects discovery, useful answers, founder credibility and programme selection | Needs owner input and ongoing editorial work | Recommended |
| Large-scale templated publishing immediately | Produces many URLs quickly | No verified original dataset; risks repetitive, weak pages and inaccurate financial content | Defer; use a small quality-gated pilot instead |

Positioning proposal: **Gold/XAUUSD education with Shubham Soni, built around market understanding, risk awareness, practice and community.** Confirm that this accurately describes all active programmes before using it broadly. Do not turn “7+ years” into a invented start date, credential, performance record or regulatory status.

## 4. Phase 1 — restore discovery and establish measurement

### Indexing and canonical configuration

1. Inspect Vercel Production and Preview environment scopes. Set the production indexing flag deliberately, redeploy and inspect the resulting responses. Preview deployments remain noindex and should use Vercel access protection where appropriate.
2. Use `https://www.greenarccommune.com` consistently in `NEXT_PUBLIC_SITE_URL`, canonical links, sitemap entries, organisation IDs, Open Graph URLs and public links. The current redirect is the reason for this recommendation, not a preference for `www` in general.
3. Check HTTPS, apex/www and trailing-slash variants. Avoid redirect chains and conflicting canonicals. Query-string inquiry selection and campaign URLs should canonicalise to the clean homepage.
4. Publish crawlable robots rules for public pages. Do not block a URL merely to hide its noindex tag: crawlers need access to read that directive. Admin stays authenticated and noindex; sensitive API responses stay private and out of sitemaps. Robots is not access control.
5. Keep only canonical, public, indexable, successful URLs in the sitemap. Do not include inquiry redirects, Algo Core, admin, APIs, query variants or draft articles. Add actual content modification dates when available, never a fresh date on every build. Legal pages can be added once final and intentionally indexable.
6. Inventory old URLs from the previous sitemap, Search Console, logs and known links. Map genuine equivalents individually with permanent redirects. Preserve unknown-page 404s; use 410 only for deliberately removed resources when appropriate. Do not send every old page to the homepage.

Canonical, redirect and sitemap signals should agree. See [Google’s canonicalisation guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

### Owner account setup and access

| Property | Owner action | Implementation/verification |
|---|---|---|
| Search Console | Verify a Domain property through DNS | Submit canonical sitemap; inspect homepage and Strategy Master; record selected canonical and indexability |
| Google Analytics | Create GA4 property and Web data stream | Supply measurement ID, configure privacy settings, install once and verify events |
| Bing Webmaster Tools | Verify domain or use its supported Search Console import | Submit sitemap and inspect crawl/indexing feedback |

Use invitations or scoped access when assistance is needed; do not paste passwords into project files. Analytics consent and policy text must reflect the actual implementation and applicable requirements.

Track `programme_select`, `inquiry_start`, successful inquiry submission and `whatsapp_click`, with programme identifier and page path. Mark the persisted inquiry success as the primary key event. Fire it only after the backend reports a successful save, not on button click. Treat WhatsApp clicks as contact intent, not confirmed conversations or sales. Exclude names, emails and message contents from analytics; prevent duplicate events on rerender/retry. Preserve campaign attribution without allowing PII into URLs.

Acceptance: live public pages are crawlable and lack noindex; canonical URLs resolve directly to 200; sitemap contains only eligible URLs; private content remains inaccessible; production inquiry selection/submission and WhatsApp actions still work. A URL Inspection “eligible” result is not a guarantee of indexing.

## 5. Phase 2 — technical quality and structured data

### Metadata and content delivery

Create a small shared metadata utility, reusing existing Next.js conventions and reading the installed Next.js documentation before implementation. Give each indexable page a distinct title, description, canonical and social preview. Avoid meta keywords, repeated brand suffixes and hidden keyword blocks.

Suggested copy for review:

| Page | Proposed title | Proposed description |
|---|---|---|
| Home | Gold Trading Education & Mentorship \| Green Arc Commune | Learn about gold/XAUUSD with Shubham Soni. Explore live mentorship, individual guidance and the Strategy Master Program at Green Arc Commune. |
| Strategy Master | Gold Trading Strategy Master Program \| Green Arc Commune | Explore gold-market context, strategy reasoning and risk planning with Shubham Soni. See programme details and contact the team on WhatsApp. |
| Founder, if approved | Shubham Soni — Founder & Trading Educator \| Green Arc Commune | Meet Shubham Soni, founder of Green Arc Commune, and learn about his experience, teaching approach and focus on gold trading education. |

These are editorial drafts, not measured winning variants. Preview for readability and truncation across devices rather than enforcing a supposed exact character limit.

Keep one clear primary heading and a coherent heading hierarchy per page. Preserve the approved hero words; put the useful category explanation in natural visible copy nearby. Ensure core programme descriptions, links and answers exist in the initial HTML, even when animation or JavaScript fails. Decorative charts should not imply live market data.

### Performance and accessibility

Measure both public page types with PageSpeed Insights/Lighthouse on mobile and desktop and examine available field data. Target the established good Core Web Vitals thresholds at the 75th percentile: LCP ≤2.5 seconds, INP ≤200 ms, CLS ≤0.1. Low-traffic pages may lack field data; lab results are diagnostic, not proof of a field pass. [Web Vitals guidance](https://web.dev/articles/vitals)

Inspect the four eager hero image layers, actual LCP element, animation work, font loading, responsive image sizes and mobile network costs. Keep the parallax design while adjusting asset size, loading priorities and reduced-motion behavior as measurements warrant. Reserve media dimensions and avoid layout shifts. The offer PNG is approximately 1.7 MB and the member video 14 MB in the repository; these are optimisation candidates, not measured transfer sizes or proof of poor performance. Preserve legibility and the image’s full aspect ratio. Load video media only when appropriate, using an optimised poster and captions.

Check keyboard focus, accordion semantics, form labels/errors, contrast, mobile overflow and tap targets. Accessibility supports people using the site and machine readability; it is not a substitute for useful content.

### Structured data design

| Page/content | Planned types | Conditions |
|---|---|---|
| Homepage/business identity | Existing EducationalOrganization or appropriate Organization, plus WebSite | Stable `@id`, verified name, logo, URL, public contact and official profiles; no implication of accreditation |
| Founder | Person connected to organisation | Verified role and biography; do not add unsupported awards or credentials |
| Strategy Master | WebPage, BreadcrumbList; Course where semantically accurate | Match visible programme details; Course markup is not a promise of a special search display |
| Educational articles | Article/BlogPosting and BreadcrumbList | Real author, reviewer if applicable, publication/modification dates and sources |
| Dedicated video content | VideoObject | Accessible media/thumbnail, accurate upload date, duration and description; no invented metadata |
| Visible FAQ sections | Optional FAQPage | Lower priority; useful answers come first |

Google retired the FAQ rich result in May 2026 and previously retired its Course info feature. Course list is a distinct feature; check current eligibility before pursuing it. Do not sell FAQ schema as a rich-result or AI-visibility guarantee. [Google documentation updates](https://developers.google.com/search/updates)

Do not manufacture ratings from text testimonials or add self-serving organisation review stars. [Google review guidance](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)

Validate semantic markup with Schema.org Validator and Google-supported features with Rich Results Test. “No rich results detected” is not automatically an error for a valid type without a supported search feature.

## 6. Phase 3 — on-page and nontechnical SEO

### Search intent and page map

The following terms are research hypotheses, not volume estimates. Validate with Search Console as data arrives, an India/English SERP review and, if available, Keyword Planner or a keyword research account. Group synonyms into one useful page rather than creating a page for each wording.

| Intent cluster | Examples | Destination and next action |
|---|---|---|
| Brand | Green Arc Commune, Shubham Soni Green Arc | Homepage; founder information; programme selection |
| Gold education | gold trading education, XAUUSD mentorship | Homepage and proposed programme guide |
| Strategy learning | gold trading strategy course, Strategy Master Program | Existing Strategy Master page → support WhatsApp |
| Learning format | live vs individual trading mentorship | Proposed `/programmes` comparison guide → preselected inquiry |
| Founder trust | Shubham Soni trading educator | Proposed `/about/shubham-soni` → YouTube and programmes |
| Foundations | what is XAUUSD, understanding gold charts | Proposed `/learn` guides → relevant next lesson and programme |
| Practice and review | gold trading journal, how to review a trading plan | Original worksheet/example → related education |

The sampled search results surfaced dedicated gold education pages from [Prasad Kadri](https://prasadkadri.com/xauusd-gold-trading-course), [DiranFX](https://www.diranfx.com/courses/elite-trader-program) and [Forexplain](https://www.forexplain.com/). These are discovery leads for competitor research, not an endorsement of their claims or proof of ranking order in India. A useful next comparison is curriculum specificity, instructor evidence, offer clarity and useful free lessons.

[Anish Singh Thakur](https://www.anishsinghthakur.com/) and [Stock Burner](https://stockburner.in/) remain the owner’s design references. Visual inspiration does not establish that either is the primary search competitor for gold/XAUUSD education.

### Existing page improvements

**Homepage:** retain storytelling and concise copy. State what Green Arc teaches and whom it serves without implying guaranteed outcomes. Use clear programme names, accurate availability and a compact comparison of formats. Improve FAQs using actual learner questions and approved answers. Keep programme descriptions visible rather than accessible only on hover.

**Strategy Master:** retain the image container. Add or refine accessible text covering syllabus, prerequisites, language, format, mentor involvement, schedule, duration, recording access, support and enrollment process. The poster’s ₹3,999 price, ₹14,000 comparison, webinar eligibility, lifetime access and limited seats require owner confirmation before being repeated in HTML or schema. If an offer changes, update the poster and text together. Keep WhatsApp destination `+91 9753574157`.

**Founder:** create a concise, evidence-backed biography with the owner-confirmed 7+ years of experience, teaching approach, real photos and selected original lessons. Verify the time basis of the experience claim and only describe credentials that exist. Do not imply regulated advisory status from the title “educator”.

**Testimonials:** owner-confirmed real reviews remain authentic quotations. Historical programme names and former staff references should receive context rather than silent rewriting. Confirm the Algo Core attribution given that the product is still in development. Obtain appropriate permission for publication; add dates only when known. Distinguish illustrative images from evidence of actual events.

**Video:** transcribe the supplied recording accurately; include human-reviewed English captions/translation as needed, preserving its original meaning. Consider a dedicated story page only if it provides enough context and a genuinely useful viewing experience. Keep the homepage modal. Video search visibility requires more than adding schema to a player opened by a click. [Google video guidance](https://developers.google.com/search/docs/appearance/video)

### Proposed information architecture

Add `/programmes` as a substantive comparison guide and `/about/shubham-soni` as a founder page, subject to content approval. These are additive, not replacements for the existing homepage sections. Do not repurpose `/programmes/live-mentorship` or `/programmes/individual-mentorship` yet: they currently support inquiry redirects. Any later informational detail URLs need a deliberate routing decision while the primary cards retain their required actions.

Add `/learn` with an initial 4–6 substantial resources. Start with:

1. What XAUUSD represents and how to read a gold quote.
2. How to read market context on a gold chart, using an original annotated example.
3. Risk concepts to understand before evaluating a trading strategy.
4. A trading journal worksheet with a completed educational example.
5. How to review a strategy without confusing a historical example with a performance promise.
6. How to choose between live learning, individual mentorship and strategy study.

Gold spot/CFD examples and Indian exchange-traded products must not be presented as interchangeable. Any India-specific legal, broker-access or product-eligibility statements require current primary-source research and qualified review before publication. This plan makes no claims about which trading arrangements are permitted.

Link homepage → programmes/learning hub; guide → appropriate lesson/programme; lesson → prerequisites and next lesson; articles → founder biography. Use descriptive, natural anchor text. Make every indexable article reachable through ordinary links; avoid orphan pages and site-wide keyword-heavy footer lists. Hindi/Hinglish pages can be a later editorial decision, with actual localisation and reciprocal hreflang only when distinct translated pages exist.

### Editorial trust and off-site presence

Financial education needs unusually careful sourcing and clear authorship. Publish original explanations reviewed by Shubham, identify the author/reviewer, distinguish historical illustrations from current observations and link primary sources for factual claims. Use genuine update dates. [Google people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

Maintain a verified business fact sheet: brand name, founder, programme names, available formats, contact details, official profiles and approved descriptions. Apply it to YouTube, Instagram and relevant genuine business profiles. Keep the WhatsApp community and support number distinct.

Turn original lessons into YouTube videos with descriptive titles, reviewed captions, chapters and links back to the matching educational page. Seek relevant guest teaching, interviews and editorial mentions where there is real expertise to contribute. Track earned referring domains and referral leads, not a quota of purchased links. Do not fabricate independent endorsements, seed fake discussions or create a Wikipedia page solely for SEO. Pursue local listings only if the business genuinely meets the platform’s eligibility criteria; no invented offices or city pages.

## 7. GEO and AEO workstream

For this project, AEO means answering actual learner questions clearly; GEO means making verified content easy to discover, understand and cite in generated answers. They share the same content foundation.

Google says its ordinary SEO foundations remain applicable to AI features; pages must be indexed and eligible for a snippet. It does not require a special AI file or schema. AI-feature traffic is included in overall Web performance reporting. [Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features)

Practical work:

- Start educational sections with a direct, self-contained answer, then explanation, example, limitations and sources where useful. Avoid a rigid word count or repetitive question fragments.
- Answer programme-selection questions factually: who it is for, how it works, what is included, and what remains subject to confirmation.
- Use tables for real comparisons, numbered steps for a genuine process and captions for explanatory charts. Keep important facts out of image-only text.
- Build consistent organisation/founder identities across site and official profiles. Use original lessons and evidence that another publisher could reasonably cite.
- Distinguish being cited as a source, mentioned by name, and recommended as a provider. Measure each separately.
- Verify search crawler access at robots and hosting layers. Allow search discovery deliberately; decide training permissions separately. OpenAI distinguishes OAI-SearchBot from GPTBot and ChatGPT-User. [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots)
- Check PerplexityBot using its current documentation rather than copying an old generic AI bot list. [Perplexity crawler documentation](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)

`llms.txt`, machine-readable pricing files and other emerging formats are optional experiments after public HTML is accurate. They are not Phase 1 requirements or guaranteed citation signals. Do not create a second, divergent set of facts for bots. The installed skills contain numerical uplift and platform claims that are not reliable forecasts for this site; this plan does not adopt those promises. It also excludes unnecessary meta-keywords, automatic schema stars and blanket training-bot permissions.

Start an AI visibility panel with 10 fixed prompts: brand identity, founder identity, programme differences, Strategy Master inclusions, beginner fit, live vs individual learning, choosing gold mentorship, understanding XAUUSD, strategy review and journaling. Run repeat samples in available search-enabled engines and record date, platform/model, locale, exact prompt, answer, cited URL and whether the brand was mentioned or recommended. Use 3 repeated runs per platform initially, report counts/sample sizes and keep prompts stable. No AI answer baseline has been measured in this audit.

## 8. Programmatic SEO: a controlled pilot

The suitable playbooks are **original examples** and a **small learning glossary**. Neither warrants hundreds of pages today. First approve a content dataset; then use a template to publish it consistently.

Pilot: 6–10 pages after the foundation and core content releases, with one canonical home for each topic. Suggested pattern: `/learn/[topic]`, avoiding a competing glossary URL for the same subject. Examples might include market structure, drawdown, risk-reward reasoning and journal review, only where Green Arc can contribute an original explanation or illustration.

Each record needs: slug; intent; precise definition; an original example; chart/image provenance; limitations and common mistakes; primary references; named author/reviewer; genuine dates; related topics; an appropriate next action. A short generic dictionary definition is insufficient. A dated chart lesson must disclose instrument, timeframe and educational context; avoid hindsight presented as a live prediction.

Template: breadcrumb → descriptive heading → concise answer → original worked example → explanation and limitations → relevant questions → references/reviewer → next lesson/programme. No word-count target substitutes for resolving the intent.

Publish only when the page has distinct value, factual review, rights to its media, correct metadata/schema and internal links. Keep unfinished drafts unpublished. Review pilot indexing, search queries and inquiry quality after 6–8 weeks before expanding; merge overlapping pages when appropriate.

Avoid auto-generated city landing pages, daily price pages without a maintained data service, near-identical keyword variants, “guaranteed profit” pages and unsubstantiated “best mentor” rankings. Google’s scaled-content policy concerns large amounts of unoriginal material produced to manipulate results, regardless of whether AI or people create it. [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies)

## 9. Delivery sequence and ownership

Effort ranges are planning estimates, not dates or ranking promises; owner facts and account access can change the schedule.

| Release | Scope | Indicative effort | Dependency / owner |
|---|---|---|---|
| 1 | Production indexing, host consistency, sitemap/redirect checks, baseline | 1–2 implementation days | Developer + owner Vercel access; public claims checked before inviting crawl |
| 2 | Metadata, schema, measured performance fixes, analytics, legal/business content corrections | 3–5 days plus policy/content review | Developer; owner supplies verified facts and account IDs |
| 3 | Founder page, programme comparison, Strategy Master detail, initial learning guides, video text | 1–2 weeks with editorial review | Developer + Shubham/content owner |
| 4 | Small programmatic pilot, YouTube/internal-link integration | 1–2 weeks after original content is ready | Content owner + developer |
| Ongoing | Search/AI measurement, content updates and earned authority | Monthly cycle | Owner/content lead; technical assistance as needed |

Expected implementation areas: `src/app/layout.tsx`, `robots.ts`, `sitemap.ts`, programme metadata, `src/lib/content.ts`, legal pages, shared metadata/schema helpers, approved new page routes, contact/CTA analytics and measured media-loading changes. No database migration is required for SEO. Only add attribution storage if an agreed reporting need justifies it.

Use small reviewable releases. Test a protected preview first, then recheck live production responses after deployment. Roll back individual metadata/content/performance changes if they regress behavior; do not accidentally restore blanket production noindex. No account changes, DNS edits, analytics installation, publishing or deployment were performed during this planning turn.

## 10. Verification and reporting

Release checklist:

- Crawl all public routes; inspect status, redirects, canonical, title, description, robots and HTML content.
- Confirm sitemap URLs and host agree; verify both robots and metadata on production and preview.
- Validate structured data against visible facts; check social previews.
- Test mobile/desktop layout, uncropped poster, hero, reduced motion and navigation.
- Test repeated programme selections, form errors/success, saved inquiry and WhatsApp destination; verify analytics events without PII.
- Inspect key URLs in Search Console and Bing; investigate exclusions rather than blindly requesting indexing repeatedly.
- Record comparable performance runs and available field metrics; preserve before/after evidence.

First month: check discovery and errors weekly. Establish a 28-day reporting baseline once tracking is reliable. At 30/60/90 days report indexed canonical pages, branded/nonbranded impressions and clicks, useful query coverage, landing pages, persisted inquiries, qualified leads by programme, WhatsApp intent clicks, organic/AI referrals and sampled AI citation accuracy. Segment India and device where the data allows. Separate small-sample movement from a sustained trend.

Set numerical growth targets after the first baseline rather than inventing a traffic forecast now. If pages remain unindexed, check access, canonical selection, duplication and content value before adding more URLs. If traffic rises without inquiries, investigate intent and offer clarity before increasing publishing volume.

## 11. Owner inputs needed before content publication

Already confirmed: India-based audience, English website, Shubham Soni’s identity, gold focus, 7+ years of experience, programme interaction requirements, supplied YouTube channel and support WhatsApp. Owner will create the three measurement properties.

Still needed:

1. Current programme facts: duration, language, schedule/timezone, prerequisites, delivery, mentor involvement, recordings, support, fees and refund/cancellation policy. Confirm the exact validity and eligibility of the poster offer.
2. Business facts: public email, legal/business identity where applicable, final privacy/terms, and whether there is a real eligible physical teaching location.
3. Evidence/editorial inputs: approved founder biography, review dates/context, video publication permissions and original lesson material for Shubham’s review.

We can implement the technical foundation first after plan approval; unavailable business facts must not be filled with invented copy. Additional informational routes and substantive visible copy will be presented for review while preserving the approved design and primary conversion behavior.

## 12. Skills and research basis

Applied local skills: `.agents/skills/ai-seo/SKILL.md`, `.agents/skills/programmatic-seo/SKILL.md` and `.agents/skills/seo-geo/SKILL.md` in `new_website`, plus the workspace brainstorming skill. Their guidance informed the audit and options; current primary documentation takes precedence over unsupported numerical claims or outdated search-feature assumptions.

Linked official documentation and public page samples were checked on 6 October 2026. Direct live HTTP evidence and repository findings are separated from proposed work and unmeasured hypotheses throughout this plan.
