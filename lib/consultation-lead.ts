import {
  buildLeadMessage,
  type ContactInquiryType,
  type SubmitContactLeadPayload,
} from "@/lib/leads-api"

/** Same rule the backend applies to `phone` (contactLeadSchema). */
const BACKEND_PHONE_PATTERN = /^[+\d\s\-().]{7,20}$/

/**
 * Inquiry type for a "service needed" label from the contact and consultation
 * forms. Loans, notary, investment and everything else have no type of their
 * own yet, so they go in as "other" and the message carries the detail.
 */
export function inquiryTypeForService(serviceType: string): ContactInquiryType {
  switch (serviceType) {
    case "Property Management":
      return "owner"
    case "Buying a Home":
      return "buyer"
    case "Selling a Home":
      return "seller"
    default:
      return "other"
  }
}

/**
 * Phone for the lead payload. A number the backend would reject (an extension,
 * letters) is not dropped: it moves into the message so the lead still arrives
 * with a way to call back.
 */
export function splitPhoneForLead(raw: string): { phone?: string; note?: string } {
  const value = raw.trim()
  if (!value) return {}
  if (BACKEND_PHONE_PATTERN.test(value)) return { phone: value }
  return { note: value }
}

export interface ConsultationFormValues {
  name: string
  email: string
  phone: string
  propertyType: string
  serviceType: string
  timeline: string
  budget: string
  message: string
  preferredTime: string
  timezone: string
}

/**
 * Turn the consultation / notary modal fields into a POST /api/leads/contact
 * payload. Add attribution in the caller.
 */
export function buildConsultationLead(
  form: ConsultationFormValues,
  variant: "default" | "notary",
): SubmitContactLeadPayload {
  const isNotary = variant === "notary"
  const { phone, note } = splitPhoneForLead(form.phone)
  const preferredTime = form.preferredTime.trim()
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    ...(phone && { phone }),
    source: "website",
    inquiryType: isNotary ? "other" : inquiryTypeForService(form.serviceType),
    message: buildLeadMessage(
      [
        ["Request", isNotary ? "Notary booking request" : "Consultation request"],
        ["Service", form.serviceType],
        ["Property type", form.propertyType],
        ["Timeline", form.timeline],
        ["Budget", form.budget],
        ["Preferred time", preferredTime ? `${preferredTime} ${form.timezone}`.trim() : undefined],
        ["Phone (as typed)", note],
      ],
      form.message,
    ),
  }
}
