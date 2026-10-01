"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PropertySearchMap from "@/components/map/property-search-map";
import type { Property } from "@/app/types/property";
import { mapApiProperties } from "@/lib/mapProperty";
import { fetchPublicPropertyListOrThrow, listingDetailPath } from "@/lib/public-property";

interface ExploreMapClientProps {
  initialProperties: Property[];
}

/**
 * Maps public listings (the same Property shape /properties uses) onto the
 * SearchProperty shape that PropertySearchMap expects. Listings without
 * lat/lng are dropped, backend geocodes on create/update, but legacy
 * rows pre-geocoding may still be missing coords. Pins are keyed by the
 * listing publicId, which is what /properties/{publicId}/ is built from.
 */
export function listingsToPins(properties: Property[]) {
  const pins = [];
  const skipped: string[] = [];
  for (const p of properties) {
    const { lat, lng } = p;
    if (typeof lat !== "number" || typeof lng !== "number" || (lat === 0 && lng === 0)) {
      skipped.push(p.id);
      continue;
    }
    pins.push({
      id: p.id,
      title: p.title,
      price: p.price,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      lat,
      lng,
      image: p.image,
      type: p.type,
      city: p.addressParts?.city ?? undefined,
    });
  }
  return { pins, skipped };
}

export default function ExploreMapClient({ initialProperties }: ExploreMapClientProps) {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [refreshing, setRefreshing] = useState(true);

  // Refresh from the API so a build made while listings were missing (or stale) heals itself.
  useEffect(() => {
    const controller = new AbortController();
    fetchPublicPropertyListOrThrow((input, init) =>
      fetch(input, { ...init, signal: controller.signal, cache: "no-store" }),
    )
      .then((rows) => setProperties(mapApiProperties(rows)))
      .catch(() => {
        // Keep the build-time pins when the refresh fails.
      })
      .finally(() => {
        if (!controller.signal.aborted) setRefreshing(false);
      });
    return () => controller.abort();
  }, []);

  const { pins, skipped } = useMemo(() => listingsToPins(properties), [properties]);

  useEffect(() => {
    if (skipped.length > 0) {
      // Visible in dev tools so the gap is surfaced.
      console.warn(`[explore] Skipped ${skipped.length} properties without coordinates`, {
        sample: skipped.slice(0, 5),
      });
    }
  }, [skipped]);

  const linkClass = "text-primary underline underline-offset-4 hover:no-underline";

  if (pins.length === 0) {
    if (refreshing && properties.length === 0) {
      return (
        <p className="text-sm text-foreground/70" role="status">
          Loading listings...
        </p>
      );
    }
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-foreground/80">
          No listings are on the map right now.
        </p>
        <p className="text-sm text-foreground/70 mt-2">
          New listings appear here as soon as they are published with an address. Browse the full
          list of available homes on the <Link href="/properties/" className={linkClass}>properties page</Link>, or{" "}
          <Link href="/contact/" className={linkClass}>contact us</Link> to hear about homes before they list.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-foreground/70">
        {pins.length} {pins.length === 1 ? "property" : "properties"} on the map.
      </p>
      <PropertySearchMap
        properties={pins}
        onPropertyClick={(id) => router.push(listingDetailPath(id))}
      />
    </>
  );
}
