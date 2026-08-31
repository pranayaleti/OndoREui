import { analytics } from "@/lib/analytics"

export const RENTAL_FUNNEL_CATEGORY = "rental_funnel"

export const RENTAL_FUNNEL_ACTIONS = [
  "property_view",
  "apply_click",
  "application_started",
  "application_completed",
  "application_submitted",
  "application_abandoned",
  "tour_requested",
  "lead_submitted",
  "lead_converted",
] as const

export type RentalFunnelAction = (typeof RENTAL_FUNNEL_ACTIONS)[number]

/**
 * Funnel events for rental apply. `propertyRef` may be a public listing id or
 * property UUID — never an applicant name, email, SSN, or document contents.
 */
export function trackRentalFunnel(action: RentalFunnelAction, propertyRef?: string): void {
  analytics.trackEvent(`rental_${action}`, RENTAL_FUNNEL_CATEGORY, propertyRef)
}
