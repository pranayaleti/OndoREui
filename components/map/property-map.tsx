"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";

// Types
interface MapProperty {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
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
  className?: string;
}

// Dynamically import the map to avoid SSR issues with Leaflet
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const UseMapEvents = dynamic(
  () => import("react-leaflet").then((mod) => {
    // Return a component that calls map.invalidateSize() when the map is ready
    const { useMap } = mod;
    function MapReadyHandler({ onReady }: { onReady: (map: import("leaflet").Map) => void }) {
      const map = useMap();
      useEffect(() => {
        onReady(map);
      }, [map, onReady]);
      return null;
    }
    return MapReadyHandler;
  }),
  { ssr: false }
);

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function PropertyMap({
  properties,
  center = [40.7608, -111.891],
  zoom = 11,
  onPropertyClick,
  className = "",
}: PropertyMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  // Key increments on container resize to force Leaflet to re-render and
  // correctly fill the new dimensions (fixes blank tile / incorrect tile
  // sizing issues after responsive layout changes).
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    setIsClient(true);
    import("leaflet").then((leaflet) => {
      setL(leaflet.default || leaflet);
    });
  }, []);

  // Re-key the MapContainer whenever the outer element is resized so Leaflet
  // re-initialises with correct dimensions.
  useEffect(() => {
    if (!isClient || typeof ResizeObserver === "undefined") return;
    const el = document.getElementById("property-map-container");
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setMapKey((k) => k + 1);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isClient]);

  // Call invalidateSize once the map instance is available so tiles fill the
  // container correctly after the first render.
  const handleMapReady = useCallback((map: import("leaflet").Map) => {
    // Defer slightly to ensure the container has its final painted size
    requestAnimationFrame(() => {
      map.invalidateSize();
    });
  }, []);

  const customIcon = useMemo(() => {
    if (!L) return undefined;
    return L.divIcon({
      className: "custom-map-marker",
      html: '<div class="custom-map-marker-pin">&#127968;</div>',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  }, [L]);

  // Filter properties with valid coordinates
  const validProperties = useMemo(
    () => properties.filter((p) => p.lat && p.lng && !isNaN(p.lat) && !isNaN(p.lng)),
    [properties]
  );

  // Auto-fit bounds
  const bounds = useMemo(() => {
    if (!L || validProperties.length === 0) return undefined;
    const latLngs = validProperties.map((p) => L.latLng(p.lat, p.lng));
    return L.latLngBounds(latLngs).pad(0.1);
  }, [L, validProperties]);

  if (!isClient || !L) {
    return (
      <div
        id="property-map-container"
        className={`bg-muted rounded-lg flex items-center justify-center ${className}`}
        style={{ width: "100%", aspectRatio: "16 / 9", minHeight: 220 }}
      >
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div
      id="property-map-container"
      className={`rounded-lg overflow-hidden border border-gray-200 ${className}`}
      style={{ width: "100%" }}
    >
      {/*
        The MapContainer itself is set to 100% width and height so it fills
        whatever the outer container provides. The outer container drives the
        responsive sizing via className (e.g. "h-[50vw] max-h-[500px]") or a
        CSS aspect-ratio rule applied by the caller.
      */}
      <MapContainer
        key={mapKey}
        center={bounds ? undefined : center}
        bounds={bounds}
        zoom={bounds ? undefined : zoom}
        style={{ height: "100%", width: "100%", minHeight: 220 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Invalidate tile layout once the map instance is ready */}
        <UseMapEvents onReady={handleMapReady} />
        {validProperties.map((property) => (
          <Marker
            key={property.id}
            position={[property.lat, property.lng]}
            icon={customIcon}
          >
            <Popup>
              <div style={{ minWidth: 200, padding: 4 }}>
                {property.image && (
                  <img
                    src={property.image}
                    alt={property.title}
                    style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 6, marginBottom: 8 }}
                  />
                )}
                <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600 }}>
                  {property.title}
                </h3>
                <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#2563eb" }}>
                  {formatPrice(property.price)}/mo
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
                  {property.bedrooms} bed &middot; {property.bathrooms} bath
                  {property.type && ` \u00B7 ${property.type}`}
                </p>
                {onPropertyClick && (
                  <button
                    type="button"
                    onClick={() => onPropertyClick(property.id)}
                    className="mt-2 w-full cursor-pointer rounded-md border-0 bg-primary px-3 py-1.5 text-[13px] font-medium text-primary-foreground"
                  >
                    View Details
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
