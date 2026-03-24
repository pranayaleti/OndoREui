import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/fha-vs-conventional-loans-utah"
const title = "FHA vs Conventional Loans in Utah: Which Is Right for You?"
const description = "A side-by-side comparison of FHA and conventional mortgages for Utah home buyers — down payment, PMI, credit requirements, and which loan wins in different scenarios."
const published = "2026-03-23"
const modified = "2026-03-23"
const author = "Ondo RE Team"
const category = "Mortgages"
const image = "/modern-apartment-balcony.webp"
const keywords = [
  "FHA vs conventional Utah",
  "Utah FHA loan",
  "conventional loan Utah",
  "FHA loan requirements Utah",
  "Utah mortgage options",
  "best home loan Utah",
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

export default function FhaVsConventionalLoansUtah() {
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
        subtitle="The right loan depends on your credit, down payment, and how long you plan to stay."
        backgroundImage={image}
      />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Utah</Badge>
            <Badge variant="outline">Home Buyers</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              For most Utah home buyers, the choice comes down to FHA or conventional — two very different loan structures that suit different financial profiles. The wrong choice can cost you tens of thousands over the life of your loan. Here is how to decide.
            </p>

            <h2>The Basics: FHA vs Conventional</h2>
            <p>An <strong>FHA loan</strong> is insured by the Federal Housing Administration and underwritten by approved lenders. It is designed for buyers with lower credit scores or smaller down payments. A <strong>conventional loan</strong> is not government-backed — it conforms to Fannie Mae or Freddie Mac guidelines (for conforming loans) or is held by private lenders (for jumbo loans).</p>

            <h2>Down Payment Requirements</h2>
            <ul>
              <li><strong>FHA:</strong> 3.5% minimum with a 580+ credit score; 10% minimum with a 500–579 credit score</li>
              <li><strong>Conventional:</strong> 3% minimum (some programs) up to 20%; below 20% triggers private mortgage insurance (PMI)</li>
            </ul>
            <p>On a $500,000 Utah home — near the median — FHA requires $17,500 down (3.5%), while a conventional 5% down requires $25,000. FHA's lower barrier is attractive for first-time buyers, but the ongoing cost of FHA mortgage insurance often erases that advantage over time.</p>

            <h2>Credit Score Requirements</h2>
            <ul>
              <li><strong>FHA:</strong> 500 minimum (with 10% down); 580 minimum (with 3.5% down). Many Utah FHA lenders prefer 620+ in practice.</li>
              <li><strong>Conventional:</strong> 620 minimum for most programs; 740+ gets the best rates and lowest PMI costs</li>
            </ul>
            <p>If your credit score is below 620, FHA is typically your only conforming option. Between 620 and 680, run both scenarios — the rates and insurance costs may favor FHA. Above 720, conventional almost always wins on total cost.</p>

            <h2>Mortgage Insurance: The Critical Difference</h2>
            <p>This is where most buyers make a costly mistake by focusing only on the interest rate.</p>
            <p><strong>FHA Mortgage Insurance Premium (MIP):</strong></p>
            <ul>
              <li>Upfront MIP: 1.75% of the loan amount, added to your loan balance at closing</li>
              <li>Annual MIP: 0.55% of the loan balance per year (for most standard terms)</li>
              <li><strong>Key difference:</strong> FHA MIP is permanent for the life of the loan if you put down less than 10%. You cannot remove it by building equity — you must refinance into a conventional loan to eliminate it.</li>
            </ul>
            <p><strong>Conventional PMI:</strong></p>
            <ul>
              <li>Typically 0.2%–1.5% annually depending on credit score and LTV</li>
              <li><strong>Automatically cancelled</strong> when your loan balance reaches 78% of the original purchase price (Homeowners Protection Act)</li>
              <li>Can request cancellation at 80% LTV</li>
            </ul>
            <p>On a $480,000 loan, FHA's annual MIP is $2,640/year ($220/month). Even if your conventional PMI is 0.8% ($3,840/year initially), it drops off as you pay down the loan — while FHA MIP continues indefinitely.</p>

            <h2>Loan Limits in Utah (2026)</h2>
            <p>Both loan types have limits. For 2026 in most Utah counties:</p>
            <ul>
              <li><strong>FHA loan limit (Salt Lake County):</strong> $644,000 for a single-family home</li>
              <li><strong>Conventional conforming limit:</strong> $766,550 for most Utah counties</li>
            </ul>
            <p>If you are buying above the conforming limit, you are in jumbo territory — where neither FHA nor standard conventional applies. <Link href="/loans/jumbo">Jumbo loans</Link> have their own requirements, typically requiring 20% down and a 700+ credit score.</p>

            <h2>Property Condition Requirements</h2>
            <p>FHA has stricter property condition standards. The home must meet HUD minimum property requirements — issues like peeling paint, broken windows, missing handrails, or roof concerns can trigger required repairs before closing. Sellers in competitive Utah markets sometimes reject FHA offers for this reason.</p>
            <p>Conventional loans have more flexible property standards, making them easier to use on fixer-uppers or homes with deferred maintenance.</p>

            <h2>Seller Acceptance in a Competitive Market</h2>
            <p>In hot Utah markets like Draper, Lehi, and Salt Lake City, sellers sometimes prefer conventional offers — especially if the property has condition issues that could delay an FHA appraisal. If you are competing in multiple-offer situations, a conventional offer may have a practical advantage even if FHA would cost you less.</p>

            <h2>Which Should You Choose?</h2>
            <ul>
              <li><strong>Choose FHA if:</strong> Your credit score is below 680, your down payment is under 5%, or you need the most lenient debt-to-income ratio flexibility</li>
              <li><strong>Choose conventional if:</strong> Your credit score is 700+, you can put down 10%+, or you plan to stay in the home long enough that eliminating PMI is material to your budget</li>
              <li><strong>Run both scenarios:</strong> Get loan estimates for both FHA and conventional and compare the total monthly payment including insurance over a 5–7 year horizon</li>
            </ul>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/loans/fha">Explore Utah FHA Loans</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/loans/conventional">Conventional Loan Options</Link>
              </Button>
            </div>

            <p>Ondo RE offers both <Link href="/loans/fha">FHA</Link> and <Link href="/loans/conventional">conventional loan</Link> programs for Utah home buyers. Use our <Link href="/calculators">mortgage calculator</Link> to compare total monthly payments side by side, or <Link href="/contact">schedule a consultation</Link> with our lending team to get a personalized recommendation for your situation.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
