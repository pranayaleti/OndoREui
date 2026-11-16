import { FOUNDED_YEAR, UTAH_CITIES_SERVED } from "@/lib/social-proof-stats"
import { STARTER_MGMT_RATE } from "@/lib/fee-comparison"

const points = [
  {
    value: `${UTAH_CITIES_SERVED} cities`,
    label: "Salt Lake, Utah, Davis and Weber counties, with a guide for each.",
  },
  {
    value: `${Math.round(STARTER_MGMT_RATE * 100)}% of collected rent`,
    label: "Management is billed only when rent comes in. No setup fee, 30 days' notice to leave.",
  },
  {
    value: `Lehi since ${FOUNDED_YEAR}`,
    label: "Owner-run. You talk to the person who answers for the result.",
  },
] as const

/** Three things that are true today. Numbers come from lib/social-proof-stats and lib/fee-comparison. */
export function WhyOndoSection() {
  return (
    <section className="border-y border-border bg-card py-14 md:py-20" aria-labelledby="why-ondo-heading">
      <div className="container mx-auto px-4">
        <h2 id="why-ondo-heading" className="text-3xl font-bold text-foreground md:text-4xl">
          Why Ondo
        </h2>
        <dl className="mt-8 grid grid-cols-1 md:mt-10 md:grid-cols-3">
          {points.map(({ value, label }) => (
            <div
              key={value}
              className="border-t border-border py-6 md:border-l md:border-t-0 md:px-8 md:py-1 md:first:border-l-0 md:first:pl-0"
            >
              <dt className="font-display text-2xl font-bold tracking-tight text-foreground lg:text-3xl">{value}</dt>
              <dd className="mt-2 max-w-xs text-sm leading-relaxed text-foreground/70 md:text-base">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export { WhyOndoSection as SocialProofBar }
