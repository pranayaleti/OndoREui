import { applicationStatusLabel } from "@/lib/rental-application"
import { cn } from "@/lib/utils"

const TONES: Record<string, string> = {
  draft: "bg-muted text-foreground",
  started: "bg-muted text-foreground",
  invited: "bg-muted text-foreground",
  incomplete: "bg-amber-100 text-amber-900",
  submitted: "bg-blue-100 text-blue-900",
  payment_pending: "bg-amber-100 text-amber-900",
  documents_required: "bg-amber-100 text-amber-900",
  verification_pending: "bg-amber-100 text-amber-900",
  under_review: "bg-blue-100 text-blue-900",
  additional_information_required: "bg-amber-100 text-amber-900",
  approved: "bg-emerald-100 text-emerald-900",
  conditionally_approved: "bg-emerald-100 text-emerald-900",
  denied: "bg-rose-100 text-rose-900",
  withdrawn: "bg-muted text-muted-foreground",
  expired: "bg-muted text-muted-foreground",
}

export function ApplicationStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center rounded-full px-3 text-xs font-medium",
        TONES[status] ?? "bg-muted text-foreground",
      )}
    >
      {applicationStatusLabel(status)}
    </span>
  )
}
