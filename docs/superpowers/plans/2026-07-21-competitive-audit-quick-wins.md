# Competitive Audit — High-Impact/Low-Effort Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the 🔴 High-Impact, Low-Effort tier of the 2026-07-21 Ondo vs. Utah Competitors audit — 10 roadmap items, grouped into 6 file-scoped tasks to avoid cross-task edit conflicts.

**Architecture:** No new subsystems. Every task reuses existing helpers/components already in the codebase (`lib/seo.ts`, `ContactLeadForm`, `CityTeamSection`, `CityTestimonials`, the calculator routes) and fixes a specific, verified defect. Two items from the original roadmap (touch targets, lazy-loading images) were re-scoped after source-level investigation found the audit's assumed root cause was partially wrong — see Task 4 and Task 6 notes.

**Tech Stack:** Next.js 15 App Router, TypeScript strict, Vitest + React Testing Library, Tailwind CSS with `cn`/`cva` (`components/ui/badge.tsx` pattern).

## Global Constraints

- Server components by default; no `"use client"` unless already present in the file being touched.
- No hard-coded hex colors; use existing Tailwind/token classes already used in the surrounding code.
- Reuse existing helpers in `lib/` and `components/` — do not duplicate metadata objects or form logic (per `AGENTS.md` rule 1 and 6).
- TypeScript strict — no `any`.
- All new UI copy that is static (not per-city/per-neighborhood dynamic data) must go through `t()` from `useTranslation()` per the i18n convention already used in the touched files; dynamic per-neighborhood strings (e.g. "Interested in Sugar House?") stay as plain template strings, matching the existing pattern in `app/neighborhoods/[city]/[neighborhood]/page.tsx`.
- Run `npm run lint` and `npm run test:run` before each commit in this plan.
- Every task's commit message is prefixed `fix(seo):`, `fix(a11y):`, or `feat(leadgen):` matching its content.

---

### Task 1: Fix the canonical/redirect base-URL mismatch

**Files:**
- Modify: `lib/site.ts:4`
- Modify: `next-sitemap.config.js:144`
- Test: `lib/site.test.ts` (new)

