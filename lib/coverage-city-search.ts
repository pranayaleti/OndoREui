import type { UtahCity } from "@/lib/utah-cities"

export const DEFAULT_COVERAGE_CITY = "Salt Lake City"

export function normalizeCoverageQuery(query: string): string {
  return query.trim().toLowerCase()
}

export function cityMatchesCoverageQuery(city: UtahCity, query: string): boolean {
  const q = normalizeCoverageQuery(query)
  if (!q) return true
  const county = city.county?.toLowerCase() ?? ""
  return city.name.toLowerCase().includes(q) || county.includes(q)
}

export function filterCoverageCities(cities: readonly UtahCity[], query: string): UtahCity[] {
  return cities.filter((city) => cityMatchesCoverageQuery(city, query))
}

/**
 * City shown in the coverage stats panel. Typing jumps to the first match so
 * phones do not depend on hover. An unmatched query keeps the last selection.
 */
export function resolveCoverageCityName(
  cities: readonly UtahCity[],
  query: string,
  selectedName: string,
  fallback = DEFAULT_COVERAGE_CITY,
): string {
  const matches = filterCoverageCities(cities, query)
  if (matches.some((city) => city.name === selectedName)) {
    return selectedName
  }
  if (matches[0]) {
    return matches[0].name
  }
  if (cities.some((city) => city.name === selectedName)) {
    return selectedName
  }
  return fallback
}
