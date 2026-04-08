import { Snowflake, Sun, Leaf, Flower2 } from "lucide-react"

type Season = "winter" | "spring" | "summer" | "fall"

function getSeason(): Season {
  const month = new Date().getMonth() // 0-indexed
  if (month >= 2 && month <= 4) return "spring"
  if (month >= 5 && month <= 7) return "summer"
  if (month >= 8 && month <= 10) return "fall"
  return "winter"
}

const seasonConfig: Record<Season, {
  icon: React.ComponentType<{ className?: string }>
  bg: string
  label: string
  ownerTip: string
  tenantTip: string
  investorTip: string
}> = {
  winter: {
    icon: Snowflake,
    bg: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
    label: "Winter",
    ownerTip: "Schedule furnace inspections and pipe insulation checks before freezing temperatures. Utah winters can drop to single digits — protect your asset.",
    tenantTip: "Report drafty windows or thermostat issues early. Your landlord is responsible for maintaining heat — submit a maintenance request in the portal.",
    investorTip: "Winter is historically the slowest listing season in Utah — use this time to complete renovations and be ready to list in February/March for spring demand.",
  },
  spring: {
    icon: Flower2,
    bg: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
    label: "Spring",
    ownerTip: "Spring is the strongest rental listing season on the Wasatch Front. List by mid-March to capture peak demand. Professional photos and video tours now pay maximum returns.",
    tenantTip: "Spring is competitive for rentals in Utah. If your lease ends May–July, start searching 60–90 days ahead. The best units near tech corridors move in days.",
    investorTip: "Spring is prime acquisition season. Get your financing pre-approved in January so you can move fast when the right property comes to market.",
  },
  summer: {
    icon: Sun,
    bg: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800",
    label: "Summer",
    ownerTip: "HVAC maintenance is critical with Utah's 95°F+ summer temperatures. Schedule A/C servicing in May before demand spikes. A failed A/C in July creates legal exposure.",
    tenantTip: "Peak moving season. If you&apos;re relocating for a tech job, start your search 45–60 days before your start date. Shorter windows mean fewer options.",
    investorTip: "Summer lease-ups are fastest of the year. If you have a vacancy in June–August, it should fill in 7–14 days when priced correctly.",
  },
  fall: {
    icon: Leaf,
    bg: "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800",
    label: "Fall",
    ownerTip: "Reach out to tenants whose leases expire in November–January now. Renewing early prevents winter vacancies — the hardest time of year to fill units.",
    tenantTip: "Fall is a great time to negotiate lease terms. Landlords are motivated to avoid winter vacancies and may offer concessions to quality tenants who commit early.",
    investorTip: "Fall brings motivated sellers on the Wasatch Front. Properties that didn't sell in spring/summer often see price reductions — opportunity for patient buyers.",
  },
}

type SeasonalCalloutProps = {
  cityName: string
  audience?: "owner" | "tenant" | "investor"
}

export function SeasonalCallout({ cityName, audience = "owner" }: SeasonalCalloutProps) {
  const season = getSeason()
  const config = seasonConfig[season]
  const Icon = config.icon

  const tip =
    audience === "tenant" ? config.tenantTip :
    audience === "investor" ? config.investorTip :
    config.ownerTip

  return (
    <div className={`rounded-lg border p-4 ${config.bg}`}>
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 shrink-0 mt-0.5 text-foreground/70" />
        <div>
          <p className="font-semibold text-sm mb-1">
            {config.label} Tip for {cityName}
          </p>
          <p className="text-sm text-foreground/70">{tip}</p>
        </div>
      </div>
    </div>
  )
}
