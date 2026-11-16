import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"

describe("contact page", () => {
  it("is the one page that shows the all-links QR, on larger screens only", () => {
    const source = readFileSync("app/contact/page.tsx", "utf8")
    expect(source).toContain('src="/links-qr.svg"')
    expect(source).toContain('href="/links/"')
    expect(source).toContain("md:flex")
    expect(source).toContain('analyticsAttributes("links_hub_click", "contact", "qr")')
  })
})
