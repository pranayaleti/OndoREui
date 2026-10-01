import { describe, expect, it, vi } from "vitest"
import {
  LISTING_STEERING_RE,
  STEERING_COPY_RE,
  findSteeringPhrases,
  screenListingDescription,
} from "./fair-housing-steering"

describe("LISTING_STEERING_RE", () => {
  it.each([
    "Perfect for young professionals who want a quiet building.",
    "Great for families with kids.",
    "Ideal for students and couples.",
    "Perfect for a young family.",
    "Safe neighborhood close to everything.",
    "No kids, no Section 8.",
    "We do not accept vouchers.",
    "Walking distance to church.",
    "Adults only.",
    "Quiet tenants preferred.",
    "An exclusive community.",
    "Family-friendly layout.",
  ])("flags %s", (text) => {
    expect(findSteeringPhrases(text).length).toBeGreaterThan(0)
  })

  it.each([
    "Single-family home with a fenced yard, three bedrooms and a two-car garage.",
    "Multi-family duplex, ideal for entertaining on the patio.",
    "Quiet street with a fenced backyard.",
    "Pets welcome with a deposit. Hardwood floors and updated kitchen.",
    "Close to the Frontrunner station and Thanksgiving Point.",
    "Housing vouchers and rental assistance are accepted.",
  ])("leaves property copy alone: %s", (text) => {
    expect(findSteeringPhrases(text)).toEqual([])
  })

  it("includes every phrase in the shared city-copy list", () => {
    expect(LISTING_STEERING_RE.test("young professionals")).toBe(true)
    expect(STEERING_COPY_RE.test("family-oriented")).toBe(true)
  })
})

describe("screenListingDescription", () => {
  it("returns the trimmed text when it is clean", () => {
    expect(screenListingDescription("  Updated 3 bed home.  ")).toBe("Updated 3 bed home.")
  })

  it("returns null for empty input", () => {
    expect(screenListingDescription(null)).toBeNull()
    expect(screenListingDescription("   ")).toBeNull()
  })

  it("suppresses, never rewrites, a description that names the desired occupant", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
    expect(screenListingDescription("Bright home. Perfect for young professionals.")).toBeNull()
    expect(warn).toHaveBeenCalledOnce()
    warn.mockRestore()
  })
})
