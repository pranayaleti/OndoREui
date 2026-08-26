import { getCityOwnerOpsPatterns } from "@/lib/city-owner-ops"

type CityOwnerOpsSectionProps = {
  cityName: string
}

export function CityOwnerOpsSection({ cityName }: CityOwnerOpsSectionProps) {
  const ops = getCityOwnerOpsPatterns(cityName)
  if (ops.length === 0) return null

  const headingId = "city-owner-ops-heading"

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="mb-6 text-xl font-bold">
        What {cityName} owners plan for
      </h2>
      <ol aria-labelledby={headingId} className="grid gap-4 md:grid-cols-2">
        {ops.map((op, index) => (
          <li key={`${op.title}-${index}`} className="rounded-lg border border-border bg-card p-4">
            <p className="mb-2 text-sm font-semibold text-foreground">
              <span className="mr-2 text-primary">{index + 1}.</span>
              {op.title}
            </p>
            <p className="text-sm text-foreground/70">{op.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}