import { CrossLinkSection } from "@/components/cross-link-section"
import { relatedLinksForPath } from "@/lib/content"
import type { ContentKind } from "@/lib/content/types"

type RelatedContentProps = {
  path: string
  title?: string
  kinds?: readonly ContentKind[]
  limit?: number
  variant?: "grid" | "pills"
  /** Shown when the content graph has no related links for this path. */
  fallbackLinks?: readonly { label: string; href: string; description: string }[]
}

export function RelatedContent({
  path,
  title = "Related reading",
  kinds,
  limit = 6,
  variant = "grid",
  fallbackLinks,
}: RelatedContentProps) {
  const graphLinks = relatedLinksForPath(path, { kinds, limit })
  const links = graphLinks.length > 0 ? graphLinks : (fallbackLinks ?? []).slice(0, limit)
  if (links.length === 0) return null

  return (
    <div className="not-prose my-10">
      <CrossLinkSection title={title} variant={variant} links={links} />
    </div>
  )
}
