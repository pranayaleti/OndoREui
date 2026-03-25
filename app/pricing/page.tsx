import type { Metadata } from "next"
import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SITE_BRAND_SHORT, SITE_URL } from "@/lib/site"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"

export const metadata: Metadata = {
  title: `Pricing | ${SITE_BRAND_SHORT}`,
  description:
    "Transparent property management pricing for Utah property owners. No hidden fees — just percentage-based plans that scale with your portfolio.",
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: `Pricing | ${SITE_BRAND_SHORT}`,
    description:
      "Property management pricing Utah — percentage-based plans for portfolios of every size. Tenant screening, rent collection, maintenance, and more.",
    url: `${SITE_URL}/pricing`,
  },
}

const tiers = [
  {
    name: "Starter",
    units: "1\u20134 units",
    price: "10%",
    priceLabel: "of collected rent",
    description: "Perfect for individual property owners getting started with professional management.",
    features: [
      "Tenant screening & placement",
      "Rent collection & disbursement",
      "Maintenance coordination",
      "Owner portal access",
      "Monthly financial statements",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Growth",
    units: "5\u201315 units",
    price: "8%",
    priceLabel: "of collected rent",
    description: "For growing landlords who need hands-off management and proactive property care.",
    features: [
      "Everything in Starter",
      "Priority maintenance dispatch",
      "Quarterly property inspections",
      "Lease renewal management",
      "Dedicated account manager",
    ],
    cta: "Get started",
    highlighted: true,
  },
  {
    name: "Portfolio",
    units: "16+ units",
    price: "Custom",
    priceLabel: "tailored to your portfolio",
    description: "Enterprise-grade management for investors and institutions with large holdings.",
    features: [
      "Everything in Growth",
      "Custom reporting & analytics",
      "Bulk lease management",
      "Investor portal access",
      "API access & integrations",
      "SLA guarantees",
    ],
    cta: "Contact us",
    highlighted: false,
  },
]

const includedInEveryPlan = [
  "Online rent payments via Stripe",
  "24/7 emergency maintenance line",
  "Tenant portal with lease & payment history",
  "Owner dashboard with real-time financials",
  "Utah legal compliance & fair housing adherence",
  "Direct deposit for owner distributions",
]

const faqs = [
  {
    q: "Are there any hidden fees beyond the management percentage?",
    a: "No. Our management fee is a straightforward percentage of collected rent. You only pay when your tenants pay. The only additional cost is the one-time leasing fee when we place a new tenant.",
  },
  {
    q: "What is the leasing fee and when does it apply?",
    a: "We charge a one-time leasing fee of 50% of the first month\u2019s rent whenever we place a new tenant. This covers marketing the vacancy, conducting showings, screening applicants, and executing the lease. There is no leasing fee on renewals.",
  },
  {
    q: "Can I cancel my management agreement at any time?",
    a: "Yes. We operate on a 30-day written notice period. We believe in earning your business every month, not locking you into long-term contracts.",
  },
  {
    q: "Do you handle properties outside of Utah?",
    a: "Currently we focus exclusively on the Utah market so we can deliver best-in-class local expertise. If you have properties in neighboring states, reach out and we\u2019ll discuss options.",
  },
]

export default function PricingPage() {
  return (
    <main id="main-content" className="min-h-screen dark:bg-[var(--gradient-overlay)]">
      <SEO
        title="Pricing"
        description="Transparent property management pricing for Utah property owners. No hidden fees."
        pathname="/pricing"
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Pricing", url: `${SITE_URL}/pricing` },
        ])}
      />

      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight dark:text-foreground sm:text-5xl">
            Transparent pricing for Utah property owners
          </h1>
          <p className="mt-4 text-lg text-foreground/70">
            No hidden fees, no surprise charges. You pay a simple percentage of collected rent &mdash; and only when your tenants pay.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-8 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`flex flex-col ${
                tier.highlighted
                  ? "border-primary shadow-lg ring-2 ring-primary/20 scale-[1.02]"
                  : "border-border"
              }`}
            >
              {tier.highlighted && (
                <div className="rounded-t-lg bg-primary px-4 py-1.5 text-center text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                  Most popular
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-xl dark:text-foreground">{tier.name}</CardTitle>
                <CardDescription className="text-foreground/70">{tier.units}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold dark:text-foreground">{tier.price}</span>
                  <span className="ml-1 text-sm text-foreground/70">{tier.priceLabel}</span>
                </div>
                <p className="mt-3 text-sm text-foreground/70">{tier.description}</p>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm dark:text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant={tier.highlighted ? "default" : "outline"}>
                  <Link href="/contact/#book-a-call">{tier.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Leasing fee callout */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <Card className="border-dashed bg-muted/40">
          <CardContent className="py-6 text-center">
            <p className="text-lg font-semibold dark:text-foreground">
              One-time leasing fee: 50% of first month&rsquo;s rent
            </p>
            <p className="mt-2 text-sm text-foreground/70">
              Covers vacancy marketing, tenant showings, background &amp; credit screening, and lease execution. No leasing fee on renewals.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Included in every plan */}
      <section className="mx-auto max-w-4xl px-4 pb-20">
        <h2 className="mb-8 text-center text-2xl font-bold dark:text-foreground sm:text-3xl">
          Included in every plan
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {includedInEveryPlan.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-lg border border-border p-4">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="text-sm dark:text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border py-20 px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-2xl font-bold dark:text-foreground sm:text-3xl">
            Frequently asked questions
          </h2>
          <dl className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <dt className="text-base font-semibold dark:text-foreground">{faq.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-foreground/70">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold dark:text-foreground sm:text-3xl">
            Ready to simplify your property management?
          </h2>
          <p className="mt-3 text-foreground/70">
            Book a free consultation and we&rsquo;ll build a plan tailored to your portfolio.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/contact/#book-a-call">Book a free consultation</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
