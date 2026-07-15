// lib/notary-cities.ts
import { US_CITIES, US_STATES, generateCitySlug } from "./notary-service-areas"
import { utahCitiesFromNorthOgdenToNephi, toCitySlug } from "./utah-cities"
import { getServedRonStates } from "./notary-ron-states"

export type NotaryCityRecord = {
  name: string
  slug: string
  stateCode: string
  stateSlug: string
  county?: string
  metro?: string
  timezone?: string
  lat?: number
  lng?: number
  nearbyCitySlugs?: string[]
}

const MAX_CITIES_PER_STATE = 10

/** Primary IANA zone per state/DC for scheduling copy (not legal authority). */
const STATE_TIMEZONES: Record<string, string> = {
  AL: "America/Chicago", AK: "America/Anchorage", AZ: "America/Phoenix", AR: "America/Chicago",
  CA: "America/Los_Angeles", CO: "America/Denver", CT: "America/New_York", DE: "America/New_York",
  DC: "America/New_York", FL: "America/New_York", GA: "America/New_York", HI: "Pacific/Honolulu",
  ID: "America/Boise", IL: "America/Chicago", IN: "America/Indiana/Indianapolis", IA: "America/Chicago",
  KS: "America/Chicago", KY: "America/New_York", LA: "America/Chicago", ME: "America/New_York",
  MD: "America/New_York", MA: "America/New_York", MI: "America/Detroit", MN: "America/Chicago",
  MS: "America/Chicago", MO: "America/Chicago", MT: "America/Denver", NE: "America/Chicago",
  NV: "America/Los_Angeles", NH: "America/New_York", NJ: "America/New_York", NM: "America/Denver",
  NY: "America/New_York", NC: "America/New_York", ND: "America/Chicago", OH: "America/New_York",
  OK: "America/Chicago", OR: "America/Los_Angeles", PA: "America/New_York", RI: "America/New_York",
  SC: "America/New_York", SD: "America/Chicago", TN: "America/Chicago", TX: "America/Chicago",
  UT: "America/Denver", VT: "America/New_York", VA: "America/New_York", WA: "America/Los_Angeles",
  WV: "America/New_York", WI: "America/Chicago", WY: "America/Denver",
}

function stateSlugForCode(code: string): string | undefined {
  if (code === "DC") return "district-of-columbia"
  return (US_STATES as Record<string, { slug: string }>)[code]?.slug
}

function buildBaseRecords(): NotaryCityRecord[] {
  const served = new Set(getServedRonStates().map((s) => s.slug))
  const byKey = new Map<string, NotaryCityRecord>()

  for (const row of US_CITIES) {
    const stateSlug = stateSlugForCode(row.state)
    if (!stateSlug || !served.has(stateSlug)) continue
    const slug = generateCitySlug(row.city)
    const key = `${stateSlug}/${slug}`
    byKey.set(key, {
      name: row.city,
      slug,
      stateCode: row.state,
      stateSlug,
      county: row.county || undefined,
      metro: `${row.city} metro area`,
      timezone: STATE_TIMEZONES[row.state],
    })
  }

  for (const ut of utahCitiesFromNorthOgdenToNephi) {
    const slug = toCitySlug(ut.name)
    const key = `utah/${slug}`
    const existing = byKey.get(key)
    byKey.set(key, {
      name: ut.name,
      slug,
      stateCode: "UT",
      stateSlug: "utah",
      county: ut.county ? `${ut.county} County` : existing?.county,
      metro: existing?.metro ?? "Wasatch Front",
      timezone: STATE_TIMEZONES.UT,
      lat: ut.lat,
      lng: ut.lng,
    })
  }

  const grouped = new Map<string, NotaryCityRecord[]>()
  for (const record of byKey.values()) {
    const list = grouped.get(record.stateSlug) ?? []
    list.push(record)
    grouped.set(record.stateSlug, list)
  }

  const result: NotaryCityRecord[] = []
  for (const [stateSlug, cities] of grouped) {
    // Preserve US_CITIES / Wasatch insertion order for the top-N cap (prominence),
    // then sort alphabetically for stable nearby links and hub display.
    const selected =
      stateSlug === "utah" ? [...cities] : cities.slice(0, MAX_CITIES_PER_STATE)
    selected.sort((a, b) => a.name.localeCompare(b.name))
    for (let i = 0; i < selected.length; i++) {
      const nearby: string[] = []
      for (let offset = 1; nearby.length < 4 && offset < selected.length; offset++) {
        const prev = selected[i - offset]
        const next = selected[i + offset]
        if (next) nearby.push(next.slug)
        if (nearby.length < 4 && prev) nearby.push(prev.slug)
      }
      result.push({ ...selected[i], nearbyCitySlugs: nearby })
    }
  }

  return result.sort((a, b) =>
    a.stateSlug === b.stateSlug ? a.name.localeCompare(b.name) : a.stateSlug.localeCompare(b.stateSlug)
  )
}

export const NOTARY_CITIES: NotaryCityRecord[] = buildBaseRecords()

export function getNotaryCity(stateSlug: string, citySlug: string): NotaryCityRecord | undefined {
  return NOTARY_CITIES.find((c) => c.stateSlug === stateSlug && c.slug === citySlug)
}

export function getNotaryCitiesByStateSlug(stateSlug: string): NotaryCityRecord[] {
  return NOTARY_CITIES.filter((c) => c.stateSlug === stateSlug)
}

export function getAllNotaryStateParams(): { state: string }[] {
  return getServedRonStates().map((s) => ({ state: s.slug }))
}

export function getAllNotaryCityParams(): { state: string; city: string }[] {
  return NOTARY_CITIES.map((c) => ({ state: c.stateSlug, city: c.slug }))
}

export function notaryStatePath(stateSlug: string): string {
  return `/notary/${stateSlug}/`
}

export function notaryCityPath(stateSlug: string, citySlug: string): string {
  return `/notary/${stateSlug}/${citySlug}/`
}
