import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { CityGuidePage } from "./city-guide-page"
import { findCityBySlug } from "@/lib/utah-cities"

vi.mock("@/lib/leads-api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/leads-api")>("@/lib/leads-api")
  return { ...actual, submitContactLead: vi.fn(async () => ({ message: "ok", leadId: "1" })) }
})

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation")
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn(), back: vi.fn(), forward: vi.fn(), prefetch: vi.fn() }),
    usePathname: () => "/locations/salt-lake-city",
  }
})

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

  it("mounts lead capture, city testimonials, and resource hub links", () => {
    render(<CityGuidePage city={slc} />)
    expect(screen.getAllByLabelText(/name/i).length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText(/Example stories from Salt Lake City/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Guides & resources/i })).toHaveAttribute("href", "/resources/")
    expect(screen.getByRole("link", { name: /^Blog$/i })).toHaveAttribute("href", "/blog/")
  })
})
