import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import { SelfManagingSection } from "./self-managing-section"

function hrefOf(name: RegExp): string {
  // Next.js `trailingSlash: true` may append "/" before the path end AND
  // before "#" fragments (e.g. "/contact/#book-a-call"). Normalize both.
  return (screen.getByRole("link", { name }).getAttribute("href") ?? "")
    .replace(/\/(?=#)/, "")
    .replace(/\/$/, "")
}

describe("SelfManagingSection", () => {
  it("wires the two primary CTAs to the real analysis and Calendly targets", () => {
    render(<SelfManagingSection />)
    // Accept optional trailing slash; Next.js trailingSlash config may add one.
    expect(hrefOf(/Get my free rental analysis/i)).toBe("/whats-my-home-worth")
    expect(hrefOf(/Book a call/i)).toBe("/contact#book-a-call")
    expect(hrefOf(/self-manage vs Ondo calculator/i)).toBe("/calculators/owner-vs-self")
  })

  it("lists all five pain points that Ondo takes off an owner's plate", () => {
    render(<SelfManagingSection />)
    for (const title of [
      /Screening applicants/i,
      /Filling vacancies/i,
      /Collecting rent on time/i,
      /Coordinating maintenance/i,
      /Serving notices/i,
    ]) {
      expect(screen.getByText(title)).toBeInTheDocument()
    }
  })
})
