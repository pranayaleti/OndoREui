import { SITE_SOCIALS } from "@/lib/site"
import type { Metadata } from "next"
import Script from "next/script"
import { SITE_NAME, SITE_URL } from "@/lib/site"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateServiceJsonLd } from "@/lib/seo"
import { PageBanner } from "@/components/page-banner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Search, DollarSign, Shield, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import ConsultationCTA from "@/components/ConsultationCTA"
import { WebMCPMortgageTool } from "@/components/buy/webmcp-mortgage-tool"

export const metadata: Metadata = {
  title: "Buy Homes in Utah | Expert Real Estate Agents | Salt Lake City, Lehi, Provo",
  description: "Find your dream home in Utah with expert real estate agents. Browse homes for sale in Salt Lake City, Lehi, Provo, and surrounding areas. Get pre-approved for a mortgage.",
  keywords: [
    // Core
    "homes for sale Utah",
    "houses for sale Utah",
    "real estate Utah",
    "Utah real estate listings",
    // Buyer intent
    "buy house Utah",
    "Utah home buying",
    "first-time home buyer Utah",
    "down payment assistance Utah",
    "Utah closing costs",
    // Geos
    "Salt Lake City homes for sale",
    "Lehi homes for sale",
    "Provo homes for sale",
    "Orem homes for sale",
    "Sandy homes for sale",
    "Draper homes for sale",
    // Finance
    "mortgage pre-approval Utah",
    "Utah mortgage rates",
  ],
  alternates: {
    canonical: `${SITE_URL}/buy/`,
  },
  openGraph: {
    title: "Buy Homes in Utah | Expert Real Estate Agents",
    description: "Find your dream home in Utah with expert real estate agents. Browse homes for sale across the Wasatch Front.",
    url: `${SITE_URL}/buy/`,
    images: [
      {
        url: `${SITE_URL}/suburban-house-garden.png`,
        width: 1200,
        height: 630,
        alt: "Beautiful Utah home for sale",
      },
    ],
  },
}

const services = [
  {
    icon: <Search className="h-8 w-8" />,
    title: "Property Search & Discovery",
    description: "Advanced MLS search tools and personalized property recommendations based on your criteria.",
  },
  {
    icon: <DollarSign className="h-8 w-8" />,
    title: "Mortgage Pre-Approval",
    description: "Connect with trusted lenders to get pre-approved and strengthen your buying power.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Negotiation & Contracts",
    description: "Expert negotiation skills to secure the best price and terms for your new home.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Closing Support",
    description: "Complete guidance through inspections, appraisals, and closing process.",
  },
]

export default function BuyPage() {
  return (
    <>
      <WebMCPMortgageTool />
      <SEO
        title="Buy Homes in Utah | Expert Real Estate Agents"
        description="Find your dream home in Utah with expert real estate agents. Browse homes for sale across the Wasatch Front."
        pathname="/buy/"
        image={`${SITE_URL}/suburban-house-garden.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Buy Homes in Utah", url: `${SITE_URL}/buy/` },
          ]),
          generateServiceJsonLd({
            name: "Utah home buying services",
            description: "Agent-led home searches, tours, and negotiations across Utah.",
            serviceType: "Home Buying",
            areaServed: "Utah",
          }),
        ]}
      />
      <PageBanner
        title="Buy Homes in Utah"
        subtitle="Find your dream home with expert real estate agents across the Wasatch Front"
        backgroundImage="/suburban-house-garden.png"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Your Utah Home Buying Journey Starts Here</h2>
            <p className="text-xl text-foreground/70">
              Whether you're a first-time buyer or looking to upgrade, our experienced agents will guide you 
              through every step of finding and purchasing your perfect Utah home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {services.map((service, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 text-primary">{service.icon}</div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-foreground/70">{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Why Choose Our Home Buying Services?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Local Market Expertise</h4>
                    <p className="text-foreground/70">Deep knowledge of Utah neighborhoods, schools, and market trends</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Advanced Search Tools</h4>
                    <p className="text-foreground/70">Access to exclusive listings and advanced MLS search capabilities</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Negotiation Excellence</h4>
                    <p className="text-foreground/70">Proven track record of securing the best deals for our clients</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Full-Service Support</h4>
                    <p className="text-foreground/70">Complete guidance from initial search through closing and beyond</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="/modern-townhouse-garage.png"
                alt="Modern Utah townhouse for sale in Midvale featuring attached garage and contemporary design"
                fill
                className="object-cover"
                sizes="100vw"
                title="Modern Utah Townhouse for Sale - Midvale"
                aria-label="Modern Utah townhouse for sale in Midvale featuring attached garage and contemporary design"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Consultation CTA Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ConsultationCTA 
              title="Ready to Start Your Home Buying Journey?"
              description="Get personalized guidance from our Utah real estate experts. Book a free consultation to discuss your home buying goals and get expert market insights."
              variant="card"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-background to-card text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Utah Dream Home?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start your home buying journey with expert guidance and local market knowledge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-card text-primary hover:bg-muted">
              <Link href="/contact">Start Your Search</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-foreground hover:bg-card hover:text-primary">
              <Link href="/properties">Browse Listings</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Service JSON-LD + Business JSON-LD */}
      <Script id="buy-service-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': ['Service'],
          name: 'Home Buying Services',
          description: 'Expert real estate agents helping buyers find and purchase homes in Utah.',
          provider: {
            '@type': ['Organization','LocalBusiness','RealEstateAgent'],
            name: SITE_NAME,
            url: SITE_URL,
            areaServed: ['Lehi UT','Salt Lake City UT','Draper UT','Utah County'],
            sameAs: SITE_SOCIALS
          },
          areaServed: ['Lehi UT','Salt Lake City UT','Draper UT','Utah County'],
          serviceType: 'Real Estate Sales',
          offers: { '@type': 'Offer', description: 'Professional home buying representation and guidance' },
        })}
      </Script>
      <Script id="buy-business-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': ['Organization','LocalBusiness','RealEstateAgent'],
          name: SITE_NAME,
          url: SITE_URL,
          areaServed: ['Lehi UT','Salt Lake City UT','Draper UT','Utah County'],
          sameAs: SITE_SOCIALS,
          makesOffer: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Property Management' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Home Buying' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Home Selling' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Home Loans' } }
          ]
        })}
      </Script>

      {/* Centralized FAQs live on /faq */}
      <section className="py-16 bg-gradient-to-b from-background to-card text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions about buying in Utah?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Browse our dedicated Help Center for detailed FAQs on buying, financing, payments, and more.
          </p>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-card hover:text-black">
            <Link href="/faq/buying-selling-faqs">View Buying FAQs</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
