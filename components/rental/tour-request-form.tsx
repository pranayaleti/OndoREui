"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { requestRentalTour } from "@/lib/api/rental"
import { analytics } from "@/lib/analytics"
import { trackRentalFunnel } from "@/lib/rental-analytics"

export function TourRequestForm({ propertyId }: { propertyId: string }) {
  const [tourKind, setTourKind] = useState<"in_person" | "video">("in_person")
  const [preferredAt, setPreferredAt] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <p className="rounded-lg border border-border bg-muted/40 p-4 text-sm" role="status">
        Tour request sent. A leasing team member will confirm a time — this form does not book a calendar slot.
      </p>
    )
  }

  return (
    <form
      className="space-y-3 rounded-xl border border-border p-4"
      onSubmit={async (event) => {
        event.preventDefault()
        setBusy(true)
        setError("")
        try {
          await requestRentalTour(propertyId, {
            tourKind,
            preferredAt: preferredAt || undefined,
            name,
            email,
            phone: phone || undefined,
          })
          analytics.trackEvent("rental_tour_requested", "rental_application", tourKind)
          trackRentalFunnel("tour_requested", propertyId)
          setDone(true)
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not send tour request")
        } finally {
          setBusy(false)
        }
      }}
    >
      <h3 className="font-semibold">Schedule a tour</h3>
      <p className="text-sm text-muted-foreground">
        Choose in person or video and a preferred time. We route this to leasing — we do not auto-book a calendar.
      </p>
      <div className="flex flex-wrap gap-3 text-sm">
        <label className="flex min-h-11 items-center gap-2">
          <input type="radio" name="tourKind" checked={tourKind === "in_person"} onChange={() => setTourKind("in_person")} />
          In person
        </label>
        <label className="flex min-h-11 items-center gap-2">
          <input type="radio" name="tourKind" checked={tourKind === "video"} onChange={() => setTourKind("video")} />
          Video
        </label>
      </div>
      <div>
        <Label htmlFor="pref">Preferred date and time</Label>
        <Input id="pref" type="datetime-local" className="mt-1" value={preferredAt} onChange={(e) => setPreferredAt(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="tname">Name</Label>
        <Input id="tname" className="mt-1" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="temail">Email</Label>
        <Input id="temail" type="email" className="mt-1" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="tphone">Phone (optional)</Label>
        <Input id="tphone" type="tel" className="mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="min-h-11" disabled={busy}>
        {busy ? "Sending…" : "Request tour"}
      </Button>
    </form>
  )
}
