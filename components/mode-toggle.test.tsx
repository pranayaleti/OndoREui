import { afterEach, describe, it, expect, vi } from "vitest"
import { cleanup, render, screen, fireEvent } from "@testing-library/react"

const setTheme = vi.fn()
vi.mock("next-themes", () => ({ useTheme: () => ({ setTheme }) }))

import { ModeToggle } from "./mode-toggle"

// Radix's FocusScope schedules a zero-delay timer on unmount to dispatch its
// "focusScope.autoFocusOnUnmount" event. If the test file finishes first, that timer fires
// after jsdom has been torn down and throws "parameter 1 is not of type 'Event'" as an
// unhandled error, which fails the whole Vitest run (exit 1) even though every test passed.
// It only showed up under the load of the full suite, so it looked random. Unmount
// explicitly, then let the pending timer run while the environment is still alive.
afterEach(async () => {
  cleanup()
  await new Promise((resolve) => setTimeout(resolve, 0))
})

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
