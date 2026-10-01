import { describe, expect, it } from "vitest"
import { toAbsoluteSiteUrl, toSitePath } from "./url"
import * as siteIndex from "./site-index"
import { SITE_URL } from "./site"

describe("lib/url", () => {
  it("adds the trailing slash to page paths and leaves file paths alone", () => {
    expect(toSitePath("/")).toBe("/")
    expect(toSitePath("/about")).toBe("/about/")
    expect(toSitePath("/about//")).toBe("/about/")
    expect(toSitePath("/sitemap.xml")).toBe("/sitemap.xml")
  })

  it("builds absolute canonical URLs on the site origin", () => {
    const base = SITE_URL.replace(/\/$/, "")
    expect(toAbsoluteSiteUrl("/")).toBe(`${base}/`)
    expect(toAbsoluteSiteUrl("/buy")).toBe(`${base}/buy/`)
    expect(toAbsoluteSiteUrl("/index.md")).toBe(`${base}/index.md`)
  })

  it("is still re-exported from site-index for existing importers", () => {
    expect(siteIndex.toAbsoluteSiteUrl).toBe(toAbsoluteSiteUrl)
    expect(siteIndex.toSitePath).toBe(toSitePath)
  })
})
