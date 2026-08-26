import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { HomepageBlogSection } from "./homepage-blog-section"
import { homepageBlogPosts } from "@/lib/homepage-blog-posts"

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

  it("includes a link to /blog", () => {
    render(<HomepageBlogSection />)
    const link = screen.getByRole("link", { name: /all articles/i })
    expect(link.getAttribute("href")).toMatch(/^\/blog/)
  })
})
