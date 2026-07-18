// lib/notary-ron-states.test.ts
import { describe, expect, it } from "vitest"
import {
  NOTARY_RON_STATES,
  getRonStateBySlug,
  getServedRonStates,
  isReservedNotarySegment,
} from "./notary-ron-states"

describe("notary-ron-states", () => {
  it("includes 50 states + DC with unique slugs", () => {
    expect(NOTARY_RON_STATES).toHaveLength(51)
    const slugs = NOTARY_RON_STATES.map((s) => s.slug)
    expect(new Set(slugs).size).toBe(51)
    expect(getRonStateBySlug("california")?.code).toBe("CA")
    expect(getRonStateBySlug("district-of-columbia")?.code).toBe("DC")
  })

  it("marks all records as serves in v1", () => {
    expect(getServedRonStates()).toHaveLength(51)
    expect(NOTARY_RON_STATES.every((s) => s.ronServingStatus === "serves")).toBe(true)
  })

  it("reserves static notary segments", () => {
    expect(isReservedNotarySegment("on-demand")).toBe(true)
    expect(isReservedNotarySegment("locations")).toBe(true)
    expect(isReservedNotarySegment("california")).toBe(false)
  })
})
