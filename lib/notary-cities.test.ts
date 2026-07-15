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
