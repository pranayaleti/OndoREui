import { describe, it, expect } from "vitest"
import { articleDisclosureKind } from "./article-disclosure"

describe("articleDisclosureKind", () => {
  it("keeps the lending disclosure for lending categories and unknown ones", () => {
    expect(articleDisclosureKind("Loan Programs")).toBe("lending")
    expect(articleDisclosureKind("Refinance")).toBe("lending")
    expect(articleDisclosureKind("Buying Guide")).toBe("lending")
    expect(articleDisclosureKind(undefined)).toBe("lending")
    expect(articleDisclosureKind("Something New")).toBe("lending")
  })

  it("uses the real-estate disclosure for non-lending categories", () => {
    expect(articleDisclosureKind("Property Management")).toBe("real-estate")
    expect(articleDisclosureKind("Neighborhood Guide")).toBe("real-estate")
    expect(articleDisclosureKind("Selling")).toBe("real-estate")
  })

  it("adds a not-advice notice for investing, tax and legal posts", () => {
    expect(articleDisclosureKind("Strategy")).toBe("advice")
    expect(articleDisclosureKind("Taxes")).toBe("advice")
  })

  it("lets a post override its category", () => {
    expect(articleDisclosureKind("Property Management", "lending")).toBe("lending")
    expect(articleDisclosureKind("Loan Programs", "real-estate")).toBe("real-estate")
  })
})
