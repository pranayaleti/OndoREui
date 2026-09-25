// UNPUBLISHED. The leading underscore makes this a Next.js private folder: no route, not exported.
// This page solicits mortgage business, so it waits for Ondo's NMLS license to be active.
// To launch: rename the folder to `second-look`, add it to lib/links-page.ts ("Under contract?
// Get a second look"), and add "/loans/second-look/" to tests/a11y.spec.ts.
// NOTE(i18n): server component, English-only per OndoREui/CLAUDE.md i18n rules.
import type { Metadata } from "next"
import { SecondLookForm } from "@/components/lending/second-look-form"
import { SITE_URL, pageTitle } from "@/lib/site"
import { ARRIVAL_LENDING_DISCLOSURE } from "@/lib/utah-arrival"

const description =
  "Under contract with another lender? Send the key numbers from your Loan Estimate and a licensed loan officer will walk you through how they compare. No credit check to start."

export const metadata: Metadata = {
  title: pageTitle("Under Contract? Get a Second Look at Your Loan Estimate"),
  description,
  alternates: { canonical: `${SITE_URL}/loans/second-look/` },
}

/** Where to look on the standard CFPB Loan Estimate, and why each line matters. */
const LINES_TO_COMPARE = [
  {
    name: "Interest rate and lock",
    where: "Page 1",
    why: "A lower rate only helps if the lock lasts until you close. Check the lock expiration date at the top.",
  },
  {
    name: "Points",
    where: "Page 2, Section A",
    why: "Points buy the rate down. Compare the rate and the points together, never one without the other.",
  },
  {
    name: "Origination charges",
    where: "Page 2, Section A total",
    why: "What the lender charges to make the loan. This is where lenders differ most.",
  },
  {
    name: "APR",
    where: "Page 3, Comparisons",
    why: "Rolls the rate and most loan costs into one number. Useful for comparing loans with the same term.",
  },
  {
    name: "Estimated cash to close",
    where: "Page 1, Costs at Closing",
    why: "What you bring to the closing table after your deposit and any credits.",
  },
] as const

export default function SecondLookPage() {
  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-2xl px-4">
        <h1 className="font-outfit text-3xl font-bold tracking-tight md:text-4xl">
          Under contract? Get a second look at your Loan Estimate
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Most buyers can still switch lenders while under contract, as long as it fits the deadlines in the purchase
          agreement. Send us the key numbers from your Loan Estimate and a licensed loan officer will walk you through how
          they compare. No credit check to start.
        </p>

        <section aria-labelledby="lines-to-compare" className="mt-10">
          <h2 id="lines-to-compare" className="font-outfit text-xl font-semibold">
            Five lines worth comparing
          </h2>
          <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {LINES_TO_COMPARE.map((line) => (
              <li key={line.name} className="p-4">
                <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="font-medium">{line.name}</span>
                  <span className="text-xs text-muted-foreground">{line.where}</span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{line.why}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="send-numbers" className="mt-10 rounded-2xl border border-border bg-card p-5 md:p-6">
          <h2 id="send-numbers" className="mb-5 font-outfit text-xl font-semibold">
            Send us your numbers
          </h2>
          <SecondLookForm />
        </section>

        <p className="mt-8 text-xs leading-relaxed text-muted-foreground">{ARRIVAL_LENDING_DISCLOSURE}</p>
      </div>
    </main>
  )
}
