// NOTE(i18n): server component, English-only per OndoREui/CLAUDE.md i18n rules.
import type { Metadata } from "next"
import Link from "next/link"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd, generateServiceJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_NAME } from "@/lib/site"
import { UTAH_PM_COMPARISON } from "@/lib/utah-pm-comparison"
import { Check, ArrowRight } from "lucide-react"

const title = "Utah Property Management Companies Compared (2026) | Ondo RE"
const description =
  "Honest side-by-side comparison of Utah's top property management companies, Ondo Real Estate vs Rentomatic, Rhino, Wolfnest, and more. Fees, tech, services, and how each offering differs."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/compare-utah-property-managers/` },
  openGraph: { title, description, url: `${SITE_URL}/compare-utah-property-managers/` },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
}

// NOTE: Competitor fees and features below are based on publicly available
// information at the time of writing. Verify before relying on this for
// procurement decisions; providers update pricing without notice.
const competitors = UTAH_PM_COMPARISON

const faqs = [
  {
    question: "What does Utah property management actually cost in 2026?",
    answer:
      "Most Wasatch Front property managers advertise 8–12% of collected rent for full-service management (as of Aug 2026 — verify), plus a leasing fee (typically 50–100% of one month's rent) when a new tenant is placed. Some companies advertise a flat monthly fee (about $159/month/unit as of Aug 2026 — verify). Ondo RE is Starter 10% (1–4 units) or Growth 8% (5–15 units) of collected rent, with a 50% leasing fee. There is no setup fee.",
  },
  {
    question: "Are flat-fee or percentage-based property management fees better?",
    answer:
      "Flat fees are more predictable and often cheaper for higher-rent units (above ~$2,000/mo). Percentage fees align incentives, the manager earns more when your rent is higher, so they push for rent optimization. For most Utah owners under $2,000/mo, percentage fees are slightly more cost-effective.",
  },
  {
    question: "What's the difference between a leasing fee and a setup fee?",
    answer:
      "A leasing fee is charged when a new tenant is placed, covering marketing, showings, application processing, and lease signing. A setup fee is a one-time onboarding cost some management companies charge when you first hire them. Ondo does not charge a setup fee; the one-time extra we publish is the leasing fee when we place a tenant.",
  },
  {
    question: "What questions should I ask a Utah property management company?",
    answer:
      "Five must-asks: (1) Are you licensed under Utah's Real Estate Licensing and Practices Act, and will you hold the separate property manager license required beginning January 1, 2027? (2) What's your average response time for maintenance requests? (3) How do you handle tenant screening, and what's your eviction rate? (4) Can I see a sample owner statement before I sign? (5) What's your average tenant tenure?",
  },
  {
    question: "How long does it take to switch property managers in Utah?",
    answer:
      "Most contracts have a 30–60 day termination notice clause. Once you give notice, the transition typically takes another 30 days, your existing manager has to hand off security deposits, leases, and maintenance records. Plan for ~60–90 days from decision to fully transitioned.",
  },
]

function row(label: string, getter: (c: typeof competitors[number]) => string) {
  return (
    <tr className="border-b border-border/60">
      <th scope="row" className="text-left text-sm font-medium text-foreground/70 py-3 pr-4 align-top w-44">{label}</th>
      {competitors.map((c) => (
        <td key={c.name} className={`text-sm text-foreground/90 py-3 px-3 align-top ${c.isUs ? "bg-primary/5" : ""}`}>
          {getter(c)}
        </td>
      ))}
    </tr>
  )
}

export default function CompareUtahPropertyManagersPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title={title}
        description={description}
        pathname="/compare-utah-property-managers"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Compare Utah Property Managers", url: `${SITE_URL}/compare-utah-property-managers` },
          ]),
          generateServiceJsonLd({
            name: `${SITE_NAME}, Property Management Comparison`,
            description:
              "Side-by-side comparison of Utah's leading property management companies, covering fees, technology, and services.",
            serviceType: "Comparison Guide",
            areaServed: "Utah",
          }),
          generateFAQJsonLd(faqs),
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-card py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Utah Property Management Companies, Compared (2026)
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-foreground/70">
            An honest side-by-side of how Ondo RE stacks up against the established Wasatch Front incumbents.
            Fees, tech, services, and how the offerings differ.
          </p>
          <p className="mt-4 text-xs text-foreground/50 max-w-xl mx-auto">
            We're biased, this is our website, but the data points below are publicly available.
            Verify with each provider before you commit.
          </p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b-2 border-border">
                <th scope="col" className="text-left text-xs uppercase tracking-wide text-foreground/50 py-3 pr-4 w-44">Category</th>
                {competitors.map((c) => (
                  <th
                    key={c.name}
                    scope="col"
                    className={`text-left text-sm font-bold py-3 px-3 ${c.isUs ? "bg-primary/10 text-primary" : "text-foreground"}`}
                  >
                    {c.name}
                    {c.isUs && (
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-primary/80 mt-0.5">
                        That's us
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {row("Positioning", (c) => c.headline)}
              {row("Management fee", (c) => c.mgmtFee)}
              {row("Leasing fee", (c) => c.leasingFee)}
              {row("Setup fee", (c) => c.setupFee)}
              {row("Technology", (c) => c.techStack)}
              {row("Owner fit", (c) => c.ownerFit)}
              {row("Trade-off", (c) => c.cons)}
            </tbody>
          </table>
        </div>
      </section>

      {/* Honest take */}
      <section className="py-12 bg-muted/30 border-y border-border/40">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">An honest take from the founder</h2>
          <div className="prose prose-lg prose-invert max-w-none text-foreground/80">
            <p>
              You should pick Ondo RE if you want real-time owner visibility, a
              custom owner portal and AI assistant, and a partner that built its own software stack rather than licensing the same AppFolio everyone else uses. If you have a portfolio of 1–20 units and value
              transparent dashboards over a thicker rolodex of long-tenured local relationships, we
              fit.
            </p>
            <p>
              You should pick Rhino or Wolfnest if your priority is a decade-plus local team and
              you'd rather trade tech for tenure. They're real, established, and have moved a lot
              of doors. Their software is older but their people know the Wasatch Front.
            </p>
            <p>
              You should pick Rentomatic if a flat advertised monthly fee and $0
              placement (as advertised Aug 2026) matter more than paying a
              percentage of collected rent and a one-time 50% leasing fee.
              Confirm their current numbers before you rely on this row.
            </p>
            <p>
              You should look at Keyrenter Salt Lake if the reassurance of a national franchise
              brand and their advertised performance guarantees are more valuable to you than a
              bespoke local operator. Read the guarantee fine print with each franchisee, terms
              vary by market and Utah franchisees set their own leasing/eviction policies.
            </p>
            <p>
              The right move before any of these conversations: run your own numbers in our{" "}
              <Link href="/calculators/owner-vs-self">Self-Manage vs Ondo ROI calculator</Link>.
              Whatever the answer, you'll walk into every PM conversation with leverage.
            </p>
          </div>
        </div>
      </section>

      {/* What to evaluate */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Five things to verify with any Utah property manager</h2>
          <ul className="space-y-3">
            {[
              "Licensed under Utah's Real Estate Licensing and Practices Act (separate property manager license required beginning January 1, 2027)",
              "Average maintenance response time documented, not just promised",
              "Tenant screening criteria written and applied consistently, ask for the rubric",
              "Sample owner statement BEFORE you sign, not after",
              "Average tenant tenure over the past 24 months",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-foreground/80">
                <Check className="h-5 w-5 text-primary shrink-0 mt-1" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-muted/30 border-y border-border/40">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">FAQ</h2>
          <div className="space-y-5">
            {faqs.map((f) => (
              <div key={f.question} className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2">{f.question}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Get a real quote: not a brochure</h2>
          <p className="text-foreground/70 mb-8">
            30 minutes, no pressure, full transparency on fees and what's included.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Book a 30-minute call
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/calculators/owner-vs-self"
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Run the ROI numbers first
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
