/**
 * Listing-detail presentation helpers.
 * Every label is derived from the public property payload. Nothing here
 * invents fees, availability, amenities, or neighborhood facts.
 */

export type AmenityGroupId =
  | "interior"
  | "outdoor"
  | "parking"
  | "pets"
  | "building"
  | "other"

export type AmenityGroup = {
  id: AmenityGroupId
  label: string
  items: { raw: string; label: string }[]
}

export type ListingHighlight = {
  id: string
  label: string
}

export type AvailabilityTone = "now" | "upcoming" | "listed" | "ask"

export type AvailabilityBadge = {
  label: string
  tone: AvailabilityTone
}

export type CostRow = {
  id: string
  label: string
  value: string
  /** Confirmed listing field vs. an absence we refuse to fill in. */
  source: "listing"
}

const AMENITY_LABELS: Record<string, string> = {
  parking: "Parking",
  gym: "Gym/Fitness Center",
  pool: "Swimming Pool",
  laundry: "Laundry Facilities",
  elevator: "Elevator",
  balcony: "Balcony/Terrace",
  air_conditioning: "Air Conditioning",
  heating: "Heating",
  dishwasher: "Dishwasher",
  microwave: "Microwave",
  refrigerator: "Refrigerator",
  washer_dryer: "Washer/Dryer",
  internet: "Internet/WiFi",
  cable_tv: "Cable TV",
  security: "Security System",
  doorman: "Doorman/Concierge",
  pet_friendly: "Pets allowed",
  garden: "Garden/Yard",
  fireplace: "Fireplace",
  storage: "Storage Space",
  "pet friendly": "Pets allowed",
  "in-unit laundry": "In-unit laundry",
  "in_unit_laundry": "In-unit laundry",
  garage: "Garage",
  backyard: "Backyard",
  "central air": "Air Conditioning",
  "central-air": "Air Conditioning",
}

const HIGHLIGHT_RULES: { id: string; pattern: RegExp; label: string }[] = [
  { id: "laundry", pattern: /laundry|washer|dryer/, label: "Laundry" },
  { id: "parking", pattern: /parking|garage|carport|driveway/, label: "Parking" },
  { id: "pets", pattern: /\bpet|\bdog|\bcat/, label: "Pets allowed" },
  { id: "ac", pattern: /air.?condition|central.?air|\bac\b/, label: "Air conditioning" },
  { id: "dishwasher", pattern: /dishwasher/, label: "Dishwasher" },
  { id: "outdoor", pattern: /yard|garden|backyard|patio|balcony|terrace/, label: "Outdoor space" },
  { id: "pool", pattern: /\bpool\b/, label: "Pool" },
  { id: "gym", pattern: /\bgym\b|fitness/, label: "Fitness center" },
  { id: "fireplace", pattern: /fireplace/, label: "Fireplace" },
]

const GROUP_ORDER: AmenityGroupId[] = [
  "interior",
  "outdoor",
  "parking",
  "pets",
  "building",
  "other",
]

export function formatMonthlyRent(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatRoomCount(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value)
}

export function formatSqft(sqft: number): string | null {
  if (!sqft || sqft <= 0) return null
  return `${new Intl.NumberFormat("en-US").format(sqft)} sq ft`
}

export function formatPropertyType(type: string | null | undefined): string | null {
  if (!type || !type.trim()) return null
  const cleaned = type.trim().replace(/[_-]+/g, " ")
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase())
}

export function formatAmenityLabel(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return trimmed
  const keyed = AMENITY_LABELS[trimmed.toLowerCase().replace(/\s+/g, "_")]
  if (keyed) return keyed
  const spacedKey = AMENITY_LABELS[trimmed.toLowerCase()]
  if (spacedKey) return spacedKey
  if (/[A-Z]/.test(trimmed) && / /.test(trimmed)) return trimmed
  return trimmed
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function amenityKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/[_-]+/g, " ")
}

function classifyAmenity(raw: string): AmenityGroupId {
  const key = amenityKey(raw)
  if (/\bpet|\bdog|\bcat/.test(key)) return "pets"
  if (/parking|garage|carport|driveway/.test(key)) return "parking"
  if (/yard|garden|backyard|patio|balcony|terrace|pool/.test(key)) return "outdoor"
  if (
    /laundry|washer|dryer|dishwasher|microwave|refrigerator|fireplace|heating|air condition|central air|\bac\b|hardwood|furnished/.test(
      key,
    )
  ) {
    return "interior"
  }
  if (
    /gym|fitness|elevator|doorman|concierge|security|storage|internet|wifi|cable|doorman/.test(
      key,
    )
  ) {
    return "building"
  }
  return "other"
}

