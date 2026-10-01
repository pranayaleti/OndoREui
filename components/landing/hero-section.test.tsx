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

  it("uses one label for the home estimate and offers a chooser for every segment", () => {
    render(<HeroSection />)
    expect(screen.getByRole("link", { name: "Free home estimate" })).toHaveAttribute("href", expect.stringMatching(/^\/whats-my-home-worth\/?$/))
    expect(screen.queryByText(/rental report/i)).toBeNull()
    const chooser = screen.getByRole("group", { name: "What do you need?" })
    const hrefs = Array.from(chooser.querySelectorAll("a")).map((a) => (a.getAttribute("href") ?? "").replace(/\/$/, ""))
    expect(hrefs).toEqual(["/properties", "/buy", "/sell", "/property-management", "/loans"])
  })
})
