import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ServiceAreaSection } from "./service-area-section"

describe("ServiceAreaSection city pill links", () => {
  it("meet the 44px minimum tap target", () => {
    render(<ServiceAreaSection />)
    // Scope to the city pill links (rounded-full) — the page also renders an
    // "Explore All City Guides" CTA link (rounded-md) that isn't a city pill
    // and was never part of the audited rounded-full sweep, so it's excluded.
    const links = screen.getAllByRole("link")
    const pillLinks = links.filter((l) => l.className.includes("rounded-full"))
    expect(pillLinks.length).toBeGreaterThan(0)
    pillLinks.forEach((l) => expect(l.className).toMatch(/min-h-11/))
  })
})
