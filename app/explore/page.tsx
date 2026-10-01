import type { Metadata } from "next";
import ExploreMapClient from "./explore-map-client";
import { mapApiProperties } from "@/lib/mapProperty";
import { fetchPublicPropertyList } from "@/lib/public-property";
import { toCanonicalPageUrl } from "@/lib/page-canonical"
import { pageTitle } from "@/lib/site"

export const metadata: Metadata = {
  alternates: { canonical: toCanonicalPageUrl("/explore") },
  title: pageTitle("Explore properties | Ondo"),
  description: "Map view of available properties.",
};

// The site is statically exported (output: "export" in next.config.mjs), so
// there is no request-time server, `force-dynamic` is invalid here and breaks
// the export. Rental listings are fetched at build time for the initial pin set
// (same public list helper as /properties); ExploreMapClient refetches on the
// client so the map reflects current availability.
export default async function ExplorePage() {
  const properties = mapApiProperties(await fetchPublicPropertyList());

  return (
    <main className="px-4 py-6 lg:px-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Explore properties</h1>
      </div>
      <ExploreMapClient initialProperties={properties} />
    </main>
  );
}
