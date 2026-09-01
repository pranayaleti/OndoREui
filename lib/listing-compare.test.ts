import { afterEach, describe, expect, it } from "vitest"
import {
  LISTING_COMPARE_MAX,
  clearCompareIds,
  listingComparePath,
  readCompareIds,
  removeCompareId,
  toggleCompareId,
} from "./listing-compare"

afterEach(() => {
  clearCompareIds()
})

describe("listing compare shortlist", () => {
  it("stores at most three public ids in session", () => {
    expect(listingComparePath()).toBe("/properties/compare")
    expect(toggleCompareId("a").status).toBe("added")
    expect(toggleCompareId("b").status).toBe("added")
    expect(toggleCompareId("c").status).toBe("added")
    expect(toggleCompareId("d")).toEqual({
      ids: ["a", "b", "c"],
      status: "full",
    })
    expect(readCompareIds()).toHaveLength(LISTING_COMPARE_MAX)
  })

  it("removes a listing from the shortlist without inventing replacements", () => {
    toggleCompareId("a")
    toggleCompareId("b")
    expect(removeCompareId("a")).toEqual(["b"])
    expect(toggleCompareId("b").status).toBe("removed")
    expect(readCompareIds()).toEqual([])
  })
})
