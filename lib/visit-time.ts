/**
 * Time helpers for the showing pages (/visit/schedule, /visit/confirm).
 * All Ondo homes are in Utah, so the property zone is America/Denver.
 */

export const PROPERTY_TIME_ZONE = "America/Denver"

/** Default length of a showing, used for the calendar entry end time. */
export const VISIT_DURATION_MINUTES = 30

// dateStyle/timeStyle cannot be combined with timeZoneName, so the fields are spelled out.
const DATE_PART: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
}

/**
 * Format a slot in the viewer's own zone with the zone label shown (for example "PDT").
 * When the viewer is not on Utah time, the Utah time is appended so nobody has to guess.
 * Pass `viewerTimeZone` to pin the zone (tests); by default the browser zone is used.
 */
export function formatVisitWhen(iso: string, viewerTimeZone?: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  const local = date.toLocaleString("en-US", { ...DATE_PART, timeZoneName: "short", timeZone: viewerTimeZone })
  const property = date.toLocaleString("en-US", {
    ...DATE_PART,
    timeZoneName: "short",
    timeZone: PROPERTY_TIME_ZONE,
  })
  if (local === property) return local
  const propertyTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone: PROPERTY_TIME_ZONE,
  })
  return `${local} (${propertyTime} at the property)`
}

function toCalendarStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")
}

/** Google Calendar "create event" link with a real duration, title and address. */
export function buildGoogleCalendarUrl(args: {
  startIso: string
  title?: string
  address?: string
  durationMinutes?: number
}): string {
  const start = new Date(args.startIso)
  const end = new Date(start.getTime() + (args.durationMinutes ?? VISIT_DURATION_MINUTES) * 60_000)
  const params = new URLSearchParams({
    text: args.title ? `Property viewing: ${args.title}` : "Property viewing",
    dates: `${toCalendarStamp(start)}/${toCalendarStamp(end)}`,
    details: "Property viewing with Ondo Real Estate",
  })
  if (args.address) params.set("location", args.address)
  return `https://calendar.google.com/calendar/r/eventedit?${params.toString()}`
}
