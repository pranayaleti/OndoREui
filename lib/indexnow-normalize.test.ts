import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { contentToHash, normalizeExportedHtml } from "../scripts/indexnow-normalize.mjs"

function page(buildId: string, chunk: string, css: string, body = "Hello") {
  return (
    `<html><head><link rel="stylesheet" href="/_next/static/css/${css}.css"/>` +
    `<script src="/_next/static/chunks/1255-${chunk}.js" async></script>` +
    `<script src="/_next/static/chunks/app/buy/page-${chunk}.js" async></script>` +
    `<link rel="preload" href="/_next/static/media/7b0b24f36b1a6d0b-s.p.woff2"/>` +
    `<script src="/_next/static/${buildId}/_buildManifest.js" async></script></head>` +
    `<body>${body}<!--${buildId}--><script>self.__next_f.push([1,"0:{\\"P\\":null,\\"b\\":\\"${buildId}\\",\\"c\\":[\\"\\",\\"buy\\",\\"\\"]}"])</script>` +
    `</body></html>`
  )
}

describe("normalizeExportedHtml", () => {
  const a = page("35cCygQpJPJSq9mM75RpM", "3d60cb18f4e2fadb", "e47123a00a0d111c")
  const b = page("Zx9Qw8Er7Ty6Ui5Op4As3", "00aa11bb22cc33dd", "ffeeddccbbaa9988")

  it("gives the same output for two builds of unchanged content", () => {
    expect(a).not.toBe(b)
    expect(normalizeExportedHtml(a)).toBe(normalizeExportedHtml(b))
  })

  it("still changes when the visible content changes", () => {
    const changed = page("Zx9Qw8Er7Ty6Ui5Op4As3", "00aa11bb22cc33dd", "ffeeddccbbaa9988", "Hello, new copy")
    expect(normalizeExportedHtml(changed)).not.toBe(normalizeExportedHtml(a))
  })

  it("removes the build id everywhere it appears", () => {
    const out = normalizeExportedHtml(a)
    expect(out).not.toContain("35cCygQpJPJSq9mM75RpM")
    expect(out).not.toContain("3d60cb18f4e2fadb")
    expect(out).toContain("<!--BUILD_ID-->")
  })

  it("leaves non-hash text alone", () => {
    expect(normalizeExportedHtml("<p>0123456789abcdef is a coupon</p>")).toBe("<p>0123456789abcdef is a coupon</p>")
  })
})

describe("contentToHash", () => {
  it("normalizes html but hashes other files as-is", () => {
    const html = Buffer.from(page("35cCygQpJPJSq9mM75RpM", "3d60cb18f4e2fadb", "e47123a00a0d111c"))
    expect(contentToHash(html, "out/buy/index.html")).toBe(normalizeExportedHtml(html.toString("utf8")))
    const txt = Buffer.from("plain text")
    expect(contentToHash(txt, "out/llms.txt")).toBe(txt)
  })
})

describe("against a real export", () => {
  const out = join(import.meta.dirname, "..", "out", "buy", "index.html")
  it.skipIf(!existsSync(out))("strips the real build id from out/buy/index.html", () => {
    const html = readFileSync(out, "utf8")
    const id = html.match(/\\"b\\":\\"([A-Za-z0-9_-]{16,})\\"/)?.[1]
    expect(id).toBeTruthy()
    expect(normalizeExportedHtml(html)).not.toContain(id as string)
  })
})