**Interfaces:**
- Consumes: nothing new.
- Produces: `SITE_URL` now resolves to `https://www.ondorealestate.com` by default (used by `lib/seo.ts`'s `baseSiteUrl`, and therefore every canonical tag, OG url, and JSON-LD `url`/`@id` field sitewide).

**Context:** `ondorealestate.com` 301-redirects to `https://www.ondorealestate.com/`, but `SITE_URL` in `lib/site.ts` defaults to the non-www, always-redirecting form, and every canonical tag site-wide is built from it. `next-sitemap.config.js` has its own separate `siteUrl` fallback that must be kept in sync (it reads the same `NEXT_PUBLIC_SITE_URL` env var, so keeping the literal fallback strings identical is what matters — no env var is set in `.env`/`.env.example`, so this is a pure code fix).

- [ ] **Step 1: Write the failing test**

Create `lib/site.test.ts`:

```typescript
import { describe, it, expect } from "vitest"
import { SITE_URL } from "./site"

describe("SITE_URL", () => {
  it("defaults to the www host that does not redirect", () => {
    expect(SITE_URL).toBe("https://www.ondorealestate.com")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- lib/site.test.ts`
Expected: FAIL — `expected 'https://ondorealestate.com' to be 'https://www.ondorealestate.com'`

- [ ] **Step 3: Fix `lib/site.ts`**

In `lib/site.ts`, change line 4 from:

```typescript
export const SITE_URL = process.env['NEXT_PUBLIC_SITE_URL'] || "https://ondorealestate.com"
```

to:

```typescript
export const SITE_URL = process.env['NEXT_PUBLIC_SITE_URL'] || "https://www.ondorealestate.com"
```

- [ ] **Step 4: Fix `next-sitemap.config.js`**

In `next-sitemap.config.js`, change line 144 from:

```javascript
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://ondorealestate.com',
```

to:

```javascript
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ondorealestate.com',
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:run -- lib/site.test.ts`
Expected: PASS

- [ ] **Step 6: Run the full existing `lib/seo.test.ts` suite to confirm no regression**

Run: `npm run test:run -- lib/seo.test.ts`
Expected: PASS (canonical/URL-dependent assertions there use `toMatch(/\/buy$/)`-style suffix matches, not full-URL equality, so they remain valid against the new host)

- [ ] **Step 7: Commit**

```bash
git add lib/site.ts next-sitemap.config.js lib/site.test.ts
git commit -m "fix(seo): point SITE_URL at the non-redirecting www host

ondorealestate.com always 301s to www.ondorealestate.com, but every
canonical tag, OG url, and JSON-LD url/@id field was built from the
non-www SITE_URL constant — telling Google the canonical version of
every page is one that immediately redirects elsewhere."
```

---

### Task 2: Fix the sitewide duplicated brand-suffix `<title>` bug

**Files:**
- Modify (11 files, `${SITE_BRAND_SHORT}` pattern): `app/loans/[city]/[loantype]/page.tsx`, `app/neighborhoods/[city]/[neighborhood]/page.tsx`, `app/property-management/[city]/[subservice]/page.tsx`, `app/property-management/zip/[zip]/page.tsx`, `app/property-management/[city]/page.tsx`, `app/locations/[city]/page.tsx`, `app/buy-sell/[city]/[subservice]/page.tsx`, `app/compare/[slug]/page.tsx`, `app/market-reports/[city]/page.tsx`, `app/schools/[district]/page.tsx`, `app/pricing/[city]/page.tsx`
- Modify (5 files, `${SITE_NAME}` pattern): `app/buy-sell/[city]/page.tsx`, `app/buy-sell/zip/[zip]/page.tsx`, `app/loans/[city]/page.tsx`, `app/loans/zip/[zip]/page.tsx`, `app/properties/[publicId]/page.tsx`
- Modify (2 files, `buildPageMetadata` + hardcoded `"ONDO Notary"` suffix): `app/notary/[state]/page.tsx`, `app/notary/[state]/[city]/page.tsx`
- Test: `app/__tests__/metadata-title-not-doubled.test.ts` (new)

**Interfaces:**
- Consumes: nothing new — no change to `lib/seo.ts` or `lib/site.ts` internals, so no risk to other callers.
- Produces: nothing new consumed by later tasks.

**Context:** Root layout (`app/layout.tsx`) defines `title: { default: ..., template: "%s | Ondo RE" }`. Every one of the 18 files below builds its own title as a plain string that ALREADY ends in the brand (`| Ondo RE`, `| Ondo Real Estate`, or `| ONDO Notary`), then returns it as `title: someString` (or via `buildPageMetadata({ title: someString, ... })`, which also returns a plain string). Because Next.js applies the parent template to any plain-string child title, the real `<title>` tag ends up with the brand appended twice (confirmed live: `"Living in Sugar House, Salt Lake City | Neighborhood Guide | Ondo RE | Ondo RE"`). `openGraph.title`/`twitter.title` are NOT run through the template, so they already render correctly with a single suffix — **do not touch those fields**, only the `title` field itself. The fix in every case: wrap the already-built, already-suffixed string in `title: { absolute: theString }`, which tells Next.js "this is the final title, skip the template."

- [ ] **Step 1: Write the failing tests**

Create `app/__tests__/metadata-title-not-doubled.test.ts`. This statically checks each file's source for the bug pattern (a `return`/`title:` site that embeds the brand token but is NOT wrapped in `title: { absolute: ... }`) rather than deep-mocking 18 different dynamic-route param shapes — the fix is a source-shape invariant, and this guards against the exact copy-paste regression that produced the bug across 18 files in the first place.

```typescript
import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(__dirname, "..", "..")

const FILES_WITH_BRAND_SUFFIX_TITLE = [
  "app/loans/[city]/[loantype]/page.tsx",
  "app/neighborhoods/[city]/[neighborhood]/page.tsx",
  "app/property-management/[city]/[subservice]/page.tsx",
  "app/property-management/zip/[zip]/page.tsx",
  "app/property-management/[city]/page.tsx",
  "app/locations/[city]/page.tsx",
  "app/buy-sell/[city]/[subservice]/page.tsx",
  "app/compare/[slug]/page.tsx",
  "app/market-reports/[city]/page.tsx",
  "app/schools/[district]/page.tsx",
  "app/pricing/[city]/page.tsx",
  "app/buy-sell/[city]/page.tsx",
  "app/buy-sell/zip/[zip]/page.tsx",
  "app/loans/[city]/page.tsx",
  "app/loans/zip/[zip]/page.tsx",
  "app/properties/[publicId]/page.tsx",
  "app/notary/[state]/page.tsx",
  "app/notary/[state]/[city]/page.tsx",
]

describe("generateMetadata title is not doubled by the layout title template", () => {
  it.each(FILES_WITH_BRAND_SUFFIX_TITLE)("%s wraps its brand-suffixed title in title:{ absolute }", (relPath) => {
    const source = readFileSync(join(ROOT, relPath), "utf8")
    // The file must construct a title string containing the brand
    // (SITE_BRAND_SHORT, SITE_NAME, or a literal brand-like suffix)...
    const buildsSuffixedTitle = /\$\{SITE_BRAND_SHORT\}|\$\{SITE_NAME\}|ONDO Notary/.test(source)
    expect(buildsSuffixedTitle).toBe(true)
    // ...and wherever that string is returned as the metadata `title` field,
    // it must be wrapped in `{ absolute: ... }`, not returned as a bare string.
    expect(source).toMatch(/title:\s*\{\s*absolute:/)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- app/__tests__/metadata-title-not-doubled.test.ts`
Expected: 18 failures — each file currently has `expect(source).toMatch(/title:\s*\{\s*absolute:/)` return `false` (none of them wrap the title yet).

- [ ] **Step 3: Fix the 11 `${SITE_BRAND_SHORT}` files**

For each file below, the pattern is identical. Example shown for `app/neighborhoods/[city]/[neighborhood]/page.tsx` (the full pattern before/after):

Before:
```typescript
  return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical } }
```

After:
```typescript
  return { title: { absolute: title }, description, alternates: { canonical }, openGraph: { title, description, url: canonical } }
```

Apply this exact `title` → `title: { absolute: title }` change (leaving `openGraph: { title, ... }` untouched, since it correctly reuses the raw suffixed string) to the `return` statement in each of these files:

- `app/loans/[city]/[loantype]/page.tsx` (the `return { ... }` block starting after `if (!city || !def) return {}`)
- `app/neighborhoods/[city]/[neighborhood]/page.tsx`
- `app/property-management/[city]/[subservice]/page.tsx`
- `app/property-management/zip/[zip]/page.tsx`
- `app/property-management/[city]/page.tsx`
- `app/locations/[city]/page.tsx`
- `app/buy-sell/[city]/[subservice]/page.tsx`
- `app/compare/[slug]/page.tsx`
- `app/market-reports/[city]/page.tsx`
- `app/schools/[district]/page.tsx`
- `app/pricing/[city]/page.tsx`

(`app/compare/[slug]/page.tsx` and `app/loans/[city]/[loantype]/page.tsx` / `app/property-management/[city]/[subservice]/page.tsx` / `app/buy-sell/[city]/[subservice]/page.tsx` build the `return` object across multiple lines rather than one line — in those files, find the line that reads exactly `title,` inside the returned object literal and change it to `title: { absolute: title },`.)

- [ ] **Step 4: Fix the 5 `${SITE_NAME}` files**

Same transformation, same pattern (`title,` → `title: { absolute: title },` inside the returned object), for:

- `app/buy-sell/[city]/page.tsx`
- `app/buy-sell/zip/[zip]/page.tsx`
- `app/loans/[city]/page.tsx`
- `app/loans/zip/[zip]/page.tsx`
- `app/properties/[publicId]/page.tsx` — only the **main** return block (the one building `title` from `property.title`). Leave the early-return `return { title: "Property not found", robots: { index: false, follow: false } }` untouched — that string has no brand suffix, so wrapping it would be a no-op at best and inconsistent at worst; the test list above does not include a check against that branch.

- [ ] **Step 5: Fix the 2 notary files (`buildPageMetadata` callers)**

These call `buildPageMetadata({ title: \`...ONDO Notary\`, ... })` directly as the return value, so the title string never becomes a local variable to re-wrap after the fact. Restructure both to capture the title first, then override the field `buildPageMetadata` returns.

In `app/notary/[state]/page.tsx`, change:

```typescript
  return buildPageMetadata({
    title: `Remote Online Notary in ${state.name} | ONDO Notary`,
    description: `Secure remote online notarization (RON) for clients in ${state.name}. Identity-verified sessions for real estate, loan signings, and estate documents.`,
    pathname: `/notary/${state.slug}/`,
    keywords: [
      `remote online notary ${state.name}`,
      `online notary ${state.name}`,
      `RON ${state.name}`,
    ],
  })
```

to:

```typescript
  const title = `Remote Online Notary in ${state.name} | ONDO Notary`
  return {
    ...buildPageMetadata({
      title,
      description: `Secure remote online notarization (RON) for clients in ${state.name}. Identity-verified sessions for real estate, loan signings, and estate documents.`,
      pathname: `/notary/${state.slug}/`,
      keywords: [
        `remote online notary ${state.name}`,
        `online notary ${state.name}`,
        `RON ${state.name}`,
      ],
    }),
    title: { absolute: title },
  }
```

In `app/notary/[state]/[city]/page.tsx`, change:

```typescript
  return buildPageMetadata({
    title: `Remote Online Notary in ${city.name}, ${state.code} | ONDO Notary`,
    description: `Secure remote online notarization in ${city.name}, ${state.name}. Identity-verified RON sessions for real estate, loans, and estate documents.`,
    pathname: `/notary/${state.slug}/${city.slug}/`,
    keywords: [
      `remote online notary ${city.name}`,
      `online notary ${city.name} ${state.code}`,
      `RON ${city.name}`,
    ],
  })
```

to:

```typescript
  const title = `Remote Online Notary in ${city.name}, ${state.code} | ONDO Notary`
  return {
    ...buildPageMetadata({
      title,
      description: `Secure remote online notarization in ${city.name}, ${state.name}. Identity-verified RON sessions for real estate, loans, and estate documents.`,
      pathname: `/notary/${state.slug}/${city.slug}/`,
      keywords: [
        `remote online notary ${city.name}`,
        `online notary ${city.name} ${state.code}`,
        `RON ${city.name}`,
      ],
    }),
    title: { absolute: title },
  }
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm run test:run -- app/__tests__/metadata-title-not-doubled.test.ts`
Expected: all 18 cases PASS

- [ ] **Step 7: Typecheck and lint**

Run: `npm run lint`
Expected: no new errors (the `Metadata` type from `next` accepts `title: string | { absolute: string; ... } | ...` natively, so no type changes needed elsewhere)

- [ ] **Step 8: Commit**

```bash
git add app/__tests__/metadata-title-not-doubled.test.ts \
  "app/loans/[city]/[loantype]/page.tsx" "app/neighborhoods/[city]/[neighborhood]/page.tsx" \
  "app/property-management/[city]/[subservice]/page.tsx" "app/property-management/zip/[zip]/page.tsx" \
  "app/property-management/[city]/page.tsx" "app/locations/[city]/page.tsx" \
  "app/buy-sell/[city]/[subservice]/page.tsx" "app/compare/[slug]/page.tsx" \
  "app/market-reports/[city]/page.tsx" "app/schools/[district]/page.tsx" "app/pricing/[city]/page.tsx" \
  "app/buy-sell/[city]/page.tsx" "app/buy-sell/zip/[zip]/page.tsx" "app/loans/[city]/page.tsx" \
  "app/loans/zip/[zip]/page.tsx" "app/properties/[publicId]/page.tsx" \
  "app/notary/[state]/page.tsx" "app/notary/[state]/[city]/page.tsx"
git commit -m "fix(seo): stop the layout title template from doubling the brand suffix

18 route files built their own already-brand-suffixed <title> string and
returned it as a plain string, so Next's root-layout title template
('%s | Ondo RE') appended the brand a second time (confirmed live on the
neighborhood page: '...Neighborhood Guide | Ondo RE | Ondo RE'). Wrapping
each in title:{absolute} makes Next use the string as-is. openGraph/twitter
titles were already correct and are untouched."
```

---

### Task 3: Wire FAQPage schema and link neighborhood cards on the city guide page

**Files:**
- Modify: `components/city-guide-page.tsx`
- Test: `components/city-guide-page.test.tsx` (new)

**Interfaces:**
- Consumes: `generateFAQJsonLd(faqs: { question: string; answer: string }[])` from `@/lib/seo` (returns `{ '@context', '@type': 'FAQPage', mainEntity: [...] } | null`); `CityFaq = { q: string; a: string }` from `@/lib/city-content`; `neighborhoodsByCity: Record<string, NeighborhoodInfo[]>` and `NeighborhoodInfo = { name, slug, city, ... }` from `@/lib/neighborhood-content`; `toCitySlug` from `@/lib/utah-cities` (already imported in this file).
- Produces: nothing new consumed by later tasks.

**Context (two independent fixes in one file, done together to avoid two agents editing the same file):**

1. **FAQPage schema gap.** `content?.faq` (shape `{ q, a }[]`) is already rendered as a visible `<details>/<summary>` accordion in this component, but no `FAQPage` JSON-LD is emitted for it — `generateFAQJsonLd` exists and is used correctly elsewhere (`app/faq/*`, `city-service-page.tsx`) but not here. Note the field-name mismatch: `CityFaq` uses `{ q, a }`, but `generateFAQJsonLd` expects `{ question, answer }` — must map between them.
2. **Non-clickable neighborhood cards.** The `content?.neighborhoods` array (plain strings like `"Sugar House"` or `"Sugar House — description"`, from `lib/city-content.ts`) is rendered as static `Card`s with no link to the actual neighborhood detail page. The neighborhood detail pages are a **different** data source (`neighborhoodsByCity` in `lib/neighborhood-content.ts`, keyed by city name, entries with `name` + `slug`), and the two lists don't always match exactly (e.g. city-content says `"Avenues"`, the real neighborhood is named `"The Avenues"`). Match loosely (case-insensitive, allowing a leading `"The "` on the neighborhood-content side) and only render a `<Link>` when a match is found — otherwise leave the card unlinked exactly as today, rather than link to a 404.

- [ ] **Step 1: Write the failing tests**

Create `components/city-guide-page.test.tsx`:

```typescript
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { CityGuidePage } from "./city-guide-page"
import { findCityBySlug } from "@/lib/utah-cities"

const slc = findCityBySlug("salt-lake-city")!

describe("CityGuidePage", () => {
  it("emits FAQPage JSON-LD matching the visible FAQ content", () => {
    render(<CityGuidePage city={slc} />)
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
    expect(faqData.mainEntity.length).toBeGreaterThan(0)
    expect(faqData.mainEntity[0]).toHaveProperty("@type", "Question")
    expect(faqData.mainEntity[0].acceptedAnswer).toHaveProperty("@type", "Answer")
  })

  it("links a neighborhood card to its detail page when a matching neighborhood-content entry exists", () => {
    render(<CityGuidePage city={slc} />)
    // "Sugar House" in city-content.ts matches neighborhoodsByCity["Salt Lake City"] entry named "Sugar House"
    const link = screen.getByRole("link", { name: /Sugar House/i })
    expect(link).toHaveAttribute("href", "/neighborhoods/salt-lake-city/sugar-house/")
  })

  it("links the 'Avenues' card to 'The Avenues' detail page despite the name mismatch", () => {
    render(<CityGuidePage city={slc} />)
    const link = screen.getByRole("link", { name: /Avenues/i })
    expect(link).toHaveAttribute("href", "/neighborhoods/salt-lake-city/the-avenues/")
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- components/city-guide-page.test.tsx`
Expected: FAIL — no FAQPage script found; `getByRole("link", { name: /Sugar House/i })` throws (no such link exists yet)

- [ ] **Step 3: Add the imports**

At the top of `components/city-guide-page.tsx`, add to the existing import block:

```typescript
import { generateFAQJsonLd } from "@/lib/seo"
import { neighborhoodsByCity } from "@/lib/neighborhood-content"
```

- [ ] **Step 4: Add a neighborhood-slug lookup helper**

Below the existing `fmtUsd` helper function (before `export function CityGuidePage`), add:

```typescript
function findNeighborhoodSlugForCard(cityName: string, cardLabel: string): string | null {
  const candidates = neighborhoodsByCity[cityName]
  if (!candidates) return null
  const normalized = cardLabel.trim().toLowerCase()
  const match = candidates.find((n) => {
    const name = n.name.toLowerCase()
    return name === normalized || name === `the ${normalized}` || `the ${name}` === normalized
  })
  return match?.slug ?? null
}
```

- [ ] **Step 5: Emit FAQPage JSON-LD**

Inside `CityGuidePage`, after the existing `jsonLd` object (the `Place`-type one), add a second script. Find:

```typescript
  return (
    <>
      <Script
        id="city-guide-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
```

and change it to:

```typescript
  const faqJsonLd = content?.faq?.length
    ? generateFAQJsonLd(content.faq.map((f) => ({ question: f.q, answer: f.a })))
    : null

  return (
    <>
      <Script
        id="city-guide-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <Script
          id="city-guide-faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
```

- [ ] **Step 6: Link the neighborhood cards**

Find the "Neighborhoods" section:

```typescript
        {content?.neighborhoods && content.neighborhoods.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              Neighborhoods in {city.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.neighborhoods.map((hood) => {
                const [name, desc] = hood.includes(" — ") ? hood.split(" — ") : [hood, null]
                return (
                  <Card key={hood}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{name}</CardTitle>
                    </CardHeader>
                    {desc && (
                      <CardContent>
                        <p className="text-sm text-foreground/70">{desc}</p>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          </section>
        )}
```

Replace with:

```typescript
        {content?.neighborhoods && content.neighborhoods.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              Neighborhoods in {city.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.neighborhoods.map((hood) => {
                const [name, desc] = hood.includes(" — ") ? hood.split(" — ") : [hood, null]
                const neighborhoodSlug = findNeighborhoodSlugForCard(city.name, name)
                const cardBody = (
                  <Card className={neighborhoodSlug ? "hover:bg-muted/50 transition-colors cursor-pointer h-full" : undefined}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{name}</CardTitle>
                    </CardHeader>
                    {desc && (
                      <CardContent>
                        <p className="text-sm text-foreground/70">{desc}</p>
                      </CardContent>
                    )}
                  </Card>
                )
                return neighborhoodSlug ? (
                  <Link key={hood} href={`/neighborhoods/${citySlug}/${neighborhoodSlug}/`}>
                    {cardBody}
                  </Link>
                ) : (
                  <div key={hood}>{cardBody}</div>
                )
              })}
            </div>
          </section>
        )}
```

This requires `Link` from `next/link` — add it to the imports if not already present (check the top of the file; `city-guide-page.tsx` already imports `Link from "next/link"` at line 3, so no import change needed here).

- [ ] **Step 7: Run tests to verify they pass**

Run: `npm run test:run -- components/city-guide-page.test.tsx`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add components/city-guide-page.tsx components/city-guide-page.test.tsx
git commit -m "fix(seo): wire FAQPage schema and link neighborhood cards on city guides

The city guide's visible FAQ accordion had no FAQPage JSON-LD despite the
generator already existing and being used elsewhere on the site. Separately,
the 'Neighborhoods in {city}' cards rendered as plain text with no link to
the matching /neighborhoods/{city}/{neighborhood}/ detail page, breaking
the hub-and-spoke link between Ondo's two most closely related page types."
```

---

### Task 4: Fix undersized mobile tap targets

**Files:**
- Modify: `components/cross-link-section.tsx`
- Modify: `components/header.tsx`
- Test: `components/cross-link-section.test.tsx` (new)

**Interfaces:**
- Consumes: `Badge` from `@/components/ui/badge` (unchanged).
- Produces: nothing new consumed by later tasks.

**Context — re-scoped from the audit's assumption:** the audit's dev/UX leads guessed the 29-of-37 undersized tap targets on the neighborhood page were the static "best for"/"nearby schools" `<span>` pills. Source review shows those are plain `<span>`s, not `<a>`/`<button>` elements, so they were never part of the measured 37 tappable elements at all. The actual interactive, undersized elements on that page are: (1) the `CrossLinkSection` `variant="pills"` links (`Link` wrapping a `Badge` with `py-1.5 px-3` — renders ~32px tall, used for the "Explore Salt Lake City" section) and (2) `components/header.tsx`'s nav links (`py-1.5`, ~32-34px tall, present on every page via the global header). Fixing these two files is the real, complete fix for this item.

- [ ] **Step 1: Write the failing test**

Create `components/cross-link-section.test.tsx`:

```typescript
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { CrossLinkSection } from "./cross-link-section"

describe("CrossLinkSection pills variant", () => {
  it("renders pill links at least 44px tall", () => {
    render(
      <CrossLinkSection
        title="Explore Salt Lake City"
        variant="pills"
        links={[{ label: "Salt Lake City Market Report", href: "/market-reports/salt-lake-city/" }]}
      />
    )
    const link = screen.getByRole("link", { name: "Salt Lake City Market Report" })
    expect(link.className).toMatch(/min-h-11/)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- components/cross-link-section.test.tsx`
Expected: FAIL — `Link` currently has no `className` at all (only the inner `Badge` does)

- [ ] **Step 3: Fix `components/cross-link-section.tsx`**

Change the pills-variant block from:

```typescript
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <Badge
                variant="outline"
                className="text-sm py-1.5 px-3 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                {link.label}
              </Badge>
            </Link>
          ))}
        </div>
```

to:

```typescript
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="inline-flex min-h-11 items-center">
              <Badge
                variant="outline"
                className="text-sm py-1.5 px-3 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                {link.label}
              </Badge>
            </Link>
          ))}
        </div>
