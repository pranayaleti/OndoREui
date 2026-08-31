import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const ROOT = join(__dirname, "../..")

describe("visit token static-export routing", () => {
  it("does not fetch the backend from schedule/confirm server pages during export", () => {
    const schedulePage = readFileSync(join(ROOT, "app/visit/schedule/[token]/page.tsx"), "utf8")
    const confirmPage = readFileSync(join(ROOT, "app/visit/confirm/[token]/page.tsx"), "utf8")
    expect(schedulePage).not.toMatch(/getSchedule/)
    expect(confirmPage).not.toMatch(/getVisitByToken/)
    expect(schedulePage).not.toMatch(/export const dynamicParams = false/)
    expect(confirmPage).not.toMatch(/export const dynamicParams = false/)
    expect(schedulePage).toContain("VisitScheduleClient")
    expect(confirmPage).toContain("VisitConfirmClient")
  })

  it("recovers visit tokens from the static-export 404 shell", () => {
    const source = readFileSync(join(ROOT, "app/not-found.tsx"), "utf8")
    expect(source).toContain("visitClientRouteFromPathname")
    expect(source).toContain("VisitScheduleClient")
    expect(source).toContain("VisitConfirmClient")
  })
})
