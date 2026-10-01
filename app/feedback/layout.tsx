import type { Metadata } from "next"
import type { ReactNode } from "react"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { pageTitle } from "@/lib/site"

/**
 * /feedback is a logged-in-style utility form that the footer links sitewide. It is
 * deliberately NOT in robots.txt (lib/agent-discovery-config.json): a Disallow would
 * stop Google reading the noindex below. It is excluded from the XML sitemap and
 * noindex, so inbound links cannot index it. The page itself is a client component,
 * so metadata has to live in this server layout.
 */
export const metadata: Metadata = pageCanonicalMetadata("/feedback", {
  title: pageTitle("Suggest Improvements | Ondo Real Estate"),
  description:
    "Share ideas to improve Ondo Real Estate. We read every suggestion and use the useful ones to decide what to build next.",
  robots: { index: false, follow: true },
})

export default function FeedbackLayout({ children }: { children: ReactNode }) {
  return children
}
