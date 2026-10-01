import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const root = join(__dirname, "..")
const read = (rel: string) => readFileSync(join(root, rel), "utf8")

/**
 * Bundle-size guards. These files sit on the base bundle or carry large static content, so a
 * stray import or "use client" quietly ships tens of KB of JS to every visitor.
 */
describe("bundle boundaries", () => {
  it("lib/seo.ts and lib/page-canonical.ts do not import the site index (glossary + link data)", () => {
    for (const file of ["lib/seo.ts", "lib/page-canonical.ts"]) {
      expect(read(file), file).not.toMatch(/site-index/)
    }
  })

  it("the 404 and error screens do not load the SEO/JSON-LD chain", () => {
    for (const file of ["app/not-found.tsx", "app/error.tsx"]) {
      expect(read(file), file).not.toMatch(/components\/seo["']/)
    }
  })

  it.each([
    "components/city-service-page.tsx",
    "components/city-guide-page.tsx",
    "components/city-pricing-guide.tsx",
    "components/city-testimonials.tsx",
    "components/city-team-section.tsx",
    "components/city-owner-ops-section.tsx",
    "components/neighborhood-housing-cards.tsx",
  ])("%s stays a server component", (file) => {
    const source = read(file)
    expect(source).not.toMatch(/^\s*["']use client["']/m)
    expect(source).not.toMatch(/from ["']next\/script["']/)
    expect(source).not.toMatch(/\buse(State|Effect|Memo|Callback|Ref)\(/)
  })
})
