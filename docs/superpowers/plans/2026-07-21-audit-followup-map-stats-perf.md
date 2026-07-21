# Audit Follow-up: Neighborhood Depth, Script Deferral, Touch-Target Sweep Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Three follow-up workstreams selected after the 2026-07-21 competitive-audit-quick-wins plan shipped: deepen the neighborhood page with a market-context module, an interactive map, and FAQ schema; defer three marketing pixels that are more eager than they need to be; and close the remaining real touch-target gaps found during the earlier sweep.

**Architecture:** No new subsystems. Everything reuses existing data models and components, extended where needed: `NeighborhoodInfo` gains coordinate fields, `property-map.tsx` gains support for non-listing markers (it currently assumes every marker is a priced rental listing), and a new pure `buildNeighborhoodFaqs()` function derives FAQ content from fields the page already has — no new content authoring required.

**Tech Stack:** Next.js 15 App Router, TypeScript strict, Vitest + React Testing Library, react-leaflet (dynamically imported, SSR disabled), Tailwind CSS.

## Global Constraints

- Server components by default; the map mount point requires `"use client"` only at the existing `PropertyMap` component boundary (already client-side) — the neighborhood page itself stays a server component, importing `PropertyMap` via `next/dynamic`, matching `app/properties/page-client.tsx`'s existing pattern.
- No hard-coded hex colors; reuse existing Tailwind/token classes already used in the surrounding code.
- Reuse existing helpers — do not duplicate metadata objects, FAQ schema generation, or map rendering logic.
- TypeScript strict — no `any`.
- Do not fabricate precise business data (fake days-on-market, fake per-neighborhood price-per-sqft, etc.) where no real source exists. Where a stat is genuinely only available at city grain (not neighborhood grain), label it as city-level explicitly rather than implying neighborhood-level precision.
- The 14 neighborhood center coordinates added in Task 1 are good-faith approximations from general geographic knowledge of these named Utah neighborhoods, in the same spirit as the existing `SITE_GEO` constant in `lib/site.ts` (already commented as "PLACEHOLDER — update with real HQ lat/lng"). Follow that same convention: a comment noting they're approximate and may need refinement.
- Run `npm run lint` and `npm run test:run` before each commit in this plan.
- Every task's commit message is prefixed `feat(neighborhoods):`, `fix(perf):`, or `fix(a11y):` matching its content.

---

### Task 1: Add neighborhood center coordinates

**Files:**
- Modify: `lib/neighborhood-content.ts`
- Test: `lib/neighborhood-content.test.ts` (new)

**Interfaces:**
- Consumes: nothing new.
- Produces: `NeighborhoodInfo` gains `centerLat: number` and `centerLng: number` fields, consumed by Task 3's map mount.

