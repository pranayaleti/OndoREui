# SEO + Local Geo + GEO Implementation Plan

> **For agentic workers:** Execute task-by-task. Steps use checkbox syntax.

**Goal:** Add placeholder HQ geo constants, site-wide classic geo meta, org JSON-LD GeoCoordinates, and a shared `buildPageMetadata` helper.

**Architecture:** Single source in `lib/site.ts` (`SITE_GEO`); helpers in `lib/seo.ts`; root layout attaches geo meta.

**Tech Stack:** Next.js 15 Metadata API, Vitest, existing `lib/seo.ts` / `lib/site.ts`

## Global Constraints

- Lehi address + coords remain PLACEHOLDER until real HQ is known
- OndoREui only; no Dashboard/Mobile/Backend
- Do not bulk-migrate every page to `buildPageMetadata`

---

## File map

| File | Responsibility |
|------|----------------|
| `lib/site.ts` | `SITE_GEO` placeholder lat/lng |
| `lib/seo.ts` | geo meta helper, `buildPageMetadata`, org JSON-LD `geo` |
| `app/layout.tsx` | site-wide geo `metadata.other` |
| `lib/seo.test.ts` | tests for geo + metadata helper |

---

### Task 1: SITE_GEO + seo helpers + layout + tests

- [x] Add `SITE_GEO` to `lib/site.ts` with PLACEHOLDER comment
- [x] Add `getSiteGeoMetaOther()`, `buildPageMetadata()`, org/local-business `geo`
- [x] Wire `metadata.other` in `app/layout.tsx`
- [x] Extend `lib/seo.test.ts`; run `npm run test:run -- lib/seo.test.ts`
