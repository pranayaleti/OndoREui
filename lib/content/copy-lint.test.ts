/// <reference types="vite/client" />
import { describe, expect, it } from "vitest"
import { getBlogPosts } from "../blog-posts"

/**
 * Reader-facing copy lint for blog posts and the shared lending facts. Internal SEO or editing notes
 * ("doorway", "mill", "clone", "matrix item", "landings", "listicle") and banned brand-voice words must
 * not reach published pages, meta descriptions, or FAQ structured data.
 */
const sources = {
  ...import.meta.glob("/app/blog/*/page.tsx", { query: "?raw", import: "default", eager: true }),
  ...import.meta.glob(["/lib/content/*.ts", "!/lib/content/*.test.ts"], {
    query: "?raw",
    import: "default",
    eager: true,
  }),
  ...import.meta.glob("/lib/blog-posts.ts", { query: "?raw", import: "default", eager: true }),
} as Record<string, string>

// Rendered content modules that feed the city and service pages. Comments and JSDoc are skipped, so only
// reader-facing strings are checked for the brand-voice em dash ban.
const generatorSources = {
  ...import.meta.glob(
    [
      "/lib/content/*.ts",
      "!/lib/content/*.test.ts",
      "/lib/city-content.ts",
      "/lib/service-faq.ts",
      "/lib/testimonials.ts",
      "/components/seasonal-callout.tsx",
      "/components/city-testimonials.tsx",
    ],
    { query: "?raw", import: "default", eager: true },
  ),
} as Record<string, string>

const BANNED_WORDS = /\b(?:straightforward|genuinely|honestly)\b/i
const INTERNAL_NOTES =
  /\bdoorways?\b|\bmill\b|\bclone[ds]?\b|\bcloning\b|\bmatrix (?:item|“)|\blandings\b|\blistic(?:le|les)\b|\bremake\b|another licensed state|other licensed states/i
const STRAY_SPACE_COMMA = /\w ,(?:\s|$)/

// "Stand in the doorway" is literal staging advice, not SEO jargon.
const INTERNAL_NOTES_EXEMPT = new Set(["/app/blog/home-staging-tips-that-work/page.tsx"])

describe("blog and lending-facts copy lint", () => {
  it("scans the post pages and shared content", () => {
    const paths = Object.keys(sources)
    expect(paths.filter((p) => p.startsWith("/app/blog/")).length).toBeGreaterThan(50)
    expect(paths).toContain("/lib/content/lending-facts.ts")
  })

  it("has no banned brand-voice words", () => {
    const hits: string[] = []
    for (const [path, src] of Object.entries(sources)) {
      src.split("\n").forEach((line, i) => {
        if (BANNED_WORDS.test(line)) hits.push(`${path}:${i + 1}: ${line.trim().slice(0, 100)}`)
      })
    }
    expect(hits).toEqual([])
  })

  it("has no internal SEO or editorial notes in published copy", () => {
    const hits: string[] = []
    for (const [path, src] of Object.entries(sources)) {
      if (INTERNAL_NOTES_EXEMPT.has(path)) continue
      src.split("\n").forEach((line, i) => {
        if (INTERNAL_NOTES.test(line)) hits.push(`${path}:${i + 1}: ${line.trim().slice(0, 100)}`)
      })
    }
    expect(hits).toEqual([])
  })

  it("has no stray space-comma typos", () => {
    const hits: string[] = []
    for (const [path, src] of Object.entries(sources)) {
      src.split("\n").forEach((line, i) => {
        if (STRAY_SPACE_COMMA.test(line) || /^\s+, /.test(line)) hits.push(`${path}:${i + 1}: ${line.trim().slice(0, 100)}`)
      })
    }
    expect(hits).toEqual([])
  })

  it("keeps em dashes out of blog index excerpts and meta descriptions", () => {
    for (const post of getBlogPosts()) {
      expect(post.excerpt, post.slug).not.toContain("—")
      expect(post.excerpt, post.slug).not.toMatch(INTERNAL_NOTES)
    }
  })
  it("keeps em dashes out of rendered content modules", () => {
    const hits: string[] = []
    for (const [path, src] of Object.entries(generatorSources)) {
      src.split("\n").forEach((line, i) => {
        if (/^\s*(?:\*|\/\/|\/\*)/.test(line)) return
        if (/ — |&mdash;/.test(line)) hits.push(`${path}:${i + 1}: ${line.trim().slice(0, 100)}`)
      })
    }
    expect(hits).toEqual([])
  })

  it("uses US spellings on a US site", () => {
    const hits: string[] = []
    for (const [path, src] of Object.entries({ ...sources, ...generatorSources })) {
      src.split("\n").forEach((line, i) => {
        if (/^\s*(?:\*|\/\/|\/\*)/.test(line)) return
        if (/\b(?:colour|favour|neighbour|organis|odour|generalis)/i.test(line)) {
          hits.push(`${path}:${i + 1}: ${line.trim().slice(0, 100)}`)
        }
      })
    }
    expect(hits).toEqual([])
  })

  it("does not repeat the wrong Utah property-tax claims", () => {
    for (const [path, src] of Object.entries(sources)) {
      expect(src, path).not.toMatch(/(?:tax(?:es)?|valuations?) (?:can )?reset|reset (?:after|post)[- ]sale/i)
    }
    const post = sources["/app/blog/understanding-property-taxes-utah/page.tsx"]
    expect(post).not.toMatch(/you lose this exemption|will be removed in the year of sale/i)
    expect(post).toMatch(/183 consecutive days/)
    expect(post).toMatch(/tax\.utah\.gov/)
    expect(post).not.toContain("placeholder.jpg")
  })
})
