import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { JourneyCardsSection } from "./journey-cards-section"

describe("JourneyCardsSection", () => {
  it("links to property management, rental analysis, and rentals", () => {
    render(<JourneyCardsSection />)
    const links = screen.getAllByRole("link")
    const hrefs = links.map((l) => l.getAttribute("href"))
    expect(hrefs).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^\/property-management/),
        expect.stringMatching(/^\/whats-my-home-worth/),
        expect.stringMatching(/^\/properties/),
      ]),
    )
  })

  it("shows the valuation disclaimer", () => {
    render(<JourneyCardsSection />)
    expect(
      screen.getByText(/not an appraisal, BPO, or CMA/i),
    ).toBeInTheDocument()
  })
})
