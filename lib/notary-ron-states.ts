// lib/notary-ron-states.ts
import { US_STATES } from "./notary-service-areas"

export type RonServingStatus = "serves" | "does_not_serve"

export type RonStateRecord = {
  code: string
  name: string
  slug: string
  ronServingStatus: RonServingStatus
  statusNote?: string
  lastReviewed: string
}

export const RESERVED_NOTARY_SEGMENTS: ReadonlySet<string> = new Set([
  "on-demand",
  "locations",
])

const LAST_REVIEWED = "2026-07-14"

const DC: RonStateRecord = {
  code: "DC",
  name: "District of Columbia",
  slug: "district-of-columbia",
  ronServingStatus: "serves",
  statusNote:
    "Remote online notarization is available for clients in Washington, D.C. Receiving parties (lenders, title companies, courts) set their own acceptance rules.",
  lastReviewed: LAST_REVIEWED,
}

const fromUsStates: RonStateRecord[] = Object.entries(US_STATES).map(([code, data]) => ({
  code,
  name: data.name,
  slug: data.slug,
  ronServingStatus: "serves" as const,
  statusNote:
    `Remote online notarization is available for clients in ${data.name}. Receiving parties (lenders, title companies, courts) set their own acceptance rules — confirm before your signing.`,
  lastReviewed: LAST_REVIEWED,
}))

export const NOTARY_RON_STATES: RonStateRecord[] = [...fromUsStates, DC].sort((a, b) =>
  a.name.localeCompare(b.name)
)

export function getRonStateBySlug(slug: string): RonStateRecord | undefined {
  return NOTARY_RON_STATES.find((s) => s.slug === slug)
}

export function getServedRonStates(): RonStateRecord[] {
  return NOTARY_RON_STATES.filter((s) => s.ronServingStatus === "serves")
}

export function isReservedNotarySegment(segment: string): boolean {
  return RESERVED_NOTARY_SEGMENTS.has(segment.toLowerCase())
}
