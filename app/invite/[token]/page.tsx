import type { Metadata } from "next"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { pageTitle } from "@/lib/site"
import InvitePageClient from "./invite-page-client"

/**
 * Token page: only the placeholder `/invite/_/` is built. robots.txt disallows
 * /invite, so Google can never read a noindex from crawling it, but the tag keeps
 * the URL out of results if it is ever fetched, and the canonical pins every token
 * to the one built URL.
 */
export const metadata: Metadata = pageCanonicalMetadata("/invite/_/", {
  title: pageTitle("Accept Invitation | Ondo Real Estate"),
  robots: { index: false, follow: false },
})

export function generateStaticParams() {
  return [{ token: "_" }]
}

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return <InvitePageClient token={token} />
}
