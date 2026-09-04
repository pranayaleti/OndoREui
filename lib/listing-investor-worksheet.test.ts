import { describe, expect, it } from "vitest"
import { calculateMonthlyPI } from "./mortgage-utils"
import {
  calculateListingInvestorIllustration,
  LISTING_INVESTOR_LOAN_TERM_YEARS,
} from "./listing-investor-worksheet"

const fixture = {
  listedMonthlyRent: 2000,
  purchasePrice: 400_000,
  downPaymentPercent: 25,
  closingCostsPercent: 3,
  mortgageRatePercent: 6.5,
  taxPercent: 1,
  insurancePercent: 0.5,
  hoaPercent: 0.25,
  vacancyPercent: 5,
  managementPercent: 8,
}

describe("calculateListingInvestorIllustration", () => {
  it("returns no yields when purchase price is missing or not positive", () => {
    expect(
      calculateListingInvestorIllustration({ ...fixture, purchasePrice: 0 }),
    ).toBeNull()
    expect(
      calculateListingInvestorIllustration({ ...fixture, purchasePrice: Number.NaN }),
    ).toBeNull()
    expect(
      calculateListingInvestorIllustration({ ...fixture, purchasePrice: -400_000 }),
    ).toBeNull()
  })

  it("computes NOI, cap rate, P&I, and cash-on-cash from known assumptions", () => {
    const result = calculateListingInvestorIllustration(fixture)
    expect(result).not.toBeNull()
    if (!result) return

    expect(LISTING_INVESTOR_LOAN_TERM_YEARS).toBe(30)
    expect(result.grossAnnualRent).toBe(24_000)
    expect(result.vacancyLoss).toBe(1_200)
    expect(result.effectiveGrossIncome).toBe(22_800)
    expect(result.annualOperatingExpenses).toBe(8_920)
    expect(result.noi).toBe(13_880)
    expect(result.capRatePercent).toBeCloseTo(3.47, 2)

    const expectedLoan = 300_000
    const expectedPI = calculateMonthlyPI(
      expectedLoan,
      fixture.mortgageRatePercent,
      LISTING_INVESTOR_LOAN_TERM_YEARS,
    )
    expect(result.loanAmount).toBe(expectedLoan)
    expect(result.monthlyPI).toBeCloseTo(expectedPI, 5)
    expect(result.downPaymentAmount).toBe(100_000)
    expect(result.closingCostsAmount).toBe(12_000)
    expect(result.cashInvested).toBe(112_000)

    const expectedCashFlow = 13_880 - expectedPI * 12
    expect(result.annualCashFlow).toBeCloseTo(expectedCashFlow, 5)
    expect(result.cashOnCashPercent).toBeCloseTo((expectedCashFlow / 112_000) * 100, 5)
  })

  it("treats empty expense and financing percents as zero rather than invented market defaults", () => {
    const result = calculateListingInvestorIllustration({
      listedMonthlyRent: 2000,
      purchasePrice: 400_000,
      downPaymentPercent: 0,
      closingCostsPercent: 0,
      mortgageRatePercent: 0,
      taxPercent: 0,
      insurancePercent: 0,
      hoaPercent: 0,
      vacancyPercent: 0,
      managementPercent: 0,
    })
    expect(result).not.toBeNull()
    if (!result) return
    expect(result.noi).toBe(24_000)
    expect(result.capRatePercent).toBeCloseTo(6, 5)
    expect(result.monthlyPI).toBeCloseTo(calculateMonthlyPI(400_000, 0, 30), 5)
    expect(result.cashOnCashPercent).toBeNull()
  })
})
