import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import type { ReactElement } from "react"
import { FOUNDER_PERSON_ID, generateRealEstateBusinessJsonLd } from "./seo"
import FounderProfilePage from "@/app/about/team/pranay-reddy-aleti/page"
import FoundersLetterPage from "@/app/founders-letter/page"
import LandlordGuide from "@/app/blog/ultimate-guide-becoming-utah-landlord-2026/page"
import NotaryGuide from "@/app/blog/mobile-notary-utah-county-guide/page"
import FhaPage from "@/app/loans/fha/page"

type Json = Record<string, unknown>

function jsonLd(element: ReactElement): Json[] {
  const { container, unmount } = render(element)
  const nodes = Array.from(container.querySelectorAll('script[type="application/ld+json"]')).flatMap((script) => {
    const parsed = JSON.parse(script.textContent ?? "null")
    return Array.isArray(parsed) ? parsed : [parsed]
  })
  unmount()
  return nodes
}

function walk(node: unknown, visit: (node: Json) => void) {
  if (Array.isArray(node)) node.forEach((child) => walk(child, visit))
  else if (node && typeof node === "object") {
    visit(node as Json)
    Object.values(node as Json).forEach((child) => walk(child, visit))
  }
}

const PAGES: [string, () => Json[]][] = [
  ["Organization (layout)", () => [generateRealEstateBusinessJsonLd()]],
  ["/about/team/pranay-reddy-aleti/", () => jsonLd(<FounderProfilePage />)],
  ["/founders-letter/", () => jsonLd(<FoundersLetterPage />)],
  ["ArticleShell post", () => jsonLd(<LandlordGuide />)],
  ["non-ArticleShell post", () => jsonLd(<NotaryGuide />)],
  ["/loans/fha/", () => jsonLd(<FhaPage />)],
]

describe("the founder is one entity across the site", () => {
  it("gives every Person node named Pranay Reddy Aleti the one @id, with the full node only on the profile page", () => {
    const problems: string[] = []
    for (const [label, nodes] of PAGES) {
      walk(nodes(), (node) => {
        if (node["@type"] !== "Person" || node.name !== "Pranay Reddy Aleti") return
        if (node["@id"] !== FOUNDER_PERSON_ID) problems.push(`${label}: Person without the shared @id`)
        const full = "knowsAbout" in node || "jobTitle" in node
        if (full && label !== "/about/team/pranay-reddy-aleti/") problems.push(`${label}: full Person outside the profile page`)
      })
    }
    expect(problems).toEqual([])
  })

  it("points every reviewedBy on these pages at the founder's @id", () => {
    for (const [label, nodes] of PAGES.slice(3)) {
      const reviewers: unknown[] = []
      walk(nodes(), (node) => {
        if (node.reviewedBy) reviewers.push((node.reviewedBy as Json)["@id"])
      })
      expect(reviewers, label).toEqual([FOUNDER_PERSON_ID])
    }
  })
})
