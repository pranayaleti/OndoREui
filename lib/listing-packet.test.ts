import { describe, expect, it } from "vitest"
import { buildListingPacketMessage, isListingPacketTiming } from "./listing-packet"

describe("buildListingPacketMessage", () => {
  it("tags the lead as a listing packet with address and timing", () => {
    const message = buildListingPacketMessage({
      address: "123 State St, Lehi, UT",
      timing: "1_to_3",
      notes: "Needs new carpet",
      photosNote: "iPhone exteriors",
    })
    expect(message).toMatch(/^Listing packet request/)
    expect(message).toContain("123 State St, Lehi, UT")
    expect(message).toContain("1–3 months")
    expect(message).toContain("Needs new carpet")
    expect(message).toContain("description only, no upload")
  })

  it("notes when photos were not described instead of promising an upload", () => {
    const message = buildListingPacketMessage({
      address: "1 Main St",
      timing: "exploring",
    })
    expect(message).toMatch(/none described/)
    expect(message).not.toMatch(/uploaded/)
  })

  it("rejects unknown timing values", () => {
    expect(isListingPacketTiming("ready_now")).toBe(true)
    expect(isListingPacketTiming("asap")).toBe(false)
  })
})
