import { describe, it, expect } from "vitest"
import { formatWhen, eventJsonLd } from "./events-client"
import { metadata } from "./page"

describe("/events", () => {
  it("is noindex while no events are published", () => {
    expect(metadata.robots).toMatchObject({ index: false })
  })

  it("shows event times in Mountain time, not the visitor's zone", () => {
    // 2026-10-15 18:00 UTC is 12:00 PM MDT.
    const out = formatWhen("2026-10-15T18:00:00Z", "2026-10-15T20:00:00Z")
    expect(out).toContain("12:00 PM")
    expect(out).toContain("2:00 PM")
    expect(out.endsWith(" MT")).toBe(true)
  })

  it("adds an address to the Event location", () => {
    const ld = eventJsonLd([
      {
        id: "1",
        slug: "s",
        title: "Workshop",
        description: null,
        startsAt: "2026-10-15T18:00:00Z",
        endsAt: null,
        location: "123 Main St, Salt Lake City, UT",
        rsvpUrl: null,
        coverImage: null,
      },
    ])
    const item = ld.itemListElement[0].item as { location: { name: string; address: string } }
    expect(item.location.address).toBe("123 Main St, Salt Lake City, UT")
  })
})
