import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import SEO, { buildBreadcrumbItems } from "@/components/seo"

const domain = "https://www.ondorealestate.com"

describe("buildBreadcrumbItems", () => {
  it("links every crumb to its canonical trailing-slash URL", () => {
    expect(buildBreadcrumbItems({ pathname: "/buy/first-time/grants/", title: "Grants", domain })).toEqual([
      { name: "Home", url: `${domain}/` },
      { name: "Buy", url: `${domain}/buy/` },
      { name: "First Time", url: `${domain}/buy/first-time/` },
      { name: "Grants", url: `${domain}/buy/first-time/grants/` },
    ])
  })

  it("routes prefixes without a page of their own to their hub (/vs has none)", () => {
    expect(buildBreadcrumbItems({ pathname: "/vs/buildium/", title: "Ondo RE vs Buildium", domain })).toEqual([
      { name: "Home", url: `${domain}/` },
      { name: "Compare", url: `${domain}/compare/` },
      { name: "Ondo RE vs Buildium", url: `${domain}/vs/buildium/` },
    ])
  })
})

describe("SEO", () => {
  it("emits a BreadcrumbList whose items are canonical URLs", () => {
    const { container } = render(<SEO title="Ondo RE vs TurboTenant" description="Compare" pathname="/vs/turbotenant/" />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const payload = JSON.parse(script?.innerHTML ?? "[]")
    const entries: Array<Record<string, unknown>> = Array.isArray(payload) ? payload : [payload]
    const breadcrumb = entries.find((entry) => entry["@type"] === "BreadcrumbList") as
      | { itemListElement: Array<{ item: string }> }
      | undefined
    expect(breadcrumb?.itemListElement.map((element) => element.item.replace(/^https?:\/\/[^/]+/, ""))).toEqual([
      "/",
      "/compare/",
      "/vs/turbotenant/",
    ])
  })
})
