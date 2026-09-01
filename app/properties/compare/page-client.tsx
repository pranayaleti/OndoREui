"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ListingCompareTable, listingsFromApi } from "@/components/properties/listing-compare-table"
import type { ApiProperty } from "@/app/types/property"
import { fetchPublicPropertyList } from "@/lib/public-property"
import {
  LISTING_COMPARE_EVENT,
  readCompareIds,
  removeCompareId,
} from "@/lib/listing-compare"

export function ListingCompareClient() {
  const [ids, setIds] = useState<string[]>([])
  const [listings, setListings] = useState<ApiProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const syncIds = useCallback(() => {
    setIds(readCompareIds())
  }, [])

  useEffect(() => {
    syncIds()
    window.addEventListener(LISTING_COMPARE_EVENT, syncIds)
    return () => window.removeEventListener(LISTING_COMPARE_EVENT, syncIds)
  }, [syncIds])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    void fetchPublicPropertyList()
      .then((rows) => {
        if (!cancelled) setListings(rows)
      })
      .catch(() => {
        if (!cancelled) setError("Live listings are temporarily unavailable.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const selected = useMemo(() => {
    const byId = new Map(listings.map((row) => [row.publicId, row]))
    return ids
      .map((id) => byId.get(id))
      .filter((row): row is ApiProperty => Boolean(row))
  }, [ids, listings])

  const missingCount = ids.length - selected.length

  if (loading) {
    return (
      <p className="text-muted-foreground" role="status">
        Loading listings to compare…
      </p>
    )
  }

  if (error) {
    return (
      <div role="alert" className="rounded-xl border border-border bg-card p-5">
        <p className="font-semibold">{error}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          We are not filling this table with example homes.
        </p>
        <Link href="/properties" className="mt-4 inline-flex min-h-11 items-center text-sm font-medium underline">
          Back to listings
        </Link>
      </div>
    )
  }

  if (ids.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="font-semibold">No listings in your compare list yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          On the listings page, tap Compare on two or three homes. The list stays in this
          browser tab.
        </p>
        <Link
          href="/properties"
          className="mt-4 inline-flex min-h-11 items-center rounded-md bg-primary px-4 font-medium text-primary-foreground"
        >
          Browse listings
        </Link>
      </div>
    )
  }

  if (selected.length < 2) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="font-semibold">Add one more listing to compare</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {selected.length === 1
            ? `${selected[0]?.title} is on your list.`
            : "Those listings are no longer on the public market."}{" "}
          Choose another home from browse.
        </p>
          {missingCount > 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            {missingCount === 1
              ? "One saved listing is no longer public."
              : `${missingCount} saved listings are no longer public.`}
          </p>
        ) : null}
        <Link
          href="/properties"
          className="mt-4 inline-flex min-h-11 items-center rounded-md bg-primary px-4 font-medium text-primary-foreground"
        >
          Browse listings
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {missingCount > 0 ? (
        <p className="text-sm text-muted-foreground">
          {missingCount} listing {missingCount === 1 ? "is" : "are"} no longer public and{" "}
          {missingCount === 1 ? "was" : "were"} left out.
        </p>
      ) : null}
      <ListingCompareTable
        listings={listingsFromApi(selected)}
        onRemove={(publicId) => {
          removeCompareId(publicId)
        }}
      />
    </div>
  )
}
