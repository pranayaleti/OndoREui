import { NOTARY_HOURS_LABEL, NOTARY_RON_ACT_USD } from "./notary-fees"
import {
  LICENSING,
  SITE_ADDRESS_OBJ,
  SITE_BRAND_SHORT,
  SITE_EMAILS,
  SITE_HOURS_LABEL,
  SITE_NAME,
  SITE_PHONE,
  SITE_PLACE_LISTINGS,
  SITE_SOCIAL_LINKS,
  SITE_URL,
  type LicensingState,
} from "./site"
import { FOUNDED_YEAR } from "./social-proof-stats"
import { FOUNDER_PROFILE_PATH, getFounder } from "./team-data"
import { toAbsoluteSiteUrl } from "./url"
import { utahCitiesFromNorthOgdenToNephi } from "./utah-cities"

/**
 * The one record every off-site listing is typed from: Google Business Profile, Bing Places,
 * Apple Business Connect, Foursquare, Yelp and Yellow Pages. Search engines and assistants decide
 * "which business is this" by matching name, address and phone across those databases, so the
 * values here come from the site constants and are never retyped. The procedure is
 * docs/OFF-SITE-LISTINGS.md; `npm run listings:profile` prints this record as copy blocks.
 *
 * Nothing here may claim a license: lib/business-profile.test.ts runs the license-claim scanner
 * over every description, and each category or service that needs a license carries `when`.
 */
export type ListingWhen = "now" | "re" | "mlo" | "notary"

export type ListingCategory = { name: string; when: ListingWhen; note?: string }

/** Google Business Profile category names; the other directories map them to their own lists. */
export const LISTING_CATEGORIES: readonly ListingCategory[] = [
  { name: "Property management company", when: "now" },
  { name: "Real estate agency", when: "re", note: "Add once RE_LICENSE_LIVE is on and the brokerage is named." },
  {
    name: "Mortgage lender",
    when: "mlo",
    note: "Only if the sponsoring lender's compliance team allows the Ondo profile to carry it. Otherwise the loan officer identity lives on NMLS Consumer Access, the sponsor's roster page and Pranay's own LinkedIn.",
  },
  { name: "Notary public", when: "notary", note: "Only with a current Utah commission (NOTARY_COMMISSION_LIVE)." },
]

export type ListingService = { name: string; when: ListingWhen; description: string }

/** Services as the directories list them; descriptions stay under 300 characters (Google's limit). */
export const LISTING_SERVICES: readonly ListingService[] = [
  {
    name: "Property management",
    when: "now",
    description:
      "Full-service management for single-family rentals: leasing, tenant screening, rent collection, maintenance coordination and monthly owner statements, with an owner portal and a tenant portal.",
  },
  {
    name: "Tenant screening",
    when: "now",
    description:
      "Credit, income, rental history and background checks applied the same way to every applicant, in line with the Fair Housing Act.",
  },
  {
    name: "Rental listings",
    when: "now",
    description: "Homes for rent along Utah's Wasatch Front, with online applications and tours by appointment.",
  },
  {
    name: "Home buying",
    when: "re",
    description: "Buyer representation on the Wasatch Front: search, offers, inspections and closing.",
  },
  {
    name: "Home selling",
    when: "re",
    description: "Seller representation: pricing, preparation, listing and negotiation.",
  },
  {
    name: "Home loans",
    when: "mlo",
    description: "Conventional, FHA, VA, USDA and jumbo home loans, with a program comparison before you apply.",
  },
  {
    name: "Remote online notarization",
    when: "notary",
    description: `Notarization by secure video for real estate packages, loan signings, affidavits, powers of attorney and estate documents. $${NOTARY_RON_ACT_USD} per notarial act (the Utah maximum for remote acts). No office visits or mobile travel. ${NOTARY_HOURS_LABEL}.`,
  },
]

export const SERVICE_AREA_COUNTIES = ["Utah County", "Salt Lake County", "Davis County", "Weber County"] as const

