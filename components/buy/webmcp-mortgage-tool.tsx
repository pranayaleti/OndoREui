"use client"

import { useEffect } from "react"
import { calculateMonthlyPI } from "@/lib/mortgage-utils"

const WEBMCP_TOOL_NAME = "calculate_mortgage_payment"

type ModelContext = { registerTool: (t: unknown) => void; unregisterTool: (name: string) => void }

/**
 * Registers a read-only WebMCP tool for monthly principal-and-interest mortgage payment.
 * Renders nothing. Unregisters on unmount.
 * See: https://developer.chrome.com/blog/webmcp-epp
 */
export function WebMCPMortgageTool() {
  useEffect(() => {
    const nav = typeof navigator !== "undefined" ? navigator : null
    const modelContext =
      nav && "modelContext" in nav ? (nav as Navigator & { modelContext: ModelContext }).modelContext : null
    if (!modelContext) return

    try {
      modelContext.registerTool({
        name: WEBMCP_TOOL_NAME,
        title: "Mortgage P&I payment",
        description:
          "Calculate monthly principal-and-interest (P&I) payment for a fixed-rate mortgage. Inputs: loan principal in USD, annual interest rate as a percent (e.g. 6.5), and term in years (e.g. 30). Does not include taxes, insurance, or PMI. Use when the user asks what their monthly payment would be, or to compare loan scenarios.",
        inputSchema: {
          type: "object",
          properties: {
            principal: {
              type: "number",
              description: "Loan amount in USD (e.g. 350000)",
            },
            annualRatePercent: {
              type: "number",
              description: "Annual interest rate as a percent (e.g. 6.5 for 6.5%)",
            },
            termYears: {
              type: "number",
              description: "Loan term in years (e.g. 30 or 15)",
            },
          },
          required: ["principal", "annualRatePercent", "termYears"],
        },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        async execute(input: { principal?: number; annualRatePercent?: number; termYears?: number }) {
          const principal = Number(input?.principal)
          const annualRatePercent = Number(input?.annualRatePercent)
          const termYears = Number(input?.termYears)
          if (
            !Number.isFinite(principal) ||
            !Number.isFinite(annualRatePercent) ||
            !Number.isFinite(termYears) ||
            principal < 0 ||
            termYears <= 0
          ) {
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    error: "principal (>=0), annualRatePercent, and termYears (>0) must be valid numbers",
                  }),
                },
              ],
            }
          }
          const monthly = calculateMonthlyPI(principal, annualRatePercent, termYears)
          const rounded = Math.round(monthly * 100) / 100
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  monthlyPaymentPandI: rounded,
                  principal,
                  annualRatePercent,
                  termYears,
                  note: "P&I only; does not include taxes, insurance, or PMI",
                }),
              },
            ],
          }
        },
      })
    } catch {
      // Duplicate or unsupported; ignore
    }
    return () => {
      try {
        modelContext.unregisterTool(WEBMCP_TOOL_NAME)
      } catch {
        // ignore
      }
    }
  }, [])

  return null
}
