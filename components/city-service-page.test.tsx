import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { CityServicePage } from "./city-service-page"
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
    usePathname: () => "/property-management/lehi",
  }
})

const lehi = findCityBySlug("lehi")!

describe("CityServicePage", () => {
  it("uses a factual property-management H1 with no ranking superlative", () => {
    render(<CityServicePage city={lehi} service="property-management" />)
    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toHaveTextContent("Property Management in Lehi, Utah")
    expect(heading).not.toHaveTextContent("#1 Choice")
  })

  it("renders FAQ answers on the page, not only as JSON-LD", () => {
    render(<CityServicePage city={lehi} service="property-management" />)
    expect(screen.getByRole("heading", { name: /Lehi Property Management FAQ/i })).toBeInTheDocument()
    expect(document.querySelectorAll("details").length).toBeGreaterThan(0)
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    const faqScript = scripts.find((s) => {
      try {
        return JSON.parse(s.textContent || "")?.["@type"] === "FAQPage"
      } catch {
        return false
      }
    })
    expect(faqScript).toBeDefined()
  })

  it("mounts lead capture twice and links resources plus blog", () => {
    render(<CityServicePage city={lehi} service="property-management" />)
    expect(screen.getAllByLabelText(/name/i).length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByRole("link", { name: /Book a call/i }).length).toBeGreaterThanOrEqual(2)
    expect(screen.getByRole("link", { name: /Guides & resources/i })).toHaveAttribute("href", "/resources/")
    expect(screen.getByRole("link", { name: /^Blog$/i })).toHaveAttribute("href", "/blog/")
  })
})
