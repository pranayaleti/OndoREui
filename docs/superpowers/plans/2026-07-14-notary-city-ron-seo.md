# Notary City RON SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship nationwide Notary SEO as nested state hubs (`/notary/[state]/`) plus curated city RON pages (`/notary/[state]/[city]/`) with unique copy, JSON-LD, and sitemap/discovery updates — no city × subtype pages.

**Architecture:** Curated allowlist modules (`lib/notary-ron-states.ts`, `lib/notary-cities.ts`) drive `generateStaticParams` for App Router routes under `app/notary/[state]/` and `app/notary/[state]/[city]/`. Shared page components render unique intros/FAQs from location data; discovery surfaces (sitemap, site-index, llms, search, nav) consume the same allowlist helpers. Static routes `on-demand` and `locations` stay reserved and win over `[state]`.

**Tech Stack:** Next.js 15 App Router, TypeScript, Vitest, existing `lib/seo.ts` (`buildPageMetadata`, breadcrumb/service/FAQ JSON-LD), `components/notary-booking.tsx`, `components/breadcrumb-nav.tsx`, `US_STATES` / `US_CITIES` from `lib/notary-service-areas.ts`, `utahCitiesFromNorthOgdenToNephi` from `lib/utah-cities.ts`.

## Global Constraints

- Geographic scope: **nationwide** (50 states + DC); no territories in v1
- Matrix depth **B**: state hubs + curated cities only; **no** city × `NOTARY_SERVICE_TYPES` pages
- URL shape: nested `/notary/[state]/` and `/notary/[state]/[city]/` (full state name slugs, e.g. `california`)
- Top-N = **10** max per state; fewer OK when curated source has fewer; **Utah** = union with all Wasatch Front cities from `lib/utah-cities.ts`
- City pages only when parent state `ronServingStatus === "serves"`; v1 all 50+DC = `serves`
- Copy: never claim “RON is legal in {city}”; frame as RON for clients in city/state + receiving-party caveat
- English only; OndoREui only; no Dashboard / Mobile / Backend
- Do not invent per-city NAP / storefront addresses; HQ address from `lib/site.ts` only
- Canonicals use trailing slash (`trailingSlash: true`)
- Do not dump ~27k `us-locations.json` rows into pages

---

## File map

| File | Responsibility |
|------|----------------|
| `lib/notary-ron-states.ts` | `RonStateRecord` for 50+DC; lookups; reserved segment set |
| `lib/notary-cities.ts` | Curated `NotaryCityRecord[]` allowlist + path/lookup helpers |
| `lib/notary-location-copy.ts` | Unique city intros + localized FAQ banks |
| `lib/notary-ron-states.test.ts` | State module tests |
| `lib/notary-cities.test.ts` | Allowlist / URL / Utah overlay tests |
| `lib/notary-location-copy.test.ts` | Uniqueness / copy rules tests |
| `components/notary-state-page.tsx` | State hub UI (server) |
| `components/notary-city-page.tsx` | City RON page UI (server) |
| `app/notary/locations/page.tsx` | Index of all state hubs |
| `app/notary/[state]/page.tsx` | State route + metadata + static params |
| `app/notary/[state]/[city]/page.tsx` | City route + metadata + static params |
| `app/sitemap.xml/route.ts` | Add locations + state + city URLs |
| `lib/site-index.ts` | Notary section + llms text pointers |
| `lib/search-index.ts` | Hubs + Utah cities (+ locations) |
| `components/navigation.tsx` | Add Locations child under Notary |
| `public/locales/en/common.json` | `nav.notaryLocations` string |
| `app/notary/notary-client.tsx` | Replace hidden query-param SEO with real hub links |
| `lib/notary-service-areas.ts` | Align `getServiceAreaUrls` / `getHiddenSEOContent` to nested URLs; stop advertising subtype/flat paths for sitemap |

---

### Task 1: RON state records module

**Files:**
- Create: `lib/notary-ron-states.ts`
- Test: `lib/notary-ron-states.test.ts`

**Interfaces:**
- Consumes: `US_STATES` from `lib/notary-service-areas.ts`
- Produces:
  - `export type RonServingStatus = "serves" | "does_not_serve"`
  - `export type RonStateRecord = { code: string; name: string; slug: string; ronServingStatus: RonServingStatus; statusNote?: string; lastReviewed: string }`
  - `export const RESERVED_NOTARY_SEGMENTS: ReadonlySet<string>`
  - `export const NOTARY_RON_STATES: RonStateRecord[]`
  - `export function getRonStateBySlug(slug: string): RonStateRecord | undefined`
  - `export function getServedRonStates(): RonStateRecord[]`
  - `export function isReservedNotarySegment(segment: string): boolean`

- [ ] **Step 1: Write the failing test**

```ts
// lib/notary-ron-states.test.ts
import { describe, expect, it } from "vitest"
import {
  NOTARY_RON_STATES,
  getRonStateBySlug,
  getServedRonStates,
  isReservedNotarySegment,
} from "./notary-ron-states"

describe("notary-ron-states", () => {
  it("includes 50 states + DC with unique slugs", () => {
    expect(NOTARY_RON_STATES).toHaveLength(51)
    const slugs = NOTARY_RON_STATES.map((s) => s.slug)
    expect(new Set(slugs).size).toBe(51)
    expect(getRonStateBySlug("california")?.code).toBe("CA")
    expect(getRonStateBySlug("district-of-columbia")?.code).toBe("DC")
  })

  it("marks all records as serves in v1", () => {
    expect(getServedRonStates()).toHaveLength(51)
    expect(NOTARY_RON_STATES.every((s) => s.ronServingStatus === "serves")).toBe(true)
  })

  it("reserves static notary segments", () => {
    expect(isReservedNotarySegment("on-demand")).toBe(true)
    expect(isReservedNotarySegment("locations")).toBe(true)
    expect(isReservedNotarySegment("california")).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- lib/notary-ron-states.test.ts`

Expected: FAIL (module not found / export missing)

- [ ] **Step 3: Write minimal implementation**