**Context:** `property-map.tsx` needs `lat`/`lng` per marker, and no coordinate data exists anywhere in the codebase for these 14 neighborhoods (only city-level `SITE_GEO` exists, for Ondo's own HQ). Add one field pair per neighborhood, approximated from the neighborhood's own `description` text (e.g. "hillside north of downtown" for The Avenues, "centered around Sugar House Park" for Sugar House) cross-referenced with general knowledge of these named Wasatch Front areas.

- [ ] **Step 1: Write the failing test**

Create `lib/neighborhood-content.test.ts`:

```typescript
import { describe, it, expect } from "vitest"
import { neighborhoodsByCity } from "./neighborhood-content"

describe("neighborhood center coordinates", () => {
  it("every neighborhood has a plausible Utah lat/lng", () => {
    const all = Object.values(neighborhoodsByCity).flat()
    expect(all.length).toBeGreaterThan(0)
    for (const hood of all) {
      // Utah's Wasatch Front spans roughly 40.1°N-41.3°N, -112.1°W--111.5°W
      expect(hood.centerLat).toBeGreaterThan(40.0)
      expect(hood.centerLat).toBeLessThan(41.5)
      expect(hood.centerLng).toBeGreaterThan(-112.2)
      expect(hood.centerLng).toBeLessThan(-111.4)
    }
  })

  it("Sugar House and The Avenues have distinct coordinates (sanity check against copy-paste)", () => {
    const slc = neighborhoodsByCity["Salt Lake City"]
    const sugarHouse = slc.find((h) => h.name === "Sugar House")!
    const avenues = slc.find((h) => h.name === "The Avenues")!
    expect(sugarHouse.centerLat).not.toBeCloseTo(avenues.centerLat, 2)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- lib/neighborhood-content.test.ts`
Expected: FAIL — `centerLat`/`centerLng` are `undefined`, fail the `toBeGreaterThan`/`toBeLessThan` numeric assertions.

- [ ] **Step 3: Add the fields to the type**

In `lib/neighborhood-content.ts`, change:

```typescript
export type NeighborhoodInfo = {
  name: string
  slug: string
  city: string
  description: string
  character: string
  typicalHomes: string
  priceRange: string
  bestFor: string[]
  nearbySchools?: string[]
  nearbyParks?: string[]
  walkability: "High" | "Moderate" | "Low"
}
```

to:

```typescript
export type NeighborhoodInfo = {
  name: string
  slug: string
  city: string
  description: string
  character: string
  typicalHomes: string
  priceRange: string
  bestFor: string[]
  nearbySchools?: string[]
  nearbyParks?: string[]
  walkability: "High" | "Moderate" | "Low"
  /**
   * Approximate neighborhood-center coordinates, for map display only —
   * not surveyed boundaries. Good-faith estimates from each neighborhood's
   * description; refine if precision ever matters for a future feature.
   */
  centerLat: number
  centerLng: number
}
```

- [ ] **Step 4: Add `centerLat`/`centerLng` to all 14 entries**

Add the field pair to each neighborhood object, immediately after `walkability:`. Exact values:

| City | Neighborhood | centerLat | centerLng |
|---|---|---|---|
| Salt Lake City | The Avenues | 40.7794 | -111.8788 |
| Salt Lake City | Sugar House | 40.7217 | -111.8496 |
| Salt Lake City | Liberty Wells | 40.7280 | -111.8730 |
| Salt Lake City | Downtown | 40.7670 | -111.8910 |
| Draper | South Mountain | 40.4850 | -111.8600 |
| Draper | Suncrest | 40.4950 | -111.8300 |
| Draper | Draper Peaks | 40.5230 | -111.8630 |
| Lehi | Traverse Mountain | 40.4630 | -111.8850 |
| Lehi | Thanksgiving Point | 40.4180 | -111.8460 |
| Lehi | Lehi Old Town | 40.3916 | -111.8508 |
| Provo | Downtown Provo | 40.2338 | -111.6585 |
| Provo | Edgemont / Oak Hills | 40.2650 | -111.6280 |
| Ogden | East Bench | 41.2200 | -111.9450 |
| Ogden | Downtown / 25th Street | 41.2230 | -111.9738 |

For example, South Mountain's entry changes from:

```typescript
      nearbyParks: ["Corner Canyon Regional Park", "Potato Hill Trail"],
      walkability: "Low",
    },
```

to:

```typescript
      nearbyParks: ["Corner Canyon Regional Park", "Potato Hill Trail"],
      walkability: "Low",
      centerLat: 40.4850,
      centerLng: -111.8600,
    },
```

Apply the same pattern (insert `centerLat`/`centerLng` right after `walkability:`) to all 14 entries using the table above.

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:run -- lib/neighborhood-content.test.ts`
Expected: PASS

- [ ] **Step 6: Run the full suite and lint**

Run: `npm run test:run && npm run lint`
Expected: PASS, clean (TypeScript strict will also catch it if any of the 14 entries were missed, since `centerLat`/`centerLng` are now required fields — treat a `tsc`/build error here as proof an entry was missed, not a false positive)

- [ ] **Step 7: Commit**

```bash
git add lib/neighborhood-content.ts lib/neighborhood-content.test.ts
git commit -m "$(cat <<'EOF'
feat(neighborhoods): add approximate center coordinates for the map feature

No lat/lng data existed anywhere for these 14 neighborhoods. Approximated
from each neighborhood's own description text and general knowledge of
these named Wasatch Front areas — good-faith estimates for map display,
not surveyed boundaries, in the same spirit as the existing SITE_GEO
placeholder comment in lib/site.ts.
EOF
)"
```

---

### Task 2: Support non-listing markers in the map component

**Files:**
- Modify: `components/map/property-map.tsx`
- Test: `components/map/property-map.test.tsx` (new)

**Interfaces:**
- Consumes: nothing new.
- Produces: `MapProperty`'s `price`, `bedrooms`, `bathrooms` fields become optional; the popup renders the price/bed-bath line only when `price` is present. Consumed by Task 3.

**Context:** `PropertyMap` is currently built only for priced rental listings — `MapProperty` requires `price`/`bedrooms`/`bathrooms`, and the popup unconditionally renders `{formatPrice(property.price)}/mo` and a bed/bath line. The neighborhood page needs a single "here's roughly where this neighborhood is" marker with no listing behind it. Rather than inventing a fake listing (which would show a fabricated price in the popup), extend the component honestly: make those three fields optional, and skip that line in the popup when they're absent.

- [ ] **Step 1: Write the failing test**

Create `components/map/property-map.test.tsx`:

```typescript
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import PropertyMap from "./property-map"

