"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { startRentalApplication } from "@/lib/api/rental"
import { rememberRentalApplication } from "@/lib/rental-application"
import { RentalApplicationWizard } from "@/components/rental/rental-application-wizard"
import { FairHousingNotice } from "@/components/rental/fair-housing-notice"
import { analytics } from "@/lib/analytics"
import { trackRentalFunnel } from "@/lib/rental-analytics"
import { referralCodeForThisVisit } from "@/lib/referral-code"

export function RentalStartClient({
  propertyId,
  token,
}: {
  propertyId?: string
  token?: string
}) {
  const params = useParams()
  const resolvedPropertyId = propertyId || (params?.propertyId as string | undefined)
  const [started, setStarted] = useState<{ id: string; resumeToken?: string } | null>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  // Fill in a friend's code from ?ref= or an earlier visit to their invite link.
  // Read after hydration because the page is statically exported.
  useEffect(() => {
    const code = referralCodeForThisVisit(window.location.search)
    if (code) setReferralCode((current) => current || code)
  }, [])

  if (started) {
    return <RentalApplicationWizard applicationId={started.id} resumeToken={started.resumeToken} applyToken={token} />
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-bold">Start a rental application</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Save anytime. You can continue later on this device. Starting is not an approval.
      </p>
      <form
        className="mt-6 space-y-3"
        onSubmit={async (event) => {
          event.preventDefault()
          setBusy(true)
          setError("")
          try {
            const app = await startRentalApplication({
              propertyId: resolvedPropertyId,
              token,
              firstName,
              lastName,
              email,
              referralCode: referralCode.trim() || undefined,
            })
            rememberRentalApplication({
              id: app.id,
              resumeToken: app.resumeToken ?? "",
              propertyId: app.propertyId,
              updatedAt: new Date().toISOString(),
            })
            analytics.trackEvent("rental_application_started", "rental_application", "start")
            trackRentalFunnel("application_started", resolvedPropertyId)
            trackRentalFunnel("lead_converted", resolvedPropertyId)
            setStarted({ id: app.id, resumeToken: app.resumeToken })
          } catch (err) {
            setError(err instanceof Error ? err.message : "Could not start")
          } finally {
            setBusy(false)
          }
        }}
      >
        <div>
          <Label htmlFor="fn">First name</Label>
          <Input id="fn" className="mt-1" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="ln">Last name</Label>
          <Input id="ln" className="mt-1" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="em">Email</Label>
          <Input id="em" type="email" className="mt-1" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="ref">Referral code (optional)</Label>
          <Input
            id="ref"
            className="mt-1 font-mono uppercase"
            autoComplete="off"
            maxLength={32}
            aria-describedby="ref-help"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
          />
          <p id="ref-help" className="mt-1 text-xs text-muted-foreground">
            If someone referred you to Ondo, enter their code. You get a welcome bonus in Ondo Rewards if you sign a
            lease.
          </p>
        </div>
        {error ? <p className="text-sm text-destructive-emphasis">{error}</p> : null}
        <Button type="submit" className="min-h-11 w-full" disabled={busy}>
          {busy ? "Starting…" : "Continue"}
        </Button>
      </form>
      <div className="mt-6">
        <FairHousingNotice />
      </div>
    </main>
  )
}
