import { networkFirstGet } from "@/lib/api/http"

export interface PropertySatisfaction {
  propertyId: string
  averageRating: number
  npsScore: number
  responseCount: number
  trend: "improving" | "declining" | "stable"
  monthlyScores: Array<{ month: string; averageRating: number; responseCount: number }>
}

export interface PortfolioSatisfactionItem {
  propertyId: string
  propertyTitle: string
  averageRating: number
  npsScore: number
  responseCount: number
  trend: "improving" | "declining" | "stable"
}

export interface LowSatisfactionAlert {
  propertyId: string
  propertyTitle: string
  averageRating: number
  npsScore: number
  responseCount: number
}

export async function getPropertySatisfaction(
  propertyId: string
): Promise<{ data: PropertySatisfaction }> {
  return networkFirstGet<{ data: PropertySatisfaction }>(
    `/api/experience/properties/${propertyId}/satisfaction`,
    `satisfaction-${propertyId}`
  )
}

export async function getPortfolioSatisfaction(): Promise<{ data: PortfolioSatisfactionItem[] }> {
  return networkFirstGet<{ data: PortfolioSatisfactionItem[] }>(
    "/api/experience/owner/satisfaction",
    "satisfaction-portfolio"
  )
}

export async function getSatisfactionAlerts(
  threshold = 3.0
): Promise<{ data: LowSatisfactionAlert[] }> {
  return networkFirstGet<{ data: LowSatisfactionAlert[] }>(
    `/api/experience/owner/satisfaction/alerts?threshold=${threshold}`,
    "satisfaction-alerts"
  )
}
