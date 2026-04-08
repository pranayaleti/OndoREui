import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/renting-vs-buying-salt-lake-city"
const title = "Renting vs. Buying in Salt Lake City (2026 Analysis)"
const description = "Should you rent or buy in Salt Lake City right now? A data-driven breakdown covering break-even timeline, total cost of ownership, and neighborhood-level analysis."
const published = "2026-04-06"
const author = "Ondo RE Team"
const category = "Finance"
const image = "/city-map-with-pin.png"
const keywords = ["renting vs buying Salt Lake City", "SLC rent or buy 2026", "Salt Lake City housing market", "buy a home SLC", "rent Salt Lake City"]

export const metadata: Metadata = {
  title: `${title} | Ondo Real Estate`,
  description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: { title: `${title} | Ondo Real Estate`, description, type: "article", publishedTime: published, authors: [author] },
}

export default function RentingVsBuyingSLC() {
  return (
    <main className="min-h-screen">
      <SEO title={title} description={description} pathname={slug} image={`${SITE_URL}${image}`} publishedTime={published} author={author} section={category} tags={keywords} />
      <PageBanner title={title} subtitle="The honest math behind one of Salt Lake City's biggest financial decisions." backgroundImage={image} />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Salt Lake City</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="lead text-xl text-foreground/70 mb-6">
              Salt Lake City&apos;s housing market has cooled from its 2021–2022 peak, but home prices remain elevated. With mortgage rates still above 6%, many households are genuinely uncertain: is it smarter to rent or buy right now? Here&apos;s the honest breakdown.
            </p>

            <h2>The Numbers: Rent vs. Buy in SLC Today</h2>
            <p>Let&apos;s use the SLC median home price of $510,000 with 20% down ($102,000) and a 30-year fixed rate of 6.75%:</p>
            <ul>
              <li><strong>Monthly mortgage P&I:</strong> $2,650</li>
              <li><strong>Property taxes:</strong> ~$215/mo</li>
              <li><strong>Insurance:</strong> ~$120/mo</li>
              <li><strong>HOA (if applicable):</strong> $0–$400/mo</li>
              <li><strong>Maintenance reserve (1% of value/yr):</strong> ~$425/mo</li>
              <li><strong>Total monthly cost of ownership:</strong> ~$3,410–$3,810/mo</li>
            </ul>
            <p>Median rent for a comparable 3-bedroom SLC home: $1,850–$2,200/mo. The gap is real. You&apos;re paying $1,200–$1,600 more per month to own — on pure cash flow.</p>

            <h2>When Buying Makes Sense</h2>
            <p>The buy argument improves dramatically over time due to three forces:</p>
            <ol>
              <li><strong>Equity build:</strong> $2,650/mo mortgage includes ~$850 in principal paydown in year 1, growing each year.</li>
              <li><strong>Appreciation:</strong> SLC has averaged 4–6% annual appreciation over 10-year periods. At 4%: your $510K home is worth $755K in 10 years.</li>
              <li><strong>Rent inflation:</strong> SLC rents have risen 30%+ since 2020. Locking in a fixed mortgage protects against future rent increases.</li>
            </ol>
            <p><strong>Break-even timeline:</strong> In most SLC neighborhoods, the total cost of owning beats renting at the 5–7 year mark, assuming historical appreciation holds.</p>

            <h2>When Renting Makes Sense</h2>
            <p>Renting wins when:</p>
            <ul>
              <li>You plan to move within 3 years (selling costs are 6–8% of price)</li>
              <li>You&apos;re building your down payment and credit</li>
              <li>You&apos;re relocating to SLC and want to learn neighborhoods before committing</li>
              <li>Your investment alternatives (index funds, business) generate returns above 5–6%/year</li>
            </ul>

            <h2>Neighborhood-Level Analysis</h2>
            <p><strong>Sugar House:</strong> Renting remains competitive here — heavy supply of new apartments keeps rents relatively flat. Buying makes more sense if you plan to stay 5+ years.</p>
            <p><strong>The Avenues:</strong> Tight supply and strong appreciation make buying compelling. Avenues properties hold value well even in softer markets.</p>
            <p><strong>Liberty Wells:</strong> The value-buy neighborhood of SLC. Below-median prices with solid appreciation potential as the corridor continues to gentrify from the east.</p>
            <p><strong>Downtown:</strong> New construction condos are competitive with renting if you can negotiate the purchase price. Appreciate more slowly than single-family.</p>

            <h2>The Bottom Line</h2>
            <p>If you plan to stay in Salt Lake City for 5+ years and can cover the down payment without depleting emergency reserves, buying in 2026 makes long-term financial sense — especially with rents unlikely to fall. If your timeline is shorter or you&apos;re still building savings, renting is the financially sound choice.</p>
            <p>Uncertainty? Talk to Ondo RE. We can run a personalized buy/rent analysis with your specific numbers, neighborhood preferences, and timeline.</p>

            <div className="not-prose mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/buy-sell/salt-lake-city/">Buy in Salt Lake City</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/loans/salt-lake-city/">Get Pre-Approved</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/market-reports/salt-lake-city/">SLC Market Report</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
