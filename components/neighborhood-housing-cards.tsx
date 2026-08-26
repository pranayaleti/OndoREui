import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cityContentByName } from "@/lib/city-content"
import {
  findNeighborhoodForCard,
  getNeighborhoodsForCity,
  type NeighborhoodInfo,
} from "@/lib/neighborhood-content"
import { toCitySlug } from "@/lib/utah-cities"

type HousingCard = {
  key: string
  name: string
  href?: string
  typicalHomes?: string
  hoa?: string
  snow?: string
  turnTime?: string
}

const HOA_RE = /HOA/i
const SNOW_OPS_RE = /snow load|snow removal|winter vacancy|pipe insulation|furnace/i
const TURN_RE = /leas.*timeline|average leasing|how quickly can you lease|days when priced/i

function hoaFact(hood: NeighborhoodInfo): string | undefined {
  return hood.highlights.find((h) => HOA_RE.test(h))
}

function snowFact(hood: NeighborhoodInfo): string | undefined {
  return [...hood.highlights, hood.character, hood.description].find((t) => SNOW_OPS_RE.test(t))
}

function cityTurnTime(cityName: string): string | undefined {
  const faq = cityContentByName[cityName]?.faq?.find((f) => TURN_RE.test(`${f.q} ${f.a}`))
  return faq?.a
}

export function buildNeighborhoodHousingCards(cityName: string): HousingCard[] {
  const citySlug = toCitySlug(cityName)
  const rich = getNeighborhoodsForCity(cityName)
  const contentHoods = cityContentByName[cityName]?.neighborhoods ?? []
  const turnTime = cityTurnTime(cityName)
  const cards: HousingCard[] = []
  const seen = new Set<string>()

  for (const hood of rich) {
    seen.add(hood.slug)
    cards.push({
      key: hood.slug,
      name: hood.name,
      href: `/neighborhoods/${citySlug}/${hood.slug}/`,
      typicalHomes: hood.typicalHomes,
      hoa: hoaFact(hood),
      snow: snowFact(hood),
      turnTime,
    })
  }

  for (const raw of contentHoods) {
    const match = findNeighborhoodForCard(cityName, raw)
    if (match && seen.has(match.slug)) continue
    const name = raw.includes(", ") ? raw.split(", ")[0] : raw
    cards.push({
      key: raw,
      name,
      href: match ? `/neighborhoods/${citySlug}/${match.slug}/` : undefined,
      typicalHomes: match?.typicalHomes,
      hoa: match ? hoaFact(match) : undefined,
      snow: match ? snowFact(match) : undefined,
      turnTime,
    })
    if (match) seen.add(match.slug)
  }

  return cards
}

type NeighborhoodHousingCardsProps = {
  cityName: string
}

/**
 * Housing-stock neighborhood cards for city PM pages: typical homes, HOA,
 * snow, and turn-time when those facts already exist. No lifestyle or
 * who-lives-here copy.
 */
export function NeighborhoodHousingCards({ cityName }: NeighborhoodHousingCardsProps) {
  const cards = buildNeighborhoodHousingCards(cityName)
  if (cards.length === 0) return null
  const turnTime = cards.find((card) => card.turnTime)?.turnTime

  return (
    <section>
      <h2 className={`text-xl font-bold ${turnTime ? "mb-2" : "mb-6"}`}>
        Housing stock in {cityName} neighborhoods
      </h2>
      {turnTime ? (
        <p className="mb-6 text-sm text-foreground/70">
          <span className="font-medium text-foreground">Turn time: </span>
          {turnTime}
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const body = (
            <Card className={card.href ? "h-full cursor-pointer transition-colors hover:bg-muted/50" : undefined}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{card.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-foreground/70">
                {card.typicalHomes ? (
                  <p>
                    <span className="font-medium text-foreground">Typical homes: </span>
                    {card.typicalHomes}
                  </p>
                ) : null}
                {card.hoa ? (
                  <p>
                    <span className="font-medium text-foreground">HOA: </span>
                    {card.hoa}
                  </p>
                ) : null}
                {card.snow ? (
                  <p>
                    <span className="font-medium text-foreground">Winter ops: </span>
                    {card.snow}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          )
          return card.href ? (
            <Link key={card.key} href={card.href}>
              {body}
            </Link>
          ) : (
            <div key={card.key}>{body}</div>
          )
        })}
      </div>
    </section>
  )
}
