// lib/api/site-visits.ts
import { backendUrl } from "@/lib/backend";

export interface SiteVisitPublic {
  id: string;
  leadId: string;
  propertyId: string;
  proposedSlots: string[];
  status: string;
  scheduledAt: string | null;
  properties?: { title: string; addressLine1: string; city: string };
}

const FETCH_TIMEOUT_MS = 15_000;

/** A non-2xx answer from the site-visits API, carrying the status so callers can tell a dead link from an outage. */
export class SiteVisitHttpError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "SiteVisitHttpError";
    this.status = status;
  }
}

/** True only when the API says the token matches nothing (404). Timeouts, network errors and 5xx are not "link invalid". */
export function isLinkNotFoundError(error: unknown): boolean {
  return error instanceof SiteVisitHttpError && error.status === 404;
}

export async function getVisitByToken(token: string): Promise<SiteVisitPublic> {
  const res = await fetch(backendUrl(`/api/site-visits/by-token/${encodeURIComponent(token)}`), {
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new SiteVisitHttpError("Visit not found", res.status);
  return res.json();
}

export type ListingAvailabilitySlot = {
  id: string;
  propertyId: string;
  startsAt: string;
  endsAt: string;
  isBooked: boolean;
  createdAt: string;
};

export type SchedulePayload = {
  occupancy: "vacant" | "occupied";
  propertyTitle: string;
  propertyCity: string | null;
  tourType: "in_person" | "virtual" | null;
  windows: ListingAvailabilitySlot[];
  existingVisit: { id: string; status: string; scheduledAt: string | null } | null;
};

export async function getSchedule(token: string): Promise<SchedulePayload> {
  const res = await fetch(backendUrl(`/api/site-visits/schedule/${encodeURIComponent(token)}`), {
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new SiteVisitHttpError("Schedule not found", res.status);
  return res.json();
}

export async function bookSchedule(
  token: string,
  slotId: string,
): Promise<{ id: string; scheduledAt: string; propertyTitle: string }> {
  const res = await fetch(backendUrl(`/api/site-visits/schedule/${encodeURIComponent(token)}`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slotId }),
  });
  if (!res.ok) throw new Error("Booking failed");
  const json = (await res.json()) as { data: { id: string; scheduledAt: string; propertyTitle: string } };
  return json.data;
}

export async function rescheduleSchedule(
  token: string,
  slotId: string,
): Promise<{ id: string; scheduledAt: string }> {
  const res = await fetch(backendUrl(`/api/site-visits/schedule/${encodeURIComponent(token)}/reschedule`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slotId }),
  });
  if (!res.ok) throw new Error("Reschedule failed");
  const json = (await res.json()) as { data: { id: string; scheduledAt: string } };
  return json.data;
}

export async function cancelSchedule(token: string): Promise<{ id: string; status: string }> {
  const res = await fetch(backendUrl(`/api/site-visits/schedule/${encodeURIComponent(token)}/cancel`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Cancel failed");
  const json = (await res.json()) as { data: { id: string; status: string } };
  return json.data;
}

export async function confirmVisit(
  visitId: string,
  token: string,
  slotIndex: number,
): Promise<{ scheduledAt: string; propertyTitle: string }> {
  const res = await fetch(backendUrl(`/api/site-visits/${encodeURIComponent(visitId)}/confirm?token=${encodeURIComponent(token)}`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slotIndex }),
  });
  if (!res.ok) throw new Error("Confirmation failed");
  return res.json();
}
