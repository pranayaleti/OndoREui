import type { Metadata } from "next"
import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL, toCanonicalPageUrl } from "@/lib/page-canonical"
import { Button } from "@/components/ui/button"
import { RiskDisclosure } from "@/components/investments/risk-disclosure"

const DESCRIPTION =
  "How commercial real estate, fractional ownership and Opportunity Zones work in Utah, and what to ask before you invest. Sample deals only, no live offering."

export const metadata: Metadata = {
  alternates: { canonical: toCanonicalPageUrl("/investments") },
  title: pageTitle("Utah Commercial & Fractional Real Estate Investing"),
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    title: pageTitleText("Utah Commercial & Fractional Real Estate Investing"),
    description: DESCRIPTION,
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}

/** One page, four short sections. The old sub-pages redirect here. */
const sections = [
  {
    id: "commercial",
    title: "Commercial real estate",
    body:
      "Office, retail, industrial, multifamily, medical and self-storage. Compared with a house, commercial leases run longer, tenants are often businesses, and triple-net structures can shift operating costs to the tenant. Returns come from contractual rent plus appreciation, and both depend on the tenant, the lease and the loan.",
  },
  {
    id: "fractional",
    title: "Fractional ownership",
    body:
      "Several investors buy a property together through an LLC or SPV. A sponsor finds and underwrites the deal, investors buy membership interests, a manager runs the property, and distributions and the eventual sale follow the operating agreement. Read the offering documents and talk to an attorney and a tax professional before you commit.",
  },
  {
    id: "opportunity-zones",
    title: "Opportunity Zones",
    body:
      "Reinvest an eligible capital gain into a Qualified Opportunity Fund within 180 days to defer tax on that gain, and hold the fund investment ten years to exclude its appreciation. The 2017 designations end December 31, 2026; the July 2025 reconciliation law made the program permanent with new designations from January 1, 2027. Best for patient investors who already have a gain. As of October 2026; not tax advice.",
  },
  {
    id: "new-investors",
    title: "New to investing",
    body:
      "Start with the numbers: run a property through the cap rate, cash-on-cash and DSCR calculators, then read how management fees change the result. When you are ready, book a call and we will talk through your goals and timeline.",
  },
]

export default function InvestmentsPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Commercial & Fractional Real Estate Investing in Utah"
        description={DESCRIPTION}
        pathname="/investments"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Investments", url: `${SITE_URL}/investments` },
        ])}
      />

      <PageBanner
        title="Investing in Utah real estate"
        subtitle="How commercial, fractional and Opportunity Zone deals work, and what to ask first. Ondo has no offering open to investors today."
      />

      <section className="bg-background py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="mb-3 text-2xl font-bold text-foreground">{section.title}</h2>
                <p className="text-foreground/70">{section.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-sm text-foreground/70">
            Tools:{" "}
            <Link href="/calculators/cap-rate/" className="font-medium text-primary underline underline-offset-4">cap rate</Link>,{" "}
            <Link href="/calculators/cash-on-cash/" className="font-medium text-primary underline underline-offset-4">cash-on-cash</Link>,{" "}
            <Link href="/calculators/dscr/" className="font-medium text-primary underline underline-offset-4">DSCR</Link>. Lending side:{" "}
            <Link href="/learn/investment/" className="font-medium text-primary underline underline-offset-4">investment property loans</Link>.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/contact/">Book a call</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/investments/opportunities/">See sample deals</Link>
            </Button>
          </div>
          <div className="mt-12">
            <RiskDisclosure />
          </div>
        </div>
      </section>
    </main>
  )
}
