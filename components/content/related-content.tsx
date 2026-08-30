import { CrossLinkSection } from "@/components/cross-link-section"
import { relatedLinksForPath } from "@/lib/content"
import type { ContentKind } from "@/lib/content/types"

type RelatedContentProps = {
  path: string
  title?: string
  kinds?: readonly ContentKind[]
  limit?: number
  variant?: "grid" | "pills"
}

export function RelatedContent({
  path,
  title = "Related reading",
  kinds,
  limit = 6,
  variant = "grid",
}: RelatedContentProps) {
  const links = relatedLinksForPath(path, { kinds, limit })
  if (links.length === 0) return null

  return (
    <div className="not-prose my-10">
      <CrossLinkSection title={title} variant={variant} links={links} />
    </div>
  )
}
