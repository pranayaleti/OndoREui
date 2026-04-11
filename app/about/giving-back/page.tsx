import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_PHONE, SITE_EMAILS } from "@/lib/site"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, Users, Home, Clock, Award, Phone, Mail } from "lucide-react"

export default function GivingBackPage() {
  const initiatives = [
    {
      title: "Housing for Hope",
      description: "Providing affordable housing solutions and support for families in need throughout Utah.",
      icon: <Home className="h-6 w-6" />,
      impact: "50+ families housed",
      details: "We partner with local organizations to identify families in need and provide them with safe, affordable housing options."
    },
    {
      title: "First-Time Homebuyer Assistance",
      description: "Educational programs and financial assistance to help first-time buyers achieve homeownership.",
      icon: <Users className="h-6 w-6" />,
      impact: "200+ families helped",
      details: "Free workshops, down payment assistance programs, and mentorship for first-time homebuyers."
    },
    {
      title: "Community Development",
      description: "Supporting local community projects and neighborhood improvement initiatives.",
      icon: <Award className="h-6 w-6" />,
      impact: "15+ projects funded",
      details: "We invest in community gardens, playgrounds, and other projects that enhance neighborhood quality of life."
    },
    {
      title: "Veterans Housing Program",
      description: "Specialized housing assistance and support services for military veterans.",
      icon: <Heart className="h-6 w-6" />,
      impact: "75+ veterans served",
      details: "Dedicated programs to help veterans find suitable housing and access available benefits."
    }
  ]

  const volunteerOpportunities = [
    {
      title: "Homebuyer Education Workshops",
      description: "Help teach first-time homebuyers about the purchasing process, financing options, and homeownership responsibilities.",
      timeCommitment: "2-4 hours per month",
      skills: "Real estate knowledge, teaching experience helpful but not required"
    },
    {
      title: "Community Cleanup Events",
      description: "Join us for neighborhood cleanup and beautification projects throughout Utah communities.",
      timeCommitment: "4-6 hours per event",
      skills: "No special skills required, just a willingness to help"
    },
    {
      title: "Housing Assistance Program",
      description: "Assist families in navigating housing applications and connecting with available resources.",
      timeCommitment: "3-5 hours per week",
      skills: "Communication skills, empathy, basic computer skills"
    },
    {
      title: "Fundraising Events",
      description: "Help organize and run fundraising events to support our community initiatives.",
      timeCommitment: "5-10 hours per event",
      skills: "Event planning, marketing, or general assistance"
    }
  ]

  const partners = [
    {
      name: "Utah Food Bank",
      description: "Partnering to provide food assistance to families in our housing programs.",
      logo: "🏠"
    },
    {
      name: "Habitat for Humanity Utah",
      description: "Collaborating on affordable housing construction and renovation projects.",
      logo: "🔨"
    },
    {
      name: "Utah Veterans Association",
      description: "Supporting veterans with housing and transition assistance programs.",
      logo: "🇺🇸"
    },
    {
      name: "Salt Lake City School District",
      description: "Providing housing stability support for families with school-age children.",
      logo: "🎓"
    }
  ]

  const stats = [
    { number: "500+", label: "Families Helped" },
    { number: "$2M+", label: "Community Investment" },
    { number: "1,200+", label: "Volunteer Hours" },
    { number: "25+", label: "Community Partners" }
  ]

  return (
    <main className="min-h-screen">
      <SEO
        title="Giving Back to Our Community | Ondo Real Estate"
        description="Learn about Ondo Real Estate's community initiatives, volunteer opportunities, and commitment to giving back to Utah communities."
        pathname="/about/giving-back"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "About", url: `${SITE_URL}/about` },
          { name: "Giving Back", url: `${SITE_URL}/about/giving-back` },
        ])}
      />
      <PageBanner
        title="Giving Back to Our Community"
        subtitle="Making a positive impact in Utah communities through housing and support programs"
      />

      <section className="py-16 bg-background dark:bg-gradient-to-b dark:from-background dark:to-card">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 dark:text-foreground">Our Community Impact</h2>
              <p className="text-lg text-foreground/70 dark:text-foreground/70">
                At Ondo Real Estate, we believe that success is measured not just by our business achievements, 
                but by the positive impact we make in our communities. We're committed to giving back and 
                helping create a better Utah for everyone.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-sm text-foreground/70 dark:text-foreground/70">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center dark:text-foreground">Our Community Initiatives</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {initiatives.map((initiative, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                          {initiative.icon}
                        </div>
                        <CardTitle className="dark:text-foreground">{initiative.title}</CardTitle>
                      </div>
                      <CardDescription>{initiative.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          <span className="font-medium text-primary">{initiative.impact}</span>
                        </div>
                        <p className="text-sm text-foreground/70 dark:text-foreground/70">{initiative.details}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center dark:text-foreground">Volunteer Opportunities</h3>
              <p className="text-center text-foreground/70 dark:text-foreground/70 mb-8">
                Join us in making a difference in our community. We welcome volunteers from all backgrounds and skill levels.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {volunteerOpportunities.map((opportunity, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="dark:text-foreground">{opportunity.title}</CardTitle>
                      <CardDescription>{opportunity.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-foreground/70" />
                          <span className="text-sm font-medium">Time Commitment: {opportunity.timeCommitment}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground dark:text-gray-300">Skills Needed:</p>
                          <p className="text-sm text-foreground/70 dark:text-foreground/70">{opportunity.skills}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center dark:text-foreground">Community Partners</h3>
              <p className="text-center text-foreground/70 dark:text-foreground/70 mb-8">
                We're proud to partner with these organizations to maximize our community impact.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {partners.map((partner, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{partner.logo}</div>
                        <div>
                          <h4 className="font-semibold dark:text-foreground">{partner.name}</h4>
                          <p className="text-sm text-foreground/70 dark:text-foreground/70">{partner.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6 text-center dark:text-foreground">How You Can Help</h3>
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-lg text-foreground/70 dark:text-foreground/70 mb-6">
                  There are many ways to get involved and make a difference in our community. 
                  Whether you're interested in volunteering, donating, or learning more about our programs, we'd love to hear from you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link href="/contact">Get Involved</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href={`tel:${SITE_PHONE.replace(/[^+\\d]/g, "")}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call {SITE_PHONE}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 dark:text-foreground">Ready to Make a Difference?</h3>
              <p className="text-lg text-foreground/70 dark:text-foreground/70 mb-6">
                Join us in our mission to create positive change in Utah communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={`mailto:${SITE_EMAILS.info}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Email Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
