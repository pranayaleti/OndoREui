import type { ComponentType } from "react"
import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { notFound } from "next/navigation"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateWebApplicationJsonLd } from "@/lib/seo"
import { SITE_NAME, SITE_URL } from "@/lib/site"
import Loading from "@/components/loading"
import { CALCULATOR_CATALOG } from "@/lib/calculator-catalog"
import { CalculatorAgentIntro } from "@/components/calculators/calculator-agent-intro"
import { RelatedContent } from "@/components/content/related-content"
import { CalculatorInputExplainer } from "@/components/content/calculator-input-explainer"
import { BreakEvenTable } from "@/components/content/break-even-table"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

const slugToComponent: Record<string, ComponentType> = {
  "owner-vs-self": dynamic(() => import("@/pages/calculators/owner-vs-self-calculator"), {
    loading: () => <Loading />
  }),
  "mortgage-payment": dynamic(() => import("@/pages/calculators/mortgage-payment-calculator"), {
    loading: () => <Loading />
  }),
  "affordability": dynamic(() => import("@/pages/calculators/affordability-calculator"), {
    loading: () => <Loading />
  }),
  "income": dynamic(() => import("@/pages/calculators/income-calculator"), {
    loading: () => <Loading />
  }),
  "closing-cost": dynamic(() => import("@/pages/calculators/closing-cost-calculator"), {
    loading: () => <Loading />
  }),
  "refinance": dynamic(() => import("@/pages/calculators/refinance-calculator"), {
    loading: () => <Loading />
  }),
  "home-sale": dynamic(() => import("@/pages/calculators/home-sale-calculator"), {
    loading: () => <Loading />
  }),
  "buying-power": dynamic(() => import("@/pages/calculators/buying-power-calculator"), {
    loading: () => <Loading />
  }),
  "temporary-buydown": dynamic(() => import("@/pages/calculators/temporary-buydown-calculator"), {
    loading: () => <Loading />
  }),
  "rent-vs-own": dynamic(() => import("@/pages/calculators/rent-vs-own-calculator"), {
    loading: () => <Loading />
  }),
  "retirement": dynamic(() => import("@/pages/calculators/retirement-calculator"), {
    loading: () => <Loading />
  }),
  "cash-on-cash": dynamic(() => import("@/pages/calculators/cash-on-cash-calculator"), {
    loading: () => <Loading />
  }),
  "cap-rate": dynamic(() => import("@/pages/calculators/cap-rate-calculator"), {
    loading: () => <Loading />
  }),
  "roi": dynamic(() => import("@/pages/calculators/roi-calculator"), {
    loading: () => <Loading />
  }),
  "cagr": dynamic(() => import("@/pages/calculators/cagr-calculator"), {
    loading: () => <Loading />
  }),
  "grm": dynamic(() => import("@/pages/calculators/grm-calculator"), {
    loading: () => <Loading />
  }),
  "dscr": dynamic(() => import("@/pages/calculators/dscr-calculator"), {
    loading: () => <Loading />
  }),
  "one-percent-rule": dynamic(() => import("@/pages/calculators/one-percent-rule-calculator"), {
    loading: () => <Loading />
  }),
  "fifty-percent-rule": dynamic(() => import("@/pages/calculators/fifty-percent-rule-calculator"), {
    loading: () => <Loading />
  }),
  "cost-of-living": dynamic(() => import("@/pages/calculators/cost-of-living-calculator"), {
    loading: () => <Loading />
  }),
}

// Generate static params for all calculator slugs at build time
export async function generateStaticParams() {
  return Object.keys(slugToComponent).map((slug) => ({ slug }))
}

/**
 * Per-slug metadata so each calculator page advertises its Markdown twin via
 * `<link rel="alternate" type="text/markdown">`. Cloudflare Markdown for Agents
 * will also convert the HTML shell, but the first-party `.md` at
 * `/calculators/{slug}.md` carries the formula + worked example that the
 * client-only widget would otherwise hide.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const detail = CALCULATOR_CATALOG[slug]
  if (!detail) return {}
  const canonical = `${SITE_URL}/calculators/${slug}/`
  return {
    title: `${detail.name}`,
    description: detail.description,
    alternates: {
      canonical,
      types: { "text/markdown": `${SITE_URL}/calculators/${slug}.md` },
    },
    openGraph: {
      title: `${detail.name} | ${SITE_NAME}`,
      description: detail.description,
      url: canonical,
      images: DEFAULT_OG_IMAGES,
    },
    twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
  }
}

export default async function CalculatorBySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const Component = slugToComponent[slug]
  if (!Component) return notFound()
  const prettyTitle = slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ")
  const detail =
    CALCULATOR_CATALOG[slug] || {
      name: `${prettyTitle} Calculator`,
      description: `Use our ${prettyTitle.toLowerCase()} calculator to plan your Utah real estate decisions.`,
      applicationCategory: "FinancialApplication",
    }
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Calculators", url: `${SITE_URL}/calculators` },
    { name: prettyTitle, url: `${SITE_URL}/calculators/${slug}` },
  ])
  const webAppJsonLd = generateWebApplicationJsonLd({
    name: detail.name,
    description: detail.description,
    url: `${SITE_URL}/calculators/${slug}`,
    applicationCategory: detail.applicationCategory || "FinancialApplication",
    providerName: SITE_NAME,
  })
  const structuredData = [breadcrumbJsonLd, webAppJsonLd].filter(Boolean)
  return (
    <main className="min-h-screen">
      <SEO
        title={`${prettyTitle} Calculator`}
        description={`Use our ${prettyTitle.toLowerCase()} calculator to plan your Utah real estate decisions.`}
        pathname={`/calculators/${slug}`}
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={structuredData}
      />
      {/* Server-rendered so AI agents and no-JS clients see the formula and worked
          example before the interactive widget hydrates. Progressive enhancement:
          the client `<Component />` below re-computes with user input. */}
      <CalculatorAgentIntro slug={slug} />
      <div className="container mx-auto max-w-3xl px-4">
        <CalculatorInputExplainer slug={slug} />
        {slug === "refinance" ? <BreakEvenTable table="stay-scenarios" /> : null}
      </div>
      <Component />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <RelatedContent path={`/calculators/${slug}`} title="Related education" />
      </div>
    </main>
  )
}


