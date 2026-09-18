import { readFileSync, readdirSync, existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

/**
 * AGENTS.md rule 2: compliance is a template property, never a per-instance one.
 *
 * Key-takeaway boxes and callouts are the two places an author hand-writes
 * lending copy that renders ABOVE the page's hedges and disclaimer, and they are
 * the chunk that gets extracted on its own. These guards keep two specific
 * mistakes from coming back one post at a time.
 */

const BLOG = join(process.cwd(), "app/blog")

function postSources(): { slug: string; src: string }[] {
  return readdirSync(BLOG)
    .map((slug) => ({ slug, file: join(BLOG, slug, "page.tsx") }))
    .filter(({ file }) => existsSync(file))
    .map(({ slug, file }) => ({ slug, src: readFileSync(file, "utf8") }))
}

function blocks(src: string, pattern: RegExp): string[] {
  return [...src.matchAll(pattern)].map((m) => m[1])
}

const takeawayBlocks = (src: string) => blocks(src, /takeaways:\s*\[([\s\S]*?)\n\s*\]/g)
const calloutBlocks = (src: string) => blocks(src, /<ArticleCallout[^>]*>([\s\S]*?)<\/ArticleCallout>/g)

/**
 * Characterising a reader's conduct as a crime is reviewed copy. It belongs in
 * lib/content constants (e.g. OCCUPANCY_TYPES.fraud), referenced by name — a
 * constant reference does not match these, only a hand-typed literal does.
 */
const LEGAL_CONCLUSIONS =
  /\b(is|are)\s+(not\s+legal\b|(\w+\s+)?(a\s+)?(fraud|crime|misrepresentation|illegal|unlawful|felony)\b)/i

/** A body hedge that the summary drops is the failure mode these boxes invite. */
const SUMMARY_ABSOLUTES = /\b(the only thing|always|guaranteed|guarantees|ensures|will not be denied)\b/i

describe("article key-takeaway and callout copy", () => {
  it("never hand-writes a legal conclusion about the reader's conduct", () => {
    const offenders = postSources().flatMap(({ slug, src }) =>
      [...takeawayBlocks(src), ...calloutBlocks(src)]
        .filter((block) => LEGAL_CONCLUSIONS.test(block))
        .map((block) => `${slug}: ${block.trim().slice(0, 120)}`),
    )
    expect(offenders, "use a reviewed constant from lib/content instead of a literal").toEqual([])
  })

  it("does not put absolutes in a summary that renders above the article's hedges", () => {
    const offenders = postSources().flatMap(({ slug, src }) =>
      takeawayBlocks(src)
        .filter((block) => SUMMARY_ABSOLUTES.test(block))
        .map((block) => `${slug}: ${block.trim().slice(0, 120)}`),
    )
    expect(offenders).toEqual([])
  })
})
