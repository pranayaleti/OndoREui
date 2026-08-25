import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { OwnerCommitmentsSection } from "./owner-commitments-section"

describe("OwnerCommitmentsSection", () => {
  it("renders the four commitment cards and links them to real Ondo pages", () => {
    render(<OwnerCommitmentsSection />)

    expect(
      screen.getByRole("heading", { name: /You pay when rent is collected/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: /30-day notice/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: /24\/7 emergency maintenance line/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: /Fair Housing.compliant screening/i }),
    ).toBeInTheDocument()

    // Every commitment links to an already-existing page — no dead links.
    // Next.js may add trailing slashes via trailingSlash: true; accept either.
    const hrefs = screen
      .getAllByRole("link")
      .map((el) => el.getAttribute("href") ?? "")
      .map((href) => href.replace(/\/$/, ""))
    expect(hrefs).toEqual(
      expect.arrayContaining([
        "/pricing",
        "/property-management/maintenance-coordination",
        "/property-management/tenant-screening",
      ]),
    )
  })

  it("uses the word 'commitments' rather than 'guarantees' at the section heading level", () => {
    render(<OwnerCommitmentsSection />)
    // The heading and each card title must never call these guarantees — that
    // word implies a compensating remedy (fee waived, coverage) which Ondo
    // does not currently offer. The license-compliance-guard enforces this.
    expect(
      screen.getByRole("heading", { level: 2 }).textContent,
    ).toMatch(/commitments/i)
    expect(
      screen.getByRole("heading", { level: 2 }).textContent,
    ).not.toMatch(/guarantee/i)
    for (const heading of screen.getAllByRole("heading", { level: 3 })) {
      expect(heading.textContent ?? "").not.toMatch(/guarantee/i)
    }
  })
})
