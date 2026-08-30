"use client"

import { useId } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export type ContentFaqItem = {
  question: string
  answer: string
}

type ContentFaqProps = {
  items: readonly ContentFaqItem[]
  heading?: string
}

export function ContentFaq({ items, heading = "Common questions" }: ContentFaqProps) {
  const headingId = useId()
  if (items.length === 0) return null

  return (
    <section className="not-prose my-10" aria-labelledby={headingId}>
      <h2 id={headingId} className="mb-4 text-2xl font-bold text-foreground">
        {heading}
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, index) => (
          <AccordionItem key={item.question} value={`faq-${index}`}>
            <AccordionTrigger className="text-left text-foreground">{item.question}</AccordionTrigger>
            <AccordionContent className="text-foreground/80 leading-relaxed">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
