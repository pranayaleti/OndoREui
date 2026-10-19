import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { HeroSection, SERVICE_TILES } from "./hero-section"

describe("HeroSection", () => {
  it("does not add a second banner or a nav landmark", () => {
    const { container } = render(<HeroSection />)
    expect(screen.queryByRole("banner")).toBeNull()
    expect(container.querySelector("header")).toBeNull()
    expect(container.querySelector("nav")).toBeNull()
  })

  it("names the hero region by its h1 and treats the background photo as decorative", () => {
    const { container } = render(<HeroSection />)
    const h1 = screen.getByRole("heading", { level: 1 })
    expect(screen.getByRole("region", { name: h1.textContent ?? "" })).toBeInTheDocument()
    expect(container.querySelector("img")?.getAttribute("alt")).toBe("")
  })

  it("offers exactly six service tiles in the header order, and nothing else to click", () => {
    const { container } = render(<HeroSection />)
    const list = screen.getByRole("list", { name: "What do you need?" })
    const hrefs = Array.from(list.querySelectorAll("a")).map((a) => (a.getAttribute("href") ?? "").replace(/\/$/, ""))
    expect(hrefs).toEqual(["/properties", "/buy", "/sell", "/property-management", "/loans", "/notary"])
    expect(SERVICE_TILES).toHaveLength(6)
    expect(container.querySelectorAll("a")).toHaveLength(6)
  })

  it("keeps the hero short: one headline, one sentence, no stats or disclaimers", () => {
    const { container } = render(<HeroSection />)
    const text = container.textContent ?? ""
    expect(text).not.toMatch(/24\/7|200\+|licensed|AI/i)
    expect(text.split(/\s+/).length).toBeLessThan(90)
  })
})
