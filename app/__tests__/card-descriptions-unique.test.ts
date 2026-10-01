import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { join, relative } from "node:path"

const ROOT = join(__dirname, "..", "..")

/** Removes `export const metadata ... = { ... }` so meta/OG/Twitter copy may repeat. */
function withoutMetadataBlock(source: string): string {
  const start = source.search(/export const metadata\b/)
  if (start === -1) return source
  const open = source.indexOf("{", source.indexOf("=", start))
  if (open === -1) return source
  let depth = 0
  for (let i = open; i < source.length; i++) {
    if (source[i] === "{") depth++
    else if (source[i] === "}" && --depth === 0) return source.slice(0, start) + source.slice(i + 1)
  }
  return source
}

/**
 * Commit abb914a8d pasted one meta description into every card of a card
 * array on /sell, /loans, /investments, /loans/va and /loans/usda. Card
 * descriptions inside one page must each say something different.
 */
describe("card descriptions on a page are not copy-pasted", () => {
  // Pages hit by abb914a8d and restored. app/property-management,
  // .../maintenance-coordination and .../tenant-screening carry the same defect
  // and should be added here once their cards are restored.
  const files = [
    "app/sell/page.tsx",
    "app/loans/page.tsx",
    "app/loans/va/page.tsx",
    "app/loans/usda/page.tsx",
    "app/investments/page.tsx",
    "app/data/page.tsx",
  ].map((f) => join(ROOT, f))

  it.each(files.map((f) => relative(ROOT, f)))("%s has no repeated card description", (relPath) => {
    const body = withoutMetadataBlock(readFileSync(join(ROOT, relPath), "utf8"))
    const seen = new Map<string, number>()
    for (const m of body.matchAll(/\bdescription:\s*"((?:[^"\\]|\\.){40,})"/g)) {
      seen.set(m[1], (seen.get(m[1]) ?? 0) + 1)
    }
    const repeated = [...seen].filter(([, n]) => n > 1).map(([text]) => text)
    expect(repeated, `${relPath}: repeated card descriptions`).toEqual([])
  })

  it("keeps the USDA guarantee fee card bound to USDA_SNAPSHOT", () => {
    const body = readFileSync(join(ROOT, "app/loans/usda/page.tsx"), "utf8")
    expect(body).toMatch(/title: "Guarantee fee \(snapshot\)", description: `\$\{USDA_SNAPSHOT\.upfrontGuaranteeFee\}/)
  })
})
