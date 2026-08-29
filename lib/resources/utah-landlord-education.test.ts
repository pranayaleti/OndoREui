import { describe, expect, it } from "vitest"
import {
  UTAH_LANDLORD_EDUCATION_DISCLAIMER,
  UTAH_LANDLORD_EDUCATION_KINDS,
  UTAH_LANDLORD_EDUCATION_LINKS,
  groupedUtahLandlordEducationLinks,
} from "./utah-landlord-education"

describe("UTAH_LANDLORD_EDUCATION_LINKS", () => {
  it("includes the three source homepages plus Fit Premises, HUD, and RHA education-center", () => {
    const hrefs = UTAH_LANDLORD_EDUCATION_LINKS.map((link) => link.href)
    expect(hrefs).toEqual(
      expect.arrayContaining([
        "https://www.thegoodlandlord.net/home/",
        "https://www.thegoodlandlord.net/home/helpfulwebsites",
        "https://www.rhautah.org/education-center",
      ]),
    )
    expect(hrefs.some((href) => href.includes("le.utah.gov") && href.includes("Chapter22"))).toBe(
      true,
    )
    expect(hrefs.some((href) => href.includes("hud.gov"))).toBe(true)
    expect(hrefs.filter((href) => href === "https://www.rhautah.org/education-center")).toHaveLength(
      1,
    )
  })

  it("keeps every entry as an outbound https link with a kind, source, and description", () => {
    expect(UTAH_LANDLORD_EDUCATION_LINKS.length).toBeGreaterThanOrEqual(6)
    for (const link of UTAH_LANDLORD_EDUCATION_LINKS) {
      expect(link.href.startsWith("https://")).toBe(true)
      expect(UTAH_LANDLORD_EDUCATION_KINDS).toContain(link.kind)
      expect(link.title.length).toBeGreaterThan(8)
      expect(link.source.length).toBeGreaterThan(2)
      expect(link.description.length).toBeGreaterThan(20)
    }
  })

  it("frames the list as third-party education, not Ondo legal advice or a city discount", () => {
    const text = UTAH_LANDLORD_EDUCATION_DISCLAIMER.toLowerCase()
    expect(text).toMatch(/third-party/)
    expect(text).toMatch(/not legal advice/)
    expect(text).toMatch(/does not operate/)
    expect(text).toMatch(/fair housing/)
    expect(text).toMatch(/equal housing/)
    expect(text).not.toMatch(/nmls/)
    expect(text).not.toMatch(/guaranteed/)
  })
})

describe("groupedUtahLandlordEducationLinks", () => {
  it("returns official, training, forms, and association groups without dropping links", () => {
    const groups = groupedUtahLandlordEducationLinks()
    expect(groups.map((group) => group.kind)).toEqual([...UTAH_LANDLORD_EDUCATION_KINDS])
    const groupedCount = groups.reduce((sum, group) => sum + group.links.length, 0)
    expect(groupedCount).toBe(UTAH_LANDLORD_EDUCATION_LINKS.length)
    expect(groups.every((group) => group.links.length > 0)).toBe(true)
  })
})
