import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const ROOT = join(__dirname, "../..")

describe("public listing detail static-export routing", () => {
  it("does not hard-404 unknown publicIds in next dev via dynamicParams = false", () => {
    const source = readFileSync(join(ROOT, "app/properties/[publicId]/page.tsx"), "utf8")
    expect(source).not.toMatch(/export const dynamicParams = false/)
    expect(source).toContain("PropertyListingDetailClient")
  })

  it("recovers /properties/{publicId} from the static-export 404 shell", () => {
    const source = readFileSync(join(ROOT, "app/not-found.tsx"), "utf8")
    expect(source).toContain("publicIdFromPathname")
    expect(source).toContain("PropertyListingDetailClient")
  })
})
