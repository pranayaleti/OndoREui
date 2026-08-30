"use client"

import { useSearchParams } from "next/navigation"
import { ContactLeadForm } from "@/components/contact/contact-lead-form"
import { publicAudienceFromQuery } from "@/lib/leads-api"

/**
 * Reads `audience` or `intent` from the URL so city/owner/renter CTAs can
 * deep-link into /contact with a public help option already selected.
 * Legacy short names (renter, owner, agent, vendor, current_client) map to
 * the five public radios. Static export cannot do this on the server, so
 * this stays a client wrapper.
 */
export function ContactPageForm() {
  const params = useSearchParams()
  const initialInquiryType = publicAudienceFromQuery(
    params?.get("audience") ?? params?.get("intent") ?? null,
  )

  return (
    <ContactLeadForm
      routeAfterSubmit
      initialInquiryType={initialInquiryType}
    />
  )
}
