import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { CityServicePage } from "./city-service-page"
import { findCityBySlug, findCityByZip } from "@/lib/utah-cities"
import { SITE_URL } from "@/lib/site"
import { SITE_ORGANIZATION_ID } from "@/lib/seo"
import { CITY_MARKET_DATA_DISCLOSURE } from "@/lib/city-market-data"

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

const jsonLdBlocks = () =>
  Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map((s) => JSON.parse(s.textContent || "{}"))
const jsonLdTypes = () => jsonLdBlocks().map((b) => b["@type"])

describe("CityServicePage", () => {
  it("uses a factual property-management H1 with no ranking superlative", () => {
    render(<CityServicePage city={lehi} service="property-management" />)
    const heading = screen.getByRole("heading", { level: 1 })
    expect(heading).toHaveTextContent("Property Management in Lehi, Utah")
    expect(heading).not.toHaveTextContent("#1 Choice")
  })

  it("renders FAQ answers on the page and leaves FAQPage markup to the locations page", () => {
    render(<CityServicePage city={lehi} service="property-management" />)
    expect(screen.getByRole("heading", { name: /Lehi Property Management FAQ/i })).toBeInTheDocument()
    expect(document.querySelectorAll("details").length).toBeGreaterThan(0)
    expect(jsonLdTypes()).not.toContain("FAQPage")
  })

  it("does not rewrite state-level FAQ copy into garbled city phrases", () => {
    render(<CityServicePage city={findCityBySlug("ogden")!} service="property-management" />)
    expect(document.body.textContent).toMatch(/We follow Utah statutes/)
    expect(document.body.textContent).not.toMatch(/Ogden, Utah statutes/)
    expect(document.body.textContent).not.toMatch(/Ogden area, including/)
  })

  it("describes a Service that points at the site Organization, with no per-city business or address", () => {
    render(<CityServicePage city={lehi} service="property-management" />)
    expect(jsonLdTypes()).toEqual(["Service"])
    const service = jsonLdBlocks()[0] as { provider: unknown; areaServed: unknown; url: string }
    expect(service.provider).toEqual({ "@id": SITE_ORGANIZATION_ID })
    expect(service.areaServed).toMatchObject({ "@type": "City", name: "Lehi" })
    expect(service.url).toBe(`${SITE_URL}/property-management/lehi/`)
    expect(JSON.stringify(service)).not.toMatch(/PostalAddress|LocalBusiness/)
  })

  it("labels the guide link once for cities whose name already ends in City", () => {
    render(<CityServicePage city={findCityBySlug("salt-lake-city")!} service="property-management" />)
    expect(screen.getByRole("link", { name: "Salt Lake City Guide" })).toHaveAttribute("href", "/locations/salt-lake-city/")
    expect(document.body.textContent).not.toMatch(/City City/)
  })

  it("links only the ZIPs a city owns and offers the other cities on a shared ZIP page", () => {
    const { unmount } = render(<CityServicePage city={findCityBySlug("salt-lake-city")!} service="loans" />)
    expect(document.querySelector('a[href="/loans/zip/84102/"]')).not.toBeNull()
    expect(document.querySelector('a[href="/loans/zip/84121/"]')).toBeNull()
    expect(document.body.textContent).toMatch(/84121/)
    unmount()
    const cottonwood = findCityByZip("84121")!
    expect(cottonwood.name).toBe("Cottonwood Heights")
    render(<CityServicePage city={cottonwood} service="loans" zip="84121" />)
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cottonwood Heights")
    const chooser = screen.getByRole("heading", { name: /ZIP 84121 is also used by/i }).closest("section")!
    expect(chooser.querySelector('a[href="/loans/salt-lake-city/"]')).not.toBeNull()
  })

  it("mounts lead capture twice and links resources plus blog", () => {
    render(<CityServicePage city={lehi} service="property-management" />)
    expect(screen.getAllByLabelText(/name/i).length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByRole("link", { name: /Book a call/i }).length).toBeGreaterThanOrEqual(2)
    expect(screen.getByRole("link", { name: /Guides & resources/i })).toHaveAttribute("href", "/resources/")
    expect(screen.getByRole("link", { name: /^Blog$/i })).toHaveAttribute("href", "/blog/")
  })

  it("renders factual trust chips under the H1 without Google scores or placeholder NMLS numbers", () => {
    render(<CityServicePage city={lehi} service="property-management" />)
    expect(screen.getByText(/55\+.*cities/i)).toBeInTheDocument()
    const licensed = screen.getByRole("link", { name: /^licensed$/i })
    expect(licensed).toHaveAttribute("href", "/licensing/")
    expect(screen.getAllByText(/24\/7 emergency line/i).length).toBeGreaterThanOrEqual(1)
    expect(document.body.textContent).not.toMatch(/google\s*(score|rating|stars)/i)
    expect(document.body.textContent).not.toMatch(/\d\.\d\s*\/\s*5.*google/i)
    expect(document.body.textContent).not.toMatch(/NMLS\s*#\s*123456/i)
    expect(document.body.textContent).not.toMatch(/#1 rated/i)
  })

  it("renders housing-stock neighborhood cards with typical homes and neighborhood links", () => {
    render(<CityServicePage city={lehi} service="property-management" />)
    const traverse = screen.getByRole("link", { name: /Traverse Mountain/i })
    expect(traverse).toHaveAttribute("href", "/neighborhoods/lehi/traverse-mountain/")
    expect(screen.getByText(/Townhomes, single-family homes/i)).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/who (should )?live here/i)
  })

  it("renders four owner process steps and the 48–72 hour onboarding note", () => {
    render(<CityServicePage city={lehi} service="property-management" />)
    expect(screen.getByRole("heading", { name: /how (ondo )?works for (lehi )?property owners/i })).toBeInTheDocument()
    expect(screen.getByText(/onboard your property/i)).toBeInTheDocument()
    expect(screen.getByText(/collect rent automatically/i)).toBeInTheDocument()
    expect(screen.getByText(/we handle maintenance/i)).toBeInTheDocument()
    expect(screen.getByText(/track everything live/i)).toBeInTheDocument()
    expect(document.body.textContent).toMatch(/48–72 hours/)
    expect(document.body.textContent).not.toMatch(/same-day on-site/i)
    expect(document.body.textContent).not.toMatch(/\b2[-\s]?hours?\b/i)
  })

  it("shows one-line value props from sub-service features on specialized service cards", () => {
    render(<CityServicePage city={lehi} service="property-management" />)
    const heading = screen.getByRole("heading", { name: /Specialized Services in Lehi/i })
    const section = heading.closest("section")
    expect(section).toHaveTextContent(/Full tri-merge credit report with score, payment history, collections, and debt-to-income analysis/i)
    expect(section).toHaveTextContent(/Round-the-clock emergency response for after-hours issues/i)
    expect(section?.textContent).not.toMatch(/quality tenants/i)
  })

  it("lists four local owner-ops patterns without steering copy", () => {
    render(<CityServicePage city={lehi} service="property-management" />)
    const ops = screen.getByRole("list", { name: /what lehi owners plan for/i })
    expect(ops.querySelectorAll("li").length).toBe(4)
    expect(ops.textContent).toMatch(/HOA/i)
    expect(ops.textContent).not.toMatch(/family-friendly|young professionals|quality tenants|safe neighborhood/i)
  })

  it("renders all four Wasatch seasons with the city name", () => {
    render(<CityServicePage city={lehi} service="property-management" />)
    expect(screen.getByRole("heading", { name: /four-season wasatch guide for lehi/i })).toBeInTheDocument()
    expect(screen.getByText("Winter in Lehi")).toBeInTheDocument()
    expect(screen.getByText("Spring in Lehi")).toBeInTheDocument()
    expect(screen.getByText("Summer in Lehi")).toBeInTheDocument()
    expect(screen.getByText("Fall in Lehi")).toBeInTheDocument()
  })

  it("carries the lending disclosure on loans pages and not on other services", () => {
    const { unmount } = render(<CityServicePage city={lehi} service="loans" />)
    expect(document.body.textContent).toMatch(/not a commitment to lend/i)
    expect(document.body.textContent).toMatch(/equal housing lender/i)
    expect(document.body.textContent).not.toMatch(/competitive mortgage/i)
    unmount()
    render(<CityServicePage city={lehi} service="property-management" />)
    expect(document.body.textContent).not.toMatch(/not a commitment to lend/i)
  })

  it("shows the market snapshot with its as-of disclosure", () => {
    render(<CityServicePage city={lehi} service="loans" />)
    expect(document.body.textContent).toContain(CITY_MARKET_DATA_DISCLOSURE)
  })
})

