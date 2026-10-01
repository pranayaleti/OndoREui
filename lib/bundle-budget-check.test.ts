// @vitest-environment node
import { describe, it, expect } from "vitest"
import { randomBytes } from "node:crypto"
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import {
  evaluateBudgets,
  findForbidden,
  gzipBytes,
  scriptSources,
  sharedScripts,
} from "../scripts/analyze-bundle.mjs"

/** Random bytes: they do not compress, so the gzip size equals the requested size. */
function noise(bytes: number): Buffer {
  return randomBytes(bytes)
}

function makeExport(files: Record<string, string | Buffer>): string {
  const out = mkdtempSync(join(tmpdir(), "bundle-budget-"))
  for (const [rel, body] of Object.entries(files)) {
    mkdirSync(dirname(join(out, rel)), { recursive: true })
    writeFileSync(join(out, rel), body)
  }
  return out
}

const page = (...srcs: string[]) => `<html><body>${srcs.map((s) => `<script src="${s}" async=""></script>`).join("")}</body></html>`

describe("scriptSources", () => {
  it("returns unique same-origin script URLs, decoded, and ignores inline and external scripts", () => {
    const html =
      '<script src="/_next/static/chunks/a.js"></script>' +
      '<script async="" src="/_next/static/chunks/app/locations/%5Bcity%5D/page-1.js?v=2"></script>' +
      '<script src="/_next/static/chunks/a.js"></script>' +
      '<script src="https://cdn.example.com/x.js"></script>' +
      '<script src="//cdn.example.com/y.js"></script>' +
      "<script>window.x = 1</script>"
    expect(scriptSources(html)).toEqual(["/_next/static/chunks/a.js", "/_next/static/chunks/app/locations/[city]/page-1.js"])
  })
})

describe("sharedScripts", () => {
  it("keeps only scripts every page loads", () => {
    expect(sharedScripts([["a", "b", "c"], ["b", "c", "d"], ["c", "b"]])).toEqual(["b", "c"])
    expect(sharedScripts([])).toEqual([])
  })
})

describe("gzipBytes and findForbidden", () => {
  it("sums gzip bytes, reports missing files and finds forbidden markers", () => {
    const out = makeExport({ "_next/a.js": noise(2000), "_next/b.js": "var x='leaflet-container'" })
    const size = gzipBytes(out, ["/_next/a.js", "/_next/gone.js"])
    expect(size.bytes).toBeGreaterThan(1000)
    expect(size.missing).toEqual(["/_next/gone.js"])
    expect(findForbidden(out, ["/_next/a.js", "/_next/b.js"])).toEqual([{ script: "/_next/b.js", name: "leaflet" }])
  })

  it("does not flag an env var name or a link that merely mentions the library", () => {
    const out = makeExport({ "_next/a.js": 'process.env.NEXT_PUBLIC_SENTRY_DSN;href:"/glossary"' })
    expect(findForbidden(out, ["/_next/a.js"])).toEqual([])
  })
})

describe("evaluateBudgets", () => {
  const budgets = {
    baseKb: 5,
    routes: [
      { label: "/", html: "index.html", appRouter: true, maxKb: 8 },
      { label: "/buy/", html: "buy/index.html", appRouter: true, maxKb: 8 },
      { label: "/calc/", html: "calc/index.html", appRouter: false, maxKb: 3 },
    ],
  }
  const base = { "_next/base.js": noise(3000), "_next/calc.js": noise(2000) }

  it("passes when every ceiling holds", () => {
    const out = makeExport({
      ...base,
      "_next/home.js": noise(2000),
      "index.html": page("/_next/base.js", "/_next/home.js"),
      "buy/index.html": page("/_next/base.js"),
      "calc/index.html": page("/_next/calc.js"),
    })
    const { problems, rows } = evaluateBudgets(out, budgets)
    expect(problems).toEqual([])
    expect(rows.map((r) => r.label)).toEqual(["shared base", "/", "/buy/", "/calc/"])
    // The Pages Router calculator is not part of the base set: base is what / and /buy/ share.
    expect(rows[0].files).toBe(1)
  })

  it("fails when a route is over its ceiling", () => {
    const out = makeExport({
      ...base,
      "_next/home.js": noise(9000),
      "index.html": page("/_next/base.js", "/_next/home.js"),
      "buy/index.html": page("/_next/base.js"),
      "calc/index.html": page("/_next/calc.js"),
    })
    const { problems } = evaluateBudgets(out, budgets)
    expect(problems).toHaveLength(1)
    expect(problems[0]).toMatch(/^\/ loads .* KB gzip of JS, over the 8 KB ceiling/)
  })

  it("fails when the shared base grows past its ceiling", () => {
    const out = makeExport({
      "_next/base.js": noise(7000),
      "_next/calc.js": noise(2000),
      "index.html": page("/_next/base.js"),
      "buy/index.html": page("/_next/base.js"),
      "calc/index.html": page("/_next/calc.js"),
    })
    const { problems } = evaluateBudgets(out, budgets)
    expect(problems.some((p) => p.startsWith("shared base JS is"))).toBe(true)
  })

  it("fails when a heavy library lands in the shared base", () => {
    const out = makeExport({
      "_next/base.js": Buffer.concat([noise(1000), Buffer.from('className="recharts-wrapper"')]),
      "_next/calc.js": noise(2000),
      "index.html": page("/_next/base.js"),
      "buy/index.html": page("/_next/base.js"),
      "calc/index.html": page("/_next/calc.js"),
    })
    const { problems } = evaluateBudgets(out, budgets)
    expect(problems).toEqual(["shared base chunk /_next/base.js contains recharts: load it on the route that needs it, not in the layout"])
  })

  it("reports a missing page and a missing script instead of passing silently", () => {
    const out = makeExport({
      "index.html": page("/_next/base.js", "/_next/lost.js"),
      "_next/base.js": noise(1000),
      "calc/index.html": page("/_next/calc.js"),
      "_next/calc.js": noise(1000),
    })
    const { problems } = evaluateBudgets(out, budgets)
    expect(problems.some((p) => p.includes("buy/index.html not found"))).toBe(true)
    expect(problems.some((p) => p.includes("/_next/lost.js is referenced but missing"))).toBe(true)
  })
})
