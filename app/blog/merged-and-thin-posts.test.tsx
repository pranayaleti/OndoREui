/// <reference types="vite/client" />
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import type { ReactElement } from "react"
import { ArticleShell } from "@/components/content/article-shell"
import { getBlogPosts } from "@/lib/blog-posts"
import { ALL_VALID_BLOG_SLUGS } from "@/lib/blog-slugs"

/** Duplicate posts folded into one kept post each (owner decision, P9). */
const MERGED: Record<string, string> = {
  "utah-repc-deadlines": "utah-repc-deadline-and-your-loan",
  "utah-county-conforming-loan-limit-lookup": "jumbo-vs-conforming-fhfa-county-limit",
  "rent-vs-own-calculator-guide": "renting-vs-buying-salt-lake-city",
  "utah-rent-vs-buy-wasatch-front": "renting-vs-buying-salt-lake-city",
  "renting-vs-owning-hidden-math": "renting-vs-buying-salt-lake-city",
}

const pages = import.meta.glob("/app/blog/*/page.tsx")
const read = (rel: string) => readFileSync(join(process.cwd(), rel), "utf8")

describe("duplicate posts folded into a stronger post", () => {
  it.each(Object.entries(MERGED))("%s is noindex,follow and canonical to %s", async (slug, kept) => {
    const mod = (await pages[`/app/blog/${slug}/page.tsx`]!()) as {
      metadata: { robots?: unknown; alternates?: { canonical?: string } }
      default: () => ReactElement
    }
    expect(mod.metadata.robots).toEqual({ index: false, follow: true })
    expect(mod.metadata.alternates?.canonical).toBe(`https://www.ondorealestate.com/blog/${kept}/`)
    render(<>{mod.default()}</>)
    expect(screen.getAllByRole("link").some((a) => a.getAttribute("href") === `/blog/${kept}/`)).toBe(true)
  })

  it("keeps each kept post on the blog index and the retired ones off it", () => {
    const listed = new Set(getBlogPosts().map((p) => p.slug))
    for (const kept of new Set(Object.values(MERGED))) {
      expect(ALL_VALID_BLOG_SLUGS.has(kept), kept).toBe(true)
      expect(listed.has(kept), `${kept} must be on the blog index`).toBe(true)
    }
    for (const slug of Object.keys(MERGED)) {
      expect(listed.has(slug), `${slug} is retired and must not be on the blog index`).toBe(false)
    }
  })

  it("keeps the retired posts out of the XML sitemap", () => {
    const config = read("next-sitemap.config.js")
    for (const slug of Object.keys(MERGED)) expect(config, slug).toContain(`'/blog/${slug}'`)
  })

  it("no page or index still links to a retired post except the retired post itself", () => {
    const files = [
      "app/loans/jumbo/page.tsx",
      "app/refinance/blog/page.tsx",
      "app/resources/page.tsx",
      "app/blog/appraisal-comes-in-low/page.tsx",
      "app/blog/home-inspection-vs-appraisal/page.tsx",
      "app/blog/va-entitlement-second-va-loan/page.tsx",
      "app/blog/jumbo-vs-conforming-fhfa-county-limit/page.tsx",
      "lib/site-index.ts",
      "lib/search-index.ts",
      "lib/content/glossary.ts",
      "lib/content/graph.ts",
    ]
    for (const file of files) {
      const text = read(file)
      for (const slug of Object.keys(MERGED)) expect(text, `${file} links ${slug}`).not.toContain(`/blog/${slug}`)
    }
  })
})

describe("thin landlord posts", () => {
  const POSTS = [
    "maintenance-capex-strategy",
    "new-landlord-mistakes-systems",
    "vacancy-risk-playbook",
    "property-management-automation-checklist",
    "utah-rent-vs-buy-wasatch-front",
    "renting-vs-owning-hidden-math",
  ]

  it.each(POSTS)("%s has no developer section and no first-person developer voice", (slug) => {
    const text = read(`app/blog/${slug}/page.tsx`)
    expect(text).not.toMatch(/Developer.s (Angle|Toolkit|Build Notes)/)
    expect(text).not.toMatch(/full-stack developer|built by a dev|developer-landlord|mistakes I see|how I frame|\bI model\b/i)
  })
})

describe("blog posts do not send readers to a gated page", () => {
  it("links nothing under /platform", () => {
    const offenders = Object.keys(pages).filter((path) =>
      /href=["']\/platform/.test(read(path.replace(/^\//, ""))),
    )
    expect(offenders).toEqual([])
  })

  it("the PWA post points at property management, not the platform demo", () => {
    const text = read("app/blog/property-management-pwa-offline/page.tsx")
    expect(text).toContain('href="/property-management/"')
    expect(text).not.toContain("/demo")
  })
})

describe("every ArticleShell post ends with related links and a next step", () => {
  it("renders 'Keep going' and 'What to do next' on every ArticleShell post", async () => {
    const missing: string[] = []
    let shellPosts = 0
    for (const [path, load] of Object.entries(pages)) {
      const mod = (await load()) as { default: (props: object) => ReactElement }
      const tree = (await mod.default({})) as ReactElement
      if (tree.type !== ArticleShell) continue
      shellPosts += 1
      const { unmount } = render(tree)
      const keepGoing = screen.queryByRole("heading", { name: "Keep going" })
      const nextStep = screen.queryByRole("heading", { name: "What to do next" })
      if (!keepGoing || !nextStep) missing.push(path.split("/")[3]!)
      unmount()
    }
    expect(shellPosts).toBeGreaterThan(50)
    expect(missing).toEqual([])
  })
})

describe("placeholder.jpg", () => {
  it("is no longer used as a hero, og:image or schema image", () => {
    for (const file of [
      "app/about/page.tsx",
      "app/blog/understanding-property-taxes-utah/page.tsx",
      "lib/blog-posts.ts",
      "lib/seo-utils.ts",
    ]) {
      expect(read(file), file).not.toContain("placeholder.jpg")
    }
  })
})
