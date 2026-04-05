'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Home, Search, ArrowUpDown } from 'lucide-react';
import Image from 'next/image';
import {
  type PropertyFilters,
} from '@/components/property-filter';

// Dynamic load with Next.js (avoids React.lazy + webpack "reading 'call'" issues)
const PropertyDetailsModal = dynamic(
  () => import('@/components/property-details-modal').then((mod) => mod.PropertyDetailsModal),
  { ssr: false, loading: () => <div className="min-h-[200px] animate-pulse rounded-lg bg-muted" /> }
);
const PropertyFilter = dynamic(
  () => import('@/components/property-filter').then((mod) => mod.PropertyFilter),
  { ssr: false, loading: () => <div className="h-10 w-32 bg-muted animate-pulse rounded" /> }
);
const PropertySearch = dynamic(
  () => import('@/components/property-search').then((mod) => mod.PropertySearch),
  { ssr: false, loading: () => <div className="h-12 w-full max-w-md bg-muted animate-pulse rounded" /> }
);
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SEO from '@/components/seo';
import { generateBreadcrumbJsonLd, generatePropertyJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import type { Property } from '@/app/types/property';
import { mapApiProperty } from '@/lib/mapProperty';
import { backendUrl } from '@/lib/backend';
import { caches, cacheKeys } from '@/lib/cache';
import { registerBfcacheRestoreCallback } from '@/lib/bfcache-optimization';

// keep your SortOption union if not importing
type LocalSortOption =
  | 'newest'
  | 'price-low'
  | 'price-high'
  | 'bedrooms'
  | 'bathrooms'
  | 'sqft';

export default function PropertiesClient() {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [allApiProperties, setAllApiProperties] = useState<Property[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const [filters, setFilters] = useState<PropertyFilters>({
    priceRange: [500, 5000],
    bedrooms: 'any',
    bathrooms: 'any',
    propertyType: 'any',
    amenities: [],
  });

  const [sortBy, setSortBy] = useState<LocalSortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // 3a) Fetch from backend API (Supabase Edge Functions); use in-memory cache for repeat visits and bfcache-friendly behavior
  const PROPERTIES_CACHE_TTL = 2 * 60 * 1000; // 2 minutes
  const propertiesCacheKey = cacheKeys.api.properties();

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const cached = caches.properties.get(propertiesCacheKey) as Property[] | null;
        if (Array.isArray(cached) && cached.length >= 0 && retryCount === 0) {
          setAllApiProperties(cached);
          setLoading(false);
          setError(null);
          return;
        }

        setLoading(true);
        setError(null);
        const res = await fetch(backendUrl('/api/properties/public'), {
          signal: controller.signal,
          cache: 'no-store',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          if (res.status === 429) {
            throw new Error('Too many requests. Please try again in a moment.');
          } else if (res.status >= 500) {
            throw new Error('Server error. Please try again later.');
          } else if (res.status === 404) {
            throw new Error('Property data not found. Please contact support.');
          } else {
            throw new Error(`Failed to load properties (${res.status}). Please try again.`);
          }
        }

        const json = await res.json();
        // Backend returns a paginated envelope: { data: [...], pagination: {...} }
        // Support both the envelope and a legacy plain array shape
        const rawArray: unknown = Array.isArray(json) ? json : (json?.data ?? null);
        if (!Array.isArray(rawArray)) {
          throw new Error('Invalid response format. Please try again.');
        }

        const mapped: Property[] = rawArray.map(mapApiProperty);
        caches.properties.set(propertiesCacheKey, mapped, PROPERTIES_CACHE_TTL);
        setAllApiProperties(mapped);
        setRetryCount(0);
      } catch (e: unknown) {
        if (e instanceof Error && e.name === 'AbortError') {
          return;
        }

        const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred while loading properties';

        if (process.env['NODE_ENV'] === 'development') {
          console.error('Property fetch error:', e);
        }

        setError(errorMessage);
        setAllApiProperties([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount, propertiesCacheKey]);

  // Revalidate on bfcache restore so returning users see fresh data without full loading state
  useEffect(() => {
    const handleRestore = () => {
      fetch(backendUrl('/api/properties/public'), {
        cache: 'no-store',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
        .then((json: unknown) => {
          const rawArray = Array.isArray(json) ? json : (json as Record<string, unknown>)?.data;
          if (!Array.isArray(rawArray)) return;
          const mapped: Property[] = rawArray.map(mapApiProperty);
          caches.properties.set(propertiesCacheKey, mapped, PROPERTIES_CACHE_TTL);
          setAllApiProperties(mapped);
          setError(null);
        })
        .catch(() => { /* ignore background revalidate errors */ });
    };

    const unregister = registerBfcacheRestoreCallback(handleRestore);
    return unregister;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertiesCacheKey]);

  // 3b) Apply your existing filter/sort/search on the fetched list
  useEffect(() => {
    let filtered = [...allApiProperties];

    filtered = filtered.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // bedrooms
    if (filters.bedrooms !== 'any') {
      if (filters.bedrooms === 'studio')
        filtered = filtered.filter((p) => p.bedrooms === 0);
      else if (filters.bedrooms === '4+')
        filtered = filtered.filter((p) => p.bedrooms >= 4);
      else
        filtered = filtered.filter(
          (p) => p.bedrooms === Number.parseInt(filters.bedrooms)
        );
    }

    // bathrooms
    if (filters.bathrooms !== 'any') {
      if (filters.bathrooms === '3+')
        filtered = filtered.filter((p) => p.bathrooms >= 3);
      else
        filtered = filtered.filter(
          (p) => p.bathrooms === Number.parseFloat(filters.bathrooms)
        );
    }

    // property type
    if (filters.propertyType !== 'any') {
      filtered = filtered.filter((p) => p.type === filters.propertyType);
    }

    // amenities (API provides snake_case; keep exact match)
    if (filters.amenities.length > 0) {
      filtered = filtered.filter((p) =>
        filters.amenities.every((a) => p.amenities.includes(a))
      );
    }

    // search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'bedrooms':
        filtered.sort((a, b) => b.bedrooms - a.bedrooms);
        break;
      case 'bathrooms':
        filtered.sort((a, b) => b.bathrooms - a.bathrooms);
        break;
      case 'sqft':
        filtered.sort((a, b) => b.sqft - a.sqft);
        break;
    }

    setProperties(filtered);
  }, [allApiProperties, filters, sortBy, searchQuery]);

  const selectedPropertyData = useMemo(() => {
    return selectedProperty
      ? properties.find((p) => p.id === selectedProperty) ?? null
      : null;
  }, [selectedProperty, properties]);

  const handleViewDetails = useCallback((id: string) => {
    setSelectedProperty(id);
  }, []);

  const handleFilterChange = useCallback((f: PropertyFilters) => {
    setFilters(f);
  }, []);

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
  }, []);

  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  const propertySchemas = useMemo(() => {
    return properties.slice(0, 5).map((p) => {
    const addressParts = p.addressParts ?? {};
    const streetAddress = [addressParts.line1, addressParts.line2].filter(Boolean).join(', ').trim();
    const addressLocality = addressParts.city ?? '';
    const addressRegion = addressParts.state ?? '';
    const postalCode = addressParts.zipcode ?? '';
    const addressCountry = addressParts.country ?? '';

    if (!streetAddress || !addressLocality || !addressRegion || !postalCode || !addressCountry) return null;

    return generatePropertyJsonLd({
      name: p.title ?? 'Property',
      description: p.description || 'Rental property listed by Ondo Real Estate.',
      address: {
        streetAddress,
        addressLocality,
        addressRegion,
        postalCode,
        addressCountry,
      },
      numberOfRooms: p.bedrooms ?? undefined,
      floorSize: p.sqft
        ? {
            value: p.sqft,
            unitCode: 'SQF',
          }
        : undefined,
      image: p.images,
      offers: p.price
        ? {
            price: p.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          }
        : undefined,
    });
  }).filter(Boolean);
  }, [properties]);

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Browse Rental Properties in Utah"
        description="Explore available rental homes, apartments, condos, and townhomes managed by Ondo Real Estate."
        pathname="/properties"
        image={`${SITE_URL}/modern-apartment-balcony.webp`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: 'Home', url: SITE_URL },
            { name: 'Properties', url: `${SITE_URL}/properties` },
          ]),
          ...propertySchemas,
        ]}
      />

      {/* Banner with search field */}
      <section className="relative" aria-labelledby="properties-hero-heading">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-black/90 z-10" />
        <div className="relative h-[400px] overflow-hidden">
          <Image
            src="/modern-apartment-balcony.webp"
            alt="Modern apartment building representing rental properties"
            fill
            className="object-cover"
            priority
            quality={75}
            sizes="100vw"
            title="Rental Properties"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 id="properties-hero-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Find Your Perfect Home</h1>
              <p className="text-lg sm:text-xl text-white/90 mb-8 px-4">
                Browse our curated selection of quality rental properties
              </p>
              <div className="flex justify-center px-4">
                <Suspense fallback={<div className="h-12 w-full max-w-md bg-white/10 animate-pulse rounded"></div>}>
                  <PropertySearch onSearch={handleSearch} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 fade-in" aria-labelledby="properties-section-heading">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 fade-in-up">
              <div>
                <h2 id="properties-section-heading" className="text-3xl font-bold tracking-tight">
                  Available Properties
                </h2>
                <p className="text-foreground/70 mt-2" aria-live="polite" aria-atomic="true">
                  {loading
                    ? 'Loading...'
                    : `${properties.length} properties available for rent`}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto" role="group" aria-label="Property filters and sorting">
                <Suspense fallback={<div className="h-10 w-32 bg-muted animate-pulse rounded"></div>}>
                  <PropertyFilter
                    onFilterChange={handleFilterChange}
                    initialFilters={filters}
                  />
                </Suspense>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-start sm:justify-center min-h-[44px]" aria-label={`Sort properties by ${sortBy === 'newest' ? 'newest' : sortBy === 'price-low' ? 'price low to high' : sortBy === 'price-high' ? 'price high to low' : sortBy === 'bedrooms' ? 'bedrooms' : sortBy === 'bathrooms' ? 'bathrooms' : 'square feet'}`}>
                      <ArrowUpDown className="mr-2 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                      <span className="truncate">
                        Sort by:{' '}
                        <span className="font-medium ml-1">
                          {sortBy === 'newest'
                            ? 'Newest'
                            : sortBy === 'price-low'
                            ? 'Price (Low to High)'
                            : sortBy === 'price-high'
                            ? 'Price (High to Low)'
                            : sortBy === 'bedrooms'
                            ? 'Bedrooms'
                            : sortBy === 'bathrooms'
                            ? 'Bathrooms'
                            : 'Square Feet'}
                        </span>
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy('newest')}>
                      Newest
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('price-low')}>
                      Price (Low to High)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('price-high')}>
                      Price (High to Low)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('bedrooms')}>
                      Bedrooms
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('bathrooms')}>
                      Bathrooms
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('sqft')}>
                      Square Feet
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Loading properties">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-lg shadow-sm border overflow-hidden animate-pulse">
                    <div className="aspect-video bg-muted" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                      <div className="flex gap-4">
                        <div className="h-4 bg-muted rounded w-16" />
                        <div className="h-4 bg-muted rounded w-16" />
                        <div className="h-4 bg-muted rounded w-16" />
                      </div>
                      <div className="h-10 bg-muted rounded w-full mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="max-w-lg w-full text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <Building className="w-10 h-10 text-foreground/40" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Properties are temporarily unavailable</h3>
                  <p className="text-foreground/60 mb-8 max-w-sm mx-auto">
                    We&apos;re having trouble loading our listings right now. This is usually resolved quickly.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={handleRetry} variant="default" className="min-h-[44px]">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Try Again
                    </Button>
                    <Button asChild variant="outline" className="min-h-[44px]">
                      <a href="/contact">Contact Us</a>
                    </Button>
                  </div>
                  {retryCount > 0 && (
                    <p className="text-xs text-foreground/40 mt-4">
                      Still not working? Call us at <a href="tel:+14085380420" className="text-primary hover:underline">+1 (408) 538-0420</a>
                    </p>
                  )}
                </div>
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-fade-in" role="grid" aria-label="Available rental properties">
                {properties.map((property) => (
                  <Card
                    key={property.id}
                    className="overflow-hidden card-hover hover-lift focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 btn-interactive"
                    role="gridcell"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={property.image || '/placeholder.svg'}
                        alt={property.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                        quality={85}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-2 right-2 bg-primary text-foreground px-3 py-1 rounded-md font-medium">
                        ${property.price.toLocaleString()}/mo
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg">
                          {property.title}
                        </h3>
                      </div>
                      <p className="text-foreground/70 text-sm mb-2">
                        {property.address}
                      </p>
                      <div className="flex items-center gap-4 text-sm" role="list" aria-label="Property specifications">
                        <span className="flex items-center gap-1" role="listitem">
                          <Home className="h-4 w-4" aria-hidden="true" />{' '}
                          {property.bedrooms === 0
                            ? 'Studio'
                            : `${property.bedrooms} Beds`}
                        </span>
                        <span className="flex items-center gap-1" role="listitem">
                          <Building className="h-4 w-4" aria-hidden="true" /> {property.bathrooms}{' '}
                          Baths
                        </span>
                        <span className="flex items-center gap-1" role="listitem">
                          <Search className="h-4 w-4" aria-hidden="true" /> {property.sqft} sqft
                        </span>
                      </div>
                      <Button
                        className="w-full mt-4 min-h-[44px] text-base btn-interactive hover-lift"
                        onClick={() => handleViewDetails(property.id)}
                        aria-label={`View details for ${property.title} at ${property.address}, priced at ${property.price} per month`}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center">
                <div className="max-w-md w-full">
                  <div className="bg-card p-6 rounded-lg shadow-sm border mb-6 dark:bg-muted dark:border-border">
                    <h3 className="text-lg font-semibold mb-4 dark:text-foreground">
                      No properties found
                    </h3>
                    <p className="text-foreground/70 mb-4 dark:text-foreground/70">
                      We couldn't find any properties matching your search
                      criteria.
                    </p>
                    <Button
                      onClick={() => {
                        setFilters({
                          priceRange: [500, 5000],
                          bedrooms: 'any',
                          bathrooms: 'any',
                          propertyType: 'any',
                          amenities: [],
                        });
                        setSearchQuery('');
                      }}
                      className="w-full"
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Details modal */}
      {selectedPropertyData && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Loading property details...</span>
            </div>
          </div>
        }>
          <PropertyDetailsModal
            company={{
              id: parseInt(selectedPropertyData.id) || 0,
              title: selectedPropertyData.title,
              address: selectedPropertyData.address,
              price: selectedPropertyData.price,
              bedrooms: selectedPropertyData.bedrooms,
              bathrooms: selectedPropertyData.bathrooms,
              sqft: selectedPropertyData.sqft,
              type: selectedPropertyData.type,
              image: selectedPropertyData.image,
              description: selectedPropertyData.description,
              features: selectedPropertyData.amenities || [],
              availability: selectedPropertyData.availability || undefined,
              leaseTerms: selectedPropertyData.leaseTerms || undefined,
              services: selectedPropertyData.services || undefined,
              fees: selectedPropertyData.fees || undefined,
              rating: selectedPropertyData.rating,
              reviewCount: selectedPropertyData.reviewCount,
              phone: selectedPropertyData.contact?.phone || selectedPropertyData.phone,
              website: selectedPropertyData.website || undefined,
              logo: selectedPropertyData.logo,
              specialties: selectedPropertyData.specialties || undefined,
              valueRanges: selectedPropertyData.valueRanges || undefined,
              images: selectedPropertyData.images || undefined,
            }}
            open={selectedProperty !== null}
            onOpenChange={() => setSelectedProperty(null)}
          />
        </Suspense>
      )}
    </div>
  );
}
