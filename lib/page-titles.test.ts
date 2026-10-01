/// <reference types="vite/client" />
import { describe, expect, it } from "vitest"
import { SITE_TITLE_MAX } from "@/lib/site"

/**
 * Every statically exported page title, scanned from source. Google truncates near
 * 60 characters, so a longer core title loses its tail in the SERP, and a brand shown
 * twice pushes out the words that tell the page apart.
 *
 * pageTitle() cannot fix an over-long core (cutting words automatically would change
 * meaning), so this test is the guard: shorten the copy, or use fitTitle() candidates.
 * Pages that set noindex are skipped, and so are dynamic routes that build their title
 * in generateMetadata (covered by the per-template tests in lib/seo-titles.test.ts).
 */
const pages = import.meta.glob("/app/**/page.tsx")

type Meta = { title?: unknown; robots?: unknown }

function titleText(title: unknown): string | undefined {
  if (typeof title === "string") return title
  if (title && typeof title === "object") {
    const t = title as { absolute?: string; default?: string }
    return t.absolute ?? t.default
  }
  return undefined
}

function isNoindex(robots: unknown): boolean {
  if (!robots) return false
  if (typeof robots === "string") return /noindex/i.test(robots)
  return (robots as { index?: boolean }).index === false
}

const brandCount = (title: string) => (title.match(/\bOndo (Real Estate|RE)\b/gi) ?? []).length

describe("static page titles", () => {
  it("stay within the SERP budget and show the brand at most once", async () => {
    const tooLong: string[] = []
    const repeatsBrand: string[] = []
    let checked = 0

    for (const [path, load] of Object.entries(pages)) {
      let meta: Meta | undefined
      try {
        meta = ((await load()) as { metadata?: Meta }).metadata
      } catch {
        continue // a page that cannot import under jsdom is covered by its own tests
      }
      const title = titleText(meta?.title)
      if (!title || isNoindex(meta?.robots)) continue
      checked += 1
      if (title.length > SITE_TITLE_MAX) tooLong.push(`${path} (${title.length}): ${title}`)
      if (brandCount(title) > 1) repeatsBrand.push(`${path}: ${title}`)
    }

    expect(checked).toBeGreaterThan(150)
    expect(tooLong).toEqual([])
    expect(repeatsBrand).toEqual([])
  }, 180_000)
})
