import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserCheck, Shield, FileText, Clock } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, APP_PORTAL_URL } from "@/lib/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tenant Screening Utah | Property Management | Ondo Real Estate",
  description: "Comprehensive tenant screening for Utah landlords: credit, criminal, eviction, and income verification. Fair Housing compliant. Powered by the Ondo owner portal.",
  alternates: { canonical: `${SITE_URL}/property-management/tenant-screening/` },
  openGraph: { title: "Tenant Screening Utah | Ondo Real Estate", description: "Credit, criminal, eviction, and income verification for Utah rental properties." },
  twitter: { card: "summary_large_image", title: "Tenant Screening | Ondo Real Estate", description: "Comprehensive tenant screening for Utah landlords." },
}

const checks = [
  { title: "Credit Report", description: "Full tri-merge credit report with score, payment history, collections, and debt load", icon: <FileText className="h-6 w-6" /> },
  { title: "Criminal Background", description: "National and state-level criminal background search with sex offender registry check", icon: <Shield className="h-6 w-6" /> },
  { title: "Eviction History", description: "National eviction database search covering court filings and judgments", icon: <UserCheck className="h-6 w-6" /> },
  { title: "Income Verification", description: "Employer verification, pay stub review, and bank statement analysis for 3× rent threshold", icon: <Clock className="h-6 w-6" /> },
]

export default function TenantScreeningPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Tenant Screening Utah"
        description="Comprehensive tenant screening for Utah landlords: credit, criminal, eviction, and income verification."
        pathname="/property-management/tenant-screening"
        image={`${SITE_URL}/property-manager-meeting.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Property Management", url: `${SITE_URL}/property-management` },
          { name: "Tenant Screening", url: `${SITE_URL}/property-management/tenant-screening` },
        ])}
      />
      <PageBanner title="Tenant Screening" subtitle="Protect your investment with thorough, Fair Housing-compliant tenant verification" backgroundImage="/property-manager-meeting.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Screening Matters</h2>
              <p className="text-lg text-foreground/70">
                A single bad placement can cost $8,000–15,000 in lost rent, legal fees, and turnover costs. Our systematic screening process applies consistent, documented criteria to every applicant — protecting your asset and keeping you compliant with Utah Fair Housing law.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {checks.map((c, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4 text-primary">{c.icon}</div>
                    <CardTitle>{c.title}</CardTitle>
                    <CardDescription>{c.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">How It Works</h3>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Applicant Applies Online", desc: "Prospective tenants complete a standardised application through the Ondo portal. Consent for background and credit checks is collected digitally." },
                  { step: "2", title: "Automated Screening Reports", desc: "Our system runs credit, criminal, eviction, and income checks within minutes. Results are scored against your pre-set criteria (minimum FICO, income multiple, eviction history tolerance)." },
                  { step: "3", title: "Owner Review & Decision", desc: "You review the full report in your owner dashboard. Our team flags any concerns and provides a recommendation. You make the final placement decision." },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">{s.step}</div>
                    <div>
                      <h4 className="font-semibold mb-1">{s.title}</h4>
                      <p className="text-foreground/70">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Start Screening Smarter</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg"><Link href="/property-management">Full PM Services</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href={APP_PORTAL_URL}>Owner Portal</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
