import type { Metadata } from "next"
import { SCHEDULE_EXPORT_SHELL } from "@/lib/visit-static-paths"
import { VisitScheduleClient } from "./visit-schedule-client"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

/**
 * Required under `output: "export"`. Tokens are not enumerable at build time.
 * Omit `dynamicParams = false` so next dev still renders this page; static
 * hosts recover via `app/not-found.tsx`.
 */
export function generateStaticParams(): { token: string }[] {
  return [{ token: SCHEDULE_EXPORT_SHELL }]
}

export default function VisitSchedulePage() {
  return <VisitScheduleClient />
}
