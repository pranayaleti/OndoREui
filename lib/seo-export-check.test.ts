// @vitest-environment node
import { describe, it, expect } from "vitest"
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { auditExport, auditPage, hasTrailingSlash, isRedirectStub, parsePage } from "../scripts/check-seo-export.mjs"

const SITE = "https://www.ondorealestate.com"
const TITLE = "Buy a Home in Utah | Agent-Led Search | Ondo RE"
const DESCRIPTION = "Work with an Ondo buyer's agent across the Wasatch Front. Agent-led search, in-house mortgages and rentals."

function page({
  path = "/buy/",
  title = TITLE,
  description = DESCRIPTION,
  ogUrl = `${SITE}${path}`,
  canonical = `${SITE}${path}`,
  ogType = "website",
  robots = "index, follow",
  jsonLd = "",
  body = "",
}: Partial<Record<string, string>> = {}) {
  return `<html><head>
<title>${title}</title>
<meta name="description" content="${description}"/>
<meta name="robots" content="${robots}"/>
<link rel="canonical" href="${canonical}"/>
<meta property="og:url" content="${ogUrl}"/>
${ogType ? `<meta property="og:type" content="${ogType}"/>` : ""}
${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ""}
<script>self.__next_f.push([1,"<meta property=\\"og:type\\" content=\\"article\\"/>"])</script>
</head><body>${body}</body></html>`
}

describe("parsePage", () => {
  it("reads head fields, decodes entities and ignores meta tags inside script payloads", () => {
    const parsed = parsePage(page({ title: "A &amp; B", ogType: "" }))
    expect(parsed.title).toBe("A & B")
    expect(parsed.canonical).toBe(`${SITE}/buy/`)
    expect(parsed.ogUrl).toBe(`${SITE}/buy/`)
    // The RSC payload mentions og:type, but only real <meta> tags count.
    expect(parsed.ogType).toBeUndefined()
  })

  it("collects JSON-LD blocks and anchors", () => {
    const parsed = parsePage(page({ jsonLd: '{"url":"x"}', body: '<a href="/sell/">Sell</a>' }))
    expect(parsed.jsonLd).toEqual(['{"url":"x"}'])
    expect(parsed.hrefs).toEqual(["/sell/"])
  })
})

describe("hasTrailingSlash", () => {
  it("accepts page URLs with a slash and file URLs, rejects page URLs without one", () => {
    expect(hasTrailingSlash(`${SITE}/buy/`)).toBe(true)
    expect(hasTrailingSlash(SITE)).toBe(true)
    expect(hasTrailingSlash(`${SITE}/feed.xml`)).toBe(true)
    expect(hasTrailingSlash(`${SITE}/buy`)).toBe(false)
  })
})

describe("auditPage", () => {
  it("passes a complete page", () => {
    const result = auditPage(parsePage(page()))
    expect(result.errors).toEqual([])
    expect(result.warnings).toEqual([])
  })

  it("flags og:url that differs from canonical", () => {
    const { errors } = auditPage(parsePage(page({ ogUrl: `${SITE}/sell/` })))
    expect(errors.join()).toMatch(/differs from canonical/)
  })

  it("flags canonical and og:url without a trailing slash", () => {
    const { errors } = auditPage(parsePage(page({ canonical: `${SITE}/buy`, ogUrl: `${SITE}/buy` })))
    expect(errors.join()).toMatch(/canonical has no trailing slash/)
    expect(errors.join()).toMatch(/og:url has no trailing slash/)
  })

  it("flags a same-site JSON-LD url without a trailing slash, nested, but not other hosts or files", () => {
    const jsonLd = JSON.stringify({
      "@graph": [
        { "@type": "Organization", url: `${SITE}/about` },
        { "@type": "WebSite", url: `${SITE}/` },
        { "@type": "Thing", url: "https://example.com/x" },
        { "@type": "Thing", url: `${SITE}/feed.xml` },
      ],
    })
    const { errors } = auditPage(parsePage(page({ jsonLd })))
    expect(errors).toEqual([`JSON-LD url has no trailing slash: ${SITE}/about`])
  })

  it("flags missing og:type, title and description on an indexable page", () => {
    const { errors } = auditPage({ ...parsePage(page({ ogType: "" })), title: undefined, description: undefined })
    expect(errors).toEqual(
      expect.arrayContaining(["indexable page has no <title>", "indexable page has no meta description", "indexable page has no og:type"]),
    )
  })

  it("does not require title, description or og:type on a noindex page", () => {
    const { errors, indexable } = auditPage({ ...parsePage(page({ robots: "noindex, follow", ogType: "" })), title: undefined, description: undefined })
    expect(indexable).toBe(false)
    expect(errors).toEqual([])
  })

  it("reports title and description length as warnings only", () => {
    const result = auditPage(parsePage(page({ title: "Short", description: "Too short." })))
    expect(result.errors).toEqual([])
    expect(result.warnings).toHaveLength(2)
  })
})

describe("auditExport", () => {
  function exportDir() {
    const out = mkdtempSync(join(tmpdir(), "seo-export-"))
    const write = (route: string, html: string) => {
      mkdirSync(join(out, route), { recursive: true })
      writeFileSync(join(out, route, "index.html"), html)
    }
    const sitemap = (name: string, xml: string) => writeFileSync(join(out, name), xml)
    return { out, write, sitemap }
  }

  it("passes a consistent export and skips redirect stubs", () => {
    const { out, write, sitemap } = exportDir()
    write("buy", page({ path: "/buy/" }))
    write("old-buy", '<meta http-equiv="refresh" content="0; url=/buy/">')
    sitemap("sitemap.xml", `<sitemapindex><sitemap><loc>${SITE}/sitemap-0.xml</loc></sitemap></sitemapindex>`)
    sitemap("sitemap-0.xml", `<urlset><url><loc>${SITE}/buy/</loc></url></urlset>`)
    expect(auditExport(out).errors).toEqual([])
  })

  it("flags sitemap entries that are files or have no exported page", () => {
    const { out, write, sitemap } = exportDir()
    write("buy", page({ path: "/buy/" }))
    write("old-buy", '<meta http-equiv="refresh" content="0; url=/buy/">')
    sitemap(
      "sitemap-0.xml",
      `<urlset><url><loc>${SITE}/buy/</loc></url><url><loc>${SITE}/brochure.pdf</loc></url><url><loc>${SITE}/missing/</loc></url><url><loc>${SITE}/old-buy/</loc></url></urlset>`,
    )
    const messages = auditExport(out).errors.map((e: { message: string; route: string }) => `${e.route} ${e.message}`)
    expect(messages).toHaveLength(3)
    expect(messages.join("\n")).toMatch(/brochure\.pdf.*not an HTML page/)
    expect(messages.join("\n")).toMatch(/missing\/.*no exported page/)
    expect(messages.join("\n")).toMatch(/old-buy\/.*no exported page/)
  })

  it("warns about indexable pages with fewer than three internal links, never errors", () => {
    const { out, write } = exportDir()
    write("buy", page({ path: "/buy/", body: '<a href="/sell/">Sell</a>' }))
    write("sell", page({ path: "/sell/", body: '<a href="/buy/">Buy</a>' }))
    const result = auditExport(out)
    expect(result.errors).toEqual([])
    expect(result.warnings.map((w: { message: string }) => w.message).join()).toMatch(/only 1 internal page\(s\) link here/)
  })

  it("recognises a redirect stub", () => {
    expect(isRedirectStub('<meta http-equiv="refresh" content="0">')).toBe(true)
    expect(isRedirectStub(page())).toBe(false)
  })
})
