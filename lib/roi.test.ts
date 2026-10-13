import { describe, expect, it } from "vitest"
import { annualizeReturn, calculateROI, type ROIInput } from "./roi"

const base: ROIInput = {
  purchasePrice: 300000,
  downPayment: 75000,
  loanAmount: 225000,
  interestRate: 6.5,
  loanTerm: 30,
  monthlyRent: 2500,
  propertyTax: 3600,
  insurance: 1200,
  maintenance: 3000,
  propertyManagement: 0,
  vacancyRate: 5,
  otherExpenses: 0,
  closingCosts: 9000,
  repairs: 5000,
  appreciationRate: 3,
  holdingPeriod: 5,
  salePrice: 0,
  sellingCostPct: 0,
}

describe("annualizeReturn", () => {
  it("compounds rather than dividing", () => {
    expect(annualizeReturn(74.5, 5)).toBeCloseTo(11.78, 1)
    expect(annualizeReturn(100, 1)).toBeCloseTo(100)
    expect(annualizeReturn(21, 2)).toBeCloseTo(10)
  })

  it("treats a total loss or worse as -100% and a zero holding period as 0", () => {
    expect(annualizeReturn(-100, 5)).toBe(-100)
    expect(annualizeReturn(-150, 5)).toBe(-100)
    expect(annualizeReturn(50, 0)).toBe(0)
  })

  it("annualizes a loss", () => {
    expect(annualizeReturn(-19, 2)).toBeCloseTo(-10)
  })
})

describe("calculateROI", () => {
  it("annualized ROI is below the simple average for multi-year holds", () => {
    const r = calculateROI(base)
    expect(r.totalCashInvested).toBe(89000)
    expect(r.annualizedROI).toBeLessThan(r.totalROI / base.holdingPeriod)
    expect(r.annualizedROI).toBeCloseTo(annualizeReturn(r.totalROI, 5), 10)
  })

  it("total return = cash flow + net sale proceeds - cash invested", () => {
    const r = calculateROI({ ...base, sellingCostPct: 6 })
    expect(r.totalReturn).toBeCloseTo(r.totalCashFlow + r.netSaleProceeds - r.totalCashInvested, 6)
    expect(r.netSaleProceeds).toBeCloseTo(r.propertyValueAtSale - r.sellingCosts - r.loanBalanceAtSale, 6)
  })

  it("selling costs come off the sale price", () => {
    const without = calculateROI(base)
    const with6 = calculateROI({ ...base, sellingCostPct: 6 })
    expect(with6.sellingCosts).toBeCloseTo(without.propertyValueAtSale * 0.06, 6)
    expect(without.totalReturn - with6.totalReturn).toBeCloseTo(with6.sellingCosts, 6)
  })

  it("an explicit sale price overrides appreciation", () => {
    const r = calculateROI({ ...base, salePrice: 400000, sellingCostPct: 5 })
    expect(r.propertyValueAtSale).toBe(400000)
    expect(r.sellingCosts).toBe(20000)
  })

  it("management fee and other expenses reduce cash flow", () => {
    const plain = calculateROI(base)
    const managed = calculateROI({ ...base, propertyManagement: 10, otherExpenses: 600 })
    // 10% of $30,000 gross rent + $600
    expect(plain.annualCashFlow - managed.annualCashFlow).toBeCloseTo(3600, 6)
  })

  it("the loan is paid off once the hold outlasts the term", () => {
    const r = calculateROI({ ...base, loanTerm: 15, holdingPeriod: 20 })
    expect(r.loanBalanceAtSale).toBeCloseTo(0, 2)
  })

  it("no cash invested yields 0% rather than Infinity", () => {
    const r = calculateROI({ ...base, downPayment: 0, closingCosts: 0, repairs: 0, loanAmount: 300000 })
    expect(r.totalROI).toBe(0)
    expect(r.cashOnCashReturn).toBe(0)
  })
})
