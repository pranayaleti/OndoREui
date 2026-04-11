import { memo } from "react"
import { Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LazyImage } from "@/components/lazy-image"
import { testimonials } from "@/lib/testimonials"

// Show a curated mix of roles for the landing page
const landingTestimonials = [
  testimonials.find((t) => t.role === "Tenant" && t.city === "Lehi"),
  testimonials.find((t) => t.role === "Owner" && t.city === "Draper"),
  testimonials.find((t) => t.role === "Investor" && t.city === "Salt Lake City"),
].filter(Boolean)

export const TestimonialsSection = memo(function TestimonialsSection() {
  return (
    <section className="py-16 bg-muted dark:bg-[var(--gradient-overlay)]" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4">
        <h2 id="testimonials-heading" className="text-3xl font-bold text-center mb-12 dark:text-foreground">
          What Utah clients say about Ondo RE
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {landingTestimonials.map((t) => (
            <Card key={t!.name} className="bg-card dark:bg-card">
              <CardHeader>
                <div className="flex items-center gap-4">
                  {t!.image && (
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <LazyImage
                        src={t!.image}
                        alt={`${t!.name}, ${t!.role.toLowerCase()} in ${t!.city}`}
                        fill
                        className="object-cover"
                        quality={75}
                        sizes="48px"
                      />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg dark:text-foreground">{t!.name}</CardTitle>
                    <CardDescription className="dark:text-foreground/70">
                      {t!.role} &bull; {t!.city}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {Array.from({ length: t!.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-yellow-500" />
                  ))}
                </div>
                <p className="text-foreground/70 dark:text-foreground/70">
                  &ldquo;{t!.quote}&rdquo;
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
})
