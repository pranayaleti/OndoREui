import type { RentalRequirementCategory } from "@/lib/api/rental"

export function RequirementCard({ category }: { category: RentalRequirementCategory }) {
  if (category.items.length === 0) return null
  return (
    <article className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold">{category.title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
        {category.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}

export function PropertyRequirements({
  categories,
}: {
  categories: RentalRequirementCategory[]
}) {
  if (!categories.length) {
    return <p className="text-sm text-muted-foreground">Written criteria will appear here once this home is accepting applications.</p>
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {categories.map((category) => (
        <RequirementCard key={category.id} category={category} />
      ))}
    </div>
  )
}
