import type { Metadata } from "next"
import Link from "next/link"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd, generateServiceJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_NAME } from "@/lib/site"
import { UTAH_PM_COMPARISON } from "@/lib/utah-pm-comparison"
import { FaqAccordion } from "@/components/faq-accordion"
import { Check } from "lucide-react"
import { OG_IMAGES, OG_IMAGE_URLS } from "@/lib/page-canonical"

const title = "Utah Property Management Companies Compared (2026)"
const ogTitle = `${title} | Ondo RE`
const description =
  "Ondo Real Estate next to Rentomatic, Rhino, Wolfnest and Keyrenter on fees, leasing, setup and technology, plus full service vs software you run yourself."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/compare-utah-property-managers/` },
  openGraph: { type: "website", title: ogTitle, description, url: `${SITE_URL}/compare-utah-property-managers/`, images: OG_IMAGES.manage },
  twitter: { card: "summary_large_image", title: ogTitle, description, images: [OG_IMAGE_URLS.manage] },
  robots: { index: true, follow: true },
}

// Competitor fees and features are from public advertising at the time noted. Verify before relying on them.
const competitors = UTAH_PM_COMPARISON

const ONDO_PRICING_FRAMING =
  "Ondo is full-service management: we run the rental for a percentage of collected rent. Buildium and TurboTenant are software you run yourself, so their price is a subscription and your time is not included."

const faqs = [
  {
    question: "What does Utah property management cost in 2026?",
    answer:
      "Most Wasatch Front managers advertise 8 to 12% of collected rent plus a leasing fee of 50 to 100% of one month's rent when a tenant is placed (as of Aug 2026, verify). Some advertise a flat monthly fee instead. Ondo is 10% for 1 to 4 units or 8% for 5 to 15, with a 50% leasing fee and no setup fee.",
  },
  {
    question: "Flat fee or percentage: which is better?",
    answer:
      "A flat fee is predictable and can be cheaper on high-rent units. A percentage means the manager earns more when your rent is higher and nothing when it is not collected. For most Utah homes under about $2,000 a month the percentage is slightly cheaper.",
  },
  {
    question: "Should I just use software and manage it myself?",
    answer:
      "Buildium, TurboTenant and similar tools charge a subscription and leave the showings, screening calls, repairs and notices to you. Full service costs a share of rent and takes those off your plate. Run the self-manage calculator with your own hourly rate before you decide.",
  },
]

const checklist = [
  "Licensed under Utah's Real Estate Licensing and Practices Act, with the separate property manager license from January 1, 2027",
  "Written tenant screening criteria, applied to every applicant",
  "A sample owner statement before you sign",
]

function row(label: string, getter: (c: typeof competitors[number]) => string) {
  return (
    <tr className="border-b border-border/60">
      <th scope="row" className="w-44 py-3 pr-4 text-left align-top text-sm font-medium text-foreground/70">{label}</th>
      {competitors.map((c) => (
        <td key={c.name} className={`px-3 py-3 align-top text-sm text-foreground/90 ${c.isUs ? "bg-primary/5" : ""}`}>
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
        image={`${SITE_URL}/og/manage.jpg`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Compare Utah Property Managers", url: `${SITE_URL}/compare-utah-property-managers` },
          ]),
          generateServiceJsonLd({
            name: `${SITE_NAME}, Property Management Comparison`,
            description: "Side-by-side comparison of Utah property management companies on fees, technology and services.",
            serviceType: "Comparison Guide",
            areaServed: "Utah",
          }),
          generateFAQJsonLd(faqs),
        ]}
      />

      <section className="bg-gradient-to-br from-primary/10 via-background to-card py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Utah property managers, compared
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-foreground/70">
            Fees, leasing, setup and technology side by side. Verify every competitor figure with them before you decide.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div
          className="container mx-auto max-w-6xl overflow-x-auto px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          role="region"
          aria-label="Property management company comparison table"
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scroll region must be keyboard focusable (WCAG 2.1.1)
          tabIndex={0}
        >
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-border">
                <th scope="col" className="w-44 py-3 pr-4 text-left text-xs uppercase tracking-wide text-muted-foreground">Category</th>
                {competitors.map((c) => (
                  <th key={c.name} scope="col" className={`px-3 py-3 text-left text-sm font-bold ${c.isUs ? "bg-primary/10 text-primary" : "text-foreground"}`}>
                    {c.name}
                    {c.isUs && <span className="mt-0.5 block text-xs font-semibold uppercase tracking-wide text-primary">That&apos;s us</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
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

      {/* The retired /vs/buildium/ and /vs/turbotenant/ pages folded into this section; blog posts link here. */}
      <section id="diy-software" className="scroll-mt-24 border-y border-border/40 bg-muted/30 py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">Doing it yourself with software</h2>
          <p className="text-foreground/80">{ONDO_PRICING_FRAMING}</p>
          <p className="mt-4 text-foreground/80">
            Put your own hourly rate, vacancy and repair time into the{" "}
            <Link href="/calculators/owner-vs-self/" className="font-medium text-primary underline underline-offset-4">
              self-manage vs Ondo calculator
            </Link>{" "}
            and compare the two numbers.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">Three things to check with any manager</h2>
          <ul className="space-y-3">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-3 text-foreground/80">
                <Check className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-border/40 bg-muted/30 py-12">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-2xl font-bold text-foreground md:text-3xl">Common questions</h2>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">Want a real quote?</h2>
          <p className="mb-6 text-foreground/70">Thirty minutes on the phone, with the fee schedule in front of us both.</p>
          <Link
            href="/contact/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Book a 30-minute call
          </Link>
        </div>
      </section>
    </main>
  )
}
