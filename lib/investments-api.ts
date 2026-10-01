import { backendUrl } from "@/lib/backend"
import type { InvestmentOpportunity } from "@/lib/investments-data"

/** Response shape from the backend (snake_case converted to camelCase). */
export type ApiOpportunity = InvestmentOpportunity & { id?: string }

/**
 * Fetch all investment opportunities from the backend (client-side).
 * Use from browser client components. Throws on a non-2xx response so callers can show an error
 * state instead of an empty list. (The WebMCP tools read the sample records directly.)
 */
export async function fetchOpportunitiesClient(): Promise<ApiOpportunity[]> {
  const url = backendUrl("/api/investments/opportunities")
  const res = await fetch(url, { headers: { Accept: "application/json" } })
  if (!res.ok) {
    throw new Error(`Investments API error: ${res.status}`)
  }
  const data = await res.json()
  if (!Array.isArray(data)) {
    throw new Error("Investments API returned non-array")
  }
  return data as ApiOpportunity[]
}

/**
 * Fetch a single investment opportunity by slug (client-side).
 * Use from browser client components. Returns null on 404; throws on any other non-2xx response.
 */
export async function fetchOpportunityBySlugClient(slug: string): Promise<ApiOpportunity | null> {
  if (!slug || typeof slug !== "string") return null
  const url = backendUrl(`/api/investments/opportunities/${encodeURIComponent(slug.trim())}`)
  const res = await fetch(url, { headers: { Accept: "application/json" } })
  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error(`Investments API error: ${res.status}`)
  }
  const data = await res.json().catch(() => null)
  return data as ApiOpportunity | null
}
