import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { CitySubServicePage } from "./city-sub-service-page"
import { findCityBySlug } from "@/lib/utah-cities"
import { subServiceDefinitions } from "@/lib/sub-service-content"

vi.mock("@/lib/leads-api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/leads-api")>("@/lib/leads-api")
  return { ...actual, submitContactLead: vi.fn(async () => ({ message: "ok", leadId: "1" })) }
})

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation")
  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
    }),
    usePathname: () => "/property-management/lehi/tenant-screening",
  }
})

const lehi = findCityBySlug("lehi")!
const screening = subServiceDefinitions["tenant-screening"]!

describe("CitySubServicePage lead capture", () => {
  it("mounts owner lead capture twice on property-management sub-service pages", () => {
    render(<CitySubServicePage city={lehi} subService={screening} />)

    expect(screen.getAllByLabelText(/name/i).length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByRole("link", { name: /Book a call/i }).length).toBeGreaterThanOrEqual(2)
    // Persona is already known (owner) so audience radios stay hidden.
    expect(screen.queryByRole("radio")).not.toBeInTheDocument()
  })

  it("does not promise a 2-hour on-site response window", () => {
    render(<CitySubServicePage city={lehi} subService={screening} />)
    expect(document.body.textContent).not.toMatch(/\b2[-\s]?hours?\b/i)
  })

  it("maintenance coordination does not claim an under-4-hour dispatch SLA", () => {
    const maintenance = subServiceDefinitions["maintenance-coordination"]!
    render(<CitySubServicePage city={lehi} subService={maintenance} />)
    expect(document.body.textContent).not.toMatch(/under 4 hours/i)
    expect(document.body.textContent).toMatch(/24\/7 emergency line/i)
  })

  it("shows factual trust chips without Google scores or placeholder NMLS numbers", () => {
    render(<CitySubServicePage city={lehi} subService={screening} />)
    expect(screen.getByText(/55\+.*cities/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /^licensed$/i })).toHaveAttribute("href", "/licensing/")
    expect(screen.getAllByText(/24\/7 emergency line/i).length).toBeGreaterThanOrEqual(1)
    expect(document.body.textContent).not.toMatch(/NMLS\s*#\s*123456/i)
  })
})
