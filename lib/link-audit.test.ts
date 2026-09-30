import { describe, it, expect } from "vitest"
import {
  exportServes,
  extractReferences,
  extractTextReferences,
  isClientRenderedPath,
  sitePathOf,
} from "@/lib/link-audit"

const ORIGINS = ["https://www.ondorealestate.com", "https://ondorealestate.com"]

describe("extractReferences", () => {
  const html = [
    '<link rel="canonical" href="https://www.ondorealestate.com/buy/"/>',
    '<meta property="og:image" content="https://www.ondorealestate.com/og.webp"/>',
    '<meta http-equiv="refresh" content="0;url=/links/?utm_source=qr&amp;utm_medium=qr"/>',
    '<a href="/sell/">Sell</a><a href="#top">Top</a><a href="mailto:x@y.z">Mail</a>',
    '<img src="/a.webp" srcset="/a-1x.webp 1x, /a-2x.webp 2x" alt=""/>',
    '<script src="/_next/static/chunks/main.js"></script>',
    '<script type="application/ld+json">{"@type":"BreadcrumbList","item":"https://www.ondorealestate.com/vs/"}</script>',
    '<script>self.__next_f.push([1,"{\\"href\\":\\"/menu-only/\\"}"])</script>',
  ].join("")
  const refs = extractReferences(html)
  const urls = refs.map((ref) => ref.url)

  it("finds links, images, srcset candidates, scripts, OG images and redirects", () => {
    expect(urls).toEqual(
      expect.arrayContaining([
        "https://www.ondorealestate.com/buy/",
        "https://www.ondorealestate.com/og.webp",
        "/links/?utm_source=qr&utm_medium=qr",
        "/sell/",
        "/a.webp",
        "/a-1x.webp",
        "/a-2x.webp",
        "/_next/static/chunks/main.js",
      ]),
    )
  })

  it("reads URLs inside JSON-LD and links handed to client components", () => {
    expect(refs).toContainEqual({ url: "https://www.ondorealestate.com/vs/", kind: "json-ld" })
    expect(refs).toContainEqual({ url: "/menu-only/", kind: "rsc:href" })
  })

  it("flags JSON-LD that does not parse", () => {
    expect(extractReferences('<script type="application/ld+json">{bad</script>')).toContainEqual({ url: "", kind: "json-ld:invalid" })
  })
})

describe("extractTextReferences", () => {
  it("finds site URLs and root-relative Markdown links, without trailing punctuation", () => {
    const refs = extractTextReferences("See https://www.ondorealestate.com/buy/. Or [sell](/sell/)", ORIGINS)
    expect(refs.map((ref) => ref.url)).toEqual(["https://www.ondorealestate.com/buy/", "/sell/"])
  })
})

describe("sitePathOf", () => {
  it("resolves site URLs and relative links, and ignores other hosts and schemes", () => {
    expect(sitePathOf("https://ondorealestate.com/buy/", "/", ORIGINS)).toBe("/buy/")
    expect(sitePathOf("../loans/", "/buy/fha/", ORIGINS)).toBe("/buy/loans/")
    expect(sitePathOf("https://calendly.com/x", "/", ORIGINS)).toBeNull()
    expect(sitePathOf("tel:+14085380420", "/", ORIGINS)).toBeNull()
    expect(sitePathOf("https://www.ondorealestate.com/[path].md", "/", ORIGINS)).toBeNull()
  })
})

describe("exportServes", () => {
  const files = new Set(["/buy/index.html", "/feed.xml", "/404.html"])

  it("serves directories with a trailing slash and redirects without one, like GitHub Pages", () => {
    expect(exportServes("/buy/", files)).toBe(true)
    expect(exportServes("/buy", files)).toBe(true)
    expect(exportServes("/feed.xml", files)).toBe(true)
    expect(exportServes("/404", files)).toBe(true)
    expect(exportServes("/vs/", files)).toBe(false)
  })
})

describe("isClientRenderedPath", () => {
  it("accepts listing, rental and visit links that the 404 page renders", () => {
    expect(isClientRenderedPath("/properties/abc-123/")).toBe(true)
    expect(isClientRenderedPath("/apply/start/abc/")).toBe(true)
    expect(isClientRenderedPath("/visit/schedule/token123/")).toBe(true)
    expect(isClientRenderedPath("/blog/missing/")).toBe(false)
  })
})
