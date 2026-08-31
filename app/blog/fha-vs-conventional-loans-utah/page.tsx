import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"
import { RelatedContent } from "@/components/content/related-content"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { IsThisRightForMe } from "@/components/content/is-this-right-for-me"
import { NextStepCta } from "@/components/content/next-step-cta"
import {
  CONFORMING_LIMIT_NOTE,
  CONVENTIONAL_SNAPSHOT,
  EXAMPLE_NOTE,
  EXAMPLE_PURCHASE_PRICE_UTAH,
  FHA_COUNTY_LIMIT_NOTE,
  FHA_SNAPSHOT,
} from "@/lib/content"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

const slug = "/blog/fha-vs-conventional-loans-utah"
const title = "FHA vs Conventional Loans in Utah: Which Is Right for You?"
const description = "A side-by-side comparison of FHA and conventional mortgages for Utah home buyers, down payment, PMI, credit requirements, and which loan wins in different scenarios."
const published = "2026-03-23"
const modified = "2026-08-29"
const author = "Ondo RE Team"
const category = "Mortgages"
const image = "/modern-apartment-balcony.webp"
const keywords = [
  "FHA vs conventional Utah",
  "Utah FHA loan",
  "conventional loan Utah",
  "FHA loan requirements Utah",
  "Utah mortgage options",
  "FHA conventional comparison Utah",
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
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", title: `${title} | Ondo RE`, description, images: [DEFAULT_OG_IMAGE_URL] },
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
              Compare FHA and conventional on down payment, mortgage insurance, credit overlays, and loan limits. The cheaper file over five to seven years is not always the one with the lower note rate. This page is education, not a recommendation for your file.
            </p>

            <h2>The Basics: FHA vs Conventional</h2>
            <p>An <strong>FHA loan</strong> is insured by the Federal Housing Administration and underwritten by approved lenders. Files often land here when score, down payment, or DTI is tighter than conventional overlays. A <strong>conventional loan</strong> is not government-backed; conforming files follow Fannie Mae or Freddie Mac guides, and jumbo files follow private-investor overlays above the FHFA county limit.</p>

            <h2>Down Payment Requirements</h2>
            <ul>
              <li><strong>FHA:</strong> {FHA_SNAPSHOT.minDownPayment580Plus} minimum with a 580+ credit score; {FHA_SNAPSHOT.minDownPayment500To579} minimum with a 500–579 credit score. {FHA_SNAPSHOT.scoreNote}</li>
              <li><strong>Conventional:</strong> {CONVENTIONAL_SNAPSHOT.lowDownOptions} Below 20% typically triggers private mortgage insurance (PMI).</li>
            </ul>
            <p>
              Illustration on a ${EXAMPLE_PURCHASE_PRICE_UTAH.toLocaleString("en-US")} purchase: {FHA_SNAPSHOT.minDownPayment580Plus} FHA down is $
              {Math.round(EXAMPLE_PURCHASE_PRICE_UTAH * 0.035).toLocaleString("en-US")}; 5% conventional down is $
              {Math.round(EXAMPLE_PURCHASE_PRICE_UTAH * 0.05).toLocaleString("en-US")}. {EXAMPLE_NOTE} FHA’s lower cash-to-close can look cheaper on day one; MIP vs PMI over a few years is what you should compare next.
            </p>

            <h2>Credit Score Requirements</h2>
            <ul>
              <li><strong>FHA:</strong> {FHA_SNAPSHOT.scoreNote}</li>
              <li><strong>Conventional:</strong> {CONVENTIONAL_SNAPSHOT.typicalMinimumScore}. Higher scores often improve pricing, but there is no single “best rate” score.</li>
            </ul>
            <p>If your score is below typical conventional overlays, FHA is often the remaining agency path. Between the low 600s and high 600s, run both Loan Estimates. A higher score does not automatically make conventional cheaper once MIP vs PMI and term are included.</p>

            <h2>A 640 FICO in Utah: compare both, promise neither</h2>
            <p>
              A 640 middle score is a common “am I even in the conversation?” question. HUD policy can allow FHA at 580+
              with 3.5% down, but lender overlays often sit higher. Conventional agency guides often talk about 620, and
              many Utah overlays sit above that. A 640 file is frequently an FHA-first comparison, not an automatic
              conventional denial and not an FHA approval.
            </p>
            <ul>
              <li>
                <strong>Ask about FHA when</strong> conventional overlays look tight on score or down payment, you need
                HUD’s more flexible DTI policy with compensating factors, or gift funds need to cover the full down
                payment.
              </li>
              <li>
                <strong>Still price conventional</strong> if reserves, occupancy, and the property (especially condos)
                fit, or if you care about PMI that can come off with equity. Compare 5–7 year total housing cost
                including MIP vs PMI.
              </li>
              <li>
                <strong>Do not treat 640 as a magic number.</strong> Pricing, AUS findings, and overlays move. The
                product that “wins” is the Loan Estimate you can actually close, not a blog table.
              </li>
            </ul>

            <h2>Mortgage Insurance: The Critical Difference</h2>
            <p>This is where most buyers make a costly mistake by focusing only on the interest rate.</p>
            <p><strong>FHA Mortgage Insurance Premium (MIP):</strong></p>
            <ul>
              <li>Upfront MIP: {FHA_SNAPSHOT.upfrontMip}</li>
              <li>Annual MIP: {FHA_SNAPSHOT.annualMipNote}</li>
              <li><strong>Key difference:</strong> FHA MIP is typically charged for the life of the loan if you put down less than 10%. You generally cannot drop it by building equity; a refinance into conventional is the usual exit.</li>
            </ul>
            <p><strong>Conventional PMI:</strong></p>
            <ul>
              <li>Premium depends on credit score and LTV; it is not a single published percent.</li>
              <li>{CONVENTIONAL_SNAPSHOT.pmiRemoval} Under the Homeowners Protection Act, automatic cancellation is tied to 78% of original value, not a marketing “purchase price” shortcut.</li>
            </ul>
            <p>We do not publish a monthly MIP or PMI dollar figure here. Compare the insurance line on two Loan Estimates over a 5–7 year horizon instead of assuming FHA is always more expensive, or conventional always cheaper. How each product actually leaves the loan: <Link href="/blog/mip-vs-pmi-how-mortgage-insurance-ends">MIP vs PMI exit</Link>. Condos have a separate HUD project test: <Link href="/blog/fha-condo-roster-project-approval">FHA condo roster</Link>.</p>

            <h2>Loan Limits in Utah</h2>
            <p>Both programs cap loan size, and both change every year:</p>
            <ul>
              <li><strong>Conventional conforming:</strong> {CONFORMING_LIMIT_NOTE}</li>
              <li><strong>FHA:</strong> {FHA_COUNTY_LIMIT_NOTE}</li>
            </ul>
            <p>If the purchase is above the current conforming limit for that county, you are in jumbo territory, where neither FHA nor standard conventional applies. <Link href="/loans/jumbo">Jumbo</Link> overlays (down payment, score, reserves) are set by the investor, not by a number on this page.</p>

            <h2>Property Condition Requirements</h2>
            <p>FHA has stricter property condition standards. The home must meet HUD minimum property requirements, issues like peeling paint, broken windows, missing handrails, or roof concerns can trigger required repairs before closing. Sellers in competitive Utah markets sometimes reject FHA offers for this reason.</p>
            <p>Conventional loans have more flexible property standards, making them easier to use on fixer-uppers or homes with deferred maintenance.</p>

            <h2>Seller Acceptance in a Competitive Market</h2>
            <p>In hot Utah markets like Draper, Lehi, and Salt Lake City, sellers sometimes prefer conventional offers, especially if the property has condition issues that could delay an FHA appraisal. If you are competing in multiple-offer situations, a conventional offer may have a practical advantage even if FHA would cost you less.</p>

            <h2>Which Should You Compare First?</h2>
            <ul>
              <li><strong>Ask about FHA when:</strong> conventional overlays look tight on score or down payment, or you need HUD’s more flexible DTI policy with compensating factors. {FHA_SNAPSHOT.dtiNote}</li>
              <li><strong>Ask about conventional when:</strong> you can document a stronger credit profile, more down payment, or you care about PMI that can come off with equity. Compare total housing cost, not slogans.</li>
              <li><strong>Run both scenarios:</strong> Get Loan Estimates for both FHA and conventional and compare the total monthly payment including insurance over a 5–7 year horizon. That comparison is not a credit decision.</li>
            </ul>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/loans/fha">Explore Utah FHA Loans</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/loans/conventional">Conventional Loan Options</Link>
              </Button>
            </div>

            <p>Ondo RE offers both <Link href="/loans/fha">FHA</Link> and <Link href="/loans/conventional">conventional loan</Link> programs for Utah home buyers. Use our <Link href="/calculators">mortgage calculator</Link> to compare total monthly payments side by side, or <Link href="/contact">schedule a consultation</Link> with our lending team about your file. That is not a personalized recommendation generated by this page.</p>
          </div>
          <IsThisRightForMe table="purchase" programs={["fha", "conventional"]} highlight="fha" />
          <RelatedContent path="/blog/fha-vs-conventional-loans-utah" />
          <NextStepCta path="/blog/fha-vs-conventional-loans-utah" />
          <LendingDisclaimer className="mt-8" />
        </div>
      </article>
    </main>
  )
}
