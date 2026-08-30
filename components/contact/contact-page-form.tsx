"use client"

import { useSearchParams } from "next/navigation"
import { ContactLeadForm, CONTACT_INQUIRY_OPTIONS } from "@/components/contact/contact-lead-form"
import type { ContactInquiryType } from "@/lib/leads-api"

function audienceFromQuery(value: string | null): ContactInquiryType | undefined {
  if (!value) return undefined
  return CONTACT_INQUIRY_OPTIONS.find((option) => option.value === value)?.value
}

/**
 * Reads `audience` or `intent` from the URL so /buy and /sell can deep-link
 * into /contact with buyer or seller already selected. Static export cannot
 * do this on the server, so this stays a client wrapper.
 */
export function ContactPageForm() {
  const params = useSearchParams()
  const initialInquiryType = audienceFromQuery(
    params?.get("audience") ?? params?.get("intent") ?? null,
  )

  return (
    <ContactLeadForm
      routeAfterSubmit
      initialInquiryType={initialInquiryType}
    />
  )
}
