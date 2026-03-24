import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/property-management-fees-utah"
const title = "Property Management Fees in Utah: What to Expect and How to Compare"
const description = "A transparent breakdown of property management fees in Utah — management rates, leasing fees, maintenance markups, and how to calculate true annual cost."
const published = "2026-03-23"
const modified = "2026-03-23"
const author = "Ondo RE Team"
const category = "Property Management"
const image = "/property-manager-meeting.png"
const keywords = [
  "property management fees Utah",
  "property manager cost",
  "Utah property management pricing",
  "property management monthly fee",
  "how much does property management cost",
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

export default function PropertyManagementFeesUtah() {
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
        subtitle="Understand every fee before you sign a management agreement."
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
              Property management fees in Utah range from 6% to 12% of monthly rent — but that single number tells you almost nothing about what you will actually pay. Hidden fees, maintenance markups, and lease renewal charges can more than double the effective cost of management. Here is how to compare accurately.
            </p>

            <h2>The Monthly Management Fee</h2>
            <p>The management fee is typically expressed as a percentage of monthly <em>collected</em> rent (not rent charged). This distinction matters: "collected" means you only pay when rent actually comes in. Some agreements use "rent due" instead — which means you pay the management fee even during vacancy or non-payment months. Always clarify which basis applies.</p>
            <ul>
              <li><strong>6–8%:</strong> Common for larger portfolios (10+ units) or very high-rent properties where the dollar amount is substantial</li>
              <li><strong>8–10%:</strong> Most common range for individual single-family rentals and small multifamily in Utah</li>
              <li><strong>10–12%:</strong> Sometimes seen for lower-rent properties or more intensive management requirements</li>
              <li><strong>Flat fee ($100–$200/mo):</strong> Less common, occasionally offered for high-value properties</li>
            </ul>
            <p>On a $2,000/mo rental, the difference between 8% and 10% is $40/month — or $480/year. That adds up across a multi-property portfolio.</p>

            <h2>Leasing Fee</h2>
            <p>The leasing fee is charged every time a new tenant is placed. It compensates the manager for advertising, showing, screening, and preparing the lease. In Utah, typical leasing fees are:</p>
            <ul>
              <li>50% of one month's rent (most common)</li>
              <li>One full month's rent (higher-end or slower markets)</li>
              <li>A flat fee of $300–$600</li>
            </ul>
            <p>If you have an annual tenant turnover (common for shorter lease terms), the leasing fee adds materially to your annual cost. A 50% leasing fee on a $2,000 rental means $1,000 every time you re-tenant — equivalent to an additional 4.2% of annual gross rent on top of your management fee.</p>

            <h2>Lease Renewal Fee</h2>
            <p>Not all companies charge this, but many do: $100–$350 to prepare and execute a lease renewal with an existing tenant. Given that tenant retention is the most cost-effective vacancy strategy, this fee structure can create misaligned incentives — penalizing you for keeping good tenants. Look for companies that do not charge lease renewal fees, or charge minimal ones.</p>

            <h2>Maintenance Coordination and Markups</h2>
            <p>This is where the largest hidden cost often lives. Many Utah property management companies add a 10–20% markup to every vendor invoice they coordinate. On a $500 plumbing job, that is $50–$100 in additional cost — on top of your management fee. Over a year with normal maintenance, this can add $300–$800+ in invisible fees.</p>
            <p>Questions to ask:</p>
            <ul>
              <li>Do you mark up vendor invoices? If so, by what percentage?</li>
              <li>Do you have in-house maintenance staff? (Often cheaper, but quality varies)</li>
              <li>What is your authorization limit for repairs without owner approval? (Typically $200–$500)</li>
              <li>Can I use my own vendors?</li>
            </ul>

            <h2>Vacancy Fee</h2>
            <p>Some companies charge a reduced flat fee (often $50–$100/month) even when a unit is vacant. This is controversial — many owners consider vacancy management (aggressive marketing, quick turnovers) to be a core service that should not generate additional charges when the unit is empty. Clarify this in the contract.</p>

            <h2>Other Fees to Watch For</h2>
            <ul>
              <li><strong>Setup / onboarding fee:</strong> $200–$500 one-time charge to take over management of a property</li>
              <li><strong>Eviction coordination fee:</strong> $200–$500 per eviction, separate from court and legal fees</li>
              <li><strong>Early termination fee:</strong> Some contracts charge 1–3 months of management fees if you cancel before the contract term</li>
              <li><strong>Annual inspection fee:</strong> $75–$200 for annual property inspections (reasonable; many include this in the base fee)</li>
              <li><strong>Owner statement fee:</strong> Rare, but some charge per statement. Avoid any company that charges for financial reporting.</li>
            </ul>

            <h2>How to Calculate True Annual Cost</h2>
            <p>Build a scenario model for your specific property. Example for a $2,000/mo SFR:</p>
            <ul>
              <li>Management fee (9%): $2,160/year</li>
              <li>Leasing fee (50% of one month, 1 tenant change): $1,000</li>
              <li>Lease renewal (if charged): $200</li>
              <li>Maintenance markup (15% on $1,500 in maintenance): $225</li>
              <li><strong>True annual cost: ~$3,585 — effectively 14.9% of annual rent</strong></li>
            </ul>
            <p>Compare this to a company charging 10% with no leasing fee, no renewal fee, and no maintenance markup:</p>
            <ul>
              <li>Management fee (10%): $2,400/year</li>
              <li>No leasing fee, no renewal fee, no markup</li>
              <li><strong>True annual cost: $2,400 — effectively 10% of annual rent</strong></li>
            </ul>

            <h2>What Full-Service Management Should Include</h2>
            <p>At minimum, your management fee should cover: tenant screening, rent collection, maintenance coordination, monthly financial statements, annual inspections, and lease preparation. Anything that is not explicitly included in that list is a potential add-on fee.</p>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/property-management">Ondo RE Transparent Pricing</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Get a Free Analysis</Link>
              </Button>
            </div>

            <p>Ondo RE offers transparent, flat-percentage management with no maintenance markups and no lease renewal fees. Our owner portal gives you full visibility into every invoice and disbursement. <Link href="/contact">Request a free rental analysis</Link> and see exactly what Ondo RE management would cost for your property — compared to what you would pay elsewhere.</p>

            <p>Also read: <Link href="/blog/how-to-choose-property-management-company-utah">How to Choose a Property Management Company in Utah</Link></p>
          </div>
        </div>
      </article>
    </main>
  )
}
