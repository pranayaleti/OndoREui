import { existsSync, readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { CALCULATOR_SLUGS } from "./calculator-catalog"
import {
  legacyCalculatorPathToCanonicalPath,
  legacyCalculatorSitemapExcludes,
  pageCanonicalMetadata,
  toCanonicalPageUrl,
} from "./page-canonical"
import { SITE_URL } from "./site"

const requireCjs = createRequire(import.meta.url)
const nextSitemapConfig = requireCjs("../next-sitemap.config.js") as {
  exclude: string[]
}

const repoRoot = join(import.meta.dirname, "..")

describe("toCanonicalPageUrl", () => {
  it("adds a trailing slash so it matches trailingSlash: true", () => {
    expect(toCanonicalPageUrl("/buy")).toBe(`${SITE_URL}/buy/`)
    expect(toCanonicalPageUrl("/buy/")).toBe(`${SITE_URL}/buy/`)
  })

  it("uses a trailing slash on the homepage", () => {
    expect(toCanonicalPageUrl("/")).toBe(`${SITE_URL}/`)
  })

  it("leaves file-like paths without a trailing slash", () => {
    expect(toCanonicalPageUrl("/sitemap.xml")).toBe(`${SITE_URL}/sitemap.xml`)
  })
})

describe("pageCanonicalMetadata", () => {
  it("sets a self-referencing canonical and OG url", () => {
    const meta = pageCanonicalMetadata("/about", { title: "About" })
    expect(meta.title).toBe("About")
    expect(meta.alternates?.canonical).toBe(`${SITE_URL}/about/`)
    expect(meta.openGraph?.url).toBe(`${SITE_URL}/about/`)
  })
})

describe("legacy Pages Router calculator URLs", () => {
  it("maps every catalog slug to the App Router canonical path", () => {
    for (const slug of CALCULATOR_SLUGS) {
      expect(legacyCalculatorPathToCanonicalPath(`/calculators/${slug}-calculator`)).toBe(
        `/calculators/${slug}/`,
      )
      expect(legacyCalculatorPathToCanonicalPath(`/calculators/${slug}-calculator/`)).toBe(
        `/calculators/${slug}/`,
      )
    }
  })

  it("ignores App Router calculator paths", () => {
    expect(legacyCalculatorPathToCanonicalPath("/calculators/mortgage-payment")).toBeNull()
    expect(legacyCalculatorPathToCanonicalPath("/about")).toBeNull()
  })

  it("is excluded from the public sitemap so Google is not asked to crawl duplicates", () => {
    expect(nextSitemapConfig.exclude).toEqual(
      expect.arrayContaining(["/calculators/*-calculator", "/calculators/*-calculator/"]),
    )
    for (const path of legacyCalculatorSitemapExcludes()) {
      expect(path).toMatch(/^\/calculators\/[^/]+-calculator\/?$/)
    }
  })

  it("emits a user-selected canonical from the Pages Router _app shell", () => {
    const appPath = join(repoRoot, "pages/_app.tsx")
    expect(existsSync(appPath)).toBe(true)
    const source = readFileSync(appPath, "utf8")
    expect(source).toContain("legacyCalculatorPathToCanonicalPath")
    expect(source).toContain("rel=\"canonical\"")
    expect(source).toContain("noindex")
  })
})