```ts
// lib/notary-ron-states.ts
import { US_STATES } from "./notary-service-areas"

export type RonServingStatus = "serves" | "does_not_serve"

export type RonStateRecord = {
  code: string
  name: string
  slug: string
  ronServingStatus: RonServingStatus
  statusNote?: string
  lastReviewed: string
}

export const RESERVED_NOTARY_SEGMENTS: ReadonlySet<string> = new Set([
  "on-demand",
  "locations",
])

const LAST_REVIEWED = "2026-07-14"

const DC: RonStateRecord = {
  code: "DC",
  name: "District of Columbia",
  slug: "district-of-columbia",
  ronServingStatus: "serves",
  statusNote:
    "Remote online notarization is available for clients in Washington, D.C. Receiving parties (lenders, title companies, courts) set their own acceptance rules.",
  lastReviewed: LAST_REVIEWED,
}

const fromUsStates: RonStateRecord[] = Object.entries(US_STATES).map(([code, data]) => ({
  code,
  name: data.name,
  slug: data.slug,
  ronServingStatus: "serves" as const,
  statusNote:
    "Remote online notarization is available for clients in this state. Receiving parties (lenders, title companies, courts) set their own acceptance rules — confirm before your signing.",
  lastReviewed: LAST_REVIEWED,
}))

export const NOTARY_RON_STATES: RonStateRecord[] = [...fromUsStates, DC].sort((a, b) =>
  a.name.localeCompare(b.name)
)

export function getRonStateBySlug(slug: string): RonStateRecord | undefined {
  return NOTARY_RON_STATES.find((s) => s.slug === slug)
}

export function getServedRonStates(): RonStateRecord[] {
  return NOTARY_RON_STATES.filter((s) => s.ronServingStatus === "serves")
}

export function isReservedNotarySegment(segment: string): boolean {
  return RESERVED_NOTARY_SEGMENTS.has(segment.toLowerCase())
}
```

- [ ] **Step 4: Run tests and make sure they pass**

Run: `npm run test:run -- lib/notary-ron-states.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/notary-ron-states.ts lib/notary-ron-states.test.ts
git commit -m "$(cat <<'EOF'
feat(notary): add RON state eligibility records for 50+DC

EOF
)"
```

---

### Task 2: Curated city allowlist module

**Files:**
- Create: `lib/notary-cities.ts`
- Test: `lib/notary-cities.test.ts`

**Interfaces:**
- Consumes: `US_CITIES`, `US_STATES`, `generateCitySlug` from `lib/notary-service-areas.ts`; `utahCitiesFromNorthOgdenToNephi`, `toCitySlug` from `lib/utah-cities.ts`; `getServedRonStates` from `lib/notary-ron-states.ts`
- Produces:
  - `export type NotaryCityRecord = { name: string; slug: string; stateCode: string; stateSlug: string; county?: string; metro?: string; timezone?: string; lat?: number; lng?: number; nearbyCitySlugs?: string[] }`
  - `export const NOTARY_CITIES: NotaryCityRecord[]`
  - `export function getNotaryCity(stateSlug: string, citySlug: string): NotaryCityRecord | undefined`
  - `export function getNotaryCitiesByStateSlug(stateSlug: string): NotaryCityRecord[]`
  - `export function getAllNotaryStateParams(): { state: string }[]`
  - `export function getAllNotaryCityParams(): { state: string; city: string }[]`
  - `export function notaryStatePath(stateSlug: string): string` → `/notary/{state}/`
  - `export function notaryCityPath(stateSlug: string, citySlug: string): string` → `/notary/{state}/{city}/`

**Curation rules (locked):**
1. Start from exported `US_CITIES` (already curated; typically ≤10 per state; fewer OK per spec).
2. Cap non-Utah states at **N = 10** (slice after stable sort by city name).
3. Utah: union with every city in `utahCitiesFromNorthOgdenToNephi` (may exceed N).
4. Only include cities whose `stateSlug` is in `getServedRonStates()`.
5. Enrich UT rows with `lat`/`lng`/`county` from utah-cities when names match.
6. Assign `timezone` from a primary IANA map by state code.
7. Set `nearbyCitySlugs` to up to 4 other same-state allowlisted city slugs (adjacent in name-sorted list).

- [ ] **Step 1: Write the failing test**

```ts
// lib/notary-cities.test.ts
import { describe, expect, it } from "vitest"
import {
  NOTARY_CITIES,
  getNotaryCity,
  getNotaryCitiesByStateSlug,
  getAllNotaryCityParams,
  getAllNotaryStateParams,
  notaryCityPath,
  notaryStatePath,
} from "./notary-cities"
import { utahCitiesFromNorthOgdenToNephi, toCitySlug } from "./utah-cities"
import { isReservedNotarySegment } from "./notary-ron-states"

describe("notary-cities", () => {
  it("builds hundreds of cities, not tens of thousands", () => {
    expect(NOTARY_CITIES.length).toBeGreaterThan(200)
    expect(NOTARY_CITIES.length).toBeLessThan(2000)
  })

  it("uses nested URL helpers", () => {
    expect(notaryStatePath("california")).toBe("/notary/california/")
    expect(notaryCityPath("california", "los-angeles")).toBe("/notary/california/los-angeles/")
  })

  it("resolves curated cities and 404s unknowns via undefined", () => {
    expect(getNotaryCity("california", "los-angeles")?.name).toBe("Los Angeles")
    expect(getNotaryCity("california", "not-a-real-city")).toBeUndefined()
  })

  it("includes all Wasatch Front Utah cities", () => {
    const ut = getNotaryCitiesByStateSlug("utah")
    for (const c of utahCitiesFromNorthOgdenToNephi) {
      expect(ut.some((x) => x.slug === toCitySlug(c.name))).toBe(true)
    }
    expect(ut.length).toBeGreaterThan(10)
  })

  it("caps non-Utah states at 10 cities", () => {
    const byState = new Map<string, number>()
    for (const c of NOTARY_CITIES) {
      byState.set(c.stateSlug, (byState.get(c.stateSlug) ?? 0) + 1)
    }
    for (const [slug, count] of byState) {
      if (slug === "utah") continue
      expect(count).toBeLessThanOrEqual(10)
    }
  })

  it("static params never include reserved segments", () => {
    for (const { state } of getAllNotaryStateParams()) {
      expect(isReservedNotarySegment(state)).toBe(false)
    }
    expect(getAllNotaryCityParams().every((p) => p.state && p.city)).toBe(true)
  })

  it("has unique state+city slug pairs", () => {
    const keys = NOTARY_CITIES.map((c) => `${c.stateSlug}/${c.slug}`)
    expect(new Set(keys).size).toBe(keys.length)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- lib/notary-cities.test.ts`

Expected: FAIL (module not found)

- [ ] **Step 3: Write minimal implementation**

