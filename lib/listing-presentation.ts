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

export type MarketStatusTone = "lease" | "sale" | "pending" | "leased" | "sold"

export type MarketStatusBadge = {
  label: string
  tone: MarketStatusTone
}

/**
 * Maps real Ondo listing status (+ optional listingKind) to a public badge.
 * Public inventory today is approved vacant rentals → For Lease.
 * Does not invent For Sale / Sold unless listingKind is actually sale.
 */
export function listingMarketStatus(input: {
  status?: string | null
  listingKind?: "lease" | "sale" | null
}): MarketStatusBadge | null {
  const status = input.status?.trim().toLowerCase() ?? ""
  const kind = input.listingKind ?? "lease"

  if (status === "rejected") return null

  if (status === "pending") {
    return { label: "Pending", tone: "pending" }
  }

  if (kind === "sale") {
    if (status === "occupied") return { label: "Sold", tone: "sold" }
    return { label: "For Sale", tone: "sale" }
  }

  if (status === "occupied") {
    return { label: "Leased", tone: "leased" }
  }

  return { label: "For Lease", tone: "lease" }
}

export function marketStatusBadgeClass(tone: MarketStatusTone): string {
  switch (tone) {
    case "lease":
      return "border-transparent bg-primary text-primary-foreground"
    case "sale":
      return "border-transparent bg-foreground text-background"
    case "pending":
      return "border-transparent bg-secondary text-secondary-foreground"
    case "leased":
    case "sold":
      return "border-border bg-muted text-muted-foreground"
    default: {
      const _exhaustive: never = tone
      return _exhaustive
    }
  }
}

export type ListingSpecRow = {
  id: string
  label: string
  value: string
}

export function formatLotSqft(lotSqft: number): string | null {
  if (!lotSqft || lotSqft <= 0) return null
  return `${new Intl.NumberFormat("en-US").format(lotSqft)} sq ft lot`
}

export function formatCapRate(capRate: number): string | null {
  if (!Number.isFinite(capRate) || capRate <= 0) return null
  return `${capRate.toLocaleString("en-US", { maximumFractionDigits: 2 })}%`
}

export function formatPricePerSqft(price: number, sqft: number): string | null {
  if (!price || price <= 0 || !sqft || sqft <= 0) return null
  const per = price / sqft
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: per < 10 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(per)
}

export function listingSpecRows(input: {
  price: number
  listingKind?: "lease" | "sale" | null
  type?: string | null
  bedrooms: number
  bathrooms: number
  sqft: number
  leaseTerms?: string | null
  fees?: string | null
  availability?: string | null
  yearBuilt?: number | null
  lotSqft?: number | null
  parking?: string | null
  stories?: number | null
  units?: number | null
  occupancy?: string | null
  zoning?: string | null
  yearRenovated?: number | null
  hoa?: string | null
  taxes?: string | null
  availableSqft?: number | null
  amenities?: string[] | null
}): ListingSpecRow[] {
  const rows: ListingSpecRow[] = []
  const kind = input.listingKind ?? "lease"
  if (input.price > 0) {
    rows.push({
      id: "price",
      label: kind === "sale" ? "Listed price" : "Listed monthly rent",
      value: kind === "sale" ? formatMonthlyRent(input.price) : `${formatMonthlyRent(input.price)}/mo`,
    })
  }
  const typeLabel = formatPropertyType(input.type)
  if (typeLabel) rows.push({ id: "type", label: "Property type", value: typeLabel })
  rows.push({ id: "beds", label: "Beds", value: bedsLabel(input.bedrooms) })
  rows.push({ id: "baths", label: "Baths", value: bathsLabel(input.bathrooms) })
  const sqftLabel = formatSqft(input.sqft)
  if (sqftLabel) rows.push({ id: "sqft", label: "Building size", value: sqftLabel })
  const lot = input.lotSqft != null ? formatLotSqft(input.lotSqft) : null
  if (lot) rows.push({ id: "lot", label: "Lot size", value: lot })
  if (input.yearBuilt && input.yearBuilt > 1800) {
    rows.push({ id: "yearBuilt", label: "Year built", value: String(input.yearBuilt) })
  }
  if (input.yearRenovated && input.yearRenovated > 1800) {
    rows.push({ id: "yearRenovated", label: "Year renovated", value: String(input.yearRenovated) })
  }
  if (input.zoning?.trim()) rows.push({ id: "zoning", label: "Zoning", value: input.zoning.trim() })
  if (input.parking?.trim()) rows.push({ id: "parking", label: "Parking", value: input.parking.trim() })
  else {
    const parkingAmenity = (input.amenities ?? []).find((a) =>
      /parking|garage|carport|driveway/.test(a.toLowerCase()),
    )
    if (parkingAmenity) {
      rows.push({ id: "parking", label: "Parking", value: formatAmenityLabel(parkingAmenity) })
    }
  }
  if (input.stories && input.stories > 0) {
    rows.push({ id: "stories", label: "Stories", value: String(input.stories) })
  }
  if (input.units && input.units > 0) {
    rows.push({ id: "units", label: "Units", value: String(input.units) })
  }
  if (input.occupancy?.trim()) rows.push({ id: "occupancy", label: "Occupancy", value: input.occupancy.trim() })
  if (input.hoa?.trim()) rows.push({ id: "hoa", label: "HOA", value: input.hoa.trim() })
  if (input.taxes?.trim()) rows.push({ id: "taxes", label: "Taxes", value: input.taxes.trim() })
  const available = input.availableSqft != null ? formatSqft(input.availableSqft) : null
  if (available) rows.push({ id: "availableSqft", label: "Available space", value: available })
  const terms = input.leaseTerms?.trim()
  if (terms) rows.push({ id: "lease", label: "Lease terms", value: terms })
  const fees = input.fees?.trim()
  if (fees) rows.push({ id: "fees", label: "Listed fees", value: fees })
  return rows
}

