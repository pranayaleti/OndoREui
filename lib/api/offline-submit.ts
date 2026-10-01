import { isRetryableRequestError, postJson } from "@/lib/api/http"
import { enqueueSyncItem, triggerSync, type SyncQueueType } from "@/lib/pwa/offline-queue"

export interface SubmissionResult {
  queued: boolean
  success: boolean
}

/**
 * POST a form, or save it for the service worker to send when the connection is back.
 *
 * Saved only when there is no connection or the server could not take it right now (network
 * failure, timeout, 5xx, 429). A request the API rejects (any other 4xx) is thrown to the
 * caller with the server's message, because retrying it would fail the same way and tell the
 * visitor it was sent when it was not.
 */
export async function submitOrQueue(
  type: SyncQueueType,
  endpoint: string,
  payload: unknown,
): Promise<SubmissionResult> {
  if (typeof navigator === "undefined" || navigator.onLine) {
    try {
      await postJson(endpoint, payload)
      return { success: true, queued: false }
    } catch (error) {
      if (!isRetryableRequestError(error)) throw error
    }
  }

  await enqueueSyncItem(type, endpoint, payload)
  // The item is already saved, so a sync that cannot start is not the visitor's problem.
  void triggerSync(type).catch(() => {})
  return { success: true, queued: true }
}
