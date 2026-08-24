"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { backendUrl } from "@/lib/backend"
import { SITE_URL } from "@/lib/site"

interface EventItem {
  id: string
  slug: string
  title: string
  description: string | null
  startsAt: string
  endsAt: string | null
  location: string | null
  rsvpUrl: string | null
  coverImage: string | null
}

function formatWhen(startsAt: string, endsAt: string | null): string {
  const start = new Date(startsAt)
  if (Number.isNaN(start.getTime())) return ""
  const dateStr = start.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
  const startTime = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  if (endsAt) {
    const end = new Date(endsAt)
    if (!Number.isNaN(end.getTime())) {
      const endTime = end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      return `${dateStr} · ${startTime}–${endTime}`
    }
  }
  return `${dateStr} · ${startTime}`
}

function eventJsonLd(events: EventItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: e.title,
        startDate: e.startsAt,
        ...(e.endsAt ? { endDate: e.endsAt } : {}),
        ...(e.description ? { description: e.description } : {}),
        ...(e.location ? { location: { "@type": "Place", name: e.location } } : {}),
        ...(e.rsvpUrl ? { url: e.rsvpUrl } : {}),
        eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
        organizer: { "@type": "Organization", name: "Ondo Real Estate", url: SITE_URL },
      },
    })),
  }
}

function EventCard({ event }: { event: EventItem }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl dark:text-foreground">{event.title}</CardTitle>
        <div className="flex flex-col gap-1 text-sm text-foreground/70 mt-2">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
            {formatWhen(event.startsAt, event.endsAt)}
          </span>
          {event.location ? (
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              {event.location}
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {event.description ? (
          <p className="text-foreground/70 mb-4">{event.description}</p>
        ) : null}
        {event.rsvpUrl ? (
          <Button asChild>
            <a href={event.rsvpUrl} target="_blank" rel="noopener noreferrer">
              RSVP <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}

export default function EventsClient() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(backendUrl("/api/events"), {
          headers: { Accept: "application/json" },
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const body = (await res.json()) as { data?: EventItem[] }
        if (!cancelled) setEvents(Array.isArray(body.data) ? body.data : [])
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const now = Date.now()
  const upcoming = events.filter((e) => new Date(e.startsAt).getTime() >= now)
  const past = events
    .filter((e) => new Date(e.startsAt).getTime() < now)
    .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime())

  return (
    <main id="main-content" className="min-h-screen">
      <SEO
        title="ONDO Events"
        description="Upcoming ONDO events, homebuyer workshops, investor mixers, and community gatherings. RSVP and join us."
        pathname="/events"
        image={`${SITE_URL}/modern-office-building.png`}
      />
      {upcoming.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd(upcoming)) }}
        />
      ) : null}

      <PageBanner
        title="ONDO Events"
        subtitle="Workshops, mixers, and community events: come say hi."
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <p className="text-center text-foreground/70">Loading events…</p>
            ) : error ? (
              <div className="text-center">
                <p className="text-foreground/70 mb-4">
                  We couldn&apos;t load events right now. Please try again later.
                </p>
                <Button asChild variant="outline">
                  <Link href="/contact">Contact us</Link>
                </Button>
              </div>
            ) : events.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-foreground/70 mb-4">
                    No events are scheduled right now. Check back soon!
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/contact">Get notified</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-12">
                <div>
                  <h2 className="text-2xl font-bold mb-6 dark:text-foreground">Upcoming</h2>
                  {upcoming.length > 0 ? (
                    <div className="grid gap-6">
                      {upcoming.map((e) => (
                        <EventCard key={e.id} event={e} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-foreground/70">
                      No upcoming events scheduled, check back soon.
                    </p>
                  )}
                </div>

                {past.length > 0 ? (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 dark:text-foreground">Past events</h2>
                    <div className="grid gap-6 opacity-70">
                      {past.map((e) => (
                        <EventCard key={e.id} event={e} />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
