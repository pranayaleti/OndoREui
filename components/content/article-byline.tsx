import { cn } from "@/lib/utils"
import { readingTimeMinutes } from "@/lib/content/article-outline"

type ArticleBylineProps = {
  author: string
  published: string
  modified?: string
  wordCount: number
  className?: string
}

/**
 * Dates arrive as plain `YYYY-MM-DD`. Parsing that yields UTC midnight, so the
 * formatter has to be pinned to UTC or a US locale renders the previous day.
 */
function formatArticleDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

function Separator() {
  return (
    <span aria-hidden="true" className="text-foreground/30">
      ·
    </span>
  )
}

export function ArticleByline({ author, published, modified, wordCount, className }: ArticleBylineProps) {
  const revised = Boolean(modified && modified !== published)
  const date = revised && modified ? modified : published
  const label = revised ? "Updated" : "Published"

  return (
    <div className={cn("not-prose flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-foreground/60", className)}>
      <span className="font-medium text-foreground/80">{author}</span>
      <Separator />
      <span>
        {label} <time dateTime={date}>{formatArticleDate(date)}</time>
      </span>
      <Separator />
      <span>{readingTimeMinutes(wordCount)} min read</span>
    </div>
  )
}
