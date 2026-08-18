"use client"

import { useEffect } from "react"
import { fetchOpportunitiesClient, fetchOpportunityBySlugClient } from "@/lib/investments-api"

const TOOL_LIST = "list_investment_opportunities"
const TOOL_GET = "get_investment_opportunity"

type ModelContext = { registerTool: (t: unknown) => void; unregisterTool: (name: string) => void }

/**
 * Registers read-only WebMCP tools for investment opportunities: list (with optional status filter) and get by slug.
 * Renders nothing. Unregisters on unmount.
 * See: https://developer.chrome.com/blog/webmcp-epp
 */
export function WebMCPOpportunitiesTool() {
  useEffect(() => {
    const nav = typeof navigator !== "undefined" ? navigator : null
    const modelContext =
      nav && "modelContext" in nav ? (nav as Navigator & { modelContext: ModelContext }).modelContext : null
    if (!modelContext) return

    const unregister = (name: string) => {
      try {
        modelContext.unregisterTool(name)
      } catch {
        // ignore
      }
    }

    try {
      modelContext.registerTool({
        name: TOOL_LIST,
        title: "List investments",
        description:
          "List current commercial real estate and fractional investment opportunities from Ondo Real Estate in Utah. Returns open, coming-soon, and recently funded deals with slug, title, location, asset class, min investment, target return, hold period, status, and description. Use when the user asks about available investments or deals.",
        inputSchema: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Filter by status: open, coming-soon, fully-funded, or omit for all",
              enum: ["open", "coming-soon", "fully-funded"],
            },
          },
          required: [],
        },
        annotations: { readOnlyHint: true, untrustedContentHint: true },
        async execute(input: { status?: string }) {
          const opportunities = await fetchOpportunitiesClient()
          const status = input?.status as "open" | "coming-soon" | "fully-funded" | undefined
          const filtered =
            status && ["open", "coming-soon", "fully-funded"].includes(status)
              ? opportunities.filter((o) => o.status === status)
              : opportunities
          const summary = filtered.map((o) => ({
            slug: o.slug,
            title: o.title,
            location: o.location,
            assetClass: o.assetClass,
            minInvestment: o.minInvestment,
            targetReturn: o.targetReturn,
            holdPeriod: o.holdPeriod,
            status: o.status,
            description: o.description?.slice(0, 200),
          }))
          return {
            content: [{ type: "text", text: JSON.stringify({ opportunities: summary, count: summary.length }) }],
          }
        },
      })
    } catch {
      // Duplicate or unsupported; ignore
    }

    try {
      modelContext.registerTool({
        name: TOOL_GET,
        title: "Investment details",
        description:
          "Get full details of a single investment opportunity by its slug. Use after list_investment_opportunities when the user wants details on a specific deal (e.g. Lehi Tech Corridor, Provo Student Housing). Returns title, location, asset class, min investment, target return, hold period, description, highlights, risk factors, and status.",
        inputSchema: {
          type: "object",
          properties: {
            slug: {
              type: "string",
              description: "URL slug of the opportunity (e.g. lehi-tech-corridor-office, provo-student-housing-complex)",
            },
          },
          required: ["slug"],
        },
        annotations: { readOnlyHint: true, untrustedContentHint: true },
        async execute(input: { slug?: string }) {
          const slug = input?.slug?.trim()
          if (!slug) {
            return {
              content: [{ type: "text", text: JSON.stringify({ error: "slug is required" }) }],
            }
          }
          const opportunity = await fetchOpportunityBySlugClient(slug)
          if (!opportunity) {
            return {
              content: [{ type: "text", text: JSON.stringify({ error: "Opportunity not found", slug }) }],
            }
          }
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  slug: opportunity.slug,
                  title: opportunity.title,
                  location: opportunity.location,
                  assetClass: opportunity.assetClass,
                  minInvestment: opportunity.minInvestment,
                  targetReturn: opportunity.targetReturn,
                  holdPeriod: opportunity.holdPeriod,
                  distributionFrequency: opportunity.distributionFrequency,
                  status: opportunity.status,
                  description: opportunity.description,
                  highlights: opportunity.highlights,
                  riskFactors: opportunity.riskFactors,
                }),
              },
            ],
          }
        },
      })
    } catch {
      // ignore
    }

    return () => {
      unregister(TOOL_LIST)
      unregister(TOOL_GET)
    }
  }, [])

  return null
}
