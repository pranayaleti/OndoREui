import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { CityServicePage } from "./city-service-page"
import { CityPricingGuide } from "./city-pricing-guide"
import { ProtectedPortalNotice } from "./portal/protected-portal-notice"
import { BreadcrumbNav } from "./breadcrumb-nav"
import { CommandDialog, CommandInput, CommandList } from "./ui/command"
import { findCityBySlug } from "@/lib/utah-cities"
import ComparePage from "@/app/compare/page"
import PropertyManagementPage from "@/app/property-management/page"

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation")
  return {
    ...actual,
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn(), back: vi.fn(), forward: vi.fn(), prefetch: vi.fn() }),
    usePathname: () => "/",
  }
})

const lehi = findCityBySlug("lehi")!

describe("one main landmark on generated templates", () => {
  it("city service pages render a single main", () => {
    const { container } = render(<CityServicePage city={lehi} service="property-management" />)
    expect(container.querySelectorAll("main")).toHaveLength(1)
  })

  it("city pricing pages render a single main", () => {
    const { container } = render(<CityPricingGuide city={lehi} />)
    expect(container.querySelectorAll("main")).toHaveLength(1)
  })

  it("the property management hub renders a single main", () => {
    const { container } = render(<PropertyManagementPage />)
    expect(container.querySelectorAll("main")).toHaveLength(1)
  })

  it("the protected portal notice renders a single main", () => {
    const { container } = render(<ProtectedPortalNotice title="Locked" description="Not public" />)
    expect(container.querySelectorAll("main")).toHaveLength(1)
  })
})

describe("compare table accessibility", () => {
  it("announces yes and no cells as text, not bare icons", () => {
    const { container } = render(<ComparePage />)
    const sr = Array.from(container.querySelectorAll("td .sr-only")).map((el) => el.textContent)
    expect(sr).toContain("Yes")
    expect(sr).toContain("No")
    container.querySelectorAll("td svg").forEach((svg) => expect(svg).toHaveAttribute("aria-hidden", "true"))
  })

  it("has a caption, column and row headers, and a focusable scroll region", () => {
    const { container } = render(<ComparePage />)
    expect(container.querySelector("table caption")).not.toBeNull()
    expect(container.querySelectorAll('thead th[scope="col"]').length).toBeGreaterThan(1)
    expect(container.querySelectorAll('tbody th[scope="row"]').length).toBeGreaterThan(1)
    const region = screen.getByRole("region", { name: /feature comparison/i })
    expect(region).toHaveAttribute("tabindex", "0")
    expect(region.querySelector("table")).not.toBeNull()
  })
})

describe("tap targets", () => {
  it("breadcrumb links are at least 44px tall", () => {
    render(<BreadcrumbNav items={[{ label: "Notary", href: "/notary/" }, { label: "Locations" }]} />)
    expect(screen.getByRole("link", { name: "Home" }).className).toContain("min-h-11")
    expect(screen.getByRole("link", { name: "Notary" }).className).toContain("min-h-11")
  })
})

describe("CommandDialog", () => {
  it("has an accessible name and a labelled input", () => {
    render(
      <CommandDialog open onOpenChange={() => {}}>
        <CommandInput placeholder="Search" aria-label="Search the site" />
        <CommandList />
      </CommandDialog>,
    )
    expect(screen.getByRole("dialog", { name: "Search the site" })).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: "Search the site" })).toBeInTheDocument()
  })
})
