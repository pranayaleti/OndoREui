import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/how-to-choose-property-management-company-utah"
const title = "How to Choose a Property Management Company in Utah (2026 Guide)"
const description = "A step-by-step guide to evaluating Utah property management companies — fees, services, communication, and red flags to watch for."
const published = "2026-03-23"
const modified = "2026-03-23"
const author = "Ondo RE Team"
const category = "Property Management"
const image = "/property-manager-meeting.png"
const keywords = [
  "property management company Utah",
  "how to choose property manager",
  "best property management Utah",
  "Utah property manager fees",
  "property management services Utah",
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

export default function HowToChoosePropertyManagementCompanyUtah() {
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
        subtitle="Compare fees, services, and track records before signing a management agreement."
        backgroundImage={image}
      />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Utah</Badge>
            <Badge variant="outline">Landlords</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              Utah's rental market is one of the fastest-growing in the country — and choosing the wrong property management company can cost you months of vacancy, legal headaches, and eroded returns. This guide walks you through every question to ask before signing a management agreement.
            </p>

            <h2>Define What You Need First</h2>
            <p>Before contacting any company, be clear on your situation. A single-family rental in Draper has different needs than a 10-unit building in Provo. Write down:</p>
            <ul>
              <li>Number of units and property type (SFR, duplex, multifamily)</li>
              <li>Your hands-on comfort level (some owners want weekly updates; others want quarterly reports)</li>
              <li>Whether you need leasing, maintenance, accounting, or all three</li>
              <li>Your target rent range and vacancy tolerance</li>
            </ul>

            <h2>Understand the Fee Structure</h2>
            <p>Utah property management companies typically charge between 6% and 12% of monthly collected rent as a management fee. That range is wide — and what you get for the price varies even more. Common fees to clarify:</p>
            <ul>
              <li><strong>Management fee:</strong> Monthly percentage of rent collected (not rent due — "collected" protects you from paying on vacancy)</li>
              <li><strong>Leasing fee:</strong> Charged when a new tenant is placed, typically 50–100% of one month's rent</li>
              <li><strong>Lease renewal fee:</strong> Some companies charge $100–$300 to renew an existing tenant</li>
              <li><strong>Maintenance markup:</strong> Many companies add 10–20% to vendor invoices — ask explicitly</li>
              <li><strong>Vacancy fee:</strong> Some charge a flat fee even when the unit sits empty</li>
              <li><strong>Eviction coordination fee:</strong> Separate from legal fees, often $200–$500</li>
            </ul>
            <p>A low management fee with high leasing fees and maintenance markups often ends up more expensive than a higher flat rate. Model the true annual cost across a realistic scenario for your property.</p>

            <h2>Ask About Their Tenant Screening Process</h2>
            <p>The quality of a property manager's <Link href="/property-management/tenant-screening">tenant screening</Link> directly determines your vacancy rate, payment history, and property condition. Ask:</p>
            <ul>
              <li>What credit score threshold do they use? (650+ is a reasonable Utah baseline)</li>
              <li>Do they run eviction history checks — not just criminal?</li>
              <li>How do they verify income? (Pay stubs alone are insufficient; employer calls matter)</li>
              <li>Do they apply screening criteria consistently to all applicants? (Fair Housing compliance is required)</li>
            </ul>

            <h2>Evaluate Their Communication Standards</h2>
            <p>Poor communication is the top complaint owners have about property managers. Before signing:</p>
            <ul>
              <li>Ask how they communicate with owners — email, portal, phone, or a mix</li>
              <li>Request their average response time for owner inquiries (anything over 24 hours is a red flag)</li>
              <li>Ask how maintenance requests are handled — do tenants have a dedicated portal, or do they call a shared number?</li>
              <li>Find out if you get monthly financial statements and what they include (NOI, disbursements, ledger)</li>
            </ul>

            <h2>Check Their Utah Licensing and Compliance</h2>
            <p>In Utah, property management companies must hold a real estate broker's license unless they manage their own properties. Verify the company's license on the Utah Division of Real Estate's public database. Also confirm they carry errors and omissions (E&O) insurance and general liability coverage — you should not be exposed to claims arising from their operations.</p>

            <h2>Look at Their Technology Stack</h2>
            <p>Modern property management runs on software. A company still using spreadsheets and manual rent collection is a liability. Look for:</p>
            <ul>
              <li>Online rent collection with automatic late fee enforcement</li>
              <li>Maintenance request tracking with timestamps and resolution status</li>
              <li>Owner portal with real-time financial reporting and document access</li>
              <li>Digital lease signing and move-in/move-out inspection tools</li>
            </ul>

            <h2>Red Flags to Watch For</h2>
            <ul>
              <li>No written management agreement or a vague one that doesn't define their obligations</li>
              <li>Difficulty getting a straight answer on fee structure</li>
              <li>No verifiable references from current clients in your area</li>
              <li>Unlicensed or out-of-state management with no local presence in Utah</li>
              <li>Guaranteed rent schemes that look too good — they often come with hidden costs or below-market rents</li>
            </ul>

            <h2>Interview at Least Three Companies</h2>
            <p>Even if the first company seems perfect, comparing three gives you market-rate calibration. Ask each the same questions, note response quality, and check their current vacancy rate across their portfolio. A company with 15% vacancy across their book is struggling — regardless of what their pitch deck says.</p>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/property-management">Explore Ondo RE Property Management</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Talk to Our Team</Link>
              </Button>
            </div>

            <h2>What to Do After Choosing</h2>
            <p>Once you've selected a company, get everything in writing: management fee, leasing fee, cancellation terms, maintenance authorization limits, and communication expectations. Review the first three monthly statements carefully to ensure disbursements match your agreement. A good property manager makes your investment passive — a bad one makes it a second job.</p>

            <p>For owners along the <Link href="/property-management/salt-lake-city">Salt Lake City</Link>, <Link href="/property-management/provo">Provo</Link>, <Link href="/property-management/draper">Draper</Link>, and <Link href="/property-management/sandy">Sandy</Link> corridors, Ondo RE offers full-service property management with transparent pricing, a dedicated owner portal, and no maintenance markups. <Link href="/contact">Get a free rental analysis</Link> to see what your property should be earning.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
