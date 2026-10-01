import { getAttributionPayloadForApi } from "@/lib/attribution"
import { submitOrQueue, type SubmissionResult } from "@/lib/api/offline-submit"
import type { PropertyInquiryPayload } from "@/lib/api/types"

/**
 * Send a property inquiry through the same lead endpoint as every other form
 * (POST /api/leads/contact), or queue it while offline. Throws when the API rejects it.
 */
export async function submitPropertyInquiry(payload: PropertyInquiryPayload): Promise<SubmissionResult> {
  const attribution = getAttributionPayloadForApi()
  const body = {
    name: payload.fullName.trim(),
    email: payload.email.trim(),
    ...(payload.phone?.trim() && { phone: payload.phone.trim() }),
    message: payload.message.trim() || "Inquiry about this property.",
    propertyId: payload.propertyId,
    source: "website",
    inquiryType: "renter",
    ...(attribution && { attribution }),
  }
  return submitOrQueue("propertyInquiry", "/api/leads/contact", body)
}
