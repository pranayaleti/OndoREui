import { describe, it, expect } from "vitest"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { render, screen } from "@testing-library/react"
import { HomepageBlogSection } from "./homepage-blog-section"
import { homepageBlogPosts } from "@/lib/homepage-blog-posts"
import { ALL_VALID_BLOG_SLUGS } from "@/lib/blog-slugs"

describe("HomepageBlogSection", () => {
  it("renders every curated post with a link to its blog page", () => {
    render(<HomepageBlogSection />)
    for (const post of homepageBlogPosts) {
      const heading = screen.getByRole("heading", { name: post.title, level: 3 })
      expect(heading).toBeInTheDocument()
      const link = heading.closest("a")
      expect(link?.getAttribute("href")).toMatch(new RegExp(`^${post.href}`))
    }
  })

  it("only features posts that exist: a built page on disk and a registered slug", () => {
    for (const post of homepageBlogPosts) {
      const slug = /^\/blog\/([^/?#]+)/.exec(post.href)?.[1]
      expect(slug, `${post.href} is not a /blog/<slug> link`).toBeDefined()
      expect(existsSync(join(__dirname, "..", "..", "app", "blog", slug!, "page.tsx")), post.href).toBe(true)
      expect(ALL_VALID_BLOG_SLUGS.has(slug!), post.href).toBe(true)
    }
  })

  it("includes a link to /blog", () => {
    render(<HomepageBlogSection />)
    const link = screen.getByRole("link", { name: /all articles/i })
    expect(link.getAttribute("href")).toMatch(/^\/blog/)
  })
})
