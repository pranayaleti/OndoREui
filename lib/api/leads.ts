import { getAttributionPayloadForApi } from "@/lib/attribution"
import { buildLeadMessage, submitContactLead } from "@/lib/leads-api"
import { SecureStorage } from "@/lib/security"

export interface LeadCapturePayload {
  email: string
  source: string
  calculatorSlug?: string
}

const LEAD_STORAGE_KEY = "ondo_lead_captured"

// Browser storage can be blocked (Safari, or "block all site data" in Firefox and Chrome) and then
// throws on access. SecureStorage catches that: a blocked read means "not captured yet", and a
// blocked write only means the card shows again next visit. It must never reach a calculator's
// error boundary.
export function hasLeadBeenCaptured(): boolean {
  return SecureStorage.getItem(LEAD_STORAGE_KEY) === "true"
}

export function markLeadCaptured(email: string): void {
  SecureStorage.setItem(LEAD_STORAGE_KEY, "true")
  SecureStorage.setItem("ondo_lead_email", email)
}

/**
 * Send a calculator email capture through the same endpoint as every other
 * lead form (POST /api/leads/contact). The visitor gives only an email, so the
 * name is a plain label and the calculator they used goes in the message.
 * Resolves true only when the lead was saved.
 */
export async function submitLead(payload: LeadCapturePayload): Promise<boolean> {
  const attribution = getAttributionPayloadForApi()
  const result = await submitContactLead({
    name: "Calculator visitor",
    email: payload.email.trim(),
    source: "website",
    inquiryType: "other",
    message: buildLeadMessage([
      ["Request", "Follow-up after using a calculator"],
      ["Calculator", payload.source],
      ["Calculator slug", payload.calculatorSlug],
    ]),
    ...(attribution && { attribution }),
  }, { formName: payload.calculatorSlug ? `calculator_${payload.calculatorSlug}` : "calculator_follow_up" })
  return !("error" in result)
}
