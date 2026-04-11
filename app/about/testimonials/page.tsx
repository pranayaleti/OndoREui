import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Star, Quote, ThumbsUp, Award, Users, Home } from "lucide-react"

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Property Owner",
      location: "Salt Lake City, UT",
      image: "/professional-woman-smiling.png",
      rating: 5,
      text: "Ondo Real Estate has been managing my rental properties for over 3 years. Their attention to detail and tenant screening process is outstanding. My rental income has increased by 15% since they took over management.",
      propertyType: "Single Family Homes",
      yearsWithUs: "3+ years"
    },
    {
      name: "Michael Chen",
      role: "Tenant",
      location: "Lehi, UT",
      image: "/professional-man-suit.png",
      rating: 5,
      text: "The maintenance team at Ondo is incredible. Any issue I've had has been resolved within 24 hours. The online portal makes paying rent and submitting requests so easy. I've been a happy tenant for 2 years.",
      propertyType: "Apartment",
      yearsWithUs: "2 years"
    },
    {
      name: "Jennifer Martinez",
      role: "Property Owner",
      location: "Provo, UT",
      image: "/professional-woman-glasses.png",
      rating: 5,
      text: "I was hesitant to use a property management company, but Ondo has exceeded all my expectations. They handle everything professionally and I never have to worry about my investment. Highly recommended!",
      propertyType: "Townhouse",
      yearsWithUs: "1 year"
    },
    {
      name: "David Thompson",
      role: "Tenant",
      location: "Draper, UT",
      image: "/placeholder-user.jpg",
      rating: 5,
      text: "The leasing process was smooth and the team was very helpful in finding the perfect home for my family. The property is well-maintained and the management team is always responsive to our needs.",
      propertyType: "Single Family Home",
      yearsWithUs: "6 months"
    },
    {
      name: "Lisa Park",
      role: "Property Owner",
      location: "Sandy, UT",
      image: "/placeholder-user.jpg",
      rating: 5,
      text: "Ondo's financial reporting is detailed and transparent. I always know exactly what's happening with my properties. Their tenant retention rate is impressive, which means less turnover and more stable income.",
      propertyType: "Multi-family",
      yearsWithUs: "2+ years"
    },
    {
      name: "Robert Wilson",
      role: "Tenant",
      location: "Midvale, UT",
      image: "/placeholder-user.jpg",
      rating: 5,
      text: "The online system is user-friendly and the customer service is top-notch. I've lived in several rental properties over the years, and Ondo's management is by far the best I've experienced.",
      propertyType: "Apartment",
      yearsWithUs: "1.5 years"
    }
  ]

  const stats = [
    { number: "98%", label: "Tenant Satisfaction Rate", icon: <ThumbsUp className="h-8 w-8" /> },
    { number: "95%", label: "Owner Retention Rate", icon: <Award className="h-8 w-8" /> },
    { number: "500+", label: "Happy Customers", icon: <Users className="h-8 w-8" /> },
    { number: "4.9/5", label: "Average Rating", icon: <Star className="h-8 w-8" /> }
  ]

  const awards = [
    {
      title: "Best Property Management Company 2024",
      organization: "Utah Business Magazine",
      year: "2024"
    },
    {
      title: "Excellence in Customer Service",
      organization: "Utah Apartment Association",
      year: "2023"
    },
    {
      title: "Top Rated Property Management",
      organization: "Google Reviews",
      year: "2023"
    },
    {
      title: "Community Service Award",
      organization: "Salt Lake Chamber of Commerce",
      year: "2022"
    }
  ]

  return (
    <main className="min-h-screen">
      <SEO
        title="Testimonials | Ondo Real Estate"
        description="Read what our property owners and tenants say about Ondo Real Estate's property management services across Utah."
        pathname="/about/testimonials"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "About", url: `${SITE_URL}/about` },
          { name: "Testimonials", url: `${SITE_URL}/about/testimonials` },
        ])}
      />
      <PageBanner
        title="What Our Clients Say"
        subtitle="Real stories from property owners and tenants across Utah"
        backgroundImage="/modern-office-building.png"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Client Testimonials</h2>
              <p className="text-xl text-foreground/70">
                Don't just take our word for it - hear from the people we serve every day.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        <Home className="h-3 w-3 mr-1" />
                        {testimonial.propertyType}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {testimonial.yearsWithUs}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Quote className="h-6 w-6 text-gray-300 absolute -top-2 -left-2" />
                      <p className="text-foreground/70 italic pl-4">"{testimonial.text}"</p>
                    </div>
                    <p className="text-sm text-foreground/70 mt-2">{testimonial.location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Our Track Record</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-primary mb-4 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Awards & Recognition</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {awards.map((award, index) => (
                <Card key={index} className="text-center p-6">
                  <CardHeader>
                    <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <CardTitle className="text-xl">{award.title}</CardTitle>
                    <CardDescription>{award.organization}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{award.year}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-background to-card text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Experience the Difference?</h2>
            <p className="text-xl mb-8">
              Join hundreds of satisfied property owners and tenants who trust Ondo Real Estate with their real estate needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/contact">Get Started Today</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-muted dark:border-white dark:text-white dark:hover:bg-card/75"
              >
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
