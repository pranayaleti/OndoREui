import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export type FaqAccordionLink = {
  label: string
  href: string
}

export type FaqAccordionItem = {
  question: string
  /** Plain text. Also used for FAQPage JSON-LD, so keep it free of markup and authoring notes. */
  answer: string
  /** Guides to point the reader to. Rendered under the answer, not part of the JSON-LD text. */
  links?: readonly FaqAccordionLink[]
}

/** Blog guide link helper: `/blog/<slug>/` with the trailing-slash convention. */
export function guideLink(slug: string, label: string): FaqAccordionLink {
  return { label, href: `/blog/${slug}/` }
}

export function FaqAccordion({ items }: { items: readonly FaqAccordionItem[] }) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-3">
      {items.map((faq, index) => (
        <AccordionItem
          key={faq.question}
          value={`item-${index}`}
          className="border border-border rounded-xl bg-card/60 px-6 py-2 backdrop-blur-sm"
        >
          <AccordionTrigger className="text-foreground hover:no-underline py-4">
            <span className="text-left font-semibold">{faq.question}</span>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground pb-4 pt-2 leading-relaxed">
            {faq.answer}
            {faq.links && faq.links.length > 0 ? (
              <p className="mt-3 text-sm">
                <span className="font-medium text-foreground">Related: </span>
                {faq.links.map((link, i) => (
                  <span key={link.href}>
                    {i > 0 ? ", " : null}
                    <Link href={link.href} className="text-accent-2 underline underline-offset-2 hover:text-accent-1">
                      {link.label}
                    </Link>
                  </span>
                ))}
              </p>
            ) : null}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
