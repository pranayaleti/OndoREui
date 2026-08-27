"use client"

import { getTestimonialsForCity } from "@/lib/testimonials"
import { TestimonialCard } from "@/components/testimonials/testimonial-card"

type CityTestimonialsProps = {
  cityName: string
  limit?: number
}

export function CityTestimonials({ cityName, limit = 3 }: CityTestimonialsProps) {
  const items = getTestimonialsForCity(cityName, limit)
  if (items.length === 0) return null

  return (
    <section>
      <h2 className="mb-2 text-2xl font-bold">Example stories from {cityName}</h2>
      <p className="mb-6 text-sm text-foreground/60">
        Illustrative composites — not imported platform reviews.
      </p>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={`${item.name}-${item.city}-${item.role}`}>
            <TestimonialCard testimonial={item} />
          </li>
        ))}
      </ul>
    </section>
  )
}
