import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"
import { RelatedContent } from "@/components/content/related-content"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { CONVENTIONAL_SNAPSHOT, FHA_SNAPSHOT } from "@/lib/content"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

const slug = "/blog/first-time-home-buyer-guide"
const title = "First-Time Home Buyer Guide: Everything You Need to Know"
const description = "Complete guide to buying your first home in Utah, from pre-approval to closing day."
const published = "2024-12-10"
const modified = "2026-08-29"
const author = "Ondo RE Team"
const category = "Buying Guide"
const image = "/suburban-house-garden.png"
const keywords = ["first time home buyer Utah", "home buying guide", "pre-approval Utah", "FHA loan Utah", "down payment assistance Utah"]

export const metadata: Metadata = {
  title: `${title} | Ondo Real Estate`,
  description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: { title: `${title} | Ondo Real Estate`, description, type: "article", publishedTime: published, modifiedTime: modified || published, authors: [author], images: DEFAULT_OG_IMAGES },
  twitter: { card: "summary_large_image", title: `${title} | Ondo Real Estate`, description, images: [DEFAULT_OG_IMAGE_URL] },
}

export default function FirstTimeHomeBuyerGuide() {
  return (
    <main className="min-h-screen">
      <SEO title={title} description={description} pathname={slug} image={`${SITE_URL}${image}`} publishedTime={published} modifiedTime={modified} author={author} section={category} tags={keywords} />
      <PageBanner title={title} subtitle="Step-by-step guidance from pre-approval to keys in hand." backgroundImage={image} />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Utah</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              Start with a payment you can live with, then get a documented pre-approval before you shop. This Utah walkthrough covers credit, assistance programs, offers, inspection, and closing. It is education, not a promise you will qualify.
            </p>

            <h2>Step 1: Know Your Numbers Before You Shop</h2>
            <p>Before you fall in love with a listing, understand what you can actually afford. Pull your credit reports from all three bureaus (Equifax, Experian, TransUnion) and check for errors. Conventional files often start around a 620 score; FHA HUD policy allows 580+ for {FHA_SNAPSHOT.minDownPayment580Plus} down. Lender overlays can be higher. Wasatch Front prices are high enough that down payment plus closing costs need a cash plan. Confirm current medians from a current market source; this page does not lock a dollar median.</p>
            <ul>
              <li>Target a housing payment (PITI + HOA) you can live with after taxes and savings, not a ratio copied from a blog.</li>
              <li>{CONVENTIONAL_SNAPSHOT.dtiNote}</li>
              <li>Have reserves after closing if the file requires them. The amount is a guideline, not a promise.</li>
            </ul>

            <h2>Step 2: Get Pre-Approved: Not Just Pre-Qualified</h2>
            <p>A pre-qualification is a quick estimate from self-reported numbers. A pre-approval is a lender reviewing tax returns, W-2s, pay stubs, and bank statements to decide whether it can issue a letter. That letter is still not a commitment to lend. In competitive Utah markets, sellers often want a documented pre-approval. Work with a lender who knows Utah title, HOA, and county practices.</p>
            <p>Utah first-time buyer programs to ask about (confirm current terms with the agency, not this page):</p>
            <ul>
              <li><strong>Utah Housing Corporation (UHC) FirstHome Loan</strong> — UHC publishes purchase products and optional DPA. Rate and DPA terms change; verify on UHC’s site.</li>
              <li><strong>UHC Score Loan</strong> — ask UHC whether a lower-score product still exists for your file.</li>
              <li><strong>FHA loans</strong> — {FHA_SNAPSHOT.minDownPayment580Plus} down at 580+ under HUD policy; overlays apply. DPA stacking is file-specific.</li>
              <li><strong>USDA Rural Development</strong> — zero down only in eligible census tracts and when income limits fit. Check the USDA map for the property, not a city slogan.</li>
            </ul>

            <h2>Step 3: Find the Right Agent and Search Smart</h2>
            <p>A buyer&apos;s agent works under a written buyer-broker agreement. Compensation is negotiated — it is not typically free, and the seller does not automatically pay both sides. That agreement is how you get negotiation help, contract knowledge, and a search that includes MLS inventory your agent can access. Look for someone who specialises in your target corridor; Wasatch Front dynamics differ dramatically from Park City or St. George.</p>
            <p>Search tips for Utah:</p>
            <ul>
              <li>Watch days-on-market. Anything under 7 days in the Salt Lake metro usually means multiple offers.</li>
              <li>Check flood zone maps, FEMA-designated zones affect insurance cost significantly.</li>
              <li>Verify HOA documents: budget, reserve study, and meeting minutes before going under contract.</li>
            </ul>

            <h2>Step 4: Make a Strong Offer</h2>
            <p>Price is not the only lever. In a competitive market, escalation clauses, waived minor contingencies, and a flexible close date can win over a marginally higher offer. That said, never waive an inspection entirely on your first home, the inspection contingency protects you from discovering major structural or mechanical defects after you own the property.</p>
            <p>Utah-specific contract items to understand:</p>
            <ul>
              <li>REPC (Real Estate Purchase Contract), Utah's standard contract is thorough; know the deadlines</li>
              <li>Earnest money is typically 1–2% of purchase price and goes hard (non-refundable) after the due-diligence period</li>
              <li>Seller disclosures are required by Utah law; review them carefully</li>
            </ul>

            <h2>Step 5: Navigate Inspection, Appraisal, and Closing</h2>
            <p>After an accepted offer, the clock starts. You typically have 10–14 days for inspections. Hire a licensed Utah home inspector and, for older homes, add a sewer scope and radon test (Utah has elevated radon in many areas). If issues arise, you can negotiate repairs, a price reduction, or a seller credit.</p>
            <p>The lender orders an appraisal to confirm the home is worth the purchase price. If it appraises low, you can renegotiate, pay the gap in cash, or walk away. Final underwriting then clears any remaining conditions. Closing day involves signing a stack of documents at title, in Utah, closings are typically handled by a title company, not an attorney.</p>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/loans/fha">Explore FHA Loans</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/qualify">Talk with a loan officer</Link>
              </Button>
            </div>
          </div>
          <RelatedContent path="/blog/first-time-home-buyer-guide" />
          <LendingDisclaimer className="mt-8" />
        </div>
      </article>
    </main>
  )
}