```

(`min-h-11` = 2.75rem = 44px, Tailwind's default spacing scale — no arbitrary-value CSS needed. The `Link` becomes the sized tap target; the `Badge` inside keeps its current compact visual footprint.)

- [ ] **Step 4: Fix `components/header.tsx` nav links**

Change line 127 from:

```typescript
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent transition-colors shrink-0"
```

to:

```typescript
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent transition-colors shrink-0"
```

Change line 148 from:

```typescript
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-0 bg-transparent cursor-pointer shrink-0"
```

to:

```typescript
                  className="inline-flex min-h-11 items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-0 bg-transparent cursor-pointer shrink-0"
```

Change line 224 from:

```typescript
                      className="block pl-6 pr-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
```

to:

```typescript
                      className="flex min-h-11 items-center pl-6 pr-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
```

Change line 236 from:

```typescript
                className="inline-flex items-center justify-center gap-2 rounded-md border border-primary bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
```

to:

```typescript
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:run -- components/cross-link-section.test.tsx`
Expected: PASS

- [ ] **Step 6: Run the accessibility audit**

Run: `npm run test:a11y`
Expected: PASS (no new axe-core violations; this is an additive sizing change, not a structural one)

- [ ] **Step 7: Commit**

```bash
git add components/cross-link-section.tsx components/header.tsx components/cross-link-section.test.tsx
git commit -m "fix(a11y): enforce 44px minimum tap targets on cross-link pills and header nav

