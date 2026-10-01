import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { US_CITIES, US_STATES, generateCitySlug } from "./notary-service-areas"
import { NOTARY_RON_STATES } from "./notary-ron-states"

describe("notary-service-areas", () => {
  it("ships only city, state and county for each city (no generated ZIP lists)", () => {
    for (const row of US_CITIES) {
      expect(Object.keys(row).sort()).toEqual(["city", "county", "state", "stateName"])
    }
  })

  it("lists only real states, so no territory can leak into the RON states", () => {
    expect(Object.keys(US_STATES)).toHaveLength(50)
    expect(US_CITIES.every((c) => c.state in US_STATES || c.state === "DC")).toBe(true)
    const names = NOTARY_RON_STATES.map((s) => s.name)
    expect(names).not.toContain("American Samoa")
    expect(names).not.toContain("Guam")
    expect(names).toHaveLength(51)
  })

  it("does not read the location JSON from disk at import time", () => {
    const source = readFileSync(join(__dirname, "notary-service-areas.ts"), "utf-8")
    expect(source).not.toMatch(/eval\(|us-locations|readFileSync/)
  })

  it("slugifies city names", () => {
    expect(generateCitySlug("Salt Lake City")).toBe("salt-lake-city")
    expect(generateCitySlug("St. George")).toBe("st-george")
  })
})