export type ListingMetricRow = {
  id: string
  label: string
  value: string
}

/** Investment figures only from listing fields. Never fabricates cap rate, NOI, or occupancy. */
export function listingMetricRows(input: {
  price: number
  sqft: number
  listingKind?: "lease" | "sale" | null
  capRate?: number | null
  noi?: number | null
  occupancy?: string | null
  leaseTerms?: string | null
}): ListingMetricRow[] {
  const rows: ListingMetricRow[] = []
  const kind = input.listingKind ?? "lease"
  const perSf = formatPricePerSqft(input.price, input.sqft)
  if (perSf) {
    rows.push({
      id: "priceSf",
      label: kind === "sale" ? "Price / sq ft" : "Rent / sq ft",
      value: perSf,
    })
  }
  const cap = input.capRate != null ? formatCapRate(input.capRate) : null
  if (cap) rows.push({ id: "capRate", label: "Cap rate", value: cap })
  if (input.noi != null && input.noi > 0) {
    rows.push({
      id: "noi",
      label: "NOI",
      value: formatMonthlyRent(input.noi),
    })
  }
  if (input.occupancy?.trim()) {
    rows.push({ id: "occupancy", label: "Occupancy", value: input.occupancy.trim() })
  }
  if (input.leaseTerms?.trim()) {
    rows.push({ id: "lease", label: "Lease term", value: input.leaseTerms.trim() })
  }
  return rows
}

export type DescriptionSectionId =
  | "overview"
  | "highlights"
  | "location"
  | "financial"
  | "building"
  | "additional"

export type DescriptionSection = {
  id: DescriptionSectionId
  title: string
  paragraphs?: string[]
  bullets?: string[]
}

export function listingDescriptionSections(input: {
  description?: string | null
  highlights: ListingHighlight[]
  address: string
  city?: string | null
  state?: string | null
  costRows: CostRow[]
  type?: string | null
  sqft?: number
  amenities?: string[] | null
  fees?: string | null
  leaseTerms?: string | null
  website?: string | null
}): DescriptionSection[] {
  const sections: DescriptionSection[] = []
  const overview = input.description?.trim()
  if (overview) {
    sections.push({ id: "overview", title: "Overview", paragraphs: [overview] })
  }
  if (input.highlights.length > 0) {
    sections.push({
      id: "highlights",
      title: "Highlights",
      bullets: input.highlights.map((h) => h.label),
    })
  }
  if (input.address.trim()) {
    const locationBits = [input.address]
    const cityState = [input.city, input.state].filter(Boolean).join(", ")
    if (cityState && !input.address.includes(cityState)) locationBits.push(cityState)
    sections.push({ id: "location", title: "Location", paragraphs: locationBits })
  }
  if (input.costRows.length > 0) {
    sections.push({
      id: "financial",
      title: "Financial",
      bullets: input.costRows.map((row) => `${row.label}: ${row.value}`),
    })
  }
  const buildingBits: string[] = []
  const typeLabel = formatPropertyType(input.type)
  if (typeLabel) buildingBits.push(typeLabel)
  const sqftLabel = input.sqft != null ? formatSqft(input.sqft) : null
  if (sqftLabel) buildingBits.push(sqftLabel)
  const amenityLabels = (input.amenities ?? [])
    .map((raw) => formatAmenityLabel(raw))
    .filter(Boolean)
  if (buildingBits.length > 0 || amenityLabels.length > 0) {
    sections.push({
      id: "building",
      title: "Building",
      bullets: [...buildingBits, ...amenityLabels],
    })
  }
  const extra: string[] = []
  if (input.fees?.trim()) extra.push(`Listed fees: ${input.fees.trim()}`)
  if (input.leaseTerms?.trim()) extra.push(`Lease terms: ${input.leaseTerms.trim()}`)
  if (input.website?.trim() && !listingEmbedFromUrl(input.website)) {
    extra.push(input.website.trim())
  }
  if (extra.length > 0) {
    sections.push({ id: "additional", title: "Additional details", bullets: extra })
  }
  return sections
}

