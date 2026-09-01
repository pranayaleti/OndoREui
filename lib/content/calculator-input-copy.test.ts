import { describe, expect, it } from "vitest"
import { calculatorInputCopyForSlug, calculatorInputCopySlugs } from "./calculator-input-copy"

describe("calculator input copy", () => {
  it("covers affordability, income, closing-cost, refinance, payment, and temporary buydown", () => {
    expect(calculatorInputCopySlugs().sort()).toEqual(
      ["affordability", "closing-cost", "cost-of-living", "dscr", "income", "mortgage-payment", "refinance", "temporary-buydown"].sort(),
    )
  })

  it("explains debts on affordability and points on refinance", () => {
    const affordability = calculatorInputCopyForSlug("affordability")
    expect(affordability?.fields.some((field) => /debts/i.test(field.name))).toBe(true)
    expect(affordability?.lead).not.toMatch(/you will qualify/i)

    const refinance = calculatorInputCopyForSlug("refinance")
    expect(refinance?.lead).toMatch(/points/i)
    expect(refinance?.fields.some((field) => /origination/i.test(field.name))).toBe(true)

    const buydown = calculatorInputCopyForSlug("temporary-buydown")
    expect(buydown?.lead).toMatch(/note rate does not change/i)
    expect(buydown?.related.some((link) => link.href.includes("temporary-buydown-who-pays"))).toBe(true)

    const dscr = calculatorInputCopyForSlug("dscr")
    expect(dscr?.lead).toMatch(/not personal DTI/i)
    expect(dscr?.related.some((link) => link.href.includes("dscr-vs-full-doc"))).toBe(true)
    expect(dscr?.lead).not.toMatch(/best rate/i)

    const payment = calculatorInputCopyForSlug("mortgage-payment")
    expect(payment?.related.some((link) => link.href === "/buy/rates")).toBe(true)

    const closing = calculatorInputCopyForSlug("closing-cost")
    expect(closing?.related.some((link) => link.href.includes("escrow-shortage-after-first-year"))).toBe(true)

    const refinanceCopy = calculatorInputCopyForSlug("refinance")
    expect(refinanceCopy?.related.some((link) => link.href.includes("delayed-financing-after-cash-purchase"))).toBe(
      true,
    )
    expect(refinanceCopy?.related.some((link) => link.href.includes("recast-vs-refinance"))).toBe(true)

    const paymentCopy = calculatorInputCopyForSlug("mortgage-payment")
    expect(paymentCopy?.related.some((link) => link.href.includes("interest-only-mortgages-who-they-are-for"))).toBe(
      true,
    )

    const living = calculatorInputCopyForSlug("cost-of-living")
    expect(living?.lead).not.toMatch(/you will qualify/i)
    expect(living?.lead).toMatch(/not a loan quote/i)

    const closingCopy = calculatorInputCopyForSlug("closing-cost")
    expect(closingCopy?.related.some((link) => link.href.includes("title-insurance-owner-vs-lender"))).toBe(true)
    expect(closingCopy?.related.some((link) => link.href.includes("impounds-vs-waiving-escrow"))).toBe(true)
  })

  it("returns undefined for unknown slugs", () => {
    expect(calculatorInputCopyForSlug("not-a-calculator")).toBeUndefined()
  })
})
