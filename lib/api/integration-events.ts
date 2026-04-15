import { networkFirstGet } from "@/lib/api/http"

export interface IntegrationEvent {
  id: string
  leadId: string | null
  eventType: string
  service: "hubspot" | "zapier" | "internal"
  payload: Record<string, unknown>
  success: boolean
  createdAt: string
}

export async function getIntegrationEvents(
  options: { limit?: number; service?: string } = {}
): Promise<{ data: IntegrationEvent[] }> {
  const params = new URLSearchParams()
  if (options.limit) params.set("limit", String(options.limit))
  if (options.service) params.set("service", options.service)
  const qs = params.toString()
  return networkFirstGet<{ data: IntegrationEvent[] }>(
    `/api/advanced/financial/integration-events${qs ? `?${qs}` : ""}`,
    `integration-events-${options.service ?? "all"}`
  )
}
