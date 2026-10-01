import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import OpportunitiesPage, { metadata as opportunitiesMeta } from "./opportunities/page"
import InvestmentDetailPage, { generateMetadata } from "./[slug]/page"
import InvestmentsPage from "./page"
import FractionalPage from "./fractional/page"
import { InvestmentCard } from "@/components/investments/investment-card"
import { MOCK_OPPORTUNITIES, SAMPLE_DEAL_LABEL } from "@/lib/investments-data"

describe("sample investment deals", () => {
  it("opportunities list is noindex and shows only sample deals, no status sections", async () => {
    expect(opportunitiesMeta.robots).toMatchObject({ index: false })
    const { container } = render(await OpportunitiesPage())
    const text = container.textContent ?? ""
    expect(text).toContain("Ondo has no investment open to investors")
    expect(text).not.toMatch(/Open Opportunities|Recently Funded|Coming Soon|Fully Funded/)
    expect(screen.getAllByText(SAMPLE_DEAL_LABEL).length).toBeGreaterThanOrEqual(MOCK_OPPORTUNITIES.length)
  })

  it("detail pages are noindex, labelled as samples and have no invest/inquiry call to action", async () => {
    const slug = MOCK_OPPORTUNITIES[0]!.slug
    const meta = await generateMetadata({ params: Promise.resolve({ slug }) })
    expect(meta.robots).toMatchObject({ index: false })
    expect(String(meta.title)).toContain(SAMPLE_DEAL_LABEL)

    const { container } = render(await InvestmentDetailPage({ params: Promise.resolve({ slug }) }))
    const text = container.textContent ?? ""
    expect(text).toContain("This is a sample")
    expect(text).not.toMatch(/Interested in This Investment|Submit Inquiry|Open for Investment/)
    expect(container.querySelector("form")).toBeNull()
  })

  it("sample records carry no real company names or invented track record", () => {
    const blob = JSON.stringify(MOCK_OPPORTUNITIES)
    expect(blob).not.toMatch(/Intermountain/i)
    expect(blob).not.toMatch(/ahead of projections/i)
    expect(blob).not.toMatch(/already fully capitalized|opened in 2021/i)
  })

  it("the card badges a record as a sample, not Open/Funded", () => {
    for (const opportunity of MOCK_OPPORTUNITIES) {
      const { container, unmount } = render(<InvestmentCard opportunity={opportunity} />)
      expect(container.textContent).toContain(SAMPLE_DEAL_LABEL)
      expect(container.textContent).not.toMatch(/Open\b|Coming Soon|Fully Funded/)
      unmount()
    }
  })

  it("hub and fractional pages do not describe a live offering", () => {
    const hub = render(<InvestmentsPage />).container.textContent ?? ""
    expect(hub).not.toMatch(/vetted opportunities|View Current Opportunities|Current Opportunities/)
    expect(hub).toContain("Ondo has no investment open to investors")
    const fractional = render(<FractionalPage />).container.textContent ?? ""
    expect(fractional).not.toMatch(/\$10,000–\$50,000|institutional-quality/i)
  })
})
