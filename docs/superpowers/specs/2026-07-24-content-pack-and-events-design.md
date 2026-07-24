# Content Pack + Events Feature — Design
**Date:** 2026-07-24
**Status:** Approved
**Repos touched:** OndoREui (all of Sub-project A), plus OndoREBackend / OndoREDashboard / OndoREMobile (Sub-project B) and OndoREBackend `reminderTemplates.ts` (A1).

## Overview

Two decomposed sub-projects from a single content-planning request.

**Sub-project A — Content pack (web-only, low risk):** five blog posts, a CAGR calculator, two standalone SEO pages, and an extension of the existing home-care reminder engine. Every item follows an existing, proven pattern in OndoREui.

**Sub-project B — Events feature (backend-backed, spans 4 repos):** a real `events` CRUD feature — migration + backend triad + dashboard admin CRUD + web listing + mobile screen.

### The page-vs-group decision (the original ask)

- **Own page:** Opportunity Zones, Utah Housing Grants, ONDO Events.
- **Grouped:** CAGR (a calculator + an "investment metrics" cross-link cluster, *not* its own marketing page — too thin), Cash-on-cash / finishing-basement / backyard / mortgage-paydown / maintenance (blog-post clusters).

Rationale: own a page only when it's a distinct high-intent SEO topic with real depth (Opportunity Zones), a concrete program list needing periodic freshness (Grants), or a feature (Events). Single metrics and how-to content group into the blog / existing hubs.

---

## Technical Constraints (Sub-project A — OndoREui)

- Next.js App Router — each page is `app/<route>/page.tsx`.
- **Blog post pattern** (mirror `app/blog/maintenance-capex-strategy/page.tsx`): `slug`/`title`/`description`/`published`/`modified`/`author`/`keywords` consts → `export const metadata: Metadata` → default component with `<SEO … />` + `PageBanner` + content + CTA. ~130 lines.
- **Registering a blog post requires three edits:** (1) create `app/blog/<slug>/page.tsx`; (2) add `<slug>` to `STATIC_ROUTE_SLUGS` (and `BLOG_INDEX_SLUGS`) in `lib/blog-slugs.ts`; (3) add a card entry to the `blogPosts` array in `app/blog/page.tsx` (`{title, excerpt, author, date, readTime, category, image, slug}`). Missing (2) fails the blog-slugs test; missing (3) means it never appears on the index.
- **Investments sub-page pattern** (mirror `app/investments/commercial-real-estate/page.tsx`): Server Component, `Metadata` export, `SEO` + breadcrumb JSON-LD (`generateBreadcrumbJsonLd`), `Card`s, `RiskDisclosure`, `ConsultationCTA`.
- **Calculator pattern:** add component to `pages/calculators/<name>-calculator.tsx`; add an entry to `CALCULATOR_CATALOG` in `lib/calculator-catalog.ts`; add a `slugToComponent` dynamic import in `app/calculators/[slug]/page.tsx`.
- Dark-mode: semantic Tailwind tokens only (`bg-background`, `text-foreground`, `border-border`). No hardcoded `bg-white`/`text-black`.
- No new npm dependencies.
- English-only (no i18n) — per repo AGENTS.md.

---

## Sub-project A — Content pack

### A1. Reminder-engine extension + maintenance blog

**Backend (OndoREBackend):** `REMINDER_TEMPLATES` in `src/config/reminderTemplates.ts` is consumed in exactly one place (`src/services/reminderService.ts:97`, maps to `typeKey`s), so extension is additive and low-risk. Existing: `hvac_cleanup` (365d), `air_filter` (90d), plus others incl. single-family-only ones.

Add the tips the user named that aren't yet templates (final list to confirm during planning):
- `garage_door_lube` — lubricate garage door track/rollers (~180d, all)
- `gutter_clean` — clean gutters/downspouts (~180d, single_family)
- `smoke_co_batteries` — replace smoke/CO detector batteries (~180d, all)
- `water_heater_flush` — flush water heater sediment (~365d, all)
- `sprinkler_blowout` — winterize sprinklers (~365d, single_family)
- `dryer_vent_clean` — clean dryer vent (~365d, all)

**Test:** add a unit test asserting `typeKey` uniqueness and that `recurrenceDays > 0` / `propertyTypeFilter ∈ {null, "single_family"}` for every template (no such test exists today).

