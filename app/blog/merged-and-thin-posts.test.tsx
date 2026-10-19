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
  // Oct 2026 blog consolidation.
  "can-i-get-a-mortgage-if-my-income-changes-every-month": "how-underwriters-verify-income",
  "1099-mortgage-documentation-checklist": "how-underwriters-verify-income",
  "just-went-1099-last-month": "how-underwriters-verify-income",
  "two-years-of-tax-returns-vs-one-year-mortgage": "how-underwriters-verify-income",
  "w2-overtime-likely-to-continue": "how-underwriters-verify-income",
  "commission-income-mortgage-averaging": "how-underwriters-verify-income",
  "gig-plus-w2-income-mortgage-average": "how-underwriters-verify-income",
  "spouse-w2-offset-1099-volatility": "how-underwriters-verify-income",
  "k-1-income-what-usually-counts": "how-underwriters-verify-income",
  "schedule-e-rental-income-purchase-file": "how-underwriters-verify-income",
  "depreciation-add-back-schedule-e": "how-underwriters-verify-income",
  "cpa-letter-vs-tax-returns-underwriting": "how-underwriters-verify-income",
  "business-vs-personal-bank-co-mingling": "how-underwriters-verify-income",
  "bank-statement-loans-when-tax-returns-undercount-income": "how-underwriters-verify-income",
  "relocating-to-utah-job-seasoning": "how-underwriters-verify-income",
  "asset-depletion-qualifying-non-qm": "how-underwriters-verify-income",
  "va-funding-fee-finance-vs-pay-cash": "va-loan-assumption-entitlement",
  "va-entitlement-second-va-loan": "va-loan-assumption-entitlement",
  "va-residual-income-vs-dti": "va-loan-assumption-entitlement",
  "hill-afb-va-coe-occupancy": "va-loan-assumption-entitlement",
  "selling-with-va-loan-entitlement-restoration": "va-loan-assumption-entitlement",
  "usda-vs-va-vs-fha-veteran-rural": "va-loan-assumption-entitlement",
  "how-fha-loan-assumption-works": "fha-vs-conventional-loans-utah",
  "fha-condo-roster-project-approval": "fha-vs-conventional-loans-utah",
  "house-hacking-duplex-with-fha": "fha-vs-conventional-loans-utah",
  "dpa-stacked-with-fha-gift-funds": "fha-vs-conventional-loans-utah",
  "usda-map-income-limit-eligibility": "fha-vs-conventional-loans-utah",
  "no-closing-cost-refinance-rate-credit-tradeoff": "refinance-break-even-when-lower-rate-loses",
  "discount-points-breakeven-without-sales-pitch": "refinance-break-even-when-lower-rate-loses",
  "recast-vs-refinance": "refinance-break-even-when-lower-rate-loses",
  "biweekly-extra-principal-vs-refinance": "refinance-break-even-when-lower-rate-loses",
  "mortgage-paydown-hacks": "refinance-break-even-when-lower-rate-loses",
  "fha-va-streamline-refinance-less-docs": "refinance-break-even-when-lower-rate-loses",
  "heloc-after-year-two-vs-cash-out": "heloc-vs-cash-out-refinance",
  "cash-out-to-buy-a-rental": "heloc-vs-cash-out-refinance",
  "cross-collateral-equity-to-buy-another-house": "heloc-vs-cash-out-refinance",
  "delayed-financing-after-cash-purchase": "heloc-vs-cash-out-refinance",
  "escrow-cushion-how-it-is-set": "escrow-shortage-after-first-year",
  "impounds-vs-waiving-escrow": "escrow-shortage-after-first-year",
  "utah-property-tax-calendar-first-escrow-analysis": "escrow-shortage-after-first-year",
  "understanding-property-taxes-utah": "escrow-shortage-after-first-year",
  "rate-lock-extension-vs-floating": "rate-lock-if-rates-drop",
  "mortgage-rate-trends-2025": "rate-lock-if-rates-drop",
  "apr-vs-rate-on-a-loan-estimate": "rate-lock-if-rates-drop",
  "temporary-buydown-who-pays-year-three": "rate-lock-if-rates-drop",
  "arm-caps-in-plain-english": "rate-lock-if-rates-drop",
  "mip-vs-pmi-how-mortgage-insurance-ends": "should-i-wait-for-20-percent-down",
  "pmi-removal-original-value-vs-new-appraisal": "should-i-wait-for-20-percent-down",
  "gift-funds-down-payment-rules": "should-i-wait-for-20-percent-down",
  "parent-gifting-down-payment-who-signs": "should-i-wait-for-20-percent-down",
  "large-deposits-60-day-paper-trail": "should-i-wait-for-20-percent-down",
  "mortgage-reserves-months-of-pitia": "should-i-wait-for-20-percent-down",
  "utah-cash-to-close-besides-down-payment": "utah-closing-costs-title-origination-prepaids",
  "earnest-money-vs-down-payment-vs-closing-costs": "utah-closing-costs-title-origination-prepaids",
  "title-insurance-owner-vs-lender": "utah-closing-costs-title-origination-prepaids",
  "closing-credit-card-before-mortgage": "credit-before-mortgage-rapid-rescore",
  "authorized-user-tradelines-mortgage": "credit-before-mortgage-rapid-rescore",
  "medical-collections-after-fico-model-change": "credit-before-mortgage-rapid-rescore",
  "no-traditional-credit-alternative-credit": "credit-before-mortgage-rapid-rescore",
  "what-a-tri-merge-credit-report-shows": "credit-before-mortgage-rapid-rescore",
  "new-auto-loan-during-underwriting": "credit-before-mortgage-rapid-rescore",
  "student-loans-dti-idr-save": "credit-before-mortgage-rapid-rescore",
  "declined-after-pre-approval": "pre-approval-vs-aus-vs-clear-to-close",
  "compensating-factors-in-aus-findings": "pre-approval-vs-aus-vs-clear-to-close",
  "what-a-mortgage-conversation-asks": "pre-approval-vs-aus-vs-clear-to-close",
  "first-time-buyer-file-mistakes": "pre-approval-vs-aus-vs-clear-to-close",
  "refinancing-condo-aging-hoa": "townhome-vs-condo-hoa-docs-lenders-ask",
  "hazard-vs-ho3-vs-ho6-condo-insurance": "townhome-vs-condo-hoa-docs-lenders-ask",
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
      // Retired posts keep their graph node (tagged mergedInto) so related links resolve to the keeper;
      // the node's own path declaration is not a link.
      const text = read(file).replace(/^\s*path: "\/blog\/[^"]+",$/gm, "")
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
  }, 180_000)
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
