"use client";

import { useState, useMemo, useCallback } from "react";
import PropertyMap from "./property-map";

interface SearchProperty {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  lat: number;
  lng: number;
  image?: string;
  type?: string;
  city?: string;
}

interface PropertySearchMapProps {
  properties: SearchProperty[];
  onPropertyClick?: (propertyId: string) => void;
}

export default function PropertySearchMap({
  properties,
  onPropertyClick,
}: PropertySearchMapProps) {
  const [query, setQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minBeds, setMinBeds] = useState(0);
  const [minBaths, setMinBaths] = useState(0);
  const [propertyType, setPropertyType] = useState("");

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (query) {
        const q = query.toLowerCase();
        const matchesQuery =
          p.title.toLowerCase().includes(q) ||
          (p.city && p.city.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (p.bedrooms < minBeds) return false;
      if (p.bathrooms < minBaths) return false;
      if (propertyType && p.type !== propertyType) return false;
      return true;
    });
  }, [properties, query, priceRange, minBeds, minBaths, propertyType]);

  const propertyTypes = useMemo(() => {
    const types = new Set(properties.map((p) => p.type).filter(Boolean));
    return [...types] as string[];
  }, [properties]);

  const handleReset = useCallback(() => {
    setQuery("");
    setPriceRange([0, 10000]);
    setMinBeds(0);
    setMinBaths(0);
    setPropertyType("");
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Filters Bar */}
      <div className="bg-card rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search input */}
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              id="search-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or city..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price range */}
          <div className="min-w-[160px]">
            <label htmlFor="filter-max-price" className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <select
              id="filter-max-price"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1000}>$1,000/mo</option>
              <option value={1500}>$1,500/mo</option>
              <option value={2000}>$2,000/mo</option>
              <option value={2500}>$2,500/mo</option>
              <option value={3000}>$3,000/mo</option>
              <option value={5000}>$5,000/mo</option>
              <option value={10000}>Any</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div className="min-w-[100px]">
            <label htmlFor="filter-min-beds" className="block text-sm font-medium text-gray-700 mb-1">
              Beds
            </label>
            <select
              id="filter-min-beds"
              value={minBeds}
              onChange={(e) => setMinBeds(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Any</option>
              <option value={1}>1+</option>
              <option value={2}>2+</option>
              <option value={3}>3+</option>
              <option value={4}>4+</option>
            </select>
          </div>

          {/* Bathrooms */}
          <div className="min-w-[100px]">
            <label htmlFor="filter-min-baths" className="block text-sm font-medium text-gray-700 mb-1">
              Baths
            </label>
            <select
              id="filter-min-baths"
              value={minBaths}
              onChange={(e) => setMinBaths(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Any</option>
              <option value={1}>1+</option>
              <option value={2}>2+</option>
              <option value={3}>3+</option>
            </select>
          </div>

          {/* Property Type */}
          {propertyTypes.length > 0 && (
            <div className="min-w-[140px]">
              <label htmlFor="filter-property-type" className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                id="filter-property-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {propertyTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reset */}
          <button
            onClick={handleReset}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-muted"
          >
            Reset
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          Showing {filteredProperties.length} of {properties.length} properties
        </p>
      </div>

      {/* Map — responsive height: clamps between 220px (mobile) and 500px (desktop).
           The outer wrapper drives the height via aspect-ratio on small screens and
           a max-height cap on larger ones so the map always fills its container. */}
      <div
        className="w-full"
        style={{
          /* ~56 vw on mobile, capped at 500px on desktop */
          aspectRatio: "16 / 9",
          maxHeight: 500,
          minHeight: 220,
        }}
      >
        <PropertyMap
          properties={filteredProperties}
          onPropertyClick={onPropertyClick}
          className="h-full"
        />
      </div>

      {/* Property List (below map) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProperties.slice(0, 12).map((property) => (
          <div
            key={property.id}
            role="button"
            tabIndex={0}
            className="bg-card rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onPropertyClick?.(property.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onPropertyClick?.(property.id);
              }
            }}
          >
            {property.image && (
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-3">
              <h3 className="font-semibold text-sm truncate">{property.title}</h3>
              <p className="text-blue-600 font-bold text-lg">
                ${property.price.toLocaleString()}/mo
              </p>
              <p className="text-gray-500 text-xs">
                {property.bedrooms} bed &middot; {property.bathrooms} bath
                {property.type && ` \u00B7 ${property.type}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
