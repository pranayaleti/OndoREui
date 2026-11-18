import { beforeEach, describe, expect, it } from "vitest"
import { normalizeReferralCode, readReferralCode, referralCodeForThisVisit, rememberReferralCode } from "./referral-code"

const DAY = 24 * 60 * 60 * 1000

describe("referral code memory", () => {
  beforeEach(() => window.localStorage.clear())

  it("normalises codes the way the server does", () => {
    expect(normalizeReferralCode(" k7qh 3wmp ")).toBe("K7QH3WMP")
    expect(normalizeReferralCode("ab")).toBeNull()
    expect(normalizeReferralCode("bad!code")).toBeNull()
    expect(normalizeReferralCode(null)).toBeNull()
  })

  it("remembers a code for 90 days", () => {
    rememberReferralCode("k7qh3wmp", 0)
    expect(readReferralCode(89 * DAY)).toBe("K7QH3WMP")
    expect(readReferralCode(91 * DAY)).toBeNull()
  })

  it("prefers the code in the URL and remembers it", () => {
    rememberReferralCode("OLDCODE2", 0)
    expect(referralCodeForThisVisit("?ref=newcode9", DAY)).toBe("NEWCODE9")
    expect(readReferralCode(2 * DAY)).toBe("NEWCODE9")
    expect(referralCodeForThisVisit("", 2 * DAY)).toBe("NEWCODE9")
  })

  it("ignores junk in storage", () => {
    window.localStorage.setItem("ondo_referral_code", "{not json")
    expect(readReferralCode()).toBeNull()
  })
})
