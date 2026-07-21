import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { CityGuidePage } from "./city-guide-page"
import { findCityBySlug } from "@/lib/utah-cities"

const slc = findCityBySlug("salt-lake-city")!

describe("CityGuidePage", () => {
  it("emits FAQPage JSON-LD matching the visible FAQ content", () => {
    render(<CityGuidePage city={slc} />)
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    const faqScript = scripts.find((s) => {
      try {
        return JSON.parse(s.textContent || "")?.["@type"] === "FAQPage"
      } catch {
        return false
      }
    })
    expect(faqScript).toBeDefined()
    const faqData = JSON.parse(faqScript!.textContent || "")
    expect(faqData.mainEntity.length).toBeGreaterThan(0)
    expect(faqData.mainEntity[0]).toHaveProperty("@type", "Question")
    expect(faqData.mainEntity[0].acceptedAnswer).toHaveProperty("@type", "Answer")
  })

  it("links a neighborhood card to its detail page when a matching neighborhood-content entry exists", () => {
    render(<CityGuidePage city={slc} />)
    // "Sugar House" in city-content.ts matches neighborhoodsByCity["Salt Lake City"] entry named "Sugar House"
    const link = screen.getByRole("link", { name: /Sugar House/i })
    expect(link).toHaveAttribute("href", "/neighborhoods/salt-lake-city/sugar-house/")
  })

  it("links the 'Avenues' card to 'The Avenues' detail page despite the name mismatch", () => {
    render(<CityGuidePage city={slc} />)
    const link = screen.getByRole("link", { name: /Avenues/i })
    expect(link).toHaveAttribute("href", "/neighborhoods/salt-lake-city/the-avenues/")
  })
})