function groupLabel(id: AmenityGroupId): string {
  switch (id) {
    case "interior":
      return "Inside"
    case "outdoor":
      return "Outdoor"
    case "parking":
      return "Parking"
    case "pets":
      return "Pets"
    case "building":
      return "Building"
    case "other":
      return "Also listed"
    default: {
      const _exhaustive: never = id
      return _exhaustive
    }
  }
}

export function groupAmenities(amenities: string[] | null | undefined): AmenityGroup[] {
  const buckets = new Map<AmenityGroupId, AmenityGroup["items"]>()
  for (const raw of amenities ?? []) {
    const label = formatAmenityLabel(raw)
    if (!label) continue
    const id = classifyAmenity(raw)
    const list = buckets.get(id) ?? []
    if (list.some((item) => item.label === label)) continue
    list.push({ raw, label })
    buckets.set(id, list)
  }
  return GROUP_ORDER.flatMap((id) => {
    const items = buckets.get(id)
    if (!items?.length) return []
    return [{ id, label: groupLabel(id), items }]
  })
}

export function listingHighlights(input: {
  amenities?: string[] | null
  type?: string | null
  sqft?: number
  leaseTerms?: string | null
}): ListingHighlight[] {
  const keys = (input.amenities ?? []).map(amenityKey)
  const highlights: ListingHighlight[] = []

  for (const rule of HIGHLIGHT_RULES) {
    if (keys.some((key) => rule.pattern.test(key))) {
      highlights.push({ id: rule.id, label: rule.label })
    }
  }

  return highlights.slice(0, 6)
}

export function petNotesFromAmenities(
  amenities: string[] | null | undefined,
): { raw: string; label: string }[] {
  return (amenities ?? [])
    .filter((raw) => /\bpet|\bdog|\bcat/.test(amenityKey(raw)))
    .map((raw) => ({ raw, label: formatAmenityLabel(raw) }))
}

function parseListingDate(raw: string): Date | null {
  const trimmed = raw.trim()
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed)
  if (iso) {
    return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
  }
  const us = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed)
  if (us) {
    return new Date(Number(us[3]), Number(us[1]) - 1, Number(us[2]))
  }
  return null
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function formatMoveInDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function availabilityBadge(
  availability: string | null | undefined,
  now: Date = new Date(),
): AvailabilityBadge {
  const raw = availability?.trim() ?? ""
  if (!raw) {
    return { label: "Ask leasing for move-in", tone: "ask" }
  }

  const lowered = raw.toLowerCase()
  if (/^(now|immediately|available now|available immediately)$/.test(lowered)) {
    return { label: "Available now", tone: "now" }
  }

  const parsed = parseListingDate(raw)
  if (parsed) {
    if (startOfDay(parsed).getTime() <= startOfDay(now).getTime()) {
      return { label: "Available now", tone: "now" }
    }
    return { label: `Available ${formatMoveInDate(parsed)}`, tone: "upcoming" }
  }

  return { label: raw, tone: "listed" }
}

export function listingCostRows(input: {
  price: number
  fees?: string | null
  leaseTerms?: string | null
}): CostRow[] {
  const rows: CostRow[] = [
    {
      id: "rent",
      label: "Listed monthly rent",
      value: `${formatMonthlyRent(input.price)}/mo`,
      source: "listing",
    },
  ]
  const fees = input.fees?.trim()
  if (fees) {
    rows.push({ id: "fees", label: "Listed fees", value: fees, source: "listing" })
  }
  const terms = input.leaseTerms?.trim()
  if (terms) {
    rows.push({ id: "lease", label: "Lease terms", value: terms, source: "listing" })
  }
  return rows
}

export function bedsLabel(bedrooms: number): string {
  if (bedrooms === 0) return "Studio"
  return `${formatRoomCount(bedrooms)} ${bedrooms === 1 ? "bed" : "beds"}`
}

export function bathsLabel(bathrooms: number): string {
  return `${formatRoomCount(bathrooms)} ${bathrooms === 1 ? "bath" : "baths"}`
}
