import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ComparisonTable } from "./comparison-table"
import { filterProgramColumns, rowsForTable } from "@/lib/content/program-fit"

describe("ComparisonTable", () => {
  it("renders purchase criteria and program headings", () => {
    const columns = filterProgramColumns("purchase", ["fha", "conventional"])
    render(
      <ComparisonTable
        caption="Typical program differences"
        columns={columns}
        rows={rowsForTable("purchase")}
        highlightId="fha"
      />,
    )
    expect(screen.getByText("Typical program differences")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "FHA" })).toHaveAttribute("href", "/loans/fha/")
    expect(screen.getByText("Credit (typical overlay, not a promise)")).toBeInTheDocument()
  })

  it("renders headings without links when href is omitted", () => {
    render(
      <ComparisonTable
        caption="Cap types"
        columns={[
          { id: "initial", heading: "Initial cap" },
          { id: "lifetime", heading: "Lifetime cap" },
        ]}
        rows={[
          {
            id: "meaning",
            criterion: "What it limits",
            cells: { initial: "First change", lifetime: "Max above start" },
          },
        ]}
      />,
    )
    expect(screen.queryByRole("link", { name: "Initial cap" })).not.toBeInTheDocument()
    expect(screen.getByText("Initial cap")).toBeInTheDocument()
  })

  it("returns nothing when columns are empty", () => {
    const { container } = render(
      <ComparisonTable caption="Empty" columns={[]} rows={rowsForTable("purchase")} />,
    )
    expect(container).toBeEmptyDOMElement()
  })
})