/**
 * Google Business Profile accepts up to 20 service areas. These are the 20 cities nearest Lehi
 * with the most home and rental searches; lib/business-profile.test.ts checks each is a city the
 * site already serves (lib/utah-cities.ts).
 */
export const SERVICE_AREA_CITIES = [
  "Lehi",
  "American Fork",
  "Pleasant Grove",
  "Lindon",
  "Orem",
  "Provo",
  "Saratoga Springs",
  "Eagle Mountain",
  "Highland",
  "Alpine",
  "Vineyard",
  "Springville",
  "Spanish Fork",
  "Draper",
  "Sandy",
  "South Jordan",
  "Herriman",
  "Riverton",
  "West Jordan",
  "Salt Lake City",
] as const

/** Character limits the directories enforce; the test keeps every description inside them. */
export const LISTING_DESCRIPTION_LIMITS = { short: 80, standard: 750, service: 300 } as const

export const LISTING_DESCRIPTIONS = {
  /** Tag lines, bios and "specialties" fields. */
  short: "Utah property management, rentals, buying, selling, loans and online notary.",
  /** Google Business Profile "from the business" (750 max); Bing, Apple, Foursquare and Yelp take the same text. */
  standard:
    `${SITE_NAME} is a Lehi, Utah company for people who own, rent, buy and finance homes on the Wasatch Front. ` +
    "We manage single-family rentals for owners who do not want a second job: leasing, tenant screening, rent collection, maintenance and monthly owner statements, with owner and tenant portals. " +
    "Buyers and sellers get a plain conversation about pricing, offers and timing before they commit. " +
    "Home loan questions (conventional, FHA, VA, USDA, jumbo) get a straight answer about which program fits a file. " +
    "Remote online notarization is available by video. " +
    `Founded in ${FOUNDED_YEAR} by Pranay Reddy Aleti, a software engineer who owns rental property in Utah. ` +
    "Serving Utah, Salt Lake, Davis and Weber counties. " +
    `Office hours ${SITE_HOURS_LABEL}.`,
} as const

export function listingCategories(state: LicensingState = LICENSING): ListingCategory[] {
  return LISTING_CATEGORIES.filter((category) => category.when === "now" || state[category.when])
}

export function listingServices(state: LicensingState = LICENSING): ListingService[] {
  return LISTING_SERVICES.filter((service) => service.when === "now" || state[service.when])
}

/** The complete record for one directory form, with only the categories and services that are true today. */
export function businessProfile(state: LicensingState = LICENSING) {
  const founder = getFounder()
  return {
    name: SITE_NAME,
    alternateName: SITE_BRAND_SHORT,
    website: `${SITE_URL.replace(/\/$/, "")}/`,
    phone: SITE_PHONE,
    email: SITE_EMAILS.primary,
    address: { ...SITE_ADDRESS_OBJ },
    hours: SITE_HOURS_LABEL,
    notaryHours: NOTARY_HOURS_LABEL,
    founded: FOUNDED_YEAR,
    founder: { name: founder.name, profile: toAbsoluteSiteUrl(FOUNDER_PROFILE_PATH) },
    categories: listingCategories(state),
    services: listingServices(state),
    serviceArea: { counties: [...SERVICE_AREA_COUNTIES], cities: [...SERVICE_AREA_CITIES] },
    descriptions: LISTING_DESCRIPTIONS,
    socialProfiles: SITE_SOCIAL_LINKS.filter((link) => link.live).map((link) => link.url),
    placeListings: SITE_PLACE_LISTINGS.map((listing) => ({ label: listing.label ?? listing.url, url: listing.url, live: listing.live })),
  }
}

/** True when `name` is one of the cities the site serves (the ZIP, guide and service pages). */
export function isServedCity(name: string): boolean {
  return utahCitiesFromNorthOgdenToNephi.some((city) => city.name === name)
}
