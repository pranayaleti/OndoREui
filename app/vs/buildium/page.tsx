import type { Metadata } from "next"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SITE_BRAND_SHORT, SITE_URL } from "@/lib/site"
import SEO from "@/components/seo"
import Link from "next/link"

export const metadata: Metadata = {
  title: `Ondo RE vs Buildium — The Better Buildium Alternative | ${SITE_BRAND_SHORT}`,
  description: `Looking for a Buildium alternative? See how Ondo RE compares to Buildium on price, features, AI tools, and tenant experience. No $62/mo entry fee.`,
  alternates: {
    canonical: `${SITE_URL}/vs/buildium/`,
  },
  openGraph: {
    title: `Ondo RE vs Buildium — The Better Buildium Alternative`,
    description: `Looking for a Buildium alternative? See how Ondo RE compares to Buildium on price, features, AI tools, and tenant experience.`,
    url: `${SITE_URL}/vs/buildium/`,
    type: "website",
  },
}

// ─── Types ───────────────────────────────────────────────────────────────────

type FeatureRow = {
  feature: string
  ondo: boolean | string
  buildium: boolean | string
}

type CategoryBlock = {
  category: string
  rows: FeatureRow[]
}

// ─── Data ────────────────────────────────────────────────────────────────────

const featureCategories: CategoryBlock[] = [
  {
    category: "Core Platform",
    rows: [
      { feature: "Owner portal", ondo: true, buildium: true },
      { feature: "Tenant portal", ondo: "Full portal", buildium: "Resident Center" },
      { feature: "PWA offline access", ondo: true, buildium: false },
      { feature: "White-label branding", ondo: false, buildium: true },
      { feature: "Starting price", ondo: "Contact us", buildium: "$62/mo" },
    ],
  },
  {
    category: "Payments & Accounting",
    rows: [
      { feature: "Rent collection", ondo: true, buildium: true },
      { feature: "Full GL accounting", ondo: "Basic", buildium: true },
      { feature: "Owner disbursements", ondo: true, buildium: true },
      { feature: "1099 generation", ondo: true, buildium: true },
      { feature: "Financial calculators", ondo: "10 built-in", buildium: false },
    ],
  },
  {
    category: "Screening & Leasing",
    rows: [
      { feature: "Tenant screening", ondo: true, buildium: true },
      { feature: "State lease templates", ondo: false, buildium: true },
      { feature: "E-signatures", ondo: true, buildium: "Dropbox Sign" },
      { feature: "Lease renewal", ondo: true, buildium: true },
    ],
  },
  {
    category: "Unique to Ondo RE",
    rows: [
      { feature: "RE agent tools", ondo: true, buildium: false },
      { feature: "Loan officer integration", ondo: true, buildium: false },
      { feature: "Notary services", ondo: true, buildium: false },
      { feature: "AI assistant", ondo: "10 tools", buildium: "2026 roadmap" },
      { feature: "Tenant risk scoring", ondo: true, buildium: false },
      { feature: "Tenant credit building", ondo: "4 bureaus", buildium: false },
    ],
  },
]

const quickStats = [
  { label: "Starting price", ondo: "Contact us", buildium: "$62/mo" },
  { label: "Financial calculators", ondo: "10", buildium: "0" },
  { label: "Phone support", ondo: "All tiers", buildium: "$192+/mo" },
  { label: "Offline access", ondo: "Full PWA", buildium: "None" },
]

const ondoBetterCards = [
  {
    title: "You don't want to pay $62/mo before you start",
    description:
      "Buildium's Essential plan starts at $62/mo with limited support. Ondo RE doesn't charge you before you've seen value.",
  },
  {
    title: "You're an investor who also buys and sells",
    description:
      "Buildium is PM-only. Ondo integrates brokerage, loan officer, and notary services so every deal moves faster under one roof.",
  },
  {
    title: "You care about your tenants' experience",
    description:
      "Ondo builds for both sides of the lease — tenants get credit building across 4 bureaus, a full portal, and offline PWA access.",
  },
  {
    title: "You need AI that's ready today",
    description:
      "Buildium's AI features are on their 2026 roadmap. Ondo's AI assistant with 10 live tools is available right now.",
  },
]

