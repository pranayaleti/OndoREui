# Entity and licensing switch: design

Date: 2026-10-18
Status: draft, awaiting owner review
Sub-project 1 of 4 in the "get found as a Utah agent and loan officer" program.

## Goal

Make Pranay Reddy Aleti one entity that Google and AI assistants can recognize, and connect every page that talks about buying, selling, or lending to that entity. Do it now, before his licenses are active, without publishing any license claim. Once the licenses are active, one switch publishes the licensed titles and IDs everywhere at once.

## What the owner decided

- Licenses: the real estate license and NMLS 2699085 are still pending. Ship the code now with placeholders and fill in the real details later.
- Sponsors: it is not yet known which brokerage and which lender will sponsor the licenses. Keep both in one place as blank placeholders.
- Blog credit: every post shows "Reviewed by Pranay Reddy Aleti". No post claims he wrote it.
- Personal profile URLs (LinkedIn and others): not supplied yet. Leave the slot empty.
- Google Business Profile will be a service-area profile with no public address. That belongs to sub-project 3; it is listed here only because it affects which `sameAs` links exist.

## Why

- The site describes him in five places that are not connected: the sitewide Organization `founder` (name only), the founder's letter `Person` (`/founders-letter/#founder`), blog author links (`/about/team/`), Review nodes, and the `/links` intro. Google cannot tell these are one person.
- 153 blog posts are credited to "ONDO Team", "Ondo RE Team", "Product Team", or "Editorial Team". A generic team credit is something Google cannot check, so the content gets no credit from a real person standing behind it.
- The buy, sell, loan, and refinance pages, which match "agent" and "lender" searches, name no person at all.
- `llms.txt` and the Markdown page copies never say who runs Ondo, so an assistant asked "who runs Ondo Real Estate" has nothing on the site to quote.
- On Oct 12 a license claim reached production because nothing checked for one. A guard has to make that impossible.

## Design

### 1. One record for Pranay

Extend `TeamMember` in `lib/team-data.ts` with optional fields used only by the founder's entry:

- `image` (`/founder-image.webp`), `shortBio`, `knowsAbout[]`, `areaServed[]` (the Wasatch Front counties already used in the Organization schema)
- `sameAs: string[]`, empty for now
- `licenses`, made only of placeholders:
  - `realEstate: { number: "", brokerageName: "" }`
  - `mortgage: { nmlsId: SITE_LOAN_OFFICER.nmlsId, lenderName: "", lenderNmlsId: SITE_COMPANY_NMLS_ID }`

`SITE_LOAN_OFFICER` and `SITE_COMPANY_NMLS_ID` stay in `lib/site.ts` as the only definitions. The team record refers to them rather than copying them.

Add `FOUNDER_PERSON_ID = ${SITE_URL}/about/team/pranay-reddy-aleti/#person` and `founderPersonJsonLd(live = LICENSING_LIVE)` to `lib/seo.ts`. It returns the full `Person` node:

- Switch off: `jobTitle: "Founder"`, `worksFor` pointing to the Organization `@id`, `knowsAbout`, `areaServed`, `image`, and `sameAs` only when the list is not empty.
- Switch on: also `jobTitle: ["Founder", "Real Estate Agent", "Loan Officer"]`, plus `hasCredential` entries for the Utah real estate license (with the brokerage) and for the NMLS license (with the lender).

### 2. The profile page

New route: `app/about/team/[slug]/page.tsx`. It is generated statically from `teamMembers`, which today produces exactly one page, `/about/team/pranay-reddy-aleti/`.

