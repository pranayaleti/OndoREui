import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"

const setTheme = vi.fn()
vi.mock("next-themes", () => ({ useTheme: () => ({ setTheme }) }))

import { ModeToggle } from "./mode-toggle"

describe("ModeToggle", () => {
  it.each([
    ["Light", "light"],
    ["Dark", "dark"],
    ["System", "system"],
  ])("offers %s and sets the %s theme", async (label, theme) => {
    render(<ModeToggle />)
    fireEvent.keyDown(screen.getByRole("button", { name: /toggle theme/i }), { key: "Enter" })
    fireEvent.click(await screen.findByRole("menuitem", { name: label }))
    expect(setTheme).toHaveBeenLastCalledWith(theme)
  })
})
