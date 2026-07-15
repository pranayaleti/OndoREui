# Notary City RON SEO — Design Spec

**Date:** 2026-07-14  
**Status:** Draft — awaiting user review  
**Repo:** OndoREui (Next.js 15 App Router)

---

## Goal

Ship nationwide Notary SEO as **state hub pages + curated city RON pages** (one page per city), inspired by Lehi Pavers’ location matrix **without** their city × subtype spam. Pages must be accurate about RON (state-level rules), useful to users, and unique enough to avoid thin-content penalties.

---

## Locked decisions

| Topic | Choice |
|-------|--------|
| Geographic scope | **Nationwide** from day one |
| Matrix depth | **B** — state hubs + curated top-N cities per state; **one** RON page per city; **no** city × service-subtype pages |
| Language | English only |
| Scope boundary | OndoREui only |

---

## Approaches considered

### 1. Nested state → city (recommended)

- `/notary/[state]` hub + `/notary/[state]/[city]` city page  
- Clear hierarchy, breadcrumbs, and hub → city internal links  
- Static `/notary/on-demand` continues to win over `[state]` in the App Router  
- **Tradeoff:** Longer URLs than flat slugs; must reserve reserved segments (`on-demand`, future static routes)

### 2. Flat `/notary/[city]-[stateAbbr]` + separate state index

- Matches existing sketches in `lib/notary-service-areas.ts` (`los-angeles-ca`)  
- **Tradeoff:** State hubs fight for a second URL pattern; one dynamic segment collides with `on-demand` unless cities live under a prefix (e.g. `/notary/in/...`)

### 3. Full `us-locations.json` (~27k) or city × `NOTARY_SERVICE_TYPES` (~276k)

- Closest to Lehi Pavers volume  
- **Rejected** for v1 — thin-content and crawl-budget risk; contradicts matrix-depth **B**

**Recommendation:** Approach **1**.

---

## Defaults (explicit)

| Default | Value | Rationale |
|---------|--------|-----------|
| URL shape | `/notary/[state]/` and `/notary/[state]/[city]/` | Hub hierarchy; avoids flat-segment clash with `on-demand` |
| State slug | Full name slug from existing `US_STATES` (e.g. `california`, `new-york`) | Already in `lib/notary-service-areas.ts` |
| City slug | City name slug only under state (e.g. `los-angeles`) | Disambiguated by parent state |
| Top-N per state | **N = 10** (fewer if the curated source has fewer metros) | Large enough for SEO breadth; far below 27k |
| Utah exception | Include **all** Wasatch Front cities from `lib/utah-cities.ts` in addition to the national top-N rule | Home market density; reuse existing city data |
| Territories | **50 states + DC** only in v1; no territories | Aligns with “50 states” marketing; DC treated as a hub |
| RON page eligibility | Generate city/state pages only where state `ronServingStatus === "serves"` | Acceptance modeled at **state** level |
| Subtype pages | **None** in v1 (`/notary/loan-signing/...` etc. out of scope) | Matrix depth B |
| Initial RON status | All 50 + DC = `serves` (matches current site claims), with honest receiving-party caveats in copy | Existing FAQ / blog / llms claim nationwide RON |

Exact city allowlist is a data file reviewed at implementation time; the **rules** below define how it is built and maintained.

---

## Design

### 1. URL architecture

```
/notary                          → existing national notary hub
/notary/on-demand                → existing (static; reserved)
/notary/locations                → optional index of all state hubs (recommended)
/notary/[state]                  → state RON hub
/notary/[state]/[city]           → curated city RON page
```

**Routing rules**

- Implement as `app/notary/[state]/page.tsx` and `app/notary/[state]/[city]/page.tsx`.
- Validate `state` / `city` against the curated allowlist; unknown → `notFound()`.
- Reject reserved first segments: `on-demand`, `locations` (and any future static notary children) must remain static routes, not state slugs.
- Do **not** add `/notary/[service]/[city-state]` from `generateAllCityServiceCombinations` in v1.

**Canonicals:** trailing-slash consistent with the rest of the site (`trailingSlash: true`).

**Redirects:** None required for v1 (no prior city notary URLs). If old query-param “hidden SEO” links (`/notary?city=...`) are linked publicly, prefer updating those links to real paths rather than permanent redirects (optional follow-up).

---

### 2. RON acceptance data model (state-level)

RON legality / product availability is **not** a city attribute. Cities inherit eligibility from their state.

New module (name flexible), e.g. `lib/notary-ron-states.ts`:

```ts
export type RonServingStatus = "serves" | "does_not_serve"

export type RonStateRecord = {
  code: string            // "CA"
  name: string            // "California"
  slug: string            // "california"
  ronServingStatus: RonServingStatus
  /** Short, user-facing note; may be empty when status is serves */
  statusNote?: string
  /** ISO date string for editorial review cadence */
  lastReviewed: string
}
```

