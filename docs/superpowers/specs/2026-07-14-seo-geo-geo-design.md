# SEO + Local Geo Tags + GEO — Design Spec

**Date:** 2026-07-14  
**Status:** Approved (pending user review of this file)  
**Repo:** OndoREui (Next.js 15 App Router)

---

## Goal

Make the public marketing site consistently SEO-friendly and locally discoverable, while strengthening Generative Engine Optimization (GEO) for AI assistants — without rewriting every page.

Use a single central layer so HQ address and coordinates can be swapped later when the real office address is finalized.

---

## Context (what already exists)

- `lib/seo.ts` / `lib/site.ts` — titles, OG, JSON-LD (Organization / RealEstateBusiness / Service / FAQ / RealEstateListing / breadcrumbs)
- City / service pages already emit `GeoCoordinates` where city lat/lng exist
- Root `app/layout.tsx` metadata — robots, OG/Twitter, keywords, verification
- AI discoverability already in place: `llms.txt`, `/.well-known/llms.txt`, `llms-full.txt`, `llms.json`, `public/.well-known/agents.json`, dynamic `sitemap.xml`, `lib/site-index.ts`

### Gaps this design fills

- No site-wide classic HTML geo meta (`geo.region`, `geo.placename`, `geo.position`, `ICBM`)
- Org/business JSON-LD has `PostalAddress` but no top-level `geo` / `GeoCoordinates`
- No single `SITE_GEO` (lat/lng) next to address constants for one-place updates
- No thin shared page-metadata helper that always attaches geo + canonical/OG consistently

---

## Non-goals

- Changing the real HQ address (Lehi stays a **placeholder** until later)
- Google Business Profile / Maps listing setup
- Mass rewrite of page copy or per-route metadata audits
- OndoREDashboard, OndoREMobile, OndoREBackend
- New AI product surfaces beyond light consistency with existing `llms.txt` / site-index

---

## Approach

**Central helpers only (Approach 1).** Extend existing SEO utilities; migrate pages only when touched.

---

## Design

### 1. Placeholder location — single source of truth

In `lib/site.ts`, keep current address constants as placeholder HQ:

- Street / city / region / postal / country (existing)
- Add `SITE_GEO` (or equivalent):
  - `latitude: number`
  - `longitude: number`
  - Comment: `// PLACEHOLDER — update with real HQ when address is finalized`

Approximate coords for the current placeholder address (Lehi, UT) are fine; precision is not critical until the address changes.

All geo meta and org schema geo **must** read from these constants — never hard-code lat/lng elsewhere for HQ.

### 2. Classic geo meta (site-wide)

Emit via Next.js `Metadata.other` (root layout and/or shared builder):

| Tag | Value source |
|-----|----------------|
| `geo.region` | `US-${SITE_ADDRESS_REGION}` (e.g. `US-UT`) |
| `geo.placename` | `SITE_ADDRESS_CITY` (e.g. `Lehi`) |
| `geo.position` | `${lat};${lng}` |
| `ICBM` | `${lat}, ${lng}` |

City/service pages that already have city-level `GeoCoordinates` in JSON-LD keep that behavior. Site-wide HTML geo tags reflect **HQ placeholder**, not every city.

### 3. Schema.org geo on organization

Update `generateRealEstateBusinessJsonLd` (and local-business helpers if they share the same shape) to include:

```json
"geo": {
  "@type": "GeoCoordinates",
  "latitude": "<SITE_GEO.latitude>",
  "longitude": "<SITE_GEO.longitude>"
}
```

Keep existing `address`, `areaServed`, `sameAs`, offers, ratings as-is.

Property listing JSON-LD already supports optional `geo`; no change required except ensuring callers pass coords when available.

### 4. Shared page metadata helper

Add a thin helper in `lib/seo.ts` (name flexible, e.g. `buildPageMetadata`):

**Inputs:** title, description, pathname (or canonical URL), optional overrides (OG image, type, robots, keywords).

**Outputs:** Next.js `Metadata` including:

- `title`, `description`
- `alternates.canonical`
- `openGraph` + `twitter` (absolute URLs via `SITE_URL` / `metadataBase`)
- `other`: classic geo tags from `SITE_GEO` + address constants

**Migration rule:** new pages and pages edited for SEO should use the helper. Do not bulk-migrate every route in this phase.

### 5. GEO (AI search) — light touch

- Keep `llms.txt` / site-index as the source of truth for AI briefs
- When HQ address/geo constants change later, update `public/llms.txt` (or the route that serves it) in the same change so AI crawlers stay consistent
- Do not add new speculative AI files in this phase unless a missing link is found during implementation (e.g. robots pointing at llms.txt — only if not already present)

### 6. Later address swap (documented contract)

When the real address is known, update only:

1. Address + `SITE_GEO` in `lib/site.ts`
2. Any prose in `llms.txt` / `public/index.md` that hardcodes the street
3. Validate org JSON-LD and root geo meta still resolve from constants

No per-page geo chase required for HQ.

---

## Files likely touched

| File | Change |
|------|--------|
| `lib/site.ts` | Add placeholder `SITE_GEO`; comment as placeholder |
| `lib/seo.ts` | Org JSON-LD `geo`; `buildPageMetadata` (+ geo `other`) |
| `app/layout.tsx` | Attach site-wide geo meta (directly or via helper) |
| `lib/seo.test.ts` | Cover geo on org schema + metadata helper |
| `public/llms.txt` | Only if address/geo prose must stay in sync (optional this phase if unchanged) |

---

## Success criteria

- View-source / metadata on homepage includes `geo.region`, `geo.placename`, `geo.position`, `ICBM`
- Organization JSON-LD includes `GeoCoordinates` matching `SITE_GEO`
- Changing `SITE_GEO` + address constants updates geo meta and org schema without hunting page files
- Existing city page geo schema still works
- `npm` typecheck / existing `lib/seo.test.ts` pass
- No Dashboard / Mobile / Backend changes

---

## Out of scope follow-ups (optional later)

- Per-city HTML geo meta on city landing pages
- Full metadata migration of all public routes to `buildPageMetadata`
- SpeakableSpecification / extra FAQ enrichment pass
- Real HQ address + verified Google Business alignment
