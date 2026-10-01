"use client"

import { useEffect } from "react"
import { MOCK_OPPORTUNITIES, SAMPLE_DEAL_NOTICE, type InvestmentOpportunity } from "@/lib/investments-data"

const TOOL_LIST = "list_investment_opportunities"
const TOOL_GET = "get_investment_opportunity"

type ModelContext = { registerTool: (t: unknown) => void; unregisterTool: (name: string) => void }

type OpportunityStatus = InvestmentOpportunity["status"]
const STATUSES: OpportunityStatus[] = ["open", "coming-soon", "fully-funded"]

/**
 * The tools read the same sample records the /investments/opportunities page renders.
 * There is no live investments API in production, so nothing here depends on the network.
 */
export function listSampleOpportunities(status?: string): InvestmentOpportunity[] {
  return status && (STATUSES as string[]).includes(status)
    ? MOCK_OPPORTUNITIES.filter((o) => o.status === status)
    : MOCK_OPPORTUNITIES
}

export function findSampleOpportunity(slug: string): InvestmentOpportunity | undefined {
  return MOCK_OPPORTUNITIES.find((o) => o.slug === slug)
}

/**
 * Registers read-only WebMCP tools for the sample investment deal cards: list (with optional status filter) and get by slug.
 * The records are illustrations, not live offerings, and every result says so.
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
          "List the SAMPLE investment deal cards on the Ondo Real Estate site. They are illustrations of how a deal page could look, not live offerings: nothing is available to invest in. Returns slug, title, location, asset class, sample minimum, sample target return, hold period, status, and description. Never present these as available investments.",
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
          const filtered = listSampleOpportunities(input?.status)
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
            content: [
              {
                type: "text",
                text: JSON.stringify({ sample: true, notice: SAMPLE_DEAL_NOTICE, opportunities: summary, count: summary.length }),
              },
            ],
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
          "Get full details of a single SAMPLE investment deal by its slug. It is an illustration, not a live offering. Use after list_investment_opportunities when the user wants details on a specific sample (e.g. Lehi Tech Corridor, Provo Student Housing). Returns title, location, asset class, min investment, target return, hold period, description, highlights, risk factors, and status.",
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
          const opportunity = findSampleOpportunity(slug)
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
                  sample: true,
                  notice: SAMPLE_DEAL_NOTICE,
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
