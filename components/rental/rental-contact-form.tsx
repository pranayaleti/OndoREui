"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitRentalLead } from "@/lib/api/rental"
import { analytics } from "@/lib/analytics"
import { trackRentalFunnel } from "@/lib/rental-analytics"

export function RentalContactForm({ propertyId }: { propertyId: string }) {
  const [kind, setKind] = useState<"property_inquiry" | "application_question" | "pm_contact">("property_inquiry")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <p className="rounded-lg border border-border bg-muted/40 p-4 text-sm" role="status">
        Message sent to leasing. Someone will follow up.
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
          await submitRentalLead(propertyId, { kind, name, email, message: message || undefined })
          analytics.trackEvent("rental_lead_submitted", "rental_application", kind)
          trackRentalFunnel("lead_submitted", propertyId)
          setDone(true)
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not send message")
        } finally {
          setBusy(false)
        }
      }}
    >
      <h3 className="font-semibold">Ask leasing</h3>
      <label className="block text-sm">
        Topic
        <select
          className="mt-1 min-h-11 w-full rounded-md border border-input bg-background px-3"
          value={kind}
          onChange={(e) => setKind(e.target.value as typeof kind)}
        >
          <option value="property_inquiry">Property inquiry</option>
          <option value="application_question">Application question</option>
          <option value="pm_contact">Contact the property manager</option>
        </select>
      </label>
      <div>
        <Label htmlFor="cname">Name</Label>
        <Input id="cname" className="mt-1" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="cemail">Email</Label>
        <Input id="cemail" type="email" className="mt-1" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="cmsg">Message</Label>
        <Textarea id="cmsg" className="mt-1" value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" variant="outline" className="min-h-11" disabled={busy}>
        {busy ? "Sending…" : "Send message"}
      </Button>
    </form>
  )
}