```ts
// lib/notary-cities.ts
import { US_CITIES, US_STATES, generateCitySlug } from "./notary-service-areas"
import { utahCitiesFromNorthOgdenToNephi, toCitySlug } from "./utah-cities"
import { getServedRonStates } from "./notary-ron-states"

export type NotaryCityRecord = {
  name: string
  slug: string
  stateCode: string
  stateSlug: string
  county?: string
  metro?: string
  timezone?: string
  lat?: number
  lng?: number
  nearbyCitySlugs?: string[]
}

const MAX_CITIES_PER_STATE = 10

/** Primary IANA zone per state/DC for scheduling copy (not legal authority). */
const STATE_TIMEZONES: Record<string, string> = {
  AL: "America/Chicago", AK: "America/Anchorage", AZ: "America/Phoenix", AR: "America/Chicago",
  CA: "America/Los_Angeles", CO: "America/Denver", CT: "America/New_York", DE: "America/New_York",
  DC: "America/New_York", FL: "America/New_York", GA: "America/New_York", HI: "Pacific/Honolulu",
  ID: "America/Boise", IL: "America/Chicago", IN: "America/Indiana/Indianapolis", IA: "America/Chicago",
  KS: "America/Chicago", KY: "America/New_York", LA: "America/Chicago", ME: "America/New_York",
  MD: "America/New_York", MA: "America/New_York", MI: "America/Detroit", MN: "America/Chicago",
  MS: "America/Chicago", MO: "America/Chicago", MT: "America/Denver", NE: "America/Chicago",
  NV: "America/Los_Angeles", NH: "America/New_York", NJ: "America/New_York", NM: "America/Denver",
  NY: "America/New_York", NC: "America/New_York", ND: "America/Chicago", OH: "America/New_York",
  OK: "America/Chicago", OR: "America/Los_Angeles", PA: "America/New_York", RI: "America/New_York",
  SC: "America/New_York", SD: "America/Chicago", TN: "America/Chicago", TX: "America/Chicago",
  UT: "America/Denver", VT: "America/New_York", VA: "America/New_York", WA: "America/Los_Angeles",
  WV: "America/New_York", WI: "America/Chicago", WY: "America/Denver",
}

function stateSlugForCode(code: string): string | undefined {
  if (code === "DC") return "district-of-columbia"
  return (US_STATES as Record<string, { slug: string }>)[code]?.slug
}

function buildBaseRecords(): NotaryCityRecord[] {
  const served = new Set(getServedRonStates().map((s) => s.slug))
  const byKey = new Map<string, NotaryCityRecord>()

  for (const row of US_CITIES) {
    const stateSlug = stateSlugForCode(row.state)
    if (!stateSlug || !served.has(stateSlug)) continue
    const slug = generateCitySlug(row.city)
    const key = `${stateSlug}/${slug}`
    byKey.set(key, {
      name: row.city,
      slug,
      stateCode: row.state,
      stateSlug,
      county: row.county || undefined,
      metro: `${row.city} metro area`,
      timezone: STATE_TIMEZONES[row.state],
    })
  }

  for (const ut of utahCitiesFromNorthOgdenToNephi) {
    const slug = toCitySlug(ut.name)
    const key = `utah/${slug}`
    const existing = byKey.get(key)
    byKey.set(key, {
      name: ut.name,
      slug,
      stateCode: "UT",
      stateSlug: "utah",
      county: ut.county ? `${ut.county} County` : existing?.county,
      metro: existing?.metro ?? "Wasatch Front",
      timezone: STATE_TIMEZONES.UT,
      lat: ut.lat,
      lng: ut.lng,
    })
  }

  const grouped = new Map<string, NotaryCityRecord[]>()
  for (const record of byKey.values()) {
    const list = grouped.get(record.stateSlug) ?? []
    list.push(record)
    grouped.set(record.stateSlug, list)
  }

  const result: NotaryCityRecord[] = []
  for (const [stateSlug, cities] of grouped) {
    cities.sort((a, b) => a.name.localeCompare(b.name))
    const capped = stateSlug === "utah" ? cities : cities.slice(0, MAX_CITIES_PER_STATE)
    for (let i = 0; i < capped.length; i++) {
      const nearby: string[] = []
      for (let offset = 1; nearby.length < 4 && offset < capped.length; offset++) {
        const prev = capped[i - offset]
        const next = capped[i + offset]
        if (next) nearby.push(next.slug)
        if (nearby.length < 4 && prev) nearby.push(prev.slug)
      }
      result.push({ ...capped[i], nearbyCitySlugs: nearby })
    }
  }

  return result.sort((a, b) =>
    a.stateSlug === b.stateSlug ? a.name.localeCompare(b.name) : a.stateSlug.localeCompare(b.stateSlug)
  )
}

export const NOTARY_CITIES: NotaryCityRecord[] = buildBaseRecords()

export function getNotaryCity(stateSlug: string, citySlug: string): NotaryCityRecord | undefined {
  return NOTARY_CITIES.find((c) => c.stateSlug === stateSlug && c.slug === citySlug)
}

export function getNotaryCitiesByStateSlug(stateSlug: string): NotaryCityRecord[] {
  return NOTARY_CITIES.filter((c) => c.stateSlug === stateSlug)
}

export function getAllNotaryStateParams(): { state: string }[] {
  return getServedRonStates().map((s) => ({ state: s.slug }))
}

export function getAllNotaryCityParams(): { state: string; city: string }[] {
  return NOTARY_CITIES.map((c) => ({ state: c.stateSlug, city: c.slug }))
}

export function notaryStatePath(stateSlug: string): string {
  return `/notary/${stateSlug}/`
}

export function notaryCityPath(stateSlug: string, citySlug: string): string {
  return `/notary/${stateSlug}/${citySlug}/`
}
```

- [ ] **Step 4: Run tests and make sure they pass**

Run: `npm run test:run -- lib/notary-cities.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/notary-cities.ts lib/notary-cities.test.ts
git commit -m "$(cat <<'EOF'
feat(notary): add curated nationwide city allowlist with Utah overlay

EOF
)"
```

---

### Task 3: Unique location copy helpers

**Files:**
- Create: `lib/notary-location-copy.ts`
- Test: `lib/notary-location-copy.test.ts`

**Interfaces:**
- Consumes: `NotaryCityRecord`, `RonStateRecord`
- Produces:
  - `export type NotaryFaq = { question: string; answer: string }`
  - `export function buildCityRonIntro(city: NotaryCityRecord, state: RonStateRecord): string`
  - `export function buildStateRonFaqs(state: RonStateRecord): NotaryFaq[]`
  - `export function buildCityRonFaqs(city: NotaryCityRecord, state: RonStateRecord): NotaryFaq[]`
  - `export function receivingPartyCaveat(): string`

