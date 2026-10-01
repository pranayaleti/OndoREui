import { describe, expect, it } from "vitest"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

const root = join(process.cwd(), "app/faq")
const files = readdirSync(root)
  .filter((d) => statSync(join(root, d)).isDirectory())
  .map((d) => join(root, d, "page.tsx"))

// text-[accent-2] and from-[accent-1] compile to invalid CSS, so the CTA loses its colour.
// The token utilities are text-accent-2, from-accent-1, border-accent-1 and so on.
describe("FAQ pages use valid accent token utilities", () => {
  it.each(files)("%s has no bracketed accent-N arbitrary values", (file) => {
    expect(readFileSync(file, "utf8")).not.toMatch(/\[accent-\d\]/)
  })
})
