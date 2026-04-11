"use client"

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LazyImage } from "@/components/lazy-image"
import { Heart, MapPin, Bed, Bath, Square, Phone } from "lucide-react"

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

interface ResultsListProps {
  properties: Property[]
}

export default function ResultsList({ properties }: ResultsListProps) {
  return (
    <div className="space-y-4">
      {properties.map((property) => (
        <Card key={property.id} className="group hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex gap-6">
              {/* Property Image */}
              <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-lg">
                <LazyImage
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="192px"
                />
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

              {/* Property Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <CardTitle className="text-xl leading-tight mb-1">{property.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {property.address}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      ${property.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-foreground/70">per month</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-foreground/70 mb-3">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    {property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
                    {property.sqft.toLocaleString()} sqft
                  </div>
                </div>

                <p className="text-foreground/70 mb-3 line-clamp-2">
                  {property.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {property.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}