// @vitest-environment node
import { describe, it, expect } from "vitest"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(__dirname, "..")
const sw = readFileSync(join(ROOT, "public", "sw.js"), "utf8")

function listConst(name: string): string[] {
  const body = new RegExp(`const ${name} = \\[([^\\]]*)\\]`).exec(sw)?.[1] ?? ""
  return [...body.matchAll(/"([^"]+)"/g)].map((match) => match[1]!)
}

const cached = [...listConst("APP_SHELL"), ...listConst("WARM_ROUTES")]

describe("service worker precache list", () => {
  it("has entries to check", () => {
    expect(cached.length).toBeGreaterThan(5)
  })

  // GitHub Pages redirects "/buy" to "/buy/". A cached redirect cannot answer a navigation,
  // so a page URL without its slash breaks that page offline.
  it.each(cached)("%s is a file or a canonical trailing-slash page", (url) => {
    expect(url.endsWith("/") || /\.[a-z0-9]+$/i.test(url)).toBe(true)
  })

  it.each(cached)("%s exists in the site", (url) => {
    const route = url.replace(/^\/+|\/+$/g, "")
    const exists = url.endsWith("/")
      ? existsSync(join(ROOT, "app", route, "page.tsx")) || route === ""
      : existsSync(join(ROOT, "public", route))
    expect(exists, `${url} is not a page or a public file`).toBe(true)
  })
})
