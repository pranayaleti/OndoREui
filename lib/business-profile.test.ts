import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import {
  LISTING_CATEGORIES,
  LISTING_DESCRIPTIONS,
  LISTING_DESCRIPTION_LIMITS,
  LISTING_SERVICES,
  SERVICE_AREA_CITIES,
  businessProfile,
  isServedCity,
  listingCategories,
  listingServices,
} from "./business-profile"
import { findLicenseClaims } from "./license-claims"
import { SITE_ADDRESS_OBJ, SITE_HOURS_LABEL, SITE_PHONE, SITE_URL } from "./site"

const nothingLive = { re: false, mlo: false, notary: false }

describe("business listing profile", () => {
  it("keeps every description inside the directory limits", () => {
    expect(LISTING_DESCRIPTIONS.short.length).toBeLessThanOrEqual(LISTING_DESCRIPTION_LIMITS.short)
    expect(LISTING_DESCRIPTIONS.standard.length).toBeLessThanOrEqual(LISTING_DESCRIPTION_LIMITS.standard)
    for (const service of LISTING_SERVICES) {
      expect(service.description.length, service.name).toBeLessThanOrEqual(LISTING_DESCRIPTION_LIMITS.service)
    }
  })

  // A listing description is quoted back by assistants; it must never claim a license that is not live.
  it("makes no license claim in any description while nothing is live", () => {
    const texts = [LISTING_DESCRIPTIONS.short, LISTING_DESCRIPTIONS.standard, ...LISTING_SERVICES.map((s) => s.description)]
    for (const text of texts) {
      expect(findLicenseClaims(text, "text", nothingLive), text).toEqual([])
      expect(text, text).not.toMatch(/licensed|NMLS|AI-powered|24\/7|200\+/i)
    }
  })

  it("lists only the categories and services that are true for the licenses that are live", () => {
    expect(listingCategories(nothingLive).map((c) => c.name)).toEqual(["Property management company"])
    expect(listingServices(nothingLive).map((s) => s.name)).toEqual(["Property management", "Tenant screening", "Rental listings"])
    expect(listingCategories({ ...nothingLive, re: true }).map((c) => c.name)).toContain("Real estate agency")
    expect(listingServices({ ...nothingLive, mlo: true }).map((s) => s.name)).toContain("Home loans")
    expect(listingServices({ ...nothingLive, notary: true }).map((s) => s.name)).toContain("Remote online notarization")
    expect(LISTING_CATEGORIES.filter((c) => c.when !== "now").every((c) => c.note)).toBe(true)
  })

  it("takes name, address and phone from the site constants, never retyped", () => {
    const profile = businessProfile(nothingLive)
    expect(profile.phone).toBe(SITE_PHONE)
    expect(profile.address).toEqual(SITE_ADDRESS_OBJ)
    expect(profile.hours).toBe(SITE_HOURS_LABEL)
    expect(profile.website).toBe(`${SITE_URL.replace(/\/$/, "")}/`)
    expect(profile.socialProfiles.every((url) => url.startsWith("https://"))).toBe(true)
  })

  it("names at most 20 service-area cities, each one the site already serves", () => {
    expect(SERVICE_AREA_CITIES.length).toBeLessThanOrEqual(20)
    expect(new Set(SERVICE_AREA_CITIES).size).toBe(SERVICE_AREA_CITIES.length)
    for (const city of SERVICE_AREA_CITIES) expect(isServedCity(city), city).toBe(true)
  })

  // The runbook is what gets pasted into the directories, so its NAP must be the site's NAP.
  it("is mirrored by the off-site listings runbook", () => {
    const runbook = readFileSync(join(process.cwd(), "docs", "OFF-SITE-LISTINGS.md"), "utf8")
    expect(runbook).toContain(SITE_PHONE)
    expect(runbook).toContain(SITE_ADDRESS_OBJ.streetAddress)
    expect(runbook).toContain(`${SITE_ADDRESS_OBJ.addressLocality}, ${SITE_ADDRESS_OBJ.addressRegion} ${SITE_ADDRESS_OBJ.postalCode}`)
    expect(runbook).toContain(LISTING_DESCRIPTIONS.short)
    expect(runbook).toContain(LISTING_DESCRIPTIONS.standard)
  })
})