**Web (OndoREui):** blog post `app/blog/home-maintenance-schedule-utah/page.tsx` — monthly + annual checklist framed around the reminder cadences (filter 90d, HVAC 365d, garage-door lube, winterize). **Cross-links to ONDO's automatic home-care reminders** so the post drives feature adoption, with a CTA into the owner dashboard/app. Answers the user's literal question: *yes, ONDO already sends these reminders — now for more of them.*

### A2. Blog cluster — 4 posts

Each: new `page.tsx` + `blog-slugs.ts` entry + `app/blog/page.tsx` card.

| Slug | Category | Cross-link |
|---|---|---|
| `finishing-basement-roi-utah` | Home Improvement | value-add / permits / ROI |
| `backyard-upgrades-and-fertilizer-guide` | Home Improvement | landscaping, fertilizer schedule, common fixes |
| `cash-on-cash-return-explained` | Finance | → `/calculators/cash-on-cash` + CAGR post |
| `mortgage-paydown-hacks` | Finance | → `/calculators/mortgage-payment` |

### A3. CAGR — calculator + metrics cluster (grouped, no standalone page)

- `pages/calculators/cagr-calculator.tsx` (inputs: beginning value, ending value, years → CAGR %). Mirror an existing simple calculator (e.g. `roi-calculator.tsx`).
- `CALCULATOR_CATALOG["cagr"]` entry + `slugToComponent` import.
- Cross-link CAGR ↔ cash-on-cash ↔ cap-rate as an "investment metrics" mini-cluster within the A2 finance posts.

### A4. Opportunity Zones — own page

`app/investments/opportunity-zones/page.tsx`, mirroring the commercial-real-estate sub-page. Content: what OZs are, Utah OZ map/counties, tax deferral/step-up/exclusion mechanics, who it's for, risk disclosure, consultation CTA. Add link from the `/investments` hub (`app/investments/page.tsx`) and to the sitemap. **Distinct** from existing `/investments/opportunities` (property listings) — note the difference in copy to avoid confusion.

### A5. Utah Housing Grants — own page

`app/buy/first-time/grants/page.tsx` (chosen location). Program list: Utah Housing Corporation loans/DPA, county/city down-payment-assistance, first-time-buyer credits — each with eligibility summary and outbound link. Cross-link from `/loans`, `/qualify`, `/buy/first-time`. Add to sitemap. Clearly framed as informational (not financial advice).

---

## Sub-project B — Events feature (backend-backed)

Its own spec/plan cycle. Mirrors the `neighborhoodGuide` content-CRUD feature end to end.

- **Migration (OndoREBackend `supabase/migrations/`):** `events` table — `id`, `slug` (unique), `title`, `description`, `starts_at`, `ends_at`, `location`, `rsvp_url`, `cover_image`, `status` (`draft|published`), timestamps. RLS: public `SELECT` where `status = 'published'`; admin/manager write. Follow the add-migration security checklist (pinned `search_path`, `security_invoker` on any view, execute revokes, RLS enabled).
- **Backend:** `eventsRoutes.ts` → `eventsController.ts` → `eventsService.ts` + Zod schema in `schemas/` + integration test, on the `errors.*` golden path (per add-endpoint skill). Public GET list/detail; admin POST/PATCH/DELETE.
- **Dashboard (OndoREDashboard):** `src/features/events/{types,state,components,hooks,api}` + a page — admin list, create/edit form, publish toggle.
- **Web (OndoREui):** `app/events/page.tsx` (published listing) + `app/events/[slug]/page.tsx` (detail, JSON-LD `Event` schema). Add to nav + sitemap.
- **Mobile (OndoREMobile):** events screen, likely under `(guest)`; consume the public list endpoint via the existing API/query layer.

---

## Build order (priority)

1. **A1** — reminder templates + test + maintenance blog
2. **A2** — 4-post blog cluster
3. **A3** — CAGR calculator + metrics cross-links
4. **A4 + A5** — Opportunity Zones + Utah Housing Grants pages
5. **B** — events feature (backend → dashboard → web → mobile)

Items 1–4 are independent and parallelizable. Item 5 is sequential within itself (migration → backend → clients).

## Testing / verification

- Web: `blog-slugs` test must pass (every index link resolves); typecheck + build; existing page tests unaffected.
- Backend: `preflight` gate (lint, typecheck, unit + integration tests) before claiming done; new reminder-template test + events integration test.
- Dashboard/mobile: typecheck + existing test suites.

## Out of scope

- No paid/ticketed events, no calendar sync, no email blasts for events (listing + RSVP link only).
- No new npm dependencies.
- Grants/OZ pages are informational, not advice; no lead-capture beyond existing CTAs.
