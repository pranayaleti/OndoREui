import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/provo-orem-rental-market-guide"
const title = "Provo and Orem Rental Market: Student Housing and Family Rentals"
const description = "A landlord's guide to the Provo and Orem rental market — BYU and UVU demand, seasonal vacancy, rent trends, and what investors should know in 2026."
const published = "2026-03-23"
const modified = "2026-03-23"
const author = "Ondo RE Team"
const category = "Market Data"
const image = "/modern-apartment-balcony.webp"
const keywords = [
  "Provo rental market",
  "Orem rentals",
  "BYU rental property",
  "Utah County rental market",
  "Provo property management",
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

export default function ProvoOremRentalMarketGuide() {
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
        subtitle="Two distinct rental markets separated by four miles — understand both before you invest."
        backgroundImage={image}
      />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Provo</Badge>
            <Badge variant="outline">Orem</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              Provo and Orem sit four miles apart on the I-15 corridor, but they represent meaningfully different rental markets. Understanding each — and the distinct demand drivers that shape them — is essential for investors and landlords operating in Utah County.
            </p>

            <h2>Provo: The BYU Effect</h2>
            <p>Brigham Young University enrolls approximately 33,000 students, making it the dominant force in Provo's rental market. BYU's unique housing regulations — students are required to live in approved housing, and the University caps the number of students living off-campus by year — create a highly structured demand environment:</p>
            <ul>
              <li>Demand is highly seasonal: August-September lease-up is intense; January sees moderate movement as missionaries return</li>
              <li>Turnover is high — most BYU students lease for 12 months or less</li>
              <li>Properties near campus (within 1 mile) command a 10–15% rent premium</li>
              <li>BYU-approved housing standards require no alcohol on premises and quiet hours — factor this into your management approach</li>
              <li>The Church Educational System calendar creates predictable vacancy windows that experienced Provo landlords plan around</li>
            </ul>
            <p>Average rents in Provo near BYU: $700–$950/room in shared housing; $1,400–$1,900/mo for 2BR units; $1,800–$2,400/mo for 3BR family units farther from campus.</p>

            <h2>Provo Beyond BYU</h2>
            <p>Downtown Provo and the Joaquin neighborhood have seen significant investment and revitalization, attracting young professionals who work at Silicon Slopes offices and prefer urban walkability. These renters are less seasonal, stay longer, and often have higher incomes than student renters. The 1–2BR segment in the $1,500–$2,100/month range performs well here with 3–5% vacancy.</p>

            <h2>Orem: The UVU and Family Market</h2>
            <p>Utah Valley University (UVU) is Utah's largest university by enrollment — approximately 42,000 students — but its student demographic differs substantially from BYU. UVU has a high percentage of commuter students, older students, and part-time students. This means the university creates demand for affordable family housing and studios/1BR units, but the student rental intensity is lower than in Provo near BYU.</p>
            <p>Orem's rental market is more family-driven than Provo's. Key characteristics:</p>
            <ul>
              <li>Strong demand for 3–4BR single-family rentals from families priced out of homeownership</li>
              <li>Average vacancy: 3–5% for SFR; slightly higher for larger apartment complexes</li>
              <li>Average rents: $1,500–$1,900/mo for 2BR; $1,900–$2,500/mo for 3BR SFR</li>
              <li>Lower seasonal volatility than Provo — demand is more year-round</li>
              <li>Lindon and northeast Orem borders provide access to Silicon Slopes employers (Adobe's campus is nearby)</li>
            </ul>

            <h2>Tech Worker Demand Across Both Markets</h2>
            <p>Silicon Slopes has created a second demand tier across both Provo and Orem — tech workers who cannot afford or do not want to purchase but earn too much to qualify for workforce housing. This segment rents 2–3BR properties at $2,000–$3,000/month and tends to sign 12–24 month leases. Properties with high-speed internet infrastructure, dedicated home office space, and modern kitchens command premium rents from this group.</p>

            <h2>Investment Profile: Provo vs Orem</h2>
            <ul>
              <li><strong>Provo near BYU:</strong> Higher turnover, higher gross yield, more intensive management. Best for active investors comfortable with student tenants and seasonal leasing cycles.</li>
              <li><strong>Downtown Provo / Joaquin:</strong> Longer tenancies, premium rents, lower management intensity. Best for investors seeking a balanced profile.</li>
              <li><strong>Orem SFR:</strong> Most stable tenant base, moderate yield, family-quality schools. Best for long-horizon investors seeking capital preservation with positive cash flow.</li>
              <li><strong>Orem near UVU:</strong> Mixed — some student demand, more family demand. Good value-add opportunities in older housing stock.</li>
            </ul>

            <h2>Seasonal Leasing Calendar for Utah County</h2>
            <ul>
              <li><strong>January–February:</strong> Moderate activity — BYU winter semester arrivals, some family moves</li>
              <li><strong>March–April:</strong> Leasing activity begins accelerating for summer/fall</li>
              <li><strong>May–July:</strong> Peak demand — BYU spring graduation creates turnover, incoming students sign for fall</li>
              <li><strong>August–September:</strong> Highest intensity — all BYU and UVU fall arrivals simultaneously</li>
              <li><strong>October–December:</strong> Slowest period — minimal movement, focus on renewals</li>
            </ul>

            <h2>What Landlords Need to Know</h2>
            <ul>
              <li>Structure lease expirations in April–July whenever possible to maximize applicant pool</li>
              <li>Price units at market or 2–3% below — overpricing in Provo/Orem extends vacancy significantly</li>
              <li>Invest in fast internet and washer/dryer hookups — the two most-cited amenities by applicants in both markets</li>
              <li>Professional <Link href="/property-management">property management</Link> matters more in high-turnover markets like near-BYU Provo — every vacancy day costs money</li>
            </ul>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/property-management/provo">Provo Property Management</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/property-management/orem">Orem Property Management</Link>
              </Button>
            </div>

            <p>Ondo RE manages rental properties in <Link href="/property-management/provo">Provo</Link>, <Link href="/property-management/orem">Orem</Link>, and throughout Utah County. Our team understands the BYU and UVU leasing calendar, the seasonal demand patterns, and what it takes to minimize vacancy in these markets. <Link href="/contact">Request a free rental analysis</Link> for your Utah County property.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
