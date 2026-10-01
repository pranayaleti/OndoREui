import { describe, it, expect } from "vitest"
import { createRequire } from "node:module"
import fs from "node:fs"
import path from "node:path"
import type { Metadata } from "next"
import { render, screen } from "@testing-library/react"
import { allNavigationItems } from "@/components/navigation"
import { metadata as historyMeta } from "@/app/about/history/page"
import { metadata as newsMeta } from "@/app/about/news/page"
import { metadata as givingBackMeta } from "@/app/about/giving-back/page"
import { metadata as investorMeta } from "@/app/about/investor-relations/page"
import CareersPage, { metadata as careersMeta } from "@/app/about/careers/page"
import SweepstakesPage, { metadata as sweepstakesMeta } from "@/app/sweepstakes/page"
import InvestorRelationsPage from "@/app/about/investor-relations/page"
import { metadata as strategyMeta } from "@/app/strategy/page"
import { metadata as brochureMeta } from "@/app/brochure/page"
import { FOUNDED_YEAR, PROPERTIES_MANAGED } from "@/lib/social-proof-stats"
import { UTAH_PM_COMPARISON } from "@/lib/utah-pm-comparison"

const ROOT = path.resolve(__dirname, "..")

function sourceFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...sourceFiles(rel))
    else if (/\.(ts|tsx)$/.test(entry.name) && !/\.test\.(ts|tsx)$/.test(entry.name)) out.push(rel)
  }
  return out
}

const files = ["app", "lib", "components"].flatMap(sourceFiles)

// Signed-in dashboard screens use obvious mock data (not public marketing copy).
const MOCK_DATA_DIRS = ["components/dashboard/", "components/owner/"]

function offenders(pattern: RegExp, { includeMockData = false } = {}): string[] {
  return files
    .filter((f) => includeMockData || !MOCK_DATA_DIRS.some((dir) => f.startsWith(dir)))
    .filter((f) => pattern.test(fs.readFileSync(path.join(ROOT, f), "utf8")))
}

describe("fabricated claims stay out of the source", () => {
  it("has no names from the removed fictional staff roster", () => {
    const names = [
      "Marcus Thompson",
      "Jennifer Nakamura",
      "Sarah Kim",
      "David Patel",
      "Sarah Johnson",
      "Michael Chen",
      "David Thompson",
      "Emily Rodriguez",
      "Jennifer Martinez",
      "Lisa Park",
      "Robert Wilson",
    ]
    expect(offenders(new RegExp(names.join("|")))).toEqual([])
  })

  it("has no 555 placeholder phone numbers", () => {
    expect(offenders(/tel:[^"'`]*555/)).toEqual([])
  })

  it("has no invented history, review counts or customer totals", () => {
    expect(offenders(/Serving Utah Since|1 Million\+|85,000\+ Customer Reviews|Past Winners/i)).toEqual([])
  })

  it("has no hard-coded properties-managed counts or founding years outside lib/social-proof-stats", () => {
    const hits = offenders(
      /\d[\d,]*\+?\s+properties\s+(under\s+management|managed)|founded\s+in\s+20\d\d|\(20\d\d\s+founded\)|years in business/i,
    )
    expect(hits).toEqual([])
  })

  it("uses the single founding-year and property-count constants", () => {
    expect(FOUNDED_YEAR).toBe(2022)
    expect(PROPERTIES_MANAGED).toBe(200)
    const ondo = UTAH_PM_COMPARISON.find((row) => row.isUs)
    expect(ondo?.cons).toContain(String(FOUNDED_YEAR))
    expect(ondo?.cons).not.toContain("2024")
  })
})

describe("pages with unverifiable content are retired", () => {
  const retired: Array<[string, Metadata]> = [
    ["/about/history", historyMeta],
    ["/about/news", newsMeta],
    ["/about/giving-back", givingBackMeta],
    ["/about/investor-relations", investorMeta],
    ["/about/careers", careersMeta],
    ["/sweepstakes", sweepstakesMeta],
    ["/strategy", strategyMeta],
    ["/brochure", brochureMeta],
  ]

  it.each(retired)("%s is noindex", (_path, meta) => {
    expect(meta.robots).toMatchObject({ index: false })
  })

  it("says no sweepstakes is running and shows no winners or entry form", () => {
    const { container } = render(<SweepstakesPage />)
    expect(screen.getByRole("heading", { level: 1, name: /No sweepstakes right now/i })).toBeInTheDocument()
    expect(container.textContent).toMatch(/not accepting entries/i)
    expect(container.textContent).not.toMatch(/winner|4\.9|reviews/i)
    expect(container.querySelector("form")).toBeNull()
  })

  it("replaces the investor relations financials with a pointer to /contact/", () => {
    const { container } = render(<InvestorRelationsPage />)
    expect(container.textContent).not.toMatch(/\d+%|Q4 2023|shareholder meeting|Annual Report/)
    expect(container.querySelector('a[href="/contact/"]')).not.toBeNull()
  })

  it("replaces the invented open roles and benefits on /about/careers", () => {
    const { container } = render(<CareersPage />)
    expect(container.textContent).not.toMatch(/401k|company vehicle|Apply Now|Leasing Specialist/i)
    expect(container.querySelector('a[href="/contact/"]')).not.toBeNull()
  })

  it("promises no sweepstakes or prize-draw entries in the affiliate and referral copy", () => {
    const locale = JSON.parse(fs.readFileSync(path.join(ROOT, "public/locales/en/common.json"), "utf8")) as {
      affiliate: Record<string, string>
      referral: Record<string, string>
    }
    const rendered = [
      ...Object.values(locale.affiliate),
      locale.referral.heroSubtitle,
      locale.referral.feedbackSectionDesc,
    ].join("\n")
    expect(rendered).not.toMatch(/sweepstake|prize/i)
  })

  it("keeps the sweepstakes out of the navigation", () => {
    const hrefs = allNavigationItems.flatMap((item) => [item.href, ...(item.children ?? []).map((c) => c.href)])
    expect(hrefs).not.toContain("/sweepstakes")
  })

  it("keeps the retired pages out of the sitemap", async () => {
    const requireCjs = createRequire(import.meta.url)
    const config = requireCjs("../next-sitemap.config.js") as {
      transform: (config: unknown, path: string) => Promise<unknown>
    }
    const ctx = { siteUrl: "https://www.ondorealestate.com" }
    for (const [pagePath] of retired) {
      expect(await config.transform(ctx, pagePath)).toBeNull()
      expect(await config.transform(ctx, `${pagePath}/`)).toBeNull()
    }
    expect(await config.transform(ctx, "/about/team")).not.toBeNull()
  })
})
