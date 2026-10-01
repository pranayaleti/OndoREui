import { beforeEach, describe, it, expect } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
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
  beforeEach(() => window.localStorage.clear())

  it("hides the amounts when toggled and shows them again on a second click", () => {
    render(<InvestmentCard opportunity={opportunity} />)
    expect(screen.getByText(/\$10,000 min/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /hide investment amounts/i }))
    expect(screen.queryByText(/\$10,000 min/)).not.toBeInTheDocument()
    expect(screen.getAllByText("••••").length).toBeGreaterThan(0)

    fireEvent.click(screen.getByRole("button", { name: /show investment amounts/i }))
    expect(screen.getByText(/\$10,000 min/)).toBeInTheDocument()
  })
})

describe("InvestmentCard amounts visibility", () => {
  beforeEach(() => window.localStorage.clear())

  it("hides the amounts on every card when one card is toggled, and keeps them hidden after a reload", () => {
    const second = { ...opportunity, slug: "second", title: "Second Opportunity" }
    const view = render(
      <>
        <InvestmentCard opportunity={opportunity} />
        <InvestmentCard opportunity={second} />
      </>,
    )
    expect(screen.getAllByText(/\$10,000 min \(sample\)/)).toHaveLength(2)

    fireEvent.click(screen.getAllByRole("button", { name: /hide investment amounts/i })[0])
    expect(screen.queryByText(/\$10,000 min/)).not.toBeInTheDocument()
    expect(screen.getAllByText("••••")).toHaveLength(4)

    view.unmount()
    render(
      <>
        <InvestmentCard opportunity={opportunity} />
        <InvestmentCard opportunity={second} />
      </>,
    )
    expect(screen.queryByText(/\$10,000 min/)).not.toBeInTheDocument()
    expect(screen.getAllByRole("button", { name: /show investment amounts/i })).toHaveLength(2)
  })
})
