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

describe("estimateHomeValue size handling", () => {
  const lehi = cityMarketData["Lehi"]

  it("keeps ordinary larger homes within about 1.5x the city median, not 1.7-2.4x", () => {
    const fourBed = estimateHomeValue("Lehi", 4, 2800)!
    expect(fourBed.saleBase).toBeGreaterThan(lehi.medianHomePrice)
    expect(fourBed.saleBase).toBeLessThan(lehi.medianHomePrice * 1.5)
    expect(fourBed.rentBase).toBeLessThan(lehi.medianRent * 1.5)

    const fiveBed = estimateHomeValue("Lehi", 5, 3500)!
    expect(fiveBed.saleBase).toBeLessThan(lehi.medianHomePrice * 1.8)
  })

  it("keeps small homes above half the city median", () => {
    const small = estimateHomeValue("Lehi", 1, 600)!
    expect(small.saleBase).toBeGreaterThanOrEqual(Math.round(lehi.medianHomePrice * 0.6 * 0.95) - 1)
    expect(small.saleBase).toBeLessThan(lehi.medianHomePrice)
  })

  it("grows with square footage and bedrooms", () => {
    const base = estimateHomeValue("Lehi", 3, 1800)!.saleBase
    expect(estimateHomeValue("Lehi", 3, 2400)!.saleBase).toBeGreaterThan(base)
    expect(estimateHomeValue("Lehi", 4, 1800)!.saleBase).toBeGreaterThan(base)
  })

  it("caps absurd square footage instead of extrapolating", () => {
    const huge = estimateHomeValue("Lehi", 3, 6000)!
    const capped = estimateHomeValue("Lehi", 3, 10_000)!
    expect(huge.saleBase).toBeLessThanOrEqual(Math.round(lehi.medianHomePrice * 1.8))
    expect(capped.saleBase).toBe(estimateHomeValue("Lehi", 3, 50_000)!.saleBase)
  })

  it("returns null below the minimum square footage or for bad input", () => {
    expect(estimateHomeValue("Lehi", 3, 0)).toBeNull()
    expect(estimateHomeValue("Lehi", 3, 399)).toBeNull()
    expect(estimateHomeValue("Lehi", 3, Number.NaN)).toBeNull()
    expect(estimateHomeValue("Lehi", 3, 400)).not.toBeNull()
  })
})
