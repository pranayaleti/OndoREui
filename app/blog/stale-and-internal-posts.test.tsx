import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import RateTrends, { metadata as rateMetadata } from "./mortgage-rate-trends-2025/page"
import TechnicalSeo, { metadata as seoMetadata } from "./technical-seo-for-real-estate/page"
import NotaryWorkflows, { metadata as notaryMetadata } from "./modernizing-notary-workflows-integration/page"
import { metadata as eng0 } from "./building-high-performance-real-estate-nextjs-supabase/page"
import { metadata as eng1 } from "./engineering-real-estate-investment-calculators/page"
import { metadata as eng4 } from "./dashboards-for-landlords/page"
import { metadata as eng5 } from "./designing-property-owner-portal/page"
import { metadata as eng6 } from "./full-stack-dev-landlord-gaps/page"
import { metadata as eng7 } from "./property-management-pwa-offline/page"
import { metadata as eng8 } from "./how-ondo-re-uses-technology-property-management/page"

function text(Page: () => React.ReactElement): string {
  const { container } = render(<Page />)
  container.querySelectorAll("script, style").forEach((el) => el.remove())
  return container.textContent ?? ""
}

describe("mortgage-rate-trends-2025 is evergreen and matches the lending facts", () => {
  it("is not titled as a 2025 outlook", () => {
    expect(String(rateMetadata.title)).not.toMatch(/2025/)
    expect(String(rateMetadata.description)).not.toMatch(/2025|coming year/i)
  })

  it("does not tell readers to rely on APR alone or quote a standard point break-even", () => {
    const t = text(RateTrends)
    expect(t).not.toMatch(/always compare APRs/i)
    expect(t).not.toMatch(/typically 3–5 years/)
    expect(t).toMatch(/same loan amount, property type and lock period/)
  })
})

describe("internal engineering posts are out of the index and make no false claims", () => {
  it.each([
    ["technical-seo-for-real-estate", seoMetadata],
    ["modernizing-notary-workflows-integration", notaryMetadata],
    ["building-high-performance-real-estate-nextjs-supabase", eng0],
    ["engineering-real-estate-investment-calculators", eng1],
    ["dashboards-for-landlords", eng4],
    ["designing-property-owner-portal", eng5],
    ["full-stack-dev-landlord-gaps", eng6],
    ["property-management-pwa-offline", eng7],
    ["how-ondo-re-uses-technology-property-management", eng8],
  ])("%s is noindex,follow", (_slug, metadata) => {
    expect(metadata.robots).toEqual({ index: false, follow: true })
  })

  it("technical SEO post does not claim Next/Image optimization, star ratings or a discontinued service", () => {
    const t = text(TechnicalSeo)
    expect(t).not.toMatch(/Next\/Image/)
    expect(t).not.toMatch(/star ratings/i)
    expect(t).not.toMatch(/Mobile notary Orem/)
    expect(t).not.toMatch(/you don.t exist|dominate/i)
  })

  it("notary workflow post publishes no file paths, inbox address or unsourced statistic", () => {
    const t = text(NotaryWorkflows)
    expect(t).not.toMatch(/components\/|notary-service-areas|SITE_EMAILS|@/)
    expect(t).not.toMatch(/90%/)
  })
})
