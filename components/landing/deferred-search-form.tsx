"use client"

import dynamic from "next/dynamic"

const SearchForm = dynamic(
  () => import("@/components/search-form").then((mod) => mod.SearchForm),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex w-full max-w-sm items-center gap-2"
        aria-hidden="true"
      >
        <div className="h-10 flex-1 rounded-md bg-card/70" />
        <div className="h-10 w-24 rounded-md bg-card/70" />
      </div>
    ),
  }
)

export function DeferredSearchForm() {
  return <SearchForm />
}
