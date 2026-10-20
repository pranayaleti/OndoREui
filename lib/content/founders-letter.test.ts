import { describe, it, expect } from "vitest"
import { findLicenseClaims } from "@/lib/license-claims"
import {
  FIRST_YEAR_IN_SOFTWARE,
  FOUNDERS_LETTER_DESCRIPTION,
  founderLetterText,
  founderLetterWordCount,
  readingMinutes,
  yearsInSoftware,
} from "./founders-letter"

describe("founder's letter copy", () => {
  it("is a long read, measured from the copy itself", () => {
    const words = founderLetterWordCount()
    expect(words).toBeGreaterThan(1600)
    expect(words).toBeLessThan(2300)
    expect(readingMinutes()).toBe(Math.max(1, Math.round(words / 220)))
  })

  it("computes the software years from the one constant", () => {
    expect(FIRST_YEAR_IN_SOFTWARE).toBe(2013)
    expect(yearsInSoftware()).toBe(new Date().getFullYear() - 2013)
  })

  it("keeps every reader-facing string inside the voice and compliance rules", () => {
    const text = founderLetterText()
    expect(text).not.toContain("—")
    expect(text).not.toMatch(/\b(?:straightforward|genuinely|honestly|delve|dive into|in conclusion)\b/i)
    expect(text).not.toMatch(/\bit'?s worth noting\b/i)
    expect(text).not.toMatch(/landlord/i)
    expect(text).not.toMatch(/\b(?:24\/7|NMLS)\b/i)
    expect(text).not.toMatch(/founded in 20\d\d|years in business/i)
    expect(findLicenseClaims(text, "text")).toEqual([])
  })

  it("never refers to Pranay in the third person", () => {
    expect(founderLetterText()).not.toMatch(/\b(?:he|him|his)\b/i)
    expect(FOUNDERS_LETTER_DESCRIPTION).not.toMatch(/\b(?:he|him|his)\b/i)
    expect(FOUNDERS_LETTER_DESCRIPTION.length).toBeLessThanOrEqual(160)
  })
})
