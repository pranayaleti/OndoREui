import type { Metadata } from "next"
import type { ReactNode } from "react"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { pageTitle } from "@/lib/site"

/**
 * /feedback is a logged-in-style utility form: robots.txt already disallows it
 * (lib/agent-discovery-config.json extraDisallow) and it is excluded from the XML
 * sitemap, so it must be noindex too — otherwise Google can index the URL from
 * inbound links with no title of its own. The page itself is a client component,
 * so metadata has to live in this server layout.
 */
export const metadata: Metadata = pageCanonicalMetadata("/feedback", {
  title: pageTitle("Suggest Improvements | Ondo Real Estate"),
  description:
    "Share ideas to improve Ondo Real Estate. Our suggestion tracker highlights the best ideas, and top contributors can receive gift cards as a thank-you.",
  robots: { index: false, follow: true },
})

export default function FeedbackLayout({ children }: { children: ReactNode }) {
  return children
}
