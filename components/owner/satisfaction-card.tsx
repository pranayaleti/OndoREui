"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Star, TrendingDown, TrendingUp, Minus } from "lucide-react"
import { getPropertySatisfaction, type PropertySatisfaction } from "@/lib/api/satisfaction"

interface SatisfactionCardProps {
  propertyId: string
}

export function SatisfactionCard({ propertyId }: SatisfactionCardProps) {
  const [data, setData] = useState<PropertySatisfaction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPropertySatisfaction(propertyId)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [propertyId])

  const trendIcon = (trend: string) => {
    if (trend === "improving") return <TrendingUp className="h-3 w-3 text-green-500" />
    if (trend === "declining") return <TrendingDown className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3 text-muted-foreground" />
  }

  const trendVariant = (trend: string) => {
    if (trend === "improving") return "default" as const
    if (trend === "declining") return "destructive" as const
    return "secondary" as const
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Star className="h-4 w-4" />
          Tenant Satisfaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </div>
        ) : data && data.responseCount > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-semibold">{data.averageRating.toFixed(1)}</span>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
              <Badge variant={trendVariant(data.trend)} className="flex items-center gap-1">
                {trendIcon(data.trend)}
                {data.trend}
              </Badge>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>NPS: {data.npsScore > 0 ? "+" : ""}{data.npsScore}</span>
              <span>{data.responseCount} response{data.responseCount !== 1 ? "s" : ""}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No survey responses yet</p>
        )}
      </CardContent>
    </Card>
  )
}
