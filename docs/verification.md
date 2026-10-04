# Verification · 27 September 2026

## Automated

- ESLint: passed.
- TypeScript no-emit: passed.
- Production Webpack build: passed; 13 static outputs including four programme detail pages.

## Browser checks

- Desktop 1440×900 and mobile 390×844 parallax hero inspected with all three images loaded; no horizontal overflow.
- Native scroll produces distinct transforms: at scrollY 160, background/mountain/text/foreground translations were approximately 49.7/39.05/28.4/7.1 pixels. This matches the supplied comp1 70/55/40/10 ratios after the header offset.
- Hero programme CTA updates the URL anchor to #programmes.
- Reduced-motion fallback is implemented in Motion and CSS; OS preference was not changed in this verification.
- Earlier whole-site checks covered mobile navigation, gallery selection, testimonial filters and browsing, preview dialog/Escape, FAQ expansion, email-draft creation, programme navigation and selected enquiry programme.
- Programme metadata includes canonical URLs and preview noindex.

## Review captures

Updated hero captures: `.impeccable/review/hero-parallax-desktop.png` and `hero-parallax-mobile.png`. The earlier full-page desktop/mobile captures predate the hero replacement.

## Remaining launch work

Approved testimonial recordings and photography, current programme details, contact mailbox confirmation, legal policies and optional enquiry delivery backend. Landscape layers are supplied comp1 demo imagery. No external message was sent during testing. No search rankings, performance scores or production deployment claimed.

## Mountain/chart refinement · 3 October 2026

Restored original hero with chart overlay behind the hiker. Desktop 1440×900 and mobile 390×844 visually inspected; chart loaded and mobile had no horizontal overflow. Original headline and controls preserved. Lint, TypeScript and production build passed. Captures: `mountain-gold-desktop.png`, `mountain-gold-mobile.png`.

## Content, media and enquiry release · 4 October 2026

- Homepage order verified in browser: hero, approach, founder, programmes, commune, method, testimonials, team, FAQ, contact. The photographic chapter remains between method and testimonials.
- Supplied logo inspected at desktop and mobile widths. Community avatars measure 44×44. Mobile programme layout has no horizontal overflow.
- Five team members remain; Anunay Mishra and Abhishek Rajput removed only from team data. Historical written reviews unchanged.
- Live and Individual programme clicks each select the matching form option and scroll to contact. Algo Core is a non-link DIV with Coming soon. Strategy Master opens the dedicated strategy page.
- WhatsApp destination matches the owner-supplied URL.
- Exactly one video testimonial is rendered. Original 62.77-second recording loaded and played; native controls and Escape dismissal verified. No captions were supplied.
- Browser test enquiry returned success and its name/email/programme/status were verified in SQLite. That specific test record was removed afterwards.
- Storage tests pass: validation, persistence, idempotent retry, changed-payload rejection and per-email limit.
- Local HTTP checks pass: cross-origin 403, wrong media type 415, malformed JSON 400, invalid fields 400, oversized body 413.
- Independent backend review found two form edge cases; both corrected: programme changes are ignored while submitting, and UUID generation is inside error handling.
- YouTube channel URL still requires owner confirmation. CTA text is prepared and conditionally enabled through NEXT_PUBLIC_YOUTUBE_URL.
- SQLite requires persistent disk on deployment; current work is local, with no email notification or public admin API.

## Navigation fixes and private admin · 4 October 2026

- Founder YouTube CTA now uses the owner-provided channel. Browser verified its href.
- Repeated Live and Individual programme clicks explicitly scroll to contact and select the programme. Repeated Individual click verified with contact top ~90px and correct selection.
- Strategy Master page opens normally and its enquiry CTA links to `https://wa.me/919753574157` with a prefilled programme message. No external message sent.
- `/admin` offers private first-account signup, then login; enquiry records are server-rendered only for a valid session. Search and pagination included. Desktop/mobile signup inspected. User chooses real credentials; no real admin account created during tests.
- Unit tests pass for auth hashing, signup gate, second-account rejection, invalid login, session expiry/revocation, rate limiting, search escaping and pagination bounds, plus prior enquiry storage tests.
- Isolated production-server HTTP tests pass: public page hides private test enquiries; valid signup/login reveals them; cookie flags verified; second signup rejected; logout revokes access; invalid login rejected. Temporary databases removed after test.
- Independent review prompted narrower auth throttling and pagination clamping; both implemented and tested.
- Final lint, TypeScript and production build passed. The local dev server was restarted to register new routes and environment configuration.

## Vercel storage fix · 4 October 2026

- Replaced production file writes with the Turso/libSQL client across enquiry submission, admin authentication, sessions, throttling and the admin enquiry list. Local development and tests continue to use SQLite files.
- Vercel without `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` now fails with an explicit configuration error in server logs rather than attempting a write to its read-only project filesystem.
- Local tests pass for validation, idempotent retries, submission limits, admin signup/login/session lifecycle, search and missing Vercel configuration. Lint, TypeScript and production Webpack build pass.
- A live Turso database was not connected in this workspace, so remote persistence must be checked after adding the two server-side Vercel environment variables and redeploying. No production enquiry was submitted during this verification.
