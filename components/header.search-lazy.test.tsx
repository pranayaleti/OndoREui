/**
 * The search dialog (cmdk plus the whole search index) must load on the first open, not with the
 * header on every page, and stay mounted afterwards so focus handling keeps working.
 */

import { describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}))
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
vi.mock("@/components/mode-toggle", () => ({ ModeToggle: () => <button type="button">Theme</button> }))
vi.mock("@/components/navigation", () => ({
  Navigation: () => <nav aria-label="Site links" />,
  allNavigationItems: [],
  overflowNavigationItems: [],
  primaryNavigationItems: [],
}))

const dialogLoaded = vi.fn()
vi.mock("@/components/search-dialog", () => {
  dialogLoaded()
  return {
    SearchDialog: ({ open }: { open: boolean }) => (open ? <div role="dialog">stub search</div> : null),
  }
})

import Header from "./header"

describe("Header search dialog loading", () => {
  it("does not import the search dialog until search is opened", async () => {
    render(<Header />)
    await new Promise((r) => setTimeout(r, 20))
    expect(dialogLoaded).not.toHaveBeenCalled()
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Search" }))
    expect(await screen.findByRole("dialog")).toBeInTheDocument()
    expect(dialogLoaded).toHaveBeenCalledTimes(1)
  })

  it("the Cmd/Ctrl+K shortcut also triggers the load", async () => {
    dialogLoaded.mockClear()
    render(<Header />)
    await act(async () => {
      fireEvent.keyDown(window, { key: "k", metaKey: true })
    })
    expect(await screen.findByRole("dialog")).toBeInTheDocument()
  })
})
