import Link from "next/link"
import { cn } from "@/lib/utils"
import { formatArticleDate } from "@/components/content/article-byline"
import { FOUNDER_PROFILE_PATH, getFounder } from "@/lib/team-data"

type ReviewedByProps = {
  /** YYYY-MM-DD of the last review: the post's modified date, else its published date. */
  date: string
  className?: string
}

/** "Reviewed by Pranay Reddy Aleti, Founder · Last reviewed <date>". Owner's call: reviewed, never "written". */
export function ReviewedBy({ date, className }: ReviewedByProps) {
  const founder = getFounder()
  return (
    <p className={cn("not-prose text-sm text-foreground/70", className)}>
      Reviewed by{" "}
      <Link href={FOUNDER_PROFILE_PATH} className="font-medium text-foreground underline-offset-4 hover:underline">
        {founder.name}
      </Link>
      , Founder{" "}
      <span aria-hidden="true" className="text-foreground/30">
        ·
      </span>{" "}
      Last reviewed <time dateTime={date}>{formatArticleDate(date)}</time>
    </p>
  )
}