**Uniqueness rules:** intro must use ≥2 of county / metro / timezone / nearby / Utah mobile; never “legal in {city}”.

- [ ] **Step 1: Write the failing test**

```ts
// lib/notary-location-copy.test.ts
import { describe, expect, it } from "vitest"
import {
  buildCityRonIntro,
  buildCityRonFaqs,
  buildStateRonFaqs,
  receivingPartyCaveat,
} from "./notary-location-copy"
import { getNotaryCity } from "./notary-cities"
import { getRonStateBySlug } from "./notary-ron-states"

describe("notary-location-copy", () => {
  it("builds a unique intro with local signals and no city-legal claim", () => {
    const city = getNotaryCity("california", "los-angeles")!
    const state = getRonStateBySlug("california")!
    const intro = buildCityRonIntro(city, state)
    expect(intro.toLowerCase()).not.toContain("legal in los angeles")
    expect(intro).toMatch(/Los Angeles/)
    expect(intro).toMatch(/California|CA/)
    const signals = [city.county, city.metro, city.timezone, "nearby"]
      .filter(Boolean)
      .filter((s) => intro.includes(String(s).split(" ")[0]) || intro.includes("Nearby") || intro.includes("timezone") || intro.includes("Pacific") || intro.includes("County") || intro.includes("metro"))
    expect(signals.length).toBeGreaterThanOrEqual(1)
    expect(intro.length).toBeGreaterThan(120)
  })

  it("Utah intro mentions mobile availability", () => {
    const city = getNotaryCity("utah", "lehi")!
    const state = getRonStateBySlug("utah")!
    const intro = buildCityRonIntro(city, state)
    expect(intro.toLowerCase()).toMatch(/mobile|wasatch|in-office|utah/)
  })

  it("FAQs are localized and include receiving-party caveat", () => {
    const city = getNotaryCity("texas", "houston")!
    const state = getRonStateBySlug("texas")!
    const faqs = buildCityRonFaqs(city, state)
    expect(faqs.length).toBeGreaterThanOrEqual(4)
    expect(faqs.some((f) => f.answer.includes("Houston"))).toBe(true)
    expect(receivingPartyCaveat().toLowerCase()).toMatch(/receiving party|lender|title/)
    expect(buildStateRonFaqs(state).some((f) => f.answer.includes("Texas"))).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- lib/notary-location-copy.test.ts`

Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

```ts
// lib/notary-location-copy.ts
import type { NotaryCityRecord } from "./notary-cities"
import type { RonStateRecord } from "./notary-ron-states"

export type NotaryFaq = { question: string; answer: string }

export function receivingPartyCaveat(): string {
  return "Receiving parties — lenders, title companies, courts, and agencies — set their own rules for accepting remote online notarizations. Confirm acceptance before your session."
}

export function buildCityRonIntro(city: NotaryCityRecord, state: RonStateRecord): string {
  const parts: string[] = []
  parts.push(
    `ONDO Notary provides remote online notarization (RON) for clients in ${city.name}, ${state.name}.`
  )

  if (city.county && city.metro) {
    parts.push(
      `Whether you are in ${city.county} or elsewhere in the ${city.metro}, you can complete a secure video session with identity verification from home or office.`
    )
  } else if (city.county) {
    parts.push(
      `Clients across ${city.county} use RON for real estate, loan, and estate documents without traveling to a notary office.`
    )
  } else if (city.metro) {
    parts.push(
      `Across the ${city.metro}, RON lets you notarize documents on a schedule that fits busy workdays.`
    )
  }

  if (city.timezone) {
    parts.push(
      `Sessions are scheduled with ${city.timezone.replace(/_/g, " ")} availability in mind so closings and affidavits stay on track.`
    )
  }

  if (city.nearbyCitySlugs && city.nearbyCitySlugs.length > 0) {
    const labels = city.nearbyCitySlugs
      .slice(0, 3)
      .map((s) => s.replace(/-/g, " "))
      .join(", ")
    parts.push(`Nearby communities we also serve online include ${labels}.`)
  }

  if (state.code === "UT") {
    parts.push(
      `In Utah’s Wasatch Front we also offer mobile and in-office notary when you prefer an in-person appointment; RON remains available nationwide.`
    )
  }

  parts.push(receivingPartyCaveat())
  return parts.join(" ")
}

export function buildStateRonFaqs(state: RonStateRecord): NotaryFaq[] {
  return [
    {
      question: `Is remote online notary available in ${state.name}?`,
      answer: `Yes. ONDO Notary offers RON for clients in ${state.name}. ${receivingPartyCaveat()}`,
    },
    {
      question: `How does a RON session work in ${state.name}?`,
      answer: `You join a secure video session, complete identity verification, review your documents, and e-sign while a commissioned notary completes the notarization online.`,
    },
    {
      question: `Do I need a local notary office in ${state.name}?`,
      answer: `No for RON — you can complete the session from anywhere with a supported device and internet. ${state.code === "UT" ? "Utah clients can also book mobile or in-office notary along the Wasatch Front." : "Mobile and in-office notary from ONDO is focused on Utah; elsewhere we specialize in RON."}`,
    },
    {
      question: `What documents can be notarized for ${state.name} clients?`,
      answer: `Common use cases include real estate packages, loan signings, estate planning documents, powers of attorney, and affidavits — subject to receiving-party acceptance.`,
    },
  ]
}

export function buildCityRonFaqs(city: NotaryCityRecord, state: RonStateRecord): NotaryFaq[] {
  const shared = buildStateRonFaqs(state).map((f) => ({
    question: f.question.replace(state.name, `${city.name}, ${state.name}`),
    answer: f.answer,
  }))
  const local: NotaryFaq[] = [
    {
      question: `Can I get an online notary in ${city.name}?`,
      answer: `Yes. ONDO Notary serves clients in ${city.name}, ${state.code} through remote online notarization. ${city.county ? `Many signers in ${city.county} choose RON for faster scheduling. ` : ""}${receivingPartyCaveat()}`,
    },
    {
      question: `Is RON the same as a notary near me in ${city.name}?`,
      answer: `RON replaces an in-person stamp with a secure online session. You still work with a commissioned notary; you do not need to drive to a storefront in ${city.name}.`,
    },
  ]
  return [...local, ...shared].slice(0, 6)
}
```

- [ ] **Step 4: Run tests and make sure they pass**

Run: `npm run test:run -- lib/notary-location-copy.test.ts`

Expected: PASS (adjust intro assertions if a city lacks county — Los Angeles in `US_CITIES` has county)

- [ ] **Step 5: Commit**

