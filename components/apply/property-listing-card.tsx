"use client"

import Image from "next/image"
import { useState } from "react"
import type { PropertySummary } from "@/lib/api/applications"

interface PropertyListingCardProps {
  property: PropertySummary
  applyUrl?: string
}

export function PropertyListingCard({ property, applyUrl }: PropertyListingCardProps) {
  const [imgIdx, setImgIdx] = useState(0)
  const photos = property.photos ?? []

  return (
    <div className="bg-card dark:bg-card rounded-xl border shadow-sm overflow-hidden">
      {/* Photos */}
      {photos.length > 0 ? (
        <div className="relative h-64 bg-muted">
          <Image
            src={photos[imgIdx]?.url ?? ""}
            alt={photos[imgIdx]?.caption || property.title}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
          />
          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() => setImgIdx((i) => (i - 1 + photos.length) % photos.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
              >
                &lt;
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => setImgIdx((i) => (i + 1) % photos.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/50 text-white rounded-full w-8 h-8 flex items-center justify-center"
              >
                &gt;
              </button>
              <div className="absolute bottom-2 right-2 bg-background/60 text-white text-xs px-2 py-1 rounded-full">
                {imgIdx + 1}/{photos.length}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="h-48 bg-muted dark:bg-card flex items-center justify-center text-slate-400">
          No photos
        </div>
      )}

      {/* Details */}
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{property.title}</h2>
          <p className="text-sm text-slate-500 mt-1">{property.address}</p>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">${property.price.toLocaleString()}</p>
            <p className="text-xs text-slate-500">per month</p>
          </div>
          <div className="h-8 w-px bg-muted dark:bg-secondary" />
          <div className="flex gap-4">
            <div className="text-center">
              <p className="font-semibold">{property.bedrooms}</p>
              <p className="text-xs text-slate-500">Beds</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{property.bathrooms}</p>
              <p className="text-xs text-slate-500">Baths</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{property.sqft.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Sq Ft</p>
            </div>
          </div>
        </div>

        {property.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
            {property.description}
          </p>
        )}

        {property.amenities && (
          <div className="flex flex-wrap gap-1.5">
            {property.amenities.split(",").map((a) => (
              <span key={a} className="px-2 py-0.5 bg-muted dark:bg-card text-xs rounded-full text-slate-600 dark:text-slate-400">
                {a.trim()}
              </span>
            ))}
          </div>
        )}

        {applyUrl && (
          <a
            href={applyUrl}
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Apply Now
          </a>
        )}
      </div>
    </div>
  )
}
