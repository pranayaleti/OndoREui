import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(__dirname, "..", "..")

const FILES_WITH_BRAND_SUFFIX_TITLE = [
  "app/loans/[city]/[loantype]/page.tsx",
  "app/neighborhoods/[city]/[neighborhood]/page.tsx",
  "app/property-management/[city]/[subservice]/page.tsx",
  "app/property-management/zip/[zip]/page.tsx",
  "app/property-management/[city]/page.tsx",
  "app/locations/[city]/page.tsx",
  "app/buy-sell/[city]/[subservice]/page.tsx",
  "app/compare/[slug]/page.tsx",
  "app/market-reports/[city]/page.tsx",
  "app/schools/[district]/page.tsx",
  "app/pricing/[city]/page.tsx",
  "app/buy-sell/[city]/page.tsx",
  "app/buy-sell/zip/[zip]/page.tsx",
  "app/loans/[city]/page.tsx",
  "app/loans/zip/[zip]/page.tsx",
  "app/properties/[publicId]/page.tsx",
  "app/notary/[state]/page.tsx",
  "app/notary/[state]/[city]/page.tsx",
]

describe("generateMetadata title is not doubled by the layout title template", () => {
  it.each(FILES_WITH_BRAND_SUFFIX_TITLE)("%s wraps its brand-suffixed title in title:{ absolute }", (relPath) => {
    const source = readFileSync(join(ROOT, relPath), "utf8")
    // The file must construct a title string containing the brand
    // (SITE_BRAND_SHORT, SITE_NAME, or a literal brand-like suffix)...
    const buildsSuffixedTitle = /\$\{SITE_BRAND_SHORT\}|\$\{SITE_NAME\}|ONDO Notary/.test(source)
    expect(buildsSuffixedTitle).toBe(true)
    // ...and wherever that string is returned as the metadata `title` field,
    // it must be wrapped in `{ absolute: ... }`, not returned as a bare string.
    expect(source).toMatch(/title:\s*\{\s*absolute:/)
  })
})
