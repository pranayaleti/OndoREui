import { describe, expect, it } from "vitest"
import { buySellFaqBank, getHomepageOwnerFaqs, propertyManagementFaqBank } from "./service-faq"

describe("getHomepageOwnerFaqs", () => {
  it("returns the first six items from the property-management FAQ bank", () => {
    const faqs = getHomepageOwnerFaqs()
    expect(faqs).toHaveLength(6)
    expect(faqs).toEqual(propertyManagementFaqBank.slice(0, 6))
  })

  it("does not invent numbered 01-style FAQ titles", () => {
    for (const faq of getHomepageOwnerFaqs()) {
      expect(faq.q).not.toMatch(/^\s*0?\d+\s/)
    }
  })

  it("does not publish an unsubstantiated fill-by date or immediate-emergency SLA", () => {
    const blob = getHomepageOwnerFaqs()
      .map((f) => `${f.q} ${f.a}`)
      .join(" ")
    expect(blob).not.toMatch(/7–21 days/)
    expect(blob).not.toMatch(/handled immediately/i)
  })
})

describe("buySellFaqBank", () => {
  it("does not claim buyer representation is typically free or that the seller pays the buyer’s agent", () => {
    const blob = buySellFaqBank.map((faq) => `${faq.q} ${faq.a}`).join(" ")
    expect(blob).not.toMatch(/representation is typically free/i)
    expect(blob).not.toMatch(/costs you nothing/i)
    expect(blob).not.toMatch(/seller pays the commission/i)
    expect(blob).not.toMatch(/typically covered by the builder/i)
    expect(blob).toMatch(/negotiated/)
    expect(blob).toMatch(/written buyer/)
  })
})
