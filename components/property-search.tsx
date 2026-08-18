"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { webmcpFormAttrs, webmcpParamAttrs } from "@/lib/webmcp-attrs"

interface PropertySearchProps {
  onSearch?: (query: string) => void
}

export function PropertySearch({ onSearch }: PropertySearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const query = String(data.get("query") ?? searchQuery).trim()

    if (!query) return

    setIsLoading(true)

    if (onSearch) {
      // If onSearch prop is provided, use it for in-page filtering
      onSearch(query)
      setSearchQuery(query)
      setIsLoading(false)
    } else {
      // Otherwise, navigate to search results page
      router.push(`/properties?query=${encodeURIComponent(query)}`)
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full max-w-xl mx-auto"
      {...webmcpFormAttrs(
        "search_listings_by_text",
        "Search Ondo rental listings by city, address, or property name.",
        { autoSubmit: true },
      )}
    >
      <Input
        type="search"
        name="query"
        placeholder="Search properties..."
        className="w-full px-4 py-2 rounded-l-md border border-input dark:border-border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background bg-background dark:bg-card text-foreground dark:text-foreground placeholder:text-foreground/70 dark:placeholder:text-foreground/70"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        {...webmcpParamAttrs("Free-text search for listings by city, address, or name", "query")}
      />
      <Button type="submit" disabled={isLoading} className="ml-2">
        {isLoading ? (
          "Searching..."
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" /> Search
          </>
        )}
      </Button>
    </form>
  )
}
