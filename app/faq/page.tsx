import Link from "next/link"
import type { ReactNode } from "react"
import { AlertCircle, DollarSign, Home, Building2, AlertTriangle, CheckCircle, ChevronRight, FileText } from "lucide-react"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_EMAILS, pageTitle } from "@/lib/site"
import type { Metadata } from "next"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

export const metadata: Metadata = pageCanonicalMetadata("/faq/", {
  title: pageTitle("FAQs | Property Management & Rentals | Ondo Real Estate"),
  description: "Find answers to common questions about our property management services and renting with Ondo Real Estate.",
})


interface FAQTile {
  id: string
  name: string
  description: string
  path: string
  icon: ReactNode
  audience: string
}

const faqTiles: FAQTile[] = [
  {
    id: "getting-started",
    name: "General FAQs & Getting Started",
    description: "Start here for the most common questions about Ondo Real Estate and how everything works.",
    path: "/faq/general-faqs",
    icon: <AlertCircle className="h-7 w-7" />,
    audience: "All visitors",
  },
  {
    id: "tenants",
    name: "Tenant FAQs",
    description: "Applications, leases, payments, and maintenance information for renters.",
    path: "/faq/tenant-faqs",
    icon: <Home className="h-7 w-7" />,
    audience: "Tenants",
  },
  {
    id: "owners",
    name: "Owner FAQs",
    description: "Management, reporting, fees, and performance insights for property owners.",
    path: "/faq/owner-faqs",
    icon: <Building2 className="h-7 w-7" />,
    audience: "Owners",
  },
  {
    id: "payments",
    name: "Payments & Billing",
    description: "Rent, autopay, due dates, fees, and how online payments work.",
    path: "/faq/payments-faqs",
    icon: <DollarSign className="h-7 w-7" />,
    audience: "Tenants & owners",
  },
  {
    id: "loans",
    name: "Loans & Financing",
    description: "Mortgage pre-approval, down payments, credit scores, and loan program options explained.",
    path: "/faq/loans-faqs",
    icon: <DollarSign className="h-7 w-7" />,
    audience: "Buyers & homeowners",
  },
  {
    id: "buying-selling",
    name: "Buying & Selling",
    description: "Home buying process, selling strategy, rent vs buy, and Utah market insights.",
    path: "/faq/buying-selling-faqs",
    icon: <Home className="h-7 w-7" />,
    audience: "Buyers & sellers",
  },
  {
    id: "notary",
    name: "Notary & Closings",
    description: "Remote Online Notarization (RON), document signing, and what to expect.",
    path: "/faq/notary-faqs",
    icon: <FileText className="h-7 w-7" />,
    audience: "All clients",
  },
  {
    id: "escrow",
    name: "Escrow, Taxes & Insurance",
    description: "How escrow accounts work, what’s included, and how changes are handled.",
    path: "/faq/escrow-faqs",
    icon: <CheckCircle className="h-7 w-7" />,
    audience: "Homeowners",
  },
  {
    id: "loan-payoffs",
    name: "Loan Payoffs & Closings",
    description: "Who issues a mortgage payoff quote and what happens after a payoff. Starts with your servicer.",
    path: "/faq/loan-payoffs-faqs",
    icon: <Building2 className="h-7 w-7" />,
    audience: "Homeowners",
  },
  {
    id: "disaster",
    name: "Disaster & Emergency Help",
    description: "What to do after a disaster and who to call.",
    path: "/faq/disaster-faqs",
    icon: <AlertTriangle className="h-7 w-7" />,
    audience: "Tenants & owners",
  },
  {
    id: "hardship",
    name: "Hardship & Assistance Options",
    description: "If you are behind on your mortgage, where to get free help and who to call first.",
    path: "/faq/hardship-faqs",
    icon: <CheckCircle className="h-7 w-7" />,
    audience: "Tenants & owners",
  },
]

export default function FAQPage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "FAQ", url: `${SITE_URL}/faq` },
  ])

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="FAQs | Property Management & Rentals"
        description="Find answers to common questions about our property management services and renting with Ondo Real Estate."
        pathname="/faq"
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        jsonLd={[breadcrumbJsonLd]}
      />
      <PageBanner
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about our property management and rental services"
      />

      <main className="flex-1 py-12 bg-gradient-to-b from-background to-card">
        <div className="container px-4 md:px-6">
          {/* FAQ tiles modeled after calculators page */}
          <section className="mb-16">
            <div className="mb-10 text-center space-y-3">
              <span className="inline-flex items-center rounded-full border border-accent-1/30 bg-accent-1/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-2">
                Help &amp; Education
              </span>
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  Find the right FAQ in a few clicks
                </h2>
                <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                  Browse FAQ collections by topic. Click a card to jump into a dedicated page with detailed answers and step-by-step guidance.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {faqTiles.map((tile, index) => (
                <div
                  key={tile.id}
                  className="animate-fade-in-up animate-fill-both"
                  style={{ animationDelay: `${Math.min(index * 0.07, 0.7)}s` }}
                >
                  <Link href={tile.path} className="block group h-full">
                    <div className="relative h-full rounded-2xl backdrop-blur-lg border border-border bg-card/60 p-6 overflow-hidden transition-all duration-500 hover:border-accent-1/50 hover:bg-card/80 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)]">
                      {/* Glow border like calculators page */}
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-1 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Audience badge */}
                      <div className="absolute top-4 right-4">
                        <span className="text-xs font-semibold bg-accent-1/20 text-accent-2 px-3 py-1 rounded-full border border-accent-1/30 backdrop-blur-sm">
                          {tile.audience}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className="mb-6 relative">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-1 to-accent-2 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-all duration-300">
                          {tile.icon}
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {tile.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                        {tile.description}
                      </p>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-accent-1 group-hover:text-accent-2 font-semibold text-sm transition-colors">
                        <span>Open FAQ page</span>
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <div className="mt-16 text-center">
            <div className="bg-muted/20 rounded-lg p-8 md:p-12 border border-border">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Have another question?
              </h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Our team is here to help. Send us an email or contact us directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`mailto:${SITE_EMAILS.info}`}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:opacity-90 transition-colors duration-200"
                >
                  Send us an email
                </a>
                <a
                  href="/contact/"
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary bg-background hover:bg-muted transition-colors duration-200"
                >
                  Contact us
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer rendered globally in RootLayout */}
    </div>
  )
}
