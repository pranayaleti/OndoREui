#!/usr/bin/env tsx
/**
 * After `next build` (static export) and the legacy redirect stubs, write:
 *  - out/feed.xml and out/rss.xml: RSS 2.0 feed of the blog (lib/blog-feed.ts). Feed readers
 *    and crawlers probe both paths; both 404ed before.
 *  - out/page-index.json: path and title of every indexable page, fetched by the 404 page's
 *    "Did you mean" suggestions (lib/page-suggestions.ts).
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join, relative, resolve, sep } from "node:path"
import { buildRssFeed, extractFeedPost, type FeedPost } from "../lib/blog-feed"
import { extractPageIndexEntry, type PageIndexEntry } from "../lib/page-suggestions"
import { SITE_NAME, SITE_URL } from "../lib/site"

// OUT_DIR overrides the export location, like scripts/generate-legacy-redirects.mjs.
const OUT_DIR = process.env["OUT_DIR"] ? resolve(process.env["OUT_DIR"]) : join(process.cwd(), "out")
const FEED_FILES = ["feed.xml", "rss.xml"] as const

function walkPages(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "_next") continue
    const abs = join(dir, entry.name)
    if (entry.isDirectory()) walkPages(abs, acc)
    else if (entry.name === "index.html") acc.push(abs)
  }
  return acc
}

function main() {
  if (!existsSync(OUT_DIR)) {
    console.error("discovery-files: out/ not found, run after next build")
    process.exit(1)
  }
  const site = SITE_URL.replace(/\/+$/, "")
  const posts: FeedPost[] = []
  const index: PageIndexEntry[] = []

  for (const file of walkPages(OUT_DIR)) {
    const rel = relative(OUT_DIR, file).split(sep).join("/")
    const path = rel === "index.html" ? "/" : `/${rel.slice(0, -"index.html".length)}`
    if (path === "/404/") continue
    const html = readFileSync(file, "utf8")
    const entry = extractPageIndexEntry(html, path)
    if (entry) index.push(entry)
    if (path.startsWith("/blog/") && path !== "/blog/") {
      const post = extractFeedPost(html)
      if (post) posts.push(post)
    }
  }

  index.sort((a, b) => a.p.localeCompare(b.p))
  writeFileSync(join(OUT_DIR, "page-index.json"), JSON.stringify(index))

  for (const name of FEED_FILES) {
    const xml = buildRssFeed(posts, {
      title: `${SITE_NAME} Blog`,
      description: "Guides on Utah property management, mortgages, buying, selling, and notary from the Ondo Real Estate team.",
      siteUrl: `${site}/blog/`,
      feedUrl: `${site}/${name}`,
    })
    writeFileSync(join(OUT_DIR, name), xml)
  }

  console.log(`discovery-files: ${posts.length} posts in ${FEED_FILES.join(" and ")}, ${index.length} pages in page-index.json`)
}

main()
