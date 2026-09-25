import { describe, it, expect } from "vitest"
import { estimateAffordability, type AffordabilityInput } from "@/lib/affordability"

// Expected prices were solved independently (closed-form annuity math in Python),
// not with the code under test. Rate 6.5%, 30 years throughout.
const base: AffordabilityInput = {
  annualIncome: 120_000,
  monthlyDebts: 0,
  downPayment: 0,
  interestRate: 6.5,
  termYears: 30,
  propertyTaxRatePercent: 0,
  insuranceRatePercent: 0,
  program: "conventional",
  creditScore: 760,
}

describe("estimateAffordability", () => {
  it("lets VA use the whole 41% back-end budget with no front-end cap and no monthly MI", () => {
    const result = estimateAffordability({ ...base, program: "va" })
    // $10,000/mo income x 41% = $4,100 of principal and interest.
    expect(result.maxHomePrice).toBeCloseTo(648_664.36, 0)
    expect(result.monthlyPayment.mortgageInsurance).toBe(0)
  })

  it("caps the payment by back-end DTI when existing debts bind first", () => {
    const result = estimateAffordability({ ...base, monthlyDebts: 1_500, downPayment: 100_000 })
    // Front 28% allows $2,800; back 36% allows $3,600 - $1,500 = $2,100, so $2,100 wins.
    expect(result.maxHomePrice).toBeCloseTo(432_242.72, 0)
    expect(result.monthlyPayment.total).toBeCloseTo(2_100, 0)
    expect(result.backEndRatio).toBeCloseTo(36, 1)
  })

  it("makes room for property tax and insurance inside the housing payment", () => {
    const result = estimateAffordability({
      ...base,
      downPayment: 200_000,
      propertyTaxRatePercent: 1.2,
      insuranceRatePercent: 0.5,
    })
    // Fixed point of price = loan($2,800 - price x 1.7%/12) + $200k is $525,262; the
    // solver stops once successive guesses are within $100.
    expect(Math.abs(result.maxHomePrice - 525_262.22)).toBeLessThan(150)
  })

  it("recommends 90% of the maximum as the comfortable price", () => {
    const result = estimateAffordability({ ...base, program: "va" })
    expect(result.recommendedHomePrice).toBeCloseTo(583_797.92, 0)
  })

  it("matches what /calculators/affordability shows for its default inputs", () => {
    const result = estimateAffordability({
      annualIncome: 80_000,
      monthlyDebts: 500,
      downPayment: 20_000,
      interestRate: 6.5,
      termYears: 30,
      propertyTaxRatePercent: 1.2,
      insuranceRatePercent: 0.5,
      program: "conventional",
      creditScore: 740,
    })
    expect(Math.round(result.maxHomePrice)).toBe(245_493)
    expect(Math.round(result.monthlyPayment.total)).toBe(1_867)
  })
})
