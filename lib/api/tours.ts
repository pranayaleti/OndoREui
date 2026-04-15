import { networkFirstGet, postJson } from "@/lib/api/http"

export interface TourBooking {
  id: string
  propertyId: string
  prospectName: string
  prospectEmail: string
  prospectPhone: string | null
  scheduledAt: string
  status: "scheduled" | "completed" | "cancelled" | "no_show"
  accessCode: string | null
  accessExpiresAt: string | null
  feedbackScore: number | null
  feedbackNotes: string | null
  createdAt: string
}

export interface BookTourInput {
  prospectName: string
  prospectEmail: string
  prospectPhone?: string
  scheduledAt: string
}

export async function getPropertyTours(
  propertyId: string
): Promise<{ data: TourBooking[] }> {
  return networkFirstGet<{ data: TourBooking[] }>(
    `/api/advanced/financial/properties/${propertyId}/tours`,
    `tours-${propertyId}`
  )
}

export async function bookTour(
  propertyId: string,
  input: BookTourInput
): Promise<{ data: TourBooking }> {
  return postJson<{ data: TourBooking }>(
    `/api/advanced/financial/properties/${propertyId}/tours`,
    input
  )
}

export async function getTour(
  tourId: string
): Promise<{ data: TourBooking }> {
  return networkFirstGet<{ data: TourBooking }>(
    `/api/advanced/financial/tours/${tourId}`,
    `tour-${tourId}`
  )
}

export async function cancelTour(
  tourId: string
): Promise<{ data: TourBooking }> {
  return postJson<{ data: TourBooking }>(
    `/api/advanced/financial/tours/${tourId}/cancel`,
    {}
  )
}

export async function submitTourFeedback(
  tourId: string,
  score: number,
  notes?: string
): Promise<{ data: unknown }> {
  return postJson<{ data: unknown }>(
    `/api/advanced/financial/tours/${tourId}/feedback`,
    { score, notes }
  )
}
