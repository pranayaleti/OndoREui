import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, FileText, DollarSign, FolderOpen } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, APP_PORTAL_URL } from "@/lib/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Owner Reporting | Property Management Utah | Ondo Real Estate",
  description: "Real-time owner reporting for Utah rental properties: monthly statements, NOI tracking, maintenance history, and document vault — all in one dashboard.",
  alternates: { canonical: `${SITE_URL}/property-management/owner-reporting/` },
  openGraph: { title: "Owner Reporting | Ondo Real Estate", description: "Monthly statements, NOI tracking, and document vault for Utah rental owners." },
  twitter: { card: "summary_large_image", title: "Owner Reporting | Ondo", description: "Real-time financial and maintenance reporting for Utah rental owners." },
}

const features = [
  { title: "Monthly Statements", description: "Detailed income and expense statements delivered by the 10th — rent collected, vendor invoices, management fees, net disbursement", icon: <FileText className="h-6 w-6" /> },
  { title: "NOI Tracking", description: "Gross rent, vacancy, operating expenses, and net operating income tracked monthly with year-over-year comparison", icon: <BarChart3 className="h-6 w-6" /> },
  { title: "Disbursement History", description: "Every owner distribution logged with bank reference — downloadable for tax preparation or lender review", icon: <DollarSign className="h-6 w-6" /> },
  { title: "Document Vault", description: "Leases, inspection reports, invoices, and notices stored and searchable — access any document in seconds", icon: <FolderOpen className="h-6 w-6" /> },
]

export default function OwnerReportingPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Owner Reporting | Property Management Utah"
        description="Monthly statements, NOI tracking, and document vault for Utah rental owners."
        pathname="/property-management/owner-reporting"
        image={`${SITE_URL}/property-manager-meeting.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Property Management", url: `${SITE_URL}/property-management` },
          { name: "Owner Reporting", url: `${SITE_URL}/property-management/owner-reporting` },
        ])}
      />
      <PageBanner title="Owner Reporting" subtitle="Complete financial visibility for your Utah rental portfolio — real-time, no spreadsheets" backgroundImage="/property-manager-meeting.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Know Your Numbers, Always</h2>
              <p className="text-lg text-foreground/70">
                Most property management firms send a PDF statement once a month. We give you a live dashboard with every transaction, every document, and every maintenance event — accessible any time from any device.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {features.map((f, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4 text-primary">{f.icon}</div>
                    <CardTitle>{f.title}</CardTitle>
                    <CardDescription>{f.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">What You See in the Portal</h3>
              <ul className="space-y-3 text-foreground/70">
                <li>• <strong>Portfolio summary</strong> — total units, occupied vs vacant, total monthly rent roll, and aggregate NOI</li>
                <li>• <strong>Per-property drill-down</strong> — tenant info, lease dates, last payment, open maintenance items</li>
                <li>• <strong>Maintenance log</strong> — every request from open to closed with vendor, cost, and completion date</li>
                <li>• <strong>Year-end packet</strong> — 1099 preparation, full-year income/expense summary, and all invoices in one download</li>
              </ul>
            </div>

            <div className="text-center">
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
