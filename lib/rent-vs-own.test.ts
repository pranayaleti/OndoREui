import { describe, expect, it } from "vitest"
import { calculateRentVsOwn, describeRecommendation, type RentVsOwnInputs } from "./rent-vs-own"

const base: RentVsOwnInputs = {
  monthlyRent: 2000,
  rentIncrease: 3,
  securityDeposit: 2000,
  rentersInsurance: 200,
  homePrice: 400000,
  downPayment: 80000,
  interestRate: 6.5,
  loanTerm: 30,
  propertyTax: 4000,
  homeownersInsurance: 1200,
  maintenance: 3000,
  hoa: 0,
  program: "conventional",
  creditScore: 740,
  analysisYears: 10,
  investmentReturn: 7,
  homeAppreciation: 3,
  buyingCostPct: 3,
  sellingCostPct: 6,
}

describe("calculateRentVsOwn", () => {
  it("reports no break-even and recommends renting when buying never pays off", () => {
    // Reproduction from the audit: cheap rent, expensive home, no appreciation.
    const r = calculateRentVsOwn({
      ...base,
      monthlyRent: 1000,
      homePrice: 900000,
      downPayment: 180000,
      homeAppreciation: 0,
    })
    expect(r.breakEvenYears).toBeNull()
    expect(r.recommendation).toBe("Renting may be more cost-effective")
    expect(r.explanation).toMatch(/does not break even within 10 years/)
    expect(r.netBuyCost).toBeGreaterThan(r.netRentCost)
  })

  it("recommends buying with an early break-even when owning is cheaper than rent", () => {
    const r = calculateRentVsOwn({
      ...base,
      monthlyRent: 4500,
      homePrice: 300000,
      downPayment: 120000,
      homeAppreciation: 5,
    })
    expect(r.breakEvenYears).not.toBeNull()
    expect(r.breakEvenYears as number).toBeLessThanOrEqual(3)
    expect(r.recommendation).toBe("Buying is likely the better choice")
  })

  it("does not count the refundable deposit as rent cost", () => {
    const withDeposit = calculateRentVsOwn({ ...base, securityDeposit: 5000, investmentReturn: 0 })
    const without = calculateRentVsOwn({ ...base, securityDeposit: 0, investmentReturn: 0 })
    expect(withDeposit.rentTotalCost).toBeCloseTo(without.rentTotalCost, 6)
    expect(withDeposit.netRentCost).toBeCloseTo(without.netRentCost, 6)
  })

  it("charges only the forgone return on the deposit", () => {
    const withDeposit = calculateRentVsOwn({ ...base, securityDeposit: 5000, investmentReturn: 7 })
    const without = calculateRentVsOwn({ ...base, securityDeposit: 0, investmentReturn: 7 })
    expect(withDeposit.netRentCost - without.netRentCost).toBeCloseTo(5000 * (Math.pow(1.07, 10) - 1), 4)
  })

  it("uses investmentReturn, buying costs and selling costs", () => {
    const a = calculateRentVsOwn({ ...base, investmentReturn: 7 })
    const b = calculateRentVsOwn({ ...base, investmentReturn: 25 })
    expect(b.netBuyCost).toBeGreaterThan(a.netBuyCost)
    const cheap = calculateRentVsOwn({ ...base, buyingCostPct: 0, sellingCostPct: 0 })
    expect(a.netBuyCost).toBeGreaterThan(cheap.netBuyCost)
  })

  it("with zero appreciation, costs and return, net buy cost is outflows minus principal paid", () => {
    const r = calculateRentVsOwn({
      ...base,
      homeAppreciation: 0,
      buyingCostPct: 0,
      sellingCostPct: 0,
      investmentReturn: 0,
    })
    const principal = r.annualComparison.reduce((sum, y) => sum + y.principalPaid, 0)
    expect(r.netBuyCost).toBeCloseTo(r.buyTotalCost - principal, 4)
  })

  it("stops paying principal and interest once the loan term ends", () => {
    const r = calculateRentVsOwn({ ...base, loanTerm: 5, analysisYears: 8 })
    const year8 = r.annualComparison[7]
    const year4 = r.annualComparison[3]
    expect(year8.principalPaid).toBe(0)
    expect(year8.buyCost).toBeLessThan(year4.buyCost)
    expect(r.annualComparison.reduce((s, y) => s + y.principalPaid, 0)).toBeCloseTo(320000, 0)
  })

  it("handles an all-cash purchase and a 0% rate", () => {
    const cash = calculateRentVsOwn({ ...base, downPayment: base.homePrice })
    expect(Number.isFinite(cash.netBuyCost)).toBe(true)
    expect(cash.annualComparison[0].principalPaid).toBe(0)
    const zero = calculateRentVsOwn({ ...base, interestRate: 0 })
    expect(Number.isFinite(zero.netBuyCost)).toBe(true)
  })

  it("clamps the analysis window to at least one year", () => {
    const r = calculateRentVsOwn({ ...base, analysisYears: 0 })
    expect(r.analysisYears).toBe(1)
    expect(r.annualComparison).toHaveLength(1)
  })
})

describe("describeRecommendation", () => {
  it("tiers by break-even year", () => {
    expect(describeRecommendation(2, 10).recommendation).toBe("Buying is likely the better choice")
    expect(describeRecommendation(5, 10).recommendation).toBe("Buying could be beneficial")
    expect(describeRecommendation(9, 10).recommendation).toBe("Renting may be more cost-effective")
    expect(describeRecommendation(null, 1).explanation).toMatch(/within 1 year /)
  })
})
