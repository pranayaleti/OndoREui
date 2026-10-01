import type { Metadata } from "next"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SITE_BRAND_SHORT, SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import SEO from "@/components/seo"
import Link from "next/link"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"
import {
  COMPETITOR_FACTS_NOTE,
  ONDO_PRICING_FRAMING,
  TURBOTENANT_CATEGORIES,
  TURBOTENANT_QUICK_STATS,
} from "@/lib/vs-comparisons"

export const metadata: Metadata = {
  title: pageTitle(`${SITE_BRAND_SHORT} vs TurboTenant: Full-Service vs DIY Software`),
  description: `Ondo RE is full-service management; TurboTenant is software you run yourself. See how they compare on price, features, and tenant experience.`,
  alternates: {
    canonical: `${SITE_URL}/vs/turbotenant/`,
  },
  openGraph: {
    title: pageTitleText(`${SITE_BRAND_SHORT} vs TurboTenant: Full-Service vs DIY Software`),
    description: `Ondo RE is full-service management; TurboTenant is software you run yourself. See how they compare on price, features, and tenant experience.`,
    url: `${SITE_URL}/vs/turbotenant/`,
    type: "website",
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}

const ondoStrengths = [
  {
    title: "We run the rental for you",
    description:
      "TurboTenant is software you operate yourself. Ondo RE manages the rental for a percentage of collected rent, so rent collection, tenant calls and maintenance coordination are ours to handle.",
  },
  {
    title: "Tenant risk scoring",
    description:
      "Our risk engine flags at-risk tenants before late payments become evictions, alongside an AI assistant for portfolio summaries and maintenance triage.",
  },
  {
    title: "Full PWA with offline support",
    description:
      "Ondo RE is a full Progressive Web App. Property managers and tenants can access key features without a network connection, a useful advantage for on-site inspections and maintenance.",
  },
  {
    title: "Owner and tenant portals in one platform",
    description:
      "Owners see rent, maintenance and statements in one dashboard. Tenants pay rent and request repairs in the same system.",
  },
]

const turbotenantAdvantages = [
  "A free tier for landlords who run their own rentals",
  "Simpler onboarding for non-technical landlords",
]

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm font-medium text-foreground">{value}</span>
  }
  return value ? (
    <Check className="mx-auto h-5 w-5 text-green-600 dark:text-green-400" />
  ) : (
    <X className="mx-auto h-5 w-5 text-foreground/30" />
  )
}

export default function VsTurboTenantPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SEO
        title={`${SITE_BRAND_SHORT} vs TurboTenant: Full-Service vs DIY Software`}
        description={`Ondo RE is full-service management; TurboTenant is software you run yourself. See how they compare on price, features, and tenant experience.`}
        pathname="/vs/turbotenant/"
      />

      {/* Hero */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {SITE_BRAND_SHORT} vs TurboTenant
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
          TurboTenant is a solid free option for landlords who run their own rentals. If you would
          rather have the rental managed for you, here is how {SITE_BRAND_SHORT} compares.
        </p>
      </section>

      {/* Quick Stats */}
      <section className="mb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TURBOTENANT_QUICK_STATS.map((stat) => (
            <Card key={stat.label} className="border-foreground/10">
              <CardContent className="p-5 text-center">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-foreground/50">
                  {stat.label}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">{stat.ondo}</p>
                    <p className="text-xs text-foreground/50">{SITE_BRAND_SHORT}</p>
                  </div>
                  <span className="text-foreground/20">vs</span>
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground/40">{stat.competitor}</p>
                    <p className="text-xs text-foreground/50">TurboTenant</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <p className="mx-auto max-w-3xl text-center text-sm text-foreground/70">
          {ONDO_PRICING_FRAMING} <Link href="/pricing/" className="text-primary hover:underline">See Ondo&apos;s full pricing</Link>.
        </p>
      </section>

      {/* Feature Comparison Table */}
      <section className="mb-20 overflow-x-auto">
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-foreground">
          Feature-by-feature comparison
        </h2>
        <table className="w-full min-w-[500px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-foreground/10 px-4 py-3 text-left font-medium text-foreground/70">
                Feature
              </th>
              <th className="border-b border-foreground/10 bg-primary/5 px-4 py-3 text-center font-semibold text-primary dark:bg-primary/10">
                {SITE_BRAND_SHORT}
              </th>
              <th className="border-b border-foreground/10 px-4 py-3 text-center font-semibold text-foreground">
                TurboTenant
              </th>
            </tr>
          </thead>
          <tbody>
            {TURBOTENANT_CATEGORIES.map(({ category: cat, rows }) => {
              return (
                <>
                  <tr key={`cat-${cat}`}>
                    <td
                      colSpan={3}
                      className="border-b border-foreground/10 bg-foreground/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground/60 dark:bg-[var(--gradient-overlay)]"
                    >
                      {cat}
                    </td>
                  </tr>
                  {rows.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={
                        i % 2 === 0 ? "bg-transparent" : "bg-foreground/[0.02] dark:bg-[var(--gradient-overlay)]"
                      }
                    >
                      <td className="border-b border-foreground/5 px-4 py-3 font-medium text-foreground">
                        {row.feature}
                      </td>
                      <td className="border-b border-foreground/5 bg-primary/5 px-4 py-3 text-center dark:bg-primary/10">
                        <CellValue value={row.ondo} />
                      </td>
                      <td className="border-b border-foreground/5 px-4 py-3 text-center">
                        <CellValue value={row.competitor} />
                      </td>
                    </tr>
                  ))}
                </>
              )
            })}
          </tbody>
        </table>
        <p className="mt-4 text-center text-xs text-foreground/60">{COMPETITOR_FACTS_NOTE}</p>
      </section>

      {/* When Ondo is better */}
      <section className="mb-20">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground">
          When {SITE_BRAND_SHORT} is the better choice
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {ondoStrengths.map((s) => (
            <Card key={s.title} className="border-foreground/10">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm leading-relaxed text-foreground/70">{s.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* When TurboTenant might be better */}
      <section className="mb-20">
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-foreground">
          When TurboTenant might be the right fit
        </h2>
        <Card className="border-foreground/10">
          <CardContent className="p-6">
            <p className="mb-4 text-sm text-foreground/70">
              We believe in honest comparisons. TurboTenant makes sense if:
            </p>
            <ul className="space-y-3">
              {turbotenantAdvantages.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-foreground/40" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-foreground/60">
              If any of the above describes you today but you expect to grow, {SITE_BRAND_SHORT} is
              built to scale with you.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-primary/5 px-6 py-12 text-center dark:bg-[var(--gradient-overlay)]">
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Ready to try {SITE_BRAND_SHORT}?
        </h2>
        <p className="mb-6 text-foreground/70">
          See our pricing or book a call with our team.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild>
            <Link href="/pricing">See our pricing</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact/#book-a-call">Book a call</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
