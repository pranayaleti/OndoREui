import { SITE_URL } from "@/lib/site"
import { findCitiesByZip, findCityByZip, toCitySlug, type UtahCity } from "@/lib/utah-cities"

export type ZipService = "property-management" | "buy-sell" | "loans"

/**
 * A ZIP page renders its primary city's service page, so it canonicalizes to that
 * city page instead of competing with it. Falls back to the ZIP's own URL when the
 * ZIP maps to no city.
 */
export function zipPageCanonical(service: ZipService, zip: string): string {
  const city = findCityByZip(zip)
  if (!city) return `${SITE_URL}/${service}/zip/${zip}/`
  return `${SITE_URL}/${service}/${toCitySlug(city.name)}/`
}

/** The other cities that list the ZIP, so a shared-ZIP page can offer them. */
export function otherCitiesForZip(zip: string): UtahCity[] {
  const primary = findCityByZip(zip)
  return findCitiesByZip(zip).filter((c) => c.name !== primary?.name)
}

/** ZIPs of the city that are shared and owned by another city's page. */
export function zipsOwnedByOtherCities(city: UtahCity): string[] {
  return city.zips.filter((zip) => findCityByZip(zip)?.name !== city.name)
}
