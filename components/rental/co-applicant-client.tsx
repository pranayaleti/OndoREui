"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCoApplicantInvite, saveCoApplicantProgress } from "@/lib/api/rental"
import { FairHousingNotice } from "@/components/rental/fair-housing-notice"

export function CoApplicantClient({ token: tokenProp }: { token?: string }) {
  const params = useParams()
  const token = tokenProp || String(params?.token ?? "")
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [phone, setPhone] = useState("")
  const [credit, setCredit] = useState(false)
  const [background, setBackground] = useState(false)
  const [rental, setRental] = useState(false)
  const [employment, setEmployment] = useState(false)

  useEffect(() => {
    if (!token || token === "_") return
    void getCoApplicantInvite(token).catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Invite is not valid")
    })
  }, [token])

  if (done) {
    return (
      <main className="mx-auto max-w-lg px-4 py-12">
        <h1 className="text-2xl font-bold">Your portion is saved</h1>
        <p className="mt-2 text-sm text-muted-foreground">The primary applicant can see your status.</p>
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
          setBusy(true)
          setError("")
          try {
            await saveCoApplicantProgress(token, {
              applicant: { phone },
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
          <Input id="phone" className="mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
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
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="min-h-11 w-full" disabled={busy}>
          Save my application
        </Button>
      </form>
      <FairHousingNotice />
    </main>
  )
}
