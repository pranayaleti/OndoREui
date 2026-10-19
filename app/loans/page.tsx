import { YourContactCard } from "@/components/people/your-contact-card"
import { pageTitle, pageTitleText } from "@/lib/site"
import type { Metadata } from "next"
import { SITE_URL } from "@/lib/site"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateServiceJsonLd, FOUNDER_PERSON_ID } from "@/lib/seo"
import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, DollarSign, Shield, Users, Home, Building2, Briefcase } from "lucide-react"
import Link from "next/link"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { ServiceFaqSection } from "@/components/service-faq-section"
import { LOANS_PAGE_FAQS } from "@/lib/service-faq"

const DESCRIPTION =
  "Utah home loans explained: conventional, FHA, VA, USDA, jumbo and non-QM. Talk through which program fits your file before you shop."

export const metadata: Metadata = {
  title: pageTitle("Utah Home Loans: FHA, VA, USDA, Conventional & Jumbo"),
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/loans/`,
  },
  openGraph: {
    type: "website",
    title: pageTitleText("Utah Home Loans: FHA, VA, USDA, Conventional & Jumbo"),
    description: DESCRIPTION,
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

const whatYouGet = [
  { title: "A real conversation first", body: "We go through income, credit, assets and timeline, then say which programs may fit. No form that spits out a letter." },
  { title: "Program comparison", body: "Guidelines, documentation and cash to close side by side, not one advertised rate." },
  { title: "One contact to close", body: "The same person from the first call through underwriting and funding." },
  { title: "Tools to check the math", body: "Payment, affordability and refinance calculators you can run before you call." },
]

const loanTypes = [
  { icon: <Home className="h-7 w-7" />, title: "Conventional", href: "/loans/conventional", description: "Conforming loans from about 3% down. PMI can come off with enough equity." },
  { icon: <Shield className="h-7 w-7" />, title: "FHA", href: "/loans/fha", description: "3.5% down at 580+ under HUD policy, gift funds often allowed. Primary residence only." },
  { icon: <Users className="h-7 w-7" />, title: "VA", href: "/loans/va", description: "0% down with remaining entitlement, no monthly PMI. A funding fee may apply." },
  { icon: <DollarSign className="h-7 w-7" />, title: "USDA", href: "/loans/usda", description: "0% down on eligible rural properties, with income and map tests." },
  { icon: <Building2 className="h-7 w-7" />, title: "Jumbo", href: "/loans/jumbo", description: "Above the county conforming limit. Expect overlays on credit and reserves." },
  { icon: <Briefcase className="h-7 w-7" />, title: "Non-QM", href: "/learn/non-qm", description: "Bank-statement, DSCR and asset-depletion when tax returns undercount cash flow." },
]

export default function LoansPage() {
  return (
    <main className="min-h-screen">
      <SEO
        reviewedBy={FOUNDER_PERSON_ID}
        title="Utah Home Loans & Mortgages | Conventional, FHA, VA, USDA"
        description={DESCRIPTION}
        pathname="/loans/"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Utah Home Loans & Mortgages", url: `${SITE_URL}/loans/` },
          ]),
          generateServiceJsonLd({
            name: "Utah mortgage services",
            description: "Conventional, FHA, VA, USDA, jumbo and non-QM home loan guidance for Utah buyers.",
            serviceType: "Mortgage Lending",
            areaServed: "Utah",
          }),
        ]}
      />
      <PageBanner
        title="Home loans in Utah"
        subtitle="Find out which program fits your file before you fall for a house."
        backgroundImage="/modern-office-building.webp"
        primaryCta={{
          label: "Talk with a loan officer",
          href: "/qualify/",
          event: "page_banner_loan_inquiry",
          analyticsLabel: "loans",
        }}
      />

      <section className="bg-background py-16" aria-labelledby="loans-what-heading">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 id="loans-what-heading" className="mb-8 text-center text-3xl font-bold text-foreground">
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
            Start with the{" "}
            <Link href="/calculators/mortgage-payment/" className="font-medium text-primary underline underline-offset-4">
              payment calculator
            </Link>{" "}
            or the{" "}
            <Link href="/learn/" className="font-medium text-primary underline underline-offset-4">
              mortgage learning hub
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="border-y border-border/40 bg-muted/30 py-16" aria-labelledby="loans-programs-heading">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 id="loans-programs-heading" className="mb-3 text-center text-3xl font-bold text-foreground">
            Programs
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-foreground/70">
            Pricing is file-specific. Nothing on this page is a quote, a lock or an approval.
          </p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {loanTypes.map((loan) => (
              <Card key={loan.href} className="p-5 transition-shadow hover:shadow-lg">
                <CardHeader className="p-0">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="text-primary">{loan.icon}</div>
                    <CardTitle className="text-xl">
                      <Link href={loan.href} className="hover:text-primary">{loan.title}</Link>
                    </CardTitle>
                  </div>
                  <CardDescription className="text-foreground/70">{loan.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-foreground/70">
            Already own? See{" "}
            <Link href="/refinance/" className="font-medium text-primary underline underline-offset-4">
              refinancing
            </Link>{" "}
            and{" "}
            <Link href="/loans/heloc/" className="font-medium text-primary underline underline-offset-4">
              HELOCs
            </Link>
            .
          </p>
        </div>
      </section>

      <ServiceFaqSection id="loans-faq" faqs={LOANS_PAGE_FAQS} moreHref="/faq/loans-faqs/" moreLabel="All loan questions" />

      <div className="container mx-auto max-w-3xl px-4 pt-10">
        <LendingDisclaimer />
      </div>
      <YourContactCard kind="loan" />
    </main>
  )
}
