/**
 * The browse filter and the homepage "Browse by home type" links use a small
 * lowercase vocabulary. The API returns free-form labels ("Apartment",
 * "Single Family", "Duplex", "Condo"). Map both sides onto the same vocabulary
 * before comparing, so a type link never shows "0 homes" for a home that exists.
 */
export type PropertyTypeFilterValue =
  | "apartment"
  | "house"
  | "townhouse"
  | "condo"
  | "studio"
  | "multi-family"

/** Options for the Property type select (after "Any"). */
export const PROPERTY_TYPE_FILTER_OPTIONS: ReadonlyArray<{
  value: PropertyTypeFilterValue
  label: string
}> = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "townhouse", label: "Townhouse" },
  { value: "condo", label: "Condo" },
  { value: "studio", label: "Studio" },
  { value: "multi-family", label: "Duplex or multi-family" },
]

/**
 * Normalize an API type or a filter/deep-link value to the filter vocabulary.
 * Case, spaces, hyphens and underscores are ignored. Unknown labels come back
 * lowercased and trimmed so an exact (case-insensitive) match still works.
 */
export function normalizePropertyType(raw: string | null | undefined): string {
  const key = (raw ?? "").toLowerCase().replace(/[^a-z0-9+]/g, "")
  switch (key) {
    case "apartment":
    case "apt":
      return "apartment"
    case "house":
    case "singlefamily":
    case "singlefamilyhome":
    case "singlefamilyresidence":
    case "sfh":
    case "sfr":
      return "house"
    case "townhouse":
    case "townhome":
      return "townhouse"
    case "condo":
    case "condominium":
      return "condo"
    case "studio":
      return "studio"
    case "duplex":
    case "triplex":
    case "fourplex":
    case "quadplex":
    case "multifamily":
    case "multiunit":
      return "multi-family"
    default:
      return (raw ?? "").trim().toLowerCase()
  }
}

/** True when a listing of `listingType` passes the selected filter value. "any" or empty matches everything. */
export function matchesPropertyTypeFilter(
  listingType: string | null | undefined,
  filterValue: string,
): boolean {
  if (!filterValue || filterValue === "any") return true
  return normalizePropertyType(listingType) === normalizePropertyType(filterValue)
}
