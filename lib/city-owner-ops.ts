import { cityContentByName, type CityContent } from "./city-content"

export type CityOwnerOp = {
  title: string
  body: string
}

const HOUSING_RE =
  /housing stock|homes range|townhomes?|single-family|multi-family|multifamily|condos?|apartments?|ramblers?|new construction|historic|mid-century|subdivision|bungalows?|duplex|fourplex/i
const VACANCY_RE =
  /vacanc|days on market|lease in|lease quickly|leasing timeline|turnover|renewal|occupancy|applications within|days when priced/i
const HOA_RE = /HOA|CC&Rs?|community association/i
const WINTER_RE = /winter|snow load|furnace|pipe insulation|no-heat|freezing/i

const STEERING =
  /family-oriented|family-first|family-friendly|family-centric|family-focused|family-paced|family-lifestyle|young professionals?|empty nesters?|immigrant families|byu families|great for families|best for families|who is .+ best for|safe neighborhood|crime-free|quiet community|ideal for couples|working-class character|blue-collar workers|ethnically diverse|tenant quality|young families|military families|quality tenants/i

const CRIME_CHARACTERIZATION =
  /elevated crime|higher crime|low crime|crime rates|crime statistics|crime concerns|crime perception|perfectly safe/i

function isUnsafe(text: string): boolean {
  return STEERING.test(text) || CRIME_CHARACTERIZATION.test(text)
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

function trimBody(text: string, max = 320): string {
  const collapsed = text.replace(/\s+/g, " ").trim()
  if (collapsed.length <= max) return collapsed
  const cut = collapsed.slice(0, max - 1).replace(/\s+\S*$/, "")
  return `${cut}…`
}

function wasatchWinterTip(cityName: string): string {
  return `In ${cityName}, schedule furnace inspections and pipe insulation before freezing weather. Working heat is a Utah landlord obligation; after-hours no-heat is handled on the 24/7 emergency line.`
}

/**
 * Four operational patterns owners hit in a city, drawn from existing
 * city-content overviews / highlights / FAQs. Housing stock, vacancy, HOA,
 * winter — never occupant type, crime, or invented freeze counts.
 */
export function getCityOwnerOpsPatterns(cityName: string): CityOwnerOp[] {
  const content: CityContent | undefined = cityContentByName[cityName]
  if (!content) return []

  const overviewSentences = sentences(content.overview)
  const highlights = content.highlights ?? []
  const hoods = content.neighborhoods ?? []
  const faqOps = (content.faq ?? [])
    .filter((f) => HOA_RE.test(`${f.q} ${f.a}`) || VACANCY_RE.test(`${f.q} ${f.a}`) || WINTER_RE.test(`${f.q} ${f.a}`))
    .map((f) => f.a)

  const used = new Set<string>()
  const pick = (pattern: RegExp, from: string[]): string | undefined => {
    const found = from.find((c) => pattern.test(c) && !used.has(c) && !isUnsafe(c) && c.length > 12)
    if (!found) return undefined
    used.add(found)
    return trimBody(found)
  }

  const ops: CityOwnerOp[] = []

  const housing =
    pick(HOUSING_RE, [...overviewSentences, ...highlights, ...hoods]) ??
    pick(/.+/, overviewSentences)
  if (housing) ops.push({ title: "Housing stock", body: housing })

  const vacancy = pick(VACANCY_RE, [...overviewSentences, ...highlights, ...faqOps, ...hoods])
  if (vacancy) ops.push({ title: "Leasing and vacancy", body: vacancy })

  const hoa = pick(HOA_RE, [...overviewSentences, ...highlights, ...faqOps, ...hoods])
  if (hoa) ops.push({ title: "HOA and community rules", body: hoa })

  const winter = pick(WINTER_RE, [...overviewSentences, ...highlights, ...faqOps]) ?? wasatchWinterTip(cityName)
  ops.push({ title: "Winter operations", body: winter })

  for (const candidate of [...overviewSentences, ...highlights, ...hoods]) {
    if (ops.length >= 4) break
    if (used.has(candidate) || isUnsafe(candidate) || candidate.length < 12) continue
    used.add(candidate)
    ops.push({ title: "Local operations", body: trimBody(candidate) })
  }

  if (ops.length < 4) {
    ops.push({
      title: "Rental licensing",
      body: `Confirm municipal rental licensing and any CC&Rs before listing a ${cityName} rental.`,
    })
  }

  return ops.slice(0, 4)
}
