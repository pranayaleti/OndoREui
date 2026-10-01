import { describe, expect, it } from "vitest"
import { calculateRetirement, type RetirementInputs } from "./retirement"

const base: RetirementInputs = {
  currentAge: 35,
  retirementAge: 65,
  lifeExpectancy: 85,
  currentSavings: 100000,
  currentIncome: 80000,
  currentExpenses: 60000,
  currentRealEstateValue: 200000,
  realEstateIncome: 24000,
  realEstateExpenses: 12000,
  realEstateAppreciation: 3,
  monthlyContribution: 1000,
  investmentReturn: 7,
  inflationRate: 2.5,
  desiredRetirementIncome: 60000,
  socialSecurityIncome: 24000,
  otherIncome: 12000,
}

describe("calculateRetirement", () => {
  it("default inputs are on track with a negative gap (a surplus)", () => {
    const r = calculateRetirement(base)
    expect(r.retirementReadiness).toBe("On Track")
    expect(r.retirementIncomeGap).toBeLessThan(0)
  })

  it("uses income and expenses as savings capacity", () => {
    const r = calculateRetirement({ ...base, currentIncome: 250000, currentExpenses: 10000 })
    expect(r.annualSavingsCapacity).toBe(240000)
    expect(r.notes.join(" ")).not.toMatch(/contributions/)
    const tight = calculateRetirement({ ...base, currentIncome: 50000, currentExpenses: 60000 })
    expect(tight.annualSavingsCapacity).toBe(-10000)
    expect(tight.contributionOverCapacity).toBe(22000)
    expect(tight.notes[0]).toMatch(/at or above your income/)
  })

  it("warns when planned contributions exceed the surplus", () => {
    const r = calculateRetirement({ ...base, monthlyContribution: 3000 })
    expect(r.contributionOverCapacity).toBe(16000)
    expect(r.notes[0]).toMatch(/more than your income leaves/)
  })

  it("uses life expectancy for years in retirement and the 4% rule horizon", () => {
    expect(calculateRetirement({ ...base, lifeExpectancy: 85 }).yearsOfRetirement).toBe(20)
    const long = calculateRetirement({ ...base, lifeExpectancy: 100 })
    expect(long.yearsOfRetirement).toBe(35)
    expect(long.notes.join(" ")).toMatch(/35-year retirement/)
    const none = calculateRetirement({ ...base, lifeExpectancy: 60 })
    expect(none.yearsOfRetirement).toBe(0)
    expect(none.notes.join(" ")).toMatch(/no retirement years/)
  })

  it("projects one row per working year", () => {
    expect(calculateRetirement(base).yearByYearProjection).toHaveLength(30)
    expect(calculateRetirement({ ...base, retirementAge: 30 }).yearByYearProjection).toHaveLength(0)
  })
})
