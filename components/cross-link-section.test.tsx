import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { CrossLinkSection } from "./cross-link-section"

describe("CrossLinkSection grid variant", () => {
  it("renders an optional one-line description under the label", () => {
    render(
      <CrossLinkSection
        title="Specialized Services in Lehi"
        variant="grid"
        links={[
          {
            label: "Tenant Screening in Lehi",
            href: "/property-management/lehi/tenant-screening/",
            description:
              "Full tri-merge credit report with score, payment history, collections, and debt-to-income analysis",
          },
        ]}
      />,
    )
    expect(screen.getByText(/Full tri-merge credit report/i)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Tenant Screening in Lehi/i })).toHaveAttribute(
      "href",
      "/property-management/lehi/tenant-screening/",
    )
  })
})

describe("CrossLinkSection pills variant", () => {
  it("renders pill links at least 44px tall", () => {
    render(
      <CrossLinkSection
        title="Explore Salt Lake City"
        variant="pills"
        links={[{ label: "Salt Lake City Market Report", href: "/market-reports/salt-lake-city/" }]}
      />
    )
    const link = screen.getByRole("link", { name: "Salt Lake City Market Report" })
    expect(link.className).toMatch(/min-h-11/)
  })
})
