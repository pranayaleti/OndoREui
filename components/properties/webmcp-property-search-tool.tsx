"use client"

import { useEffect } from "react"
import { backendUrl } from "@/lib/backend"
import { mapApiProperty } from "@/lib/mapProperty"
import type { ApiProperty, Property } from "@/app/types/property"

const TOOL_LIST = "search_available_properties"

type ModelContext = {
  registerTool: (t: unknown) => void
  unregisterTool: (name: string) => void
}

interface SearchInput {
  city?: string
  minBedrooms?: number
  maxPrice?: number
  query?: string
  limit?: number
}

/**
 * Registers a read-only WebMCP tool that lets agents surface Utah rental
 * properties available on Ondo. Calls the same public listings endpoint the
 * marketing site uses (`/api/properties/public`) and applies simple filters
 * client-side so the surface area stays small.
 *
 * Renders nothing. Unregisters on unmount.
 * See: https://developer.chrome.com/blog/webmcp-epp
 */
export function WebMCPPropertySearchTool() {
  useEffect(() => {
    const nav = typeof navigator !== "undefined" ? navigator : null
    const modelContext =
      nav && "modelContext" in nav
        ? (nav as Navigator & { modelContext: ModelContext }).modelContext
        : null
    if (!modelContext) return

    try {
      modelContext.registerTool({
        name: TOOL_LIST,
        description:
          "Search current rental properties available on Ondo Real Estate (Utah). Returns matching listings with id, title, city, address, price per month, bedrooms, bathrooms, sqft, and up to a 200-char description. Use when the user asks about rentals in a specific city, price range, or bedroom count.",
        inputSchema: {
          type: "object",
          properties: {
            city: {
              type: "string",
              description: "Filter to properties in this city (case-insensitive, partial match)",
            },
            minBedrooms: {
              type: "number",
              description: "Minimum bedroom count",
            },
            maxPrice: {
              type: "number",
              description: "Maximum monthly rent in USD",
            },
            query: {
              type: "string",
              description: "Free text; matches title, description, address",
            },
            limit: {
              type: "number",
              description: "Max results to return (default 20)",
            },
          },
          required: [],
        },
        annotations: { readOnlyHint: true },
        async execute(input: SearchInput) {
          const limit = Math.max(1, Math.min(input.limit ?? 20, 100))
          const res = await fetch(backendUrl("/api/properties/public"), {
            cache: "no-store",
            headers: { Accept: "application/json" },
          })
          if (!res.ok) {
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({ error: `Backend returned ${res.status}` }),
                },
              ],
            }
          }
          const json = (await res.json()) as unknown
          const rawArray = Array.isArray(json)
            ? (json as ApiProperty[])
            : (json as { data?: ApiProperty[] })?.data ?? []
          if (!Array.isArray(rawArray)) {
            return {
              content: [
                { type: "text", text: JSON.stringify({ error: "Invalid response shape" }) },
              ],
            }
          }

          const properties: Property[] = rawArray.map(mapApiProperty)
          const q = input.query?.toLowerCase().trim()
          const cityFilter = input.city?.toLowerCase().trim()
          const filtered = properties.filter((p) => {
            const city = p.addressParts?.city?.toLowerCase() ?? ""
            if (cityFilter && !city.includes(cityFilter)) return false
            if (typeof input.minBedrooms === "number" && p.bedrooms < input.minBedrooms) {
              return false
            }
            if (typeof input.maxPrice === "number" && p.price > input.maxPrice) {
              return false
            }
            if (q) {
              const haystack = [p.title, p.description, p.address].join(" ").toLowerCase()
              if (!haystack.includes(q)) return false
            }
            return true
          })

          const summary = filtered.slice(0, limit).map((p) => ({
            id: p.id,
            title: p.title,
            city: p.addressParts?.city ?? "",
            address: p.address,
            price: p.price,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            sqft: p.sqft,
            description: p.description?.slice(0, 200) ?? "",
          }))

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  properties: summary,
                  count: summary.length,
                  totalAvailable: filtered.length,
                }),
              },
            ],
          }
        },
      })
    } catch {
      // Duplicate or unsupported; ignore.
    }

    return () => {
      try {
        modelContext.unregisterTool(TOOL_LIST)
      } catch {
        // ignore
      }
    }
  }, [])

  return null
}
