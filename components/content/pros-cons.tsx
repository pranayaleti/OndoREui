import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

type ProsConsProps = {
  pros: readonly string[]
  cons: readonly string[]
  prosHeading?: string
  consHeading?: string
  className?: string
}

function Column({
  heading,
  items,
  tone,
}: {
  heading: string
  items: readonly string[]
  tone: "pro" | "con"
}) {
  if (items.length === 0) return null
  const headingId = `pros-cons-${heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
  const Icon = tone === "pro" ? Plus : Minus

  return (
    <div className="rounded-lg border border-border bg-card/50 p-5">
      <h3
        id={headingId}
        className={cn(
          "mb-3 text-sm font-semibold uppercase tracking-wider",
          tone === "pro" ? "text-primary" : "text-foreground/60",
        )}
      >
        {heading}
      </h3>
      <ul aria-labelledby={headingId} className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-[0.95rem] leading-relaxed text-foreground/85">
            <Icon
              aria-hidden="true"
              className={cn("mt-1 h-3.5 w-3.5 shrink-0", tone === "pro" ? "text-primary" : "text-foreground/40")}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ProsCons({
  pros,
  cons,
  prosHeading = "Pros",
  consHeading = "Cons",
  className,
}: ProsConsProps) {
  if (pros.length === 0 && cons.length === 0) return null

  return (
    <div className={cn("not-prose my-8 grid gap-4 md:grid-cols-2", className)}>
      <Column heading={prosHeading} items={pros} tone="pro" />
      <Column heading={consHeading} items={cons} tone="con" />
    </div>
  )
}
