import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import FoundersLetterPage, { metadata } from "./page"
import { FOUNDER_PERSON_ID } from "@/lib/seo"

const jsonLdBlocks = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('script[type="application/ld+json"]')).flatMap((node) => {
    const parsed = JSON.parse(node.textContent ?? "null")
    return Array.isArray(parsed) ? parsed : [parsed]
  })

const hasType = (block: { "@type"?: string | string[] }, type: string) =>
  Array.isArray(block["@type"]) ? block["@type"].includes(type) : block["@type"] === type

describe("/founders-letter page", () => {
  it("renders one main landmark labelled by the h1 and no banner landmarks", () => {
    const { container } = render(<FoundersLetterPage />)
    const mains = screen.getAllByRole("main")
    expect(mains).toHaveLength(1)
    expect(mains[0]).toHaveAccessibleName("A Letter From the Founder")
    expect(container.querySelector("header")).toBeNull()
    expect(screen.queryByRole("banner")).toBeNull()
  })

  it("leaves the skip-link target id to the layout", () => {
    const { container } = render(<FoundersLetterPage />)
    expect(container.querySelector("#main-content")).toBeNull()
  })

  it("exposes the founder photo to screen readers", () => {
    render(<FoundersLetterPage />)
    const photo = screen.getByRole("img", { name: /Pranay Reddy Aleti/ })
    expect(photo.closest("[aria-hidden='true']")).toBeNull()
  })

  it("tints the stat cards instead of filling them solid orange", () => {
    const { container } = render(<FoundersLetterPage />)
    const cards = Array.from(container.querySelectorAll("div.bg-primary\\/20"))
    expect(cards).toHaveLength(4)
    expect(container.querySelector(".bg-opacity-20")).toBeNull()
  })

  it("publishes a self-canonical with a search-intent title and a description that fits a snippet", () => {
    const title = typeof metadata.title === "object" && metadata.title && "absolute" in metadata.title ? metadata.title.absolute : ""
    expect(title).toContain("Ondo Real Estate")
    expect(title.length).toBeLessThanOrEqual(60)
    expect(metadata.description?.length).toBeLessThanOrEqual(160)
    expect(metadata.alternates?.canonical).toBe("https://www.ondorealestate.com/founders-letter/")
    expect(metadata.alternates?.types?.["text/markdown"]).toBe("https://www.ondorealestate.com/founders-letter.md")
    const ogImages = metadata.openGraph?.images
    expect(Array.isArray(ogImages) && ogImages.length).toBe(1)
  })

  it("does not date being a landlord to the first home in 2019", () => {
    render(<FoundersLetterPage />)
    expect(document.body.textContent).not.toMatch(/landlord since 2019/i)
  })

  it("marks the letter up as an Article by the founder's one Person id", () => {
    const { container } = render(<FoundersLetterPage />)
    const blocks = jsonLdBlocks(container)
    expect(blocks.filter((block) => hasType(block, "ProfilePage"))).toHaveLength(0)
    expect(blocks.filter((block) => hasType(block, "WebPage"))).toHaveLength(1)
    const article = blocks.find((block) => hasType(block, "Article"))
    expect(article.author).toEqual({ "@type": "Person", "@id": FOUNDER_PERSON_ID, name: "Pranay Reddy Aleti" })
    expect(article.url).toBe("https://www.ondorealestate.com/founders-letter/")
    expect(JSON.stringify(blocks)).not.toContain('"jobTitle"')
    const breadcrumb = blocks.find((block) => hasType(block, "BreadcrumbList"))
    expect(breadcrumb.itemListElement.at(-1).item).toBe("https://www.ondorealestate.com/founders-letter/")
  })

  it("links the letter to the pages it talks about with canonical trailing-slash hrefs", () => {
    render(<FoundersLetterPage />)
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"))
    for (const expected of ["/property-management/", "/solutions/tenants/", "/about/", "/why-utah/", "/contact/", "/about/team/pranay-reddy-aleti/"]) {
      expect(hrefs).toContain(expected)
    }
    for (const href of hrefs) {
      if (href?.startsWith("/")) expect(href.endsWith("/")).toBe(true)
    }
  })
})
