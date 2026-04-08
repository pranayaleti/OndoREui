"use client"

import { Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTestimonialsForCity, type Testimonial } from "@/lib/testimonials"

type CityTestimonialsProps = {
  cityName: string
  limit?: number
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {t.name.charAt(0)}
          </div>
          <div>
            <CardTitle className="text-sm">{t.name}</CardTitle>
            <CardDescription className="text-xs">
              {t.role} &bull; {t.city}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex mb-1.5">
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-current text-yellow-500" />
          ))}
        </div>
        <p className="text-sm text-foreground/70">&ldquo;{t.quote}&rdquo;</p>
      </CardContent>
    </Card>
  )
}

export function CityTestimonials({ cityName, limit = 3 }: CityTestimonialsProps) {
  const items = getTestimonialsForCity(cityName, limit)
  if (items.length === 0) return null

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">What {cityName} Clients Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((t) => (
          <TestimonialCard key={t.name + t.city} t={t} />
        ))}
      </div>
    </section>
  )
}
