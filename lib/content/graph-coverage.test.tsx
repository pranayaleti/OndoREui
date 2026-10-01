/// <reference types="vite/client" />
import type { ReactElement } from "react"
import { describe, expect, it } from "vitest"
import { ArticleShell } from "@/components/content/article-shell"
import { getContentNodeByPath } from "./index"

/**
 * A post inside the content graph gets related links and a next step chosen for it; a post
 * outside it falls back to generic category links (see articleFallbackFor). New ArticleShell
 * posts must be added to the graph (lib/content/graph.ts).
 *
 * These existing posts predate that rule and have no node yet. This list can only shrink: add
 * the node, then delete the slug here. Do not add a slug to it.
 */
const NOT_IN_GRAPH_YET: ReadonlySet<string> = new Set([
  "backyard-upgrades-and-fertilizer-guide",
  "best-neighborhoods-draper-utah",
  "best-neighborhoods-invest-utah-real-estate",
  "best-neighborhoods-lehi-utah",
  "build-rental-portfolio-investor-2026",
  "cash-on-cash-return-explained",
  "collect-rent-with-crypto-guide",
  "commercial-real-estate-101-tenant-mix",
  "cost-of-living-draper-utah",
  "crypto-and-real-estate-hedge",
  "dashboards-for-landlords",
  "designing-property-owner-portal",
  "finishing-basement-roi",
  "first-time-landlord-checklist-utah",
  "full-stack-dev-landlord-gaps",
  "home-maintenance-schedule",
  "home-staging-tips-that-work",
  "how-ondo-re-uses-technology-property-management",
  "how-to-choose-property-management-company-utah",
  "maintenance-capex-strategy",
  "modernizing-notary-workflows-integration",
  "mortgage-paydown-hacks",
  "mortgage-rate-trends-2025",
  "new-landlord-mistakes-systems",
  "online-notary-for-lease-agreements",
  "property-management-automation-checklist",
  "property-management-calculators-which-one",
  "property-management-fees-utah",
  "property-management-guide-lehi-investors",
  "property-management-pwa-offline",
  "property-management-tips-utah-landlords",
  "provo-orem-rental-market-guide",
  "real-estate-agents-manage-own-rentals",
  "rent-vs-own-calculator-guide",
  "renting-vs-buying-salt-lake-city",
  "renting-vs-owning-hidden-math",
  "salt-lake-city-rental-market-report",
  "switch-from-turbotenant-migration-guide",
  "tenant-rights-checklist",
  "turbotenant-vs-buildium-vs-ondo",
  "types-of-basements",
  "ultimate-guide-becoming-utah-landlord-2026",
  "understanding-property-taxes-utah",
  "utah-county-conforming-loan-limit-lookup",
  "utah-landlord-tenant-law-guide",
  "utah-rent-vs-buy-wasatch-front",
  "utah-repc-deadlines",
  "vacancy-risk-playbook",
  "wasatch-front-real-estate-forecast-2026",
  "why-utah-best-real-estate-investment",
])

const pages = import.meta.glob("/app/blog/*/page.tsx")

async function usesArticleShell(load: () => Promise<unknown>): Promise<boolean> {
  const mod = (await load()) as { default: (props: object) => ReactElement | Promise<ReactElement> }
  const tree = await mod.default({})
  return tree?.type === ArticleShell
}

describe("content graph coverage of ArticleShell posts", () => {
  it("every ArticleShell post has a graph node unless it is on the shrinking allowlist", async () => {
    const missing: string[] = []
    let shellPosts = 0
    for (const [path, load] of Object.entries(pages)) {
      if (!(await usesArticleShell(load))) continue
      shellPosts += 1
      const slug = path.split("/")[3]!
      if (!getContentNodeByPath(`/blog/${slug}`) && !NOT_IN_GRAPH_YET.has(slug)) missing.push(slug)
    }
    expect(shellPosts).toBeGreaterThan(50)
    expect(missing, `Add a graph node in lib/content/graph.ts for: ${missing.join(", ")}`).toEqual([])
  })

  it("the allowlist names only posts that still exist", () => {
    const slugs = new Set(Object.keys(pages).map((path) => path.split("/")[3]))
    const gone = [...NOT_IN_GRAPH_YET].filter((slug) => !slugs.has(slug))
    expect(gone, `Remove from NOT_IN_GRAPH_YET: ${gone.join(", ")}`).toEqual([])
  })
})
