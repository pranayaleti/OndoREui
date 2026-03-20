import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Building2, ClipboardCheck, Shield, Wallet, Wrench } from "lucide-react"
import SEO from "@/components/seo"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageBanner } from "@/components/page-banner"
import { generateBreadcrumbJsonLd, generateServiceJsonLd } from "@/lib/seo"
import { SITE_NAME, SITE_URL } from "@/lib/site"
import ConsultationCTA from "@/components/ConsultationCTA"

export const metadata: Metadata = {
  title: "Utah Property Management | Owners & Investors | Ondo Real Estate",
  description:
    "Full-service Utah property management: tenant screening, rent collection, maintenance, owner dashboards, and transparent reporting. One team with brokerage, mortgage, and notary support.",
  keywords: [
    "Utah property management",
    "property management Lehi",
    "rental management Utah",
    "tenant screening Utah",
    "property manager Salt Lake County",
    "owner portal property management",
  ],
  alternates: {
    canonical: `${SITE_URL}/property-management/`,
  },
  openGraph: {
    title: `Utah Property Management | ${SITE_NAME}`,
    description:
      "Professional property management across Utah: leasing, screening, maintenance, and real-time visibility for owners.",
    url: `${SITE_URL}/property-management/`,
    images: [
      {
        url: `${SITE_URL}/modern-office-building.webp`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Utah property management`,
      },
    ],
  },
}

const pillars = [
  {
    icon: <ClipboardCheck className="h-8 w-8 text-primary" aria-hidden />,
    title: "Leasing & screening",
    description: "Marketing vacant units, showings, applications, and thorough tenant screening so you start with the right residents.",
  },
  {
    icon: <Wallet className="h-8 w-8 text-primary" aria-hidden />,
    title: "Rent & reporting",
    description: "Rent collection, owner statements, and clear financial reporting so you always know how the asset is performing.",
  },
  {
    icon: <Wrench className="h-8 w-8 text-primary" aria-hidden />,
    title: "Maintenance & compliance",
    description: "Coordinated repairs, vendor relationships, and documented work—plus support for Utah rental compliance expectations.",
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" aria-hidden />,
    title: "Owner & tenant experience",
    description: "Dedicated workflows for owners and tenants: fewer handoffs, faster responses, and a single partner accountable for outcomes.",
  },
]

export default function PropertyManagementPage() {
  return (
    <>
      <SEO
        title="Utah Property Management | Owners & Investors"
        description="Full-service Utah property management with leasing, screening, rent collection, maintenance, and owner visibility—alongside brokerage, mortgage, and notary under one roof."
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
        title="Property management built for Utah owners"
        subtitle="Leasing, screening, rent, maintenance, and reporting—with brokerage, loans, and notary when you need them in the same relationship."
        backgroundImage="/modern-office-building.png"
      />

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-lg text-foreground/80 leading-relaxed">
            Whether you own one door or a growing portfolio, Ondo Real Estate runs day-to-day operations so you are not juggling
            spreadsheets, vendors, and tenant messages alone. We combine property management with the rest of our real estate
            stack—so sales, refinancing, and notarized documents do not require a separate cast of vendors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
          {pillars.map(({ icon, title, description }) => (
            <Card key={title} className="border-border bg-card">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                {icon}
                <div>
                  <CardTitle className="text-xl">{title}</CardTitle>
                  <CardDescription className="text-base mt-2 text-foreground/70">{description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <section className="max-w-5xl mx-auto mb-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary shrink-0" aria-hidden />
              Why one partner for management + deals
            </h2>
            <ul className="space-y-3 text-foreground/80">
              <li>• Same team context when you buy, refinance, or sell the asset you already manage with us.</li>
              <li>• Notary and loan signing workflows available when closings and paperwork need to move fast.</li>
              <li>• Operators-focused tooling for lean teams—autopay, screening, and maintenance in one rhythm.</li>
            </ul>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button asChild>
                <Link href="/contact/">Talk to our team</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/properties/">Browse rentals</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden border border-border">
            <Image
              src="/modern-office-building.png"
              alt="Utah property management office representing Ondo Real Estate"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </section>

        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-foreground/70">
            Dig deeper: our{" "}
            <Link href="/blog/property-management-automation-checklist/" className="text-primary hover:underline font-medium">
              property management automation checklist
            </Link>{" "}
            and full company story on{" "}
            <Link href="/about/" className="text-primary hover:underline font-medium">
              About
            </Link>
            .
          </p>
        </div>

        <ConsultationCTA
          title="Get a management plan for your Utah rentals"
          description="Tell us about your units and goals—we will follow up with next steps."
        />
      </div>
    </>
  )
}
