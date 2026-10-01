import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

/**
 * Buttons are whitespace-nowrap, so a CTA row that cannot wrap pushes the page wider than
 * the viewport and clips the loan-officer button. Layout cannot be measured in jsdom, so
 * guard the class contract on the pages that had the bug.
 */
const PAGES = [
  "loans/fha/page.tsx",
  "buy/rates/page.tsx",
  "loans/conventional/page.tsx",
  "buy/adjustable-rate/page.tsx",
  "loans/va/page.tsx",
  "loans/jumbo/page.tsx",
  "buy/first-time/page.tsx",
]

describe("CTA button rows wrap instead of overflowing", () => {
  for (const page of PAGES) {
    it(page, () => {
      const src = readFileSync(join(__dirname, page), "utf8")
      expect(src).not.toContain("flex flex-col sm:flex-row gap-4 justify-center")
      expect(src).toMatch(/flex flex-wrap (justify-center )?gap-3/)
    })
  }

  it("the grants button on /buy/first-time can wrap its long label", () => {
    const src = readFileSync(join(__dirname, "buy/first-time/page.tsx"), "utf8")
    expect(src).toMatch(/whitespace-normal[^>]*>\s*<Link href="\/buy\/first-time\/grants">/)
  })
})

describe("neighborhood CTA", () => {
  it("labels the calculator link for what it opens (a buyer payment estimate)", () => {
    const src = readFileSync(join(__dirname, "neighborhoods/[city]/[neighborhood]/page.tsx"), "utf8")
    expect(src).not.toContain("home cost calculator")
    expect(src).not.toContain("/calculators/home-sale/")
    expect(src).toContain('href="/calculators/mortgage-payment/"')
  })
})
