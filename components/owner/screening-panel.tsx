"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { UserCheck, Plus, RefreshCw } from "lucide-react"
import {
  listScreenings,
  initiateScreening,
  type Screening,
} from "@/lib/api/screening"

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
}

export function ScreeningPanel() {
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [loading, setLoading] = useState(true)
  const [showInitiate, setShowInitiate] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    tenantName: "",
    tenantEmail: "",
    propertyId: "",
  })

  const load = () => {
    setLoading(true)
    listScreenings()
      .then((res) => setScreenings(res.screenings))
      .catch(() => setScreenings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleInitiate = async () => {
    if (!form.tenantName || !form.tenantEmail || !form.propertyId) return
    try {
      setSubmitting(true)
      await initiateScreening({
        tenantName: form.tenantName,
        tenantEmail: form.tenantEmail,
        propertyId: form.propertyId,
      })
      setShowInitiate(false)
      setForm({ tenantName: "", tenantEmail: "", propertyId: "" })
      load()
    } catch {
      // Error handling could be enhanced with toast
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Tenant Screenings
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={load} className="h-8 w-8">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={() => setShowInitiate(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Screen Tenant
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : screenings.length === 0 ? (
            <p className="text-sm text-foreground/70 text-center py-4">
              No screening requests yet.
            </p>
          ) : (
            <div className="space-y-3">
              {screenings.slice(0, 10).map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{s.tenantName}</p>
                    <p className="text-foreground/70">{s.tenantEmail}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.result?.overallScore != null && (
                      <span className="text-xs font-medium">Score: {s.result.overallScore}</span>
                    )}
                    <Badge className={statusColors[s.status] ?? "bg-muted"}>
                      {s.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showInitiate} onOpenChange={setShowInitiate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Initiate Tenant Screening</DialogTitle>
            <DialogDescription>
              Send a screening invitation to a prospective tenant.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tenant Name</Label>
              <Input
                value={form.tenantName}
                onChange={(e) => setForm((f) => ({ ...f, tenantName: e.target.value }))}
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label>Tenant Email</Label>
              <Input
                type="email"
                value={form.tenantEmail}
                onChange={(e) => setForm((f) => ({ ...f, tenantEmail: e.target.value }))}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Property ID</Label>
              <Input
                value={form.propertyId}
                onChange={(e) => setForm((f) => ({ ...f, propertyId: e.target.value }))}
                placeholder="Property UUID"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowInitiate(false)}>Cancel</Button>
              <Button
                onClick={handleInitiate}
                disabled={submitting || !form.tenantName || !form.tenantEmail || !form.propertyId}
              >
                {submitting ? "Sending..." : "Send Screening Invite"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
