import { describe, it, expect, vi, beforeEach } from "vitest"
import { render } from "@testing-library/react"

let mockResolved: string | undefined = "dark"
vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: mockResolved }),
}))

import { ThemeColorSync, themeColorFor, THEME_COLOR_DARK, THEME_COLOR_LIGHT } from "./theme-color-sync"

describe("ThemeColorSync", () => {
  beforeEach(() => {
    document.head.innerHTML = '<meta name="theme-color" content="#0b1220">'
  })

  it("maps the resolved theme to a browser chrome colour, dark by default", () => {
    expect(themeColorFor("light")).toBe(THEME_COLOR_LIGHT)
    expect(themeColorFor("dark")).toBe(THEME_COLOR_DARK)
    expect(themeColorFor(undefined)).toBe(THEME_COLOR_DARK)
  })

  it("sets the theme-color meta to the light colour when the light theme is active", () => {
    mockResolved = "light"
    render(<ThemeColorSync />)
    expect(document.head.querySelector('meta[name="theme-color"]')).toHaveAttribute("content", THEME_COLOR_LIGHT)
  })

  it("keeps the dark colour for the dark theme", () => {
    mockResolved = "dark"
    render(<ThemeColorSync />)
    expect(document.head.querySelector('meta[name="theme-color"]')).toHaveAttribute("content", THEME_COLOR_DARK)
  })
})
