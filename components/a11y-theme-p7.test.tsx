import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { NotaryBooking } from "./notary-booking"
import { NotaryFees } from "./notary-fees"
import { CityTrustChips } from "./city-trust-chips"
import { CityServicePage } from "./city-service-page"
import { MarketReportPage } from "./market-report-page"
import { CityGuidePage } from "./city-guide-page"
import { SITE_PHONE_TEL } from "@/lib/site"
import { findCityBySlug } from "@/lib/utah-cities"

vi.mock("./ConsultationModal", () => ({ default: () => null }))
vi.mock("@/components/ConsultationModal", () => ({ default: () => null }))
vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation")
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn(), back: vi.fn(), forward: vi.fn(), prefetch: vi.fn() }),
    usePathname: () => "/",
  }
})

const root = join(__dirname, "..")
const read = (rel: string) => readFileSync(join(root, rel), "utf8")
const lehi = findCityBySlug("lehi")!

// Dark-theme-only colours. On the light theme (#FAFAFA) white is 1.04:1 and gray-300 is 1.4:1.
const HARD_CODED_DARK_TEXT = /(?<![:\w-])(text-white|text-gray-\d00|border-white|border-gray-\d00)(?![\w-])/

describe("notary templates use theme tokens, not dark-only colours", () => {
  it.each([
    "app/notary/notary-client.tsx",
    "components/notary-fees.tsx",
    "components/notary-booking.tsx",
  ])("%s has no hard-coded white/gray text or borders", (file) => {
    const offenders = read(file)
      .split("\n")
      .filter((line) => HARD_CODED_DARK_TEXT.test(line))
    expect(offenders).toEqual([])
  })

  it("fee rows render labels with the foreground token so they stay visible in light mode", () => {
    const { container } = render(<NotaryFees />)
    const label = Array.from(container.querySelectorAll("p")).find((p) => p.textContent === "Remote notarial act")
    expect(label).toBeDefined()
    expect(label!.className).toContain("text-foreground")
    expect(label!.className).not.toContain("text-white")
  })
})

describe("NotaryBooking", () => {
  it("makes the urgent-request number a tel: link", () => {
    render(<NotaryBooking />)
    const link = screen.getByRole("link", { name: /\d/ })
    expect(link).toHaveAttribute("href", `tel:${SITE_PHONE_TEL}`)
  })

  it("describes the request form, not an online calendar with time slots", () => {
    const { container } = render(<NotaryBooking />)
    const text = container.textContent ?? ""
    expect(text).not.toMatch(/online calendar|available time slots/i)
    expect(text).toMatch(/request/i)
    expect(screen.getByRole("button", { name: /request a notary session/i })).toBeInTheDocument()
  })
})

describe("local page landmarks and structure", () => {
  it("trust chips are a labelled list, not a nav landmark", () => {
    const { container } = render(<CityTrustChips />)
    expect(container.querySelector("nav")).toBeNull()
    expect(screen.getByRole("list", { name: /trust and licensing facts/i })).toBeInTheDocument()
  })

  it("city service pages put the H1 before any H2 and nest no button inside a link", () => {
    const { container } = render(<CityServicePage city={lehi} service="property-management" />)
    const headings = Array.from(container.querySelectorAll("h1,h2"))
    expect(headings[0].tagName).toBe("H1")
    expect(container.querySelectorAll("a button, button a")).toHaveLength(0)
  })

  it("city guide and market report pages render a single main", () => {
    expect(render(<CityGuidePage city={lehi} />).container.querySelectorAll("main")).toHaveLength(1)
    expect(render(<MarketReportPage city={lehi} />).container.querySelectorAll("main")).toHaveLength(1)
  })
})

describe("skip link target", () => {
  it("only the layout owns id=main-content; page-level mains do not repeat it", () => {
    const pages = [
      "app/moving-to-utah/page.tsx",
      "app/investments/page.tsx",
      "app/investments/opportunities/page.tsx",
      "app/investments/commercial-real-estate/page.tsx",
      "app/investments/fractional/page.tsx",
      "app/investments/[slug]/page.tsx",
      "app/investments/opportunity-zones/page.tsx",
    ]
    for (const page of pages) expect(read(page)).not.toContain('id="main-content"')
    expect(read("app/layout.tsx")).toContain('id="main-content"')
  })
})

describe("in-text links", () => {
  it(".prose-link underlines by default so links do not rely on colour alone", () => {
    const css = read("app/globals.css")
    const rule = css.match(/\.prose-link\s*\{([^}]*)\}/)
    expect(rule).not.toBeNull()
    expect(rule![1]).toMatch(/\bunderline\b/)
    expect(rule![1]).not.toMatch(/hover:underline/)
  })
})
