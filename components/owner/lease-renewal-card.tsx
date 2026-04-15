"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw } from "lucide-react"
import { getUpcomingRenewals, type LeaseRenewal } from "@/lib/api/lease-renewals"

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  sent: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
  expired: "bg-muted text-foreground/70",
}

function daysUntil(dateStr: string | null): string {
  if (!dateStr) return "—"
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
  if (diff < 0) return "Overdue"
  return `${diff}d left`
}

export function LeaseRenewalCard() {
  const [renewals, setRenewals] = useState<LeaseRenewal[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getUpcomingRenewals(90)
      .then(setRenewals)
      .catch(() => setRenewals([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Upcoming Lease Renewals</CardTitle>
        <Button variant="ghost" size="icon" onClick={load} className="h-8 w-8">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : renewals.length === 0 ? (
          <p className="text-sm text-foreground/70 text-center py-4">
            No leases expiring in the next 90 days.
          </p>
        ) : (
          <div className="space-y-3">
            {renewals.map((r) => (
              <div key={r.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium">Lease ending {new Date(r.proposedStart || r.createdAt).toLocaleDateString()}</p>
                  <p className="text-foreground/70">${Number(r.currentRent).toLocaleString()}/mo</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-foreground/70">{daysUntil(r.responseDeadline)}</span>
                  <Badge className={statusColors[r.status] ?? "bg-muted"}>
                    {r.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
