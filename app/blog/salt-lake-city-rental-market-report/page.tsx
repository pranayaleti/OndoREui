import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/salt-lake-city-rental-market-report"
const title = "Salt Lake City Rental Market Report: Vacancy Rates, Rents & Trends"
const description = "A data-driven look at the Salt Lake City rental market in 2026 — vacancy rates, average rents by neighborhood, and what landlords should expect."
const published = "2026-03-23"
const modified = "2026-03-23"
const author = "Ondo RE Team"
const category = "Market Data"
const image = "/modern-office-building.webp"
const keywords = [
  "Salt Lake City rental market",
  "SLC vacancy rate",
  "Salt Lake City rent trends",
  "Salt Lake City apartments 2026",
  "Utah rental market data",
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

export default function SaltLakeCityRentalMarketReport() {
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
        subtitle="What landlords and investors need to know about SLC rents in 2026."
        backgroundImage={image}
      />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Salt Lake City</Badge>
            <Badge variant="outline">Investors</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              Salt Lake City remains one of the most watched rental markets in the Mountain West. Population growth, Silicon Slopes expansion, and constrained housing supply continue to shape conditions for landlords and investors. Here is what the data shows heading into the remainder of 2026.
            </p>

            <h2>Vacancy Rates</h2>
            <p>Salt Lake County's apartment vacancy rate has hovered between 5% and 7% over the past 18 months — higher than the historic lows seen in 2021–2022, but still well below the national average of approximately 7.8%. The softening reflects a wave of new multifamily deliveries in the Downtown, Sugar House, and South Jordan submarkets. However, single-family rentals continue to experience tighter vacancy, particularly in the 3–4 bedroom segment sought by families priced out of homeownership.</p>
            <ul>
              <li><strong>Studio / 1BR:</strong> 6.5–8% vacancy — most affected by new supply</li>
              <li><strong>2BR:</strong> 5–6% vacancy — stable demand from young professionals and couples</li>
              <li><strong>3–4BR SFR:</strong> 3–4% vacancy — tightest segment in the market</li>
            </ul>

            <h2>Average Rent by Submarket</h2>
            <p>Rents in Salt Lake City vary significantly by neighborhood and property type. Current approximate averages:</p>
            <ul>
              <li><strong>Downtown SLC / Marmalade:</strong> $1,600–$2,200/mo for 1BR; $2,100–$2,900/mo for 2BR</li>
              <li><strong>Sugar House:</strong> $1,500–$1,900/mo for 1BR; $1,900–$2,500/mo for 2BR</li>
              <li><strong>East Bench / Millcreek:</strong> $1,700–$2,400/mo for 2BR; $2,400–$3,200/mo for 3BR SFR</li>
              <li><strong>West Valley City / Kearns:</strong> $1,200–$1,600/mo for 2BR — most affordable in the county</li>
              <li><strong>Holladay / Cottonwood Heights:</strong> $2,200–$3,500/mo for 3–4BR SFR — premium family submarket</li>
            </ul>
            <p>Year-over-year rent growth has moderated to approximately 1–3% in most SLC submarkets, down from double-digit growth in 2021–2022. Owners who purchased at lower basis pre-2021 remain in an excellent cash flow position; those who acquired at peak 2022 prices may be experiencing tighter margins.</p>

            <h2>Demand Drivers in 2026</h2>
            <p>Several structural factors continue to support Salt Lake City rental demand:</p>
            <ul>
              <li><strong>Silicon Slopes employment:</strong> Lehi and Draper office parks anchor high-income renter demand across the county. Major tech and fintech employers continue expanding Wasatch Front headcount.</li>
              <li><strong>University of Utah and Westminster University:</strong> Graduate and professional programs sustain demand for 1–2BR units near the east side and Sugar House.</li>
              <li><strong>Homeownership affordability gap:</strong> The median SLC home price remains above $500,000, keeping many households in the rental market longer than historically normal.</li>
              <li><strong>In-migration from California and the Pacific Northwest:</strong> Utah continues to see net positive domestic migration, adding demand particularly for larger single-family rentals.</li>
            </ul>

            <h2>New Supply Pressure</h2>
            <p>Approximately 3,500–4,500 new apartment units were delivered in Salt Lake County in 2025, with a similar pipeline expected in 2026. Most of this new supply is class A luxury in Downtown and South Jordan. Owners of class B and C properties in established neighborhoods (Millcreek, Taylorsville, Murray) face less direct competition from new supply but may see some rental compression as luxury tenants "filter down" if concessions increase at new buildings.</p>

            <h2>What This Means for Landlords</h2>
            <ul>
              <li><strong>Pricing strategy:</strong> Micro-market awareness matters more than ever. A Holladay SFR and a West Valley apartment require different pricing approaches. Use recent comps within a mile, not county-wide averages.</li>
              <li><strong>Lease timing:</strong> Utah vacancy peaks in October–February. Avoid lease expirations in this window — structure renewals to expire in April–July.</li>
              <li><strong>Tenant retention:</strong> With concessions appearing at new Class A buildings, retaining a good existing tenant with a modest below-market renewal offer is almost always more profitable than re-leasing.</li>
              <li><strong>Condition matters:</strong> Tenants in the 2026 SLC market have options. Updated kitchens, in-unit laundry, and fast maintenance response are the top differentiators in online reviews and renter decisions.</li>
            </ul>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/property-management/salt-lake-city">SLC Property Management</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/investments">Investment Opportunities</Link>
              </Button>
            </div>

            <p>Ondo RE manages rental properties across <Link href="/property-management/salt-lake-city">Salt Lake City</Link>, <Link href="/property-management/draper">Draper</Link>, <Link href="/property-management/sandy">Sandy</Link>, and surrounding communities. Our owner portal gives you real-time visibility into rent collection, vacancy, and maintenance — so you can make data-driven decisions. <Link href="/contact">Request a free rental analysis</Link> for your property.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
