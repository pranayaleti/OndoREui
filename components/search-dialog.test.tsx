import { afterEach, beforeAll, describe, expect, it, vi } from "vitest"
import { useState } from "react"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
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

  it("is a named dialog, closes on Escape and returns focus to the button that opened it", async () => {
    function Harness() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button onClick={() => setOpen(true)}>Open search</button>
          <SearchDialog open={open} onOpenChange={setOpen} />
        </>
      )
    }
    render(<Harness />)
    const opener = screen.getByRole("button", { name: "Open search" })
    opener.focus()
    fireEvent.click(opener)

    const dialog = screen.getByRole("dialog")
    expect(dialog).toHaveAccessibleName()
    expect(dialog).toContainElement(document.activeElement as HTMLElement)

    fireEvent.keyDown(dialog, { key: "Escape" })

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
    await waitFor(() => expect(opener).toHaveFocus())
  })

  it("lets the caller take over focus return, as the header does", async () => {
    const onCloseAutoFocus = vi.fn((event: Event) => event.preventDefault())
    function Harness() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button onClick={() => setOpen(true)}>Open search</button>
          <SearchDialog open={open} onOpenChange={setOpen} onCloseAutoFocus={onCloseAutoFocus} />
        </>
      )
    }
    render(<Harness />)
    const opener = screen.getByRole("button", { name: "Open search" })
    opener.focus()
    fireEvent.click(opener)

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" })

    await waitFor(() => expect(onCloseAutoFocus).toHaveBeenCalledTimes(1))
    expect(opener).not.toHaveFocus()
  })
})
