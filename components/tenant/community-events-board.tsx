"use client"

import { useState, useEffect } from "react"
import { getTenantEvents, rsvpEvent } from "../../lib/api/tenant-services"

interface Event {
  id: string
  title: string
  startAt: string
  endAt?: string
  location?: string
  goingCount?: number
  maybeCount?: number
  notGoingCount?: number
  myRsvp?: "going" | "maybe" | "not_going" | null
}

export function CommunityEventsBoard() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [rsvping, setRsvping] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTenantEvents()
        const list = (res as any)?.data ?? (res as any) ?? []
        setEvents(Array.isArray(list) ? list : [])
      } catch (err: any) {
        setError(err.message || "Failed to load events")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleRsvp = async (eventId: string, status: "going" | "maybe" | "not_going") => {
    setRsvping(eventId)
    try {
      await rsvpEvent(eventId, { status })
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id !== eventId) return e
          const prev_status = e.myRsvp
          const updated = { ...e, myRsvp: status }
          // Adjust counts optimistically
          if (prev_status === "going") updated.goingCount = (updated.goingCount ?? 1) - 1
          if (prev_status === "maybe") updated.maybeCount = (updated.maybeCount ?? 1) - 1
          if (prev_status === "not_going") updated.notGoingCount = (updated.notGoingCount ?? 1) - 1
          if (status === "going") updated.goingCount = (updated.goingCount ?? 0) + 1
          if (status === "maybe") updated.maybeCount = (updated.maybeCount ?? 0) + 1
          if (status === "not_going") updated.notGoingCount = (updated.notGoingCount ?? 0) + 1
          return updated
        })
      )
    } catch (err: any) {
      setError(err.message || "RSVP failed")
    } finally {
      setRsvping(null)
    }
  }

  if (loading) {
    return (
      <div className="bg-card border rounded-lg p-6 text-center text-gray-400 text-sm">
        Loading events...
      </div>
    )
  }

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Community Events</h2>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {events.length === 0 ? (
        <p className="text-center text-gray-500 py-6 text-sm">No upcoming events.</p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900">{event.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(event.startAt).toLocaleString()}
                  {event.endAt && ` — ${new Date(event.endAt).toLocaleTimeString()}`}
                </p>
                {event.location && (
                  <p className="text-xs text-gray-500">{event.location}</p>
                )}
              </div>

              {/* Counts */}
              <div className="flex gap-3 text-xs text-gray-500">
                <span>{event.goingCount ?? 0} going</span>
                <span>{event.maybeCount ?? 0} maybe</span>
                <span>{event.notGoingCount ?? 0} can't go</span>
              </div>

              {/* RSVP buttons */}
              <div className="flex gap-2">
                {(["going", "maybe", "not_going"] as const).map((status) => {
                  const labels = { going: "Going", maybe: "Maybe", not_going: "Can't Go" }
                  const active =
                    status === "going"
                      ? "bg-green-600 text-white"
                      : status === "maybe"
                      ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white"
                  const inactive = "bg-muted text-gray-600 hover:bg-muted"
                  const isActive = event.myRsvp === status
                  return (
                    <button
                      key={status}
                      onClick={() => handleRsvp(event.id, status)}
                      disabled={rsvping === event.id}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition disabled:opacity-50 ${
                        isActive ? active : inactive
                      }`}
                    >
                      {labels[status]}
                    </button>
                  )
                })}
              </div>

              {event.myRsvp && (
                <p className="text-xs text-gray-400">
                  Your RSVP:{" "}
                  <span className="font-medium text-gray-600">
                    {event.myRsvp === "going"
                      ? "Going"
                      : event.myRsvp === "maybe"
                      ? "Maybe"
                      : "Can't Go"}
                  </span>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
