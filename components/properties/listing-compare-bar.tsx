"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { LISTING_COMPARE_EVENT, listingComparePath, readCompareIds } from "@/lib/listing-compare"

export function ListingCompareBar() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const sync = () => setCount(readCompareIds().length)
    sync()
    window.addEventListener(LISTING_COMPARE_EVENT, sync)
    return () => window.removeEventListener(LISTING_COMPARE_EVENT, sync)
  }, [])

  if (count === 0) return null

  const ready = count >= 2
  return (
    <div
      className="flex flex-col gap-2 rounded-lg border border-border bg-card px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
      role="status"
      aria-live="polite"
    >
      <p className="text-sm">
        {ready
          ? `${count} listings ready to compare`
          : "Add one more listing to compare side by side"}
      </p>
      <Link
        href={listingComparePath()}
        className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        {ready ? "View comparison" : "Open compare list"}
      </Link>
    </div>
  )
}
