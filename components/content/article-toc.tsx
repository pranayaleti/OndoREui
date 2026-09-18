import { cn } from "@/lib/utils"
import type { OutlineEntry } from "@/lib/content/article-outline"

type ArticleTocProps = {
  items: readonly OutlineEntry[]
  className?: string
}

/**
 * Jump links for an article's h2/h3 headings. Server-rendered from the outline
 * the shell extracts, so crawlers see it and it cannot drift from the body.
 */
export function ArticleToc({ items, className }: ArticleTocProps) {
  // One heading is not a structure worth navigating.
  if (items.length < 2) return null

  return (
    <nav aria-label="On this page" className={cn("not-prose", className)}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">On this page</p>
      <ol className="space-y-1.5 border-l border-border">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "pl-8" : "pl-4"}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block py-0.5 text-sm leading-snug text-foreground/70 transition-colors hover:text-primary focus-visible:text-primary",
                item.level === 3 && "text-foreground/55",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
