import type { Metadata } from "next"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SITE_BRAND_SHORT, SITE_URL } from "@/lib/site"
import SEO from "@/components/seo"
import Link from "next/link"

export const metadata: Metadata = {
  title: `${SITE_BRAND_SHORT} vs TurboTenant — The Best TurboTenant Alternative`,
  description: `Compare ${SITE_BRAND_SHORT} and TurboTenant side by side. See why property owners choose Ondo RE for AI risk scoring, 10 financial calculators, 6 auth roles, full PWA, and a complete owner-to-tenant platform.`,
  alternates: {
    canonical: `${SITE_URL}/vs/turbotenant/`,
  },
  openGraph: {
    title: `${SITE_BRAND_SHORT} vs TurboTenant — The Best TurboTenant Alternative`,
    description: `Compare ${SITE_BRAND_SHORT} and TurboTenant side by side. AI-powered risk scoring, 10 calculators, full PWA offline support, and 6 auth roles vs TurboTenant's basic free tier.`,
    url: `${SITE_URL}/vs/turbotenant/`,
    type: "website",
  },
}

type FeatureRow = {
  feature: string
  category: string
  ondo: boolean | string
  turbotenant: boolean | string
}

const features: FeatureRow[] = [
  // Core Platform
  { category: "Core Platform", feature: "Owner portal", ondo: true, turbotenant: true },
  { category: "Core Platform", feature: "Tenant portal", ondo: true, turbotenant: "Basic" },
  { category: "Core Platform", feature: "PWA offline support", ondo: true, turbotenant: false },
  { category: "Core Platform", feature: "Multi-role auth", ondo: "6 roles", turbotenant: "2 roles" },
  // Payments
  { category: "Payments", feature: "Rent collection", ondo: true, turbotenant: true },
  { category: "Payments", feature: "Late fee automation", ondo: true, turbotenant: true },
  { category: "Payments", feature: "Owner disbursements", ondo: true, turbotenant: false },
  { category: "Payments", feature: "Mortgage calculators", ondo: "10 built-in", turbotenant: false },
  { category: "Payments", feature: "Crypto payments", ondo: "Planned", turbotenant: false },
  // Screening & Leasing
  { category: "Screening & Leasing", feature: "Tenant screening", ondo: true, turbotenant: true },
  { category: "Screening & Leasing", feature: "E-signatures", ondo: true, turbotenant: "$59/lease" },
  { category: "Screening & Leasing", feature: "Credit building", ondo: "4 bureaus", turbotenant: true },
  { category: "Screening & Leasing", feature: "Lease renewal", ondo: true, turbotenant: "Partial" },
  // Unique to Ondo
  { category: "Unique to Ondo", feature: "RE agent tools", ondo: true, turbotenant: false },
  { category: "Unique to Ondo", feature: "Loan officer tools", ondo: true, turbotenant: false },
  { category: "Unique to Ondo", feature: "Notary services", ondo: true, turbotenant: false },
  { category: "Unique to Ondo", feature: "AI assistant", ondo: "10 tools", turbotenant: "Lease + listings" },
  { category: "Unique to Ondo", feature: "Risk scoring ML", ondo: true, turbotenant: false },
  { category: "Unique to Ondo", feature: "Vendor management", ondo: true, turbotenant: "Basic" },
]

const categories = ["Core Platform", "Payments", "Screening & Leasing", "Unique to Ondo"]

const quickStats = [
  { metric: "Financial calculators", ondo: "10", turbotenant: "0" },
  { metric: "Auth roles", ondo: "6", turbotenant: "2" },
  { metric: "AI tools", ondo: "10", turbotenant: "2" },
  { metric: "Offline support", ondo: "Full PWA", turbotenant: "None" },
]

const ondoStrengths = [
  {
    title: "10 built-in financial calculators",
    description:
      "Mortgage, amortization, ROI, cap rate, cash-on-cash, and more — all built in. TurboTenant offers none. Ondo RE gives owners and agents the numbers they need to make smart investment decisions.",
  },
  {
    title: "AI-powered tenant risk scoring",
    description:
      "Our ML risk engine flags at-risk tenants before late payments become evictions. The AI assistant supports 10 distinct tools including portfolio summaries, maintenance triage, and proactive intervention suggestions.",
  },
  {
    title: "Full PWA with offline support",
    description:
      "Ondo RE is a full Progressive Web App. Property managers and tenants can access key features without a network connection — a critical advantage for on-site inspections and maintenance.",
  },
  {
    title: "One platform for every role",
    description:
      "Manager, owner, tenant, maintenance, agent, loan officer — all six roles have tailored dashboards and permissions. TurboTenant treats landlords and tenants as two roles, nothing more.",
  },
]

const turbotenantAdvantages = [
  "Free tier for landlords with a small portfolio (under 1–2 units)",
  "State-specific lease templates included at no extra cost",
  "Simpler onboarding for non-technical landlords",
  "Native iOS and Android apps available today",
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
        title={`${SITE_BRAND_SHORT} vs TurboTenant — The Best TurboTenant Alternative`}
        description={`Compare ${SITE_BRAND_SHORT} and TurboTenant side by side. AI risk scoring, 10 calculators, full PWA, and 6 auth roles.`}
        pathname="/vs/turbotenant/"
      />

      {/* Hero */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {SITE_BRAND_SHORT} vs TurboTenant
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
          TurboTenant is a solid free option for small landlords. But if you need AI risk scoring,
          financial calculators, multi-role auth, or full PWA offline support — {SITE_BRAND_SHORT} is
          the upgrade.
        </p>
      </section>

      {/* Quick Stats */}
      <section className="mb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat) => (
            <Card key={stat.metric} className="border-foreground/10">
              <CardContent className="p-5 text-center">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-foreground/50">
                  {stat.metric}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">{stat.ondo}</p>
                    <p className="text-xs text-foreground/50">{SITE_BRAND_SHORT}</p>
                  </div>
                  <span className="text-foreground/20">vs</span>
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground/40">{stat.turbotenant}</p>
                    <p className="text-xs text-foreground/50">TurboTenant</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
            {categories.map((cat) => {
              const rows = features.filter((f) => f.category === cat)
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
                        <CellValue value={row.turbotenant} />
                      </td>
                    </tr>
                  ))}
                </>
              )
            })}
          </tbody>
        </table>
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
              If any of the above describes you today but you expect to grow — {SITE_BRAND_SHORT} is
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
          Join property owners who needed more than TurboTenant could offer. See our pricing or book
          a 15-minute call with our team.
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
