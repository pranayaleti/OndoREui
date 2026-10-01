import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import CaseStudiesPage, { metadata } from "./page"

describe("/about/case-studies", () => {
  it("is noindex and not described as real outcomes", () => {
    expect(metadata.robots).toMatchObject({ index: false })
    expect(String(metadata.description)).toMatch(/illustrative/i)
    expect(String(metadata.description)).not.toMatch(/real outcomes/i)
  })

  it("labels every story as illustrative and drops the accuracy claim", () => {
    const { container } = render(<CaseStudiesPage />)
    expect(container.textContent).not.toMatch(/real client work/i)
    expect(container.textContent).not.toMatch(/numbers and timelines are accurate/i)
    expect(screen.getAllByText(/illustrative scenario/i).length).toBeGreaterThanOrEqual(4)
  })

  it("does not publish backdated Article structured data", () => {
    const { container } = render(<CaseStudiesPage />)
    const ld = Array.from(container.querySelectorAll('script[type="application/ld+json"]')).map((n) => n.textContent ?? "")
    expect(ld.join("")).not.toContain("datePublished")
  })
})
