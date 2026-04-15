"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Loader2, User } from "lucide-react"
import { getPropertyTours, type TourBooking } from "@/lib/api/tours"

interface TourBookingsCardProps {
  propertyId: string
}

export function TourBookingsCard({ propertyId }: TourBookingsCardProps) {
  const [tours, setTours] = useState<TourBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPropertyTours(propertyId)
      .then((res) => setTours(res.data))
      .catch(() => setTours([]))
      .finally(() => setLoading(false))
  }, [propertyId])

  const statusVariant = (status: string) => {
    switch (status) {
      case "scheduled": return "default" as const
      case "completed": return "secondary" as const
      case "cancelled": return "outline" as const
      case "no_show": return "destructive" as const
      default: return "outline" as const
    }
  }

  const upcoming = tours
    .filter((t) => t.status === "scheduled")
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 3)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Tour Bookings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </div>
        ) : upcoming.length > 0 ? (
          <div className="space-y-3">
            {upcoming.map((tour) => (
              <div key={tour.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span>{tour.prospectName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {new Date(tour.scheduledAt).toLocaleDateString()}
                  </span>
                  <Badge variant={statusVariant(tour.status)}>{tour.status}</Badge>
                </div>
              </div>
            ))}
            {tours.filter((t) => t.status === "scheduled").length > 3 && (
              <p className="text-xs text-muted-foreground">
                +{tours.filter((t) => t.status === "scheduled").length - 3} more scheduled
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No upcoming tours</p>
        )}
      </CardContent>
    </Card>
  )
}
