import Link from "next/link"
import { Calculator, Calendar } from "lucide-react"

/**
 * "Self-managing your rental?" pitch — modeled on the highest-converting
 * section local PM competitors run (Keyrenter et al.), but rewritten in
 * Ondo's voice and pointing to real Ondo assets: the owner-vs-self
 * calculator, the free rental analysis, and the Calendly on /contact.
 *
 * Copy avoids superlatives and any implied guarantee (no "we'll fill your
 * vacancy in 30 days"). Every pain point below maps to a service already
 * documented on the PM pages.
 */
const painPoints: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: "Screening applicants",
    body:
      "Consistent, documented criteria across credit, eviction, criminal, and income — applied the same way to every applicant so every decision is traceable.",
  },
  {
    title: "Filling vacancies",
    body:
      "Photos, syndicated listings, showings, and application flow that keeps units marketed until they're leased — instead of stopping after the first weekend.",
  },
  {
    title: "Collecting rent on time",
    body:
      "Online payments with a lease-anchored late-fee policy and automated reminders, so you're not the person chasing a Venmo.",
  },
  {
    title: "Coordinating maintenance",
    body:
      "Trusted local vendors, per-owner cost thresholds, and a 24/7 emergency line — routed with photo and video documentation for each work order.",
  },
  {
    title: "Serving notices",
    body:
      "Procedural support under Utah landlord–tenant law when notices, cure periods, or evictions are required. Your attorney gives the legal advice; we handle the paperwork trail.",
  },
]

export function SelfManagingSection() {
  return (
    <section
      className="bg-background py-16 md:py-20"
      aria-labelledby="self-managing-heading"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
              Self-managing your rental?
            </p>
            <h2
              id="self-managing-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              You didn&rsquo;t buy the property to answer maintenance calls at 10pm.
            </h2>
            <p className="mt-4 text-lg text-foreground/70">
              Ondo takes over the day-to-day so owners get their evenings back.
              See what your home could rent for, then talk through whether full-
              service management pencils out for your portfolio.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/whats-my-home-worth"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Calculator className="h-4 w-4" aria-hidden="true" />
                Get my free rental analysis
              </Link>
              <Link
                href="/contact#book-a-call"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary bg-transparent px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Book a call
              </Link>
            </div>
            <p className="mt-4 text-sm text-foreground/60">
              Prefer to see the math first?{" "}
              <Link
                href="/calculators/owner-vs-self"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Run the self-manage vs Ondo calculator
              </Link>
              .
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground/70">
              What Ondo takes off your plate
            </h3>
            <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
              {painPoints.map((point) => (
                <li key={point.title} className="p-5">
                  <p className="font-semibold text-foreground">{point.title}</p>
                  <p className="mt-1 text-sm text-foreground/70">{point.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
