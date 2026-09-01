'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, List, Map } from 'lucide-react';
import {
  type PropertyFilters,
  DEFAULT_PROPERTY_FILTERS,
} from '@/components/property-filter';
import { RentalListingCard } from '@/components/properties/rental-listing-card';
import { ListingCompareBar } from '@/components/properties/listing-compare-bar';
import { RenterAvailabilityNote } from '@/components/properties/renter-availability-note';
import { RenterPath } from '@/components/properties/renter-path';
import { buildRenterSearchPrefill, DEFAULT_RENT_FILTER_RANGE } from '@/lib/renter-search-prefill';
import { listingDetailPath } from '@/lib/public-property';
import { availabilityBadge } from '@/lib/listing-presentation';
import { cn } from '@/lib/utils';

// Dynamic load with Next.js (avoids React.lazy + webpack "reading 'call'" issues)
const PropertyFilter = dynamic(
  () => import('@/components/property-filter').then((mod) => mod.PropertyFilter),
  { ssr: false, loading: () => <div className="h-10 w-32 bg-muted animate-pulse rounded" /> }
);
const PropertySearch = dynamic(
  () => import('@/components/property-search').then((mod) => mod.PropertySearch),
  { ssr: false, loading: () => <div className="h-12 w-full max-w-md bg-muted animate-pulse rounded" /> }
);
const PropertyMap = dynamic(
  () => import('@/components/map/property-map'),
  { ssr: false, loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg" /> }
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
import { WebMCPPropertySearchTool } from '@/components/properties/webmcp-property-search-tool';

// keep your SortOption union if not importing
type LocalSortOption =
  | 'newest'
  | 'price-low'
  | 'price-high'
  | 'bedrooms'
  | 'bathrooms'
  | 'sqft';

type ListingsMobilePane = 'list' | 'map';

function listingsMobilePaneLabel(pane: ListingsMobilePane): string {
  switch (pane) {
    case 'list':
      return 'List';
    case 'map':
      return 'Map';
    default: {
      const _exhaustive: never = pane;
      return _exhaustive;
    }
  }
}

function sortOptionLabel(sortBy: LocalSortOption): string {
  switch (sortBy) {
    case 'newest':
      return 'Newest';
    case 'price-low':
      return 'Price (Low to High)';
    case 'price-high':
      return 'Price (High to Low)';
    case 'bedrooms':
      return 'Bedrooms';
    case 'bathrooms':
      return 'Bathrooms';
    case 'sqft':
      return 'Square Feet';
    default: {
      const _exhaustive: never = sortBy;
      return _exhaustive;
    }
  }
}

export default function PropertiesClient() {
  const router = useRouter();
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [showingInterestId, setShowingInterestId] = useState<string | null>(null);
  const [mobilePane, setMobilePane] = useState<ListingsMobilePane>('list');
  const [allApiProperties, setAllApiProperties] = useState<Property[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const [filters, setFilters] = useState<PropertyFilters>({
    ...DEFAULT_PROPERTY_FILTERS,
    priceRange: [DEFAULT_RENT_FILTER_RANGE[0], DEFAULT_RENT_FILTER_RANGE[1]],
  });

  const [sortBy, setSortBy] = useState<LocalSortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Deep-link support: /properties?query=... from PropertySearch fallback navigation
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const q = params.get('query')?.trim()
    const type = params.get('type')?.trim()
    const city = params.get('city')?.trim()
    const maxPriceRaw = params.get('maxPrice')?.trim() ?? params.get('maxRent')?.trim()
    if (q) setSearchQuery(q)
    if (type) {
      setFilters((prev) => ({ ...prev, propertyType: type }))
    }
    if (city) {
      setFilters((prev) => ({ ...prev, location: city }))
    }
    if (maxPriceRaw) {
      const maxPrice = Number(maxPriceRaw)
      if (Number.isFinite(maxPrice) && maxPrice > 0) {
        setFilters((prev) => ({
          ...prev,
          priceRange: [prev.priceRange[0], maxPrice],
        }))
      }
    }
  }, [])

  // 3a) Fetch from backend API
  const PROPERTIES_CACHE_TTL = 2 * 60 * 1000; // 2 minutes
  const propertiesCacheKey = cacheKeys.api.properties();

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const cached = caches.properties.get(propertiesCacheKey) as Property[] | null;
        if (Array.isArray(cached) && cached.length > 0 && retryCount === 0) {
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

    if (filters.location.trim()) {
      const loc = filters.location.trim().toLowerCase();
      filtered = filtered.filter((p) => {
        const city = p.addressParts?.city ?? '';
        const zip = p.addressParts?.zipcode ?? '';
        return (
          p.title.toLowerCase().includes(loc) ||
          p.address.toLowerCase().includes(loc) ||
          city.toLowerCase().includes(loc) ||
          zip.toLowerCase().includes(loc)
        );
      });
    }

    if (filters.minSqft !== 'any') {
      const min = Number.parseInt(filters.minSqft, 10);
      if (!Number.isNaN(min)) {
        filtered = filtered.filter((p) => p.sqft >= min);
      }
    }

    if (filters.availability === 'now' || filters.availability === 'upcoming') {
      filtered = filtered.filter(
        (p) => availabilityBadge(p.availability).tone === filters.availability,
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
      default: {
        const _exhaustive: never = sortBy;
        void _exhaustive;
        break;
      }
    }

    setProperties(filtered);
  }, [allApiProperties, filters, sortBy, searchQuery]);

  const mapProperties = useMemo(
    () =>
      properties
        .filter((p) => p.lat != null && p.lng != null)
        .map((p) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          lat: p.lat!,
          lng: p.lng!,
          image: p.image,
          type: p.type,
        })),
    [properties]
  );

  const showingInterestListing = useMemo(
    () => (showingInterestId ? properties.find((p) => p.id === showingInterestId) ?? null : null),
    [showingInterestId, properties],
  );

  const renterPrefill = useMemo(
    () =>
      buildRenterSearchPrefill({
        searchQuery,
        bedrooms: filters.bedrooms,
        bathrooms: filters.bathrooms,
        propertyType: filters.propertyType,
        priceRange: filters.priceRange,
        listingTitle: showingInterestListing?.title,
        listingAddress: showingInterestListing?.address,
      }),
    [searchQuery, filters, showingInterestListing],
  );

  const handleHighlightListing = useCallback((id: string) => {
    setHighlightedId(id);
    const el = document.getElementById(`listing-${id}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const handleOpenListing = useCallback((id: string) => {
    setHighlightedId(id);
    router.push(listingDetailPath(id));
  }, [router]);

  const handleFilterChange = useCallback((f: PropertyFilters) => {
    setFilters(f);
  }, []);

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
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
      <WebMCPPropertySearchTool />
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

      <section
        className="border-b border-border bg-card"
        aria-labelledby="properties-hero-heading"
      >
        <div className="container mx-auto px-4 py-8 md:px-6">
          <h1 id="properties-hero-heading" className="text-2xl font-bold tracking-tight md:text-3xl">
            Utah rentals on the map
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-foreground/70 md:text-base">
            Ondo-managed homes along the Wasatch Front. Match a pin to a listing, open details, or ask
            leasing to set up a showing.
          </p>
          <div className="mt-4 max-w-xl">
            <Suspense fallback={<div className="h-12 w-full max-w-md animate-pulse rounded bg-muted" />}>
              <PropertySearch onSearch={handleSearch} />
            </Suspense>
          </div>
          <div className="mt-6 max-w-4xl">
            <RenterPath />
          </div>
        </div>
      </section>

      <main className="flex-1">
        <section className="w-full py-8 md:py-10 fade-in" aria-labelledby="properties-section-heading">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 fade-in-up">
              <div>
                <h2 id="properties-section-heading" className="text-2xl font-bold tracking-tight md:text-3xl">
                  Available rentals
                </h2>
                <p
                  className={loading ? 'mt-2 text-foreground' : 'mt-2 text-foreground/80'}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {loading
                    ? 'Loading...'
                    : `${properties.length} ${properties.length === 1 ? 'home' : 'homes'} on the market`}
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row" role="group" aria-label="Property filters and sorting">
                {mapProperties.length > 0 && (
                  <div className="flex rounded-md border border-border lg:hidden" role="group" aria-label="List or map">
                    {(['list', 'map'] as const).map((pane) => (
                      <Button
                        key={pane}
                        type="button"
                        variant={mobilePane === pane ? 'default' : 'ghost'}
                        className="min-h-[44px] flex-1"
                        aria-pressed={mobilePane === pane}
                        onClick={() => setMobilePane(pane)}
                      >
                        {pane === 'list' ? (
                          <List className="mr-2 h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Map className="mr-2 h-4 w-4" aria-hidden="true" />
                        )}
                        {listingsMobilePaneLabel(pane)}
                      </Button>
                    ))}
                  </div>
                )}
                <div className="lg:hidden">
                  <Suspense fallback={<div className="h-10 w-32 animate-pulse rounded bg-muted" />}>
                    <PropertyFilter
                      onFilterChange={handleFilterChange}
                      initialFilters={filters}
                    />
                  </Suspense>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="min-h-[44px] justify-start sm:justify-center"
                      aria-label={`Sort properties by ${sortOptionLabel(sortBy)}`}
                    >
                      <ArrowUpDown className="mr-2 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                      <span className="truncate">
                        Sort by:{' '}
                        <span className="ml-1 font-medium">{sortOptionLabel(sortBy)}</span>
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

            <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-6">
              <div className="mb-6 hidden lg:block">
                <PropertyFilter
                  variant="sidebar"
                  onFilterChange={handleFilterChange}
                  initialFilters={filters}
                />
              </div>
              <div>
            <div className="mb-4">
              <ListingCompareBar />
            </div>

            {loading ? (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                role="status"
                aria-live="polite"
                aria-label="Loading properties"
              >
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
              <div
                className="rounded-xl border border-border bg-card px-5 py-8 text-center"
                role="alert"
              >
                <p className="font-semibold">Live listings are temporarily unavailable</p>
                <p className="mt-2 text-sm text-foreground/80">
                  {error} We are not showing example homes in their place.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Button
                    className="min-h-11"
                    onClick={() => setRetryCount((c) => c + 1)}
                  >
                    Try again
                  </Button>
                  <Button asChild variant="outline" className="min-h-11">
                    <a href="/contact">Contact leasing</a>
                  </Button>
                </div>
              </div>
            ) : properties.length > 0 ? (
              <div
                className={cn(
                  mapProperties.length > 0 &&
                    'lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,42%)] lg:items-start lg:gap-6',
                )}
              >
                <ul
                  className={cn(
                    'stagger-fade-in grid gap-4',
                    mapProperties.length > 0 ? 'grid-cols-1' : 'grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3',
                    mapProperties.length > 0 && mobilePane === 'map' && 'hidden lg:grid',
                  )}
                  aria-label="Available rental properties"
                >
                  {properties.map((property) => (
                    <li key={property.id}>
                      <RentalListingCard
                        property={property}
                        highlighted={highlightedId === property.id}
                        onHighlight={handleHighlightListing}
                        onRequestShowing={(id) => {
                          setShowingInterestId(id);
                          setHighlightedId(id);
                        }}
                      />
                    </li>
                  ))}
                </ul>
                {mapProperties.length > 0 && (
                  <div
                    className={cn(
                      'h-[min(70vh,560px)] lg:sticky lg:top-24',
                      mobilePane === 'list' && 'hidden lg:block',
                    )}
                  >
                    <PropertyMap
                      properties={mapProperties}
                      selectedPropertyId={highlightedId}
                      onPropertyClick={handleOpenListing}
                      className="h-full"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-8 flex flex-col items-center py-4" role="status" aria-live="polite">
                <p className="mb-4 text-sm text-foreground/70">No properties match your current filters.</p>
                <Button
                  onClick={() => {
                    setFilters({
                      ...DEFAULT_PROPERTY_FILTERS,
                      priceRange: [DEFAULT_RENT_FILTER_RANGE[0], DEFAULT_RENT_FILTER_RANGE[1]],
                    });
                    setSearchQuery('');
                    setShowingInterestId(null);
                  }}
                  variant="outline"
                  className="mb-6 min-h-[44px]"
                >
                  Reset filters
                </Button>
              </div>
            )}

            {!loading && (
              <div className="mt-10">
                <RenterAvailabilityNote
                  key={renterPrefill}
                  variant={error || properties.length === 0 ? 'empty' : 'browse'}
                  prefillMessage={renterPrefill}
                />
              </div>
            )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
