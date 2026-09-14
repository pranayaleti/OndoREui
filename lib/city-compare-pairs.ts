import { findCityBySlug } from "@/lib/utah-cities"

/**
 * Neighbour city pairs that have a head-to-head page at /compare/{a}-vs-{b}/.
 * Single source of truth for generateStaticParams on that route and for the
 * inbound links rendered on market reports, so every comparison page is
 * reachable from the rest of the site (they used to link only to each other).
 */
export const CITY_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["draper", "lehi"],
  ["draper", "sandy"],
  ["lehi", "saratoga-springs"],
  ["salt-lake-city", "draper"],
  ["salt-lake-city", "sandy"],
  ["provo", "orem"],
  ["ogden", "layton"],
  ["lehi", "american-fork"],
  ["sandy", "riverton"],
  ["south-jordan", "riverton"],
  ["bountiful", "salt-lake-city"],
  ["west-jordan", "south-jordan"],
]

export interface CityComparisonLink {
  slug: string
  href: string
  label: string
}

export function comparisonLink(a: string, b: string): CityComparisonLink {
  const slug = `${a}-vs-${b}`
  const nameA = findCityBySlug(a)?.name ?? a
  const nameB = findCityBySlug(b)?.name ?? b
  return { slug, href: `/compare/${slug}/`, label: `${nameA} vs ${nameB}` }
}

/** Every comparison page that features the given city slug. */
export function comparisonsForCitySlug(citySlug: string): CityComparisonLink[] {
  return CITY_PAIRS.filter(([a, b]) => a === citySlug || b === citySlug).map(([a, b]) => comparisonLink(a, b))
}
