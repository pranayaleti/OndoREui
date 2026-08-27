import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { SellIncludedVsTypicalTable } from "./sell-included-vs-typical-table"
import { SELL_INCLUDED_ROWS } from "@/lib/sell-included"

describe("SellIncludedVsTypicalTable", () => {
  it("renders every sell-side included-vs-typical row", () => {
    render(<SellIncludedVsTypicalTable />)
    for (const row of SELL_INCLUDED_ROWS) {
      expect(screen.getByText(row.item)).toBeInTheDocument()
    }
  })

  it("does not claim a dollar savings figure", () => {
    const { container } = render(<SellIncludedVsTypicalTable />)
    expect(container.textContent ?? "").not.toMatch(/\$1,?950/)
    expect(container.textContent ?? "").not.toMatch(/top dollar/i)
  })
})
