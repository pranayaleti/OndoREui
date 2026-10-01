import { describe, it, expect } from "vitest"
import { readdirSync, readFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const root = join(__dirname, "..")
const read = (rel: string) => readFileSync(join(root, rel), "utf8")

const blogDir = join(root, "app", "blog")
const blogFiles = readdirSync(blogDir)
  .filter((name) => !name.startsWith("[") && existsSync(join(blogDir, name, "page.tsx")))
  .map((name) => `app/blog/${name}/page.tsx`)
  .concat("app/blog/page-client.tsx")

/** Placeholder staff names that were used as blog bylines. They are not real people. */
const PLACEHOLDER_AUTHORS = [
  "Sarah Johnson",
  "Michael Chen",
  "Jennifer Martinez",
  "David Thompson",
  "Lisa Park",
  "Robert Wilson",
]

describe("blog content makes no unverifiable claims", () => {
  it("credits no placeholder people as authors", () => {
    for (const file of blogFiles) {
      const src = read(file)
      for (const name of PLACEHOLDER_AUTHORS) {
        expect(src, `${file} credits ${name}`).not.toContain(`"${name}"`)
      }
    }
  })

  it("makes no portfolio-size or superlative accuracy claims", () => {
    for (const file of blogFiles) {
      const src = read(file)
      expect(src, file).not.toMatch(/we manage (over )?\d+/i)
      expect(src, file).not.toMatch(/most accurate/i)
    }
  })

  it("does not publish typical-owner results or tenant sentiment monitoring", () => {
    const src = read("app/blog/how-ondo-re-uses-technology-property-management/page.tsx")
    expect(src).not.toMatch(/typical Ondo RE property owner/i)
    expect(src).not.toMatch(/average of 48/i)
    expect(src).not.toMatch(/communication sentiment/i)
    expect(src).not.toMatch(/at-risk tenant/i)
  })

  it("makes no quantified vacancy-reduction promise", () => {
    const src = read("app/blog/best-neighborhoods-invest-utah-real-estate/page.tsx")
    expect(src).not.toMatch(/reduces effective vacancy by/i)
  })
})

describe("notary page", () => {
  it("has no hard-coded client testimonials or star ratings", () => {
    const src = read("app/notary/notary-client.tsx")
    expect(src).not.toMatch(/What Clients Say/i)
    expect(src).not.toMatch(/Sarah M\.|Jason T\.|Michelle R\.|Daniel K\./)
    expect(src).not.toMatch(/\bStar\b/)
  })
})