**Rules**

- City pages exist only if parent state `ronServingStatus === "serves"`.
- State hub for `does_not_serve` is optional; v1 default = **omit** hubs and cities for those states (keep national `/notary` copy updated if the list ever shrinks).
- Page copy must **not** claim “RON is legal in {city}.” Prefer: “RON for clients in {city}, {state}” + state note + “receiving party / lender / title acceptance may vary.”
- Do not invent per-city legal status. If product/legal later restricts a state, flip the state record and drop/regenerate that state’s pages.

**Relationship to existing “all 50 states” claims**

- Keep national messaging aligned with this table.
- Blog `/blog/remote-online-notary-all-50-states`, FAQ, `llms.txt`, and site-index should eventually point at `/notary/locations` (and key state hubs) instead of only the blog — light link updates in the same implementation phase.

---

### 3. City curation (top-N definition)

New curated dataset, e.g. `lib/notary-cities.ts` (or `public/data/notary-cities.json` loaded by that module). **Do not** generate pages for all ~27k rows in `public/data/us-locations.json`.

**Inclusion rules (v1)**

1. **Per state (and DC):** up to **N = 10** primary cities, chosen for search demand / metro prominence (state capital + largest metros / common “notary near me” markets).
2. **Utah overlay:** union with every city in `utahCitiesFromNorthOgdenToNephi` (Wasatch Front), even if that exceeds N for UT.
3. Each city record includes at least:

   ```ts
   {
     name: string
     slug: string
     stateCode: string
     stateSlug: string
     county?: string
     metro?: string          // e.g. "Los Angeles–Long Beach–Anaheim, CA"
     timezone?: string       // IANA, for hours/scheduling copy
     lat?: number
     lng?: number
     nearbyCitySlugs?: string[]  // same-state curated neighbors
   }
   ```

4. Prefer reusing lat/lng/county from `us-locations.json` or `utah-cities` when matching names; curation is an **allowlist**, not a dump.
5. Target scale: roughly **~450–550 city pages + ~51 state/DC hubs** (exact count = allowlist size). Far below 27k.

**Maintenance**

- Adding a city = add to allowlist + ensure uniqueness fields present.
- Removing a city = remove from allowlist (404) or add redirect later if it had meaningful traffic (out of scope until needed).

---

### 4. Page templates and uniqueness

#### 4a. State hub `/notary/[state]`

**Job:** Explain RON for clients in that state; list curated cities; CTA to book.

**Blocks (one job each)**

1. Hero — “Remote online notary for {State}”
2. How RON works (shared, lightly parameterized)
3. State status note from `RonStateRecord` (when non-empty)
4. City grid — links to curated cities in that state
5. Related — link to `/notary`, `/notary/on-demand`, Utah mobile note only on UT hub
6. FAQ — state-scoped answers (see SEO)

**Utah hub extra:** Call out mobile / in-office in Utah service area vs RON nationwide (consistent with existing `/notary` copy).

#### 4b. City page `/notary/[state]/[city]`

**Job:** Rank for “remote online notary {city} {state}” / “online notary {city}” with useful local framing — not a doorway page.

**Blocks**

1. Hero — “Remote online notary in {City}, {ST}”
2. Local intro — **required unique paragraph** using ≥2 of: county, metro, timezone/scheduling, nearby cities, or Utah-specific mobile availability
3. How a RON session works (shared template)
4. Who it’s for (real estate, loan signing, estate — as **sections on the same page**, not separate URLs)
5. State RON note + receiving-party caveat
6. Nearby cities (internal links)
7. CTA — existing NotaryBooking / Calendly / `SITE_EMAILS.notary` patterns
8. FAQ — mix of localized shared bank + 1–2 city/state specifics

**Uniqueness rules (anti-thin-content)**

- **Forbidden:** pages that only swap `{city}` / `{state}` into an otherwise identical body.
- **Required:** unique intro + unique title/description + nearby (or metro) context + FAQ localization.
- **Shared OK:** how-RON-works steps, trust badges, booking widget chrome.
- **Do not** emit hidden keyword walls (retire or replace `getHiddenSEOContent()` query-param spam with real hub/city links).
- **Do not** ship city × subtype URLs even if helpers already generate combination lists.

Reuse patterns from `components/city-service-page.tsx` where helpful (breadcrumbs, nearby links, FAQ JSON-LD), but **do not** reuse Utah-only market/school widgets on national notary pages unless data exists for that city.

---

### 5. SEO metadata and JSON-LD

Use `lib/seo.ts` / `lib/site.ts` (and `buildPageMetadata` from the SEO+geo spec when available).

**Title / description (examples)**

- State: `Remote Online Notary in {State} | ONDO Notary`
- City: `Remote Online Notary in {City}, {ST} | ONDO Notary`
- Descriptions mention RON, secure ID/session, and city/state; avoid “legal in every city” wording.

