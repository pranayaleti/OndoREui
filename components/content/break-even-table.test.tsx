import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { BreakEvenTable } from "./break-even-table"

describe("BreakEvenTable", () => {
  it("renders stay-scenario headings and the 40-month illustration", () => {
    render(<BreakEvenTable table="stay-scenarios" />)
    expect(screen.getByRole("link", { name: "Costs include a point" })).toHaveAttribute(
      "href",
      "/blog/discount-points-breakeven-without-sales-pitch/",
    )
    expect(screen.getByText("40 months")).toBeInTheDocument()
    expect(screen.getByText(/cash costs ÷ monthly principal-and-interest savings/i)).toBeInTheDocument()
  })

  it("renders recast vs refinance columns", () => {
    render(<BreakEvenTable table="recast-vs-refi" />)
    expect(screen.getByRole("link", { name: "Recast" })).toHaveAttribute("href", "/blog/recast-vs-refinance/")
    expect(screen.getByText(/Same note rate and remaining term/i)).toBeInTheDocument()
  })
})
