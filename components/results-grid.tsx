"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LazyImage } from "@/components/lazy-image"
import { Heart, MapPin, Bed, Bath, Square } from "lucide-react"

interface Property {
  id: number
  title: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  type: string
  image: string
  description: string
  features: string[]
}

interface ResultsGridProps {
  properties: Property[]
}

export default function ResultsGrid({ properties }: ResultsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {properties.map((property) => (
        <Card key={property.id} className="group hover:shadow-lg transition-shadow duration-200">
          <div className="relative">
            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <LazyImage
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0 bg-card/80 hover:bg-card text-gray-600 hover:text-red-500 rounded-full"
              aria-label="Add to favorites"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Badge className="absolute top-2 left-2" variant="secondary">
              {property.type}
            </Badge>
          </div>

          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg leading-tight">{property.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {property.address}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  ${property.price.toLocaleString()}
                </div>
                <div className="text-sm text-foreground/70">per month</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex items-center gap-4 text-sm text-foreground/70 mb-3">
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                {property.bedrooms}
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                {property.bathrooms}
              </div>
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                {property.sqft.toLocaleString()} sqft
              </div>
            </div>

            <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
              {property.description}
            </p>

            <div className="flex flex-wrap gap-1 mb-4">
              {property.features.slice(0, 3).map((feature) => (
                <Badge key={feature} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {property.features.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{property.features.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" size="sm">
                View Details
              </Button>
              <Button variant="outline" size="sm">
                Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}