import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import ManufacturedAdu from "./manufactured-housing-adu-financing/page"
import MipVsPmi from "./mip-vs-pmi-how-mortgage-insurance-ends/page"
import MortgageReserves from "./mortgage-reserves-months-of-pitia/page"
import MedicalCollections from "./medical-collections-after-fico-model-change/page"
import UsdaVaFha from "./usda-vs-va-vs-fha-veteran-rural/page"
import Itin from "./itin-non-us-citizen-mortgage-documentation/page"
import ClosingCosts from "./utah-closing-costs-title-origination-prepaids/page"
import InterestOnly from "./interest-only-mortgages-who-they-are-for/page"
import PropertyTaxCalendar from "./utah-property-tax-calendar-first-escrow-analysis/page"

// These posts are assembled from shared lending-facts strings. A constant that fills a
// table cell must not be pasted again in the body, and two constants must not be joined
// into one garbled sentence.
const posts = {
  "manufactured-housing-adu-financing": ManufacturedAdu,
  "mip-vs-pmi-how-mortgage-insurance-ends": MipVsPmi,
  "mortgage-reserves-months-of-pitia": MortgageReserves,
  "medical-collections-after-fico-model-change": MedicalCollections,
  "usda-vs-va-vs-fha-veteran-rural": UsdaVaFha,
  "itin-non-us-citizen-mortgage-documentation": Itin,
  "utah-closing-costs-title-origination-prepaids": ClosingCosts,
  "interest-only-mortgages-who-they-are-for": InterestOnly,
  "utah-property-tax-calendar-first-escrow-analysis": PropertyTaxCalendar,
}

// Headings are skipped: the table of contents repeats them by design.
const BLOCKS = "p, li, td, th, summary, dd, dt, blockquote, figcaption, caption"

/** Text of each innermost block, so adjacent cells and paragraphs never run together. */
function blockTexts(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll(BLOCKS))
    .filter((el) => !el.querySelector(BLOCKS))
    .map((el) => el.textContent ?? "")
}

function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z“"])/)
    .map((s) => s.trim())
    .filter((s) => s.split(" ").length >= 6)
}

describe("lending-facts blog posts do not repeat sentences", () => {
  it.each(Object.entries(posts))("%s", (_slug, Page) => {
    const { container } = render(<Page />)
    // JSON-LD repeats the FAQ on purpose; only the visible text counts.
    container.querySelectorAll("script, style, nav, aside").forEach((el) => el.remove())
    const seen = new Set<string>()
    const repeated: string[] = []
    for (const s of blockTexts(container).flatMap(sentences)) {
      if (seen.has(s)) repeated.push(s)
      seen.add(s)
    }
    expect(repeated).toEqual([])
  })
})
