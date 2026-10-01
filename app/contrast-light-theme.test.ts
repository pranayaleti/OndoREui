import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const read = (rel: string) => readFileSync(join(process.cwd(), rel), "utf8")

describe("light theme: no fixed white text on theme-token surfaces", () => {
  it("demo page fallback card and preview header use foreground tokens", () => {
    const src = read("app/demo/demo-page-client.tsx")
    expect(src).not.toMatch(/from-background via-card to-muted[^"]*text-white/)
    expect(src).not.toMatch(/border-border bg-background px-4 py-3 text-white/)
    expect(src).not.toMatch(/text-white\/(65|75)/)
  })

  it("about hero keeps white text over a fixed dark scrim, not a theme-token veil", () => {
    const src = read("app/about/page.tsx")
    expect(src).toContain('absolute inset-0 bg-black/55')
    expect(src).not.toContain('absolute inset-0 bg-background/40')
  })
})
