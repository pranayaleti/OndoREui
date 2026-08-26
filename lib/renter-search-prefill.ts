export const DEFAULT_RENT_FILTER_RANGE: readonly [number, number] = [500, 5000]

export type RenterSearchPrefillInput = {
  searchQuery?: string
  bedrooms?: string
  bathrooms?: string
  propertyType?: string
  priceRange?: readonly [number, number]
  defaultPriceRange?: readonly [number, number]
  listingTitle?: string
  listingAddress?: string
}

function bedroomPreference(bedrooms: string | undefined): string | null {
  if (!bedrooms || bedrooms === "any") return null
  switch (bedrooms) {
    case "studio":
      return "studio"
    case "4+":
      return "4 or more bedrooms"
    default:
      return `${bedrooms} bedroom`
  }
}

function bathroomPreference(bathrooms: string | undefined): string | null {
  if (!bathrooms || bathrooms === "any") return null
  switch (bathrooms) {
    case "3+":
      return "3 or more bathrooms"
    default:
      return `${bathrooms} bathroom`
  }
}

/**
 * Builds the ContactLeadForm message for a renter who is browsing listings.
 * Beds / budget / city / property type only — no occupant-type or "quality" language.
 */
export function buildRenterSearchPrefill(input: RenterSearchPrefillInput): string {
  const title = input.listingTitle?.trim()
  if (title) {
    const address = input.listingAddress?.trim()
    const where = address ? ` at ${address}` : ""
    return `I'd like to tour ${title}${where}. Please send available showing times.`
  }

  const parts: string[] = []
  const query = input.searchQuery?.trim()
  if (query) parts.push(`area: ${query}`)

  const beds = bedroomPreference(input.bedrooms)
  if (beds) parts.push(beds)

  const baths = bathroomPreference(input.bathrooms)
  if (baths) parts.push(baths)

  const type = input.propertyType?.trim()
  if (type && type !== "any") parts.push(type)

  const range = input.priceRange
  const fallback = input.defaultPriceRange ?? DEFAULT_RENT_FILTER_RANGE
  if (range && (range[0] !== fallback[0] || range[1] !== fallback[1])) {
    parts.push(`budget up to $${range[1].toLocaleString("en-US")}/mo`)
  }

  if (parts.length === 0) {
    return "I'm looking for an Ondo-managed rental along the Wasatch Front. Please tell me what's currently available and how to schedule a showing."
  }

  return `I'm looking for an Ondo-managed rental (${parts.join(", ")}). Please tell me what's currently available and how to schedule a showing.`
}
