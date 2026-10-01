import { describe, expect, it } from "vitest"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

const root = join(process.cwd(), "app/faq")
const files = [
  join(root, "page.tsx"),
  ...readdirSync(root)
    .filter((d) => statSync(join(root, d)).isDirectory())
    .map((d) => join(root, d, "page.tsx")),
]

// Fixed-colour text on theme-token backgrounds is invisible in one of the two themes.
describe("FAQ pages use theme tokens for text", () => {
  it("covers every FAQ page", () => {
    expect(files.length).toBeGreaterThanOrEqual(12)
  })

  it.each(files)("%s has no hard-coded white or gray-300 text on token backgrounds", (file) => {
    const offenders = readFileSync(file, "utf8")
      .split("\n")
      .filter((line) => /\btext-white\b|\btext-gray-300\b|\bborder-white\//.test(line))
      // White on the orange accent gradient (icon tile, CTA button) is fixed in both themes.
      .filter((line) => !/bg-gradient|from-accent|from-\[accent/.test(line))
    expect(offenders).toEqual([])
  })
})
