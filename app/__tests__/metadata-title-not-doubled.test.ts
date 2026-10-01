import { describe, it, expect } from "vitest"
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { pageTitleText } from "@/lib/site"
import { HOME_PAGE_TITLE } from "@/lib/home-metadata"
import { metadata as pricingMetadata } from "@/app/pricing/page"
import { metadata as compareMetadata } from "@/app/compare-utah-property-managers/page"

const ROOT = join(__dirname, "..", "..")
const APP = join(ROOT, "app")

function pageFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...pageFiles(full))
    else if (entry === "page.tsx" || entry === "layout.tsx") out.push(full)
  }
  return out
}

/**
 * app/layout.tsx declares `template: "%s | Ondo RE"`. Any page that returns a
 * bare string title containing the brand therefore renders it twice, which
 * pushed the differentiating half of the title past Google's ~60 character
 * cutoff on 161 files. A title carrying a brand must be absolute: either
 * `pageTitle(...)` (which also de-dupes and length-caps) or a literal
 * `{ absolute: ... }`.
 */
const ABSOLUTE_FORM = /title:\s*(?:pageTitle\(|\{\s*absolute:)/

/**
 * The page title line(s) of each metadata declaration (`export const metadata`
 * or a `generateMetadata` function): within that declaration, the `title:` lines
 * at the shallowest indentation. That skips `openGraph.title`, a title passed to a
 * helper that is overridden below it, and any `title:` elsewhere in the file (a
 * card, a JSON-LD name), and checks both exports when a file has both.
 */
function metadataTitleLines(source: string): string[] {
  const anchors = [...source.matchAll(/export const metadata\b|function generateMetadata\b|const generateMetadata\b/g)]
  const lines: string[] = []
  for (const anchor of anchors) {
    const rest = source.slice(anchor.index)
    const end = rest.search(/\n[}\]]/)
    const region = end === -1 ? rest : rest.slice(0, end)
    const titles = [...region.matchAll(/^(\s*)title:\s*.+$/gm)].map((m) => ({ indent: m[1]!.length, line: m[0].trim() }))
    if (titles.length === 0) continue
    const shallowest = Math.min(...titles.map((t) => t.indent))
    lines.push(...titles.filter((t) => t.indent === shallowest).map((t) => t.line))
  }
  return lines
}

describe("metadata titles are never doubled by the layout title template", () => {
  const files = pageFiles(APP).filter((f) => relative(ROOT, f) !== "app/layout.tsx")

  it("covers the whole app tree, so new routes cannot regress silently", () => {
    expect(files.length).toBeGreaterThan(100)
  })

  it.each(files.map((f) => relative(ROOT, f)))(
    "%s keeps any brand-suffixed metadata title absolute",
    (relPath) => {
      const source = readFileSync(join(ROOT, relPath), "utf8")
      for (const metaTitle of metadataTitleLines(source)) {
        const carriesBrand = /Ondo|SITE_NAME|SITE_BRAND_SHORT|HOME_PAGE_TITLE|pageTitle/.test(metaTitle)
        if (!carriesBrand) continue
        expect(metaTitle, `${relPath}: wrap this in pageTitle() so the brand is added once`).toMatch(
          ABSOLUTE_FORM,
        )
      }
    },
  )

  it("never emits the brand twice, whatever a caller passes in", () => {
    const doubled = [
      "VA Home Loans in Utah | Ondo Real Estate | Ondo RE",
      "Property Management Fees in Utah | Ondo RE | Ondo RE",
      "Contact Us | Ondo Real Estate",
    ]
    for (const input of doubled) {
      const rendered = pageTitleText(input)
      expect((rendered.match(/Ondo RE|Ondo Real Estate/g) ?? []).length).toBeLessThanOrEqual(1)
    }
  })

  it("leaves the homepage title untouched, since its brand is a prefix", () => {
    const source = readFileSync(join(ROOT, "app/page.tsx"), "utf8")
    expect(source).toMatch(/title:\s*(?:pageTitle\(HOME_PAGE_TITLE\)|\{\s*absolute:\s*HOME_PAGE_TITLE)/)
    expect(pageTitleText(HOME_PAGE_TITLE)).toBe(HOME_PAGE_TITLE)
  })

  it("pricing and compare document titles let the layout template add Ondo RE once", () => {
    for (const metadata of [pricingMetadata, compareMetadata]) {
      expect(typeof metadata.title).toBe("string")
      expect(metadata.title as string).not.toMatch(/Ondo/)
    }
  })
})
