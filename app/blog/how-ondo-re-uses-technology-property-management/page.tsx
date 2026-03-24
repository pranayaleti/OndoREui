import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/how-ondo-re-uses-technology-property-management"
const title = "How Ondo RE Uses Technology to Manage Utah Rental Properties"
const description = "A behind-the-scenes look at how Ondo RE uses AI, real-time reporting, and automated workflows to deliver better outcomes for Utah property owners and tenants."
const published = "2026-03-23"
const modified = "2026-03-23"
const author = "Ondo RE Team"
const category = "Technology"
const image = "/modern-office-building.webp"
const keywords = [
  "Ondo RE technology",
  "property management software Utah",
  "AI property management",
  "property management automation",
  "Ondo Real Estate platform",
]

export const metadata: Metadata = {
  title: `${title} | Ondo RE`,
  description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: {
    title: `${title} | Ondo RE`,
    description,
    type: "article",
    publishedTime: published,
    modifiedTime: modified,
    authors: [author],
  },
  twitter: { card: "summary_large_image", title: `${title} | Ondo RE`, description },
}

export default function HowOndoReUsesTechnology() {
  return (
    <main className="min-h-screen">
      <SEO
        title={title}
        description={description}
        pathname={slug}
        image={`${SITE_URL}${image}`}
        publishedTime={published}
        modifiedTime={modified}
        author={author}
        section={category}
        tags={keywords}
      />
      <PageBanner
        title={title}
        subtitle="Real-time visibility, AI-powered operations, and automated workflows — all in one platform."
        backgroundImage={image}
      />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Ondo RE</Badge>
            <Badge variant="outline">Property Management</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              Traditional property management runs on phone calls, spreadsheets, and manual follow-up. Ondo RE was built differently — as a tech-forward real estate company from the ground up. Here is how our platform delivers better outcomes for Utah property owners and their tenants.
            </p>

            <h2>The Owner Portal: Real-Time Visibility</h2>
            <p>Most property management companies send monthly PDF statements — often weeks after the reporting period. Ondo RE's owner portal gives property owners real-time access to:</p>
            <ul>
              <li><strong>Rent collection status:</strong> See every payment the moment it is received or flagged as late</li>
              <li><strong>Maintenance requests:</strong> Every open and closed ticket, with vendor assignment, status updates, and invoice documentation</li>
              <li><strong>Financial reporting:</strong> Net operating income, disbursements, and ledger history — updated in real time, not monthly</li>
              <li><strong>Document vault:</strong> Lease agreements, inspection reports, and vendor invoices stored and searchable</li>
              <li><strong>Tenant communications:</strong> A record of every message between management and tenants, visible to owners</li>
            </ul>
            <p>Owners who want less involvement can set notification preferences and check in quarterly. Those who want full visibility can monitor every transaction as it happens.</p>

            <h2>The Tenant Portal: Reducing Friction</h2>
            <p>Tenant satisfaction is directly correlated with how easy you make it for them to pay rent and submit maintenance requests. Our tenant portal gives renters:</p>
            <ul>
              <li><strong>Online rent payment:</strong> ACH, debit, and credit card payments with automatic late fee enforcement</li>
              <li><strong>Maintenance requests:</strong> Submit, track, and receive updates on every request through the portal — with photo attachment support</li>
              <li><strong>Document access:</strong> View and download lease agreements, move-in inspection reports, and payment history</li>
              <li><strong>Communication history:</strong> A shared message thread with the management team that never gets lost in someone's email inbox</li>
            </ul>
            <p>Tenants who can easily pay rent and submit maintenance online renew at higher rates. That is not a coincidence — reducing friction reduces friction-related frustration, which is a primary driver of non-renewal decisions.</p>

            <h2>AI-Powered Property Operations</h2>
            <p>Ondo RE integrates Claude (Anthropic's AI) directly into our operations platform. This is not a chatbot — it is a system that actively assists our team in delivering better outcomes:</p>
            <ul>
              <li><strong>Maintenance routing:</strong> The AI reviews incoming maintenance requests, assesses urgency, and suggests vendor assignment based on issue type, location, and vendor performance history</li>
              <li><strong>Lease review:</strong> AI-assisted lease review flags non-standard clauses, missing required Utah disclosures, and potential compliance issues before a lease is executed</li>
              <li><strong>At-risk tenant identification:</strong> The system monitors payment patterns, maintenance request frequency, and communication sentiment to flag tenants who may be struggling — before a late payment becomes a non-payment crisis</li>
              <li><strong>Market pricing:</strong> AI-powered rent analysis pulls comparable rental data to recommend optimal pricing at lease renewal or vacancy</li>
            </ul>

            <h2>Automated Workflows That Replace Manual Follow-Up</h2>
            <p>Manual processes create gaps. Automated workflows close them:</p>
            <ul>
              <li><strong>Rent reminder sequence:</strong> Automated reminders sent 3 days before rent is due, then at due date, then at each day past due — with escalating urgency and automatic late fee calculation</li>
              <li><strong>Maintenance dispatch:</strong> When a request is submitted, the system automatically notifies the assigned vendor, tracks response time against SLAs, and escalates if no response is received within the expected window</li>
              <li><strong>Lease renewal pipeline:</strong> 90 days before lease expiration, the system initiates the renewal workflow — market analysis, owner notification, tenant outreach, and counter-offer generation</li>
              <li><strong>Move-out procedures:</strong> Automated checklists for scheduling the final inspection, returning the security deposit within Utah's 30-day window, and listing the unit for re-leasing</li>
            </ul>

            <h2>Vendor Management and Cost Control</h2>
            <p>Ondo RE maintains a vetted vendor network across the Wasatch Front — licensed, insured, and price-compared. Our platform tracks vendor performance on response time, completion rate, and owner/tenant satisfaction. Underperforming vendors are removed from the active pool. We do not mark up vendor invoices — every invoice is passed through at cost, visible in the owner portal.</p>

            <h2>What This Means in Practice</h2>
            <p>A typical Ondo RE property owner with two SFRs in Sandy and Draper experiences:</p>
            <ul>
              <li>Rent collected automatically by the 5th of each month, disbursed by the 10th</li>
              <li>Maintenance requests resolved in an average of 48–72 hours for routine issues</li>
              <li>A real-time dashboard that replaces the need to call the office for updates</li>
              <li>Annual inspection reports with photos, delivered digitally within 48 hours of the inspection</li>
            </ul>
            <p>The goal is to make owning a rental property genuinely passive — not just theoretically passive.</p>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/tour">Take a Platform Tour</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/demo">Book a Demo</Link>
              </Button>
            </div>

            <p>Ondo RE manages properties across <Link href="/property-management/salt-lake-city">Salt Lake City</Link>, <Link href="/property-management/draper">Draper</Link>, <Link href="/property-management/sandy">Sandy</Link>, <Link href="/property-management/provo">Provo</Link>, and throughout the Wasatch Front. <Link href="/contact">Get in touch</Link> to see how our technology-forward approach changes the property management experience.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
