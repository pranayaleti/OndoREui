import type { Metadata } from "next"
import { InstagramFeedView } from "@/components/instagram/instagram-feed-view"
import { instagramFeed } from "@/lib/instagram-feed"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { pageTitle } from "@/lib/site"

export const metadata: Metadata = pageCanonicalMetadata("/instagram", {
  title: pageTitle("Ondo Real Estate on Instagram"),
  description:
    "The latest posts from Ondo Real Estate on Instagram: Utah homes, market notes and behind-the-scenes from Lehi. Tap any post to open it on Instagram.",
  // The posts live on Instagram; as a search result this page would be a thin copy of them.
  robots: { index: false, follow: true },
})

export default function InstagramPage() {
  return <InstagramFeedView feed={instagramFeed} />
}
