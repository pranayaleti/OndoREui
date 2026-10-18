import { describe, it, expect } from "vitest"
import { FOUNDER_PROFILE_PATH, FOUNDER_SLUG, founderRoleLabel, getFounder } from "./team-data"

describe("founder record", () => {
  it("is the listed team member with a profile path under /about/team/", () => {
    const founder = getFounder()
    expect(founder.slug).toBe(FOUNDER_SLUG)
    expect(founder.name).toBe("Pranay Reddy Aleti")
    expect(FOUNDER_PROFILE_PATH).toBe("/about/team/pranay-reddy-aleti/")
    expect(founder.image).toBe("/founder-image.webp")
    expect(founder.areaServed).toEqual(["Salt Lake County", "Utah County", "Davis County", "Weber County"])
    expect(founder.sameAs).toEqual([])
  })

  it("carries the NMLS ID and empty sponsor placeholders until licensing", () => {
    expect(getFounder().licenses).toEqual({
      realEstate: { number: "", brokerageName: "" },
      mortgage: { nmlsId: "2699085", lenderName: "", lenderNmlsId: "" },
    })
  })

  it("adds the license titles to the role line only when live", () => {
    expect(founderRoleLabel(false)).toBe("Founder, Ondo Real Estate")
    expect(founderRoleLabel(false)).not.toMatch(/agent|loan officer/i)
    expect(founderRoleLabel(true)).toBe("Founder · Utah real estate agent and loan officer")
  })
})
