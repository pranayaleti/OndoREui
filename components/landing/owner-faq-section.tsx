import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HOMEPAGE_FAQS } from "@/lib/home-faq"

export function HomeFaqSection() {
  return (
    <section
      className="border-y border-border/40 bg-muted/30 py-16 md:py-20"
      aria-labelledby="home-faq-heading"
    >
      <div className="container mx-auto max-w-3xl px-4">
        <h2
          id="home-faq-heading"
          className="mb-8 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          Common questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {HOMEPAGE_FAQS.map((faq, index) => (
            <AccordionItem key={faq.q} value={`home-faq-${index}`}>
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

export { HomeFaqSection as OwnerFaqSection }