The audit measured 29 of 37 tappable elements on the neighborhood page
under 40px tall. Source review found the actual offenders are the
CrossLinkSection pills-variant links and the header's nav links (py-1.5),
not the static best-for/schools spans the audit had assumed — those are
non-interactive <span>s and were never part of the measured 37 elements."
```

---

### Task 5: Neighborhood page — lead form, trimmed meta description, team/testimonials, calculator cross-link

**Files:**
- Modify: `components/contact/contact-lead-form.tsx`
- Modify: `app/neighborhoods/[city]/[neighborhood]/page.tsx`
- Test: `app/neighborhoods/[city]/[neighborhood]/page.test.tsx` (new)

**Interfaces:**
- Consumes: `CityTeamSection({ cityName: string })` from `@/components/city-team-section`; `CityTestimonials({ cityName: string; limit?: number })` from `@/components/city-testimonials`; `ContactLeadSource` union from `@/lib/leads-api`.
- Produces: `ContactLeadForm` gains two new optional props: `source?: ContactLeadSource` (default `"website"`, unchanged behavior when omitted) and `prefillMessage?: string` (default `""`, unchanged behavior when omitted) — both backward-compatible, every existing `<ContactLeadForm />` call site keeps working with zero changes.

**Context:** Four roadmap items (6, 7, 8, 10) all touch this one page file, so they're combined into a single task to avoid duplicate edits to the same file. Meta description is currently 243 characters (over the ~155 char display budget) and needs trimming; the "Interested in X?" section has no form, no team/testimonial trust signal, and no calculator link.

- [ ] **Step 1: Write the failing tests**

Create `app/neighborhoods/[city]/[neighborhood]/page.test.tsx`:

```typescript
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import Page, { generateMetadata } from "./page"

