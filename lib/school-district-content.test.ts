import { describe, it, expect } from "vitest"
import { cityContentByName } from "./city-content"
import { cityMarketData } from "./city-market-data"
import { findDistrictForCity, schoolDistricts } from "./school-district-content"

/** "Weber County School District" and "Weber School District" are the same district. */
const districtKey = (name: string) =>
  name
    .replace(/ School District$/i, "")
    .replace(/ (County|City)$/i, "")
    .trim()

describe("school district content", () => {
  const text = JSON.stringify(schoolDistricts)

  it("publishes no rankings or unsourced superlatives", () => {
    expect(text).not.toMatch(/#1|top 3|ranks? |ranked|premier|blue ribbon|national merit|above-average|consistently/i)
    expect(text).not.toMatch(/best/i)
  })

  it("lists a city only in the district that city-market-data says serves it", () => {
    const wrong: string[] = []
    for (const district of schoolDistricts) {
      for (const city of district.citiesServed) {
        const market = cityMarketData[city]
        if (!market) wrong.push(`${district.name} lists ${city}, which has no market data`)
        else if (districtKey(market.schoolDistrict) !== districtKey(district.name)) {
          wrong.push(`${district.name} lists ${city}, but market data says ${market.schoolDistrict}`)
        }
      }
    }
    expect(wrong).toEqual([])
  })

  it("lists every city market data places in a district that has a guide", () => {
    const missing: string[] = []
    for (const [city, market] of Object.entries(cityMarketData)) {
      const guide = schoolDistricts.find((d) => districtKey(d.name) === districtKey(market.schoolDistrict))
      if (guide && !guide.citiesServed.includes(city)) missing.push(`${guide.name} omits ${city}`)
    }
    expect(missing).toEqual([])
  })

  it("never names a different district in a city's prose than the one market data assigns", () => {
    const wrong: string[] = []
    for (const [city, content] of Object.entries(cityContentByName)) {
      const market = cityMarketData[city]
      if (!market) continue
      const named = [...JSON.stringify(content).matchAll(/([A-Z][a-z]+(?: [A-Z][a-z]+)*) (?:County |City )?School District/g)]
        .map((m) => m[1]!.replace(/^The /, ""))
      for (const name of new Set(named)) {
        if (districtKey(name) === districtKey(market.schoolDistrict)) continue
        // Murray's FAQ explains how its own district differs from the neighbors, so naming them is fine there.
        if (city === "Murray") continue
        wrong.push(`${city} prose names ${name}, market data says ${market.schoolDistrict}`)
      }
    }
    expect(wrong).toEqual([])
  })

  it("finds the district guide for a city, and none where no guide exists", () => {
    expect(findDistrictForCity("Layton")?.slug).toBe("davis-school-district")
    expect(findDistrictForCity("Holladay")).toBeUndefined()
  })

  it("keeps Northridge High School with Layton in the Davis guide, not Alpine", () => {
    const names = (slug: string) =>
      schoolDistricts.find((d) => d.slug === slug)?.schools.map((s) => s.name) ?? []
    expect(names("alpine-school-district")).not.toContain("Northridge High School")
    expect(names("davis-school-district")).toContain("Northridge High School")
  })
})
