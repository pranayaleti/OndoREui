import { Building, MapPin, Percent } from "lucide-react"
import { FOUNDED_YEAR, UTAH_CITIES_SERVED } from "@/lib/social-proof-stats"
import { STARTER_MGMT_RATE } from "@/lib/fee-comparison"

const points = [
  {
    icon: MapPin,
    value: `${UTAH_CITIES_SERVED} cities`,
    label: "Salt Lake, Utah, Davis and Weber counties, with a guide for each.",
  },
  {
    icon: Percent,
    value: `${Math.round(STARTER_MGMT_RATE * 100)}% of collected rent`,
    label: "Management is billed only when rent comes in. No setup fee, 30 days' notice to leave.",
  },
  {
    icon: Building,
    value: `Lehi since ${FOUNDED_YEAR}`,
    label: "Owner-run. You talk to the person who answers for the result.",
  },
] as const

/** Three things that are true today. Numbers come from lib/social-proof-stats and lib/fee-comparison. */
export function WhyOndoSection() {
  return (
    <section className="border-y border-border/40 bg-muted/50 py-14 dark:bg-muted/10" aria-labelledby="why-ondo-heading">
      <div className="container mx-auto px-4">
        <h2 id="why-ondo-heading" className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground">
          Why Ondo
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {points.map(({ icon: Icon, value, label }) => (
            <div key={value} className="flex flex-col items-center gap-2 text-center">
              <Icon className="h-6 w-6 text-primary" aria-hidden />
              <span className="text-2xl font-bold text-foreground">{value}</span>
              <span className="max-w-xs text-sm text-foreground/70">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { WhyOndoSection as SocialProofBar }
