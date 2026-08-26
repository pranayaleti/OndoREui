import { describe, expect, it } from "vitest"
import { getHomepageOwnerFaqs, propertyManagementFaqBank } from "./service-faq"

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
