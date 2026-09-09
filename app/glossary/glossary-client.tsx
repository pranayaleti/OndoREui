"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, X } from "lucide-react"
import {
  GLOSSARY_CATEGORIES,
  GLOSSARY_CATEGORY_BLURBS,
  GLOSSARY_CATEGORY_LABELS,
  type GlossaryCategory,
  type GlossaryTerm,
  glossaryHref,
  glossaryInitial,
  searchGlossary,
  sortedGlossaryTerms,
} from "@/lib/content/glossary"

type Filter = GlossaryCategory | "all"

const FILTERS: readonly Filter[] = ["all", ...GLOSSARY_CATEGORIES]

function filterLabel(filter: Filter): string {
  return filter === "all" ? "All terms" : GLOSSARY_CATEGORY_LABELS[filter]
}

/** Group entries under their first letter, preserving alphabetical order. */
function groupByInitial(entries: GlossaryTerm[]): Array<[string, GlossaryTerm[]]> {
  const groups = new Map<string, GlossaryTerm[]>()
  for (const entry of entries) {
    const initial = glossaryInitial(entry)
    const bucket = groups.get(initial)
    if (bucket) bucket.push(entry)
    else groups.set(initial, [entry])
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
}

export function GlossaryClient() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Filter>("all")

  const allTerms = useMemo(() => sortedGlossaryTerms(), [])

  const visible = useMemo(() => {
    const matched = query.trim() ? searchGlossary(query) : allTerms
    return filter === "all" ? matched : matched.filter((entry) => entry.category === filter)
  }, [allTerms, query, filter])

  const groups = useMemo(() => groupByInitial(visible), [visible])
  const isFiltered = query.trim().length > 0 || filter !== "all"

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 md:py-16">
      {/* ---- Search ---- */}
      <div className="mx-auto max-w-2xl">
        <label htmlFor="glossary-search" className="sr-only">
          Search real estate terms
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40"
            aria-hidden="true"
          />
          <input
            id="glossary-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a term — try “escrow”, “DTI”, or “cap rate”"
            autoComplete="off"
            className="w-full rounded-full border border-border bg-card/60 py-3.5 pl-12 pr-12 text-base text-foreground placeholder:text-foreground/40 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-foreground/50 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Clear search</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* ---- Category filter ---- */}
      <div className="mt-8">
        <h2 className="sr-only">Filter by category</h2>
        <div className="flex flex-wrap justify-center gap-2.5">
          {FILTERS.map((option) => {
            const active = filter === option
            return (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card/60 text-foreground/80 hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {filterLabel(option)}
              </button>
            )
          })}
        </div>
        {filter !== "all" ? (
          <p className="mt-4 text-center text-sm text-foreground/60">
            {GLOSSARY_CATEGORY_BLURBS[filter]}
          </p>
        ) : null}
      </div>

      {/* ---- Result count + A–Z jump ---- */}
      <div className="mt-10 flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-baseline sm:justify-between">
        <p aria-live="polite" className="text-sm text-foreground/70">
          {visible.length === allTerms.length
            ? `${allTerms.length} terms`
            : `${visible.length} of ${allTerms.length} terms`}
          {isFiltered ? (
            <>
              {" · "}
              <button
                type="button"
                onClick={() => {
                  setQuery("")
                  setFilter("all")
                }}
                className="font-medium text-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Reset
              </button>
            </>
          ) : null}
        </p>

        {groups.length > 1 ? (
          <nav aria-label="Jump to letter" className="flex flex-wrap gap-1.5">
            {groups.map(([letter]) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="rounded px-2 py-1 font-mono text-xs font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {letter}
              </a>
            ))}
          </nav>
        ) : null}
      </div>

      {/* ---- Results ---- */}
      {visible.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-medium text-foreground">No term matches “{query}”.</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-foreground/70">
            Try a shorter word or an abbreviation — most entries are also indexed under their
            initials, so “LTV” and “loan to value” both find the same page.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setFilter("all")
            }}
            className="mt-6 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Show every term
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-12">
          {groups.map(([letter, entries]) => (
            <section key={letter} aria-labelledby={`letter-${letter}-heading`}>
              <h2
                id={`letter-${letter}-heading`}
                className="scroll-mt-24 border-b border-border/60 pb-2 font-mono text-sm font-semibold uppercase tracking-widest text-primary"
              >
                <span id={`letter-${letter}`} className="scroll-mt-24">
                  {letter}
                </span>
              </h2>
              <ul className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
                {entries.map((entry) => (
                  <li key={entry.slug}>
                    <Link
                      href={glossaryHref(entry.slug)}
                      className="group flex h-full flex-col rounded-xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/50 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="text-base font-semibold text-foreground group-hover:text-primary">
                          {entry.term}
                        </span>
                        <span className="mt-0.5 shrink-0 rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-foreground/60">
                          {GLOSSARY_CATEGORY_LABELS[entry.category]}
                        </span>
                      </span>
                      <span className="mt-2 text-sm leading-relaxed text-foreground/70">
                        {entry.short}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
