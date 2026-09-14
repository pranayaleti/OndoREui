"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import PropertySearchMap from "@/components/map/property-search-map";
import type { PropertySummary } from "@/lib/api/types";
import { listingDetailPath } from "@/lib/public-property";

interface ExploreMapClientProps {
  properties: PropertySummary[];
}

/**
 * Maps the public PropertySummary shape (used across listings) onto the
 * SearchProperty shape that PropertySearchMap expects. Properties without
 * lat/lng are filtered out, backend geocodes on create/update, but legacy
 * rows pre-geocoding may still be missing coords.
 */
export default function ExploreMapClient({ properties }: ExploreMapClientProps) {
  const router = useRouter();

  const mapped = useMemo(() => {
    const skipped: string[] = [];
    const valid = properties
      .filter((p) => {
        const ok = typeof p.lat === "number" && typeof p.lng === "number" && !(p.lat === 0 && p.lng === 0);
        if (!ok) skipped.push(p.id);
        return ok;
      })
      .map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        bedrooms: p.bedrooms,
        // PropertySummary has no bathrooms field; surface 0 so the filter
        // control still works (min-baths >0 will hide these). Backend can
        // add bathrooms to the public endpoint later.
        bathrooms: 0,
        lat: p.lat,
        lng: p.lng,
        image: p.image,
        type: p.propertyType,
        city: p.location,
      }));

    if (skipped.length > 0 && typeof window !== "undefined") {
      // Visible in dev tools so the gap is surfaced; production deploys can
      // strip console via Next compiler if desired.
      console.warn(
        `[explore] Skipped ${skipped.length} properties without coordinates`,
        { sample: skipped.slice(0, 5) },
      );
    }
    return valid;
  }, [properties]);

  if (mapped.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
        <p className="text-foreground/80">
          No listings are on the map right now.
        </p>
        <p className="text-sm text-foreground/60 mt-2">
          New listings appear here as soon as they are published with an address. Browse the full
          list of available homes on the <Link href="/properties" className="text-primary underline-offset-4 hover:underline">properties page</Link>, or{" "}
          <Link href="/contact" className="text-primary underline-offset-4 hover:underline">contact us</Link> to hear about homes before they list.
        </p>
      </div>
    );
  }

  return (
    <PropertySearchMap
      properties={mapped}
      onPropertyClick={(id) => router.push(listingDetailPath(id))}
    />
  );
}
