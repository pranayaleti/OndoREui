// UNPUBLISHED. The leading underscore makes this a Next.js private folder: no route, not exported.
// This page solicits mortgage business, so it waits for Ondo's NMLS license to be active.
// To launch: rename the folder to `watch`, add it to lib/links-page.ts ("Get on the rate watch
// list"), and add "/refinance/watch/" to tests/a11y.spec.ts.
// NOTE(i18n): server component, English-only per OndoREui/CLAUDE.md i18n rules.
import type { Metadata } from "next"
import Link from "next/link"
import { RateWatchForm } from "@/components/lending/rate-watch-form"
import { SITE_URL, pageTitle } from "@/lib/site"
import { ARRIVAL_LENDING_DISCLOSURE } from "@/lib/utah-arrival"

const description =
  "Tell us your current rate and the rate that would make refinancing worth it. We'll reach out when rates get close. No credit check to join."

export const metadata: Metadata = {
  title: pageTitle("Refinance Rate Watch List"),
  description,
  alternates: { canonical: `${SITE_URL}/refinance/watch/` },
}

export default function RateWatchPage() {
  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <div className="container mx-auto max-w-2xl px-4">
        <h1 className="font-outfit text-3xl font-bold tracking-tight md:text-4xl">Get on the rate watch list</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Tell us your current rate and the rate that would make refinancing worth it. When rates get close, we&apos;ll
          reach out with real numbers. No credit check to join.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Want to see the math today?{" "}
          <Link href="/calculators/refinance/" className="font-medium text-primary underline-offset-4 hover:underline">
            Run the refinance calculator
          </Link>
          .
        </p>

        <section aria-labelledby="join-watch" className="mt-10 rounded-2xl border border-border bg-card p-5 md:p-6">
          <h2 id="join-watch" className="mb-5 font-outfit text-xl font-semibold">
            Your numbers
          </h2>
          <RateWatchForm />
        </section>

        <p className="mt-8 text-xs leading-relaxed text-muted-foreground">{ARRIVAL_LENDING_DISCLOSURE}</p>
      </div>
    </main>
  )
}