**JSON-LD (per page)**

| Type | Usage |
|------|--------|
| `BreadcrumbList` | Home → Notary → {State} → {City} |
| `Service` | Name like `Remote Online Notarization in {City}, {ST}`; `areaServed` = city + state |
| `FAQPage` | Visible FAQs only |
| `LocalBusiness` / notary business | Prefer **HQ** address from site constants for provider; set `areaServed` to the city/state. Do **not** invent a fake storefront address in each city. Optional city `GeoCoordinates` when lat/lng exist (service area geo, not a fake NAP) |

**HTML geo**

- Site-wide HQ geo meta stays as in the SEO+geo design (placeholder Lehi).
- City pages may add city `geo` in JSON-LD only; do not override root HQ geo meta with every city.

**Robots:** indexable for allowlisted pages; noindex is not the default.

---

### 6. Sitemap, site-index, llms, nav

| Surface | Behavior |
|---------|----------|
| `sitemap.xml` | Include `/notary`, `/notary/on-demand`, `/notary/locations` (if built), every state hub, every curated city URL |
| HTML `/sitemap` | Group under Notary → by state (or link to `/notary/locations`) — do not dump 500 loose links without grouping |
| `lib/site-index.ts` / `llms.txt` | Describe nationwide RON + point to `/notary` and `/notary/locations`; list a few example state/city URLs, not the full matrix |
| `lib/search-index.ts` | Index hubs + optionally cities (or hubs only if search UX would be noisy) — prefer hubs + Utah cities at minimum |
| Main nav | Do **not** put hundreds of cities in the header. Notary menu: Notary home, On-demand, Locations (states). State pages carry city grids |

Replace misleading “service area URLs” in helpers that advertise non-existent paths once real routes ship; sitemap should use the nested URLs in this spec, not `/notary/{city}-{state}` or `/notary/{service}/...`.

---

### 7. Implementation sketch (non-binding file list)

| Area | Likely touch |
|------|----------------|
| Data | `lib/notary-ron-states.ts`, `lib/notary-cities.ts` (curated allowlist) |
| UI | `components/notary-state-page.tsx`, `components/notary-city-page.tsx` (or one shared with mode) |
| Routes | `app/notary/locations/page.tsx`, `app/notary/[state]/page.tsx`, `app/notary/[state]/[city]/page.tsx` |
| Discovery | `app/sitemap.xml/route.ts`, `lib/site-index.ts`, `llms` sources, `lib/search-index.ts` |
| Cleanup | Stop relying on hidden query-param SEO blocks on `/notary`; wire real internal links |
| Existing | Extend/trim `lib/notary-service-areas.ts` so URL helpers match this architecture (or deprecate conflicting combination generators for sitemap) |

No Dashboard / Mobile / Backend changes.

---

## Non-goals (v1)

- City × service-subtype SEO pages (loan-signing-in-city, etc.)
- Indexing all ~27k `us-locations.json` places
- Per-city legal opinions or “RON accepted by every lender in {city}”
- Fake local NAP / storefront per city
- Mobile notary coverage outside Utah presented as if Ondo has local offices nationwide
- Live legal-data API / automatic scraping of state statutes
- OndoREDashboard, OndoREMobile, OndoREBackend
- Changing HQ address / Google Business setup

---

## Success criteria

- `/notary/{state}/` and `/notary/{state}/{city}/` resolve for every allowlisted entry; unknown slugs 404
- `/notary/on-demand` unchanged and not captured by `[state]`
- Roughly hundreds of city pages (top-N + Utah overlay), **not** tens of thousands
- No city × subtype routes in sitemap
- Each city page has unique title, description, intro, and FAQ localization per uniqueness rules
- JSON-LD breadcrumbs + Service (+ FAQ) present; city geo only when coords exist
- Copy frames RON at **state** eligibility + receiving-party caveat — never “city legal status”
- Sitemap / locations hub / site-index / llms updated consistently
- `npm` typecheck (and existing SEO tests if touched) pass
- English only

---

## Out of scope follow-ups

- Raising N or adding second-tier cities after measuring crawl/impressions
- Optional subtype pages **only** if uniqueness bar can be met (separate spec)
- Programmatic redirects from any legacy query-param URLs
- Territories beyond DC

---

## Self-review notes (resolved in this draft)

| Check | Resolution |
|-------|------------|
| TBD placeholders | None left; N=10, URL nested, 50+DC, Approach 1 |
| Conflict with `on-demand` | Static route reserved; documented |
| Conflict with existing flat URL helpers | Spec mandates nested URLs; helpers must be aligned or unused for sitemap |
| “Acceptance” ambiguity | State `ronServingStatus` + copy rules; cities inherit |
| Thin content vs Lehi Pavers | Explicit uniqueness rules; subtype matrix rejected |
| Scale | Allowlist top-N + Utah overlay; not full JSON dump |
