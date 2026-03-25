import type { Metadata } from "next"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SITE_BRAND_SHORT } from "@/lib/site"
import Link from "next/link"

export const metadata: Metadata = {
  title: `Compare Property Management Software | ${SITE_BRAND_SHORT}`,
  description: `See how ${SITE_BRAND_SHORT} compares to Buildium, AppFolio, TurboTenant, and RentRedi. Utah-local expertise, AI-powered risk scoring, and full-service property management.`,
}

type FeatureRow = {
  feature: string
  ondo: boolean | string
  buildium: boolean | string
  appfolio: boolean | string
  turbotenant: boolean | string
  rentredi: boolean | string
}

const features: FeatureRow[] = [
  {
    feature: "Utah-local team & expertise",
    ondo: true,
    buildium: false,
    appfolio: false,
    turbotenant: false,
    rentredi: false,
  },
  {
    feature: "AI-powered tenant risk scoring",
    ondo: true,
    buildium: false,
    appfolio: false,
    turbotenant: false,
    rentredi: false,
  },
  {
    feature: "Integrated mortgage & brokerage",
    ondo: true,
    buildium: false,
    appfolio: false,
    turbotenant: false,
    rentredi: false,
  },
  {
    feature: "Owner real-time dashboard",
    ondo: true,
    buildium: true,
    appfolio: true,
    turbotenant: false,
    rentredi: true,
  },
  {
    feature: "Tenant portal & maintenance",
    ondo: true,
    buildium: true,
    appfolio: true,
    turbotenant: true,
    rentredi: true,
  },
  {
    feature: "Automated rent collection",
    ondo: true,
    buildium: true,
    appfolio: true,
    turbotenant: true,
    rentredi: true,
  },
  {
    feature: "Notary services built-in",
    ondo: true,
    buildium: false,
    appfolio: false,
    turbotenant: false,
    rentredi: false,
  },
  {
    feature: "Investor portfolio analytics",
    ondo: true,
    buildium: true,
    appfolio: true,
    turbotenant: false,
    rentredi: false,
  },
  {
    feature: "Starting price",
    ondo: "Custom",
    buildium: "$58/mo",
    appfolio: "$1.40/unit",
    turbotenant: "Free",
    rentredi: "$12/mo",
  },
]

const competitors = [
  { key: "ondo" as const, label: SITE_BRAND_SHORT, highlight: true },
  { key: "buildium" as const, label: "Buildium", highlight: false },
  { key: "appfolio" as const, label: "AppFolio", highlight: false },
  { key: "turbotenant" as const, label: "TurboTenant", highlight: false },
  { key: "rentredi" as const, label: "RentRedi", highlight: false },
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

const differentiators = [
  {
    title: "Local Utah expertise — not just software",
    description:
      "We are a Utah-based team that knows the local market, regulations, and tenant landscape. You get hands-on property management, not a generic SaaS login.",
  },
  {
    title: "Full-service: PM + loans + brokerage + notary in one team",
    description:
      "Stop juggling vendors. Ondo RE combines property management, mortgage lending, real estate brokerage, and notary services under one roof so every deal moves faster.",
  },
  {
    title: "AI-powered insights for smarter decisions",
    description:
      "Our proprietary risk scoring identifies at-risk tenants before problems arise. Predictive maintenance analytics help you budget repairs and protect your investment.",
  },
]

export default function ComparePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          How {SITE_BRAND_SHORT} Compares
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
          The modern alternative to legacy property management software
        </p>
      </section>

      {/* Comparison Table */}
      <section className="mb-20 overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border-b border-foreground/10 px-4 py-3 text-left font-medium text-foreground/70">
                Feature
              </th>
              {competitors.map((c) => (
                <th
                  key={c.key}
                  className={`border-b border-foreground/10 px-4 py-3 text-center font-semibold ${
                    c.highlight
                      ? "bg-primary/5 text-primary dark:bg-primary/10"
                      : "text-foreground"
                  }`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((row, i) => (
              <tr
                key={row.feature}
                className={
                  i % 2 === 0 ? "bg-transparent" : "bg-foreground/[0.02] dark:bg-[var(--gradient-overlay)]"
                }
              >
                <td className="border-b border-foreground/5 px-4 py-3 font-medium text-foreground">
                  {row.feature}
                </td>
                {competitors.map((c) => (
                  <td
                    key={c.key}
                    className={`border-b border-foreground/5 px-4 py-3 text-center ${
                      c.highlight ? "bg-primary/5 dark:bg-primary/10" : ""
                    }`}
                  >
                    <CellValue value={row[c.key]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Why Owners Switch */}
      <section className="mb-20">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground">
          Why owners switch to {SITE_BRAND_SHORT}
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {differentiators.map((d) => (
            <Card key={d.title} className="border-foreground/10">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {d.title}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/70">
                  {d.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-primary/5 px-6 py-12 text-center dark:bg-[var(--gradient-overlay)]">
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Ready to experience the difference?
        </h2>
        <p className="mb-6 text-foreground/70">
          Join property owners across Utah who chose a better way to manage
          their investments.
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
