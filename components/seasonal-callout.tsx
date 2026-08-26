import { Snowflake, Sun, Leaf, Flower2, type LucideIcon } from "lucide-react"

type Season = "winter" | "spring" | "summer" | "fall"

function getSeason(): Season {
  const month = new Date().getMonth() // 0-indexed
  if (month >= 2 && month <= 4) return "spring"
  if (month >= 5 && month <= 7) return "summer"
  if (month >= 8 && month <= 10) return "fall"
  return "winter"
}

const SEASON_ORDER: Season[] = ["winter", "spring", "summer", "fall"]

const seasonConfig: Record<Season, {
  icon: LucideIcon
  bg: string
  label: string
  ownerTip: (cityName: string) => string
  tenantTip: (cityName: string) => string
  investorTip: (cityName: string) => string
}> = {
  winter: {
    icon: Snowflake,
    bg: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
    label: "Winter",
    ownerTip: (cityName) =>
      `Schedule furnace inspections and pipe insulation checks in ${cityName} before freezing temperatures. Utah winters can drop to single digits — protect your asset.`,
    tenantTip: (cityName) =>
      `Report drafty windows or thermostat issues early in ${cityName}. Your landlord is responsible for maintaining heat; submit a maintenance request in the portal.`,
    investorTip: (cityName) =>
      `Winter is historically the slowest listing season in ${cityName}. Use this time to complete renovations and be ready to list in February/March for spring demand.`,
  },
  spring: {
    icon: Flower2,
    bg: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
    label: "Spring",
    ownerTip: (cityName) =>
      `Spring is the strongest rental listing season in ${cityName}. List by mid-March to capture peak demand. Professional photos and video tours now pay maximum returns.`,
    tenantTip: (cityName) =>
      `Spring is competitive for rentals in ${cityName}. If your lease ends May–July, start searching 60–90 days ahead. The best units near tech corridors move in days.`,
    investorTip: (cityName) =>
      `Spring is prime acquisition season in ${cityName}. Get your financing pre-approved in January so you can move fast when the right property comes to market.`,
  },
  summer: {
    icon: Sun,
    bg: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800",
    label: "Summer",
    ownerTip: (cityName) =>
      `HVAC maintenance is critical in ${cityName} with Utah's 95°F+ summer temperatures. Schedule A/C servicing in May before demand spikes. A failed A/C in July creates legal exposure.`,
    tenantTip: (cityName) =>
      `Peak moving season in ${cityName}. If you're relocating for a job, start your search 45–60 days before your start date. Shorter windows mean fewer options.`,
    investorTip: (cityName) =>
      `Summer lease-ups in ${cityName} are fastest of the year. If you have a vacancy in June–August, it should fill in 7–14 days when priced correctly.`,
  },
  fall: {
    icon: Leaf,
    bg: "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800",
    label: "Fall",
    ownerTip: (cityName) =>
      `Reach out to ${cityName} tenants whose leases expire in November–January now. Renewing early prevents winter vacancies, the hardest time of year to fill units.`,
    tenantTip: (cityName) =>
      `Fall is a useful time to negotiate lease terms in ${cityName}. Landlords are motivated to avoid winter vacancies and may offer concessions to renters who commit early.`,
    investorTip: (cityName) =>
      `Fall brings motivated sellers around ${cityName}. Properties that didn't sell in spring/summer often see price reductions — opportunity for patient buyers.`,
  },
}

type SeasonalCalloutProps = {
  cityName: string
  audience?: "owner" | "tenant" | "investor"
}

export function SeasonalCallout({ cityName, audience = "owner" }: SeasonalCalloutProps) {
  const current = getSeason()

  return (
    <section aria-label={`Four-season guide for ${cityName}`}>
      <h2 className="mb-4 text-xl font-bold">Four-season Wasatch guide for {cityName}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SEASON_ORDER.map((season) => {
          const config = seasonConfig[season]
          const Icon = config.icon
          const tip = ((): string => {
            switch (audience) {
              case "tenant":
                return config.tenantTip(cityName)
              case "investor":
                return config.investorTip(cityName)
              case "owner":
                return config.ownerTip(cityName)
              default: {
                const _exhaustive: never = audience
                return _exhaustive
              }
            }
          })()
          const isCurrent = season === current
          return (
            <div
              key={season}
              className={`rounded-lg border p-4 ${config.bg} ${isCurrent ? "ring-2 ring-primary/40" : ""}`}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-foreground/70" aria-hidden="true" />
                <div>
                  <p className="mb-1 text-sm font-semibold">
                    {config.label} in {cityName}
                    {isCurrent ? (
                      <span className="ml-2 text-xs font-medium text-primary">This season</span>
                    ) : null}
                  </p>
                  <p className="text-sm text-foreground/70">{tip}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
