import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8")

function rule(selectorStart: string): string {
  const start = css.indexOf(selectorStart)
  expect(start, `${selectorStart} rule exists`).toBeGreaterThan(-1)
  return css.slice(start, css.indexOf("}", start))
}

// @tailwindcss/typography is not installed, so the `prose` class in article bodies only works
// because globals.css defines it. Guard the rules that make headings and lists readable.
describe("article prose styles", () => {
  it("sizes body headings larger than the 1.125rem lead text and bolds them", () => {
    const h2 = rule(".prose :where(h2)")
    const size = Number(/font-size:\s*([\d.]+)em/.exec(h2)?.[1])
    expect(size).toBeGreaterThan(1)
    expect(h2).toMatch(/font-weight:\s*7\d\d/)
    expect(rule(".prose-lg")).toMatch(/font-size:\s*1\.125rem/)
  })

  it("restores list bullets and numbers", () => {
    expect(rule(".prose :where(ul)")).toMatch(/list-style-type:\s*disc/)
    expect(rule(".prose :where(ol)")).toMatch(/list-style-type:\s*decimal/)
  })

  it("leaves not-prose islands alone", () => {
    expect(rule(".prose :where(h2)")).toBeTruthy()
    expect(css).toContain(":not(:where(.not-prose, .not-prose *))")
  })
})
