import { networkFirstGet, postJson } from "@/lib/api/http"

export interface VacancyListing {
  id: string
  propertyId: string
  listingTitle: string
  listingDescription: string | null
  askingRent: number | null
  availableDate: string | null
  status: "draft" | "active" | "paused" | "filled" | "expired"
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ListingSyndication {
  id: string
  listingId: string
  platform: string
  status: "pending" | "active" | "failed" | "removed"
  lastSyncedAt: string | null
  errorMessage: string | null
  leadsCount: number
}

export interface SyndicationResult {
  listingId: string
  syndications: ListingSyndication[]
}

export async function getListingSyndications(
  listingId: string
): Promise<{ data: ListingSyndication[] }> {
  return networkFirstGet<{ data: ListingSyndication[] }>(
    `/api/properties/listings/${listingId}/syndications`,
    `syndications-${listingId}`
  )
}

export async function syndicateListing(
  listingId: string,
  platforms: string[]
): Promise<{ data: SyndicationResult }> {
  return postJson<{ data: SyndicationResult }>(
    `/api/properties/listings/${listingId}/syndicate`,
    { platforms }
  )
}

export async function getListingFeed(
  listingId: string
): Promise<{ data: unknown }> {
  return networkFirstGet<{ data: unknown }>(
    `/api/properties/listings/${listingId}/feed`,
    `listing-feed-${listingId}`
  )
}
