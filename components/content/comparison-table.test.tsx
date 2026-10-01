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

  it("keeps the caption and footnote outside the horizontal scroll region and labels the table with it", () => {
    render(
      <ComparisonTable
        caption="Cap types"
        footnote="Sample footnote"
        columns={[{ id: "initial", heading: "Initial cap" }]}
        rows={[{ id: "meaning", criterion: "What it limits", cells: { initial: "First change" } }]}
      />,
    )
    const region = screen.getByRole("region", { name: "Cap types" })
    expect(region).not.toContainElement(screen.getByText("Cap types"))
    expect(region).not.toContainElement(screen.getByText("Sample footnote"))
    expect(screen.getByRole("table", { name: "Cap types" })).toBeInTheDocument()
  })

  it("pins the criterion column and tells phone readers the table scrolls sideways", () => {
    render(
      <ComparisonTable
        caption="Cap types"
        columns={[{ id: "initial", heading: "Initial cap" }]}
        rows={[{ id: "meaning", criterion: "What it limits", cells: { initial: "First change" } }]}
      />,
    )
    expect(screen.getByRole("rowheader", { name: "What it limits" }).className).toMatch(/sticky/)
    expect(screen.getByText(/swipe sideways/i)).toBeInTheDocument()
  })
})
