import { afterEach, beforeAll, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { SearchDialog } from "./search-dialog"
import { search } from "@/lib/search-index"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

beforeAll(() => {
  // cmdk scrolls the selected item into view.
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  cleanup()
})

describe("SearchDialog", () => {
  it("shows results for a keyword-only query (term absent from title and description)", () => {
    // "purchase" is a keyword of the Buy a Home entry but is not in its title or description.
    const hits = search("purchase")
    const buy = hits.find((r) => r.id === "buy")
    expect(buy).toBeDefined()
    expect(`${buy!.title} ${buy!.description}`.toLowerCase()).not.toContain("purchase")

    render(<SearchDialog open onOpenChange={vi.fn()} />)
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "purchase" } })

    expect(screen.getByText(buy!.title)).toBeInTheDocument()
    expect(screen.queryByText(/No results found/)).not.toBeInTheDocument()
  })

  it("shows the empty state only when search() finds nothing", () => {
    render(<SearchDialog open onOpenChange={vi.fn()} />)
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "zzzqqqxxx" } })
    expect(screen.getByText(/No results found/)).toBeInTheDocument()
  })
})
