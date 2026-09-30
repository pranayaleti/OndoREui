import { describe, it, expect } from "vitest"
import { QR_PLACEMENTS, qrRedirectTarget, qrShortUrl } from "@/lib/qr-placements"

describe("QR placements", () => {
  it("sends a business-card scan to /links tagged as a business-card QR scan", () => {
    expect(qrRedirectTarget("card")).toBe("/links/?utm_source=business_card&utm_medium=qr&utm_campaign=links")
  })

  it("tags the email signature link as email, not as a QR scan", () => {
    expect(qrRedirectTarget("email")).toBe("/links/?utm_source=email_signature&utm_medium=email&utm_campaign=links")
  })

  // Printed codes outlive any build: they must carry the production host, never localhost.
  it("prints short production URLs on the canonical host, so codes stay sparse and skip redirects", () => {
    expect(qrShortUrl("card")).toBe("https://www.ondorealestate.com/go/card/")
  })

  it("keeps placement ids unique and URL-safe", () => {
    const ids = QR_PLACEMENTS.map((placement) => placement.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z]+$/)
  })

  it("refuses an unknown placement instead of redirecting somewhere untracked", () => {
    expect(() => qrRedirectTarget("billboard")).toThrow(/unknown qr placement/i)
  })
})
