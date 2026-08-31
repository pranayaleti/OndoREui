import type { ContactInquiryType } from "@/lib/leads-api"
import { CITY_MARKET_AS_OF, type CityMarketData } from "@/lib/city-market-data"
import { toCitySlug } from "@/lib/utah-cities"

export const MAX_COMMUTE_ROWS = 12

export const TOUR_LEAD_DAYS_MIN = 45
export const TOUR_LEAD_DAYS_MAX = 60

export const ARRIVAL_LENDING_DISCLOSURE =
  "Loan information is provided by Ondo Real Estate (NMLS ID on file). This is not a commitment to lend, a loan approval, or an offer of credit. Rates, terms, and payments shown are estimates for illustration only, are not a quote, and are subject to credit approval, underwriting, and market conditions. You are not required to use Ondo for financing to buy or sell with Ondo. Equal Housing Lender."

export const ARRIVAL_REAL_ESTATE_DISCLOSURE =
  "Real estate services provided by Ondo Real Estate. Information is deemed reliable but is not guaranteed and should be independently verified. Equal Housing Opportunity."

export const ARRIVAL_RENT_DISCLOSURE =
  `Typical rents and any home-value figures are city medians from our 55-city Utah coverage set, compiled by Ondo Real Estate as of ${CITY_MARKET_AS_OF} — verify. They are estimates for a city, not a quote for a specific home, and are not an MLS pull, an appraisal, a broker price opinion, or a comparative market analysis.`

export const ARRIVAL_FAIR_HOUSING =
  "Equal Housing Opportunity. We consider every complete rental application using the same written, property-specific criteria. Starting an application is not an approval. Reasonable accommodations, including alternatives to an in-person showing, are available on request."

export type ArrivalPathId = "rent" | "buy" | "leaving-a-home" | "people-ops"

export type ArrivalCommuteRow = {
  city: string
  minutes: number
  medianRent: number
  listingsHref: string
  guideHref: string
}

export type WorkplaceChip = {
  label: string
  query: string
}

export const WORKPLACE_CHIPS: readonly WorkplaceChip[] = [
  { label: "Salt Lake City", query: "Salt Lake City" },
  { label: "Lehi", query: "Lehi" },
  { label: "Provo", query: "Provo" },
  { label: "Ogden", query: "Ogden" },
  { label: "Hill AFB", query: "Hill Air Force Base" },
]

type AliasRule = {
  aliases: readonly string[]
  destinationNeedles: readonly string[]
  homeCityNames: readonly string[]
}

const WORKPLACE_ALIAS_RULES: readonly AliasRule[] = [
  {
    aliases: ["slc", "salt lake", "salt lake city", "downtown slc", "downtown salt lake"],
    destinationNeedles: ["downtown salt lake city"],
    homeCityNames: ["Salt Lake City"],
  },
  {
    aliases: ["lehi", "silicon slopes", "thanksgiving point"],
    destinationNeedles: ["silicon slopes"],
    homeCityNames: ["Lehi"],
  },
  {
    aliases: ["ogden", "downtown ogden"],
    destinationNeedles: ["downtown ogden"],
    homeCityNames: ["Ogden"],
  },
  {
    aliases: ["hill", "hafb", "hill afb", "hill air", "air force", "hill air force base"],
    destinationNeedles: ["hill air force"],
    homeCityNames: [],
  },
  {
    aliases: ["u of u", "the u", "university of utah"],
    destinationNeedles: ["university of utah"],
    homeCityNames: [],
  },
  {
    aliases: ["airport", "slcia", "salt lake international"],
    destinationNeedles: ["salt lake international airport"],
    homeCityNames: [],
  },
  {
    aliases: ["provo", "byu", "provo/byu"],
    destinationNeedles: ["provo/byu", "provo"],
    homeCityNames: ["Provo"],
  },
  {
    aliases: ["weber state", "wsu"],
    destinationNeedles: ["weber state"],
    homeCityNames: [],
  },
]

export type TourWindow =
  | { kind: "window"; tourFrom: Date; tourTo: Date }
  | { kind: "soon"; daysUntilStart: number }
  | { kind: "past" }
  | { kind: "invalid" }

export function normalizeWorkplaceQuery(query: string): string {
  return query.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
}

function parseIsoDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim())
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null
  }
  return date
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

function dayDiff(later: Date, earlier: Date): number {
  const ms = startOfDay(later).getTime() - startOfDay(earlier).getTime()
  return Math.round(ms / 86_400_000)
}

export function tourWindowForStartDate(startIso: string, today = new Date()): TourWindow {
  const start = parseIsoDate(startIso)
  if (!start) return { kind: "invalid" }
  const todayStart = startOfDay(today)
  const daysUntilStart = dayDiff(start, todayStart)
  if (daysUntilStart < 0) return { kind: "past" }
  if (daysUntilStart < TOUR_LEAD_DAYS_MIN) {
    return { kind: "soon", daysUntilStart }
  }
  return {
    kind: "window",
    tourFrom: addDays(start, -TOUR_LEAD_DAYS_MAX),
    tourTo: addDays(start, -TOUR_LEAD_DAYS_MIN),
  }
}

