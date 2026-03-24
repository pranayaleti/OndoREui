import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/first-time-landlord-checklist-utah"
const title = "First-Time Landlord Checklist: Setting Up a Utah Rental Property"
const description = "A complete checklist for first-time Utah landlords — legal setup, lease structure, tenant screening, move-in procedures, and ongoing management systems."
const published = "2026-03-23"
const modified = "2026-03-23"
const author = "Ondo RE Team"
const category = "Property Management"
const image = "/modern-townhouse-garage.png"
const keywords = [
  "first time landlord Utah",
  "rental property checklist",
  "how to become landlord Utah",
  "Utah landlord guide",
  "setting up rental property Utah",
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

export default function FirstTimeLandlordChecklistUtah() {
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
        subtitle="Everything you need to do before, during, and after your first tenant moves in."
        backgroundImage={image}
      />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Utah</Badge>
            <Badge variant="outline">Beginners</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              Becoming a landlord in Utah is one of the most accessible paths to building long-term wealth — but the first rental is where most mistakes happen. This checklist covers every step from legal setup to ongoing operations so you start on solid ground.
            </p>

            <h2>Before You List: Legal and Financial Setup</h2>
            <ul>
              <li><strong>Check HOA and local zoning rules:</strong> Some communities restrict rentals or require short-stay permits. Confirm your property is legally rentable before investing in prep.</li>
              <li><strong>Set up a separate bank account:</strong> Keep rental income and expenses separate from personal finances from day one. This simplifies taxes and protects you legally.</li>
              <li><strong>Get landlord insurance:</strong> Your homeowner's policy does not cover rental activity. A landlord policy (also called a dwelling fire policy) covers the structure, liability, and lost rental income during covered repairs. Expect $600–$1,200/year for a Utah SFR.</li>
              <li><strong>Consult a CPA about the tax structure:</strong> Understand how rental income is taxed, what depreciation means for your return, and whether an LLC makes sense for your situation.</li>
              <li><strong>Understand Utah landlord-tenant law:</strong> Review our <Link href="/blog/utah-landlord-tenant-law-guide">Utah Landlord-Tenant Law guide</Link> before you interact with your first applicant.</li>
            </ul>

            <h2>Prepare the Property</h2>
            <ul>
              <li>Deep clean — carpets, oven, bathrooms, windows</li>
              <li>Replace all light bulbs with LED (lower tenant maintenance requests)</li>
              <li>Check all smoke and carbon monoxide detectors (Utah requires CO detectors in properties with fuel-burning appliances)</li>
              <li>Inspect and document all appliances in writing</li>
              <li>Repair any visible damage, safety hazards, or code violations</li>
              <li>Change all door lock combinations or re-key the property</li>
              <li>Photograph every room, closet, appliance, wall, floor, and fixture — timestamp and back up these photos</li>
            </ul>

            <h2>Set the Right Rent</h2>
            <ul>
              <li>Research comparable rentals within a half-mile of your property on Zillow, Apartments.com, and Facebook Marketplace</li>
              <li>Price within 5% of market — overpricing by $100/month extends vacancy by weeks, costing you more than the difference</li>
              <li>Factor in utilities: will you cover water/sewer/trash? If so, add 8–12% to your target rent</li>
              <li>Set the security deposit — Utah has no cap; most landlords charge one month's rent</li>
            </ul>

            <h2>Screen Tenants Consistently</h2>
            <ul>
              <li>Use a written rental application with authorization to run credit and background checks</li>
              <li>Apply the same criteria to every applicant (Fair Housing compliance is not optional)</li>
              <li>Minimum thresholds to consider: credit score 650+, gross income 3× monthly rent, no prior evictions in the last 5 years</li>
              <li>Call at least two previous landlords — ask specifically about late payments, property condition, and whether they would rent to this person again</li>
              <li>Verify employment: call the employer directly, not just the number the applicant provides</li>
            </ul>
            <p>Learn more about our <Link href="/property-management/tenant-screening">tenant screening process</Link>.</p>

            <h2>Use a Utah-Specific Lease Agreement</h2>
            <ul>
              <li>Use a lease drafted for Utah — generic templates from other states may omit required disclosures or include unenforceable clauses</li>
              <li>Include: rent amount, due date, late fee structure, security deposit terms, maintenance responsibilities, pet policy, noise and guest policies, entry notice requirements</li>
              <li>Required Utah disclosures: owner/agent name and address for legal service, lead paint disclosure (pre-1978 properties), mold disclosure if applicable</li>
              <li>Have the tenant sign and date every page</li>
              <li>Provide the tenant with a copy on move-in day</li>
            </ul>

            <h2>Move-In Day Procedures</h2>
            <ul>
              <li>Walk the property with the tenant and complete a written move-in inspection form together</li>
              <li>Note every existing mark, scratch, stain, or damage item — have both parties sign</li>
              <li>Take photos again at move-in with the tenant present (or send them a photo log to confirm)</li>
              <li>Collect first month's rent and security deposit by certified check or digital payment (not cash) before handing over keys</li>
              <li>Provide tenant with emergency maintenance contact information</li>
            </ul>

            <h2>Ongoing Systems to Set Up</h2>
            <ul>
              <li><strong>Rent collection:</strong> Set up online payment — it reduces late payments dramatically and creates a digital record</li>
              <li><strong>Maintenance tracking:</strong> Use a system (even a shared email thread to start) that timestamps every request and response</li>
              <li><strong>Financial records:</strong> Track every income and expense with receipts — you will need this for your Schedule E at tax time</li>
              <li><strong>Annual inspections:</strong> Schedule an interior inspection once a year — give proper notice per Utah law (24 hours)</li>
            </ul>

            <h2>When to Hire a Property Manager</h2>
            <p>Consider professional <Link href="/property-management">property management</Link> if any of the following are true:</p>
            <ul>
              <li>You live more than 30 minutes from the property</li>
              <li>You have a demanding job that makes mid-week maintenance calls difficult</li>
              <li>You are planning to add more properties within 2–3 years</li>
              <li>You are risk-averse about legal compliance (evictions, fair housing, security deposit disputes)</li>
            </ul>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/property-management">Full-Service Property Management</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/resources/templates">Download Landlord Templates</Link>
              </Button>
            </div>

            <p>Ondo RE offers <Link href="/property-management">full-service property management</Link> across the Wasatch Front with no maintenance markups and transparent pricing. We also provide Utah-compliant <Link href="/resources/templates">landlord templates</Link> including lease agreements, move-in inspection checklists, and maintenance forms.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
