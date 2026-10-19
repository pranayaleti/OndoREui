import Link from "next/link"
import { FaqAccordion } from "@/components/faq-accordion"
import { JsonLd } from "@/components/json-ld"
import { generateFAQJsonLd } from "@/lib/seo"
import type { CityFaq } from "@/lib/city-content"

type ServiceFaqSectionProps = {
  /** Used for the heading id and the JSON-LD script id. */
  id: string
  faqs: readonly CityFaq[]
  heading?: string
  /** The full FAQ category page for this service. */
  moreHref: string
  moreLabel?: string
}

/** Max five questions on a service page. The full list lives on the FAQ category page. */
export function ServiceFaqSection({ id, faqs, heading = "Common questions", moreHref, moreLabel = "More questions" }: ServiceFaqSectionProps) {
  const items = faqs.slice(0, 5).map((f) => ({ question: f.q, answer: f.a }))
  return (
    <section className="bg-muted/30 py-16" aria-labelledby={`${id}-heading`}>
      <div className="container mx-auto max-w-3xl px-4">
        <h2 id={`${id}-heading`} className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground">
          {heading}
        </h2>
        <FaqAccordion items={items} />
        <p className="mt-6 text-center text-sm">
          <Link href={moreHref} className="font-medium text-primary underline underline-offset-4">
            {moreLabel}
          </Link>
        </p>
        <JsonLd id={`${id}-faq-jsonld`} data={generateFAQJsonLd(items)} />
      </div>
    </section>
  )
}
