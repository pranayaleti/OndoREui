"use client"

import { useEffect, useState } from "react"
import type { ApiProperty } from "@/app/types/property"
import {
  PropertyListingDetail,
  PropertyUnavailable,
} from "@/components/properties/property-listing-detail"
import { fetchPublicPropertyByPublicId, fetchPublicPropertyList } from "@/lib/public-property"
import { pickRelatedListings } from "@/lib/listing-presentation"

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
