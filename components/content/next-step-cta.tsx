import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ctaForPath, relatedLinksForPath } from "@/lib/content"

type NextStepCtaProps = {
  path: string
  heading?: string
  body?: string
}

function headingIdForPath(path: string): string {
  const slug = path.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "page"
  return `next-step-${slug}`
}

export function NextStepCta({
  path,
  heading = "What to do next",
  body = "Education first. A conversation with a loan officer is how you find out what may actually fit your file.",
}: NextStepCtaProps) {
  const primary = ctaForPath(path)
  const conversions = relatedLinksForPath(path, { kinds: ["conversion", "calculator", "program"], limit: 3 })
  const headingId = headingIdForPath(path)

  if (!primary && conversions.length === 0) return null

  return (
    <section className="not-prose my-10 rounded-lg border border-border bg-muted p-6" aria-labelledby={headingId}>
      <h2 id={headingId} className="text-xl font-bold text-foreground">
        {heading}
      </h2>
      <p className="mt-2 text-sm text-foreground/70">{body}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {primary ? (
          <Button asChild>
            <Link href={primary.href}>{primary.label}</Link>
          </Button>
        ) : null}
        {conversions
          .filter((link) => link.href !== primary?.href)
          .slice(0, 2)
          .map((link) => (
            <Button key={link.href} asChild variant="outline">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
      </div>
    </section>
  )
}
