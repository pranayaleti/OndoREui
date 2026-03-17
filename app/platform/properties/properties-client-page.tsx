"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LazyImage } from "@/components/lazy-image"
import { useOfflineStatus } from "@/hooks/use-offline-status"
import { fetchProperties, getLastViewedProperties } from "@/lib/api/properties"
import type { PropertyFilters, PropertySummary } from "@/lib/api/types"

export function PropertiesClientPage() {
  const [properties, setProperties] = useState<PropertySummary[]>([])
  const [lastViewed, setLastViewed] = useState<PropertySummary[]>([])
  const [filters, setFilters] = useState<PropertyFilters>({
    minPrice: 1000,
    maxPrice: 5000,
    bedrooms: undefined,
    propertyType: "any",
    location: "",
  })
  const { isOffline } = useOfflineStatus()

  useEffect(() => {
    void fetchProperties(filters).then(setProperties)
  }, [filters])

  useEffect(() => {
    void getLastViewedProperties().then(setLastViewed)
  }, [])

  const selectedType = useMemo(() => filters.propertyType ?? "any", [filters.propertyType])

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Property Listings</h1>
        <p className="text-foreground/70">
          Explore listings with advanced filters and instant mode switch between grid and map.
        </p>
        {isOffline ? (
          <p className="text-sm text-amber-500">Offline mode: showing cached and fallback property data.</p>
        ) : null}
      </header>

      <section className="rounded-lg border p-4">
        <h2 className="mb-4 text-lg font-medium">Advanced Filters</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="min-price">Min Price</Label>
            <Input
              id="min-price"
              type="number"
              value={filters.minPrice ?? ""}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, minPrice: Number(event.target.value) || undefined }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-price">Max Price</Label>
            <Input
              id="max-price"
              type="number"
              value={filters.maxPrice ?? ""}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, maxPrice: Number(event.target.value) || undefined }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              min={0}
              value={filters.bedrooms ?? ""}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, bedrooms: Number(event.target.value) || undefined }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Property Type</Label>
            <Select
              value={selectedType}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  propertyType: value as PropertyFilters["propertyType"],
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Salt Lake City"
              value={filters.location ?? ""}
              onChange={(event) => setFilters((prev) => ({ ...prev, location: event.target.value }))}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((property) => (
          <Card key={property.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{property.title}</CardTitle>
              <CardDescription>{property.location}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-4">
              <LazyImage
                src={property.image}
                alt={property.title}
                width={480}
                height={280}
                className="h-40 w-full overflow-hidden rounded-md object-cover"
              />
              <div className="space-y-1 text-sm text-foreground/80">
                <p>${property.price.toLocaleString()} / month</p>
                <p>{property.bedrooms} bedrooms</p>
                <p>{property.propertyType}</p>
              </div>
              <Button asChild>
                <Link href={`/platform/properties/${property.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      {lastViewed.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Last Viewed (Offline Available)</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {lastViewed.map((property) => (
              <Card key={`last-viewed-${property.id}`}>
                <CardHeader>
                  <CardTitle className="text-base">{property.title}</CardTitle>
                  <CardDescription>{property.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild>
                    <Link href={`/platform/properties/${property.id}`}>Open</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
