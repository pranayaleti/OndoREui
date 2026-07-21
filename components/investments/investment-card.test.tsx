import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { InvestmentCard } from "./investment-card"
import type { InvestmentOpportunity } from "@/lib/investments-data"

const opportunity: InvestmentOpportunity = {
  slug: "test-opportunity",
  title: "Test Opportunity",
  location: "Salt Lake City, UT",
  assetClass: "Multifamily",
  minInvestment: 10000,
  targetReturn: "8%",
  holdPeriod: "5 years",
  distributionFrequency: "Quarterly",
  status: "open",
  image: "/modern-office-building.webp",
  description: "Test description",
  highlights: ["Highlight one"],
  riskFactors: ["Risk one"],
}

describe("InvestmentCard show/hide values toggle", () => {
  it("meets the 44px minimum tap target", () => {
    render(<InvestmentCard opportunity={opportunity} />)
    const toggle = screen.getByRole("button", { name: /hide investment amounts|show investment amounts/i })
    expect(toggle.className).toMatch(/min-h-11/)
  })
})
