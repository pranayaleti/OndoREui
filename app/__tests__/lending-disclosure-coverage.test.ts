import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { describe, expect, it } from "vitest"

/**
 * Lending disclosures are a template property (app/loans/second-look/page.test.tsx).
 * Every page under app/loans, app/refinance and the /buy mortgage guides invites rate
 * or pre-approval requests, so each must render <LendingDisclaimer /> or
 * ARRIVAL_LENDING_DISCLOSURE, or delegate to a city template that renders it.
 */

const ROOT = process.cwd()
const SCOPES = ["app/loans", "app/refinance"].map((p) => join(ROOT, p))
const BUY_MORTGAGE_GUIDES = ["15-year", "30-year", "fixed-rate", "adjustable-rate", "rates"].map((s) =>
  join(ROOT, "app/buy", s, "page.tsx"),
)

function pageFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) return pageFiles(full)
    return name === "page.tsx" ? [full] : []
  })
}

const DISCLOSURE_MARKERS = [
  /<LendingDisclaimer\b/,
  /ARRIVAL_LENDING_DISCLOSURE/,
  // City templates render the disclosure themselves for loans (covered by component tests).
  /<CityServicePage\b[^>]*service="loans"/,
  /<CitySubServicePage\b/,
]

describe("lending disclosure coverage", () => {
  const pages = [...SCOPES.flatMap(pageFiles), ...BUY_MORTGAGE_GUIDES]

  it("finds the pages it is meant to guard", () => {
    expect(pages.length).toBeGreaterThan(15)
  })

  it.each(pages.map((f) => [relative(ROOT, f), f]))("%s renders a lending disclosure", (_rel, file) => {
    const src = readFileSync(file, "utf8")
    expect(DISCLOSURE_MARKERS.some((re) => re.test(src))).toBe(true)
  })
})
