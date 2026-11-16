"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getRentalApplication } from "@/lib/api/rental"
import { adultProgressFromListRow, readStoredApplications } from "@/lib/rental-application"
import { APP_PORTAL_LOGIN_URL } from "@/lib/site"
import { ApplicationStatusBadge } from "@/components/rental/application-status"
import { FairHousingNotice } from "@/components/rental/fair-housing-notice"

type Row = {
  id: string
  title: string
  status: string
  percent: number
  nextAction: string
  submittedAt: string | null
  adultProgress: string | null
}

/**
 * Lists the applications saved in this browser, loaded by their resume tokens. This site has no
 * sign-in, so it never asks for the signed-in list (/rental/applications/my): the API accepts only
 * a portal access token there and answers 401 to every request from here. Applications linked to
 * an account are listed in the portal, which the sign-in link leads to.
 */
export function MyApplicationsClient() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const byId = new Map<string, Row>()
      const stored = readStoredApplications()
      for (const item of stored) {
        if (byId.has(item.id)) continue
        try {
          const bundle = await getRentalApplication(item.id, item.resumeToken)
          byId.set(item.id, {
            id: item.id,
            title: bundle.property?.title || "Rental application",
            status: bundle.application.status,
            percent: bundle.application.completionPercent,
            nextAction: bundle.nextAction,
            submittedAt: bundle.application.submittedAt,
            adultProgress: adultProgressFromListRow({
              completedAdultApplicants: bundle.completedAdultApplicants,
              requiredAdults: bundle.requiredAdults,
            }),
          })
        } catch {
          byId.set(item.id, {
            id: item.id,
            title: item.propertyTitle || "Rental application",
            status: "started",
            percent: 0,
            nextAction: "Continue application",
            submittedAt: null,
            adultProgress: null,
          })
        }
      }
      if (!cancelled) {
        setRows([...byId.values()])
        setLoading(false)
        setError("")
      }
    })().catch((err: unknown) => {
      if (!cancelled) {
        setError(err instanceof Error ? err.message : "Could not load applications")
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10" aria-busy="true">
        <h1 className="text-2xl font-bold">My applications</h1>
        <p className="mt-6">Loading applications…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-bold">My applications</h1>
        <p role="alert" className="mt-6 text-destructive-emphasis">{error}</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">My applications</h1>
      {rows.length === 0 ? (
        <div className="mt-6 rounded-xl border border-border p-6 text-center">
          <p className="text-muted-foreground">No rental applications are saved in this browser.</p>
          <Link href="/properties" className="mt-4 inline-flex min-h-11 items-center font-medium underline">
            Browse rentals
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((row) => (
            <li key={row.id} className="rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{row.title}</p>
                <ApplicationStatusBadge status={row.status} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {Math.round(row.percent)}% complete
                {row.submittedAt ? ` · Submitted ${row.submittedAt.slice(0, 10)}` : ""}
              </p>
              {row.adultProgress ? <p className="mt-1 text-sm text-muted-foreground">{row.adultProgress}</p> : null}
              <p className="mt-1 text-sm">{row.nextAction}</p>
              {/* Plain anchor: /applications/<id>/ has no exported page (see isClientOnlyRentalPath),
                  so a next/link here would 404 its prefetch for every row. */}
              <a href={`/applications/${row.id}/`} className="mt-3 inline-flex min-h-11 items-center text-sm font-medium underline">
                Continue application
              </a>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 text-sm">
        <p className="text-muted-foreground">Applications linked to a portal account are listed in the portal.</p>
        <Link href={APP_PORTAL_LOGIN_URL} className="inline-flex min-h-11 items-center font-medium underline">
          Sign in to the portal
        </Link>
      </div>
      <div className="mt-8">
        <FairHousingNotice />
      </div>
    </main>
  )
}

export { applicationStatusLabel } from "@/lib/rental-application"
