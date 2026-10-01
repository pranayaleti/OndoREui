"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Calculator, FileText, Building, ArrowRight } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { search, SearchResult } from "@/lib/search-index"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called when focus is about to return after close. Call preventDefault() to move focus yourself. */
  onCloseAutoFocus?: (event: Event) => void
}

const categoryIcons = {
  Page: Building,
  Calculator: Calculator,
  Blog: FileText,
  Service: Building,
}

const categoryLabels = {
  Page: 'Pages',
  Calculator: 'Calculators',
  Blog: 'Blog',
  Service: 'Services',
}

export function SearchDialog({ open, onOpenChange, onCloseAutoFocus }: SearchDialogProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])

  React.useEffect(() => {
    if (open) {
      setQuery("")
      setResults([])
    }
  }, [open])

  React.useEffect(() => {
    if (query.trim().length > 0) {
      const searchResults = search(query)
      setResults(searchResults)
    } else {
      setResults([])
    }
  }, [query])

  const handleSelect = React.useCallback((href: string) => {
    onOpenChange(false)
    router.push(href)
  }, [router, onOpenChange])

  // Group results by category
  const groupedResults = React.useMemo(() => {
    const groups: Record<string, SearchResult[]> = {}
    results.forEach(result => {
      if (!groups[result.category]) {
        groups[result.category] = []
      }
      groups[result.category].push(result)
    })
    return groups
  }, [results])

  // search() already filters and ranks (titles, descriptions, keywords), so cmdk must not filter a second time.
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} onCloseAutoFocus={onCloseAutoFocus} shouldFilter={false}>
      <CommandInput
        placeholder="Search pages, calculators, blog posts..."
        aria-label="Search the site"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {query.trim().length === 0 ? (
            <div className="py-6 text-center text-sm">
              <p className="text-foreground/70 mb-2">Start typing to search...</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="text-xs text-foreground/70">Try:</span>
                <button
                  onClick={() => setQuery("mortgage")}
                  className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                >
                  mortgage
                </button>
                <button
                  onClick={() => setQuery("calculator")}
                  className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                >
                  calculator
                </button>
                <button
                  onClick={() => setQuery("property")}
                  className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                >
                  property
                </button>
                <button
                  onClick={() => setQuery("notary")}
                  className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                >
                  notary
                </button>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-sm">
              <p className="text-foreground/70">No results found for "{query}"</p>
            </div>
          )}
        </CommandEmpty>
        {Object.entries(groupedResults).map(([category, items]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons]
          return (
            <CommandGroup key={category} heading={categoryLabels[category as keyof typeof categoryLabels]}>
              {items.map((result) => (
                <CommandItem
                  key={result.id}
                  value={`${result.title} ${result.description}`}
                  onSelect={() => handleSelect(result.href)}
                  className="flex items-center gap-3 cursor-pointer group/item"
                >
                  <Icon className="h-4 w-4 text-foreground/70 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{result.title}</div>
                    <div className="text-xs text-foreground/70 truncate">
                      {result.description}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-foreground/70 flex-shrink-0 opacity-0 group-data-[selected=true]/item:opacity-100 transition-opacity" />
                </CommandItem>
              ))}
            </CommandGroup>
          )
        })}
      </CommandList>
    </CommandDialog>
  )
}
