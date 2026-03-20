import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/understanding-property-taxes-utah"
const title = "Understanding Property Taxes in Utah"
const description = "Complete breakdown of Utah property taxes and how they affect your investment."
const published = "2024-11-08"
const modified = "2024-11-08"
const author = "Robert Wilson"
const category = "Taxes"
const image = "/placeholder.jpg"
const keywords = ["Utah property taxes", "Truth in Taxation Utah", "property tax assessment Utah", "Utah county tax rate", "investor property tax"]

export const metadata: Metadata = {
  title: `${title} | Ondo Real Estate`,
  description: description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: { title: `${title} | Ondo Real Estate`, description: description, type: "article", publishedTime: published, modifiedTime: modified || published, authors: [author] },
  twitter: { card: "summary_large_image", title: `${title} | Ondo Real Estate`, description: description },
}

export default function UnderstandingPropertyTaxesUtah() {
  return (
    <main className="min-h-screen">
      <SEO title={title} description={description} pathname={slug} image={`${SITE_URL}${image}`} publishedTime={published} modifiedTime={modified} author={author} section={category} tags={keywords} />
      <PageBanner title={title} subtitle="Assessments, Truth in Taxation, and what every Utah investor must know." backgroundImage={image} />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Utah</Badge>
            <Badge variant="outline">Investing</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              Utah property taxes are calculated differently than most states. Understanding assessment ratios, Truth in Taxation notices, and exemptions is essential for accurate underwriting — especially after a sale.
            </p>

            <h2>How Utah Assesses Property Value</h2>
            <p>The Utah County Assessor determines the fair market value (FMV) of every property annually. The taxable value for most residential properties is 55% of FMV (the "assessment ratio"). This means a home with a $500,000 FMV has an assessed value of $275,000 for tax calculation purposes. The total tax owed is: assessed value × the combined tax rate (all overlapping taxing entities — county, city, school district, water district, etc.).</p>
            <ul>
              <li>Utah County effective rate: approximately 0.52–0.65% of FMV (varies by city)</li>
              <li>Salt Lake County: approximately 0.58–0.72% of FMV</li>
              <li>Davis and Weber counties: similar range</li>
            </ul>

            <h2>What Is Truth in Taxation?</h2>
            <p>Utah's Truth in Taxation law (Utah Code § 59-2-919) requires any taxing entity that plans to collect more revenue than the prior year to hold a public hearing and explicitly notify property owners. You may receive a "Truth in Taxation" notice in August/September. This is not your tax bill — it is a notice that your taxing entities are considering a rate increase and that you have the right to attend a public hearing and comment.</p>
            <p>Why this matters for investors: even if your property value holds flat, your tax bill can increase if the school district or city votes to raise their levy. Underwrite with a 3–5% annual property tax escalator in your cash flow models.</p>

            <h2>The Primary Residential Exemption</h2>
            <p>Utah offers a primary residential exemption that reduces the assessed value to 55% of FMV (versus 100% for non-primary). If you purchase a rental property, you lose this exemption — the property is taxed at 100% of the county's assessed FMV. This is a significant underwriting factor: a rental property will carry a higher effective tax rate than the same home used as a primary residence. Always verify the current year's tax bill in the county assessor's database before closing on any investment property.</p>

            <h2>Appealing Your Assessment</h2>
            <p>If you believe your property is over-assessed, you can file a petition with the County Board of Equalization (BOE) typically by September 15 of the tax year. Bring comparable sales (not listing prices), and present evidence that the assessor's FMV exceeds actual market value. In rapidly appreciating markets, assessments can lag — but in correcting markets, they can overshoot. Most counties have informal review processes before a formal BOE appeal.</p>

            <h2>Investor Underwriting Checklist</h2>
            <ul>
              <li>Pull the current year tax bill from the county assessor's site before making an offer</li>
              <li>Confirm whether the property has the primary residential exemption — it will be removed in the year of sale if you are buying as an investment</li>
              <li>Model a 3–5% annual tax escalator in your NOI projections</li>
              <li>Check if the property is in a special assessment district (Mello-Roos equivalent) for infrastructure improvements</li>
            </ul>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/calculators">Use Our Investment Calculators</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/investments">Browse Investment Opportunities</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
