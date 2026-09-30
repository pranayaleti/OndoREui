import { describe, it, expect } from "vitest"
import { buildRssFeed, extractFeedPost, type FeedPost } from "@/lib/blog-feed"

const postHtml = (jsonLd: object, extraHead = "") =>
  `<html><head>${extraHead}<link rel="canonical" href="https://www.ondorealestate.com/blog/utah-property-taxes/"/>` +
  `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script></head></html>`

const channel = {
  title: "Ondo Real Estate Blog",
  description: "Utah guides",
  siteUrl: "https://www.ondorealestate.com/blog/",
  feedUrl: "https://www.ondorealestate.com/feed.xml",
}

describe("extractFeedPost", () => {
  it("reads the post from its BlogPosting data and canonical URL", () => {
    const html = postHtml([
      { "@type": "WebPage", name: "ignored" },
      { "@type": "BlogPosting", headline: "Utah Property Taxes", description: "How they work", datePublished: "2026-08-29", dateModified: "2026-09-01" },
    ])
    expect(extractFeedPost(html)).toEqual({
      url: "https://www.ondorealestate.com/blog/utah-property-taxes/",
      title: "Utah Property Taxes",
      description: "How they work",
      published: "2026-08-29",
      modified: "2026-09-01",
    })
  })

  it("skips noindex pages and pages that are not dated posts", () => {
    const post = { "@type": "BlogPosting", headline: "Draft", datePublished: "2026-08-29" }
    expect(extractFeedPost(postHtml(post, '<meta name="robots" content="noindex, follow"/>'))).toBeNull()
    expect(extractFeedPost(postHtml({ "@type": "WebPage", name: "Blog" }))).toBeNull()
    expect(extractFeedPost(postHtml({ "@type": "BlogPosting", headline: "No date" }))).toBeNull()
  })
})

describe("buildRssFeed", () => {
  const posts: FeedPost[] = [
    { url: "https://www.ondorealestate.com/blog/older/", title: "Older", description: "", published: "2026-01-05" },
    { url: "https://www.ondorealestate.com/blog/newer/", title: "Taxes & Fees <2026>", description: "Rates \"explained\"", published: "2026-08-29", modified: "2026-09-02" },
  ]

  it("lists newest first with escaped text and RFC 822 dates", () => {
    const xml = buildRssFeed(posts, channel)
    expect(xml.indexOf("/blog/newer/")).toBeLessThan(xml.indexOf("/blog/older/"))
    expect(xml).toContain("<title>Taxes &amp; Fees &lt;2026&gt;</title>")
    expect(xml).toContain("<description>Rates &quot;explained&quot;</description>")
    expect(xml).toContain("<pubDate>Sat, 29 Aug 2026 00:00:00 GMT</pubDate>")
    expect(xml).toContain('<atom:link href="https://www.ondorealestate.com/feed.xml" rel="self" type="application/rss+xml"/>')
  })

  it("dates the feed by its newest change, so an unchanged rebuild is byte-identical", () => {
    const xml = buildRssFeed(posts, channel)
    expect(xml).toContain("<lastBuildDate>Wed, 02 Sep 2026 00:00:00 GMT</lastBuildDate>")
    expect(buildRssFeed(posts, channel)).toBe(xml)
  })

  it("caps the number of items", () => {
    expect(buildRssFeed(posts, { ...channel, limit: 1 }).match(/<item>/g)).toHaveLength(1)
  })
})
