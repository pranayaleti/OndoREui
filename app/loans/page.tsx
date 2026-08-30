import { SITE_SOCIALS } from "@/lib/site"
import type { Metadata } from "next"
import { SITE_NAME, SITE_URL } from "@/lib/site"
import SEO from "@/components/seo"
import { JsonLd } from "@/components/json-ld"
import { generateBreadcrumbJsonLd, generateServiceJsonLd } from "@/lib/seo"
import { PageBanner } from "@/components/page-banner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, DollarSign, Shield, Users, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { RelatedContent } from "@/components/content/related-content"
import { NextStepCta } from "@/components/content/next-step-cta"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { IsThisRightForMe } from "@/components/content/is-this-right-for-me"

export const metadata: Metadata = {
  title: "Utah Home Loans & Mortgages | Ondo Real Estate",
  description: "Compare conventional, FHA, VA, and USDA education for Utah buyers. Talk with a loan officer. This is not a credit decision or a quote.",
  alternates: {
    canonical: `${SITE_URL}/loans/`,
  },
  openGraph: {
    title: "Utah Home Loans & Mortgages | Ondo Real Estate",
    description: "Compare conventional, FHA, VA, and USDA education for Utah buyers. Talk with a loan officer. This is not a credit decision or a quote.",
    url: `${SITE_URL}/loans/`,
    images: [
      {
        url: `${SITE_URL}/modern-office-building.png`,
        width: 1200,
        height: 630,
        alt: "Utah mortgage and loan services",
      },
    ],
  },
}

const loanTypes = [
  {
    icon: <Home className="h-8 w-8" />,
    title: "Conventional Loans",
    href: "/loans/conventional",
    description: "Conforming mortgages for borrowers who meet credit, down payment, and DTI guidelines.",
    features: ["Some products start around 3% down", "PMI can often be removed with enough equity", "Waiting for 20% vs buying sooner is a cash-and-timeline trade"],
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "FHA Loans",
    href: "/loans/fha",
    description: "Government-insured loans with lower down payment options and more flexible credit overlays, subject to MIP.",
    features: ["3.5% down at 580+ (HUD policy; overlays apply)", "Gift funds often allowed", "Primary residence"],
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "VA Loans",
    href: "/loans/va",
    description: "For eligible veterans, active-duty service members, and some surviving spouses. Zero down only with remaining entitlement.",
    features: ["0% down when eligible", "No monthly PMI", "Funding fee may apply or be waived"],
  },
  {
    icon: <DollarSign className="h-8 w-8" />,
    title: "USDA Loans",
    href: "/loans/usda",
    description: "Rural development loans for eligible properties and income limits on the USDA map.",
    features: ["0% down when eligible", "Income and map tests", "Primary residence"],
  },
  {
    icon: <DollarSign className="h-8 w-8" />,
    title: "Jumbo Loans",
    href: "/loans/jumbo",
    description: "Financing above the current FHFA conforming limit for the property county. Limits change annually.",
    features: ["Look up this year’s FHFA county table", "Investor overlays on credit and reserves", "Not a single Utah-wide dollar cap"],
  },
  {
    icon: <DollarSign className="h-8 w-8" />,
    title: "Non-QM (bank-statement, DSCR)",
    href: "/learn/non-qm",
    description: "When agency tax-return income does not match cash flow. Bank-statement, DSCR, and asset-depletion are different stacks — not a cheaper conventional shortcut.",
    features: ["Bank-statement deposit analysis", "DSCR on investment property rent", "Asset-depletion overlays"],
  },
]

