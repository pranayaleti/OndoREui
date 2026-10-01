import { submitOrQueue, type SubmissionResult } from "@/lib/api/offline-submit"
import type { MaintenanceRequestPayload } from "@/lib/api/types"

/** Send a maintenance request, or queue it while offline. Throws when the API rejects it. */
export async function submitMaintenanceRequest(payload: MaintenanceRequestPayload): Promise<SubmissionResult> {
  const requestPayload = {
    ...payload,
    submittedAt: payload.submittedAt ?? new Date().toISOString(),
  }
  return submitOrQueue("maintenanceRequest", "/api/maintenance", requestPayload)
}
