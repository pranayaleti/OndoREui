"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function NotaryFAQ() {
  const itemClass =
    "rounded-lg border border-border/70 dark:border-white/10 bg-card/80 dark:bg-card/60 px-6";

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      <AccordionItem value="validity" className={itemClass}>
        <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
          Are your notarizations valid in other states?
        </AccordionTrigger>
        <AccordionContent className="text-foreground/70 leading-relaxed">
          Yes. Remote online notarizations completed by a commissioned Utah notary are valid
          nationwide because the notarial act is tied to the notary’s location. Always confirm the
          receiving party accepts electronic/remote notarization—we provide the digital certificate,
          audio/video record, and compliance details if they need them.
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="coverage" className={itemClass}>
        <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
          Do you serve all 50 states?
        </AccordionTrigger>
        <AccordionContent className="text-foreground/70 leading-relaxed">
          Yes—remote online notarization is available in every U.S. state. For clients in Utah
          County, we also offer mobile and in-office appointments.
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="lender-acceptance" className={itemClass}>
        <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
          Will my lender or title company accept an online notarization?
        </AccordionTrigger>
        <AccordionContent className="text-foreground/70 leading-relaxed">
          Nearly all lenders and title companies accept properly executed RON documents. We follow
          state requirements, use secure identity verification, and supply the audit trail and
          digital certificate so your package clears underwriting.
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="documents" className={itemClass}>
        <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
          What types of documents can you notarize?
        </AccordionTrigger>
        <AccordionContent className="text-foreground/70 leading-relaxed">
          Real estate and loan packages, powers of attorney, affidavits, estate documents,
          business agreements, I‑9 forms, and more. If a document requires in-person witnesses,
          we confirm that before booking.
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="process" className={itemClass}>
        <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
          How does a remote appointment work?
        </AccordionTrigger>
        <AccordionContent className="text-foreground/70 leading-relaxed">
          We verify your ID, join a secure video session, review the documents together, apply
          electronic signatures and seal, and store the audio/video record. You receive your
          notarized documents immediately after the session.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="id" className={itemClass}>
        <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
          What identification do I need to bring?
        </AccordionTrigger>
        <AccordionContent className="text-foreground/70 leading-relaxed">
          A current government-issued photo ID (driver’s license, passport, or state ID). For RON
          sessions, we use secure ID checks and knowledge-based authentication when required.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="witnesses" className={itemClass}>
        <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
          Can you provide witnesses?
        </AccordionTrigger>
        <AccordionContent className="text-foreground/70 leading-relaxed">
          Yes. We can supply witnesses when needed (subject to availability and a small fee), or you
          can bring your own. Witnesses must have valid ID and be present for the signing.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="speed" className={itemClass}>
        <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
          How soon can I schedule?
        </AccordionTrigger>
        <AccordionContent className="text-foreground/70 leading-relaxed">
          Same-day and next-day appointments are often available. The online booking calendar shows
          open times, and you can text for urgent requests.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="pricing" className={itemClass}>
        <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
          What do you charge?
        </AccordionTrigger>
        <AccordionContent className="text-foreground/70 leading-relaxed">
          State-regulated notarial acts are $10 per stamp. RON sessions include a platform fee
          (from $25) plus state fees. Mobile visits include a travel fee, and loan signings typically
          range from $75–$200. You’ll get a clear quote before we book.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

