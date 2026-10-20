import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import FoundersLetterPage, { metadata } from "./page"
import { FOUNDER_PERSON_ID } from "@/lib/seo"
import { findLicenseClaims } from "@/lib/license-claims"
import { FOUNDED_YEAR } from "@/lib/social-proof-stats"
import { SITE_URL } from "@/lib/site"

const H1 = "I came to the United States to study computer science. I stayed to build something of my own."

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
    expect(mains[0]).toHaveAccessibleName(H1)
    expect(container.querySelector("header")).toBeNull()
    expect(screen.queryByRole("banner")).toBeNull()
  })

  it("leaves the skip-link target id to the layout", () => {
    const { container } = render(<FoundersLetterPage />)
    expect(container.querySelector("#main-content")).toBeNull()
  })

  it("exposes the founder photo and the fire mark to screen readers", () => {
    render(<FoundersLetterPage />)
    const photos = screen.getAllByRole("img", { name: /Pranay Reddy Aleti/ })
    expect(photos.length).toBeGreaterThanOrEqual(1)
    for (const photo of photos) expect(photo.closest("[aria-hidden='true']")).toBeNull()
    const mark = screen.getByRole("img", { name: /silhouette/i })
    expect(mark.getAttribute("alt")?.length).toBeGreaterThan(10)
  })

  it("highlights Utah growth in the startup chapter and shows no read time", () => {
    render(<FoundersLetterPage />)
    const accent = screen.getByText("Utah growth")
    expect(accent.tagName).toBe("STRONG")
    expect(accent.closest("#chapter-2025")).not.toBeNull()
    for (const name of ["Mobly", "EZ Salt", "Stratus"]) expect(document.body.textContent).toContain(name)
    expect(document.body.textContent).not.toMatch(/minute read/i)
    expect(document.body.textContent).not.toContain("Or start with the story")
    expect(screen.queryByRole("heading", { name: "Start here" })).toBeNull()
  })

  it("dates the first home to Lehi and keeps the city out of the masthead", () => {
    render(<FoundersLetterPage />)
    expect(document.body.textContent).toContain("I bought my first home in Lehi, Utah.")
    expect(screen.getByText("A letter from the founder of Ondo Real Estate, Utah.")).toBeInTheDocument()
  })

  it("signs off as founder without a city or a read-through date", () => {
    render(<FoundersLetterPage />)
    expect(screen.getByText("Founder, Ondo Real Estate.")).toBeInTheDocument()
  })

  it("tells the journey as dated chapters in order, outside any list", () => {
    const { container } = render(<FoundersLetterPage />)
    const years = Array.from(container.querySelectorAll("main h2"))
      .map((h) => h.textContent?.match(/^(\d{4})/)?.[1])
      .filter(Boolean)
    expect(years).toEqual(["2011", "2013", "2018", "2019", String(FOUNDED_YEAR), "2023", "2024", "2025"])
    for (const h of container.querySelectorAll("main h2")) expect(h.closest("li")).toBeNull()
    expect(container.querySelector("main dl")).toBeNull()
    expect(container.querySelector("main .bg-card")).toBeNull()
    expect(container.querySelector("main .rounded-xl")).toBeNull()
  })

  it("explains the name and the mark in brand voice without a license claim", () => {
    const { container } = render(<FoundersLetterPage />)
    const text = document.body.textContent ?? ""
    expect(text).toContain("ON it. DO it.")
    expect(text).not.toContain("Last read through")
    expect(text).toContain("That silhouette is me")
    expect(text).not.toContain("—")
    expect(text).not.toMatch(/landlord/i)
    expect(text).not.toMatch(/\b(?:straightforward|genuinely|honestly|delve|dive into)\b/i)
    expect(text).not.toMatch(/foundation and rhythm/i)
    expect(findLicenseClaims(container.innerHTML, "html")).toEqual([])
  })

  it("publishes a self-canonical with a search-intent title and a pronoun-free description", () => {
    const title = typeof metadata.title === "object" && metadata.title && "absolute" in metadata.title ? metadata.title.absolute : ""
    expect(title).toContain("Ondo Real Estate")
    expect(title.length).toBeLessThanOrEqual(60)
    expect(metadata.description?.length).toBeLessThanOrEqual(160)
    expect(metadata.description).not.toMatch(/\b(?:he|him|his)\b/i)
    expect(metadata.alternates?.canonical).toBe("https://www.ondorealestate.com/founders-letter/")
    expect(metadata.alternates?.types?.["text/markdown"]).toBe("https://www.ondorealestate.com/founders-letter.md")
    const ogImages = metadata.openGraph?.images
    expect(Array.isArray(ogImages) && ogImages.length).toBe(1)
    const og = Array.isArray(ogImages) ? ogImages[0] : null
    const ogUrl = og && typeof og === "object" && "url" in og ? String(og.url) : String(og)
    expect(ogUrl).toMatch(/\/founders-letter-og\.jpg$/)
  })

  it("marks the letter up as an Article by the founder's one Person id", () => {
    const { container } = render(<FoundersLetterPage />)
    const blocks = jsonLdBlocks(container)
    expect(blocks.filter((block) => hasType(block, "ProfilePage"))).toHaveLength(0)
    expect(blocks.filter((block) => hasType(block, "WebPage"))).toHaveLength(1)
    const article = blocks.find((block) => hasType(block, "Article"))
    expect(article.author).toEqual({ "@type": "Person", "@id": FOUNDER_PERSON_ID, name: "Pranay Reddy Aleti" })
    expect(article.url).toBe("https://www.ondorealestate.com/founders-letter/")
    expect(article.wordCount).toBeGreaterThan(1500)
    expect(JSON.stringify(blocks)).not.toContain('"jobTitle"')
    const breadcrumb = blocks.find((block) => hasType(block, "BreadcrumbList"))
    expect(breadcrumb.itemListElement.at(-1).item).toBe("https://www.ondorealestate.com/founders-letter/")
  })

  it("links the letter to the pages it talks about with canonical trailing-slash paths", () => {
    render(<FoundersLetterPage />)
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href") ?? "")
    for (const expected of [
      "/property-management/",
      "/properties/",
      "/about/",
      "/moving-to-utah/",
      "/contact/",
      "/about/team/pranay-reddy-aleti/",
      "/licensing/",
      "/buy/",
      "/sell/",
    ]) {
      expect(hrefs).toContain(expected)
    }
    for (const href of hrefs) {
      if (href.startsWith("/")) expect(new URL(href, SITE_URL).pathname.endsWith("/")).toBe(true)
    }
    expect(hrefs).toContain("/contact/?audience=owner")
  })

  it("offers the real conversion actions with founders_letter analytics", () => {
    const { container } = render(<FoundersLetterPage />)
    const bookings = container.querySelectorAll(
      '[data-analytics-event="book_call_click"][data-analytics-category="founders_letter"]',
    )
    expect(bookings.length).toBeGreaterThanOrEqual(2)
    for (const link of bookings) expect(link.getAttribute("href")).toMatch(/^https:\/\/calendly\.com\//)
    expect(container.querySelector('a[href^="tel:"]')).not.toBeNull()
  })
})
