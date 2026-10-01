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

describe("SEO structured data", () => {
  const entriesOf = (container: HTMLElement) => {
    const script = container.querySelector('script[type="application/ld+json"]')
    const payload = JSON.parse(script?.innerHTML ?? "[]")
    return (Array.isArray(payload) ? payload : [payload]) as Array<Record<string, unknown>>
  }

  it("points WebPage and BlogPosting at the canonical trailing-slash URL", () => {
    const { container } = render(
      <SEO
        title="A post"
        description="d"
        pathname="/blog/a-post"
        publishedTime="2026-01-01"
        tags={["Utah landlords"]}
      />,
    )
    const entries = entriesOf(container)
    expect(entries.find((e) => e["@type"] === "WebPage")?.url).toBe(`${domain}/blog/a-post/`)
    expect(entries.find((e) => e["@type"] === "BlogPosting")?.mainEntityOfPage).toBe(`${domain}/blog/a-post/`)
  })

  it("keeps BlogPosting keywords to the post's own tags, not the site-wide list", () => {
    const { container } = render(
      <SEO title="A post" description="d" pathname="/blog/a-post/" publishedTime="2026-01-01" tags={["Utah landlords", "Rent"]} />,
    )
    const post = entriesOf(container).find((e) => e["@type"] === "BlogPosting")
    expect(post?.keywords).toEqual(["Utah landlords", "Rent"])
  })

  it("gives the BlogPosting a publisher logo and emits one article block", () => {
    const { container } = render(
      <SEO title="A post" description="d" pathname="/blog/a-post/" publishedTime="2026-01-01" />,
    )
    const entries = entriesOf(container)
    const posts = entries.filter((e) => e["@type"] === "BlogPosting" || e["@type"] === "Article")
    expect(posts).toHaveLength(1)
    expect(posts[0]?.publisher).toMatchObject({ logo: { "@type": "ImageObject" } })
  })
})
