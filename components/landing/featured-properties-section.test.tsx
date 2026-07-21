import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { FeaturedPropertiesSection } from "./featured-properties-section"

describe("FeaturedPropertiesSection show/hide toggle", () => {
  it("meets the 44px minimum tap target", () => {
    render(<FeaturedPropertiesSection />)
    const toggle = screen.getByRole("button", { name: /hide rental prices|show rental prices/i })
    expect(toggle.className).toMatch(/min-h-11/)
  })
})
