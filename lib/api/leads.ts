import { postJson } from "@/lib/api/http"

export interface LeadCapturePayload {
  email: string
  source: string
  calculatorSlug?: string
}

export interface LeadCaptureResponse {
  success: boolean
}

const LEAD_STORAGE_KEY = "ondo_lead_captured"

export function hasLeadBeenCaptured(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(LEAD_STORAGE_KEY) === "true"
}

export function markLeadCaptured(email: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(LEAD_STORAGE_KEY, "true")
  localStorage.setItem("ondo_lead_email", email)
}

export async function submitLead(payload: LeadCapturePayload): Promise<boolean> {
  try {
    const res = await postJson<LeadCaptureResponse, LeadCapturePayload>("/api/leads/capture", payload)
    return res?.success ?? false
  } catch {
    return false
  }
}
