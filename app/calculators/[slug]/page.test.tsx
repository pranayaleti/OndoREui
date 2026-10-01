import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

vi.mock("next/dynamic", () => ({
  default: () =>
    function MockCalculator() {
      return <section data-testid="calculator-widget">Calculator widget</section>
    },
}))
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("not found") } }))
vi.mock("@/components/content/related-content", () => ({ RelatedContent: () => <div data-testid="related" /> }))
vi.mock("@/components/calculators/calculator-usage-tracker", () => ({ CalculatorUsageTracker: () => null }))

import CalculatorBySlugPage from "./page"

describe("calculator page layout", () => {
  it("renders the calculator before the explainer content so the tool is above the fold", async () => {
    const ui = await CalculatorBySlugPage({ params: Promise.resolve({ slug: "mortgage-payment" }) })
    const { container } = render(ui)
    const widget = screen.getByTestId("calculator-widget")
    const main = container.querySelector("main") as HTMLElement
    // Everything the page renders in static HTML around the widget (intro, explainer, glossary, related).
    const siblings = Array.from(main.children).filter((el) => el.tagName !== "SCRIPT")
    const widgetIndex = siblings.indexOf(widget)
    expect(widgetIndex).toBeGreaterThanOrEqual(0)
    const contentBefore = siblings.slice(0, widgetIndex)
    expect(contentBefore).toHaveLength(0)
    // The explainer and the related-content block still follow it in the static HTML.
    expect(siblings.slice(widgetIndex + 1).length).toBeGreaterThan(1)
    expect(screen.getByTestId("related")).toBeInTheDocument()
  })
})
