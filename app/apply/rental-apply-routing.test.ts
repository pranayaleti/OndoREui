import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const ROOT = join(__dirname, "../..")

describe("rental apply static-export routing", () => {
  it("does not hard-404 unknown apply ids via dynamicParams = false", () => {
    for (const rel of [
      "app/apply/start/[propertyId]/page.tsx",
      "app/apply/[token]/page.tsx",
      "app/apply/co/[token]/page.tsx",
      "app/applications/[applicationId]/page.tsx",
    ]) {
      const source = readFileSync(join(ROOT, rel), "utf8")
      expect(source).not.toMatch(/export const dynamicParams = false/)
    }
  })

  it("recovers apply and application paths from the static-export 404 shell", () => {
    const source = readFileSync(join(ROOT, "app/not-found.tsx"), "utf8")
    expect(source).toContain("rentalClientRouteFromPathname")
    expect(source).toContain("RentalStartClient")
    expect(source).toContain("ApplyTokenClient")
    expect(source).toContain("CoApplicantClient")
    expect(source).toContain("ResumeApplicationClient")
  })
})
