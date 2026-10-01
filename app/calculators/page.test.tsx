import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("@/components/content/glossary-terms", () => ({
  GlossaryCategoryGrid: ({ heading }: { heading: string }) => <h2>{heading}</h2>,
}))
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => "/calculators/" }))

import { CALCULATOR_SLUGS } from "@/lib/calculator-catalog"
import CalculatorsIndexPage from "./page"

describe("/calculators hub", () => {
  it("has a single main landmark and no heading level jump after the h1", () => {
    const { container } = render(<CalculatorsIndexPage />)
    expect(screen.getAllByRole("main")).toHaveLength(1)
    expect(container.querySelectorAll("h1")).toHaveLength(1)
    expect(container.querySelector("main h3")).not.toBeNull() // "Why use" cards sit under an h2
    const levels = Array.from(container.querySelectorAll("h1,h2,h3")).map((h) => Number(h.tagName[1]))
    levels.forEach((level, i) => {
      if (i > 0) expect(level - levels[i - 1]!).toBeLessThanOrEqual(1)
    })
  })

  it("has one tile per catalog calculator", () => {
    render(<CalculatorsIndexPage />)
    const slugs = screen
      .getAllByRole("link")
      .map((a) => /^\/calculators\/([^/]+)\/?$/.exec(a.getAttribute("href") ?? "")?.[1])
      .filter((slug): slug is string => Boolean(slug))
    expect([...new Set(slugs)].sort()).toEqual([...CALCULATOR_SLUGS].sort())
  })
})
