import { networkFirstGet, postJson } from "@/lib/api/http"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface LeaseRenewal {
  id: string
  leaseId: string
  propertyId: string
  tenantId: string
  proposedStart: string
  proposedEnd: string
  proposedRent: number
  currentRent: number
  rentChangePct: number
  status: string
  responseDeadline: string | null
  noticeSentAt: string | null
  tenantResponseAt: string | null
  notes: string | null
  createdAt: string
}

export interface CreateRenewalOfferInput {
  leaseId: string
  propertyId: string
  tenantId: string
  proposedStart: string
  proposedEnd: string
  proposedRent: number
  currentRent: number
  responseDeadlineDays?: number
  notes?: string
}

/* ------------------------------------------------------------------ */
/*  API calls                                                          */
/* ------------------------------------------------------------------ */

export async function getRenewals(
  propertyId: string,
  status?: string
): Promise<LeaseRenewal[]> {
  const query = status ? `?status=${status}` : ""
  const res = await networkFirstGet<{ data: LeaseRenewal[] }>(
    `/api/experience/properties/${propertyId}/lease-renewals${query}`,
    `lease-renewals-${propertyId}-${status ?? "all"}`
  )
  return res.data ?? []
}

export async function getUpcomingRenewals(
  daysAhead = 90
): Promise<LeaseRenewal[]> {
  const res = await networkFirstGet<{ data: LeaseRenewal[] }>(
    `/api/experience/lease-renewals/upcoming?daysAhead=${daysAhead}`,
    `upcoming-renewals-${daysAhead}`
  )
  return res.data ?? []
}

export async function createRenewalOffer(
  input: CreateRenewalOfferInput
): Promise<LeaseRenewal> {
  const res = await postJson<{ data: LeaseRenewal }>(
    "/api/experience/lease-renewals",
    input
  )
  return res.data
}

export async function sendRenewalNotice(
  renewalId: string
): Promise<LeaseRenewal> {
  const res = await postJson<{ data: LeaseRenewal }>(
    `/api/experience/lease-renewals/${renewalId}/send`,
    {}
  )
  return res.data
}