export default function LoansPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Utah Home Loans & Mortgages | Conventional, FHA, VA, USDA"
        description="Compare conventional, FHA, VA, and USDA education for Utah buyers. Talk with a loan officer. This is not a credit decision."
        pathname="/loans/"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Utah Home Loans & Mortgages", url: `${SITE_URL}/loans/` },
          ]),
          generateServiceJsonLd({
            name: "Utah mortgage services",
            description: "Conventional, FHA, VA, and USDA home loans with local expertise.",
            serviceType: "Mortgage Lending",
            areaServed: "Utah",
          }),
        ]}
      />
          <PageBanner
        title="Utah Home Loans & Mortgages"
        subtitle="Compare conventional, FHA, VA, and USDA education. Then talk with a loan officer. This is not a credit decision."
        backgroundImage="/modern-office-building.png"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Match the program to the file, not a slogan</h2>
            <p className="text-xl text-foreground/70">
              Loan officers help you compare guidelines, documentation, and cash to close. Pricing is file-specific.
              Nothing on this page is a quote, a lock, or an approval.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {loanTypes.map((loan) => (
              <Card key={loan.href} className="p-6 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="text-primary mr-4">{loan.icon}</div>
                    <CardTitle className="text-xl">
                      <Link href={loan.href} className="hover:text-primary">{loan.title}</Link>
                    </CardTitle>
                  </div>
                  <CardDescription className="text-foreground/70">{loan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {loan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-foreground/70">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <IsThisRightForMe table="purchase" />

          <p className="mb-12 text-center text-foreground/70">
            Property type and payment structure still change the file:{" "}
            <Link href="/blog/manufactured-housing-adu-financing" className="text-primary underline-offset-4 hover:underline">
              manufactured housing vs ADU financing
            </Link>{" "}
            and{" "}
            <Link href="/blog/interest-only-mortgages-who-they-are-for" className="text-primary underline-offset-4 hover:underline">
              interest-only mortgages
            </Link>
            . Neither is a standard conforming shortcut.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Why Choose Our Loan Services?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Program comparison</h4>
                    <p className="text-foreground/70">Access to multiple programs so we can compare guidelines, not a single advertised rate</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Local Expertise</h4>
                    <p className="text-foreground/70">Deep understanding of Utah real estate market and local programs</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Fast Processing</h4>
                    <p className="text-foreground/70">Streamlined application process with quick pre-approvals and closings</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Personalized Service</h4>
                    <p className="text-foreground/70">Dedicated loan officer guidance throughout the entire process</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="/city-map-with-pin.png"
                alt="Utah mortgage and loan service areas map showing Salt Lake City, Lehi, Provo, Orem, Sandy, Draper and surrounding communities served by Ondo Real Estate"
                fill
                className="object-cover"
                sizes="100vw"
                title="Ondo Real Estate Utah Mortgage Service Areas"
                aria-label="Map showing Utah mortgage and loan service areas including Salt Lake City, Lehi, Provo, Orem, Sandy, Draper and surrounding communities"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <div className="container mx-auto max-w-4xl px-4 pb-8">
          <RelatedContent path="/loans" title="Education that belongs with these programs" />
          <NextStepCta path="/loans" />
          <LendingDisclaimer />
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to talk through a file?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-foreground/80">
            Start a conversation. Pre-approval is a document review, not a guarantee you will close.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/qualify">Talk with a loan officer</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/calculators">Calculate Payment</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Service JSON-LD + Business JSON-LD */}
      <JsonLd
        id="loans-service-jsonld"
        data={{
          '@context': 'https://schema.org',
          '@type': ['Service'],
          name: 'Home Loan Services',
          description: 'Utah home loans including conventional, FHA, VA, and USDA mortgages. Education first; this is not a quote.',
          provider: {
            '@type': ['Organization','LocalBusiness','RealEstateAgent'],
            name: SITE_NAME,
            url: SITE_URL,
            areaServed: ['Lehi UT','Salt Lake City UT','Draper UT','Utah County'],
            sameAs: SITE_SOCIALS
          },
          areaServed: ['Lehi UT','Salt Lake City UT','Draper UT','Utah County'],
          serviceType: 'Financial Services',
          offers: { '@type': 'Offer', description: 'Professional mortgage and home loan services' },
        }}
      />
      <JsonLd
        id="loans-business-jsonld"
        data={{
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
        }}
      />

      {/* Centralized FAQs live on /faq */}
      <section className="py-16 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions about loans or refinancing?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-foreground/70">
            Visit our Help Center for detailed FAQs on loans, payments, escrow, and assistance options.
          </p>
          <Button asChild size="lg" variant="outline">
            <Link href="/faq/loans-faqs">View Loans FAQs</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
