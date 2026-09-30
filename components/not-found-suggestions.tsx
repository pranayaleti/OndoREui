"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { analyticsAttributes } from "@/lib/analytics"
import { rankPageSuggestions, type PageIndexEntry } from "@/lib/page-suggestions"

/**
 * "Did you mean" links for a URL that does not exist. The page index is fetched only here,
 * after someone lands on a missing page, so no other page downloads it.
 */
export function NotFoundSuggestions({ pathname }: { pathname: string }) {
  const [suggestions, setSuggestions] = useState<PageIndexEntry[]>([])

  useEffect(() => {
    let cancelled = false
    fetch("/page-index.json")
      .then((response) => (response.ok ? (response.json() as Promise<PageIndexEntry[]>) : []))
      .then((index) => {
        if (!cancelled && Array.isArray(index)) setSuggestions(rankPageSuggestions(pathname, index))
      })
      // Without the index the popular pages below still help, so a failure shows nothing extra.
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [pathname])

  if (!suggestions.length) return null

  return (
    <section aria-labelledby="not-found-suggestions" className="mb-8 rounded-lg border border-primary/40 bg-primary/5 p-6">
      <h2 id="not-found-suggestions" className="mb-4 text-center text-xl font-semibold text-foreground">
        Were you looking for one of these?
      </h2>
      <ul className="mx-auto grid max-w-2xl gap-2">
        {suggestions.map((page) => (
          <li key={page.p}>
            <Link
              href={page.p}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-4 py-3 transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...analyticsAttributes("not_found_suggestion_click", "404", page.p)}
            >
              <span className="min-w-0">
                <span className="block font-medium text-foreground">{page.t}</span>
                <span className="block truncate text-sm text-foreground/70">{page.p}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
