import { describe, expect, it } from "vitest"
import {
  NUMBERS_DEFAULTS,
  numbersLeadMessage,
  overpricingCost,
  rateGap,
  vacancyCost,
} from "./numbers-calculator"

describe("rateGap", () => {
  it("prices a half-point gap on the default loan", () => {
    const result = rateGap(NUMBERS_DEFAULTS.rate)
    // $450,000 over 30 years: $2,697.98 at 6% and $2,844.31 at 6.5%.
    expect(result.lines[2]!.amount).toBeCloseTo(146.33, 1)
    expect(result.total.amount).toBeCloseTo(146.33 * 360, -1)
    expect(result.headline).toMatch(/^That 0\.5 point gap costs you \$52,6\d\d\.$/)
  })

  it("treats the boxes as interchangeable, so the gap is never negative", () => {
    const swapped = rateGap({ loan: 450_000, rateLow: 6.5, rateHigh: 6, years: 30 })
    expect(swapped.total.amount).toBeCloseTo(rateGap(NUMBERS_DEFAULTS.rate).total.amount, 6)
  })

  it("returns zeros instead of NaN for an empty loan", () => {
    expect(rateGap({ loan: 0, rateLow: 6, rateHigh: 7, years: 30 }).total.amount).toBe(0)
  })
})

describe("vacancyCost", () => {
  it("adds lost rent and turnover and states the share of a year's rent", () => {
    const result = vacancyCost({ rent: 2_000, months: 1, turnover: 600 })
    expect(result.total.amount).toBe(2_600)
    expect(result.note).toBe("That's 10.8% of a full year's rent.")
  })
})

describe("overpricingCost", () => {
  it("adds carrying costs for the extra days and the end discount", () => {
    const result = overpricingCost({ price: 550_000, carry: 3_200, days: 60, cut: 2 })
    expect(result.lines.map((l) => l.amount)).toEqual([6_400, 11_000])
    expect(result.total.amount).toBe(17_400)
  })
})

describe("numbersLeadMessage", () => {
  it("names the tab being viewed and carries all three breakdowns", () => {
    const message = numbersLeadMessage("vacancy", NUMBERS_DEFAULTS)
    expect(message).toContain("Viewing: Empty rental")
    expect(message).toMatch(/^Rate gap: /m)
    expect(message).toMatch(/^Vacancy: /m)
    expect(message).toMatch(/^Overpricing: /m)
  })
})
