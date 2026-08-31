"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getRentalApplication, listMyRentalApplications } from "@/lib/api/rental"
import { adultProgressFromListRow, readStoredApplications } from "@/lib/rental-application"
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

export function MyApplicationsClient() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const byId = new Map<string, Row>()
      try {
        const mine = await listMyRentalApplications()
        for (const item of mine) {
          byId.set(item.id, {
            id: item.id,
            title: item.property?.title || "Rental application",
            status: item.status,
            percent: item.completionPercent,
            nextAction: item.applicantNextAction || "Continue application",
            submittedAt: item.submittedAt,
            adultProgress: adultProgressFromListRow(item),
          })
        }
      } catch {
        // Guest resume tokens still load below.
      }
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
        <p>Loading applications…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-destructive">{error}</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">My applications</h1>
      {rows.length === 0 ? (
        <div className="mt-6 rounded-xl border border-border p-6 text-center">
          <p className="text-muted-foreground">You do not have any rental applications yet.</p>
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
              <Link href={`/applications/${row.id}`} className="mt-3 inline-flex min-h-11 items-center text-sm font-medium underline">
                Continue application
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8">
        <FairHousingNotice />
      </div>
    </main>
  )
}

export { applicationStatusLabel } from "@/lib/rental-application"
