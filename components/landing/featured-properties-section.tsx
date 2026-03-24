"use client"

import { useState } from "react"
import type { Property } from "@/lib/types"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LazyImage } from "@/components/lazy-image"
import dynamic from "next/dynamic"
import { Eye, EyeOff } from "lucide-react"
import { useFinancialVisibility } from "@/lib/financial-visibility"

// Lazy load the modal component (client-only to avoid chunk resolution errors)
const PropertyDetailsModal = dynamic(
  () => import("@/components/property-details-modal").then((m) => m.PropertyDetailsModal),
  { ssr: false, loading: () => null }
)

// Mock data for featured properties
const featuredProperties = [
  {
    id: 101,
    name: "Modern Downtown Apartment",
    description: "Salt Lake City, UT",
    image: "/modern-apartment-balcony.webp",
    bedrooms: 2,
    bathrooms: 2,
    price: 1850,
    shortDescription: "Luxury apartment with balcony and city views, pet-friendly with modern amenities.",
    address: "123 Downtown Ave, Salt Lake City, UT",
    logo: "/placeholder.svg?height=80&width=80",
    rating: 4.8,
    reviewCount: 24,
    phone: "(801) 555-1234",
    specialties: ["apartment", "downtown"],
    valueRanges: ["300k-500k"],
    images: [
      "/modern-apartment-balcony.webp",
      "/modern-apartment-balcony.webp",
      "/modern-apartment-balcony.webp",
    ],
    leaseTerms: "12-month minimum lease term with option to renew. $50 application fee per adult.",
    services: ["24/7 maintenance", "Package receiving", "Online rent payment", "Fitness center", "Rooftop lounge"],
    fees: "Management fee: 8% of monthly rent. Leasing fee: 50% of first month's rent.",
    availability: "Immediate",
    website: "www.downtownapartments.com",
  },
  {
    id: 102,
    name: "Family Home with Garden",
    description: "Holladay, UT",
    image: "/suburban-house-garden.webp",
    bedrooms: 3,
    bathrooms: 2.5,
    price: 2400,
    shortDescription: "Spacious family home with fenced backyard, finished basement, and 2-car garage.",
    address: "456 Garden Lane, Holladay, UT",
    logo: "/placeholder.svg?height=80&width=80",
    rating: 4.6,
    reviewCount: 18,
    phone: "(801) 555-5678",
    specialties: ["single-family", "suburban"],
    valueRanges: ["500k-750k"],
    images: [
      "/suburban-house-garden.webp",
      "/suburban-house-garden.webp",
      "/suburban-house-garden.webp",
    ],
    leaseTerms: "12-month lease. $45 application fee per adult. Security deposit equal to one month's rent.",
    services: ["Lawn maintenance", "Snow removal", "Pest control", "Annual HVAC service", "24/7 emergency support"],
    fees: "Management fee: 7% of monthly rent. Leasing fee: 75% of first month's rent.",
    availability: "Available in 30 days",
    website: "www.familyhomerentals.com",
  },
  {
    id: 103,
    name: "Modern Townhouse",
    description: "Midvale, UT",
    image: "/modern-townhouse-garage.webp",
    bedrooms: 2,
    bathrooms: 1.5,
    price: 1650,
    shortDescription: "Contemporary townhouse with attached garage, open floor plan, and community pool access.",
    address: "789 Modern Way, Midvale, UT",
    logo: "/placeholder.svg?height=80&width=80",
    rating: 4.7,
    reviewCount: 15,
    phone: "(801) 555-9012",
    specialties: ["townhouse", "modern"],
    valueRanges: ["300k-500k"],
    images: [
      "/modern-townhouse-garage.webp",
      "/modern-townhouse-garage.webp",
      "/modern-townhouse-garage.webp",
    ],
    leaseTerms: "6 or 12-month lease terms. $40 application fee. Security deposit equal to one month's rent.",
    services: ["Community pool maintenance", "Exterior maintenance", "Trash removal", "Snow removal", "HOA management"],
    fees: "Management fee: 8% of monthly rent. Leasing fee: 50% of first month's rent.",
    availability: "Immediate",
    website: "www.moderntownhomes.com",
  },
]

export function FeaturedPropertiesSection() {
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null)
  const { showValues, toggle } = useFinancialVisibility()

  const handleViewDetails = (propertyId: number) => {
    setSelectedProperty(propertyId)
  }

  const selectedPropertyData = selectedProperty
    ? featuredProperties.find((property) => property.id === selectedProperty)
    : null

  return (
    <>
    <section className="py-16 bg-muted dark:bg-[var(--gradient-overlay)]" aria-labelledby="properties-heading">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-center justify-between gap-4">
          <h2 id="properties-heading" className="text-3xl font-bold dark:text-foreground">
            Featured Utah rentals
          </h2>
          <button
            type="button"
            onClick={toggle}
            className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-foreground/70 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={showValues ? "Hide rental prices" : "Show rental prices"}
          >
            {showValues ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
            <span className="hidden sm:inline">
              {showValues ? "Hide amounts" : "Show amounts"}
            </span>
          </button>
        </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredProperties.map((property) => (
              <Card key={property.id} className="dark:bg-card" aria-label={`${property.name} - ${property.price}/month rental property`}>
                <div className="relative h-48 w-full">
                  <LazyImage
                    src={property.image || "/placeholder.svg"}
                    alt={`Photo of ${property.name} rental property located at ${property.address}`}
                    fill
                    className="object-cover"
                    quality={80}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="dark:text-foreground">{property.name}</CardTitle>
                  <CardDescription className="dark:text-foreground/70">{property.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm dark:text-foreground/70">
                      {property.bedrooms} bed • {property.bathrooms} bath
                    </span>
                    <span className="font-semibold dark:text-foreground">
                      {showValues ? `$${property.price}/mo` : "••••"}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/70 dark:text-foreground/70">{property.shortDescription}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full dark:text-foreground dark:border-border dark:hover:bg-muted"
                    onClick={() => handleViewDetails(property.id)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild className="bg-background hover:bg-muted dark:hover:bg-muted text-foreground">
              <Link href="/properties">View All Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Property Details Modal */}
      {selectedPropertyData && (
        <PropertyDetailsModal
          company={selectedPropertyData as unknown as Property}
          open={selectedProperty !== null}
          onOpenChange={() => setSelectedProperty(null)}
        />
      )}
    </>
  )
}