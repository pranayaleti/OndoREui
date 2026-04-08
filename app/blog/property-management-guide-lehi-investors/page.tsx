import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/property-management-guide-lehi-investors"
const title = "Lehi, Utah Property Management Guide for Investors (2026)"
const description = "Everything you need to know about managing rental property in Lehi, UT — tenant profiles, pricing, legal requirements, and what a professional PM company handles for you."
const published = "2026-04-06"
const author = "Ondo RE Team"
const category = "Property Management"
const image = "/property-manager-meeting.png"
const keywords = ["property management Lehi Utah", "Lehi rental property", "Lehi UT landlord guide", "Silicon Slopes rental investment", "Lehi property manager"]

export const metadata: Metadata = {
  title: `${title} | Ondo Real Estate`,
  description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: { title: `${title} | Ondo Real Estate`, description, type: "article", publishedTime: published, authors: [author] },
}

export default function PropertyManagementGuideLehi() {
  return (
    <main className="min-h-screen">
      <SEO title={title} description={description} pathname={slug} image={`${SITE_URL}${image}`} publishedTime={published} author={author} section={category} tags={keywords} />
      <PageBanner title={title} subtitle="The Lehi rental market is one of Utah's strongest — here's how to operate in it." backgroundImage={image} />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Lehi, UT</Badge>
            <Badge variant="outline">Investors</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="lead text-xl text-foreground/70 mb-6">
              Lehi is the epicenter of Utah&apos;s tech boom. Adobe, Vivint, Podium, and over 100 startups have made it one of the state&apos;s fastest-growing cities. That&apos;s created a rental market unlike anywhere else on the Wasatch Front — higher incomes, lower vacancy, and tenant profiles that demand a quality product. Here&apos;s what investors need to know.
            </p>

            <h2>Who Rents in Lehi?</h2>
            <p>The Lehi renter profile in 2026 is overwhelmingly tech sector. Expect:</p>
            <ul>
              <li>Household incomes of $90K–$160K (tech salaries, often dual-income)</li>
              <li>Ages 25–40, typically without children or with young kids</li>
              <li>High expectations for in-unit laundry, attached garage, and smart home features</li>
              <li>Short-to-medium term tenure (18–30 months) before buying</li>
              <li>Pet owners at higher-than-average rates</li>
            </ul>
            <p>This means properties marketed to tech workers command a premium when presentation is right. Twilight photography, professional video walkthroughs, and updated fixtures drive above-median rents consistently.</p>

            <h2>What You Can Charge</h2>
            <p>Current Lehi rental pricing ranges (2026):</p>
            <ul>
              <li>2BR townhome (1,200 sqft): $1,700–$2,100/mo</li>
              <li>3BR single-family (1,800 sqft): $2,100–$2,600/mo</li>
              <li>4BR single-family (2,400+ sqft): $2,600–$3,200/mo</li>
              <li>Attached garage adds: $100–$150/mo</li>
              <li>EV charger ready: $75–$100/mo</li>
            </ul>
            <p>Lehi&apos;s vacancy rate sits under 4% — one of the lowest in the state. Properly priced properties attract 10–20 qualified applications in the first week.</p>

            <h2>Utah Landlord-Tenant Law Essentials</h2>
            <p>Key requirements every Lehi landlord must know:</p>
            <ul>
              <li><strong>Security deposit limit:</strong> No statutory limit, but must be returned within 30 days of lease termination with itemized deductions.</li>
              <li><strong>Notice to enter:</strong> 24 hours minimum for non-emergency inspections.</li>
              <li><strong>Notice to vacate:</strong> 15 days for month-to-month tenancies; varies by lease term.</li>
              <li><strong>Habitability:</strong> Landlord must maintain heat, plumbing, and structural integrity. Failure allows tenant to withhold rent after proper notice.</li>
              <li><strong>Eviction process:</strong> File with Utah Third District Court. Unlawful detainer cases typically take 3–6 weeks from filing to judgment.</li>
            </ul>
            <p>Non-compliance with notice requirements is the #1 reason landlords lose eviction cases. A professional PM company tracks all notice timelines automatically.</p>

            <h2>What a Property Manager Handles</h2>
            <p>A quality Lehi property manager like Ondo RE will handle:</p>
            <ul>
              <li>Professional photography, video tour, and syndication to Zillow, Realtor.com, Apartments.com</li>
              <li>Tenant screening: credit, criminal, eviction history, income verification (3x rent standard)</li>
              <li>Lease execution with Utah-compliant forms</li>
              <li>Online rent collection with direct deposit to owner</li>
              <li>24/7 emergency maintenance coordination</li>
              <li>Annual inspections with photo documentation</li>
              <li>Owner dashboard with real-time financials</li>
              <li>Year-end statements and 1099s for tax preparation</li>
            </ul>

            <h2>Fees to Budget</h2>
            <ul>
              <li><strong>Monthly management fee:</strong> 8–10% of collected rent</li>
              <li><strong>Leasing fee (new tenant):</strong> 50–100% of first month&apos;s rent</li>
              <li><strong>Maintenance:</strong> Cost + coordination fee</li>
            </ul>
            <p>On a $2,200/mo unit: management fee = $176–$220/mo. Annual cost: ~$2,100–$2,640, plus one leasing fee at turnover. Most owners find this pays for itself via lower vacancy, better tenant quality, and avoided legal costs.</p>

            <h2>Investment Returns in Lehi</h2>
            <p>At current prices and rents:</p>
            <ul>
              <li>Gross yield: 3.5–4.5% on purchase price</li>
              <li>Net yield after management, taxes, insurance, and maintenance: 1.5–2.5%</li>
              <li>10-year appreciation assumption (4%/yr): $540K home → $799K</li>
            </ul>
            <p>Lehi is a cash-flow-neutral to slightly negative market at today&apos;s prices — but appreciation-driven total return is strong. Best suited for investors with a 5–10 year hold horizon.</p>

            <div className="not-prose mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/property-management/lehi/">Lehi Property Management</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/pricing/lehi/">Lehi Pricing Guide</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/investments/opportunities/">Investment Opportunities</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
