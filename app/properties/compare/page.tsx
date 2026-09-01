import type { Metadata } from "next"
import Link from "next/link"
import { ListingCompareClient } from "./page-client"
import { SITE_NAME, SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: `Compare listings | ${SITE_NAME}`,
  description: "Compare two or three Ondo rental listings using the facts on each public listing.",
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/properties/compare/` },
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
