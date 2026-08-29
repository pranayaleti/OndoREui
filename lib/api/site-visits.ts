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

export async function getVisitByToken(token: string): Promise<SiteVisitPublic> {
  const res = await fetch(backendUrl(`/api/site-visits/by-token/${token}`));
  if (!res.ok) throw new Error("Visit not found");
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
  const res = await fetch(backendUrl(`/api/site-visits/schedule/${token}`));
  if (!res.ok) throw new Error("Schedule not found");
  return res.json();
}

export async function bookSchedule(
  token: string,
  slotId: string,
): Promise<{ id: string; scheduledAt: string; propertyTitle: string }> {
  const res = await fetch(backendUrl(`/api/site-visits/schedule/${token}`), {
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
  const res = await fetch(backendUrl(`/api/site-visits/schedule/${token}/reschedule`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slotId }),
  });
  if (!res.ok) throw new Error("Reschedule failed");
  const json = (await res.json()) as { data: { id: string; scheduledAt: string } };
  return json.data;
}

export async function cancelSchedule(token: string): Promise<{ id: string; status: string }> {
  const res = await fetch(backendUrl(`/api/site-visits/schedule/${token}/cancel`), {
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
  const res = await fetch(backendUrl(`/api/site-visits/${visitId}/confirm?token=${token}`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slotIndex }),
  });
  if (!res.ok) throw new Error("Confirmation failed");
  return res.json();
}
