import Link from "next/link"
import { BookOpen, ArrowRight } from "lucide-react"
import {
  GLOSSARY_CATEGORIES,
  GLOSSARY_CATEGORY_BLURBS,
  GLOSSARY_CATEGORY_LABELS,
  GLOSSARY_TERMS,
  type GlossaryTerm,
  glossaryHref,
  glossaryTermsByCategory,
  glossaryTermsForCalculator,
} from "@/lib/content/glossary"

type GlossaryTermStripProps = {
  /** Calculator slug — renders the terms that feed that tool. */
  calculatorSlug?: string
  /** Explicit terms, when the caller has already selected them. */
  terms?: readonly GlossaryTerm[]
  heading?: string
  lead?: string
  className?: string
}

/**
 * Inline glossary strip.
 *
 * Sits under a calculator so someone who does not recognise an input has a
 * definition one click away rather than leaving to search for it. Rendered
 * server-side, so the definitions are in the HTML and each one is a real
 * internal link into `/glossary/`.
 */
export function GlossaryTermStrip({
  calculatorSlug,
  terms,
  heading = "Terms used in this calculator",
  lead,
  className = "",
}: GlossaryTermStripProps) {
  const entries = terms ?? (calculatorSlug ? glossaryTermsForCalculator(calculatorSlug) : [])
  if (entries.length === 0) return null

  const headingId = `glossary-terms-${calculatorSlug ?? "list"}`

  return (
    <section
      aria-labelledby={headingId}
      className={`not-prose my-8 rounded-lg border border-border bg-muted/40 p-6 ${className}`.trim()}
    >
      <h2 id={headingId} className="flex items-center gap-2 text-xl font-bold text-foreground">
        <BookOpen className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        {heading}
      </h2>
      {lead ? <p className="mt-2 text-sm text-foreground/70">{lead}</p> : null}

      <dl className="mt-4 space-y-4">
        {entries.map((entry) => (
          <div key={entry.slug}>
            <dt className="text-sm font-semibold text-foreground">
              <Link
                href={glossaryHref(entry.slug)}
                className="text-primary underline underline-offset-4 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {entry.term}
              </Link>
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-foreground/80">{entry.short}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 text-sm text-foreground/70">
        <Link
          href="/glossary/"
          className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
        >
          Browse the full real estate glossary
        </Link>
      </p>
    </section>
  )
}

/**
 * Glossary entry point for pages that are about numbers rather than vocabulary.
 *
 * Shows every category with a live term count and a few example terms, so the
 * links crawlers follow are real terms rather than a single "see the glossary"
 * link. Server-rendered — no client JS.
 */
export function GlossaryCategoryGrid({
  heading = "Not sure what a term means?",
  lead = "Every input on these tools has a plain-English definition. Browse by topic, or search the full glossary.",
  examplesPerCategory = 4,
  className = "",
}: {
  heading?: string
  lead?: string
  examplesPerCategory?: number
  className?: string
}) {
  return (
    <section aria-labelledby="glossary-grid-heading" className={className}>
      <div className="text-center">
        <h2 id="glossary-grid-heading" className="text-3xl font-bold tracking-tight text-foreground">
          {heading}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-foreground/70">{lead}</p>
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {GLOSSARY_CATEGORIES.map((category) => {
          const entries = glossaryTermsByCategory(category)
          if (entries.length === 0) return null
          const examples = entries.slice(0, examplesPerCategory)
          return (
            <li
              key={category}
              className="flex h-full flex-col rounded-2xl border border-border bg-card/50 p-6"
            >
              <h3 className="flex items-baseline justify-between gap-3 text-lg font-semibold text-foreground">
                {GLOSSARY_CATEGORY_LABELS[category]}
                <span className="shrink-0 font-mono text-xs font-normal text-foreground/50">
                  {entries.length}
                </span>
              </h3>
              <p className="mt-1.5 text-sm text-foreground/60">
                {GLOSSARY_CATEGORY_BLURBS[category]}
              </p>
              <ul className="mt-4 flex flex-1 flex-wrap gap-2">
                {examples.map((entry) => (
                  <li key={entry.slug}>
                    <Link
                      href={glossaryHref(entry.slug)}
                      className="inline-flex rounded-full border border-border bg-background/60 px-3 py-1.5 text-sm text-foreground/80 transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {entry.term}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>

      <div className="mt-8 text-center">
        <Link
          href="/glossary/"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          Browse all {GLOSSARY_TERMS.length} terms
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
