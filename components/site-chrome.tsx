"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { isStandaloneRoute } from "@/lib/standalone-routes"

/** Wraps global chrome in the root layout so standalone routes (lib/standalone-routes.ts) render bare. */
export function SiteChrome({ children }: { children: ReactNode }) {
  if (isStandaloneRoute(usePathname())) return null
  return <>{children}</>
}
