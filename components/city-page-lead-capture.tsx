"use client"

import Link from "next/link"
import { Phone, Calendar } from "lucide-react"
import { SITE_PHONE } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { ContactLeadForm } from "@/components/contact/contact-lead-form"
import type { ContactInquiryType } from "@/lib/leads-api"
import { STICKY_HEADER_SCROLL_MARGIN_CLASS } from "@/lib/scroll-margins"

type CityPageLeadCaptureProps = {
  cityName: string
  heading: string
  prefillMessage: string
  defaultInquiryType?: ContactInquiryType
  /** Anchor id for the block, so a compact block higher on the page can link to this form. */
  id?: string
  /**
   * Compact mode: call and booking buttons plus a link to the form at this href, and no form.
   * Use it for the block near the top of a page that already ends with the full form, so the
   * same long form is not printed twice.
   */
  formHref?: string
}

/**
 * Call + Book a call + existing ContactLeadForm. Used on city service and city guide pages.
 * City guides show the compact block above the content and the full form once at the bottom.
 */
export function CityPageLeadCapture({
  cityName,
  heading,
  prefillMessage,
  defaultInquiryType,
  id,
  formHref,
}: CityPageLeadCaptureProps) {
  const telHref = SITE_PHONE.replace(/[^\d+]/g, "")
  const intro = `Call, book a time, or send a note. We serve ${cityName} and nearby Wasatch Front cities.`
  const actions = (
    <>
      <Button asChild variant="outline" size="lg">
        <a href={`tel:${telHref}`}>
          <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
          Call {SITE_PHONE}
        </a>
      </Button>
      <Button asChild size="lg">
        <Link href="/contact/">
          <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
          Book a call
        </Link>
      </Button>
    </>
  )

  if (formHref) {
    return (
      <section className="flex flex-col gap-5 rounded-xl border border-border bg-card px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div>
          <h2 className="text-xl font-bold">{heading}</h2>
          <p className="mt-1 text-sm text-foreground/70">{intro}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {actions}
          <a href={formHref} className="inline-flex min-h-11 items-center px-1 text-sm font-semibold text-primary underline underline-offset-4">
            Send a note
          </a>
        </div>
      </section>
    )
  }

  return (
    <section id={id} className={`rounded-xl border border-border bg-muted/50 px-6 py-8 ${STICKY_HEADER_SCROLL_MARGIN_CLASS}`}>
      <div className="mb-6 text-center">
        <h2 className="mb-3 text-xl font-bold">{heading}</h2>
        <p className="mb-4 text-sm text-foreground/70">{intro}</p>
        <div className="flex flex-wrap justify-center gap-3">{actions}</div>
      </div>
      <div className="mx-auto max-w-lg">
        {/* The section heading above already names the form, so the card's own title stays off. */}
        <ContactLeadForm
          source="website"
          prefillMessage={prefillMessage}
          defaultInquiryType={defaultInquiryType}
          hideTitle
        />
      </div>
    </section>
  )
}
