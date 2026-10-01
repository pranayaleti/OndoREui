import { describe, expect, it } from "vitest"
import { calculateDscr, type DscrInput } from "./dscr"
import { calculateMonthlyPI } from "@/lib/mortgage-utils"

const base: DscrInput = {
  monthlyRent: 2500,
  annualRent: 0,
  propertyTax: 3600,
  insurance: 1200,
  maintenance: 3000,
  propertyManagement: 0,
  vacancyRate: 5,
  otherExpenses: 0,
  loanAmount: 225000,
  interestRate: 6.5,
  loanTerm: 30,
  requiredDSCR: 1.25,
}

describe("calculateDscr", () => {
  it("computes NOI, debt service and ratio for the default scenario", () => {
    const r = calculateDscr(base)
    expect(r.annualRentalIncome).toBeCloseTo(28500, 6)
    expect(r.annualOperatingExpenses).toBe(7800)
    expect(r.netOperatingIncome).toBeCloseTo(20700, 6)
    expect(r.annualDebtService).toBeCloseTo(calculateMonthlyPI(225000, 6.5, 30) * 12, 6)
    expect(r.dscr).toBeCloseTo(r.netOperatingIncome / r.annualDebtService, 10)
  })

  it("max loan at the required ratio services the loan at exactly that ratio", () => {
    const r = calculateDscr(base)
    const atMax = calculateDscr({ ...base, loanAmount: r.maxLoanAmount })
    expect(atMax.dscr).toBeCloseTo(base.requiredDSCR, 6)
    expect(r.maxPurchasePrice).toBeCloseTo(r.maxLoanAmount / 0.75, 6)
  })

  it("prefers annual rent over monthly rent when given", () => {
    expect(calculateDscr({ ...base, annualRent: 36000, vacancyRate: 0 }).annualRentalIncome).toBe(36000)
  })

  it("takes the management fee as a percent of gross rent", () => {
    expect(calculateDscr({ ...base, propertyManagement: 10 }).annualOperatingExpenses).toBe(7800 + 3000)
  })

  it("handles a zero interest rate", () => {
    const r = calculateDscr({ ...base, interestRate: 0 })
    expect(r.annualDebtService).toBeCloseTo(225000 / 30, 6)
    expect(r.maxLoanAmount).toBeCloseTo((r.netOperatingIncome / 1.25 / 12) * 360, 6)
  })

  it("reports a ratio of 0 and finite numbers with no loan or a zero term", () => {
    for (const input of [{ ...base, loanAmount: 0 }, { ...base, loanTerm: 0 }]) {
      const r = calculateDscr(input)
      expect(r.dscr).toBe(0)
      expect(r.annualDebtService).toBe(0)
      for (const v of Object.values(r)) expect(Number.isFinite(v)).toBe(true)
    }
  })

  it("never returns a negative or infinite max loan", () => {
    const losing = calculateDscr({ ...base, monthlyRent: 500 })
    expect(losing.netOperatingIncome).toBeLessThan(0)
    expect(losing.maxLoanAmount).toBe(0)
    expect(losing.maxPurchasePrice).toBe(0)
    expect(calculateDscr({ ...base, requiredDSCR: 0 }).maxLoanAmount).toBe(0)
  })
})
