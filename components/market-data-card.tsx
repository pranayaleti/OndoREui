import {
  DollarSign,
  Home,
  Users,
  TrendingUp,
  Clock,
  Building2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CityMarketData } from "@/lib/city-market-data"

function fmt(n: number): string {
  return n.toLocaleString("en-US")
}
function fmtUsd(n: number): string {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(0) + "K"
  return "$" + fmt(n)
}

type StatItem = {
  icon: React.ReactNode
  label: string
  value: string
}

function buildStats(data: CityMarketData, variant: "compact" | "full"): StatItem[] {
  const stats: StatItem[] = [
    { icon: <Home className="h-4 w-4" />, label: "Median Home Price", value: fmtUsd(data.medianHomePrice) },
    { icon: <DollarSign className="h-4 w-4" />, label: "Median Rent", value: "$" + fmt(data.medianRent) + "/mo" },
    { icon: <Users className="h-4 w-4" />, label: "Population", value: fmt(data.population) },
    { icon: <TrendingUp className="h-4 w-4" />, label: "Annual Growth", value: data.growthRate },
    { icon: <Clock className="h-4 w-4" />, label: "Avg Days on Market", value: String(data.avgDaysOnMarket) },
    { icon: <Building2 className="h-4 w-4" />, label: "Owner-Occupied", value: data.ownerOccupiedPct + "%" },
  ]
  if (variant === "full") {
    stats.push(
      { icon: <DollarSign className="h-4 w-4" />, label: "Median Income", value: fmtUsd(data.medianHouseholdIncome) },
    )
  }
  return stats
}

type MarketDataCardProps = {
  cityName: string
  data: CityMarketData
  variant?: "compact" | "full"
}

export function MarketDataCard({ cityName, data, variant = "compact" }: MarketDataCardProps) {
  const stats = buildStats(data, variant)
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{cityName} Market Snapshot</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="flex items-start gap-2">
              <div className="mt-0.5 text-primary">{s.icon}</div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-sm font-semibold">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {variant === "full" && data.topEmployers.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-1">Top Employers</p>
            <p className="text-sm">{data.topEmployers.join(" · ")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
