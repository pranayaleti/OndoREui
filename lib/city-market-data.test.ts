import { describe, expect, it } from "vitest"
import { CITY_MARKET_AS_OF, cityMarketData } from "./city-market-data"
import { FEE_COMPARISON_AS_OF } from "./fee-comparison"
import { utahCitiesFromNorthOgdenToNephi } from "./utah-cities"

describe("city market data vintage", () => {
  it("stamps Ondo city medians with an as-of month in the same voice as fee comparison", () => {
    expect(CITY_MARKET_AS_OF).toBe(FEE_COMPARISON_AS_OF)
    expect(CITY_MARKET_AS_OF).toMatch(/^[A-Z][a-z]{2} \d{4}$/)
  })
})

describe("city market data coverage and sanity", () => {
  const cityNames = utahCitiesFromNorthOgdenToNephi.map((c) => c.name)

  it("has an entry for every covered city and no entry for an unknown one", () => {
    expect(Object.keys(cityMarketData).sort()).toEqual([...cityNames].sort())
  })

  it("keeps every number the site renders positive and finite", () => {
    const bad: string[] = []
    for (const [city, m] of Object.entries(cityMarketData)) {
      const numbers: Record<string, number> = {
        medianHomePrice: m.medianHomePrice,
        medianRent: m.medianRent,
        population: m.population,
        avgDaysOnMarket: m.avgDaysOnMarket,
        medianHouseholdIncome: m.medianHouseholdIncome,
      }
      for (const [key, value] of Object.entries(numbers)) {
        if (!Number.isFinite(value) || value <= 0) bad.push(`${city}.${key}=${value}`)
      }
      if (m.ownerOccupiedPct < 0 || m.ownerOccupiedPct > 100) bad.push(`${city}.ownerOccupiedPct=${m.ownerOccupiedPct}`)
      for (const c of m.commuteTimes) {
        if (!Number.isFinite(c.minutes) || c.minutes <= 0 || c.minutes > 180) bad.push(`${city} commute ${c.destination}=${c.minutes}`)
      }
    }
    expect(bad).toEqual([])
  })

  it("gives rents a plausible ratio to home prices, so a dropped digit is caught", () => {
    const off = Object.entries(cityMarketData)
      .filter(([, m]) => {
        const annualRentToPrice = (m.medianRent * 12) / m.medianHomePrice
        return annualRentToPrice < 0.02 || annualRentToPrice > 0.12
      })
      .map(([city]) => city)
    expect(off).toEqual([])
  })
})
