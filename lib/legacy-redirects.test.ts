// @vitest-environment node
import { describe, it, expect } from "vitest"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join, sep } from "node:path"
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

// Next.js prefetches the RSC payload of every <Link> target and a stub has none, so a link to a stub
// 404s on prefetch, then costs the visitor a redirect hop. Link the destination instead.
describe("links in the source", () => {
  const stubs = new Map(rules.map((rule) => [`${rule.from}/`, rule.to]))
  const noPages = { readPage: () => null }

  /** Where a site path ends up if it is a legacy redirect (a stub or an old calculator URL), else null. */
  const legacyTarget = (link: string) => {
    const path = link.replace(/[?#].*$/, "")
    if (path.includes("${") || /\.[a-z0-9]{2,8}$/i.test(path)) return null
    const page = path.endsWith("/") ? path : `${path}/`
    const to = stubs.get(page)
    if (to) return resolveFinalTarget(to, noPages)
    const final = resolveFinalTarget(page, noPages)
    return final === page ? null : final
  }

  // A site path in an href/url/path-style prop or attribute, bare or after a `${SITE_URL}` origin.
  const LINK = /\b[A-Za-z]*(?:href|Href|url|Url|path|Path)\s*[:=]\s*\{?\s*(["'`])(?:\$\{\w+\})?(\/[^"'`\s]*)\1/g
  const legacyLinks = (code: string) =>
    [...code.matchAll(LINK)].flatMap((match) => {
      const to = legacyTarget(match[2])
      return to ? [{ link: match[2], to, line: code.slice(0, match.index).split("\n").length }] : []
    })

  // Unused leftovers of retired pages (nothing imports them): delete them rather than relink.
  const UNUSED = new Set(["components/dashboard/dashboard-nav.tsx", "lib/social-posts.ts"])
  const sources = ["app", "components", "hooks", "lib", "pages"]
    .flatMap((dir) => readdirSync(join(ROOT, dir), { recursive: true, encoding: "utf8" }).map((file) => `${dir}/${file.split(sep).join("/")}`))
    .filter((file) => /\.tsx?$/.test(file) && !/\.(test|spec)\.tsx?$|\.d\.ts$/.test(file) && !UNUSED.has(file))

  it("finds stub links written as an href, a `${SITE_URL}` URL or an old calculator path", () => {
    expect(legacyLinks('<Link href="/vs/turbotenant">').map((hit) => hit.to)).toEqual(["/compare-utah-property-managers/"])
    expect(legacyLinks('{ name: "Compare", url: `${SITE_URL}/compare/` }').map((hit) => hit.to)).toEqual(["/compare-utah-property-managers/"])
    expect(legacyLinks('parentHref: "/calculators/roi-calculator"').map((hit) => hit.to)).toEqual(["/calculators/roi/"])
    expect(legacyLinks('href="/compare-utah-property-managers/#diy-software"')).toEqual([])
    expect(sources.length).toBeGreaterThan(500)
  })

  it("points app, components, hooks, lib and pages links at destinations, not legacy redirects", () => {
    const hits = sources.flatMap((file) =>
      legacyLinks(readFileSync(join(ROOT, file), "utf8")).map(({ link, to, line }) => `${file}:${line} links ${link}, use ${to}`),
    )
    expect(hits).toEqual([])
  })
})
