"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Zap, CheckCircle2, XCircle } from "lucide-react"
import { getIntegrationEvents, type IntegrationEvent } from "@/lib/api/integration-events"

export function IntegrationStatusPanel() {
  const [events, setEvents] = useState<IntegrationEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getIntegrationEvents({ limit: 20 })
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  const hubspotEvents = events.filter((e) => e.service === "hubspot")
  const zapierEvents = events.filter((e) => e.service === "zapier")

  const successRate = (evts: IntegrationEvent[]) => {
    if (evts.length === 0) return null
    const pct = Math.round((evts.filter((e) => e.success).length / evts.length) * 100)
    return pct
  }

  function EventList({ evts }: { evts: IntegrationEvent[] }) {
    if (evts.length === 0) {
      return <p className="text-sm text-muted-foreground">No events yet</p>
    }
    return (
      <div className="space-y-2">
        {evts.slice(0, 5).map((evt) => (
          <div key={evt.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {evt.success
                ? <CheckCircle2 className="h-3 w-3 text-green-500" />
                : <XCircle className="h-3 w-3 text-red-500" />
              }
              <span className="text-muted-foreground">{evt.eventType.replace(/_/g, " ")}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(evt.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Integrations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </div>
        ) : (
          <Tabs defaultValue="hubspot">
            <TabsList className="mb-3 h-8">
              <TabsTrigger value="hubspot" className="text-xs">
                HubSpot
                {successRate(hubspotEvents) !== null && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {successRate(hubspotEvents)}%
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="zapier" className="text-xs">
                Zapier
                {successRate(zapierEvents) !== null && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {successRate(zapierEvents)}%
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="hubspot" className="mt-0">
              <EventList evts={hubspotEvents} />
            </TabsContent>
            <TabsContent value="zapier" className="mt-0">
              <EventList evts={zapierEvents} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
