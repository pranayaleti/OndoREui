import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const read = (rel: string) => readFileSync(join(process.cwd(), rel), "utf8")

describe("light theme: no fixed white text on theme-token surfaces", () => {
  it("about page uses the shared banner rather than a theme-token veil over white text", () => {
    const src = read("app/about/page.tsx")
    expect(src).toContain("<PageBanner")
    expect(src).not.toContain('absolute inset-0 bg-background/40')
  })
})
