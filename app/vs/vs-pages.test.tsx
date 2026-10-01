import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import VsBuildiumPage, { metadata as buildiumMeta } from "./buildium/page"
import VsTurboTenantPage, { metadata as turbotenantMeta } from "./turbotenant/page"
import {
  BUILDIUM_CATEGORIES,
  COMPETITOR_FACTS_AS_OF,
  ONDO_FEE_SUMMARY,
  TURBOTENANT_CATEGORIES,
} from "@/lib/vs-comparisons"
import { FEE_COMPARISON_AS_OF } from "@/lib/fee-comparison"

const pages = [
  { name: "buildium", Page: VsBuildiumPage, meta: buildiumMeta },
  { name: "turbotenant", Page: VsTurboTenantPage, meta: turbotenantMeta },
]

describe("/vs comparison pages", () => {
  for (const { name, Page, meta } of pages) {
    describe(name, () => {
      it("shows Ondo's published fee, never 'Contact us' or an entry-fee claim", () => {
        const { container } = render(<Page />)
        const text = container.textContent ?? ""
        expect(text).toContain("10% of collected rent (1–4 units), 8% (5–15 units)")
        expect(text).toContain("50% of first month's rent")
        expect(text).not.toMatch(/Contact us/)
        expect(text).not.toMatch(/entry fee|surprise|doesn't charge you before/i)
        expect(String(meta.description)).not.toMatch(/entry fee/i)
      })

      it("does not claim features the platform only simulates or counts that drifted", () => {
        const { container } = render(<Page />)
        const text = `${container.textContent} ${String(meta.description)} ${String(meta.title)}`
        expect(text).not.toMatch(/4 bureaus|credit building/i)
        expect(text).not.toMatch(/six roles|6 roles|6 auth roles|all six/i)
        expect(text).not.toMatch(/10 built-in|10 calculators|10 tools|10 live tools|10 financial calculators/i)
        expect(text).not.toMatch(/crypto/i)
        expect(text).not.toMatch(/2026 roadmap/i)
      })

      it("dates competitor facts", () => {
        const { container } = render(<Page />)
        expect(container.textContent).toContain(`as of ${COMPETITOR_FACTS_AS_OF}`)
      })
    })
  }

  it("builds Ondo's price from the shared fee constants", () => {
    expect(ONDO_FEE_SUMMARY).toBe("10% of collected rent (1–4 units), 8% (5–15 units)")
    expect(COMPETITOR_FACTS_AS_OF).toBe(FEE_COMPARISON_AS_OF)
  })

  it("every Ondo price cell in the tables uses that one summary", () => {
    for (const cats of [BUILDIUM_CATEGORIES, TURBOTENANT_CATEGORIES]) {
      const row = cats.flatMap((c) => c.rows).find((r) => r.feature === "What you pay")
      expect(row?.ondo).toBe(ONDO_FEE_SUMMARY)
    }
  })
})