vi.mock("@/lib/leads-api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/leads-api")>("@/lib/leads-api")
  return { ...actual, submitContactLead: vi.fn(async () => ({ message: "ok", leadId: "1" })) }
})

const params = Promise.resolve({ city: "salt-lake-city", neighborhood: "sugar-house" })

describe("neighborhood page metadata", () => {
  it("keeps the meta description within Google's ~155-character display budget", async () => {
    const meta = await generateMetadata({ params })
    expect((meta.description as string).length).toBeLessThanOrEqual(155)
  })
})

describe("neighborhood page content", () => {
  it("renders a lead-capture form", async () => {
    render(await Page({ params }))
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it("renders the city team section and testimonials", async () => {
    render(await Page({ params }))
    expect(screen.getByText(/Sugar House specialist|meet.*team/i)).toBeInTheDocument()
  })

  it("links to a calculator", async () => {
    render(await Page({ params }))
    const calcLink = screen.getByRole("link", { name: /calculator/i })
    expect(calcLink.getAttribute("href")).toMatch(/^\/calculators\//)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- "app/neighborhoods/[city]/[neighborhood]/page.test.tsx"`
Expected: FAIL — no form, no team section, no calculator link exist yet; description length also currently 243

- [ ] **Step 3: Extend `ContactLeadForm` with optional `source` and `prefillMessage` props**

In `components/contact/contact-lead-form.tsx`, change:

```typescript
const DEFAULT_SOURCE: ContactLeadSource = "website"

const WEBMCP_TOOL_NAME = "submit_contact_lead"

export function ContactLeadForm() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
```

to:

```typescript
const DEFAULT_SOURCE: ContactLeadSource = "website"

const WEBMCP_TOOL_NAME = "submit_contact_lead"

type ContactLeadFormProps = {
  source?: ContactLeadSource
  prefillMessage?: string
}

export function ContactLeadForm({ source = DEFAULT_SOURCE, prefillMessage = "" }: ContactLeadFormProps = {}) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: prefillMessage,
  })
```

Then change the submit handler's `source: DEFAULT_SOURCE,` (in the `handleSubmit` function, around line 62) to `source,`. Leave the WebMCP tool's own `submitContactLead` call (around line 123) on `source: DEFAULT_SOURCE,` — the agent-invoked tool path is a separate, generic entry point and shouldn't inherit a specific page's context.

- [ ] **Step 4: Trim the meta description and switch to `title: { absolute }`**

In `app/neighborhoods/[city]/[neighborhood]/page.tsx`, change `generateMetadata`:

```typescript
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city: citySlug, neighborhood: neighborhoodSlug } = await params
  const city = findCityBySlug(citySlug)
  const hood = city ? findNeighborhood(city.name, neighborhoodSlug) : undefined
  const title = hood
    ? `Living in ${hood.name}, ${city!.name} | Neighborhood Guide | ${SITE_BRAND_SHORT}`
    : `Neighborhood Guide | ${SITE_BRAND_SHORT}`
  const description = hood
    ? `${hood.name} in ${city!.name}, UT — ${hood.character} Typical homes: ${hood.typicalHomes}. Price range: ${hood.priceRange}.`
    : ""
  const canonical = `${SITE_URL}/neighborhoods/${citySlug}/${neighborhoodSlug}/`
  return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical } }
}
```

to:

```typescript
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city: citySlug, neighborhood: neighborhoodSlug } = await params
  const city = findCityBySlug(citySlug)
  const hood = city ? findNeighborhood(city.name, neighborhoodSlug) : undefined
  const title = hood
    ? `Living in ${hood.name}, ${city!.name} | Neighborhood Guide | ${SITE_BRAND_SHORT}`
    : `Neighborhood Guide | ${SITE_BRAND_SHORT}`
  const description = hood
    ? `${hood.name} in ${city!.name}, UT — ${hood.character} Homes: ${hood.typicalHomes.split(",")[0]}. ${hood.priceRange}.`
    : ""
  const canonical = `${SITE_URL}/neighborhoods/${citySlug}/${neighborhoodSlug}/`
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  }
}
```

(This also folds in the Task 2 title fix for this same file — do not apply Task 2's edit to this file a second time if done out of order; check for `title: { absolute:` first.)

- [ ] **Step 5: Add imports for the reused components**

At the top of `app/neighborhoods/[city]/[neighborhood]/page.tsx`, add to the existing import block:

```typescript
import { CityTeamSection } from "@/components/city-team-section"
import { CityTestimonials } from "@/components/city-testimonials"
import { ContactLeadForm } from "@/components/contact/contact-lead-form"
```

- [ ] **Step 6: Rebuild the CTA section**

Replace:

```typescript
          {/* CTA */}
          <section className="text-center py-8 rounded-xl bg-muted/50 px-6">
            <h2 className="text-xl font-bold mb-3">Interested in {hood.name}?</h2>
            <p className="text-foreground/70 mb-6">
              Whether you&apos;re buying, renting, or investing in {hood.name} — we can help.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href={`/property-management/${citySlug}/`}>
                  Property Management
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={`tel:${SITE_PHONE.replace(/\s/g, "")}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  {SITE_PHONE}
                </a>
              </Button>
            </div>
          </section>
```

with:

```typescript
          {/* CTA */}
          <section className="py-8 rounded-xl bg-muted/50 px-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold mb-3">Interested in {hood.name}?</h2>
              <p className="text-foreground/70 mb-6">
                Whether you&apos;re buying, renting, or investing in {hood.name} — we can help.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild variant="outline" size="lg">
                  <a href={`tel:${SITE_PHONE.replace(/\s/g, "")}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    {SITE_PHONE}
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={`/calculators/home-sale`}>
                    See what a {hood.name} home costs monthly
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="max-w-lg mx-auto">
              <ContactLeadForm
                source="website"
                prefillMessage={`I'm interested in ${hood.name}, ${city.name}.`}
              />
            </div>
          </section>

          <CityTeamSection cityName={city.name} />

          <CityTestimonials cityName={city.name} limit={2} />
```

(The standalone "Property Management" button is dropped in favor of the form, which covers buy/rent/sell/PM intent via its free-text message — matching the roadmap's framing that the old button "may not even match intent." The `tel:` link stays as a zero-friction fallback for a ready-to-call visitor.)

- [ ] **Step 7: Run tests to verify they pass**

Run: `npm run test:run -- "app/neighborhoods/[city]/[neighborhood]/page.test.tsx" components/contact/contact-lead-form.test.tsx`
Expected: PASS (create `components/contact/contact-lead-form.test.tsx` only if it doesn't already exist — check first with `find components/contact -name "*.test.*"`; if it exists, extend it with one case asserting `prefillMessage` seeds the textarea value instead of creating a duplicate file)

- [ ] **Step 8: Manual verification**

Run: `npm run dev`
Visit `http://localhost:3000/neighborhoods/salt-lake-city/sugar-house/`
Expected: page shows the trimmed description in view-source, a working lead form pre-filled with "I'm interested in Sugar House, Salt Lake City." in the message field, a team section, testimonials, and a calculator link — submit the form once with test data and confirm the success state renders (network call will hit the real `submitContactLead` endpoint against local backend if running, or fail gracefully with the error state if not — either is fine for this manual check, the point is confirming the UI wiring).

- [ ] **Step 9: Commit**

```bash
git add components/contact/contact-lead-form.tsx "app/neighborhoods/[city]/[neighborhood]/page.tsx" \
  "app/neighborhoods/[city]/[neighborhood]/page.test.tsx"
git commit -m "feat(leadgen): add lead form, team/testimonials, and calculator link to neighborhood pages

The neighborhood page previously offered only a phone number and a
Property Management button as its only conversion paths, with zero forms,
zero social proof, and no discovery path into the existing calculator
suite. ContactLeadForm gained optional source/prefillMessage props so the
same shared form can carry neighborhood context without a new component.
Meta description trimmed from 243 to under 155 characters."
```

---

### Task 6: Homepage image loading audit

**Files:**
- Modify: `components/footer.tsx`
- Test: none (see note below)

**Interfaces:** none.

**Context — re-scoped after investigation, smaller than the audit assumed:** the audit's raw measurement ("1 of 4 homepage images has `loading=lazy`") is accurate but the roadmap's "add `loading=lazy` to all below-the-fold images" recommendation doesn't apply cleanly — investigation found:
- `components/header.tsx`'s logo and `components/landing/hero-section.tsx`'s background image both correctly use `priority` (they're above the fold; Next.js's `priority` is the correct opposite of lazy-loading for LCP-critical images — these should **not** be changed).
- `components/landing/featured-properties-section.tsx`, `testimonials-section.tsx`, `property-owner-section.tsx`, and `founders-note-section.tsx` all already use the existing `LazyImage` component (`components/lazy-image.tsx`), which correctly implements both IntersectionObserver-based deferred mounting AND `loading="lazy"` on the underlying `next/image` — no fix needed there.
- The one real, unhandled instance: `components/footer.tsx`'s Linktree QR image has no `priority` and no explicit `loading`, and the footer is below the fold on every page. Next.js defaults to `loading="lazy"` for non-priority images, but making it explicit removes any doubt and matches the roadmap's literal ask.

- [ ] **Step 1: Fix `components/footer.tsx`**

Change:

```typescript
                  <Image
                    src="/Linktree.png"
                    alt="Linktree QR Code - Scan to access all social media"
                    width={52}
                    height={52}
                    className="h-8 w-8 rounded border bg-card p-0.5"
                    quality={85}
                    sizes="32px"
                  />
```

to:

```typescript
                  <Image
                    src="/Linktree.png"
                    alt="Linktree QR Code - Scan to access all social media"
                    width={52}
                    height={52}
                    className="h-8 w-8 rounded border bg-card p-0.5"
                    quality={85}
                    sizes="32px"
                    loading="lazy"
                  />
```

- [ ] **Step 2: Manual verification**

Run: `npm run dev`, open `http://localhost:3000/`, open DevTools → Elements, find the footer's Linktree `<img>`, confirm it has `loading="lazy"` in its rendered attributes.

- [ ] **Step 3: Commit**

```bash
git add components/footer.tsx
git commit -m "fix(perf): make footer QR image lazy-loading explicit

Header logo and hero background correctly use priority (above the fold,
should stay eager). The four landing-page sections the audit's raw image
count also touched already use the existing LazyImage component, which
already sets loading=lazy correctly. The footer Linktree QR image was the
one real gap — always below the fold, previously relying on Next's
implicit default instead of an explicit attribute."
```

---

## Post-implementation note for the next session

Two items surfaced during investigation that are out of scope for this plan but worth a follow-up:

1. `components/ui/badge.tsx`'s own default variant (`px-2.5 py-0.5`) is itself under the 44px touch-target guideline wherever `Badge` is used as an interactive element elsewhere in the app (17 total `rounded-full border` pill occurrences were found sitewide during Task 4 investigation; only the 2 confirmed-interactive ones on the audited page were fixed here). A follow-up pass should audit the other ~13 occurrences (`app/schools/[district]/page.tsx`, `app/faq/page.tsx`, `components/market-report-page.tsx`, `components/investments/investment-card.tsx`, `components/landing/featured-properties-section.tsx`, `components/landing/service-area-section.tsx`, `app/demo/demo-page-client.tsx`) for which ones are actually links/buttons (vs. static labels) and need the same fix.
2. `app/investments/[slug]/page.tsx`'s title suffix (`| Investment Opportunity`) is not a brand duplicate and was correctly left out of Task 2 — confirm this is intentional positioning, not a missed case, if anyone revisits title conventions.
