import { describe, it, expect } from "vitest"
import {
  DEFAULT_STICKY_CTA,
  RENTAL_ANALYSIS_CTA,
  isStickyBarVisible,
  stickyCtaForPath,
} from "./sticky-cta"

describe("stickyCtaForPath", () => {
  it("matches by path prefix on segment boundaries, with or without a trailing slash", () => {
    expect(stickyCtaForPath("/buy").href).toBe("/buy/quiz")
    expect(stickyCtaForPath("/buy/").href).toBe("/buy/quiz")
    expect(stickyCtaForPath("/buy/rates/").event).toBe("mobile_cta_buyer_quiz")
    // "/buy-sell" shares the "/buy" characters but is a different section.
    expect(stickyCtaForPath("/buy-sell/")).toBe(DEFAULT_STICKY_CTA)
  })

  it("gives landlord and homepage visitors the rental analysis and everyone else a fitting offer", () => {
    expect(stickyCtaForPath("/")).toBe(RENTAL_ANALYSIS_CTA)
    expect(stickyCtaForPath("/property-management/")).toBe(RENTAL_ANALYSIS_CTA)
    expect(stickyCtaForPath("/vs/buildium/")).toBe(RENTAL_ANALYSIS_CTA)
    expect(stickyCtaForPath("/blog/anything/")).toBe(DEFAULT_STICKY_CTA)
    expect(stickyCtaForPath(null)).toBe(DEFAULT_STICKY_CTA)
    expect(DEFAULT_STICKY_CTA).not.toBe(RENTAL_ANALYSIS_CTA)
  })
})

describe("isStickyBarVisible", () => {
  it("is false on standalone, portal and form routes", () => {
    for (const p of ["/links/", "/go/qr-1/", "/login", "/owner/finances/", "/buy/quiz/", "/qualify/", "/notary/"]) {
      expect(isStickyBarVisible(p)).toBe(false)
    }
  })

  it("is true on marketing routes", () => {
    for (const p of ["/", "/buy/", "/pricing/", "/blog/x/"]) expect(isStickyBarVisible(p)).toBe(true)
  })
})
