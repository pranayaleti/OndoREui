import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { CrossLinkSection } from "./cross-link-section"

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
