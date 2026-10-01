"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PageLoading } from "@/components/loading-states"
import { LoadErrorRetry } from "@/components/load-error-retry"
import { confirmVisit, getVisitByToken, isLinkNotFoundError, type SiteVisitPublic } from "@/lib/api/site-visits"
import { CONFIRM_EXPORT_SHELL, tokenFromRouteParam } from "@/lib/visit-static-paths"
import { buildGoogleCalendarUrl, formatVisitWhen } from "@/lib/visit-time"
import { SITE_EMAILS, SITE_PHONE, SITE_PHONE_TEL } from "@/lib/site"

interface Props {
  token?: string
}

type LoadState =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "error" }
  | { status: "ready"; visit: SiteVisitPublic }

function LinkNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-md text-center">
        <h1 className="mb-2 text-2xl font-bold text-foreground">Link not found</h1>
        <p className="text-muted-foreground">This confirmation link is invalid or has already been used.</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Contact us at{" "}
          <a href={`mailto:${SITE_EMAILS.primary}`} className="underline">
            {SITE_EMAILS.primary}
          </a>
        </p>
      </div>
    </main>
  )
}

export function VisitConfirmClient({ token: tokenProp }: Props) {
  const params = useParams()
  const token = tokenFromRouteParam(tokenProp, params?.token)
  const [load, setLoad] = useState<LoadState>({ status: "loading" })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!token || token === CONFIRM_EXPORT_SHELL) {
      setLoad({ status: "missing" })
      return
    }
    let cancelled = false
    setLoad({ status: "loading" })
    void getVisitByToken(token)
      .then((visit) => {
        if (!cancelled) setLoad({ status: "ready", visit })
      })
      .catch((error: unknown) => {
        // Only a 404 means the link is dead. A timeout or 5xx should not tell a valid link it is invalid.
        if (!cancelled) setLoad({ status: isLinkNotFoundError(error) ? "missing" : "error" })
      })
    return () => {
      cancelled = true
    }
  }, [token, attempt])

  switch (load.status) {
    case "loading":
      return <PageLoading />
    case "missing":
      return <LinkNotFound />
    case "error":
      return (
        <LoadErrorRetry
          title="We could not load this page"
          message="Your link is probably fine. Something went wrong on our end, so please try again."
          onRetry={() => setAttempt((n) => n + 1)}
        />
      )
    case "ready":
      return <VisitConfirmForm visit={load.visit} token={token} />
    default: {
      const _exhaustive: never = load
      return _exhaustive
    }
  }
}

function VisitConfirmForm({ visit, token }: { visit: SiteVisitPublic; token: string }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null)
  const [propertyTitle, setPropertyTitle] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (visit.status !== "proposed" && !confirmedAt) {
    if (visit.status === "confirmed") {
      return (
        <main className="flex min-h-screen items-center justify-center bg-background p-6">
          <div className="max-w-md text-center">
            <h1 className="mb-2 text-2xl font-bold text-foreground">Visit already confirmed</h1>
            {visit.scheduledAt ? (
              <p className="text-muted-foreground">Your visit is scheduled for {formatVisitWhen(visit.scheduledAt)}</p>
            ) : null}
          </div>
        </main>
      )
    }
    // Cancelled, expired or any other state: never tell the lead the visit is confirmed.
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md text-center">
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            {visit.status === "cancelled" ? "This visit was cancelled" : "This visit link is no longer active"}
          </h1>
          <p className="text-muted-foreground">
            To book a new time, <a href="/contact/" className="underline">contact us</a> or call{" "}
            <a href={`tel:${SITE_PHONE_TEL}`} className="underline">
              {SITE_PHONE}
            </a>
            .
          </p>
        </div>
      </main>
    )
  }

  const handleConfirm = async () => {
    if (selected === null) return
    setLoading(true)
    setError(null)
    try {
      const result = await confirmVisit(visit.id, token, selected)
      setConfirmedAt(result.scheduledAt)
      setPropertyTitle(result.propertyTitle)
    } catch {
      setError("Something went wrong. Please try again or contact us.")
    } finally {
      setLoading(false)
    }
  }

  if (confirmedAt) {
    const address = visit.properties ? `${visit.properties.addressLine1}, ${visit.properties.city}` : undefined
    const calUrl = buildGoogleCalendarUrl({
      startIso: confirmedAt,
      title: propertyTitle || visit.properties?.title,
      address,
    })

    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md text-center">
          <div className="mb-4 text-4xl">🎉</div>
          <h1 className="mb-2 text-2xl font-bold text-foreground">Visit Confirmed!</h1>
          <p className="mb-6 text-muted-foreground">
            Your visit is booked for{" "}
            {formatVisitWhen(confirmedAt)}
          </p>
          {(propertyTitle || visit.properties) && (
            <p className="mb-6 text-sm text-muted-foreground">
              {propertyTitle || visit.properties?.title}
              {visit.properties && `, ${visit.properties.addressLine1}, ${visit.properties.city}`}
            </p>
          )}
          <a
            href={calUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-xl bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
          >
            Add to Google Calendar
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-2xl font-bold text-foreground">Choose a time</h1>
        {visit.properties ? (
          <p className="mb-6 text-muted-foreground">
            {visit.properties.title}, {visit.properties.addressLine1}
          </p>
        ) : null}
        <div className="mb-6 space-y-3">
          {visit.proposedSlots.map((slot, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`w-full rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                selected === i
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-muted-foreground/40"
              }`}
            >
              <span className="font-medium text-foreground">
                {formatVisitWhen(slot)}
              </span>
            </button>
          ))}
        </div>
        {error ? <p className="mb-3 text-sm text-destructive-emphasis">{error}</p> : null}
        <button
          type="button"
          onClick={() => void handleConfirm()}
          disabled={selected === null || loading}
          className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
        >
          {loading ? "Confirming..." : "Confirm Visit"}
        </button>
      </div>
    </main>
  )
}
