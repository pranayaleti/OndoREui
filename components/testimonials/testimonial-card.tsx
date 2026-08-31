"use client"

import { Star } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LazyImage } from "@/components/lazy-image"
import {
  TESTIMONIAL_SERVICE_LABELS,
  getTestimonialKind,
  type Testimonial,
} from "@/lib/testimonials"

type TestimonialCardProps = {
  testimonial: Testimonial
  showService?: boolean
}

export function TestimonialCard({ testimonial, showService = false }: TestimonialCardProps) {
  const { t } = useTranslation()
  const { name, role, city, quote, rating, image, service } = testimonial
  const kind = getTestimonialKind(testimonial)

  return (
    <Card className="h-full bg-card dark:bg-card">
      <CardHeader>
        <div className="flex items-center gap-4">
          {image ? (
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
              <LazyImage
                src={image}
                alt=""
                fill
                className="object-cover"
                quality={75}
                sizes="48px"
              />
            </div>
          ) : (
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary"
              aria-hidden="true"
            >
              {name.charAt(0)}
            </div>
          )}
          <div>
            <CardTitle className="text-lg dark:text-foreground">{name}</CardTitle>
            <CardDescription className="dark:text-foreground/70">
              {role} &bull; {city}
            </CardDescription>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {kind === "composite" ? (
            <Badge variant="outline" className="w-fit text-xs">
              {t("testimonialUi.compositeBadge")}
            </Badge>
          ) : null}
          {showService ? (
            <Badge variant="secondary" className="w-fit text-xs">
              {TESTIMONIAL_SERVICE_LABELS[service]}
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex" role="img" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: rating }).map((_, index) => (
            <Star key={index} className="h-4 w-4 fill-current text-primary" aria-hidden="true" />
          ))}
        </div>
        <p className="text-foreground/70 dark:text-foreground/70">&ldquo;{quote}&rdquo;</p>
      </CardContent>
    </Card>
  )
}
