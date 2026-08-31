import Link from "next/link"

const TYPES = [
  { label: "Houses", type: "house" },
  { label: "Townhomes", type: "townhouse" },
  { label: "Condos", type: "condo" },
  { label: "Apartments", type: "apartment" },
] as const

export function BrowseByTypeSection() {
  return (
    <section className="border-y border-border bg-card py-10" aria-labelledby="browse-by-type-heading">
      <div className="container mx-auto px-4">
        <h2 id="browse-by-type-heading" className="font-outfit text-2xl font-semibold tracking-tight">
          Browse by home type
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          These links open current Ondo-managed rentals. Counts are not shown unless a live listing exists
          for that type.
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TYPES.map((item) => (
            <li key={item.type}>
              <Link
                href={`/properties?type=${item.type}`}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium hover:border-primary hover:text-primary"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
