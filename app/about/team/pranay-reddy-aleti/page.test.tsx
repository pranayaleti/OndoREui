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
import { FounderProfile, founderProfileTitle } from "@/components/people/founder-profile"
import { LICENSING_LIVE } from "@/lib/site"
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
    expect(title).toBe(founderProfileTitle(LICENSING_LIVE))
    expect(founderProfileTitle(false)).toBe("Pranay Reddy Aleti: Founder of Ondo Real Estate")
    expect(title.length).toBeLessThanOrEqual(60)
    expect(metadata.description?.length).toBeLessThanOrEqual(160)
    expect(metadata.alternates?.canonical).toBe("https://www.ondorealestate.com/about/team/pranay-reddy-aleti/")
    expect(metadata.robots).toBeUndefined()
  })

  it("embeds the one full Person node as the ProfilePage's main entity, with no license title while off", () => {
    const { container } = render(<FounderProfile live={false} />)
    const blocks = jsonLdBlocks(container)
    const webPages = blocks.filter((block) => hasType(block, "WebPage"))
    expect(webPages).toHaveLength(1)
    expect(hasType(webPages[0], "ProfilePage")).toBe(true)
    expect(webPages[0].mainEntity["@id"]).toBe(FOUNDER_PERSON_ID)
    expect(webPages[0].mainEntity.jobTitle).toBe("Founder")
    expect(webPages[0].mainEntity).not.toHaveProperty("hasCredential")
  })

  it("says licensing is in progress and shows no license number while the switch is off", () => {
    render(<FounderProfile live={false} />)
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

  it("shows only the agent line and title when the real estate license is live", () => {
    const state = { re: true, mlo: false, notary: false }
    expect(founderProfileTitle(state)).toBe("Pranay Reddy Aleti: Utah Real Estate Agent in Lehi")
    render(<FounderProfile live={state} />)
    expect(screen.getByText(/license #RE-1234567, with Test Realty/)).toBeInTheDocument()
    expect(screen.getByText("Mortgage licensing is in progress.")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /verify with the utah division of real estate/i })).toHaveAttribute(
      "href",
      "https://realestate.utah.gov/",
    )
    expect(document.body.textContent).not.toMatch(/NMLS|loan officer|never both/i)
    expect(screen.getByRole("heading", { level: 2, name: "How Ondo can help" })).toBeInTheDocument()
  })

  it("shows only the loan officer line and title when the mortgage license is live", () => {
    const state = { re: false, mlo: true, notary: false }
    expect(founderProfileTitle(state)).toBe("Pranay Reddy Aleti: Utah Mortgage Loan Originator")
    render(<FounderProfile live={state} />)
    expect(screen.getByText(/NMLS #2699085, with Test Lending \(NMLS #123456\)/)).toBeInTheDocument()
    expect(screen.getByText("Real estate licensing is in progress.")).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/real estate agent|license #RE|never both/i)
  })

  // Utah bars one person from being the agent and the loan originator on the same deal.
  it("states the one-role-per-deal rule only once both licenses are live", () => {
    render(<FounderProfile live />)
    expect(screen.getByText(/one of the two roles, never both/)).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 2, name: "How I can help" })).toBeInTheDocument()
  })

  it("adds the notary commission line with the state registry link once the commission is live", () => {
    render(<FounderProfile live={{ re: false, mlo: false, notary: true }} />)
    expect(screen.getByText(/Utah notary public, commission #/)).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /verify on the utah notary search/i })).toHaveAttribute(
      "href",
      "https://secure.utah.gov/notary/search.html",
    )
    expect(document.body.textContent).not.toMatch(/NMLS #|license #RE/)
  })

  it("keeps every title variant inside the search result budget", () => {
    for (const state of [false, true, { re: true, mlo: false, notary: false }, { re: false, mlo: true, notary: false }]) {
      expect(founderProfileTitle(state).length, JSON.stringify(state)).toBeLessThanOrEqual(60)
    }
  })

  it("links to the founder's letter, the services and booking", () => {
    render(<FounderProfilePage />)
    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"))
    for (const expected of ["/founders-letter/", "/property-management/", "/buy/", "/sell/", "/loans/", "/contact/"]) {
      expect(hrefs).toContain(expected)
    }
  })
})
