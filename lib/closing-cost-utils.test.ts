import { describe, expect, it } from "vitest"
import { calculateClosingCosts, type ClosingCostInput } from "./closing-cost-utils"

const base: ClosingCostInput = {
  homePrice: 300000,
  loanAmount: 240000,
  downPayment: 60000,
  interestRate: 6.5,
  loanTerm: 30,
  propertyTax: 3000,
  insurance: 1200,
  titleInsurance: 2000,
  appraisal: 600,
  inspection: 450,
  originationFee: 2400,
  discountPoints: 0,
  prepaidInterest: 15,
  escrowReserves: 0,
  program: "conventional",
  financeUpfrontFee: true,
}

describe("calculateClosingCosts", () => {
  it("lands the default conventional scenario inside the 2-5% range the page quotes", () => {
    const r = calculateClosingCosts(base)
    expect(r.closingCostPercentOfPrice).toBeGreaterThanOrEqual(2)
    expect(r.closingCostPercentOfPrice).toBeLessThanOrEqual(5)
    expect(r.financedUpfrontFee).toBe(0)
  })

  it("keeps a financed FHA upfront fee out of cash to close", () => {
    const conventional = calculateClosingCosts(base)
    const fha = calculateClosingCosts({ ...base, program: "fha" })
    const ufmip = 240000 * 0.0175
    expect(fha.financedUpfrontFee).toBeCloseTo(ufmip)
    expect(fha.totalClosingCosts).toBeCloseTo(conventional.totalClosingCosts)
    expect(fha.outOfPocket).toBeCloseTo(conventional.outOfPocket)
    // The financed fee raises the loan, so the payment goes up instead.
    expect(fha.monthlyPI!).toBeGreaterThan(conventional.monthlyPI!)
  })

  it("counts the upfront fee as cash when the toggle is off", () => {
    const financed = calculateClosingCosts({ ...base, program: "va" })
    const cash = calculateClosingCosts({ ...base, program: "va", financeUpfrontFee: false })
    expect(cash.financedUpfrontFee).toBe(0)
    expect(cash.totalClosingCosts - financed.totalClosingCosts).toBeGreaterThan(0)
    expect(cash.outOfPocket - financed.outOfPocket).toBeCloseTo(
      cash.totalClosingCosts - financed.totalClosingCosts,
    )
  })

  it("defaults to financing when the flag is omitted", () => {
    const { financeUpfrontFee: _omit, ...rest } = base
    expect(calculateClosingCosts({ ...rest, program: "usda" }).financedUpfrontFee).toBeCloseTo(2400)
  })
})
