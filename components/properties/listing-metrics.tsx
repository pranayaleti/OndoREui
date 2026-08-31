import type { ListingMetricRow } from "@/lib/listing-presentation"

type ListingMetricsProps = {
  rows: ListingMetricRow[]
}

export function ListingMetrics({ rows }: ListingMetricsProps) {
  if (rows.length === 0) return null

  return (
    <section aria-labelledby="listing-metrics-heading" className="mb-8">
      <h2 id="listing-metrics-heading" className="mb-3 text-xl font-semibold">
        Listing figures
      </h2>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {rows.map((row) => (
          <div key={row.id} className="rounded-lg border border-border bg-card px-3 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {row.label}
            </dt>
            <dd className="mt-1 text-lg font-semibold">{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-xs text-muted-foreground">
        Figures come from this listing. We do not estimate cap rate, NOI, or occupancy when they
        were not provided.
      </p>
    </section>
  )
}
