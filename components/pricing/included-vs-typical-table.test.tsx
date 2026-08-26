import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { IncludedVsTypicalTable } from "./included-vs-typical-table"
import { PRICING_INCLUDED_ROWS } from "@/lib/pricing-included"

describe("IncludedVsTypicalTable", () => {
  it("renders every included-vs-typical row", () => {
    render(<IncludedVsTypicalTable />)
    for (const row of PRICING_INCLUDED_ROWS) {
      expect(screen.getByText(row.item)).toBeInTheDocument()
    }
  })

  it("does not claim guarantee products", () => {
    const { container } = render(<IncludedVsTypicalTable />)
    expect(container.textContent ?? "").not.toMatch(/guarantee/i)
  })

  it("links the licenses row to the licensing page", () => {
    render(<IncludedVsTypicalTable />)
    const link = screen.getByRole("link", { name: /licensing disclosures/i })
    expect(link.getAttribute("href")).toBe("/licensing/")
  })
})
