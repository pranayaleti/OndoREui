import type { Metadata } from "next";
import ExploreMapClient from "./explore-map-client";
import { fetchProperties } from "@/lib/api/properties";

export const metadata: Metadata = {
  title: "Explore properties | Ondo",
  description: "Map view of available properties.",
};

// Re-fetch on each request so newly-listed properties appear without a
// rebuild. Map view is a live "what's available right now" experience.
export const dynamic = "force-dynamic";

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