// react-leaflet requires a real DOM measurement environment Leaflet doesn't get
// in jsdom by default; the component's own isClient/loading-state gate means
// we're testing that a marker with no price renders without crashing and
// without a price string, once the client-side map mounts.
vi.mock("leaflet", async () => {
  const actual = await vi.importActual<typeof import("leaflet")>("leaflet")
  return actual
})

describe("PropertyMap with a listing-less marker", () => {
  it("accepts a marker with no price/bedrooms/bathrooms", () => {
    expect(() =>
      render(
        <PropertyMap
          properties={[{ id: "sugar-house", title: "Sugar House", lat: 40.7217, lng: -111.8496 }]}
          center={[40.7217, -111.8496]}
          zoom={13}
        />
      )
    ).not.toThrow()
  })

  it("still accepts a fully-specified listing marker (backward compatible)", () => {
    expect(() =>
      render(
        <PropertyMap
          properties={[
            { id: "1", title: "123 Main St", price: 2200, bedrooms: 3, bathrooms: 2, lat: 40.7217, lng: -111.8496 },
          ]}
        />
      )
    ).not.toThrow()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- components/map/property-map.test.tsx`
Expected: FAIL — TypeScript error, `price`/`bedrooms`/`bathrooms` are required on `MapProperty` but the first test case omits them.

- [ ] **Step 3: Make the listing fields optional**

In `components/map/property-map.tsx`, change:

```typescript
interface MapProperty {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  lat: number;
  lng: number;
  image?: string;
  type?: string;
}
```

to:

```typescript
interface MapProperty {
  id: string;
  title: string;
  /** Omit for a plain location marker with no listing behind it (e.g. a neighborhood center pin). */
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  lat: number;
  lng: number;
  image?: string;
  type?: string;
}
```

- [ ] **Step 4: Make the popup render the price/bed-bath line conditionally**

Find the popup JSX:

```typescript
                <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#2563eb" }}>
                  {formatPrice(property.price)}/mo
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
                  {property.bedrooms} bed &middot; {property.bathrooms} bath
                  {property.type && ` · ${property.type}`}
                </p>
```

Change to:

```typescript
                {property.price !== undefined && (
                  <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#2563eb" }}>
                    {formatPrice(property.price)}/mo
                  </p>
                )}
                {(property.bedrooms !== undefined || property.bathrooms !== undefined) && (
                  <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
                    {property.bedrooms} bed &middot; {property.bathrooms} bath
                    {property.type && ` · ${property.type}`}
                  </p>
                )}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:run -- components/map/property-map.test.tsx`
Expected: PASS

- [ ] **Step 6: Run the full suite and lint (confirm no regression to the existing property-search usage)**

Run: `npm run test:run && npm run lint`
Expected: PASS, clean. `app/properties/page-client.tsx`'s existing `<PropertyMap>` usage passes full listing objects (price/bedrooms/bathrooms all present) so it is unaffected by fields becoming optional.

- [ ] **Step 7: Commit**

```bash
git add components/map/property-map.tsx components/map/property-map.test.tsx
git commit -m "$(cat <<'EOF'
feat(neighborhoods): support listing-less markers in PropertyMap

Needed for a neighborhood-center pin with no listing behind it. Rather
than inventing a fake priced listing to satisfy the existing required
fields, made price/bedrooms/bathrooms optional and skip that line in the
popup when absent. Backward compatible — the existing property-search
usage always supplies all three fields.
EOF
)"
```

---

### Task 3: Mount the map, add FAQ schema, add market-context module on the neighborhood page

**Files:**
- Modify: `app/neighborhoods/[city]/[neighborhood]/page.tsx`
- Test: `app/neighborhoods/[city]/[neighborhood]/page.test.tsx` (extend the existing file)

**Interfaces:**
- Consumes: `NeighborhoodInfo.centerLat`/`centerLng` (Task 1); `PropertyMap`'s now-optional listing fields (Task 2); `generateFAQJsonLd` from `@/lib/seo` (already used elsewhere, signature confirmed: `{question, answer}[]` → `FAQPage` JSON-LD or `null`).
- Produces: nothing new consumed by later tasks.

**Context:** Three additions to the same file, combined into one task to avoid conflicting edits (this file was also touched by the prior plan's Task 2 and Task 5 — the current state already has the title-doubling fix and the lead-form/team/testimonials/calculator CTA section; none of that is touched here).

1. **Market-context module.** The page already shows `hood.priceRange` in the "Quick Facts" cards. Add a new section surfacing *city-level* context (`market.medianRent`, `market.growthRate`, `market.avgDaysOnMarket`) the page currently loads (`const market = cityMarketData[city.name]`) but never displays — clearly labeled as citywide, not neighborhood-specific, since no neighborhood-grain source exists for these figures.
2. **Map.** A single center-marker map using Task 1's coordinates and Task 2's listing-less marker support, dynamically imported to match the existing `PropertyMap` usage convention in `app/properties/page-client.tsx`.
3. **FAQ.** A new pure function `buildNeighborhoodFaqs()` derives 4-5 Q&As entirely from fields the page already has (`character`, `priceRange`, `typicalHomes`, `nearbySchools`, `market.schoolDistrict`, `walkability`, `bestFor`) — no new content authoring. Wired through the same `generateFAQJsonLd` + visible `<details>/<summary>` accordion pattern already used on `components/city-guide-page.tsx`.

- [ ] **Step 1: Write the failing tests**

Add to the existing `app/neighborhoods/[city]/[neighborhood]/page.test.tsx` (append these `describe` blocks; keep the existing ones from the prior plan intact):

```typescript
describe("neighborhood page — market context, map, and FAQ", () => {
  it("shows city-level market context, clearly labeled as citywide", async () => {
    render(await Page({ params }))
    expect(screen.getByText(/Salt Lake City market context/i)).toBeInTheDocument()
    expect(screen.getByText(/citywide/i)).toBeInTheDocument()
  })

  it("renders a map container", async () => {
    render(await Page({ params }))
    expect(document.getElementById("property-map-container")).toBeTruthy()
  })

  it("emits FAQPage JSON-LD derived from existing neighborhood fields", async () => {
    render(await Page({ params }))
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    const faqScript = scripts.find((s) => {
      try {
        return JSON.parse(s.textContent || "")?.["@type"] === "FAQPage"
      } catch {
        return false
      }
    })
    expect(faqScript).toBeDefined()
    const faqData = JSON.parse(faqScript!.textContent || "")
    expect(faqData.mainEntity.length).toBeGreaterThanOrEqual(4)
  })

  it("renders the FAQ answers visibly, not just in JSON-LD", async () => {
    render(await Page({ params }))
    expect(screen.getByText(/Sugar House Is Best For|What is Sugar House known for/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- "app/neighborhoods/[city]/[neighborhood]/page.test.tsx"`
Expected: FAIL — none of the three additions exist yet.

- [ ] **Step 3: Add the FAQ-generating function**

In `app/neighborhoods/[city]/[neighborhood]/page.tsx`, after the existing `buildNeighborhoodDescription` function, add:

```typescript
function buildNeighborhoodFaqs(
  hood: NeighborhoodInfo,
  cityName: string,
  schoolDistrict: string | undefined
): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [
    {
      question: `What is ${hood.name} known for?`,
      answer: hood.character,
    },
    {
      question: `What's the price range in ${hood.name}?`,
      answer: `Homes in ${hood.name} typically range ${hood.priceRange}. Common home types: ${hood.typicalHomes}.`,
    },
    {
      question: `Who is ${hood.name} best for?`,
      answer: `${hood.name} tends to suit ${hood.bestFor.join(", ")}.`,
    },
    {
      question: `Is ${hood.name} walkable?`,
      answer:
        hood.walkability === "High"
          ? `Yes — ${hood.name} has high walkability, with most daily needs reachable on foot.`
          : hood.walkability === "Moderate"
            ? `${hood.name} has moderate walkability — some errands are walkable, but a car helps for most trips.`
            : `${hood.name} has low walkability and is best navigated by car.`,
    },
  ]
  if (hood.nearbySchools && hood.nearbySchools.length > 0) {
    faqs.push({
      question: `What schools serve ${hood.name}?`,
      answer: `${hood.name} is served by ${hood.nearbySchools.join(", ")}${schoolDistrict ? ` in the ${schoolDistrict}` : ""}.`,
    })
  }
  return faqs
}
```

- [ ] **Step 4: Add imports**

At the top of the file, add:

```typescript
import dynamic from "next/dynamic"
import { generateFAQJsonLd } from "@/lib/seo"
```

and add below the existing imports (matching `app/properties/page-client.tsx`'s convention):

```typescript
const PropertyMap = dynamic(() => import("@/components/map/property-map"), { ssr: false })
```

- [ ] **Step 5: Compute the FAQ JSON-LD in the page component**

Inside `export default async function Page`, after `const market = cityMarketData[city.name]`, add:

```typescript
  const faqs = buildNeighborhoodFaqs(hood, city.name, market?.schoolDistrict)
  const faqJsonLd = generateFAQJsonLd(faqs)
```

- [ ] **Step 6: Inject the FAQ JSON-LD script**

The page currently renders `<SEO ... jsonLd={generateBreadcrumbJsonLd([...])} />`. `SEO`'s `jsonLd` prop accepts `object | object[] | null` (confirmed in `components/seo.tsx`). Change:

```typescript
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Neighborhoods", url: `${SITE_URL}/neighborhoods/` },
          { name: city.name, url: `${SITE_URL}/locations/${citySlug}/` },
          { name: hood.name, url: `${SITE_URL}/neighborhoods/${citySlug}/${neighborhoodSlug}/` },
        ])}
```

to:

```typescript
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Neighborhoods", url: `${SITE_URL}/neighborhoods/` },
            { name: city.name, url: `${SITE_URL}/locations/${citySlug}/` },
            { name: hood.name, url: `${SITE_URL}/neighborhoods/${citySlug}/${neighborhoodSlug}/` },
          ]),
          faqJsonLd,
        ]}
```

- [ ] **Step 7: Add the market-context module**

Insert a new section directly after the existing "Quick Facts" `</div>` and before the "Best For" `<section>`:

```typescript
          {/* Market Context */}
          {market && (
            <section>
              <h2 className="text-xl font-bold mb-1">{city.name} Market Context</h2>
              <p className="text-sm text-foreground/60 mb-4">
                Citywide figures — neighborhood-level market data isn&apos;t available yet.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-foreground/60">Median Rent</p>
                  <p className="text-lg font-semibold">${market.medianRent.toLocaleString()}/mo</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-foreground/60">Growth Rate</p>
                  <p className="text-lg font-semibold">{market.growthRate}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-foreground/60">Avg Days on Market</p>
                  <p className="text-lg font-semibold">{market.avgDaysOnMarket} days</p>
                </div>
              </div>
            </section>
          )}
```

- [ ] **Step 8: Add the map**

Insert a new section directly after the "Parks & Recreation" section and before the "CTA" section:

```typescript
          {/* Map */}
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Where {hood.name} Is
            </h2>
            <PropertyMap
              properties={[{ id: hood.slug, title: `${hood.name}, ${city.name}`, lat: hood.centerLat, lng: hood.centerLng }]}
              center={[hood.centerLat, hood.centerLng]}
              zoom={13}
              className="h-[50vw] max-h-[360px]"
            />
          </section>
```

- [ ] **Step 9: Add the visible FAQ accordion**

Insert a new section directly after the map section and before the "CTA" section:

```typescript
          {/* FAQ */}
          {faqs.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4">{hood.name} FAQ</h2>
              <div className="space-y-4">
                {faqs.map((item) => (
                  <details key={item.question} className="group rounded-lg border p-4 cursor-pointer">
                    <summary className="font-medium text-foreground group-open:mb-2">{item.question}</summary>
                    <p className="text-sm text-foreground/70">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
```

- [ ] **Step 10: Run tests to verify they pass**

Run: `npm run test:run -- "app/neighborhoods/[city]/[neighborhood]/page.test.tsx"`
Expected: PASS

- [ ] **Step 11: Run the full suite and lint**

Run: `npm run test:run && npm run lint`
Expected: PASS, clean

- [ ] **Step 12: Manual verification**

Run: `npm run dev`
Visit `http://localhost:3000/neighborhoods/salt-lake-city/sugar-house/`
Expected: page now shows, in order after Parks & Recreation: a labeled "Salt Lake City Market Context" section (clearly marked citywide), a map centered on Sugar House with a single marker whose popup shows only the neighborhood name (no fabricated price), then an FAQ accordion with 4-5 questions, then the existing CTA/form/team/testimonials/cross-links unchanged.

- [ ] **Step 13: Commit**

```bash
git add "app/neighborhoods/[city]/[neighborhood]/page.tsx" "app/neighborhoods/[city]/[neighborhood]/page.test.tsx"
git commit -m "$(cat <<'EOF'
feat(neighborhoods): add market context, an interactive map, and FAQ schema

Three additions building on the prior audit-fix session's rebuilt CTA
section: a city-level market-context module (clearly labeled citywide,
since no neighborhood-grain source exists for rent/growth/days-on-market);
a single-marker map using the new approximate center coordinates and the
now-optional PropertyMap listing fields; and a FAQ block generated entirely
from fields the page already has, wired through the existing
generateFAQJsonLd helper and rendered as a visible accordion matching the
city guide page's pattern.
EOF
)"
```

---

### Task 4: Defer three marketing pixels to `lazyOnload`

**Files:**
- Modify: `components/analytics/tracking-tags.tsx`
- Test: existing test coverage — see note below.

**Interfaces:** none — internal `strategy` prop change only.

**Context — re-scoped after investigation, smaller than the original audit implied.** The original audit's live measurement (5.1s full load vs. 149ms TTFB, attributed to "six vendor SDKs") assumed a naive, unoptimized script-loading setup. Investigation of `components/analytics/tracking-tags.tsx` found something considerably more built-out already: `GoogleAnalyticsTag`, `HubSpotTrackingTag`, and `Rb2bPixel` already use `strategy="lazyOnload"`; the entire `TrackingTags()` bundle is already gated behind a client-side geo-check that starts suppressed and only activates post-mount (privacy-motivated, and incidentally already defers everything behind it); and each individual tag is further gated behind its own env var being set. What's *not* yet on the most-deferred strategy: `GoogleTagManager`, `MetaPixel`, `TikTokPixel`, and `LinkedInInsightTag` all use `strategy="afterInteractive"`. Per the file's own comment, GTM is the *recommended* primary loader (with Meta/TikTok/LinkedIn configured inside GTM itself in production, with these standalone components as fallbacks) — so leave `GoogleTagManager` on `afterInteractive`, since deferring the tag-manager shell itself risks delaying every tag it's responsible for firing. `MetaPixel`, `TikTokPixel`, and `LinkedInInsightTag` are conversion/retargeting pixels with no reason to fire before user interaction — move those three to `lazyOnload`, matching the audit's original reasoning exactly, just scoped to the three tags that actually still need it.

- [ ] **Step 1: Change the three strategies**

In `components/analytics/tracking-tags.tsx`, in `MetaPixel()`, change:

```typescript
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
```

to:

```typescript
      <Script
        id="meta-pixel"
        strategy="lazyOnload"
```

In `TikTokPixel()`, change:

```typescript
    <Script
      id="tiktok-pixel"
      strategy="afterInteractive"
```

to:

```typescript
    <Script
      id="tiktok-pixel"
      strategy="lazyOnload"
```

In `LinkedInInsightTag()`, change:

```typescript
      <Script
        id="linkedin-insight"
        strategy="afterInteractive"
```

to:

```typescript
      <Script
        id="linkedin-insight"
        strategy="lazyOnload"
```

Leave `GoogleTagManager()`'s `strategy="afterInteractive"` unchanged, and leave every `dangerouslySetInnerHTML`/`src`/`id` value in all four functions unchanged — this task only touches the three `strategy` attribute values.

- [ ] **Step 2: Run the full suite and lint**

Run: `npm run test:run && npm run lint`
Expected: PASS, clean. There is no existing test asserting on these `strategy` values (confirmed: no test file imports `tracking-tags.tsx`), so this step is a regression check, not a TDD RED/GREEN cycle — note that explicitly in your report rather than fabricating a RED step that didn't happen.

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, set `NEXT_PUBLIC_META_PIXEL_ID` (or any one of the four env vars) in `.env.local` to a test value, load the homepage, open DevTools → Network, filter by the pixel's domain, and confirm the request fires only after the page is idle/interactive rather than immediately on `afterInteractive`'s timing. If no env vars are configured locally, skip this step and note it in the report — the code change itself is verified by the type-check and lint passing with no altered logic other than the three string literals.

- [ ] **Step 4: Commit**

```bash
git add components/analytics/tracking-tags.tsx
git commit -m "$(cat <<'EOF'
fix(perf): defer Meta/TikTok/LinkedIn pixels to lazyOnload

Investigation found most of the audit's assumed "defer everything" scope
already done: GA, HubSpot, and rb2b already use lazyOnload, and the whole
tracking-tags bundle is already gated behind a post-mount client-side geo
check. Only these three conversion/retargeting pixels were still on
afterInteractive. GoogleTagManager stays on afterInteractive since it's
the recommended primary loader other tags may be configured to fire
through in production.
EOF
)"
```

---

### Task 5: Fix the remaining real touch-target gaps

**Files:**
- Modify: `app/schools/[district]/page.tsx`
- Modify: `components/investments/investment-card.tsx`
- Modify: `components/landing/featured-properties-section.tsx`
- Modify: `components/landing/service-area-section.tsx`
- Test: extend or create test files per component — see steps.

**Interfaces:** none — `className` additions only, same `min-h-11` pattern as the prior plan's Task 4.

**Context:** The prior plan's touch-target sweep fixed the two confirmed-interactive pills on the one page that was actually measured (the neighborhood page) and flagged 13 more `rounded-full border` occurrences sitewide as unaudited. Investigation classified all 13: 8 are static `<span>` labels (not tap targets, no fix needed — `app/demo/demo-page-client.tsx:140`, `app/faq/page.tsx:201`, `app/schools/[district]/page.tsx:70`, `app/schools/[district]/page.tsx:74`, `components/market-report-page.tsx:141`, `components/market-report-page.tsx:165`, plus 2 more within those same blocks), and 5 are real interactive elements under 44px: two in `app/schools/[district]/page.tsx` (a `Link` and an external `<a>`), and one `<button>` each in `investment-card.tsx`, `featured-properties-section.tsx`, and `service-area-section.tsx`.

- [ ] **Step 1: Write the failing tests**

Create (or extend, if a test file already exists — check with `find` before creating) test coverage for each. Four small test files:

`app/schools/__tests__/district-tap-targets.test.tsx` (new):

```typescript
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import Page from "../[district]/page"

describe("school district page tap targets", () => {
  it("the city-served link and website link meet the 44px minimum", async () => {
    render(await Page({ params: Promise.resolve({ district: "weber-school-district" }) }))
    const links = screen.getAllByRole("link")
    const cityLink = links.find((l) => l.className.includes("rounded-full"))
    expect(cityLink?.className).toMatch(/min-h-11/)
  })
})
```

(`weber-school-district` is a real, confirmed slug in `lib/school-district-content.ts`.)

`components/investments/investment-card.test.tsx` (new, unless one already exists — check first):

```typescript
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { InvestmentCard } from "./investment-card"
import type { InvestmentOpportunity } from "@/lib/investments-data"

const opportunity: InvestmentOpportunity = {
  slug: "test-opportunity",
  title: "Test Opportunity",
  location: "Salt Lake City, UT",
  assetClass: "Multifamily",
  minInvestment: 10000,
  targetReturn: "8%",
  holdPeriod: "5 years",
  distributionFrequency: "Quarterly",
  status: "open",
  image: "/modern-office-building.webp",
  description: "Test description",
  highlights: ["Highlight one"],
  riskFactors: ["Risk one"],
}

describe("InvestmentCard show/hide values toggle", () => {
  it("meets the 44px minimum tap target", () => {
    render(<InvestmentCard opportunity={opportunity} />)
    const toggle = screen.getByRole("button", { name: /hide investment amounts|show investment amounts/i })
    expect(toggle.className).toMatch(/min-h-11/)
  })
})
```

(`InvestmentOpportunity`'s full shape is confirmed from `lib/investments-data.ts:8-23`; `useFinancialVisibility` is a plain hook backed by local state + `localStorage`, no context provider needed in the test.)

`components/landing/featured-properties-section.test.tsx` (new, unless one exists):

```typescript
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { FeaturedPropertiesSection } from "./featured-properties-section"

describe("FeaturedPropertiesSection show/hide toggle", () => {
  it("meets the 44px minimum tap target", () => {
    render(<FeaturedPropertiesSection />)
    const toggle = screen.getByRole("button", { name: /hide rental prices|show rental prices/i })
    expect(toggle.className).toMatch(/min-h-11/)
  })
})
```

(Confirmed: `export function FeaturedPropertiesSection()` takes no props — `components/landing/featured-properties-section.tsx:104`.)

`components/landing/service-area-section.test.tsx` (new, unless one exists):

```typescript
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ServiceAreaSection } from "./service-area-section"

describe("ServiceAreaSection city pill links", () => {
  it("meet the 44px minimum tap target", () => {
    render(<ServiceAreaSection />)
    const links = screen.getAllByRole("link")
    expect(links.length).toBeGreaterThan(0)
    links.forEach((l) => expect(l.className).toMatch(/min-h-11/))
  })
})
```

(Confirmed: `export function ServiceAreaSection()` takes no props — `components/landing/service-area-section.tsx:32`.)

- [ ] **Step 2: Run the four new/extended test files, confirm failure**

Run: `npm run test:run -- app/schools/__tests__/district-tap-targets.test.tsx components/investments/investment-card.test.tsx components/landing/featured-properties-section.test.tsx components/landing/service-area-section.test.tsx`
Expected: FAIL — none of the four `className` strings contain `min-h-11` yet.

- [ ] **Step 3: Fix `app/schools/[district]/page.tsx`**

Change (line ~157, the city-served `Link`):

```typescript
                  className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm hover:bg-primary/5 hover:border-primary/30 transition-colors"
```

to:

```typescript
                  className="inline-flex min-h-11 items-center rounded-full border px-4 py-1.5 text-sm hover:bg-primary/5 hover:border-primary/30 transition-colors"
```

Change (line ~82, the external website `<a>`):

```typescript
                className="inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm hover:bg-primary/5 transition-colors"
```

to:

```typescript
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm hover:bg-primary/5 transition-colors"
```

- [ ] **Step 4: Fix `components/investments/investment-card.tsx`**

Change:

```typescript
            className="inline-flex items-center rounded-full border border-border px-2 py-1 text-xs text-foreground/70 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
```

to:

```typescript
            className="inline-flex min-h-11 items-center rounded-full border border-border px-2 py-1 text-xs text-foreground/70 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
```

- [ ] **Step 5: Fix `components/landing/featured-properties-section.tsx`**

Change:

```typescript
            className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-foreground/70 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
```

to:

```typescript
            className="inline-flex min-h-11 items-center rounded-full border border-border px-3 py-1 text-xs text-foreground/70 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
```

- [ ] **Step 6: Fix `components/landing/service-area-section.tsx`**

Change:

```typescript
                    className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/80 backdrop-blur-sm px-3 py-1.5 text-sm hover:border-primary/50 hover:bg-primary/5 transition-all"
```

to:

```typescript
                    className="inline-flex min-h-11 items-center gap-1 rounded-full border border-border/60 bg-card/80 backdrop-blur-sm px-3 py-1.5 text-sm hover:border-primary/50 hover:bg-primary/5 transition-all"
```

- [ ] **Step 7: Run the four test files again, confirm pass**

Run: `npm run test:run -- app/schools/__tests__/district-tap-targets.test.tsx components/investments/investment-card.test.tsx components/landing/featured-properties-section.test.tsx components/landing/service-area-section.test.tsx`
Expected: PASS

- [ ] **Step 8: Run the full suite, lint, and a11y audit**

Run: `npm run test:run && npm run lint && npm run test:a11y`
Expected: PASS, clean, no new a11y violations

- [ ] **Step 9: Commit**

```bash
git add "app/schools/[district]/page.tsx" components/investments/investment-card.tsx \
  components/landing/featured-properties-section.tsx components/landing/service-area-section.tsx \
  app/schools/__tests__/district-tap-targets.test.tsx components/investments/investment-card.test.tsx \
  components/landing/featured-properties-section.test.tsx components/landing/service-area-section.test.tsx
git commit -m "$(cat <<'EOF'
fix(a11y): close the remaining sitewide touch-target gaps

Follow-up to the prior plan's touch-target sweep, which only fixed the two
confirmed-interactive pills on the page actually measured and flagged 13
more occurrences as unaudited. Classified all 13: 8 are static, non-
interactive labels (no fix needed); 5 are real interactive elements under
44px, fixed here (school district page's city-served link and external
website link, and one toggle button each on the investment card, featured
properties section, and service area section).
EOF
)"
```

---

## Post-implementation note for the next session

- The neighborhood-center map marker is a single pin with no live listing data behind it — genuinely useful as "here's roughly where this is," but the richer version envisioned in the original audit (school/park/listing pins) still needs either live MLS/IDX integration or lat/lng sourcing for every school and park mentioned in `NeighborhoodInfo`, which is a much larger data-sourcing task, not a follow-up to schedule casually.
- The 14 neighborhood center coordinates are good-faith approximations, not surveyed data — worth a human spot-check against Google Maps before treating them as authoritative for anything beyond a rough locator pin.
- `GoogleTagManager`'s own `strategy="afterInteractive"` was deliberately left unchanged — if GTM is confirmed to *not* be the primary loader in production (i.e., Meta/TikTok/LinkedIn are NOT actually configured inside it, making the standalone components the real, only path), it would become a stronger deferral candidate too. Worth confirming with whoever owns the GTM container config.
