import { backendUrl } from "@/lib/backend"
import type { MarketingAttribution } from "@/lib/attribution"

export type ContactLeadSource = "website" | "referral" | "direct" | "social" | "ad"

export interface SubmitContactLeadPayload {
  name: string
  email: string
  phone?: string
  message?: string
  propertyId?: string
  source?: ContactLeadSource
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
 * Use from client components (e.g. contact form). Works with static export —
 * no Next.js API route required; the UI calls the backend directly.
 */
export async function submitContactLead(
  payload: SubmitContactLeadPayload
): Promise<SubmitContactLeadSuccess | SubmitContactLeadError> {
  const url = backendUrl("/api/leads/contact")
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
}
