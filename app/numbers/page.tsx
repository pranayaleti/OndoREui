// Includes a mortgage-rate calculator and a lead form: ship with the licensed pages (see lib/site.ts LICENSING_LIVE).
// NOTE(i18n): server component, English-only per OndoREui/CLAUDE.md i18n rules.
import type { Metadata } from "next"
import { NumbersCalculator } from "@/components/numbers/numbers-calculator"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { pageTitle } from "@/lib/site"
import { ARRIVAL_LENDING_DISCLOSURE, ARRIVAL_REAL_ESTATE_DISCLOSURE } from "@/lib/utah-arrival"

const description =
  "Put a dollar figure on a higher mortgage rate, an empty rental, or an overpriced listing. Results update as you type, no email needed."

export const metadata: Metadata = {
  ...pageCanonicalMetadata("/numbers/", {
    title: pageTitle("What Is This Problem Really Costing You?"),
    description,
  }),
  // Landing page for the "Comment NUMBERS" reel, reached from DMs. The indexable versions of
  // these numbers are the calculators under /calculators/.
  robots: { index: false, follow: true },
}

export default function NumbersPage() {
  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-5xl px-4">
        <h1 className="max-w-[22ch] font-outfit text-3xl font-bold tracking-tight md:text-4xl">
          What is this problem really costing you?
        </h1>
        <p className="mt-3 max-w-prose leading-relaxed text-muted-foreground">
          Change any number to match your situation. Results update as you type.
        </p>

        <div className="mt-8">
          <NumbersCalculator />
        </div>

        <div className="mt-12 space-y-2 text-xs leading-relaxed text-muted-foreground">
          <p>Estimates for education only. Mortgage figures are principal and interest only.</p>
          <p>{ARRIVAL_LENDING_DISCLOSURE}</p>
          <p>{ARRIVAL_REAL_ESTATE_DISCLOSURE}</p>
        </div>
      </div>
    </main>
  )
}
