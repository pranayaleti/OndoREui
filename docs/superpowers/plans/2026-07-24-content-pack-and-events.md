# Content Pack + Events Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a web content pack (5 blog posts, a CAGR calculator, Opportunity Zones + Utah Housing Grants pages, and an extension of the home-care reminder engine) plus a backend-backed ONDO Events feature spanning backend, dashboard, web, and mobile.

**Architecture:** Phase A is OndoREui-only content following existing page/calculator patterns, plus an additive change to `OndoREBackend/src/config/reminderTemplates.ts`. Phase B mirrors the existing `neighborhoodGuide` content-CRUD feature end to end (migration → route→controller→service → dashboard admin → web listing → mobile screen).

**Tech Stack:** Next.js App Router (OndoREui), Express + Supabase/Postgres (OndoREBackend), Vite/React (OndoREDashboard), Expo Router (OndoREMobile), Zod, TypeScript, Vitest/Jest.

## Global Constraints

- English-only — no i18n, no locale params (repo AGENTS.md).
- No new npm dependencies in any repo.
- OndoREui dark-mode: semantic Tailwind tokens only (`bg-background`, `bg-muted`, `text-foreground`, `text-foreground/70`, `border-border`). No hardcoded `bg-white`/`text-black`.
- Blog post = Server Component page.tsx mirroring `app/blog/maintenance-capex-strategy/page.tsx` (consts → `export const metadata: Metadata` → `<SEO/>` + `PageBanner` + `<article>` with `prose prose-lg prose-invert`).
- **Registering a blog post = 3 edits, all required:** (1) `app/blog/<slug>/page.tsx`; (2) add slug to BOTH `STATIC_ROUTE_SLUGS` and `BLOG_INDEX_SLUGS` in `lib/blog-slugs.ts`; (3) add a `blogPosts` card `{title, excerpt, author, date, readTime, category, image, slug}` in `app/blog/page.tsx`. Existing images live in `public/` (e.g. `/modern-office-building.png`, `/modern-townhouse-garage.png`, `/modern-apartment-balcony.png`).
- Calculator = add `pages/calculators/<name>-calculator.tsx` (mirror `one-percent-rule-calculator.tsx`, ~270 lines) + `CALCULATOR_CATALOG` entry in `lib/calculator-catalog.ts` + `slugToComponent` dynamic import in `app/calculators/[slug]/page.tsx`.
- Backend endpoints on the `errors.*` golden path — use the `add-endpoint` skill. Migrations use the `add-migration` skill (timestamp naming, additive, pinned `search_path`, `security_invoker` views, execute revokes, RLS).
- Run the `preflight` gate in OndoREBackend before claiming backend work done.
- Commit after each task. Branch: `content/2026-07-content-pack-and-events` (already created in OndoREui; create matching branches in other repos before their tasks).

---

# PHASE A — Content Pack

## Task A1a: Extend home-care reminder templates (OndoREBackend)

**Files:**
- Modify: `OndoREBackend/src/config/reminderTemplates.ts` (append to `REMINDER_TEMPLATES`)
- Test: `OndoREBackend/src/config/__tests__/reminderTemplates.test.ts` (create)

**Interfaces:**
- Consumes: `ReminderTemplate { typeKey, title, description, recurrenceDays, propertyTypeFilter }`, `REMINDER_TEMPLATES`, `getValidReminderTypes()` (from `reminderService.ts:97`, maps `.typeKey`).
- Produces: 6 new `typeKey`s available to `getValidReminderTypes()` and the dashboard reminder routes.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { REMINDER_TEMPLATES } from "../reminderTemplates";