export type ListingEmbedKind = "youtube" | "vimeo" | "matterport"

export type ListingEmbed = {
  kind: ListingEmbedKind
  embedSrc: string
  label: string
}

function youtubeId(url: URL): string | null {
  const host = url.hostname.replace(/^www\./, "")
  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0]
    return id || null
  }
  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname.startsWith("/embed/")) {
      return url.pathname.split("/")[2] || null
    }
    if (url.pathname.startsWith("/shorts/")) {
      return url.pathname.split("/")[2] || null
    }
    return url.searchParams.get("v")
  }
  return null
}

/** Detect a YouTube, Vimeo, or Matterport URL. Returns null for ordinary websites. */
export function listingEmbedFromUrl(raw: string | null | undefined): ListingEmbed | null {
  const trimmed = raw?.trim()
  if (!trimmed) return null
  let url: URL
  try {
    url = new URL(trimmed)
  } catch {
    return null
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null
  const host = url.hostname.replace(/^www\./, "")

  const yt = youtubeId(url)
  if (yt && /^[A-Za-z0-9_-]{6,}$/.test(yt)) {
    return {
      kind: "youtube",
      embedSrc: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(yt)}`,
      label: "Video tour",
    }
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean).pop()
    if (id && /^\d+$/.test(id)) {
      return {
        kind: "vimeo",
        embedSrc: `https://player.vimeo.com/video/${id}`,
        label: "Video tour",
      }
    }
  }

  if (host === "my.matterport.com" || host.endsWith(".matterport.com") || host === "matterport.com") {
    return { kind: "matterport", embedSrc: trimmed, label: "3D tour" }
  }

  return null
}

export function listingMediaEmbeds(input: {
  virtualTourUrl?: string | null
  videoUrl?: string | null
  website?: string | null
}): ListingEmbed[] {
  const seen = new Set<string>()
  const embeds: ListingEmbed[] = []
  for (const raw of [input.virtualTourUrl, input.videoUrl, input.website]) {
    const embed = listingEmbedFromUrl(raw)
    if (!embed || seen.has(embed.embedSrc)) continue
    seen.add(embed.embedSrc)
    embeds.push(embed)
  }
  return embeds
}

export type PublicListingDocument = {
  id: string
  title: string
  type: string
  url: string
}

export function listingDocumentLabel(type: string): string {
  switch (type) {
    case "flyer":
      return "Flyer"
    case "om":
      return "Offering memorandum"
    case "brochure":
      return "Brochure"
    case "floor_plan":
      return "Floor plan"
    case "site_plan":
      return "Site plan"
    case "financial":
      return "Financial package"
    case "other":
      return "Document"
    default:
      return type.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  }
}

export function listingPublicDocuments(
  docs: Array<{ id: string; title: string; type: string; url: string }> | null | undefined,
): PublicListingDocument[] {
  return (docs ?? []).filter((doc) => {
    const url = doc.url?.trim()
    const title = doc.title?.trim()
    if (!url || !title) return false
    try {
      const parsed = new URL(url)
      return parsed.protocol === "https:" || parsed.protocol === "http:"
    } catch {
      return false
    }
  })
}

export type RelatedListingSeed = {
  publicId: string
  type: string
  city?: string | null
  state?: string | null
  price: number
  sqft: number
}

