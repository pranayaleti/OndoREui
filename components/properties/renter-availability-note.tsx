"use client"

import { Phone } from "lucide-react"
import { ContactLeadForm } from "@/components/contact/contact-lead-form"
import { Button } from "@/components/ui/button"
import { SITE_PHONE } from "@/lib/site"

type RenterAvailabilityNoteProps = {
  prefillMessage: string
  /**
   * Empty-filter state vs. still-browsing capture. Copy stays Ondo-native:
   * leasing team, not a cloned waitlist.
   */
  variant?: "empty" | "browse"
}

export function RenterAvailabilityNote({
  prefillMessage,
  variant = "browse",
}: RenterAvailabilityNoteProps) {
  const telHref = SITE_PHONE.replace(/[^\d+]/g, "")
  const heading =
    variant === "empty"
      ? "Nothing in this filter set right now"
      : "Looking for a different street or move-in date?"
  const body =
    variant === "empty"
      ? "Widen the filters, or send the leasing team your city, beds, and budget. A person replies with current Ondo-managed homes — we do not keep a public waitlist."
      : "Send the leasing team your city, beds, and budget. We'll reply with current Ondo-managed homes that match, and how to tour."

  return (
    <section
      id="ask-leasing"
      className="scroll-mt-24 rounded-xl border border-border bg-muted/40 px-5 py-8"
      aria-labelledby="ask-leasing-heading"
    >
      <div className="mx-auto max-w-lg text-center">
        <h2 id="ask-leasing-heading" className="text-xl font-semibold text-foreground">
          {heading}
        </h2>
        <p className="mt-2 text-sm text-foreground/70">{body}</p>
        <div className="mt-4">
          <Button asChild variant="outline" size="lg">
            <a href={`tel:${telHref}`}>
              <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
              Call leasing {SITE_PHONE}
            </a>
          </Button>
        </div>
      </div>
      <div className="mx-auto mt-6 max-w-lg">
        <ContactLeadForm
          source="website"
          defaultInquiryType="renter"
          prefillMessage={prefillMessage}
          routeAfterSubmit={false}
        />
        <p className="mt-4 text-xs text-muted-foreground">
          Equal Housing Opportunity. We consider every complete application using the same written criteria.
        </p>
      </div>
    </section>
  )
}
