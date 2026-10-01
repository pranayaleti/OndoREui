import type { Metadata } from "next"
import Link from "next/link"
import { ListingCompareClient } from "./page-client"
import { SITE_NAME, SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

const TITLE = `Compare listings | ${SITE_NAME}`
const DESCRIPTION = "Compare two or three Ondo rental listings using the facts on each public listing."
const CANONICAL = `${SITE_URL}/properties/compare/`

// Own openGraph/twitter: Next replaces (does not merge) the parent layout's
// objects, so without these the preview inherits the /properties/ layout copy.
export const metadata: Metadata = {
  title: pageTitle(TITLE),
  description: DESCRIPTION,
  robots: { index: false, follow: true },
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: pageTitleText(TITLE),
    description: DESCRIPTION,
    url: CANONICAL,
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitleText(TITLE),
    description: DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_URL],
  },
}

export default function ListingComparePage() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <Link href="/properties" className="hover:underline">
          Properties
        </Link>{" "}
        / <span aria-current="page">Compare</span>
      </nav>
      <header className="mb-6">
        <h1 className="font-outfit text-3xl font-bold tracking-tight">Compare listings</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Side-by-side facts from the public listings you chose — rent, rooms, size, type, city,
          move-in, amenities, and pets. We do not rank homes or invent neighborhood scores.
        </p>
      </header>
      <ListingCompareClient />
    </main>
  )
}
