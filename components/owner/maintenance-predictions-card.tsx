"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { getAtRiskEquipment, type Equipment } from "@/lib/api/predictive-maintenance"

const conditionColors: Record<string, string> = {
  good: "bg-green-100 text-green-700",
  fair: "bg-amber-100 text-amber-700",
  poor: "bg-red-100 text-red-700",
  critical: "bg-red-200 text-red-800",
  replaced: "bg-muted text-foreground/70",
}

export function MaintenancePredictionsCard({ propertyId }: { propertyId: string }) {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    getAtRiskEquipment(propertyId)
      .then(setEquipment)
      .catch(() => setEquipment([]))
      .finally(() => setLoading(false))
  }, [propertyId])

  useEffect(() => { load() }, [load])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          At-Risk Equipment
        </CardTitle>
        <Button variant="ghost" size="icon" aria-label="Refresh" onClick={load} className="h-8 w-8">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : equipment.length === 0 ? (
          <p className="text-sm text-foreground/70 text-center py-4">
            No at-risk equipment detected.
          </p>
        ) : (
          <div className="space-y-3">
            {equipment.map((eq) => (
              <div key={eq.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium">{eq.name}</p>
                  <p className="text-foreground/70 text-xs">
                    {eq.category}{eq.nextServiceDate ? ` · Next service: ${new Date(eq.nextServiceDate).toLocaleDateString()}` : ""}
                  </p>
                </div>
                <Badge className={conditionColors[eq.condition] ?? "bg-muted"}>
                  {eq.condition}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
