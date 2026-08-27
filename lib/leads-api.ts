import { backendUrl } from "@/lib/backend"
import type { MarketingAttribution } from "@/lib/attribution"

export type ContactLeadSource = "website" | "referral" | "direct" | "social" | "ad" | "popup"

/**
 * Self-identified audience from the contact form. Kept in sync with the
 * Express/Edge Zod schemas and the `website_leads.inquiry_type` CHECK
 * constraint (migration 20260827155628).
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
] as const

export type ContactInquiryType = (typeof CONTACT_INQUIRY_TYPES)[number]

export function isContactInquiryType(value: string): value is ContactInquiryType {
  return (CONTACT_INQUIRY_TYPES as readonly string[]).includes(value)
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
