import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const SOURCE = readFileSync(join(__dirname, "explore-map-client.tsx"), "utf8")

describe("ExploreMapClient listing navigation", () => {
  it("opens public rental pages instead of the /buy funnel", () => {
    expect(SOURCE).toContain("listingDetailPath")
    expect(SOURCE).not.toContain("`/buy/${id}`")
  })
})

describe("ExploreMapClient source", () => {
  it("refetches listings on the client and does not read the old summary fields", () => {
    expect(SOURCE).toContain("fetchPublicPropertyListOrThrow")
    expect(SOURCE).not.toContain("p.propertyType")
    expect(SOURCE).not.toContain("p.location")
  })
})
