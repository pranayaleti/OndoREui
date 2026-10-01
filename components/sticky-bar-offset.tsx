"use client"

import type { ReactNode } from "react"
import { useStickyBarVisible } from "@/lib/sticky-cta"

/**
 * Page shell for the root layout. Reserves room under the footer for the mobile sticky CTA bar
 * only on routes where that bar renders (lib/sticky-cta.ts), so /links, form pages and the
 * portal routes do not get an empty band below the footer.
 */
export function StickyBarOffset({ children }: { children: ReactNode }) {
  const barVisible = useStickyBarVisible()
  return (
    <div
      className={`min-h-screen flex flex-col${
        barVisible ? " pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-0" : ""
      }`}
    >
      {children}
    </div>
  )
}
