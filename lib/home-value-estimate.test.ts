import { describe, expect, it } from "vitest"
import { CITY_MARKET_AS_OF, cityMarketData } from "./city-market-data"
import { ESTIMATE_DATA_DISCLOSURE, estimateHomeValue } from "./home-value-estimate"

describe("estimateHomeValue", () => {
  it("returns a ±10% rent range around the city median for a 3-bed, 1800 sqft baseline", () => {
    const median = cityMarketData["Salt Lake City"].medianRent
    const estimate = estimateHomeValue("Salt Lake City", 3, 1800)
    expect(estimate).not.toBeNull()
    expect(estimate?.rentBase).toBe(median)
    expect(estimate?.rentLow).toBe(Math.round(median * 0.9))
    expect(estimate?.rentHigh).toBe(Math.round(median * 1.1))
  })

  it("returns null for an unknown city", () => {
    expect(estimateHomeValue("Not A City", 3, 1800)).toBeNull()
  })

  it("discloses Ondo city medians with an as-of stamp and no MLS or appraisal claim", () => {
    expect(ESTIMATE_DATA_DISCLOSURE).toContain(CITY_MARKET_AS_OF)
    expect(ESTIMATE_DATA_DISCLOSURE).toMatch(/as of .+ — verify/i)
    expect(ESTIMATE_DATA_DISCLOSURE).toMatch(/Ondo city medians/i)
    expect(ESTIMATE_DATA_DISCLOSURE).toMatch(/Not an MLS pull, appraisal, BPO, or CMA/i)
  })
})
