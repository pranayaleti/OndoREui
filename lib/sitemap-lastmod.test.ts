import { createRequire } from "node:module"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const requireCjs = createRequire(import.meta.url)
const { lastmodFromSource, getRouteLastmod } = requireCjs("./sitemap-lastmod.cjs") as {
  lastmodFromSource: (source: string) => string | undefined
  getRouteLastmod: (routePath: string, appDir: string) => string | undefined
}
const nextSitemapConfig = requireCjs("../next-sitemap.config.js") as {
  transform: (config: unknown, path: string) => Promise<{ lastmod?: string } | null>
}

const APP_DIR = join(import.meta.dirname, "..", "app")

describe("lastmodFromSource", () => {
  it("prefers the declared modified date over published", () => {
    expect(lastmodFromSource('const published = "2026-01-02"\nconst modified = "2026-03-04"')).toBe("2026-03-04")
  })

  it("reads object-literal dates and takes the latest", () => {
    expect(lastmodFromSource('a({ published: "2026-09-17" }) b({ published: "2026-09-17" })')).toBe("2026-09-17")
  })

  it("falls back to published when no modified date is declared", () => {
    expect(lastmodFromSource('const published = "2026-05-06"')).toBe("2026-05-06")
  })

  it("returns undefined rather than guessing when the page declares no date", () => {
    expect(lastmodFromSource("export default function Page() { return null }")).toBeUndefined()
    expect(lastmodFromSource('const modified = "not-a-date"')).toBeUndefined()
  })
})

describe("getRouteLastmod", () => {
  it("reads a real post's own date", () => {
    expect(getRouteLastmod("/blog/appraisal-comes-in-low/", APP_DIR)).toBe("2026-09-17")
  })

  it("omits lastmod for routes with no source date, dynamic segments or traversal", () => {
    expect(getRouteLastmod("/buy", APP_DIR)).toBeUndefined()
    expect(getRouteLastmod("/does-not-exist", APP_DIR)).toBeUndefined()
    expect(getRouteLastmod("/blog/[slug]", APP_DIR)).toBeUndefined()
    expect(getRouteLastmod("/../package", APP_DIR)).toBeUndefined()
  })
})

describe("next-sitemap transform lastmod", () => {
  it("never substitutes a section constant or the build date", async () => {
    const buy = await nextSitemapConfig.transform({ siteUrl: "https://example.com" }, "/buy")
    expect(buy).not.toBeNull()
    expect(buy).not.toHaveProperty("lastmod")
    const post = await nextSitemapConfig.transform({ siteUrl: "https://example.com" }, "/blog/appraisal-comes-in-low/")
    expect(post?.lastmod).toBe("2026-09-17")
  })
})
