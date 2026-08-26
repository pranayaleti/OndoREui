"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker, PopupEvent } from "leaflet";

interface MapProperty {
  id: string;
  title: string;
  /** Omit for a plain location marker with no listing behind it (e.g. a neighborhood center pin). */
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  lat: number;
  lng: number;
  image?: string;
  type?: string;
}

interface PropertyMapProps {
  properties: MapProperty[];
  center?: [number, number];
  zoom?: number;
  onPropertyClick?: (propertyId: string) => void;
  /** When set, that listing's pin uses the selected price-chip treatment. */
  selectedPropertyId?: string | null;
  className?: string;
}

type LeafletHostElement = HTMLDivElement & { _leaflet_id?: number };

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function escapeMapPopupText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Resize must never remount a Leaflet host — that re-inits on the same node. */
export function syncLeafletSizeAfterContainerResize(
  map: { invalidateSize: () => void } | null,
): void {
  map?.invalidateSize();
}

/**
 * react-leaflet's MapContainer uses a callback ref that can call L.map() twice
 * on the same node (React Strict Mode / dynamic import). Clear a leftover id
 * so the second init does not throw "Map container is already initialized".
 */
export function prepareLeafletHost(node: HTMLDivElement): HTMLDivElement {
  const host = node as LeafletHostElement;
  if (host._leaflet_id) {
    host._leaflet_id = undefined;
  }
  return host;
}

export function buildListingPopupHtml(
  property: Pick<MapProperty, "id" | "title" | "price" | "bedrooms" | "bathrooms" | "type" | "image">,
  options: { showListingAction: boolean },
): string {
  const title = escapeMapPopupText(property.title);
  const image = property.image
    ? `<img src="${escapeMapPopupText(property.image)}" alt="${title}" style="width:100%;height:120px;object-fit:cover;border-radius:6px;margin-bottom:8px" />`
    : "";
  const priceLine =
    property.price !== undefined
      ? `<p style="margin:0 0 4px;font-size:16px;font-weight:700;color:hsl(var(--primary))">${escapeMapPopupText(formatPrice(property.price))}/mo</p>`
      : "";
  const facts = [
    property.bedrooms !== undefined ? `${property.bedrooms} bed` : null,
    property.bathrooms !== undefined ? `${property.bathrooms} bath` : null,
    property.type ? escapeMapPopupText(property.type) : null,
  ]
    .filter((part): part is string => Boolean(part))
    .join(" · ");
  const factsLine = facts
    ? `<p style="margin:0;font-size:12px;color:hsl(var(--muted-foreground))">${facts}</p>`
    : "";
  const action = options.showListingAction
    ? `<button type="button" class="ondo-map-show-listing mt-2 w-full cursor-pointer rounded-md border-0 bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground" data-listing-id="${escapeMapPopupText(property.id)}">Show listing</button>`
    : "";
  return `<div style="min-width:200px;padding:4px">${image}<h3 style="margin:0 0 4px;font-size:14px;font-weight:600">${title}</h3>${priceLine}${factsLine}${action}</div>`;
}

export default function PropertyMap({
  properties,
  center = [40.7608, -111.891],
  zoom = 11,
  onPropertyClick,
  selectedPropertyId = null,
  className = "",
}: PropertyMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [mapError, setMapError] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);
  const onPropertyClickRef = useRef(onPropertyClick);
  const [mapReadyToken, setMapReadyToken] = useState(0);
  onPropertyClickRef.current = onPropertyClick;

  useEffect(() => {
    setIsClient(true);
    import("leaflet").then((leaflet) => {
      setL(leaflet.default || leaflet);
    });
  }, []);

  const validProperties = useMemo(
    () => properties.filter((p) => p.lat && p.lng && !isNaN(p.lat) && !isNaN(p.lng)),
    [properties],
  );

  useEffect(() => {
    if (!L) return;
    const node = hostRef.current;
    if (!node) return;

    let map: LeafletMap;
    try {
      map = L.map(prepareLeafletHost(node), { scrollWheelZoom: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (!message.includes("already initialized")) {
        setMapError(true);
        return;
      }
      map = L.map(prepareLeafletHost(node), { scrollWheelZoom: true });
    }

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapInstanceRef.current = map;
    setMapReadyToken((n) => n + 1);
    requestAnimationFrame(() => {
      syncLeafletSizeAfterContainerResize(map);
    });

    const onPopupOpen = (event: PopupEvent) => {
      const btn = event.popup.getElement()?.querySelector<HTMLButtonElement>(".ondo-map-show-listing");
      if (!btn) return;
      const listingId = btn.dataset.listingId;
      const onClick = () => {
        if (listingId) onPropertyClickRef.current?.(listingId);
      };
      btn.addEventListener("click", onClick);
      map.once("popupclose", () => btn.removeEventListener("click", onClick));
    };
    map.on("popupopen", onPopupOpen);

    return () => {
      map.off("popupopen", onPopupOpen);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [L]);

  useEffect(() => {
    if (!isClient || !L || typeof ResizeObserver === "undefined") return;
    const el = hostRef.current;
    if (!el) return;
    let frame = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        syncLeafletSizeAfterContainerResize(mapInstanceRef.current);
      });
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [isClient, L]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!L || !map || mapReadyToken === 0) return;

    for (const marker of markersRef.current) {
      marker.remove();
    }
    markersRef.current = [];

    const locationIcon = L.divIcon({
      className: "custom-map-marker",
      html: '<div class="custom-map-marker-pin">&#127968;</div>',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const latLngs = validProperties.map((property) => {
      const selected = property.id === selectedPropertyId;
      const icon =
        property.price !== undefined
          ? L.divIcon({
              className: "custom-map-marker",
              html: `<div class="custom-map-marker-pin ondo-price-pin${selected ? " ondo-price-pin--selected" : ""}">${escapeMapPopupText(formatPrice(property.price))}</div>`,
              iconSize: [72, 28],
              iconAnchor: [36, 28],
              popupAnchor: [0, -28],
            })
          : locationIcon;

      const marker = L.marker([property.lat, property.lng], { icon })
        .bindPopup(
          buildListingPopupHtml(property, { showListingAction: Boolean(onPropertyClickRef.current) }),
        )
        .on("click", () => onPropertyClickRef.current?.(property.id))
        .addTo(map);

      markersRef.current.push(marker);
      return L.latLng(property.lat, property.lng);
    });

    if (latLngs.length > 0) {
      map.fitBounds(L.latLngBounds(latLngs).pad(0.1));
    } else {
      map.setView(center, zoom);
    }
  }, [L, validProperties, selectedPropertyId, center, zoom, mapReadyToken]);

  if (!isClient || !L) {
    return (
      <div
        id="property-map-container"
        className={`bg-muted rounded-lg flex items-center justify-center ${className}`}
        style={{ width: "100%", aspectRatio: "16 / 9", minHeight: 220 }}
      >
        <p className="text-foreground/60">Loading map...</p>
      </div>
    );
  }

  if (mapError) {
    return (
      <div
        id="property-map-container"
        className={`flex min-h-[220px] items-center justify-center rounded-lg bg-muted px-4 text-center text-sm text-foreground/70 ${className}`}
        role="status"
      >
        Map could not load. Browse homes in the list.
      </div>
    );
  }

  return (
    <div
      id="property-map-container"
      ref={hostRef}
      className={`rounded-lg overflow-hidden border border-border ${className}`}
      style={{ width: "100%", height: "100%", minHeight: 220 }}
      aria-label="Property location map. Use the listing cards for keyboard access."
      role="region"
    />
  );
}
