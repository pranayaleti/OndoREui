import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/first-time-home-buyer-guide"
const title = "First-Time Home Buyer Guide: Everything You Need to Know"
const description = "Complete guide to buying your first home in Utah, from pre-approval to closing day."
const published = "2024-12-10"
const modified = "2024-12-10"
const author = "Sarah Johnson"
const category = "Buying Guide"
const image = "/suburban-house-garden.png"
const keywords = ["first time home buyer Utah", "home buying guide", "pre-approval Utah", "FHA loan Utah", "down payment assistance Utah"]

export const metadata: Metadata = {
  title: `${title} | Ondo Real Estate`,
  description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: { title: `${title} | Ondo Real Estate`, description, type: "article", publishedTime: published, modifiedTime: modified || published, authors: [author] },
  twitter: { card: "summary_large_image", title: `${title} | Ondo Real Estate`, description },
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
              Buying your first home is one of the biggest financial decisions you will make. This guide walks you through every stage of the process — from getting pre-approved to handing over the keys — so you can move forward with confidence.
            </p>

            <h2>Step 1: Know Your Numbers Before You Shop</h2>
            <p>Before you fall in love with a listing, understand what you can actually afford. Pull your credit reports from all three bureaus (Equifax, Experian, TransUnion) and check for errors. A score of 620+ qualifies for conventional financing; 580+ for FHA. In Utah, the median home price in the Salt Lake metro exceeds $500,000, so most buyers need a plan for the down payment and closing costs (typically 2–5% of purchase price).</p>
            <ul>
              <li>Target a housing payment (PITI + HOA) at or below 28–31% of gross monthly income</li>
              <li>Total debt-to-income (all obligations) should stay under 43–45%</li>
              <li>Have 2–3 months of reserves after closing for peace of mind</li>
            </ul>

            <h2>Step 2: Get Pre-Approved — Not Just Pre-Qualified</h2>
            <p>A pre-qualification is a quick estimate. A pre-approval is a lender reviewing your actual tax returns, W-2s, pay stubs, and bank statements and issuing a conditional commitment. In Utah's competitive market, sellers often reject offers without a solid pre-approval letter. Use a local lender who understands Utah title, HOA, and county-specific quirks — national online lenders can cause delays at closing.</p>
            <p>Utah first-time buyer programs to ask about:</p>
            <ul>
              <li><strong>Utah Housing Corporation (UHC) FirstHome Loan</strong> — below-market rate + optional DPA second mortgage</li>
              <li><strong>UHC Score Loan</strong> — for buyers with lower credit scores who need more flexibility</li>
              <li><strong>FHA loans</strong> — 3.5% down at 580+ FICO; works well with UHC DPA</li>
              <li><strong>USDA Rural Development</strong> — zero down in eligible rural areas (Cache Valley, parts of Utah County)</li>
            </ul>

            <h2>Step 3: Find the Right Agent and Search Smart</h2>
            <p>A buyer's agent costs you nothing (seller pays both commissions in most transactions) and gives you negotiation expertise, contract knowledge, and access to off-market listings. Look for someone who specialises in your target corridor — Wasatch Front dynamics differ dramatically from Park City or St. George.</p>
            <p>Search tips for Utah:</p>
            <ul>
              <li>Watch days-on-market. Anything under 7 days in the Salt Lake metro usually means multiple offers.</li>
              <li>Check flood zone maps — FEMA-designated zones affect insurance cost significantly.</li>
              <li>Verify HOA documents: budget, reserve study, and meeting minutes before going under contract.</li>
            </ul>

            <h2>Step 4: Make a Strong Offer</h2>
            <p>Price is not the only lever. In a competitive market, escalation clauses, waived minor contingencies, and a flexible close date can win over a marginally higher offer. That said, never waive an inspection entirely on your first home — the inspection contingency protects you from discovering major structural or mechanical defects after you own the property.</p>
            <p>Utah-specific contract items to understand:</p>
            <ul>
              <li>REPC (Real Estate Purchase Contract) — Utah's standard contract is thorough; know the deadlines</li>
              <li>Earnest money is typically 1–2% of purchase price and goes hard (non-refundable) after the due-diligence period</li>
              <li>Seller disclosures are required by Utah law; review them carefully</li>
            </ul>

            <h2>Step 5: Navigate Inspection, Appraisal, and Closing</h2>
            <p>After an accepted offer, the clock starts. You typically have 10–14 days for inspections. Hire a licensed Utah home inspector and, for older homes, add a sewer scope and radon test (Utah has elevated radon in many areas). If issues arise, you can negotiate repairs, a price reduction, or a seller credit.</p>
            <p>The lender orders an appraisal to confirm the home is worth the purchase price. If it appraises low, you can renegotiate, pay the gap in cash, or walk away. Final underwriting then clears any remaining conditions. Closing day involves signing a stack of documents at title — in Utah, closings are typically handled by a title company, not an attorney.</p>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/loans/fha">Explore FHA Loans</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/qualify">Get Pre-Approved</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
