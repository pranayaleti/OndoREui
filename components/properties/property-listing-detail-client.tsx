"use client"

import { useEffect, useRef, useState } from "react"
import type { ApiProperty } from "@/app/types/property"
import {
  PropertyListingDetail,
  PropertyUnavailable,
} from "@/components/properties/property-listing-detail"
import { fetchPublicPropertyByPublicId, fetchPublicPropertyList } from "@/lib/public-property"
import { pickRelatedListings } from "@/lib/listing-presentation"

/** Bypass the HTTP cache so the refresh reflects the latest dashboard edits. */
const noStoreFetch: typeof fetch = (input, init) => fetch(input, { ...init, cache: "no-store" })

/**
 * Statically exported detail pages are baked at deploy time, so listing edits
 * (price, photos, description) go stale until the next build. This renders the
 * build-time data immediately — the prerendered HTML keeps its SEO value — and
 * swaps in the live API copy once the browser has it.
 *
 * A failed or empty refresh leaves the static content untouched;
 * ListingAvailabilityProvider (inside PropertyListingDetail) separately owns
 * the definite "listing is gone" state.
 */
export function PropertyListingDetailLive({
  publicId,
  initialProperty,
  initialRelated = [],
}: {
  publicId: string
  initialProperty: ApiProperty
  initialRelated?: ApiProperty[]
}) {
  const [live, setLive] = useState<{ property: ApiProperty; related: ApiProperty[] } | null>(null)
  const initialRelatedRef = useRef(initialRelated)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const property = await fetchPublicPropertyByPublicId(publicId, noStoreFetch)
      // null can mean a delisting or a network failure — keep the static copy.
      if (cancelled || !property) return
      const list = await fetchPublicPropertyList(noStoreFetch)
      if (cancelled) return
      setLive({
        property,
        related: list.length > 0 ? pickRelatedListings(property, list) : initialRelatedRef.current,
      })
    })()
    return () => {
      cancelled = true
    }
  }, [publicId])

  return (
    <PropertyListingDetail
      property={live?.property ?? initialProperty}
      publicId={publicId}
      related={live?.related ?? initialRelated}
    />
  )
}

type LoadState =
  | { status: "loading" }
  | { status: "ready"; property: ApiProperty; related: ApiProperty[] }
  | { status: "missing" }

export function PropertyListingDetailClient({ publicId }: { publicId: string }) {
  const [state, setState] = useState<LoadState>({ status: "loading" })

  useEffect(() => {
    let cancelled = false
    setState({ status: "loading" })
    void (async () => {
      const property = await fetchPublicPropertyByPublicId(publicId)
      if (cancelled) return
      if (!property) {
        setState({ status: "missing" })
        return
      }
      const list = await fetchPublicPropertyList()
      if (cancelled) return
      setState({
        status: "ready",
        property,
        related: pickRelatedListings(property, list),
      })
    })()
    return () => {
      cancelled = true
    }
  }, [publicId])

  switch (state.status) {
    case "loading":
      return (
        <main className="container mx-auto max-w-6xl px-4 py-8" aria-busy="true">
          <p className="sr-only">Loading listing</p>
          <div className="mb-6 h-8 w-2/3 animate-pulse rounded bg-muted" />
          <div className="mb-8 aspect-[4/3] max-h-96 animate-pulse rounded-lg bg-muted" />
          <div className="mb-8 h-32 animate-pulse rounded bg-muted" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </main>
      )
    case "ready":
      return (
        <PropertyListingDetail
          property={state.property}
          publicId={publicId}
          related={state.related}
        />
      )
    case "missing":
      return <PropertyUnavailable />
    default: {
      const _exhaustive: never = state
      return _exhaustive
    }
  }
}