```bash
git add lib/notary-location-copy.ts lib/notary-location-copy.test.ts
git commit -m "$(cat <<'EOF'
feat(notary): add unique RON intro and FAQ copy helpers

EOF
)"
```

---

### Task 4: State hub page + `/notary/locations`

**Files:**
- Create: `components/notary-state-page.tsx`
- Create: `app/notary/[state]/page.tsx`
- Create: `app/notary/locations/page.tsx`

**Interfaces:**
- Consumes: `getRonStateBySlug`, `isReservedNotarySegment`, `getServedRonStates`; `getNotaryCitiesByStateSlug`, `notaryCityPath`, `notaryStatePath`; `buildStateRonFaqs`; `buildPageMetadata`, `generateBreadcrumbJsonLd`, `generateServiceJsonLd`, `generateFAQJsonLd`; `NotaryBooking`; `BreadcrumbNav`
- Produces: static state hubs + locations index; unknown/reserved → `notFound()`

- [ ] **Step 1: Create the state page component**

```tsx
// components/notary-state-page.tsx
import Link from "next/link"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { NotaryBooking } from "@/components/notary-booking"
import { Button } from "@/components/ui/button"
import type { RonStateRecord } from "@/lib/notary-ron-states"
import type { NotaryCityRecord } from "@/lib/notary-cities"
import { notaryCityPath } from "@/lib/notary-cities"
import { buildStateRonFaqs, receivingPartyCaveat } from "@/lib/notary-location-copy"
import { SITE_EMAILS } from "@/lib/site"

type Props = {
  state: RonStateRecord
  cities: NotaryCityRecord[]
}

export function NotaryStatePage({ state, cities }: Props) {
  const faqs = buildStateRonFaqs(state)

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <BreadcrumbNav
          items={[
            { label: "Notary", href: "/notary/" },
            { label: "Locations", href: "/notary/locations/" },
            { label: state.name },
          ]}
        />

        <header className="mt-6 mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Remote online notary for {state.name}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Secure Remote Online Notarization (RON) for clients in {state.name}. Identity-verified
            video sessions for real estate, loan signings, and estate documents.
          </p>
          {state.statusNote ? (
            <p className="mt-3 text-sm text-muted-foreground max-w-3xl">{state.statusNote}</p>
          ) : null}
        </header>

        <section className="mb-12" aria-labelledby="how-ron-works">
          <h2 id="how-ron-works" className="text-2xl font-semibold mb-4">
            How RON works
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
            <li>Book a session online or email {SITE_EMAILS.notary}.</li>
            <li>Join a secure video call and complete identity verification.</li>
            <li>Review and e-sign while our notary completes the notarization.</li>
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">{receivingPartyCaveat()}</p>
        </section>

        <section className="mb-12" aria-labelledby="cities-heading">
          <h2 id="cities-heading" className="text-2xl font-semibold mb-4">
            Cities we highlight in {state.name}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {cities.map((city) => (
              <li key={city.slug}>
                <Link
                  href={notaryCityPath(state.slug, city.slug)}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Remote online notary in {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {state.code === "UT" ? (
          <section className="mb-12" aria-labelledby="utah-mobile">
            <h2 id="utah-mobile" className="text-2xl font-semibold mb-4">
              Mobile and in-office in Utah
            </h2>
            <p className="text-muted-foreground">
              Along the Wasatch Front we also offer mobile and in-office notary. RON remains available
              for clients anywhere in Utah and nationwide.
            </p>
          </section>
        ) : null}

        <section className="mb-12" aria-labelledby="related">
          <h2 id="related" className="text-2xl font-semibold mb-4">
            Related
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button asChild variant="outline">
              <Link href="/notary/">Notary home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/notary/on-demand/">On-demand notary</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/notary/locations/">All states</Link>
            </Button>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold mb-4">
            {state.name} notary FAQ
          </h2>
          <dl className="space-y-4">
            {faqs.map((f) => (
              <div key={f.question}>
                <dt className="font-medium text-foreground">{f.question}</dt>
                <dd className="mt-1 text-muted-foreground">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mb-16" aria-labelledby="book-heading">
          <h2 id="book-heading" className="sr-only">
            Book
          </h2>
          <NotaryBooking />
        </section>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Create the state route**

```tsx
// app/notary/[state]/page.tsx
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import SEO from "@/components/seo"
import { NotaryStatePage } from "@/components/notary-state-page"
import {
  getRonStateBySlug,
  isReservedNotarySegment,
} from "@/lib/notary-ron-states"
import {
  getAllNotaryStateParams,
  getNotaryCitiesByStateSlug,
} from "@/lib/notary-cities"
import { buildStateRonFaqs } from "@/lib/notary-location-copy"
import {
  buildPageMetadata,
  generateBreadcrumbJsonLd,
  generateFAQJsonLd,
  generateServiceJsonLd,
} from "@/lib/seo"
import { SITE_URL } from "@/lib/site"

type Params = Promise<{ state: string }>

export function generateStaticParams() {
  return getAllNotaryStateParams()
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { state: stateSlug } = await params
  if (isReservedNotarySegment(stateSlug)) return {}
  const state = getRonStateBySlug(stateSlug)
  if (!state || state.ronServingStatus !== "serves") return {}
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
}

