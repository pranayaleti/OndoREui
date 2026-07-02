import type { Metadata } from "next";
import ExploreMapClient from "./explore-map-client";
import { fetchProperties } from "@/lib/api/properties";

export const metadata: Metadata = {
  title: "Explore properties | Ondo",
  description: "Map view of available properties.",
};

// The site is statically exported (output: "export" in next.config.mjs), so
// there is no request-time server — `force-dynamic` is invalid here and breaks
// the export. Properties are fetched at build time for the initial pin set;
// ExploreMapClient refreshes from the API on the client for live availability.
export default async function ExplorePage() {
  const properties = await fetchProperties();

  // The map only renders pins for properties with usable coordinates.
  // Properties without lat/lng (legacy rows pre-geocoding) are skipped on
  // the client side with a console warning.
  return (
    <main className="px-4 py-6 lg:px-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Explore properties</h1>
        <p className="text-sm text-gray-600 mt-1">
          {properties.length} {properties.length === 1 ? "property" : "properties"} on the map.
        </p>
      </div>
      <ExploreMapClient properties={properties} />
    </main>
  );
}
