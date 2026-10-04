# Green Arc Commune · new website

Standalone Next.js App Router site with Motion, TypeScript and SQLite storage. Local development uses a database file; Vercel uses hosted SQLite via Turso/libSQL. Requires Node.js 22.13 or newer. Legacy website remains untouched.

## Run

```sh
npm install
npm run dev -- --port 3100
```

Open http://127.0.0.1:3100. Production: `npm run build`, then `npm start`.
Build uses Webpack because of a local Turbopack sandbox worker issue.

## Content and programmes

Homepage: hero → approach → Shubham → programmes → commune → good habits → photo chapter → testimonials → team → FAQ → enquiry.

- Live Mentorship Program and Individual Mentorship Program scroll to the enquiry and select the appropriate option.
- Strategy Master Program has its own `/programmes/strategy-master` page.
- Algo Core is coming soon, non-interactive and excluded from enquiries.
- Legacy programme URLs redirect to the appropriate active destination.
- Five current team members; written reviews remain unchanged, including historical programme/mentor references.
- The transparent PNG logo appears in the header and footer; the footer uses a white treatment for contrast. The original supplied JPG is preserved in the image sources.
- The supplied group photo replaces stock photography in the full-width community chapter.
- One original member video replaces both sample videos. The MP4 is unmodified, and its poster is extracted from the recording. Captions were not supplied.
- The commune link opens the supplied WhatsApp channel.

`src/lib/content.ts` holds programme/team/review/link data. `src/app/page.tsx` holds the homepage narrative. The founder CTA links to the owner-confirmed `https://youtube.com/@greenarccommune`. `NEXT_PUBLIC_YOUTUBE_URL` can override it.

## Enquiry backend

`POST /api/enquiries` validates and saves the name, email, programme, message, creation timestamp and status `new`. Success appears only after the SQLite write completes. Errors preserve entered data. Retrying the same request ID does not create duplicate records. Requests are size-limited; validation excludes coming-soon programmes. A basic per-email limit allows five enquiries per hour.

Locally, the database defaults to `data/enquiries.sqlite`, outside `public/` and ignored by Git. Set `ENQUIRIES_DB_PATH` to change its location. There is no public read API or notification service. The protected `/admin` workspace provides search and pagination. Inspect local records with a SQLite client:

```sh
sqlite3 data/enquiries.sqlite 'SELECT id, name, email, programme, status, created_at FROM enquiries ORDER BY created_at DESC;'
```

### Vercel deployment

Vercel Functions cannot persist a local SQLite file. Connect [Turso Cloud for Vercel](https://vercel.com/marketplace/tursocloud/database) to the Vercel project, or create a Turso database yourself. Add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` as **server-side** Vercel environment variables for Production (and Preview if needed). Keep the token private; do not prefix either variable with `NEXT_PUBLIC_`. Set `ADMIN_SETUP_KEY` to a long, random private value so you can create the first `/admin` account. Redeploy after changing environment variables. The app creates its tables on first use and stores enquiries, admin accounts, and sessions in that one hosted database.

Set the Vercel project root directory to `new_website` if the GitHub repository includes the older site at its root. Once deployed, submit a test enquiry and verify that it appears in `/admin`; refresh the page to confirm persistence. Local SQLite files are **not** copied into Turso automatically. Existing local test enquiries and admin accounts remain local unless deliberately migrated. Back up the hosted database in your Turso account. The current per-email limit is basic spam mitigation, not a full abuse-protection service.

## Components and assets

- comp1: registered mountain layers and scroll depth in `parallax-scrolling.tsx`. Decorative candlestick SVG moves with the mountain behind the hiker; illustrative data, not live prices.
- comp2: keyboard/touch expanding gallery.
- comp4: scroll-responsive photographic chapter.
- comp6: programme image preview on hover/focus.

See `public/images/SOURCES.md` for assets. Community stock photos remain placeholders. Hero and supplied testimonial are separate assets; changing programmes does not alter the hero.

## Launch foundations

Server-rendered content, canonical URLs, organisation JSON-LD, social image, sitemap and crawl controls are included. Preview is noindex until `SITE_INDEXABLE=true`. Configure `NEXT_PUBLIC_SITE_URL` for deployment. Complete approved policies, programme specifics, photo replacements and later SEO/GEO/AEO work before publication.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Tests cover enquiry validation, persistence, duplicate retry handling and submission limits. Browser checks and limitations are in `docs/verification.md`.

## Admin access

Open `/admin` to create the first account using your own email and a password of at least 12 characters. Locally, the private setup code is in `data/admin-setup.txt` and its matching `ADMIN_SETUP_KEY` is configured in `.env.local`. In Vercel, set a private `ADMIN_SETUP_KEY` environment variable and use that value for initial signup. Neither local file is public or committed. After the first account is created, signup closes and `/admin` shows login instead.

The dashboard shows all saved enquiries, newest first, with name, email, programme, full message and receipt time (IST). Search by name, email or programme; browse 30 records per page. Refresh to see new submissions. Logout revokes the session.

Passwords are salted and hashed with scrypt. Only hashes of session tokens are stored. Session cookies are HttpOnly, SameSite=Strict and Secure in production; production therefore requires HTTPS. Sessions expire after seven days. Authentication attempts are throttled per submitted email plus a higher global ceiling. Locally, admin data lives in `data/admin.sqlite` (override with `ADMIN_DB_PATH`); on Vercel it shares the Turso database with enquiries. This initial version supports one owner account and does not include password-reset email or additional admin invitations.

Strategy Master’s enquiry CTA opens WhatsApp support at +91 9753574157. Live/Individual links explicitly reselect and scroll on each click, even when the contact hash is already active.
