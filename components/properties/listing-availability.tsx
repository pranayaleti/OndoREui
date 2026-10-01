"use client"

import { createContext, useContext, useEffect, useState } from "react"
import Link from "next/link"
import { checkListingAvailability } from "@/lib/public-property"

const ListingUnavailableContext = createContext(false)

/** True once the browser has confirmed the listing is no longer on the public API. */
export function useListingUnavailable(): boolean {
  return useContext(ListingUnavailableContext)
}

/**
 * The detail page is built once per deploy. On mount this re-checks the live
 * API; only a definite "gone" answer changes the page (apply links hide and a
 * notice shows). A network error or any other response leaves it untouched.
 */
export function ListingAvailabilityProvider({
  publicId,
  children,
}: {
  publicId: string
  children: React.ReactNode
}) {
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    let cancelled = false
    void checkListingAvailability(publicId).then((result) => {
      if (!cancelled) setUnavailable(result === "unavailable")
    })
    return () => {
      cancelled = true
    }
  }, [publicId])

  return (
    <ListingUnavailableContext.Provider value={unavailable}>
      {children}
    </ListingUnavailableContext.Provider>
  )
}

export function ListingUnavailableNotice() {
  const unavailable = useListingUnavailable()
  if (!unavailable) return null
  return (
    <div
      role="status"
      className="mb-4 rounded-xl border border-border bg-muted p-4 text-sm"
    >
      <p className="font-semibold">This home is no longer available.</p>
      <p className="mt-1 text-muted-foreground">
        It may have been rented or taken off the market.{" "}
        <Link href="/properties" className="font-medium underline underline-offset-2">
          See current listings
        </Link>
        .
      </p>
    </div>
  )
}
