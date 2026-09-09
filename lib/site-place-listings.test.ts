import { describe, it, expect } from "vitest"
import {
  SITE_ADDRESS_OBJ,
  SITE_PLACE_LISTINGS,
  SITE_SOCIALS,
  SITE_SOCIALS_ALL,
  SITE_SOCIAL_LINKS,
} from "./site"

describe("place listings vs social profiles", () => {
  it("keeps place listings out of the social list the footer renders", () => {
    // The footer maps SITE_SOCIAL_LINKS to social icons. A Foursquare venue or a
    // Bing Places record rendered as a social icon is wrong, so the two lists
    // must stay disjoint.
    const socialUrls = new Set(SITE_SOCIAL_LINKS.map((s) => s.url))
    const overlap = SITE_PLACE_LISTINGS.filter((p) => socialUrls.has(p.url))
    expect(overlap.map((p) => p.url)).toEqual([])
  })

  it("feeds live place listings into sameAs", () => {
    // sameAs is the entity-resolution signal: it is how an assistant decides the
    // Foursquare venue and this website are the same business.
    for (const listing of SITE_PLACE_LISTINGS) {
      if (listing.live) expect(SITE_SOCIALS).toContain(listing.url)
      else expect(SITE_SOCIALS).not.toContain(listing.url)
    }
  })

  it("exposes every listing in the audit list regardless of live status", () => {
    for (const listing of SITE_PLACE_LISTINGS) {
      expect(SITE_SOCIALS_ALL).toContain(listing.url)
    }
  })

  it("never emits a placeholder or empty URL into sameAs", () => {
    for (const url of SITE_SOCIALS) {
      expect(url, url).toMatch(/^https:\/\/[^\s]+$/)
      expect(url.toLowerCase(), url).not.toContain("example.com")
      expect(url, url).not.toContain("TODO")
    }
  })

  it("still has a complete address for the listings to be claimed against", () => {
    // Claiming Foursquare/Bing/Google with an address that differs from this one
    // creates a competing entity instead of reinforcing this one.
    expect(SITE_ADDRESS_OBJ.streetAddress).toBeTruthy()
    expect(SITE_ADDRESS_OBJ.addressLocality).toBeTruthy()
    expect(SITE_ADDRESS_OBJ.addressRegion).toBeTruthy()
    expect(SITE_ADDRESS_OBJ.postalCode).toMatch(/^\d{5}$/)
  })
})
