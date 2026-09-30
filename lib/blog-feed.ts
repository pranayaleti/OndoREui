/**
 * RSS 2.0 feed for the blog, built after the export from the published post pages
 * (scripts/generate-discovery-files.ts). Reading the exported HTML keeps the feed identical
 * to what visitors and search engines see, with no second list of titles and dates to sync.
 */
export type FeedPost = {
  url: string
  title: string
  description: string
  published: string
  modified?: string
}

export type FeedChannel = {
  title: string
  description: string
  siteUrl: string
  feedUrl: string
  limit?: number
}

const JSON_LD = /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi

function decodeEntities(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
}

const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined)

/** Feed entry for an exported post page, or null when the page is not a published post. */
export function extractFeedPost(html: string): FeedPost | null {
  if (/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) return null
  const canonical = /<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i.exec(html)?.[1]
  if (!canonical) return null
  for (const match of html.matchAll(JSON_LD)) {
    let data: unknown
    try {
      data = JSON.parse(match[1]!)
    } catch {
      continue
    }
    for (const entry of Array.isArray(data) ? data : [data]) {
      if (!entry || typeof entry !== "object") continue
      const record = entry as Record<string, unknown>
      if (record["@type"] !== "BlogPosting" && record["@type"] !== "Article") continue
      const title = text(record["headline"])
      const published = text(record["datePublished"])
      if (!title || !published || Number.isNaN(Date.parse(published))) return null
      return {
        url: decodeEntities(canonical),
        title,
        description: text(record["description"]) ?? "",
        published,
        modified: text(record["dateModified"]),
      }
    }
  }
  return null
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

const rfc822 = (date: string) => new Date(Date.parse(date)).toUTCString()

/** Newest posts first. lastBuildDate comes from the posts, so rebuilding unchanged content changes nothing. */
export function buildRssFeed(posts: readonly FeedPost[], channel: FeedChannel): string {
  const items = [...posts]
    .sort((a, b) => Date.parse(b.published) - Date.parse(a.published) || a.url.localeCompare(b.url))
    .slice(0, channel.limit ?? 50)
  const newest = items.reduce<number | null>((latest, post) => {
    const time = Date.parse(post.modified ?? post.published)
    return Number.isNaN(time) ? latest : Math.max(latest ?? time, time)
  }, null)

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${escapeXml(channel.title)}</title>`,
    `<link>${escapeXml(channel.siteUrl)}</link>`,
    `<description>${escapeXml(channel.description)}</description>`,
    "<language>en-us</language>",
    `<atom:link href="${escapeXml(channel.feedUrl)}" rel="self" type="application/rss+xml"/>`,
    ...(newest === null ? [] : [`<lastBuildDate>${new Date(newest).toUTCString()}</lastBuildDate>`]),
    ...items.map((post) =>
      [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${escapeXml(post.url)}</link>`,
        `<guid isPermaLink="true">${escapeXml(post.url)}</guid>`,
        `<pubDate>${rfc822(post.published)}</pubDate>`,
        ...(post.description ? [`<description>${escapeXml(post.description)}</description>`] : []),
        "</item>",
      ].join(""),
    ),
    "</channel>",
    "</rss>",
  ]
  return `${lines.join("\n")}\n`
}
