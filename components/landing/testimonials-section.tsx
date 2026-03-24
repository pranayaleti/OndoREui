import { memo } from "react"
import { Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LazyImage } from "@/components/lazy-image"

export const TestimonialsSection = memo(function TestimonialsSection() {
  return (
    <section className="py-16 bg-muted dark:bg-[var(--gradient-overlay)]" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4">
        <h2 id="testimonials-heading" className="text-3xl font-bold text-center mb-12 dark:text-foreground">
          What clients say about Ondo RE
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <Card className="bg-card dark:bg-card">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <LazyImage
                    src="/professional-woman-smiling.webp"
                    alt="Sarah J., tenant"
                    fill
                    className="object-cover"
                    quality={75}
                    sizes="48px"
                  />
                </div>
                <div>
                  <CardTitle className="text-lg dark:text-foreground">Sarah J.</CardTitle>
                  <CardDescription className="dark:text-foreground/70">Tenant</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex mb-2">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
              </div>
              <p className="text-foreground/70 dark:text-foreground/70">
                "Ondo Real Estate made finding my new apartment so easy. Their team was responsive and helped me find
                exactly what I was looking for in my price range."
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card dark:bg-card">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <LazyImage
                    src="/professional-man-suit.webp"
                    alt="Michael T., property owner"
                    fill
                    className="object-cover"
                    quality={75}
                    sizes="48px"
                  />
                </div>
                <div>
                  <CardTitle className="text-lg dark:text-foreground">Michael T.</CardTitle>
                  <CardDescription className="dark:text-foreground/70">Property Owner</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex mb-2">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
              </div>
              <p className="text-foreground/70 dark:text-foreground/70">
                "Since hiring Ondo Real Estate to manage my rental properties, I've had zero stress. They handle
                everything professionally and my income has actually increased."
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card dark:bg-card">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <LazyImage
                    src="/professional-woman-glasses.webp"
                    alt="Jennifer L., tenant"
                    fill
                    className="object-cover"
                    quality={75}
                    sizes="48px"
                  />
                </div>
                <div>
                  <CardTitle className="text-lg dark:text-foreground">Jennifer L.</CardTitle>
                  <CardDescription className="dark:text-foreground/70">Tenant</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex mb-2">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <Star className="h-4 w-4 fill-current text-yellow-500" />
              </div>
              <p className="text-foreground/70 dark:text-foreground/70">
                "The maintenance service through Ondo Real Estate is outstanding. Any issue I've had has been resolved
                within 24 hours. Best property management I've experienced."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
})