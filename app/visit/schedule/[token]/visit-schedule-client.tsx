"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PageLoading } from "@/components/loading-states"
import {
  bookSchedule,
  cancelSchedule,
  getSchedule,
  rescheduleSchedule,
  type SchedulePayload,
} from "@/lib/api/site-visits"
import { SCHEDULE_EXPORT_SHELL, tokenFromRouteParam } from "@/lib/visit-static-paths"

interface Props {
  token?: string
}

type LoadState =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "ready"; schedule: SchedulePayload }

function LinkNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-md text-center">
        <h1 className="mb-2 text-2xl font-bold text-foreground">Link not found</h1>
        <p className="text-muted-foreground">This schedule link is invalid or is no longer available.</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Contact us at{" "}
          <a href="mailto:hello@ondorealestate.com" className="underline">
            hello@ondorealestate.com
          </a>
        </p>
      </div>
    </div>
  )
}

export function VisitScheduleClient({ token: tokenProp }: Props) {
  const params = useParams()
  const token = tokenFromRouteParam(tokenProp, params?.token)
  const [load, setLoad] = useState<LoadState>({ status: "loading" })

  useEffect(() => {
    if (!token || token === SCHEDULE_EXPORT_SHELL) {
      setLoad({ status: "missing" })
      return
    }
    let cancelled = false
    setLoad({ status: "loading" })
    void getSchedule(token)
      .then((schedule) => {
        if (!cancelled) setLoad({ status: "ready", schedule })
      })
      .catch(() => {
        if (!cancelled) setLoad({ status: "missing" })
      })
    return () => {
      cancelled = true
    }
  }, [token])

  switch (load.status) {
    case "loading":
      return <PageLoading />
    case "missing":
      return <LinkNotFound />
    case "ready":
      return <VisitScheduleForm schedule={load.schedule} token={token} />
    default: {
      const _exhaustive: never = load
      return _exhaustive
    }
  }
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })
}

function VisitScheduleForm({ schedule, token }: { schedule: SchedulePayload; token: string }) {
  const [windows, setWindows] = useState(schedule.windows)
  const [existing, setExisting] = useState(schedule.existingVisit)
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (schedule.occupancy === "occupied") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md text-center">
          <h1 className="mb-2 text-2xl font-bold text-foreground">A manager will email times to confirm</h1>
          <p className="text-muted-foreground">
            This home is currently occupied. You will receive an email with proposed visit times.
          </p>
        </div>
      </div>
    )
  }

  const book = async () => {
    if (!selected) return
    setLoading(true)
    setError(null)
    try {
      if (existing?.status === "confirmed") {
        const result = await rescheduleSchedule(token, selected)
        setExisting({ id: result.id, status: "confirmed", scheduledAt: result.scheduledAt })
      } else {
        const result = await bookSchedule(token, selected)
        setExisting({ id: result.id, status: "confirmed", scheduledAt: result.scheduledAt })
      }
      setWindows((prev) => prev.filter((w) => w.id !== selected))
      setSelected(null)
    } catch {
      setError("That time is no longer available. Please pick another window.")
    } finally {
      setLoading(false)
    }
  }

  const cancel = async () => {
    setLoading(true)
    setError(null)
    try {
      await cancelSchedule(token)
      setExisting(null)
    } catch {
      setError("Could not cancel this showing. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-2xl font-bold text-foreground">Schedule a showing</h1>
        <p className="mb-6 text-muted-foreground">
          {schedule.propertyTitle}
          {schedule.propertyCity ? `, ${schedule.propertyCity}` : ""}
        </p>
        {existing?.status === "confirmed" && existing.scheduledAt ? (
          <div className="mb-6 rounded-xl border border-border bg-muted p-3 text-sm text-foreground">
            <p>Your showing is confirmed for {formatWhen(existing.scheduledAt)}.</p>
            <button
              type="button"
              onClick={() => void cancel()}
              disabled={loading}
              className="mt-2 text-destructive underline"
            >
              Cancel showing
            </button>
          </div>
        ) : null}
        <div className="mb-6 space-y-3">
          {windows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No open windows right now. Please check back later.</p>
          ) : (
            windows.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelected(slot.id)}
                className={`w-full rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                  selected === slot.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-muted-foreground/40"
                }`}
              >
                <span className="font-medium text-foreground">{formatWhen(slot.startsAt)}</span>
              </button>
            ))
          )}
        </div>
        {error ? <p className="mb-3 text-sm text-destructive">{error}</p> : null}
        <button
          type="button"
          onClick={() => void book()}
          disabled={!selected || loading}
          className="w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
        >
          {loading
            ? "Saving..."
            : existing?.status === "confirmed"
              ? "Reschedule"
              : "Book showing"}
        </button>
      </div>
    </div>
  )
}
