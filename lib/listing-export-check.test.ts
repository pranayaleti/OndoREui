// @vitest-environment node
import { describe, it, expect } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import {
  countListingPages,
  countSitemapListingUrls,
  findListingExportProblems,
} from "../scripts/check-listing-export.mjs"

function exportWith(dirs: string[], sitemapPaths: string[]) {
  const out = mkdtempSync(join(tmpdir(), "listing-export-"))
  for (const d of dirs) {
    mkdirSync(join(out, d), { recursive: true })
    writeFileSync(join(out, d, "index.html"), "<html></html>")
  }
  const locs = sitemapPaths.map((p) => `<url><loc>https://www.ondorealestate.com${p}</loc></url>`).join("")
  writeFileSync(join(out, "sitemap-0.xml"), `<urlset>${locs}</urlset>`)
  return out
}

describe("listing export guard", () => {
  it("ignores the placeholder stub and /compare", () => {
    const out = exportWith(["_placeholder", "properties", "blog"], ["/properties/", "/blog/", "/_placeholder/"])
    expect(countListingPages(out)).toBe(0)
    expect(countSitemapListingUrls(out)).toBe(0)
  })

  it("counts real listing directories and sitemap URLs", () => {
    const out = exportWith(
      ["4323-west-11475-south", "9-oak-ln", "properties"],
      ["/properties/", "/4323-west-11475-south/", "/9-oak-ln/"],
    )
    expect(countListingPages(out)).toBe(2)
    expect(countSitemapListingUrls(out)).toBe(2)
    expect(findListingExportProblems(out, 2)).toEqual([])
  })

  it("reports a degraded export", () => {
    const out = exportWith(["_placeholder"], [])
    expect(findListingExportProblems(out, 1)).toHaveLength(2)
  })

  it("is off when the minimum is 0", () => {
    const out = exportWith(["_placeholder"], [])
    expect(findListingExportProblems(out, 0)).toEqual([])
  })

  it("treats a missing out dir as zero listings", () => {
    expect(countListingPages(join(tmpdir(), "listing-export-does-not-exist"))).toBe(0)
  })
})
