"use client";

// Map styles ship with the map, not the root layout: pages without a map (like /links) skip ~15 KB of render-blocking CSS.
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useMemo, useRef } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker, PopupEvent } from "leaflet";
import { listingWorksheetPath } from "@/lib/public-property";

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

/** Module constant so an omitted `center` prop is the same array on every render. */
const DEFAULT_CENTER: [number, number] = [40.7608, -111.891];

/** A rendered pin, tracked so a selection change can swap its icon without rebuilding. */
type MarkerEntry = { id: string; price: number | undefined; marker: LeafletMarker };

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
  const worksheet =
    property.price !== undefined
      ? `<a href="${escapeMapPopupText(listingWorksheetPath(property.id))}" class="mt-2 inline-flex min-h-11 items-center text-sm font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Worksheet</a>`
      : "";
  return `<div style="min-width:200px;padding:4px">${image}<h3 style="margin:0 0 4px;font-size:14px;font-weight:600">${title}</h3>${priceLine}${factsLine}${action}${worksheet}</div>`;
}

function priceIcon(L: typeof import("leaflet"), price: number, selected: boolean) {
  return L.divIcon({
    className: "custom-map-marker",
    html: `<div class="custom-map-marker-pin ondo-price-pin${selected ? " ondo-price-pin--selected" : ""}">${escapeMapPopupText(formatPrice(price))}</div>`,
    iconSize: [72, 28],
    iconAnchor: [36, 28],
    popupAnchor: [0, -28],
  });
}

export default function PropertyMap({
  properties,
  center = DEFAULT_CENTER,
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
  const markersRef = useRef<MarkerEntry[]>([]);
  // Bounds are fitted only when the set of listings changes, so a parent re-render
  // (highlight, filter typing) never throws away the visitor's pan and zoom.
  const fittedIdsKeyRef = useRef<string | null>(null);
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
    fittedIdsKeyRef.current = null;
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

  // Rebuild markers when what they show changes, not on every render of the parent.
  const markersKey = useMemo(
    () =>
      JSON.stringify(
        validProperties.map((p) => [
          p.id,
          p.lat,
          p.lng,
          p.title,
          p.price,
          p.bedrooms,
          p.bathrooms,
          p.type,
          p.image,
        ]),
      ),
    [validProperties],
  );
  const idsKey = useMemo(() => validProperties.map((p) => p.id).sort().join("\u0000"), [validProperties]);
  const validPropertiesRef = useRef(validProperties);
  validPropertiesRef.current = validProperties;
  const selectedPropertyIdRef = useRef(selectedPropertyId);
  selectedPropertyIdRef.current = selectedPropertyId;
  const centerLat = center[0];
  const centerLng = center[1];

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!L || !map || mapReadyToken === 0) return;

    for (const entry of markersRef.current) {
      entry.marker.remove();
    }
    markersRef.current = [];

    const locationIcon = L.divIcon({
      className: "custom-map-marker",
      html: '<div class="custom-map-marker-pin">&#127968;</div>',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const latLngs = validPropertiesRef.current.map((property) => {
      const icon =
        property.price !== undefined
          ? priceIcon(L, property.price, property.id === selectedPropertyIdRef.current)
          : locationIcon;

      const marker = L.marker([property.lat, property.lng], { icon })
        .bindPopup(
          buildListingPopupHtml(property, { showListingAction: Boolean(onPropertyClickRef.current) }),
        )
        .on("click", () => onPropertyClickRef.current?.(property.id))
        .addTo(map);

      markersRef.current.push({ id: property.id, price: property.price, marker });
      return L.latLng(property.lat, property.lng);
    });

    if (fittedIdsKeyRef.current === idsKey) return;
    fittedIdsKeyRef.current = idsKey;
    if (latLngs.length > 0) {
      map.fitBounds(L.latLngBounds(latLngs).pad(0.1));
    } else {
      map.setView([centerLat, centerLng], zoom);
    }
  }, [L, markersKey, idsKey, centerLat, centerLng, zoom, mapReadyToken]);

  // Selection only swaps pin icons; it never moves the map.
  useEffect(() => {
    if (!L) return;
    for (const entry of markersRef.current) {
      if (entry.price === undefined) continue;
      entry.marker.setIcon(priceIcon(L, entry.price, entry.id === selectedPropertyId));
    }
  }, [L, selectedPropertyId, markersKey, mapReadyToken]);

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