export function formatArrivalDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function formatMedianRent(amount: number): string {
  return `$${amount.toLocaleString("en-US")}/mo`
}

function resolvedNeedlesAndHomes(normalizedQuery: string): {
  needles: string[]
  homeCityNames: string[]
} {
  const needles = new Set<string>()
  const homes = new Set<string>()

  for (const rule of WORKPLACE_ALIAS_RULES) {
    const matched = rule.aliases.some((alias) => {
      if (normalizedQuery === alias) return true
      if (normalizedQuery.length < 3) return false
      return normalizedQuery.includes(alias) || alias.includes(normalizedQuery)
    })
    if (!matched) continue
    for (const needle of rule.destinationNeedles) needles.add(needle)
    for (const home of rule.homeCityNames) homes.add(home)
  }

  if (needles.size === 0 && normalizedQuery) {
    needles.add(normalizedQuery)
  }

  return { needles: [...needles], homeCityNames: [...homes] }
}

function destinationMatches(destination: string, needles: readonly string[]): boolean {
  const normalized = normalizeWorkplaceQuery(destination)
  return needles.some((needle) => normalized.includes(needle) || needle.includes(normalized))
}

export function commuteRowsForWorkplace(
  markets: Record<string, Pick<CityMarketData, "medianRent" | "commuteTimes">>,
  query: string,
): ArrivalCommuteRow[] {
  const normalized = normalizeWorkplaceQuery(query)
  if (!normalized) return []

  const { needles, homeCityNames } = resolvedNeedlesAndHomes(normalized)
  const rows: ArrivalCommuteRow[] = []

  for (const [city, data] of Object.entries(markets)) {
    const isHome =
      homeCityNames.includes(city) || normalizeWorkplaceQuery(city) === normalized

    let minutes: number | null = isHome ? 0 : null
    if (minutes === null) {
      const match = data.commuteTimes
        .filter((leg) => destinationMatches(leg.destination, needles))
        .sort((a, b) => a.minutes - b.minutes)[0]
      minutes = match ? match.minutes : null
    }

    if (minutes === null) continue

    rows.push({
      city,
      minutes,
      medianRent: data.medianRent,
      listingsHref: `/properties/?query=${encodeURIComponent(city)}`,
      guideHref: `/locations/${toCitySlug(city)}/`,
    })
  }

  return rows
    .sort((a, b) => a.minutes - b.minutes || a.city.localeCompare(b.city))
    .slice(0, MAX_COMMUTE_ROWS)
}

export function minutesLabel(minutes: number): string {
  if (minutes === 0) return "At workplace"
  return `${minutes} min`
}

export function arrivalPathInquiryType(path: ArrivalPathId): ContactInquiryType {
  switch (path) {
    case "rent":
      return "renter"
    case "leaving-a-home":
      return "owner"
    case "buy":
      return "buyer"
    case "people-ops":
      return "other"
    default: {
      const _exhaustive: never = path
      return _exhaustive
    }
  }
}

export function arrivalPrimaryCta(
  path: ArrivalPathId,
  housingCity: string,
  listingsHref: string,
): { href: string; label: string } {
  switch (path) {
    case "rent":
      return { href: listingsHref, label: `Open rentals in ${housingCity}` }
    case "buy":
      return { href: "/buy/", label: "Buy with Ondo" }
    case "leaving-a-home":
      return { href: "/whats-my-home-worth/", label: "Estimate rent and sale" }
    case "people-ops":
      return { href: "#arrival-contact", label: "Send the workplace city" }
    default: {
      const _exhaustive: never = path
      return _exhaustive
    }
  }
}

export function arrivalSecondaryCta(path: ArrivalPathId): { href: string; label: string } | null {
  switch (path) {
    case "rent":
      return { href: "/notary/", label: "Remote notary" }
    case "buy":
      return { href: "/loans/", label: "Home loans" }
    case "leaving-a-home":
      return { href: "/property-management/", label: "Property management" }
    case "people-ops":
      return { href: "/properties/", label: "Browse current rentals" }
    default: {
      const _exhaustive: never = path
      return _exhaustive
    }
  }
}

export function arrivalContactPrefill(
  path: ArrivalPathId,
  workplace: string,
  housingCity?: string,
): string {
  const where = housingCity?.trim() || workplace.trim() || "the Wasatch Front"
  const work = workplace.trim() || "a Wasatch Front workplace"

  switch (path) {
    case "rent":
      return `I need an Ondo-managed rental before a Utah start date. Weekday workplace: ${work}. Housing city of interest: ${where}. Please share current listings and how to request a showing.`
    case "buy":
      return `I'm arriving in Utah and looking at buying near ${where}. Weekday workplace: ${work}. Please follow up about brokerage and NMLS-licensed lending. This is not a loan application.`
    case "leaving-a-home":
      return `I'm moving to Utah and still own a home I may rent. Weekday workplace will be ${work}. Please follow up about a rental estimate and management — I understand the management fee is charged when rent is collected.`
    case "people-ops":
      return `I'm arranging housing for someone starting work near ${work}. Housing city of interest: ${where}. Please share current rentals and how to request a showing. This is not a public rental application.`
    default: {
      const _exhaustive: never = path
      return _exhaustive
    }
  }
}
