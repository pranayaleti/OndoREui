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

import { CALCULATOR_CATALOG, CALCULATOR_SLUGS } from "@/lib/calculator-catalog"
import CalculatorBySlugPage, { generateStaticParams } from "./page"

function jsonLdOf(container: HTMLElement): Array<Record<string, unknown>> {
  return Array.from(container.querySelectorAll('script[type="application/ld+json"]')).flatMap((el) => {
    const parsed = JSON.parse(el.textContent ?? "null")
    return Array.isArray(parsed) ? parsed : [parsed]
  })
}

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

describe("calculator registry", () => {
  it("routes exactly the slugs in CALCULATOR_CATALOG", async () => {
    const params = await generateStaticParams()
    expect(params.map((p) => p.slug).sort()).toEqual([...CALCULATOR_SLUGS].sort())
  })
})

describe("calculator structured data", () => {
  it("names the calculator from the catalog, not the slug", async () => {
    const ui = await CalculatorBySlugPage({ params: Promise.resolve({ slug: "dscr" }) })
    const { container } = render(ui)
    const ld = jsonLdOf(container)
    const crumbs = ld.find((item) => item["@type"] === "BreadcrumbList") as {
      itemListElement: Array<{ name: string; item: string }>
    }
    expect(crumbs.itemListElement.at(-1)).toMatchObject({
      name: CALCULATOR_CATALOG.dscr!.name,
      item: expect.stringMatching(/\/calculators\/dscr\/$/),
    })
    const app = ld.find((item) => item["@type"] === "WebApplication")
    expect(app).toMatchObject({ name: "DSCR Calculator", url: expect.stringMatching(/\/calculators\/dscr\/$/) })
    const page = ld.find((item) => item["@type"] === "WebPage")
    expect(page?.name).toBe("DSCR Calculator")
    expect(JSON.stringify(ld)).not.toContain("Dscr")
  })

  it("keeps acronyms in the intro heading", async () => {
    const ui = await CalculatorBySlugPage({ params: Promise.resolve({ slug: "dscr" }) })
    render(ui)
    expect(screen.getByRole("heading", { name: "How the DSCR Calculator works" })).toBeInTheDocument()
  })
})
