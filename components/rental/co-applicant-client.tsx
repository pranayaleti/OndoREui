"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCoApplicantInvite, saveCoApplicantProgress } from "@/lib/api/rental"
import { FairHousingNotice } from "@/components/rental/fair-housing-notice"
import { SITE_PHONE, SITE_PHONE_TEL } from "@/lib/site"

type InviteState = "loading" | "valid" | "invalid"
type Invite = Awaited<ReturnType<typeof getCoApplicantInvite>>

export function CoApplicantClient({ token: tokenProp }: { token?: string }) {
  const params = useParams()
  const token = tokenProp || String(params?.token ?? "")
  const [error, setError] = useState("")
  const [invite, setInvite] = useState<InviteState>("loading")
  const [existing, setExisting] = useState<Invite["coApplicant"]["wizardPayload"]>({})
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [phone, setPhone] = useState("")
  const [credit, setCredit] = useState(false)
  const [background, setBackground] = useState(false)
  const [rental, setRental] = useState(false)
  const [employment, setEmployment] = useState(false)

  useEffect(() => {
    // "_" is the static-export placeholder; the real token arrives on the live URL.
    if (token === "_") return
    if (!token) {
      setInvite("invalid")
      setError("This invite link is not valid.")
      return
    }
    let cancelled = false
    setInvite("loading")
    getCoApplicantInvite(token)
      .then((data) => {
        if (cancelled) return
        setExisting(data.coApplicant.wizardPayload ?? {})
        const savedPhone = (data.coApplicant.wizardPayload?.["applicant"] as { phone?: unknown } | undefined)?.phone
        if (typeof savedPhone === "string") setPhone((current) => current || savedPhone)
        setInvite("valid")
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setInvite("invalid")
        setError(err instanceof Error ? err.message : "This invite link is not valid.")
      })
    return () => {
      cancelled = true
    }
  }, [token])

  const canSubmit = phone.trim().length > 0 && credit && background && rental && employment

  if (done) {
    return (
      <main className="mx-auto max-w-lg px-4 py-12">
        <h1 className="text-2xl font-bold">Your portion is saved</h1>
        <p className="mt-2 text-sm text-muted-foreground">The primary applicant can see your status.</p>
      </main>
    )
  }

  if (invite === "loading") {
    return (
      <main className="mx-auto max-w-lg px-4 py-12">
        <h1 className="text-2xl font-bold">Co-applicant application</h1>
        <p className="mt-2 text-sm text-muted-foreground" role="status">Checking your invite...</p>
      </main>
    )
  }

  if (invite === "invalid") {
    return (
      <main className="mx-auto max-w-lg space-y-3 px-4 py-12">
        <h1 className="text-2xl font-bold">This invite link cannot be used</h1>
        {error ? <p className="text-sm text-destructive-emphasis" role="alert">{error}</p> : null}
        <p className="text-sm text-muted-foreground">
          The link may have expired or been replaced. Ask the primary applicant to send a new invite, or{" "}
          <Link href="/contact/" className="underline">contact us</Link> or call{" "}
          <a href={`tel:${SITE_PHONE_TEL}`} className="underline">{SITE_PHONE}</a>.
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-lg space-y-4 px-4 py-10">
      <h1 className="text-2xl font-bold">Co-applicant application</h1>
      <p className="text-sm text-muted-foreground">Complete your own information, documents authorization, and consents. This is not an approval.</p>
      <form
        className="space-y-3"
        onSubmit={async (event) => {
          event.preventDefault()
          if (!canSubmit) return
          setBusy(true)
          setError("")
          try {
            await saveCoApplicantProgress(token, {
              ...existing,
              applicant: { ...(existing["applicant"] as Record<string, unknown> | undefined), phone: phone.trim() },
              authorizations: { credit, background, rental, employment },
            }, "authorization")
            setDone(true)
          } catch (err) {
            setError(err instanceof Error ? err.message : "Could not save")
          } finally {
            setBusy(false)
          }
        }}
      >
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" autoComplete="tel" required className="mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        {(["credit", "background", "rental", "employment"] as const).map((key) => (
          <label key={key} className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={key === "credit" ? credit : key === "background" ? background : key === "rental" ? rental : employment}
              onChange={(e) => {
                if (key === "credit") setCredit(e.target.checked)
                if (key === "background") setBackground(e.target.checked)
                if (key === "rental") setRental(e.target.checked)
                if (key === "employment") setEmployment(e.target.checked)
              }}
            />
            I authorize {key} verification
          </label>
        ))}
        {error ? <p className="text-sm text-destructive-emphasis">{error}</p> : null}
        <Button type="submit" className="min-h-11 w-full" disabled={busy || !canSubmit}>
          Save my application
        </Button>
      </form>
      <FairHousingNotice />
    </main>
  )
}