- Metadata goes through `pageCanonicalMetadata`. The title is "Pranay Reddy Aleti: Founder of Ondo Real Estate" while the switch is off, and gains the licensed titles when it is on. It must fit in 60 characters; `lib/page-titles.test.ts` already checks that. The social preview image is the founder photo.
- JSON-LD: a `ProfilePage` whose `mainEntity` is `founderPersonJsonLd()`, plus a breadcrumb (Home > About > Team > Pranay Reddy Aleti).
- Content: the photo, a bio taken from the founder's letter, the cities served, the services as links (`/buy/`, `/sell/`, `/loans/`, `/property-management/`), a "Licensing" block, and a call-to-action to book a call.
  - Licensing block with the switch off: "Real estate and mortgage licensing in progress. See /licensing/."
  - Licensing block with the switch on: the license number and brokerage, NMLS 2699085 and the lender, and a link to NMLS Consumer Access.
- `/about/team/` links each team card to this page.
- The founder's letter changes from a `ProfilePage` to a `WebPage` + `Article` whose `author` is `{ "@id": FOUNDER_PERSON_ID }`. The full `ProfilePage` now lives on the profile page.

### 3. Every reference points to that one ID

| Place | Today | After |
|---|---|---|
| Organization `founder` (`lib/seo.ts`) | `{ @type: Person, name }` | `{ @id: FOUNDER_PERSON_ID }` |
| Founder's letter | its own `Person` at `#founder` | `author: { @id }` |
| Blog posts (`generateBlogPostingJsonLd`) | an author `Person` that links to `/about/team/` | author stays the Organization; add a `WebPage` with `reviewedBy: { @id }` and `lastReviewed` |
| Contact card pages (section 4) | nothing | the page's `WebPage` gets `reviewedBy: { @id }` |

### 4. Visible bylines and contact cards

- **Blog.** `components/content/article-shell.tsx` shows "Reviewed by [Pranay Reddy Aleti](/about/team/pranay-reddy-aleti/), Founder · Last reviewed <date>". The date is the post's `modified` date, or its `published` date when there is no `modified`. The 7 posts that do not use `ArticleShell` get the same line through a shared `<ReviewedBy />` component:
  - `building-high-performance-real-estate-nextjs-supabase`
  - `engineering-real-estate-investment-calculators`
  - `mobile-notary-utah-county-guide`
  - `prepare-for-remote-online-notary-session`
  - `remote-online-notary-all-50-states`
  - `remote-online-notary-real-estate-closings`
  - `technical-seo-for-real-estate`
- `ultimate-guide-becoming-utah-landlord-2026` has a hand-written footer that says "Written by Pranay Reddy Aleti, founder of Ondo Real Estate". Change it to "Reviewed by" so it matches the owner's decision. Keep the rest of the footer, including the "not legal or tax advice" line.
- **Contact card.** A new `components/people/your-contact-card.tsx` shows the photo, name, title line, a link to the profile, and Call and Book buttons.
  - Title line with the switch off: "Founder, Ondo Real Estate".
  - Title line with the switch on: depends on the card's `role` prop. `"agent"` shows "Utah Real Estate Agent, <brokerage>". `"loan"` shows "Loan Officer, NMLS #2699085, <lender> NMLS #<id>" using the existing `LoanOfficerLine` component.
  - Card placement:
    - `/buy/` and its 9 static subpages, plus `/sell/`, use `role="agent"`.
    - `/loans/` and its 8 static subpages, plus `/refinance/` and its 5 static subpages, use `role="loan"`.
    - The dynamic city templates `app/loans/[city]/page.tsx` and `app/loans/[city]/[loantype]/page.tsx` use `role="loan"`. Each template is one edit and covers every city page it generates.

### 5. AI-facing text

- `app/llms.txt/route.ts` and `app/llms-full.txt/route.ts` get a "Who runs Ondo" section: his name, the founding dates (OndoSoft May 2022, Ondo Real Estate July 2022), what he does, the counties served, and the profile URL. Licensed titles appear only when the switch is on.
- The profile page's Markdown copy (`/about/team/pranay-reddy-aleti.md`) is generated by the existing export step. Nothing new is needed for it.

### 6. The licensing switch

