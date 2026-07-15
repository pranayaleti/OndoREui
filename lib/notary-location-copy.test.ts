// lib/notary-location-copy.test.ts
import { describe, expect, it } from "vitest"
import {
  buildCityRonIntro,
  buildCityRonFaqs,
  buildStateRonFaqs,
  friendlyTimezoneLabel,
  receivingPartyCaveat,
} from "./notary-location-copy"
import { getNotaryCity, NOTARY_CITIES, type NotaryCityRecord } from "./notary-cities"
import { getRonStateBySlug, type RonStateRecord } from "./notary-ron-states"

type LocalSignalCategory = "county" | "metro" | "timezone" | "nearby" | "utahMobile"

function getLocalIntroSignalCategories(
  city: NotaryCityRecord,
  state: RonStateRecord,
  intro: string
): Set<LocalSignalCategory> {
  const categories = new Set<LocalSignalCategory>()

  if (city.county && intro.includes(city.county)) {
    categories.add("county")
  }
  if (city.metro && intro.includes(city.metro)) {
    categories.add("metro")
  }
  if (city.timezone) {
    const tzLabel = friendlyTimezoneLabel(city.timezone)
    if (tzLabel && intro.includes(tzLabel)) {
      categories.add("timezone")
    }
  }
  if (
    (city.nearbyCitySlugs?.length ?? 0) > 0 &&
    (intro.includes("Nearby communities") ||
      city.nearbyCitySlugs!.some((slug) => {
        const name = getNotaryCity(city.stateSlug, slug)?.name ?? slug.replace(/-/g, " ")
        return intro.includes(name)
      }))
  ) {
    categories.add("nearby")
  }
  if (state.code === "UT" && /mobile|wasatch|in-office/i.test(intro)) {
    categories.add("utahMobile")
  }

  return categories
}

function assertNoCityLegalClaims(intro: string, cityName: string): void {
  expect(intro).not.toMatch(/ron is legal in/i)
  const cityPattern = new RegExp(`legal(ly)?\\s+in\\s+${cityName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i")
  expect(intro).not.toMatch(cityPattern)
}

describe("notary-location-copy", () => {
  it("builds a unique intro with local signals and no city-legal claim", () => {
    const city = getNotaryCity("california", "los-angeles")!
    const state = getRonStateBySlug("california")!
    const intro = buildCityRonIntro(city, state)

    assertNoCityLegalClaims(intro, city.name)
    expect(intro).toMatch(/Los Angeles/)
    expect(intro).toMatch(/California|CA/)

    const signals = getLocalIntroSignalCategories(city, state, intro)
    expect(signals.size).toBeGreaterThanOrEqual(2)
    expect(intro.length).toBeGreaterThan(120)

    expect(intro).toContain("Receiving parties")
    expect(intro).toMatch(/lenders|title companies/)
    expect(intro).toContain("Confirm acceptance")
    expect(intro).toContain(receivingPartyCaveat())
  })

  it("Utah intro mentions mobile availability", () => {
    const city = getNotaryCity("utah", "lehi")!
    const state = getRonStateBySlug("utah")!
    const intro = buildCityRonIntro(city, state)
    expect(intro.toLowerCase()).toMatch(/mobile|wasatch|in-office|utah/)

    const signals = getLocalIntroSignalCategories(city, state, intro)
    expect(signals.has("utahMobile")).toBe(true)
    expect(signals.size).toBeGreaterThanOrEqual(2)
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

  it("sample matrix: intros include at least two distinct local signal categories", () => {
    const samples = [
      ["california", "los-angeles"],
      ["texas", "houston"],
      ["new-york", "new-york-city"],
      ["florida", "miami"],
      ["utah", "lehi"],
      ["colorado", "denver"],
    ] as const

    for (const [stateSlug, citySlug] of samples) {
      const city = getNotaryCity(stateSlug, citySlug)
      const state = getRonStateBySlug(stateSlug)
      expect(city, `${stateSlug}/${citySlug} should exist in NOTARY_CITIES`).toBeDefined()
      expect(state).toBeDefined()

      const intro = buildCityRonIntro(city!, state!)
      assertNoCityLegalClaims(intro, city!.name)

      const signals = getLocalIntroSignalCategories(city!, state!, intro)
      expect(
        signals.size,
        `${city!.name}: expected ≥2 signal categories, got ${[...signals].join(", ") || "none"}`
      ).toBeGreaterThanOrEqual(2)
      expect(intro).toContain(receivingPartyCaveat())
    }
  })

  it("NOTARY_CITIES sample guard: every sampled city meets signal threshold", () => {
    const stride = Math.max(1, Math.floor(NOTARY_CITIES.length / 12))
    const sampled = NOTARY_CITIES.filter((_, i) => i % stride === 0).slice(0, 12)

    expect(sampled.length).toBeGreaterThanOrEqual(8)

    for (const city of sampled) {
      const state = getRonStateBySlug(city.stateSlug)!
      const intro = buildCityRonIntro(city, state)
      const signals = getLocalIntroSignalCategories(city, state, intro)
      expect(
        signals.size,
        `${city.stateSlug}/${city.slug}: expected ≥2 signal categories, got ${[...signals].join(", ") || "none"}`
      ).toBeGreaterThanOrEqual(2)
    }
  })
})
