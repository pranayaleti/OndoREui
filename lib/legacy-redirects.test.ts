// @vitest-environment node
import { describe, it, expect } from "vitest"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import {
  metaRefreshTarget,
  parseRedirects,
  redirectHtml,
  resolveFinalTarget,
} from "../scripts/generate-legacy-redirects.mjs"

const ROOT = join(__dirname, "..")
const rules = parseRedirects(readFileSync(join(ROOT, "public", "_redirects"), "utf8"))
const appRoute = (path: string) => existsSync(join(ROOT, "app", path.replace(/^\/+|\/+$/g, ""), "page.tsx"))

describe("parseRedirects", () => {
  it("reads site paths and absolute portal URLs, and skips comments", () => {
    expect(
      parseRedirects(["# note", "/privacy  /privacy-policy/  301", "/signup https://app.example.com/register 301", "bad line"].join("\n")),
    ).toEqual([
      { from: "/privacy", to: "/privacy-policy/" },
      { from: "/signup", to: "https://app.example.com/register" },
    ])
  })
})

describe("metaRefreshTarget", () => {
  it("reads the redirect Next.js emits for redirect() pages", () => {
    const html = '<meta id="__next-page-redirect" http-equiv="refresh" content="1;url=https://app.example.com/login"/>'
    expect(metaRefreshTarget(html)).toBe("https://app.example.com/login")
  })

  it("returns null for a normal page", () => {
    expect(metaRefreshTarget('<meta name="description" content="Buy a home"/>')).toBeNull()
  })
})

describe("resolveFinalTarget", () => {
  const pages: Record<string, string> = {
    "/login/": '<meta http-equiv="refresh" content="1;url=https://app.example.com/login"/>',
    "/privacy-policy/": "<title>Privacy</title>",
  }
  const readPage = (path: string) => pages[path] ?? null

  it("follows a page that already redirects, so the alias is one hop", () => {
    expect(resolveFinalTarget("/login/", { readPage })).toBe("https://app.example.com/login")
  })

  it("keeps normal pages and adds the canonical slash", () => {
    expect(resolveFinalTarget("/privacy-policy", { readPage })).toBe("/privacy-policy/")
  })

  it("resolves legacy calculator paths and leaves absolute URLs alone", () => {
    expect(resolveFinalTarget("/calculators/affordability-calculator", { readPage })).toBe("/calculators/affordability/")
    expect(resolveFinalTarget("https://app.example.com/register", { readPage })).toBe("https://app.example.com/register")
  })
})

describe("redirectHtml", () => {
  it("canonicalizes site targets to the site URL and external targets to themselves", () => {
    expect(redirectHtml("/about/", "https://www.ondorealestate.com")).toContain(
      '<link rel="canonical" href="https://www.ondorealestate.com/about/">',
    )
    expect(redirectHtml("https://app.example.com/register", "https://www.ondorealestate.com")).toContain(
      '<link rel="canonical" href="https://app.example.com/register">',
    )
  })
})

describe("public/_redirects", () => {
  // A stub is skipped when a real page exists at its path, so such a rule would silently do nothing.
  it.each(rules.map((rule) => [rule.from]))("%s is not already a page", (from) => {
    expect(appRoute(from), `app${from}/page.tsx exists, so this redirect never takes effect`).toBe(false)
  })

  // Calculator aliases resolve through the calculator catalog, so check the rest against real routes.
  it.each(rules.filter((rule) => rule.to.startsWith("/") && !rule.to.startsWith("/calculators/")).map((rule) => [rule.from, rule.to]))(
    "%s points at a page that exists (%s)",
    (_from, to) => {
      expect(to === "/" || appRoute(to), `app${to}page.tsx is missing`).toBe(true)
    },
  )
})
