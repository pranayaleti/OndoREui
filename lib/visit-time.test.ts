import { describe, it, expect } from "vitest"
import { buildGoogleCalendarUrl, formatVisitWhen } from "./visit-time"

const SLOT = "2026-10-02T16:00:00.000Z" // 10:00 AM MDT

describe("formatVisitWhen", () => {
  it("labels the zone and shows property time for a Pacific viewer", () => {
    const out = formatVisitWhen(SLOT, "America/Los_Angeles")
    expect(out).toContain("9:00 AM PDT")
    expect(out).toContain("10:00 AM MDT at the property")
  })

  it("shows the zone once for a viewer on Utah time", () => {
    const out = formatVisitWhen(SLOT, "America/Denver")
    expect(out).toContain("10:00 AM MDT")
    expect(out).not.toContain("at the property")
  })

  it("returns an empty string for an invalid date", () => {
    expect(formatVisitWhen("nope")).toBe("")
  })
})

describe("buildGoogleCalendarUrl", () => {
  it("gives the event a 30 minute duration and a location", () => {
    const url = new URL(buildGoogleCalendarUrl({ startIso: SLOT, title: "Maple House", address: "1 Main St, Lehi" }))
    expect(url.searchParams.get("dates")).toBe("20261002T160000Z/20261002T163000Z")
    expect(url.searchParams.get("location")).toBe("1 Main St, Lehi")
    expect(url.searchParams.get("text")).toBe("Property viewing: Maple House")
    expect(url.searchParams.get("details")).toContain("Ondo Real Estate")
  })

  it("omits the location when there is no address", () => {
    const url = new URL(buildGoogleCalendarUrl({ startIso: SLOT }))
    expect(url.searchParams.has("location")).toBe(false)
  })
})
