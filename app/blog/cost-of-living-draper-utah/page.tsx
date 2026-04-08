import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/cost-of-living-draper-utah"
const title = "Cost of Living in Draper, Utah (2026)"
const description = "Real numbers on housing, utilities, groceries, taxes, and commute costs in Draper, UT — compared to SLC and the national average."
const published = "2026-04-06"
const author = "Ondo RE Team"
const category = "Cost of Living"
const image = "/city-map-with-pin.png"
const keywords = ["cost of living Draper Utah", "Draper UT housing costs", "Draper Utah expenses", "is Draper Utah expensive", "Draper vs Salt Lake City cost"]

export const metadata: Metadata = {
  title: `${title} | Ondo Real Estate`,
  description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: { title: `${title} | Ondo Real Estate`, description, type: "article", publishedTime: published, authors: [author] },
}

export default function CostOfLivingDraper() {
  return (
    <main className="min-h-screen">
      <SEO title={title} description={description} pathname={slug} image={`${SITE_URL}${image}`} publishedTime={published} author={author} section={category} tags={keywords} />
      <PageBanner title={title} subtitle="Transparent numbers so you can plan your move to Draper." backgroundImage={image} />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Draper, UT</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="lead text-xl text-foreground/70 mb-6">
              Draper is one of Utah&apos;s most desirable addresses — but what does it actually cost to live there? This guide breaks down every major expense category with real 2026 numbers, so you can decide if Draper fits your budget.
            </p>

            <h2>Housing: The Biggest Line Item</h2>
            <p>Draper&apos;s median home price sits around $620,000 in 2026 — significantly above the Salt Lake County median of $510,000. Suncrest and South Mountain push well past $800K. Draper Peaks and townhome communities offer an entry point around $420K–$550K.</p>
            <p><strong>Renting:</strong> Expect to pay $1,900–$2,400/mo for a 3-bedroom single-family home. 2-bedroom townhomes run $1,600–$2,000/mo. Demand is high; quality listings under $2,000 move in days.</p>
            <p><strong>Monthly mortgage (median price, 20% down, 30yr @ 6.75%):</strong> ~$3,210/mo, plus property taxes and insurance (~$500–$700/mo combined).</p>

            <h2>Property Taxes</h2>
            <p>Utah&apos;s property tax rate is relatively low nationally — approximately 0.5–0.6% of assessed value for residential properties. On a $620,000 Draper home: roughly $3,100–$3,720/year, or $260–$310/month. This is well below California, Oregon, and many Midwest states.</p>

            <h2>Utilities</h2>
            <p>Average monthly utility costs in Draper (electric, gas, water, trash):</p>
            <ul>
              <li><strong>Summer:</strong> $180–$220/mo (moderate A/C use, minimal heat)</li>
              <li><strong>Winter:</strong> $280–$380/mo (natural gas heating, high elevation means colder winters)</li>
              <li><strong>Internet:</strong> $60–$80/mo for 1Gbps fiber</li>
            </ul>
            <p>Draper is served by Rocky Mountain Power and Questar Gas. Many newer builds are electric-only and pair well with solar (Utah has 300+ sunny days/year).</p>

            <h2>Groceries & Dining</h2>
            <p>Draper has excellent retail access. Costco, Harmons, Trader Joe&apos;s, and Whole Foods are all within 10 minutes. Weekly groceries for a family of 4: $200–$280. Dining out: casual restaurant meals run $15–$25/person; nicer spots along 12300 South average $40–$60/person before drinks.</p>

            <h2>Commute Costs</h2>
            <p>Most Draper residents drive. Key routes:</p>
            <ul>
              <li><strong>Silicon Slopes (Lehi):</strong> 12–20 min on I-15</li>
              <li><strong>Downtown SLC:</strong> 25–35 min (40–50 min in rush hour)</li>
              <li><strong>South Jordan/Riverton:</strong> 10–15 min</li>
            </ul>
            <p>Gas in Utah typically runs $0.20–$0.30/gallon below the national average. Monthly fuel costs for a 25-mile daily commute: $120–$180. TRAX Blue Line has a Draper station — about 40 minutes to downtown SLC with one transfer.</p>

            <h2>Childcare & Education</h2>
            <p>Public schools (Canyons School District) are free and highly rated — Corner Canyon High School is regularly ranked in Utah&apos;s top 3 by AP participation. Private preschool and daycare run $1,200–$2,000/mo for full-time care.</p>

            <h2>Draper vs. Salt Lake City: Quick Comparison</h2>
            <p>Draper costs approximately 15–25% more than SLC proper for equivalent housing, offset by lower crime rates, higher-rated schools, and newer infrastructure. For tech workers earning $120K+, the premium is often worth it for the lifestyle and school quality.</p>

            <h2>Bottom Line</h2>
            <p>A comfortable family budget in Draper requires $8,000–$12,000/month all-in, with housing being the dominant expense. For renters, $5,000–$7,000/month covers housing, utilities, food, and transportation. High earners in tech find Draper a significant quality-of-life upgrade from comparable California or PNW cities at the same income level.</p>

            <div className="not-prose mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/pricing/draper/">Draper Pricing Guide</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/locations/draper/">Draper City Guide</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/loans/draper/">Draper Home Loans</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
