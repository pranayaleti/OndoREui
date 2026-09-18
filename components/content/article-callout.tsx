import type { ReactNode } from "react"
import { AlertTriangle, Info, Lightbulb, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"

export type CalloutVariant = "tip" | "warning" | "pitfall" | "note"

type ArticleCalloutProps = {
  variant: CalloutVariant
  /** Overrides the variant's default label. */
  title?: string
  children: ReactNode
  className?: string
}

/**
 * Variant is conveyed by label and icon as well as colour, so the distinction
 * survives greyscale, low vision, and a screen reader.
 */
const VARIANTS = {
  tip: { label: "Tip", Icon: Lightbulb, accent: "border-l-primary", tint: "text-primary" },
  warning: { label: "Warning", Icon: AlertTriangle, accent: "border-l-destructive", tint: "text-destructive" },
  pitfall: { label: "Watch out", Icon: TriangleAlert, accent: "border-l-amber-500", tint: "text-amber-500" },
  note: { label: "Note", Icon: Info, accent: "border-l-border", tint: "text-foreground/60" },
} as const

export function ArticleCallout({ variant, title, children, className }: ArticleCalloutProps) {
  const { label, Icon, accent, tint } = VARIANTS[variant]
  const heading = title ?? label
  const headingId = `callout-${variant}-${heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`

  return (
    <section
      aria-labelledby={headingId}
      className={cn("not-prose my-6 rounded-r-lg border-l-4 bg-muted/40 p-4 md:p-5", accent, className)}
    >
      <p id={headingId} className={cn("mb-1.5 flex items-center gap-2 text-sm font-semibold", tint)}>
        <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
        {heading}
      </p>
      <div className="text-[0.95rem] leading-relaxed text-foreground/85">{children}</div>
    </section>
  )
}
