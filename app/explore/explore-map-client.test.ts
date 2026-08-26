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