export default async function NotaryStateRoute({ params }: { params: Params }) {
  const { state: stateSlug } = await params
  if (isReservedNotarySegment(stateSlug)) notFound()
  const state = getRonStateBySlug(stateSlug)
  if (!state || state.ronServingStatus !== "serves") notFound()

  const cities = getNotaryCitiesByStateSlug(state.slug)
  const faqs = buildStateRonFaqs(state)
  const base = SITE_URL.replace(/\/$/, "")

  return (
    <>
      <SEO
        title={`Remote Online Notary in ${state.name} | ONDO Notary`}
        description={`Secure remote online notarization (RON) for clients in ${state.name}.`}
        pathname={`/notary/${state.slug}/`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: base },
            { name: "Notary", url: `${base}/notary/` },
            { name: state.name, url: `${base}/notary/${state.slug}/` },
          ]),
          generateServiceJsonLd({
            name: `Remote Online Notarization in ${state.name}`,
            description: `RON for clients in ${state.name}`,
            serviceType: "Remote Online Notarization",
            areaServed: state.name,
          }),
          generateFAQJsonLd(
            faqs.map((f) => ({ question: f.question, answer: f.answer }))
          ),
        ]}
      />
      <NotaryStatePage state={state} cities={cities} />
    </>
  )
}
```

- [ ] **Step 3: Create locations index**

```tsx
// app/notary/locations/page.tsx
import Link from "next/link"
import type { Metadata } from "next"
import SEO from "@/components/seo"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { getServedRonStates } from "@/lib/notary-ron-states"
import { getNotaryCitiesByStateSlug, notaryStatePath } from "@/lib/notary-cities"
import { buildPageMetadata, generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = buildPageMetadata({
  title: "Notary Locations by State | ONDO Notary",
  description:
    "Browse remote online notary state hubs across all 50 U.S. states and Washington, D.C. Find curated city RON pages and book a secure session.",
  pathname: "/notary/locations/",
})

export default function NotaryLocationsPage() {
  const states = getServedRonStates()
  const base = SITE_URL.replace(/\/$/, "")

  return (
    <>
      <SEO
        title="Notary Locations by State | ONDO Notary"
        description="Browse remote online notary state hubs across all 50 U.S. states and Washington, D.C."
        pathname="/notary/locations/"
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: base },
          { name: "Notary", url: `${base}/notary/` },
          { name: "Locations", url: `${base}/notary/locations/` },
        ])}
      />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <BreadcrumbNav
            items={[
              { label: "Notary", href: "/notary/" },
              { label: "Locations" },
            ]}
          />
          <h1 className="mt-6 text-4xl font-bold tracking-tight">Notary locations</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Remote online notarization for clients nationwide. Choose a state hub to see curated
            city pages and book a session.
          </p>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {states.map((state) => {
              const count = getNotaryCitiesByStateSlug(state.slug).length
              return (
                <li key={state.slug}>
                  <Link
                    href={notaryStatePath(state.slug)}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {state.name}
                  </Link>
                  <span className="text-muted-foreground text-sm"> · {count} cities</span>
                </li>
              )
            })}
          </ul>
        </div>
      </main>
    </>
  )
}
```

- [ ] **Step 4: Smoke-check reserved collision**

Run: `npm run test:run -- lib/notary-ron-states.test.ts lib/notary-cities.test.ts`

Then manually confirm (dev server optional): `/notary/on-demand/` still renders the static page; `/notary/locations/` renders the new index; `/notary/california/` renders the hub.

- [ ] **Step 5: Commit**

```bash
git add components/notary-state-page.tsx app/notary/\[state\]/page.tsx app/notary/locations/page.tsx
git commit -m "$(cat <<'EOF'
feat(notary): add state hub routes and locations index

EOF
)"
```

---

### Task 5: City RON page route

**Files:**
- Create: `components/notary-city-page.tsx`
- Create: `app/notary/[state]/[city]/page.tsx`

**Interfaces:**
- Consumes: city/state lookups, copy helpers, SEO helpers, `NotaryBooking`, `BreadcrumbNav`
- Produces: allowlisted city pages; unknown → `notFound()`
- JSON-LD: BreadcrumbList, Service (`areaServed` city+state), FAQPage; optional GeoCoordinates on Service/provider area only when `lat`/`lng` exist; LocalBusiness uses **HQ** address from site constants with `areaServed` = city/state (no fake local NAP)

- [ ] **Step 1: Create the city page component**

```tsx
// components/notary-city-page.tsx
import Link from "next/link"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { NotaryBooking } from "@/components/notary-booking"
import type { NotaryCityRecord } from "@/lib/notary-cities"
import { notaryCityPath, notaryStatePath } from "@/lib/notary-cities"
import type { RonStateRecord } from "@/lib/notary-ron-states"
import {
  buildCityRonFaqs,
  buildCityRonIntro,
  receivingPartyCaveat,
} from "@/lib/notary-location-copy"
import { SITE_EMAILS } from "@/lib/site"

type Props = {
  city: NotaryCityRecord
  state: RonStateRecord
  nearby: NotaryCityRecord[]
}

