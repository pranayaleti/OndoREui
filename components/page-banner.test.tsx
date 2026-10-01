import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { PageBanner } from "./page-banner"

describe("PageBanner", () => {
  it("sets the title and subtitle in white on a theme-independent scrim", () => {
    const { container } = render(<PageBanner title="Sell your home" subtitle="A plain plan" backgroundImage="/hero.webp" />)
    expect(screen.getByRole("heading", { level: 1, name: "Sell your home" })).toHaveClass("text-white")
    expect(screen.getByText("A plain plan")).toHaveClass("text-white")
    expect(container.querySelector(".bg-black\\/60")).not.toBeNull()
    // No theme tokens behind the text: the scrim cannot turn light when the page theme does.
    expect(container.innerHTML).not.toMatch(/from-background|to-foreground|text-foreground/)
  })
})
