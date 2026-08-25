import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { OwnerServicesTabs } from "./owner-services-tabs"

describe("OwnerServicesTabs", () => {
  it("renders all six service tabs", () => {
    render(<OwnerServicesTabs />)
    for (const label of [
      "Screening",
      "Advertising",
      "Rent",
      "Maintenance",
      "Evictions",
      "Reporting",
    ]) {
      expect(screen.getByRole("tab", { name: label })).toBeInTheDocument()
    }
  })

  it("shows the screening tab by default with a Fair Housing note", () => {
    render(<OwnerServicesTabs />)
    expect(
      screen.getByText(/Fair-Housing-compliant tenant screening/i),
    ).toBeInTheDocument()
    // Screening tab should be the selected one on mount.
    const screening = screen.getByRole("tab", { name: /screening/i })
    expect(screening.getAttribute("aria-selected")).toBe("true")
  })

  it("links each tab to an existing property-management page", () => {
    render(<OwnerServicesTabs />)
    // The default (screening) tab's CTA points to the tenant screening page.
    const cta = screen.getByRole("link", { name: /see our screening process/i })
    expect(cta.getAttribute("href")).toMatch(
      /^\/property-management\/tenant-screening/,
    )
  })
})
