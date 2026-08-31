import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"
import EventsClient from "./events-client"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: "ONDO Events | Ondo Real Estate",
  description:
    "Upcoming ONDO events, homebuyer workshops, investor mixers, and community gatherings. RSVP and join us.",
  alternates: { canonical: `${SITE_URL}/events/` },
  openGraph: {
    title: "ONDO Events | Ondo Real Estate",
    description:
      "Upcoming ONDO events, homebuyer workshops, investor mixers, and community gatherings.",
    url: `${SITE_URL}/events/`,
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}

export default function EventsPage() {
  return <EventsClient />
}
