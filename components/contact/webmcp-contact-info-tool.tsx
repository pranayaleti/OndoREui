"use client"

import { useEffect } from "react"
import {
  SITE_NAME,
  SITE_URL,
  SITE_PHONE,
  SITE_HOURS,
  SITE_HOURS_LABEL,
  SITE_ADDRESS,
  SITE_EMAILS,
  SITE_CALENDLY_URL,
} from "@/lib/site"

const WEBMCP_TOOL_NAME = "get_company_contact_info"

type ModelContext = { registerTool: (t: unknown) => void; unregisterTool: (name: string) => void }

/**
 * Registers a read-only WebMCP tool that returns Ondo Real Estate contact and location info.
 * Renders nothing. Unregisters on unmount.
 * See: https://developer.chrome.com/blog/webmcp-epp
 */
export function WebMCPContactInfoTool() {
  useEffect(() => {
    const nav = typeof navigator !== "undefined" ? navigator : null
    const modelContext =
      nav && "modelContext" in nav ? (nav as Navigator & { modelContext: ModelContext }).modelContext : null
    if (!modelContext) return

    try {
      modelContext.registerTool({
        name: WEBMCP_TOOL_NAME,
        description:
          "Get Ondo Real Estate company contact information: phone, primary and topic-specific email addresses, physical address, business hours, website URL, and Calendly scheduling URL for booking a call. Use when the user asks how to reach Ondo, contact details, where they are located, or how to schedule a meeting.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
        annotations: { readOnlyHint: true },
        async execute() {
          const info = {
            name: SITE_NAME,
            url: SITE_URL,
            phone: SITE_PHONE,
            hours: SITE_HOURS,
            hoursLabel: SITE_HOURS_LABEL,
            address: SITE_ADDRESS,
            emails: SITE_EMAILS,
            calendlyUrl: SITE_CALENDLY_URL,
          }
          return {
            content: [{ type: "text", text: JSON.stringify(info) }],
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
