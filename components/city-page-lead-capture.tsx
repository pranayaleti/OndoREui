"use client"

import Link from "next/link"
import { Phone, Calendar } from "lucide-react"
import { SITE_PHONE } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { ContactLeadForm } from "@/components/contact/contact-lead-form"
import type { ContactInquiryType } from "@/lib/leads-api"

type CityPageLeadCaptureProps = {
  cityName: string
  heading: string
  prefillMessage: string
  defaultInquiryType?: ContactInquiryType
}

/**
 * Call + Book a call + existing ContactLeadForm. Used on city service and
 * city guide pages (above the fold and again at the bottom). Not a new form.
 */
export function CityPageLeadCapture({
  cityName,
  heading,
  prefillMessage,
  defaultInquiryType,
}: CityPageLeadCaptureProps) {
  const telHref = SITE_PHONE.replace(/[^\d+]/g, "")

  return (
    <section className="rounded-xl border border-border bg-muted/50 px-6 py-8">
      <div className="mb-6 text-center">
        <h2 className="mb-3 text-xl font-bold">{heading}</h2>
        <p className="mb-4 text-sm text-foreground/70">
          Call, book a time, or send a note. We serve {cityName} and nearby Wasatch Front cities.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline" size="lg">
            <a href={`tel:${telHref}`}>
              <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
              Call {SITE_PHONE}
            </a>
          </Button>
          <Button asChild size="lg">
            <Link href="/contact#book-a-call">
              <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
              Book a call
            </Link>
          </Button>
        </div>
      </div>
      <div className="mx-auto max-w-lg">
        <ContactLeadForm
          source="website"
          prefillMessage={prefillMessage}
          defaultInquiryType={defaultInquiryType}
        />
      </div>
    </section>
  )
}
