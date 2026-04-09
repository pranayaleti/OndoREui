"use client"

import dynamic from "next/dynamic"

/** Client-only: zip selector uses browser APIs; keep hero shell as a server component. */
export const HeroZipServiceSelectorLazy = dynamic(
  () => import("@/components/landing/zip-service-selector").then((m) => m.ZipServiceSelector),
  {
    ssr: false,
    loading: () => (
      <div className="flex w-full max-w-sm items-center gap-2" aria-hidden="true">
        <div className="h-11 flex-1 rounded-md bg-white/20" />
        <div className="h-11 w-28 rounded-md bg-white/20" />
      </div>
    ),
  },
)
