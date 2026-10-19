import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { ServiceFaqSection } from "@/components/service-faq-section"
import { YourContactCard } from "@/components/people/your-contact-card"
import { generateBreadcrumbJsonLd, generateServiceJsonLd, FOUNDER_PERSON_ID } from "@/lib/seo"
import { SITE_NAME, SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import {
  GROWTH_MGMT_RATE,
  GROWTH_MIN_UNITS,
  LEASING_FEE_RATE,
  PORTFOLIO_MIN_UNITS,
  STARTER_MAX_UNITS,
  STARTER_MGMT_RATE,
} from "@/lib/fee-comparison"
import { PM_PAGE_FAQS } from "@/lib/service-faq"
import { analyticsAttributes } from "@/lib/analytics"

const DESCRIPTION =
  "Utah property management on the Wasatch Front: 10% of collected rent, tenant screening, maintenance coordination and monthly owner statements."

export const metadata: Metadata = {
  title: pageTitle("Utah Property Management: Fees, Leasing & Screening"),
  description: DESCRIPTION,
  keywords: [
    "Utah property management",
    "property management Lehi",
    "rental management Utah",
    "tenant screening Utah",
    "property manager Salt Lake County",
  ],
  alternates: {
    canonical: `${SITE_URL}/property-management/`,
  },
  openGraph: {
    type: "website",
    title: pageTitleText("Utah Property Management: Fees, Leasing & Screening"),
    description: DESCRIPTION,
    url: `${SITE_URL}/property-management/`,
    images: [
      {
        url: `${SITE_URL}/modern-office-building.webp`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME}: Utah property management`,
      },
    ],
  },
}

const percent = (rate: number) => `${Math.round(rate * 100)}%`

const whatYouGet = [
  { title: "Leasing and screening", body: "Marketing, showings and screening against written criteria that apply to every applicant." },
  { title: "Rent and statements", body: "Online rent collection, direct deposit and a monthly statement with every bill attached." },
  { title: "Maintenance", body: "Tenants report issues any time. We dispatch vetted vendors, you approve anything over your threshold, and no invoice is marked up." },
  { title: "One place to see it all", body: "An owner portal with rent status, expenses, documents and occupancy." },
  { title: "Terms you can leave", body: "No setup fee and 30 days' written notice to cancel." },
]

// Same published figures as /pricing/ (lib/fee-comparison.ts), so the two pages cannot drift.
const feeSummary = [
  { name: "Starter", units: `1 to ${STARTER_MAX_UNITS} units`, price: percent(STARTER_MGMT_RATE), note: "of collected rent" },
  { name: "Growth", units: `${GROWTH_MIN_UNITS} to ${PORTFOLIO_MIN_UNITS - 1} units`, price: percent(GROWTH_MGMT_RATE), note: "of collected rent" },
  { name: "Portfolio", units: `${PORTFOLIO_MIN_UNITS}+ units`, price: "Custom", note: "quoted for your portfolio" },
]

const serviceLinks = [
  { href: "/property-management/tenant-screening/", label: "Tenant screening" },
  { href: "/property-management/maintenance-coordination/", label: "Maintenance coordination" },
  { href: "/property-management/owner-reporting/", label: "Owner reporting" },
]

export default function PropertyManagementPage() {
  return (
    <main>
      <SEO
        reviewedBy={FOUNDER_PERSON_ID}
        title="Utah Property Management | Owners & Investors"
        description={DESCRIPTION}
        pathname="/property-management/"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Property management", url: `${SITE_URL}/property-management/` },
          ]),
          generateServiceJsonLd({
            name: "Residential property management in Utah",
            description:
              "Leasing, tenant screening, rent collection, maintenance coordination, and owner reporting for Utah rental properties.",
            serviceType: "PropertyManagement",
            areaServed: "Utah",
          }),
        ]}
      />

      <PageBanner
        title="Property management for Utah owners"
        subtitle="Hand off the leasing, rent, repairs and paperwork. Keep full visibility."
        backgroundImage="/modern-office-building.webp"
        primaryCta={{
          label: "Get a free home estimate",
          href: "/whats-my-home-worth/",
          event: "page_banner_rental_analysis",
          analyticsLabel: "property-management",
        }}
      />

      <section className="bg-background py-16" aria-labelledby="pm-what-heading">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 id="pm-what-heading" className="mb-8 text-center text-3xl font-bold text-foreground">
            What you get
          </h2>
          <ul className="space-y-4">
            {whatYouGet.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <p className="text-foreground/80">
                  <span className="font-semibold text-foreground">{item.title}.</span> {item.body}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-foreground/70">
            Read more:{" "}
            {serviceLinks.map((service, i) => (
              <span key={service.href}>
                {i > 0 ? ", " : null}
                <Link
                  href={service.href}
                  className="font-medium text-primary underline underline-offset-4"
                  {...analyticsAttributes("pm_hub_service_click", "property_management", service.label.toLowerCase().replace(/\s+/g, "-"))}
                >
                  {service.label}
                </Link>
              </span>
            ))}
            .
          </p>
        </div>
      </section>

      <section className="border-y border-border/40 bg-muted/30 py-16" aria-labelledby="pm-fees-heading">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 id="pm-fees-heading" className="mb-3 text-center text-3xl font-bold text-foreground">
            What management costs
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-foreground/70">
            A percentage of the rent we collect, charged only when your tenant pays. Placing a new tenant is a
            one-time {percent(LEASING_FEE_RATE)} of the first month&rsquo;s rent.
          </p>
          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {feeSummary.map((tier) => (
              <div key={tier.name} className="rounded-lg border border-border bg-card p-5 text-center">
                <p className="font-semibold text-foreground">{tier.name}</p>
                <p className="text-sm text-foreground/70">{tier.units}</p>
                <p className="mt-3 text-3xl font-bold text-foreground">{tier.price}</p>
                <p className="text-sm text-foreground/70">{tier.note}</p>
              </div>
            ))}
          </div>
          <p className="text-center">
            <Link
              href="/pricing/"
              className="font-medium text-primary hover:underline"
              {...analyticsAttributes("pm_hub_pricing_click", "property_management", "see-full-pricing")}
            >
              See full pricing and what is included
            </Link>
          </p>
        </div>
      </section>

      <ServiceFaqSection id="pm-faq" faqs={PM_PAGE_FAQS} moreHref="/faq/owner-faqs/" moreLabel="All owner questions" />

      <YourContactCard kind="agent" />
    </main>
  )
}
