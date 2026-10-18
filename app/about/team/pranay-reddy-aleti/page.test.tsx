import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"

vi.mock("@/lib/site", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/site")>()),
  SITE_RE_LICENSE_NUMBER: "RE-1234567",
  SITE_BROKERAGE_NAME: "Test Realty",
  SITE_LENDER_NAME: "Test Lending",
  SITE_COMPANY_NMLS_ID: "123456",
}))

import FounderProfilePage, { metadata } from "./page"
import { FounderProfile } from "@/components/people/founder-profile"
import { FOUNDER_PERSON_ID } from "@/lib/seo"

const jsonLdBlocks = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('script[type="application/ld+json"]')).flatMap((node) => {
    const parsed = JSON.parse(node.textContent ?? "null")
    return Array.isArray(parsed) ? parsed : [parsed]
  })

const hasType = (block: { "@type"?: string | string[] }, type: string) =>
  Array.isArray(block["@type"]) ? block["@type"].includes(type) : block["@type"] === type

describe("/about/team/pranay-reddy-aleti/", () => {
  it("has one main landmark labelled by the founder's name", () => {
    render(<FounderProfilePage />)
    const mains = screen.getAllByRole("main")
    expect(mains).toHaveLength(1)
    expect(mains[0]).toHaveAccessibleName("Pranay Reddy Aleti")
  })

  it("publishes a self-canonical, a name-first title and a snippet-length description", () => {
    const title = typeof metadata.title === "object" && metadata.title && "absolute" in metadata.title ? metadata.title.absolute : ""
    expect(title).toBe("Pranay Reddy Aleti: Founder of Ondo Real Estate")
    expect(title.length).toBeLessThanOrEqual(60)
    expect(metadata.description?.length).toBeLessThanOrEqual(160)
    expect(metadata.alternates?.canonical).toBe("https://www.ondorealestate.com/about/team/pranay-reddy-aleti/")
    expect(metadata.robots).toBeUndefined()
  })

  it("embeds the one full Person node as the ProfilePage's main entity, with no license title", () => {
    const { container } = render(<FounderProfilePage />)
    const blocks = jsonLdBlocks(container)
    const webPages = blocks.filter((block) => hasType(block, "WebPage"))
    expect(webPages).toHaveLength(1)
    expect(hasType(webPages[0], "ProfilePage")).toBe(true)
    expect(webPages[0].mainEntity["@id"]).toBe(FOUNDER_PERSON_ID)
    expect(webPages[0].mainEntity.jobTitle).toBe("Founder")
    expect(webPages[0].mainEntity).not.toHaveProperty("hasCredential")
  })

  it("says licensing is in progress and shows no license number while the switch is off", () => {
    render(<FounderProfilePage />)
    expect(screen.getByText(/licensing is in progress/i)).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/NMLS #\d|license #/i)
    expect(screen.getByRole("link", { name: /licensing & disclosures/i })).toHaveAttribute("href", "/licensing/")
  })

  // Unlicensed, the services belong to Ondo; a first-person offer to list or negotiate waits for licensing.
  it("offers services as Ondo, not in the first person, while licensing is off", () => {
    render(<FounderProfile live={false} />)
    expect(screen.getByRole("heading", { level: 2, name: "How Ondo can help" })).toBeInTheDocument()
    expect(screen.queryByRole("heading", { name: "How I can help" })).not.toBeInTheDocument()
  })

  it("lists license numbers, sponsors and NMLS Consumer Access once live", () => {
    render(<FounderProfile live />)
    expect(screen.getByText(/license #RE-1234567, with Test Realty/)).toBeInTheDocument()
    expect(screen.getByText(/NMLS #2699085, with Test Lending \(NMLS #123456\)/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /verify at nmls consumer access/i })).toHaveAttribute(
      "href",
      "https://www.nmlsconsumeraccess.org/",
    )
  })

  it("links to the founder's letter, the services and booking", () => {
    render(<FounderProfilePage />)
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"))
    for (const expected of ["/founders-letter/", "/property-management/", "/buy/", "/sell/", "/loans/", "/contact/"]) {
      expect(hrefs).toContain(expected)
    }
  })
})
