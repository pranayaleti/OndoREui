import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getHomepageOwnerFaqs } from "@/lib/service-faq"

export function OwnerFaqSection() {
  const faqs = getHomepageOwnerFaqs()

  return (
    <section
      className="border-y border-border/40 bg-muted/30 py-16 md:py-20"
      aria-labelledby="owner-faq-heading"
    >
      <div className="container mx-auto max-w-3xl px-4">
        <h2
          id="owner-faq-heading"
          className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          Owner questions, answered
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.q} value={`owner-faq-${index}`}>
              <AccordionTrigger className="text-left text-foreground">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/70 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