`LICENSING_LIVE` in `lib/site.ts` stays the only switch. Turning it on is one commit that does two things: fills in the four placeholders (license number, brokerage name, lender name, lender NMLS ID) and sets the flag to true.

## Tests

1. **One person.** Render the home page, the founder's letter, one `ArticleShell` post, one non-`ArticleShell` post, `/loans/fha/`, and `/buy/`, and collect every `Person` node and every `{ @id }` reference. Each one must resolve to `FOUNDER_PERSON_ID`, and only the profile page may contain the full `Person` node.
2. **No early claims.** A post-build script, `scripts/check-license-claims.mjs`, added to `postbuild` next to `check:main-landmark`, scans `out/**/*.html` and `out/**/*.md`. With the switch off it fails on any of these:
   - `real estate agent` used as his title, matched by the pattern `/\b(as a|i am a|, )\s*utah real estate agent/i` and by `jobTitle` containing "Real Estate Agent"
   - `loan officer` next to his name or `NMLS #`
   - `"jobTitle"` containing "Loan Officer"
   - `NMLS #\d`

   Allowed: `/licensing/` and the literal "NMLS ID on file", glossary pages that define the terms, and blog prose about agents in general. Those are excluded by path or by matching only phrases about him. Because it runs in `postbuild`, CI catches it before any deploy.
3. **Switch on.** Unit tests call `founderPersonJsonLd(true)`, `<YourContactCard live />`, and the profile page with `live` set and test license values, and check that the titles, `hasCredential`, the sponsor names, and the Consumer Access link all appear.
4. **No blank placeholders.** Extend the existing "never ships live with a missing company ID" test in `lib/site.test.ts`. When `LICENSING_LIVE` is true, the brokerage name, real estate license number, lender name, and lender NMLS ID must all be filled in.
5. **Existing checks still pass:** the page-title length scan, `check:seo`, `check:links`, the a11y suite (the profile page is added to its route list), and the bundle budget.

## Rollout

1. Implement with the switch off, using test-first changes.
2. Before pushing, run the same steps CI runs, locally on a clean checkout: tsc, lint, unit tests, build, check:links, check:seo, the bundle budget, test:a11y, test:links, and test:popups.
3. Push, then watch CI and the deploy until both finish.
4. Check production: the profile page loads, its JSON-LD parses, the Organization `founder` is an `@id` reference, a sample blog post has `reviewedBy`, a sample loan page shows the card, and `llms.txt` has the new section.
5. Owner: in Search Console, use URL Inspection on `/about/team/pranay-reddy-aleti/` and request indexing.
6. On licensing day the owner supplies the four values. Fill them in, flip the switch, run the same checks, and push.

## Out of scope (later sub-projects)

- 2: Review engine: a `/review/` page, review requests after move-in and closing, and `Review` schema built only from real, dated reviews.
- 3: Off-site runbook: a service-area Google Business Profile, Bing Places, a personal LinkedIn, and Zillow, Realtor.com, Homes.com, and NMLS Consumer Access profiles once licensed. Weekly cadence for a full-time push.
- 4: Measurement, built from Search Console exports the owner supplies, plus confirming GA4 is running.
- New city or "best agent in X" pages.

## Risks

- **A claim slips past the scanner.** Wording no pattern anticipated could still get through. Mitigation: everything licensed is rendered only through `founderPersonJsonLd`, `YourContactCard`, and the profile page's licensing block, so the scanner is a second line of defense, not the only one.
- **Blog-wide markup change.** Adding `reviewedBy` changes structured data on 153 pages at once. Mitigation: the one-person test, plus checking a sample of live pages in Google's Rich Results Test after deploy.
- **Uncommitted work from other sessions.** About 42 files of other sessions' uncommitted work sit in the working tree, including `lib/site.ts` and `deploy.yml`. Mitigation: implementation runs in its own worktree from `origin/main` and never stages those files.
