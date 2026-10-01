import { render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/seo", () => ({ default: () => null }))

import ResourcesPage from "./page"

describe("/resources glossary highlights", () => {
  it("links each highlighted term to its glossary page and offers the full glossary", () => {
    render(<ResourcesPage />)
    const card = screen.getByRole("region", { name: /glossary highlights/i })
    const noi = within(card).getByRole("link", { name: /NOI/ })
    expect(noi).toHaveAttribute("href", "/glossary/noi/")
    const capRate = within(card).getByRole("link", { name: /Cap rate/ })
    expect(capRate).toHaveAttribute("href", "/glossary/cap-rate/")
    expect(within(card).getByRole("link", { name: "Browse the full glossary" })).toHaveAttribute("href", "/glossary/")
  })

  it("links only to glossary pages that exist", async () => {
    const { GLOSSARY_SLUGS } = await import("@/lib/content/glossary")
    render(<ResourcesPage />)
    const card = screen.getByRole("region", { name: /glossary highlights/i })
    const hrefs = within(card)
      .getAllByRole("link")
      .map((a) => a.getAttribute("href") ?? "")
      .filter((h) => h !== "/glossary/")
    expect(hrefs.length).toBeGreaterThan(0)
    for (const href of hrefs) {
      expect(GLOSSARY_SLUGS).toContain(href.replace(/^\/glossary\//, "").replace(/\/$/, ""))
    }
  })
})