const buildiumBetterItems = [
  "You manage 50+ units and need full general ledger accounting with journal entries.",
  "You need white-label branding for your PM firm.",
  "You need state-specific lease templates across multiple states today.",
]

// ─── Sub-components ──────────────────────────────────────────────────────────

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

// ─── Page ────────────────────────────────────────────────────────────────────

export default function VsBuildiumPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SEO
        title="Ondo RE vs Buildium — The Better Buildium Alternative"
        description="Looking for a Buildium alternative? See how Ondo RE compares to Buildium on price, features, AI tools, and tenant experience."
        pathname="/vs/buildium/"
        keywords={["Buildium alternative", "Buildium vs Ondo", "property management software alternative", "Buildium competitor"]}
      />

      {/* Hero */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {SITE_BRAND_SHORT} vs Buildium
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
          A head-to-head comparison for property owners who want more than legacy PM software —
          better AI, integrated services, and no surprise entry fees.
        </p>
      </section>

      {/* Quick Stats */}
      <section className="mb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat) => (
            <Card key={stat.label} className="border-foreground/10">
              <CardContent className="p-5 text-center">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-foreground/50">
                  {stat.label}
                </p>
                <div className="flex items-center justify-around gap-2">
                  <div>
                    <p className="text-xs text-foreground/50 mb-1">{SITE_BRAND_SHORT}</p>
                    <p className="text-base font-semibold text-primary">{stat.ondo}</p>
                  </div>
                  <div className="h-8 w-px bg-foreground/10" />
                  <div>
                    <p className="text-xs text-foreground/50 mb-1">Buildium</p>
                    <p className="text-base font-semibold text-foreground/70">{stat.buildium}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="mb-20 overflow-x-auto">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground">
          Feature-by-feature comparison
        </h2>
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-foreground/10 px-4 py-3 text-left font-medium text-foreground/70">
                Feature
              </th>
              <th className="border-b border-foreground/10 bg-primary/5 px-4 py-3 text-center font-semibold text-primary dark:bg-primary/10">
                {SITE_BRAND_SHORT}
              </th>
              <th className="border-b border-foreground/10 px-4 py-3 text-center font-semibold text-foreground">
                Buildium
              </th>
            </tr>
          </thead>
          <tbody>
            {featureCategories.map((block) => (
              <>
                <tr key={`cat-${block.category}`}>
                  <td
                    colSpan={3}
                    className="bg-foreground/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground/50 dark:bg-[var(--gradient-overlay)]"
                  >
                    {block.category}
                  </td>
                </tr>
                {block.rows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={
                      i % 2 === 0
                        ? "bg-transparent"
                        : "bg-foreground/[0.02] dark:bg-[var(--gradient-overlay)]"
                    }
                  >
                    <td className="border-b border-foreground/5 px-4 py-3 font-medium text-foreground">
                      {row.feature}
                    </td>
                    <td className="border-b border-foreground/5 bg-primary/5 px-4 py-3 text-center dark:bg-primary/10">
                      <CellValue value={row.ondo} />
                    </td>
                    <td className="border-b border-foreground/5 px-4 py-3 text-center">
                      <CellValue value={row.buildium} />
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </section>

      {/* When Ondo is better */}
      <section className="mb-20">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground">
          When {SITE_BRAND_SHORT} is the better choice
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {ondoBetterCards.map((card) => (
            <Card key={card.title} className="border-foreground/10">
              <CardContent className="p-6">
                <div className="mb-3 flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                  <h3 className="text-base font-semibold text-foreground">{card.title}</h3>
                </div>
                <p className="pl-8 text-sm leading-relaxed text-foreground/70">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* When Buildium might be better */}
      <section className="mb-20 rounded-2xl border border-foreground/10 px-6 py-10">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
          When Buildium might be a better fit
        </h2>
        <p className="mb-4 text-sm text-foreground/60">
          We believe in honest comparisons. Buildium has strengths for certain use cases:
        </p>
        <ul className="space-y-3">
          {buildiumBetterItems.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-primary/5 px-6 py-12 text-center dark:bg-[var(--gradient-overlay)]">
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Ready to try the Buildium alternative?
        </h2>
        <p className="mb-6 text-foreground/70">
          See why Utah property owners are choosing {SITE_BRAND_SHORT} for better AI, integrated
          services, and a team that actually picks up the phone.
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
