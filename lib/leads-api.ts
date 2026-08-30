import { backendUrl } from "@/lib/backend"
import type { MarketingAttribution } from "@/lib/attribution"

export type ContactLeadSource = "website" | "referral" | "direct" | "social" | "ad" | "popup"

/**
 * Self-identified audience from the contact form. Kept in sync with the
 * Express/Edge Zod schemas and the `website_leads.inquiry_type` CHECK
 * (migrations 20260827155628 + 20260830153628).
 *
 * The five PUBLIC_CONTACT_INQUIRY_TYPES are the radios on /contact.
 * The rest are specialized or legacy values still accepted by the API
 * (persona embeds, buy/sell magnets, existing CRM rows).
 */
export const CONTACT_INQUIRY_TYPES = [
  "owner",
  "renter",
  "buyer",
  "seller",
  "agent",
  "current_client",
  "vendor",
  "other",
  "tenant_looking_to_rent",
  "agent_referrals",
  "owner_rental_services",
  "vendor_maintenance",
  "current_resident",
] as const

export type ContactInquiryType = (typeof CONTACT_INQUIRY_TYPES)[number]

export const PUBLIC_CONTACT_INQUIRY_TYPES = [
  "tenant_looking_to_rent",
  "agent_referrals",
  "owner_rental_services",
  "vendor_maintenance",
  "current_resident",
] as const

export type PublicContactInquiryType = (typeof PUBLIC_CONTACT_INQUIRY_TYPES)[number]

export function isContactInquiryType(value: string): value is ContactInquiryType {
  return (CONTACT_INQUIRY_TYPES as readonly string[]).includes(value)
}

export function isPublicContactInquiryType(value: string): value is PublicContactInquiryType {
  return (PUBLIC_CONTACT_INQUIRY_TYPES as readonly string[]).includes(value)
}

const PUBLIC_AUDIENCE_QUERY_ALIASES: Record<string, PublicContactInquiryType> = {
  tenant_looking_to_rent: "tenant_looking_to_rent",
  renter: "tenant_looking_to_rent",
  agent_referrals: "agent_referrals",
  agent: "agent_referrals",
  owner_rental_services: "owner_rental_services",
  owner: "owner_rental_services",
  vendor_maintenance: "vendor_maintenance",
  vendor: "vendor_maintenance",
  current_resident: "current_resident",
  current_client: "current_resident",
}

/** Map `?audience=` / `?intent=` (including legacy short names) to a public radio value. */
export function publicAudienceFromQuery(
  value: string | null | undefined,
): PublicContactInquiryType | undefined {
  if (!value) return undefined
  return PUBLIC_AUDIENCE_QUERY_ALIASES[value]
}

export interface SubmitContactLeadPayload {
  name: string
  email: string
  phone?: string
  message?: string
  propertyId?: string
  source?: ContactLeadSource
  /** Which visitor audience clicked the CTA (owner/renter/agent/…). */
  inquiryType?: ContactInquiryType
  /** First/last touch UTMs and click ids from `getAttributionPayloadForApi()`. */
  attribution?: MarketingAttribution
}

export interface SubmitContactLeadSuccess {
  success: true
  message: string
  leadId: string
}

export interface SubmitContactLeadError {
  error: string
  details?: Record<string, string[]>
}

/**
 * Submit a website/contact lead to the backend.
 * Use from client components (e.g. contact form). Works with static export , 
 * no Next.js API route required; the UI calls the backend directly.
 */
export async function submitContactLead(
  payload: SubmitContactLeadPayload
): Promise<SubmitContactLeadSuccess | SubmitContactLeadError> {
  const url = backendUrl("/api/leads/contact")
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return {
        error: (data.error as string) ?? "Failed to submit",
        ...(data.details && { details: data.details }),
      }
    }
    return data as SubmitContactLeadSuccess
  } catch {
    return { error: "Could not reach the server. Please try again." }
  }
}
