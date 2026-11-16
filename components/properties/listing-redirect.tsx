"use client"

import { useEffect } from "react"

/** Sends a legacy /properties/{address}/ visit to the listing's root URL. */
export function ListingRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to + window.location.hash)
  }, [to])
  return (
    <main className="container mx-auto max-w-2xl px-4 py-16 text-center">
      <p>
        This listing has moved. <a className="underline" href={to}>Open the listing</a>.
      </p>
    </main>
  )
}
