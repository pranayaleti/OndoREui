import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("@/components/landing/hero-zip-service-selector-lazy", () => ({
  HeroZipServiceSelectorLazy: () => <div data-testid="zip-selector" />,
}))

import { HeroSection } from "./hero-section"

describe("HeroSection landmarks", () => {
  it("does not add a second banner or a nav landmark", () => {
    const { container } = render(<HeroSection />)
    expect(screen.queryByRole("banner")).toBeNull()
    expect(container.querySelector("header")).toBeNull()
    expect(container.querySelector("nav")).toBeNull()
  })

  it("names the hero region by its h1", () => {
    render(<HeroSection />)
    const h1 = screen.getByRole("heading", { level: 1 })
    expect(screen.getByRole("region", { name: h1.textContent ?? "" })).toBeInTheDocument()
  })

  it("keeps the call-to-action links grouped and treats the background photo as decorative", () => {
    const { container } = render(<HeroSection />)
    const group = screen.getByRole("group", { name: "Primary calls to action" })
    expect(group.querySelectorAll("a")).toHaveLength(3)
    expect(container.querySelector("img")?.getAttribute("alt")).toBe("")
  })
})
