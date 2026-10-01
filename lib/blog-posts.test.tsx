/// <reference types="vite/client" />
import { describe, expect, it } from "vitest"
import { isValidElement, type ReactElement, type ReactNode } from "react"
import { ArticleShell } from "@/components/content/article-shell"
import SEO from "@/components/seo"
import { countWords, extractOutline, readingTimeMinutes } from "@/lib/content/article-outline"
import { BLOG_INDEX_CATEGORY_ALIASES, getBlogPosts } from "./blog-posts"
import { homepageBlogPosts } from "./homepage-blog-posts"

/**
 * The blog index reads lib/blog-posts.ts. These tests render every post page and compare, so the
 * index cannot drift from the posts again (missing posts, stale dates, invented read times).
 */
const pages = import.meta.glob("/app/blog/*/page.tsx")

type PostFacts = {
  slug: string
  title: string
  description: string
  published: string
  category: string
  /** The byline's minutes, or undefined on hand-built pages that show no byline. */
  readMinutes?: number
  noindex: boolean
}

function findSeo(node: ReactNode): ReactElement<Record<string, string | undefined>> | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findSeo(child)
      if (found) return found
    }
    return undefined
  }
  if (!isValidElement(node)) return undefined
  if (node.type === SEO) return node as ReactElement<Record<string, string | undefined>>
  return findSeo((node.props as { children?: ReactNode }).children)
}

async function readPost(slug: string, load: () => Promise<unknown>): Promise<PostFacts> {
  const mod = (await load()) as {
    metadata?: { robots?: unknown }
    default: (props: object) => unknown
  }
  const robots = mod.metadata?.robots
  const noindex =
    typeof robots === "string" ? /noindex/i.test(robots) : (robots as { index?: boolean } | undefined)?.index === false
  const tree = (await mod.default({})) as ReactElement<{
    meta?: {
      title: string
      description: string
      published: string
      category?: string
      takeaways?: readonly string[]
    }
    children?: ReactNode
  }>

  if (tree?.type === ArticleShell && tree.props.meta) {
    const meta = tree.props.meta
    const words =
      extractOutline(tree.props.children).wordCount + countWords((meta.takeaways ?? []).join(" "))
    return {
      slug,
      title: meta.title,
      description: meta.description,
      published: meta.published,
      category: meta.category ?? "Guides",
      readMinutes: readingTimeMinutes(words),
      noindex,
    }
  }

  const seo = findSeo(tree)
  if (!seo) throw new Error(`app/blog/${slug}/page.tsx has neither an ArticleShell nor an SEO block`)
  return {
    slug,
    title: seo.props.title ?? "",
    description: seo.props.description ?? "",
    published: seo.props.publishedTime ?? "",
    category: seo.props.section ?? "Guides",
    noindex,
  }
}

const facts = await Promise.all(
  Object.entries(pages).map(([path, load]) => readPost(path.split("/")[3]!, load)),
)
const factsBySlug = new Map(facts.map((f) => [f.slug, f]))
const registry = getBlogPosts()

describe("blog index registry", () => {
  it("lists every indexable post exactly once, and no noindex post", () => {
    const listed = registry.map((p) => p.slug)
    expect(new Set(listed).size, "duplicate slugs in lib/blog-posts.ts").toBe(listed.length)

    const missing = facts.filter((f) => !f.noindex && !listed.includes(f.slug)).map((f) => f.slug)
    expect(missing, `Add these posts to lib/blog-posts.ts: ${missing.join(", ")}`).toEqual([])

    const retired = registry.filter((p) => factsBySlug.get(p.slug)?.noindex).map((p) => p.slug)
    expect(retired, `Remove these noindex posts from lib/blog-posts.ts: ${retired.join(", ")}`).toEqual([])

    const orphans = listed.filter((slug) => !factsBySlug.has(slug))
    expect(orphans, `No app/blog/<slug>/page.tsx for: ${orphans.join(", ")}`).toEqual([])
  })

  it("matches each post's own title, description, date, category and read time", () => {
    const drift: string[] = []
    for (const entry of registry) {
      const page = factsBySlug.get(entry.slug)
      if (!page) continue
      const category = BLOG_INDEX_CATEGORY_ALIASES[page.category] ?? page.category
      if (entry.title !== page.title) drift.push(`${entry.slug}: title "${entry.title}" vs "${page.title}"`)
      if (entry.excerpt !== page.description) drift.push(`${entry.slug}: excerpt differs from the page description`)
      if (entry.published !== page.published) drift.push(`${entry.slug}: published ${entry.published} vs ${page.published}`)
      if (entry.category !== category) drift.push(`${entry.slug}: category ${entry.category} vs ${category}`)
      if (entry.readMinutes !== page.readMinutes) {
        drift.push(`${entry.slug}: readMinutes ${entry.readMinutes} vs byline ${page.readMinutes}`)
      }
    }
    expect(drift).toEqual([])
  })

  it("is sorted newest first", () => {
    const dates = registry.map((p) => p.published)
    expect(dates).toEqual([...dates].sort().reverse())
  })

  it("keeps the homepage cards' read times equal to the post bylines", () => {
    for (const card of homepageBlogPosts) {
      const slug = card.href.replace(/^\/blog\//, "")
      const minutes = factsBySlug.get(slug)?.readMinutes
      expect(minutes, `${slug} has no byline read time`).toBeDefined()
      expect(card.readTime, slug).toBe(`${minutes} min read`)
    }
  })
})