describe("REMINDER_TEMPLATES", () => {
  it("has unique typeKeys", () => {
    const keys = REMINDER_TEMPLATES.map((t) => t.typeKey);
    expect(new Set(keys).size).toBe(keys.length);
  });
  it("every template has a positive recurrence and a valid filter", () => {
    for (const t of REMINDER_TEMPLATES) {
      expect(t.recurrenceDays).toBeGreaterThan(0);
      expect([null, "single_family"]).toContain(t.propertyTypeFilter);
      expect(t.title.length).toBeGreaterThan(0);
      expect(t.description.length).toBeGreaterThan(0);
    }
  });
  it("includes the newly added home-care tasks", () => {
    const keys = new Set(REMINDER_TEMPLATES.map((t) => t.typeKey));
    for (const k of [
      "garage_door_lube",
      "gutter_clean",
      "smoke_co_batteries",
      "water_heater_flush",
      "sprinkler_blowout",
      "dryer_vent_clean",
    ]) expect(keys.has(k)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails** — `cd OndoREBackend && npx vitest run src/config/__tests__/reminderTemplates.test.ts` → FAIL (missing keys).

- [ ] **Step 3: Append the 6 templates** to `REMINDER_TEMPLATES`:

```ts
  { typeKey: "garage_door_lube", title: "Garage door lubrication", description: "Lubricate garage door rollers, hinges, and springs to prevent wear and noise.", recurrenceDays: 180, propertyTypeFilter: null },
  { typeKey: "gutter_clean", title: "Gutter cleaning", description: "Clear gutters and downspouts of leaves and debris to prevent water damage.", recurrenceDays: 180, propertyTypeFilter: "single_family" },
  { typeKey: "smoke_co_batteries", title: "Smoke & CO detector batteries", description: "Test and replace batteries in smoke and carbon-monoxide detectors.", recurrenceDays: 180, propertyTypeFilter: null },
  { typeKey: "water_heater_flush", title: "Water heater flush", description: "Flush sediment from the water heater tank to extend its life and efficiency.", recurrenceDays: 365, propertyTypeFilter: null },
  { typeKey: "sprinkler_blowout", title: "Sprinkler winterization", description: "Blow out irrigation lines before the first freeze to prevent burst pipes.", recurrenceDays: 365, propertyTypeFilter: "single_family" },
  { typeKey: "dryer_vent_clean", title: "Dryer vent cleaning", description: "Clean the dryer exhaust vent to improve efficiency and reduce fire risk.", recurrenceDays: 365, propertyTypeFilter: null },
```

- [ ] **Step 4: Run test to verify it passes** — same command → PASS.
- [ ] **Step 5: Commit** — `git commit -m "feat(reminders): add 6 home-care reminder templates + coverage test"`.

## Task A1b: Home maintenance schedule blog post (OndoREui)

**Files:**
- Create: `OndoREui/app/blog/home-maintenance-schedule-utah/page.tsx`
- Modify: `OndoREui/lib/blog-slugs.ts` (add `home-maintenance-schedule-utah` to `STATIC_ROUTE_SLUGS` + `BLOG_INDEX_SLUGS`)
- Modify: `OndoREui/app/blog/page.tsx` (add `blogPosts` card)

**Metadata (exact):** slug `/blog/home-maintenance-schedule-utah`; title "Home Maintenance Schedule for Utah Homeowners"; description "A monthly and annual home-care checklist — filters, HVAC, gutters, winterizing — and how ONDO auto-reminds you."; author "ONDO Team"; category "Home Care"; date "2026-07-24"; readTime "6 min read"; keywords: `["home maintenance schedule","air filter replacement","HVAC service","winterize sprinklers","Utah home care","maintenance reminders"]`.

**Section outline (author prose mirroring the reference post's `<article>`):**
1. Lead: routine maintenance protects value; ONDO tracks it for you.
2. `<h2>Monthly / Quarterly` — air filters (90d), garage-door lube, smoke/CO batteries, minor leaks.
3. `<h2>Annual` — HVAC service, water-heater flush, gutter cleaning, sprinkler winterization, dryer-vent cleaning.
4. `<h2>Seasonal (Utah lens)` — freeze-thaw, inversions, snow load.
5. `<h2>Let ONDO remind you` — **this is the payoff:** ONDO's home-care reminders already track air-filter (90d) and HVAC (365d) and now garage-door, gutters, batteries, water heater, sprinklers, and dryer vent — each recurring automatically. CTA `Button asChild` → `<Link href="/owner">` (owner dashboard) with copy "See your reminders". Cross-link `/blog/maintenance-capex-strategy`.

- [ ] **Step 1:** Create the page mirroring `app/blog/maintenance-capex-strategy/page.tsx` (same imports, metadata shape, `PageBanner`, badges, back-to-blog button, `prose prose-lg prose-invert`).
- [ ] **Step 2:** Add slug to `STATIC_ROUTE_SLUGS` and `BLOG_INDEX_SLUGS` in `lib/blog-slugs.ts`.
- [ ] **Step 3:** Add the `blogPosts` card in `app/blog/page.tsx` (image `/modern-townhouse-garage.png`).
- [ ] **Step 4: Verify** — `cd OndoREui && npx vitest run lib/blog-slugs.test.ts` → PASS; then `npm run build` (or `npx next build`) resolves `/blog/home-maintenance-schedule-utah` with no error.
- [ ] **Step 5: Commit** — `git commit -m "feat(blog): home maintenance schedule post + reminder cross-link"`.

## Task A2a–A2d: Blog cluster (OndoREui, 4 posts)

Each post follows the identical 5-step recipe as A1b (create page → 2 slug edits → index card → verify blog-slugs test + build → commit). One task per post.

| Task | Slug | Title | Category / image | Cross-links |
|---|---|---|---|---|
| A2a | `finishing-basement-roi-utah` | "Finishing a Basement in Utah: Costs, Permits & ROI" | Home Improvement / `/modern-townhouse-garage.png` | `/blog/backyard-upgrades-and-fertilizer-guide` |
| A2b | `backyard-upgrades-and-fertilizer-guide` | "Backyard Upgrades & Lawn Care: A Seasonal Fertilizer Guide" | Home Improvement / `/modern-apartment-balcony.png` | `/blog/finishing-basement-roi-utah` |
| A2c | `cash-on-cash-return-explained` | "Cash-on-Cash Return, Explained (with the Math)" | Finance / `/modern-office-building.png` | `/calculators/cash-on-cash`, `/calculators/cagr`, `/blog/mortgage-paydown-hacks` |
| A2d | `mortgage-paydown-hacks` | "Mortgage Pay-Down Hacks That Actually Save Interest" | Finance / `/modern-office-building.png` | `/calculators/mortgage-payment`, `/blog/cash-on-cash-return-explained` |

**Section outlines:**
- **A2a:** intro (why finish a basement) → cost ranges → permits/egress/ceiling-height rules → ROI vs other projects → Utah lens → takeaway.
- **A2b:** curb-appeal/value → spring/summer/fall fertilizer schedule (N-P-K basics, when to apply in Utah's climate) → common DIY fixes (sprinkler heads, weeds, drainage) → takeaway.
- **A2c:** definition → formula (annual pre-tax cash flow ÷ total cash invested) → worked example → CoC vs cap rate vs CAGR → CTA to the cash-on-cash + CAGR calculators.
- **A2d:** how amortization front-loads interest → biweekly payments, extra-principal, recast, refinance trade-offs → when NOT to pay down (opportunity cost) → CTA to mortgage-payment calculator.

Each: `date "2026-07-24"`, `author "ONDO Team"`, `readTime "6 min read"`, keywords derived from the title. Verify (`blog-slugs.test.ts` + build) and commit per post.

## Task A3: CAGR calculator (OndoREui)

**Files:**
- Create: `OndoREui/pages/calculators/cagr-calculator.tsx` (mirror `one-percent-rule-calculator.tsx`)
- Modify: `OndoREui/lib/calculator-catalog.ts` (add `cagr` entry)
- Modify: `OndoREui/app/calculators/[slug]/page.tsx` (add `slugToComponent["cagr"]` dynamic import)
- Test: `OndoREui/pages/calculators/__tests__/cagr-calculator.test.tsx` (create) — or a pure-function test if the math is extracted.

**Interfaces:**
- Produces: default-exported `CAGRCalculator` React component; catalog key `"cagr"`.
- Math: `CAGR = (endingValue / beginningValue) ** (1 / years) - 1`, returned as a percentage.

- [ ] **Step 1: Write the failing test** for the CAGR math (extract a pure helper `computeCagr(begin, end, years): number` inside the component file, exported):

```tsx
import { computeCagr } from "../cagr-calculator";
test("doubling over 1 year is 100%", () => {
  expect(computeCagr(100, 200, 1)).toBeCloseTo(100, 5);
});
test("100 -> 133.1 over 3 years is ~10%", () => {
  expect(computeCagr(100, 133.1, 3)).toBeCloseTo(10, 3);
});
test("guards zero/negative inputs", () => {
  expect(computeCagr(0, 200, 3)).toBe(0);
  expect(computeCagr(100, 200, 0)).toBe(0);
});
```

- [ ] **Step 2: Run test → FAIL** (`npx vitest run pages/calculators/__tests__/cagr-calculator.test.tsx`).
- [ ] **Step 3: Implement** the component mirroring `one-percent-rule-calculator.tsx`: form fields `beginningValue` (default 100000), `endingValue` (default 161051), `years` (default 5); `export function computeCagr(begin:number,end:number,years:number){ if(begin<=0||years<=0) return 0; return (Math.pow(end/begin,1/years)-1)*100 }`; results show CAGR %, total growth %, and a one-line interpretation; include the `LeadCaptureModal` and back-to-calculators `Link` like the reference.
- [ ] **Step 4: Run test → PASS.**
- [ ] **Step 5: Register** — add to `CALCULATOR_CATALOG`: `"cagr": { name: "CAGR Calculator", description: "Compute the compound annual growth rate of an investment between two values over time." }`; add `"cagr": dynamic(() => import("@/pages/calculators/cagr-calculator"), { loading: () => <Loading /> })` to `slugToComponent`.
- [ ] **Step 6: Verify build** resolves `/calculators/cagr`; add "Related calculators" cross-links to cash-on-cash / cap-rate if that pattern exists on sibling pages.
- [ ] **Step 7: Commit** — `git commit -m "feat(calculators): CAGR calculator"`.

## Task A4: Opportunity Zones page (OndoREui)

**Files:**
- Create: `OndoREui/app/investments/opportunity-zones/page.tsx` (mirror `app/investments/commercial-real-estate/page.tsx`)
- Modify: `OndoREui/app/investments/page.tsx` (add hub link/card)
- Modify: sitemap source if manual (check `app/sitemap/` or `lib/*sitemap*`/`lib/site-index.ts`)

**Content:** Server Component; `export const metadata` (canonical `${SITE_URL}/investments/opportunity-zones/`); `SEO` + `generateBreadcrumbJsonLd`; sections: What Opportunity Zones are → tax mechanics (deferral, 10-yr step-up/exclusion) → Utah OZ landscape → who it fits → `RiskDisclosure` → `ConsultationCTA`. **Copy must distinguish this from `/investments/opportunities`** (which is property listings): add a one-line "Looking for available properties? See Opportunities" link.

- [ ] **Step 1:** Create the page mirroring the commercial-real-estate sub-page.
- [ ] **Step 2:** Add a card/link on `/investments` hub.
- [ ] **Step 3:** Add route to sitemap source if the repo lists routes manually (grep `investments/commercial-real-estate` in `lib/` and `app/sitemap*` to find where).
- [ ] **Step 4: Verify** `npm run build` resolves `/investments/opportunity-zones`; existing investments tests pass.
- [ ] **Step 5: Commit** — `git commit -m "feat(investments): Opportunity Zones page"`.

## Task A5: Utah Housing Grants page (OndoREui)

**Files:**
- Create: `OndoREui/app/buy/first-time/grants/page.tsx`
- Modify: `OndoREui/app/buy/first-time/page.tsx` (link to grants), and add cross-links from `/loans` and `/qualify` where a "resources"/"related" block exists.
- Modify: sitemap source if manual.

**Content:** program list — Utah Housing Corporation first-home / DPA loans, county & city down-payment-assistance, first-time-buyer credits — each: name, one-line eligibility, outbound official link (open in new tab, `rel="noopener"`). Framed informational, not advice. `SEO` + breadcrumb JSON-LD; `PageBanner`; `Card` per program; `ConsultationCTA`.

- [ ] **Step 1:** Create the page (Server Component, mirror an investments/buy sub-page).
- [ ] **Step 2:** Add cross-links from `/buy/first-time`, `/loans`, `/qualify`.
- [ ] **Step 3:** Add to sitemap source if manual.
- [ ] **Step 4: Verify** build resolves `/buy/first-time/grants`.
- [ ] **Step 5: Commit** — `git commit -m "feat(buy): Utah housing grants page"`.

---

# PHASE B — ONDO Events Feature

> Sequential within itself: B1 (migration) → B2 (backend) → then B3/B4/B5 (dashboard, web, mobile) can parallelize. Mirror the `neighborhoodGuide` feature throughout.

## Task B1: `events` table migration (OndoREBackend)

**Files:** Create `OndoREBackend/supabase/migrations/<timestamp>_events.sql` — use the **add-migration** skill. Reference `20260711062348_neighborhood_guides.sql`.

**Schema:** `events` — `id uuid pk default gen_random_uuid()`, `slug text unique not null`, `title text not null`, `description text`, `starts_at timestamptz not null`, `ends_at timestamptz`, `location text`, `rsvp_url text`, `cover_image text`, `status text not null default 'draft' check (status in ('draft','published'))`, `created_at`/`updated_at timestamptz default now()`. Index on `(status, starts_at)`.
**RLS:** enable; policy public `SELECT` where `status = 'published'`; staff (`manager|admin|super_admin`) full write. Pin `search_path` on any function/trigger; `security_invoker=on` for any view; revoke execute per checklist.

- [ ] **Step 1:** Write the migration via add-migration skill.
- [ ] **Step 2:** Apply locally + verify (`supabase db reset` or the repo's migration test) → table + RLS present.
- [ ] **Step 3: Commit** — `git commit -m "feat(db): events table + RLS"`.

## Task B2: Events backend triad (OndoREBackend)

**Files (use the add-endpoint skill):**
- Create: `src/routes/eventsRoutes.ts`, `src/controllers/eventsController.ts`, `src/services/eventsService.ts`, `src/schemas/event.ts` (Zod)
- Modify: the route-registry file where `neighborhoodGuideRoutes` is mounted (grep `neighborhoodGuideRoutes` to find it) → mount at `/api/events`
- Test: `src/test/integration/flows/events.test.ts`

**Interfaces (mirror neighborhoodGuide):**
- `GET /api/events` — public list of `published`; `attachUserIfPresent` so `?includeUnpublished=1` authorizes staff.
- `GET /api/events/:slug` — public single published event.
- `POST /api/events` — staff create.
- `PATCH|PUT /api/events/:idOrSlug` — staff update.
- `DELETE /api/events/:idOrSlug` — staff delete.
- Service fns: `listEvents({ includeUnpublished })`, `getEventBySlug(slug)`, `createEvent(input)`, `updateEvent(idOrSlug, patch)`, `deleteEvent(idOrSlug)`. All return/throw on the `errors.*` golden path.
- Zod `eventCreateSchema` / `eventUpdateSchema`: `title` (min 1), `slug` (kebab), `startsAt` ISO, optional `endsAt`/`location`/`rsvpUrl`/`coverImage`/`description`, `status` enum.

- [ ] **Step 1:** Write the failing integration test (list returns only published for anon; staff create → appears in `?includeUnpublished=1`; anon create → 401/403; get by slug 200/404).
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement schema → service → controller → routes; mount router.
- [ ] **Step 4:** Run integration test → PASS.
- [ ] **Step 5: Run `preflight` gate** (lint, typecheck, unit + integration) → all green.
- [ ] **Step 6: Commit** — `git commit -m "feat(events): backend CRUD endpoints"`.

## Task B3: Dashboard admin CRUD (OndoREDashboard)

**Files:** `src/features/events/{types.ts, api/eventsApi.ts, hooks/useEvents.ts, components/*, }` + a page under `src/pages` (mirror an existing feature e.g. `features/maintenance` or `features/admin`). Add nav entry.

- [ ] **Step 1:** Types + api client hitting `/api/events` (list incl. unpublished for staff, create, update, delete, publish toggle).
- [ ] **Step 2:** List view + create/edit form + publish toggle, mirroring an existing admin feature's components.
- [ ] **Step 3:** Test the hook/api layer per repo convention; typecheck.
- [ ] **Step 4: Commit** — `git commit -m "feat(dashboard): events admin CRUD"`.

## Task B4: Web events listing + detail (OndoREui)

**Files:** Create `app/events/page.tsx` (published list) and `app/events/[slug]/page.tsx` (detail with JSON-LD `Event` schema). Add nav + sitemap entry. Fetch via the existing server data-fetch/API pattern used by other dynamic content (e.g. how `market-reports/[city]` or `neighborhoods` fetch).

- [ ] **Step 1:** Listing page — cards (title, date, location, RSVP link), empty state.
- [ ] **Step 2:** Detail page — full event + `Event` JSON-LD + RSVP CTA; `notFound()` for unpublished/missing.
- [ ] **Step 3:** Add to nav + sitemap; verify build.
- [ ] **Step 4: Commit** — `git commit -m "feat(web): events listing + detail"`.

## Task B5: Mobile events screen (OndoREMobile)

**Files:** an events screen, likely under `src/app/(guest)/`, consuming `GET /api/events` via the existing API/query layer (mirror how another list screen fetches). Add to navigation where appropriate.

- [ ] **Step 1:** Query hook for the public events list.
- [ ] **Step 2:** List screen (title/date/location, tap → RSVP link or detail).
- [ ] **Step 3:** Test the query hook per repo convention; typecheck.
- [ ] **Step 4: Commit** — `git commit -m "feat(mobile): events screen"`.

---

## Self-Review

- **Spec coverage:** A1 (reminders+blog) ✔ A1a/A1b · A2 cluster ✔ A2a–A2d · A3 CAGR ✔ · A4 OZ ✔ · A5 grants ✔ (at `/buy/first-time/grants` per decision) · B events ✔ B1–B5. Every spec item maps to a task.
- **Placeholders:** content prose is authored to explicit section outlines against a named reference post — structure, metadata, slugs, cross-links, and registration are fully specified; no logic step is left vague.
- **Type consistency:** `computeCagr` name/signature consistent A3; `ReminderTemplate` fields match the existing interface; events service fn names consistent B2↔B3↔B4↔B5.

## Verification per phase

- OndoREui: `npx vitest run lib/blog-slugs.test.ts` + `npm run build` after each web task.
- OndoREBackend: `preflight` gate before done.
- Dashboard/mobile: typecheck + existing suites.
