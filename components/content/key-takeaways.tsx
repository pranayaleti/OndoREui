import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type KeyTakeawaysProps = {
  items: readonly string[]
  heading?: string
  className?: string
}

/**
 * The "at a glance" summary that sits above the article body. Opt-in: an
 * article only gets one when someone has written the takeaways.
 */
export function KeyTakeaways({ items, heading = "Key takeaways", className }: KeyTakeawaysProps) {
  if (items.length === 0) return null
  const headingId = `key-takeaways-${heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`

  return (
    <section
      aria-labelledby={headingId}
      className={cn("not-prose my-8 rounded-lg border border-border bg-muted/40 p-5 md:p-6", className)}
    >
      <h2 id={headingId} className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
        {heading}
      </h2>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-[0.95rem] leading-relaxed text-foreground/85">
            <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
