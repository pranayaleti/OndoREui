import { FAIR_HOUSING_STATEMENT } from "@/lib/rental-application"

export function FairHousingNotice({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground"
      aria-label="Equal Housing Opportunity"
    >
      <p className="font-medium text-foreground">Equal Housing Opportunity</p>
      <p className={compact ? "mt-1 line-clamp-4" : "mt-2"}>{FAIR_HOUSING_STATEMENT}</p>
    </aside>
  )
}
