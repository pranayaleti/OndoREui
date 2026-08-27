export const LISTING_PACKET_TIMING_VALUES = [
  "ready_now",
  "1_to_3",
  "3_to_6",
  "6_to_12",
  "exploring",
] as const

export type ListingPacketTiming = (typeof LISTING_PACKET_TIMING_VALUES)[number]

export const LISTING_PACKET_TIMING_LABEL_KEYS: Record<ListingPacketTiming, string> = {
  ready_now: "listingPacket.timing.readyNow",
  "1_to_3": "listingPacket.timing.oneToThree",
  "3_to_6": "listingPacket.timing.threeToSix",
  "6_to_12": "listingPacket.timing.sixToTwelve",
  exploring: "listingPacket.timing.exploring",
}

/** English labels stored on the lead message so CRM routing is readable. */
export const LISTING_PACKET_TIMING_EN: Record<ListingPacketTiming, string> = {
  ready_now: "Ready now",
  "1_to_3": "1–3 months",
  "3_to_6": "3–6 months",
  "6_to_12": "6–12 months",
  exploring: "Just exploring",
}

const MESSAGE_MAX = 2000

export function isListingPacketTiming(value: string): value is ListingPacketTiming {
  return (LISTING_PACKET_TIMING_VALUES as readonly string[]).includes(value)
}

export function buildListingPacketMessage(input: {
  address: string
  timing: ListingPacketTiming
  notes?: string
  photosNote?: string
}): string {
  const lines = [
    "Listing packet request",
    `Property address: ${input.address.trim()}`,
    `Timing: ${LISTING_PACKET_TIMING_EN[input.timing]}`,
    input.notes?.trim() ? `Notes: ${input.notes.trim()}` : null,
    input.photosNote?.trim()
      ? `Photos/docs (description only, no upload): ${input.photosNote.trim()}`
      : "Photos/docs: none described — request files by email if needed.",
  ]
  return lines.filter((line): line is string => Boolean(line)).join("\n").slice(0, MESSAGE_MAX)
}
