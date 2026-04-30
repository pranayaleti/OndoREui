"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Globe, ExternalLink, Loader2 } from "lucide-react"
import { getListingSyndications, syndicateListing, type ListingSyndication } from "@/lib/api/syndication"
import { useToast } from "@/hooks/use-toast"

const PLATFORMS = [
  { id: "zillow", label: "Zillow" },
  { id: "apartments.com", label: "Apartments.com" },
  { id: "ondo", label: "Ondo (Internal)" },
]

interface SyndicationPanelProps {
  propertyId: string
  listingId?: string
}

export function SyndicationPanel({ propertyId: _propertyId, listingId }: SyndicationPanelProps) {
  const [syndications, setSyndications] = useState<ListingSyndication[]>([])
  const [loading, setLoading] = useState(false)
  const [syndicating, setSyndicating] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  async function loadSyndications() {
    if (!listingId) return
    setLoading(true)
    try {
      const res = await getListingSyndications(listingId)
      setSyndications(res.data)
    } catch {
      setSyndications([])
    } finally {
      setLoading(false)
    }
  }

  async function handleSyndicate() {
    if (!listingId || selectedPlatforms.length === 0) return
    setSyndicating(true)
    try {
      await syndicateListing(listingId, selectedPlatforms)
      toast({ title: "Syndication started", description: `Publishing to ${selectedPlatforms.length} platform(s)` })
      setDialogOpen(false)
      setSelectedPlatforms([])
      await loadSyndications()
    } catch {
      toast({ title: "Syndication failed", description: "Could not publish listing", variant: "destructive" })
    } finally {
      setSyndicating(false)
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case "active": return "default" as const
      case "pending": return "secondary" as const
      case "failed": return "destructive" as const
      default: return "outline" as const
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Listing Syndication
        </CardTitle>
        {listingId && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" onClick={loadSyndications}>
                <ExternalLink className="h-3 w-3 mr-1" />
                Syndicate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Syndicate Listing</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-4">
                {PLATFORMS.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedPlatforms.includes(p.id)}
                      onCheckedChange={(checked) => {
                        setSelectedPlatforms((prev) =>
                          checked ? [...prev, p.id] : prev.filter((id) => id !== p.id)
                        )
                      }}
                    />
                    <span className="text-sm">{p.label}</span>
                  </label>
                ))}
              </div>
              <Button onClick={handleSyndicate} disabled={syndicating || selectedPlatforms.length === 0}>
                {syndicating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Publish to {selectedPlatforms.length} Platform(s)
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </div>
        ) : syndications.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {syndications.map((s) => (
              <Badge key={s.id} variant={statusColor(s.status)}>
                {s.platform} — {s.status}
                {s.leadsCount > 0 && ` (${s.leadsCount} leads)`}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {listingId ? "Not yet syndicated to any platform" : "No active listing for this property"}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
