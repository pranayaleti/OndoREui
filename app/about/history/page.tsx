import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, TrendingUp, Award, Home, Building } from "lucide-react"

export default function HistoryPage() {
  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "Ondo Real Estate was founded with a vision to revolutionize property management in Utah.",
      icon: <Home className="h-6 w-6" />
    },
    {
      year: "2021",
      title: "First 100 Properties",
      description: "Reached our first milestone of managing 100 rental properties across the Salt Lake Valley.",
      icon: <Building className="h-6 w-6" />
    },
    {
      year: "2022",
      title: "Team Expansion",
      description: "Grew our team to 25+ dedicated professionals serving property owners and tenants.",
      icon: <Users className="h-6 w-6" />
    },
    {
      year: "2023",
      title: "500+ Properties",
      description: "Expanded our portfolio to over 500 properties with a 98% tenant satisfaction rate.",
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      year: "2024",
      title: "Industry Recognition",
      description: "Received the 'Best Property Management Company' award from Utah Business Magazine.",
      icon: <Award className="h-6 w-6" />
    }
  ]

  const values = [
    {
      title: "Integrity",
      description: "We conduct business with the highest ethical standards and transparency in all our dealings.",
      icon: "🤝"
    },
    {
      title: "Innovation",
      description: "We leverage technology and modern practices to provide efficient and effective property management.",
      icon: "💡"
    },
    {
      title: "Excellence",
      description: "We strive for excellence in every interaction, from tenant screening to property maintenance.",
      icon: "⭐"
    },
    {
      title: "Community",
      description: "We're committed to building strong communities and supporting local businesses and organizations.",
      icon: "🏘️"
    }
  ]

  return (
    <main className="min-h-screen">
      <SEO
        title="Our History | Ondo Real Estate"
        description="Explore the milestones and values that shaped Ondo Real Estate into Utah's trusted property management company."
        pathname="/about/history"
        image={`${SITE_URL}/placeholder.jpg`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "About", url: `${SITE_URL}/about` },
          { name: "History", url: `${SITE_URL}/about/history` },
        ])}
      />
      <PageBanner
        title="Our History"
        subtitle="Building trust and excellence in property management since 2020"
      />

      <section className="py-16 bg-background dark:bg-gradient-to-b dark:from-background dark:to-card">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 dark:text-foreground">Our Journey</h2>
              <p className="text-lg text-foreground/70 dark:text-foreground/70">
                From a small startup to Utah's leading property management company, we've grown by putting our clients first.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-muted dark:bg-secondary"></div>
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center text-primary font-bold text-lg">
                        {milestone.year}
                      </div>
                    </div>
                    <div className="flex-1">
                      <Card>
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 bg-muted rounded-lg flex items-center justify-center text-primary">
                              {milestone.icon}
                            </div>
                            <CardTitle className="dark:text-foreground">{milestone.title}</CardTitle>
                          </div>
                          <CardDescription className="text-base">{milestone.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 mb-12">
              <h3 className="text-2xl font-bold mb-8 dark:text-foreground text-center">Our Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <div className="text-4xl mb-4">{value.icon}</div>
                      <CardTitle className="dark:text-foreground">{value.title}</CardTitle>
                      <CardDescription>{value.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-muted dark:bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6 dark:text-foreground text-center">Our Mission</h3>
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-lg text-foreground/70 dark:text-foreground/70 mb-6">
                  "To provide exceptional property management services that maximize returns for property owners 
                  while creating positive rental experiences for tenants. We believe in building long-term 
                  relationships based on trust, transparency, and outstanding service."
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary dark:text-primary">500+</div>
                    <div className="text-foreground/70 dark:text-foreground/70">Properties Managed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary dark:text-primary">98%</div>
                    <div className="text-foreground/70 dark:text-foreground/70">Tenant Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary dark:text-primary">4+</div>
                    <div className="text-foreground/70 dark:text-foreground/70">Years of Excellence</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 dark:text-foreground">Join Our Story</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/about/careers">View Career Opportunities</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Partner with Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
