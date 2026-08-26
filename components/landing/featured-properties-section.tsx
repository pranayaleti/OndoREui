"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Building, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LazyImage } from "@/components/lazy-image"
import { useFinancialVisibility } from "@/lib/financial-visibility"
import { backendUrl } from "@/lib/backend"
import { mapApiProperty } from "@/lib/mapProperty"
import type { ApiProperty, Property } from "@/app/types/property"

/**
 * Number of listings we show on the homepage. Keeping this small avoids the
 * homepage becoming a de-facto listings page and matches the visual weight
 * of the surrounding sections.
 */
const FEATURED_LIMIT = 3

async function fetchFeaturedProperties(signal: AbortSignal): Promise<Property[]> {
  const res = await fetch(backendUrl("/api/properties/public"), {
    signal,
    headers: { Accept: "application/json" },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = (await res.json()) as unknown
  const rawArray: unknown = Array.isArray(json)
    ? json
    : (json as { data?: unknown } | null)?.data
  if (!Array.isArray(rawArray)) throw new Error("Unexpected response shape")
  return rawArray
    .slice(0, FEATURED_LIMIT)
    .map((p) => mapApiProperty(p as ApiProperty))
}

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; properties: Property[] }
  | { kind: "empty" }

export function FeaturedPropertiesSection() {
  const [state, setState] = useState<LoadState>({ kind: "loading" })
  const { showValues, toggle } = useFinancialVisibility()

  useEffect(() => {
    const controller = new AbortController()
    ;(async () => {
      try {
        const properties = await fetchFeaturedProperties(controller.signal)
        if (properties.length === 0) {
          setState({ kind: "empty" })
        } else {
          setState({ kind: "ready", properties })
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return
        // Network / server failure — treat as empty so we never render
        // fabricated inventory. The empty state still links to /properties.
        setState({ kind: "empty" })
      }
    })()
    return () => controller.abort()
  }, [])

  return (
    <section className="py-16 bg-muted dark:bg-[var(--gradient-overlay)]" aria-labelledby="properties-heading">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-center justify-between gap-4">
          <h2 id="properties-heading" className="text-3xl font-bold dark:text-foreground">
            Featured Utah rental properties
          </h2>
          {state.kind === "ready" && (
            <button
              type="button"
              onClick={toggle}
              className="inline-flex min-h-11 items-center rounded-full border border-border px-3 py-1 text-xs text-foreground/70 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={showValues ? "Hide rental prices" : "Show rental prices"}
            >
              {showValues ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
              <span className="hidden sm:inline">
                {showValues ? "Hide amounts" : "Show amounts"}
              </span>
            </button>
          )}
        </div>

        {state.kind === "loading" && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            aria-busy="true"
            aria-live="polite"
          >
            {Array.from({ length: FEATURED_LIMIT }).map((_, i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-lg border border-border bg-card"
              />
            ))}
          </div>
        )}

        {state.kind === "ready" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {state.properties.map((property) => (
              <Card
                key={property.id}
                className="dark:bg-card"
                aria-label={`${property.title}, $${property.price}/month rental property`}
              >
                <div className="relative h-48 w-full">
                  <LazyImage
                    src={property.image || "/placeholder.svg"}
                    alt={`Photo of ${property.title} rental property${property.address ? ` at ${property.address}` : ""}`}
                    fill
                    className="object-cover"
                    quality={80}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="dark:text-foreground">{property.title}</CardTitle>
                  <CardDescription className="dark:text-foreground/70">
                    {property.address || "Utah"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm dark:text-foreground/70">
                      {property.bedrooms} bed &bull; {property.bathrooms} bath
                    </span>
                    <span className="font-semibold dark:text-foreground">
                      {showValues ? `$${property.price}/mo` : "••••"}
                    </span>
                  </div>
                  {property.description && (
                    <p className="text-sm text-foreground/70 dark:text-foreground/70 line-clamp-2">
                      {property.description}
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full dark:text-foreground dark:border-border dark:hover:bg-muted"
                  >
                    <Link href={`/properties/${property.id}`}>View details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {state.kind === "empty" && (
          <div
            className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-card p-10 text-center"
            role="status"
          >
            <span
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
              aria-hidden="true"
            >
              <Building className="h-5 w-5" />
            </span>
            <p className="text-lg font-semibold text-foreground">
              New listings post regularly across the Wasatch Front.
            </p>
            <p className="text-sm text-foreground/70">
              We only feature real Ondo-managed rentals here. See what&rsquo;s
              on the market right now, or ask us to send you the next matching
              vacancy in your target city.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild>
                <Link href="/properties">See current rentals</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Ask us to notify you</Link>
              </Button>
            </div>
          </div>
        )}

        <div className="text-center mt-10">
          <Button asChild className="bg-background hover:bg-muted dark:hover:bg-muted text-foreground">
            <Link href="/properties">View all properties</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// Exported for tests only.
export const __TEST__ = { FEATURED_LIMIT }
