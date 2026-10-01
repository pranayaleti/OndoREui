import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(__dirname, "..", "..")
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8")

/**
 * Titles and descriptions must not promise content the page lacks (abb914a8d
 * rewrote them for search intent without checking the pages).
 */
describe("metadata promises match the page", () => {
  it("/buy/rates does not promise a rate comparison; the page is not a rate table", () => {
    const src = read("app/buy/rates/page.tsx")
    const meta = src.slice(src.indexOf("export const metadata"), src.indexOf("export default"))
    expect(meta).not.toMatch(/Rates Today|Compare Loan Programs|Compare Utah mortgage rates/)
    expect(meta).toMatch(/not a live rate table/)
    expect(src).toMatch(/This page is not a live rate table/)
  })

  it("/refinance/process promises no checklist, appraisal or day count it does not have", () => {
    const src = read("app/refinance/process/page.tsx")
    expect(src).not.toMatch(/document checklist|21 to 30|30-45|Timeline & Documents|quick pre-approval/i)
  })

  it("/loans/conventional does not promise a limits table or the 78% LTV rule", () => {
    const src = read("app/loans/conventional/page.tsx")
    expect(src).not.toMatch(/78%|loan limits, credit tiers/)
  })

  it("/investments title matches its commercial and fractional H1, not rentals", () => {
    const src = read("app/investments/page.tsx")
    const meta = src.slice(src.indexOf("export const metadata"), src.indexOf("const sections"))
    expect(meta).not.toMatch(/Rentals & Multifamily|cash flows|in-house/)
    expect(meta).toMatch(/Commercial & Fractional/)
  })
})

describe("copy defects on buy and lending pages", () => {
  it("/qualify no longer shows an internal SEO label to visitors", () => {
    expect(read("app/qualify/page.tsx")).not.toContain("Crawlable detail")
  })

  it("/buy/second-home points to lead pages, not rental listings, and links its own reference", () => {
    const src = read("app/buy/second-home/page.tsx")
    expect(src).not.toContain('href="/properties"')
    expect(src).not.toMatch(/while prices are favorable|vacation home or investment property/)
    expect(src).toMatch(/href="\/blog\/second-home-vs-investment-occupancy"/)
  })

  it("rate-term does not say a lower rate always lowers total interest, matching /refinance", () => {
    expect(read("app/refinance/rate-term/page.tsx")).not.toMatch(/reduces both your monthly payment and total interest/)
  })

  it("lending pages make no speed promise", () => {
    expect(read("app/loans/page.tsx")).not.toMatch(/Fast Processing|quick pre-approvals/)
  })
})