/**
 * Rank related listings by type, city, state, price band, and size.
 * Returns an empty array when nothing shares those facts — never random padding.
 */
export function pickRelatedListings<T extends RelatedListingSeed>(
  current: T,
  candidates: T[],
  limit = 6,
): T[] {
  const scored = candidates
    .filter((p) => p.publicId && p.publicId !== current.publicId)
    .map((p) => {
      let score = 0
      if (p.type && current.type && p.type === current.type) score += 4
      if (
        p.city &&
        current.city &&
        p.city.trim().toLowerCase() === current.city.trim().toLowerCase()
      ) {
        score += 3
      }
      if (
        p.state &&
        current.state &&
        p.state.trim().toLowerCase() === current.state.trim().toLowerCase()
      ) {
        score += 2
      }
      if (current.price > 0 && p.price > 0) {
        const ratio = Math.abs(p.price - current.price) / current.price
        if (ratio <= 0.25) score += 2
        else if (ratio <= 0.5) score += 1
      }
      if (current.sqft > 0 && p.sqft > 0) {
        const ratio = Math.abs(p.sqft - current.sqft) / current.sqft
        if (ratio <= 0.25) score += 1
      }
      return { p, score }
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.p.price - b.p.price)

  return scored.slice(0, Math.min(limit, 6)).map((row) => row.p)
}

export type ListingAgentCardData = {
  name: string
  title: string
  phone: string
  email: string
  bio?: string | null
  photoUrl?: string | null
}

function contactDisplayName(c?: { firstName?: string | null; lastName?: string | null } | null): string {
  return [c?.firstName, c?.lastName].filter(Boolean).join(" ").trim()
}

/**
 * Public listing contact. Uses named manager/owner when the API sends names,
 * plus the published company phone/email. Does not surface redacted personal emails.
 */
export function listingAgents(input: {
  manager?: {
    firstName?: string | null
    lastName?: string | null
    title?: string | null
    bio?: string | null
    photoUrl?: string | null
    phone?: string | null
    email?: string | null
  } | null
  owner?: {
    firstName?: string | null
    lastName?: string | null
    title?: string | null
    bio?: string | null
    photoUrl?: string | null
    phone?: string | null
    email?: string | null
  } | null
  propertyPhone?: string | null
  companyPhone: string
  companyEmail: string
}): ListingAgentCardData[] {
  const phone = input.propertyPhone?.trim() || input.companyPhone
  const email = input.companyEmail
  const managerName = contactDisplayName(input.manager)
  const ownerName = contactDisplayName(input.owner)

  if (managerName) {
    return [
      {
        name: managerName,
        title: input.manager?.title?.trim() || "Leasing manager",
        phone,
        email: input.manager?.email?.trim() || email,
        bio: input.manager?.bio?.trim() || null,
        photoUrl: input.manager?.photoUrl?.trim() || null,
      },
    ]
  }
  if (ownerName) {
    return [
      {
        name: ownerName,
        title: input.owner?.title?.trim() || "Property contact",
        phone,
        email: input.owner?.email?.trim() || email,
        bio: input.owner?.bio?.trim() || null,
        photoUrl: input.owner?.photoUrl?.trim() || null,
      },
    ]
  }
  return [
    {
      name: "Ondo Real Estate",
      title: "Leasing team",
      phone,
      email,
      bio: null,
      photoUrl: null,
    },
  ]
}

/** Visible draft in the listing inquiry box. Address only — no rates or credit language. */
export function listingInquiryDraftMessage(address: string): string {
  const place = address.trim()
  if (!place) return ""
  return `I'm interested in ${place}.`
}

export function buildListingInquiryMessage(input: {
  intent: "information" | "tour"
  title: string
  address: string
  preferredContact?: string
  tourDate?: string
  tourTime?: string
  notes?: string
}): string {
  const lines = [
    input.intent === "tour" ? "Schedule a tour" : "Request more information",
    `Property: ${input.title}`,
    input.address ? `Address: ${input.address}` : null,
    input.preferredContact ? `Preferred contact: ${input.preferredContact}` : null,
    input.tourDate ? `Preferred date: ${input.tourDate}` : null,
    input.tourTime ? `Preferred time: ${input.tourTime}` : null,
    input.notes?.trim() ? input.notes.trim() : null,
  ]
  return lines.filter((line): line is string => Boolean(line)).join("\n").slice(0, 2000)
}