export function NotaryCityPage({ city, state, nearby }: Props) {
  const intro = buildCityRonIntro(city, state)
  const faqs = buildCityRonFaqs(city, state)

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <BreadcrumbNav
          items={[
            { label: "Notary", href: "/notary/" },
            { label: state.name, href: notaryStatePath(state.slug) },
            { label: city.name },
          ]}
        />

        <header className="mt-6 mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Remote online notary in {city.name}, {state.code}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">{intro}</p>
        </header>

        <section className="mb-12" aria-labelledby="how-session">
          <h2 id="how-session" className="text-2xl font-semibold mb-4">
            How a RON session works
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
            <li>Schedule online or contact {SITE_EMAILS.notary}.</li>
            <li>Join from {city.name} (or anywhere) on a supported device.</li>
            <li>Complete ID check, review documents, and finish e-notarization.</li>
          </ol>
        </section>

        <section className="mb-12" aria-labelledby="who-for">
          <h2 id="who-for" className="text-2xl font-semibold mb-4">
            Who it is for
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>Real estate buyers, sellers, and agents closing remotely</li>
            <li>Loan signings and refinance packages</li>
            <li>Estate planning, powers of attorney, and affidavits</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            {state.statusNote ?? receivingPartyCaveat()}
          </p>
        </section>

        {nearby.length > 0 ? (
          <section className="mb-12" aria-labelledby="nearby">
            <h2 id="nearby" className="text-2xl font-semibold mb-4">
              Nearby cities
            </h2>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {nearby.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={notaryCityPath(state.slug, n.slug)}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {n.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mb-12" aria-labelledby="faq">
          <h2 id="faq" className="text-2xl font-semibold mb-4">
            {city.name} FAQ
          </h2>
          <dl className="space-y-4">
            {faqs.map((f) => (
              <div key={f.question}>
                <dt className="font-medium">{f.question}</dt>
                <dd className="mt-1 text-muted-foreground">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mb-16">
          <NotaryBooking />
        </section>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Create the city route**

```tsx
// app/notary/[state]/[city]/page.tsx
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import SEO from "@/components/seo"
import { NotaryCityPage } from "@/components/notary-city-page"
import {
  getAllNotaryCityParams,
  getNotaryCity,
  getNotaryCitiesByStateSlug,
} from "@/lib/notary-cities"
import { getRonStateBySlug, isReservedNotarySegment } from "@/lib/notary-ron-states"
import { buildCityRonFaqs } from "@/lib/notary-location-copy"
import {
  buildPageMetadata,
  generateBreadcrumbJsonLd,
  generateFAQJsonLd,
  generateLocalBusinessJsonLd,
  generateServiceJsonLd,
} from "@/lib/seo"
import {
  SITE_URL,
  SITE_PHONE,
  SITE_ADDRESS_OBJ,
  SITE_HOURS,
} from "@/lib/site"

type Params = Promise<{ state: string; city: string }>

export function generateStaticParams() {
  return getAllNotaryCityParams()
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params
  if (isReservedNotarySegment(stateSlug)) return {}
  const state = getRonStateBySlug(stateSlug)
  const city = getNotaryCity(stateSlug, citySlug)
  if (!state || !city || state.ronServingStatus !== "serves") return {}
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
}

export default async function NotaryCityRoute({ params }: { params: Params }) {
  const { state: stateSlug, city: citySlug } = await params
  if (isReservedNotarySegment(stateSlug)) notFound()
  const state = getRonStateBySlug(stateSlug)
  const city = getNotaryCity(stateSlug, citySlug)
  if (!state || !city || state.ronServingStatus !== "serves") notFound()

  const nearby = getNotaryCitiesByStateSlug(state.slug).filter(
    (c) => city.nearbyCitySlugs?.includes(c.slug)
  )
  const faqs = buildCityRonFaqs(city, state)
  const base = SITE_URL.replace(/\/$/, "")
  const pageUrl = `${base}/notary/${state.slug}/${city.slug}/`

  const serviceLd = generateServiceJsonLd({
    name: `Remote Online Notarization in ${city.name}, ${state.code}`,
    description: `RON for clients in ${city.name}, ${state.name}`,
    serviceType: "Remote Online Notarization",
    areaServed: `${city.name}, ${state.name}`,
  })

  const businessLd = generateLocalBusinessJsonLd({
    name: "ONDO Notary Services",
    url: pageUrl,
    telephone: SITE_PHONE,
    openingHours: SITE_HOURS,
    areaServed: `${city.name}, ${state.name}`,
    address: {
      streetAddress: SITE_ADDRESS_OBJ.streetAddress,
      addressLocality: SITE_ADDRESS_OBJ.addressLocality,
      addressRegion: SITE_ADDRESS_OBJ.addressRegion,
      postalCode: SITE_ADDRESS_OBJ.postalCode,
      addressCountry: SITE_ADDRESS_OBJ.addressCountry,
    },
    ...(city.lat != null && city.lng != null
      ? { geo: { latitude: city.lat, longitude: city.lng } }
      : {}),
  })

  return (
    <>
      <SEO
        title={`Remote Online Notary in ${city.name}, ${state.code} | ONDO Notary`}
        description={`Secure remote online notarization in ${city.name}, ${state.name}.`}
        pathname={`/notary/${state.slug}/${city.slug}/`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: base },
            { name: "Notary", url: `${base}/notary/` },
            { name: state.name, url: `${base}/notary/${state.slug}/` },
            { name: city.name, url: pageUrl },
          ]),
          serviceLd,
          businessLd,
          generateFAQJsonLd(
            faqs.map((f) => ({ question: f.question, answer: f.answer }))
          ),
        ]}
      />
      <NotaryCityPage city={city} state={state} nearby={nearby} />
    </>
  )
}
```

- [ ] **Step 3: Typecheck routes**

Run: `npx tsc --noEmit -p tsconfig.json 2>&1 | head -80`

Expected: no errors in new notary files (fix any type mismatches in `generateServiceJsonLd` `areaServed` if it expects State-only — if so, pass `state.name` to Service and keep city in `name`/`description`, or extend call to match existing `ServiceData` shape).

If `generateServiceJsonLd` forces `areaServed` into `@type: State`, keep `areaServed: state.name` and put city in the service `name` (already done) — do **not** invent a new SEO helper unless needed.

- [ ] **Step 4: Commit**

```bash
git add components/notary-city-page.tsx app/notary/\[state\]/\[city\]/page.tsx
git commit -m "$(cat <<'EOF'
feat(notary): add curated city RON pages under nested state routes

EOF
)"
```

---

### Task 6: Sitemap, site-index, llms, search, nav

**Files:**
- Modify: `app/sitemap.xml/route.ts`
- Modify: `lib/site-index.ts` (notary section ~528+, `buildLlmsTxt` / `buildLlmsFullTxt` notary bullets)
- Modify: `lib/search-index.ts`
- Modify: `components/navigation.tsx`
- Modify: `public/locales/en/common.json`

**Interfaces:**
- Consumes: `getAllNotaryStateParams`, `getAllNotaryCityParams`, `notaryStatePath`, `notaryCityPath`, `getServedRonStates`
- Produces: XML + HTML discovery consistency; nav child “Locations” only (no city dump)

- [ ] **Step 1: Update XML sitemap**

In `app/sitemap.xml/route.ts`:

1. Add `"/notary/on-demand"` and `"/notary/locations"` to `STATIC_PATHS` (keep `"/notary"`).
2. Import helpers and append state + city URL entries after static/calculator blocks:

```ts
import { getAllNotaryCityParams, getAllNotaryStateParams } from "@/lib/notary-cities"

// inside GET(), after staticUrls:
const notaryStateUrls = getAllNotaryStateParams().map(({ state }) => {
  const loc = `${SITE_URL}/notary/${state}`
  return `  <url><loc>${escapeXml(loc)}</loc><changefreq>monthly</changefreq><priority>0.65</priority></url>`
})
const notaryCityUrls = getAllNotaryCityParams().map(({ state, city }) => {
  const loc = `${SITE_URL}/notary/${state}/${city}`
  return `  <url><loc>${escapeXml(loc)}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`
})

// join: [...staticUrls, ...calculatorUrls, ...notaryStateUrls, ...notaryCityUrls, ...listingUrls]
```

Do **not** add `/notary/{service}/{city-state}` combinations.

- [ ] **Step 2: Update site-index + llms**

In `lib/site-index.ts` notary section links, add:

```ts
{ name: "Notary locations", href: "/notary/locations", description: "State hubs for nationwide RON." },
{ name: "Remote online notary in Utah", href: "/notary/utah", description: "Utah RON hub + Wasatch cities." },
{ name: "Remote online notary in California", href: "/notary/california", description: "California RON hub." },
```

Do **not** list every city in site-index. In `buildLlmsTxt` / `buildLlmsFullTxt`, update the Notary bullets to mention `/notary/locations` and 1–2 example nested URLs (e.g. `/notary/utah/lehi/`, `/notary/california/los-angeles/`).

- [ ] **Step 3: Update search-index**

In `lib/search-index.ts`, after the existing notary entries, add locations + all state hubs + Utah cities only (avoid indexing every national city if noisy):

```ts
{
  id: 'notary-locations',
  title: 'Notary locations',
  description: 'State hubs for remote online notary nationwide',
  href: '/notary/locations',
  keywords: ['notary locations', 'RON states', 'online notary near me']
},
```

Plus a small loop at module init or static array built from `getServedRonStates()` and `getNotaryCitiesByStateSlug('utah')` — keep keywords short.

- [ ] **Step 4: Nav + i18n**

`public/locales/en/common.json` under `nav`:

```json
"notaryLocations": "Locations"
```

`components/navigation.tsx` Notary children:

```ts
{ href: "/notary", labelKey: "nav.notaryServices" },
{ href: "/notary/on-demand", labelKey: "nav.onDemandNotary" },
{ href: "/notary/locations", labelKey: "nav.notaryLocations" },
```

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.xml/route.ts lib/site-index.ts lib/search-index.ts components/navigation.tsx public/locales/en/common.json
git commit -m "$(cat <<'EOF'
feat(notary): wire locations hubs into sitemap, index, search, and nav

EOF
)"
```

---

### Task 7: Cleanup hidden SEO + align URL helpers

**Files:**
- Modify: `app/notary/notary-client.tsx`
- Modify: `lib/notary-service-areas.ts` (`getServiceAreaUrls`, `getHiddenSEOContent`)

**Goal:** Retire sr-only query-param keyword walls; point helpers at nested allowlist URLs; ensure `generateAllCityServiceCombinations` is unused by sitemap (leave function but add a comment that v1 SEO must not emit subtype routes — or make it return `[]` if anything still imports it for discovery).

- [ ] **Step 1: Replace hidden blocks on `/notary`**

In `app/notary/notary-client.tsx`:

1. Remove `getHiddenSEOContent` usage and both `sr-only` / `aria-hidden` link dumps.
2. Add a visible “Browse by state” section linking to `/notary/locations/` and a short list of featured state hubs (e.g. Utah, California, Texas, Florida, New York) using `notaryStatePath`.

Example replacement section (visible, not sr-only):

```tsx
<section className="mt-12" aria-labelledby="browse-states">
  <h2 id="browse-states" className="text-2xl font-semibold mb-4">Browse notary by state</h2>
  <p className="text-muted-foreground mb-4">
    Explore state hubs and curated city pages for remote online notarization.
  </p>
  <Link href="/notary/locations/" className="text-primary underline-offset-4 hover:underline">
    All notary locations
  </Link>
</section>
```

Also trim the enormous `notaryKeywords` spread from `getKeywordsString()` if it still dumps thousands of tokens — keep a short curated keyword array on the national page.

- [ ] **Step 2: Align `getServiceAreaUrls`**

In `lib/notary-service-areas.ts`, change `getServiceAreaUrls` to emit nested paths from the new modules (import `getAllNotaryStateParams` / `getAllNotaryCityParams`) instead of flat `/notary/{city}-{state}` and instead of reading all `us-locations.json` cities. Prefer:

```ts
getServiceAreaUrls: () => {
  const lastmod = new Date().toISOString().split("T")[0]
  // Implement by importing from ./notary-cities to avoid dual sources of truth.
  ...
}
```

If circular imports appear (`notary-cities` imports `US_CITIES` from this file), keep sitemap on `notary-cities` helpers only and change `getServiceAreaUrls` to a thin deprecated wrapper that returns `[]` with a comment pointing to `lib/notary-cities.ts`.

- [ ] **Step 3: Neutralize subtype generator for discovery**

At `generateAllCityServiceCombinations`, add:

```ts
/**
 * @deprecated v1 Notary SEO does not ship city × service subtype pages.
 * Do not use in sitemap or generateStaticParams.
 */
```

Confirm no sitemap/route imports it (`rg generateAllCityServiceCombinations`).

- [ ] **Step 4: Light link update on the 50-states blog**

In `app/blog/remote-online-notary-all-50-states/page.tsx`, add a visible link to `/notary/locations/` near the top CTA (keep existing content).

- [ ] **Step 5: Commit**

```bash
git add app/notary/notary-client.tsx lib/notary-service-areas.ts app/blog/remote-online-notary-all-50-states/page.tsx
git commit -m "$(cat <<'EOF'
fix(notary): replace hidden query-param SEO with real location hubs

EOF
)"
```

---

### Task 8: Verification gate

**Files:**
- Test: existing `lib/seo.test.ts` (should still pass)
- Test: new notary unit tests

- [ ] **Step 1: Run unit tests**

```bash
npm run test:run -- lib/notary-ron-states.test.ts lib/notary-cities.test.ts lib/notary-location-copy.test.ts lib/seo.test.ts
```

Expected: all PASS

- [ ] **Step 2: Typecheck / lint**

```bash
npm run lint
npx tsc --noEmit
```

Expected: clean for touched files

- [ ] **Step 3: Manual route checklist**

With `npm run dev`:

| URL | Expected |
|-----|----------|
| `/notary/on-demand/` | Existing on-demand page (unchanged) |
| `/notary/locations/` | State list |
| `/notary/california/` | CA hub with city links |
| `/notary/california/los-angeles/` | City page with unique intro + FAQ |
| `/notary/utah/lehi/` | Utah city; mobile callout |
| `/notary/california/not-a-city/` | 404 |
| `/notary/on-demand/` vs `/notary/foo/` | static wins; unknown state 404 |
| `/sitemap.xml` | Contains `/notary/locations`, state + city nested URLs; **no** `/notary/loan-signing/...` |

- [ ] **Step 4: Final commit if any fixes**

```bash
git add -A
git status
git commit -m "$(cat <<'EOF'
test(notary): verify nationwide RON location SEO pages

EOF
)"
```

Only commit if there are leftover fixes; otherwise skip empty commit.

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|------------------|------|
| Nested `/notary/[state]` + `/notary/[state]/[city]` | 4, 5 |
| Reserved `on-demand`, `locations` | 1, 4 |
| State RON model + serves-only pages | 1, 2, 4, 5 |
| Top-N + Utah overlay; no 27k dump | 2 |
| Unique intro/FAQ; no city-legal claims | 3, 5 |
| JSON-LD breadcrumbs/Service/FAQ; HQ NAP; optional city geo | 5 |
| Sitemap / locations / site-index / llms / search / nav | 6 |
| Remove hidden query-param SEO; no subtype routes | 7 |
| English only; OndoREui only | Global constraints |

**Placeholder scan:** none intentional — city allowlist is fully determined from `US_CITIES` + Utah overlay (N=10 cap; fewer OK per spec).

**Type consistency:** `RonStateRecord`, `NotaryCityRecord`, `NotaryFaq`, path helpers, and param shapes are shared across tasks as defined in Tasks 1–3.
