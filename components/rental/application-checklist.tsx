import type { ChecklistItem } from "@/lib/api/rental"
import { cn } from "@/lib/utils"

export function ApplicationChecklist({ items }: { items: ChecklistItem[] }) {
  if (!items.length) {
    return <p className="text-sm text-muted-foreground">No documents are required for this property yet.</p>
  }
  return (
    <ul className="space-y-2" aria-label="Document checklist">
      {items.map((item) => (
        <li
          key={item.type}
          className={cn(
            "flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm",
            item.isComplete ? "bg-emerald-50" : "bg-card",
          )}
        >
          <span>
            {item.label}
            {item.required ? <span className="text-muted-foreground"> (required)</span> : null}
          </span>
          <span className="text-xs font-medium uppercase tracking-wide">
            {item.isComplete ? "Uploaded" : item.status.replaceAll("_", " ")}
          </span>
        </li>
      ))}
    </ul>
  )
}
