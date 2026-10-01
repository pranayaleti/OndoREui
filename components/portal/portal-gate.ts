import type { Metadata } from "next"
import { pageTitle } from "@/lib/site"

/**
 * Metadata for the portal gate pages (platform, owner, tenant, staff). They are not content:
 * noindex, no canonical (a canonical pointing at /auth told crawlers these were duplicates of a
 * page that does not exist), and the title goes through pageTitle() so the root layout template
 * cannot append a second brand.
 */
export function portalGateMetadata(title: string, description: string): Metadata {
  return {
    title: pageTitle(title),
    description,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  }
}
