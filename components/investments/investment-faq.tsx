"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FRACTIONAL_FAQ_ITEMS } from "@/lib/investments-faq-data"

export function InvestmentFAQ() {
  const itemClass =
    "rounded-lg border border-border/70 dark:border-white/10 bg-card/80 dark:bg-card/60 px-6"
  const items = Array.isArray(FRACTIONAL_FAQ_ITEMS) ? FRACTIONAL_FAQ_ITEMS : []

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {items.map((faq) => (
        <AccordionItem key={faq.value} value={faq.value} className={itemClass}>
          <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-foreground/70 leading-relaxed">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
