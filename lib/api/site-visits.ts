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
