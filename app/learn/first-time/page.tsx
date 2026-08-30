import type { Metadata } from "next"
import Link from "next/link"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { RelatedContent } from "@/components/content/related-content"
import { NextStepCta } from "@/components/content/next-step-cta"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import { ContentFaq } from "@/components/content/content-faq"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { LENDING_FACTS_AS_OF } from "@/lib/content"

const faqs = [
  {
    question: "Is earnest money extra cash on top of down payment?",
    answer:
      "Earnest money is usually credited toward what you already owe at closing. You still need enough liquid funds for down payment, closing costs, and prepaids after that credit. Timing matters: the deposit leaves your account when the REPC is executed.",
  },
  {
    question: "Can seller concessions cover everything besides down payment?",
    answer:
      "Sometimes a portion of closing costs, within program caps. Prepaids, reserves, and earnest money still have to be sourced. Caps differ for FHA, conventional, VA, and USDA.",
  },
  {
    question: "Are reserves extra cash I pay at the title table?",
    answer:
      "No. Reserves are documented remaining liquid assets after cash to close, counted as months of PITIA. Gift funds often cannot fill that line. See the reserves guide.",
  },
]

export const metadata: Metadata = pageCanonicalMetadata("/learn/first-time", {
  title: "First-Time Buyer Cash, Assistance, and Closing | Ondo Real Estate",
  description:
    "Utah first-time education: cash besides down payment, DPA stacked with gifts, and how closings fund at title. Informational, not a credit decision.",
})

export default function FirstTimeLearnPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="First-time buyer cash, assistance, and closing"
        description="How much cash besides down payment, how DPA stacks with gifts, and how Utah closings actually fund."
        pathname="/learn/first-time"
        image={`${SITE_URL}/suburban-house-garden.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Learn", url: `${SITE_URL}/learn` },
            { name: "First-time buyers", url: `${SITE_URL}/learn/first-time` },
          ]),
          generateFAQJsonLd(faqs),
        ]}
      />
      <PageBanner
        title="First-time buyers: cash, assistance, closing"
        subtitle="Down payment is one line. Utah files still have earnest money, title, prepaids, and sometimes a second-lien DPA."
        backgroundImage="/suburban-house-garden.png"
      />
      <article className="bg-background py-12">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <BreadcrumbNav items={[{ label: "Learn", href: "/learn" }, { label: "First-time buyers" }]} />
          <div className="prose prose-lg prose-invert mt-6 max-w-none">
            <p className="lead text-xl text-foreground/70">
              Most first-time files stall on cash to close, not on the sticker price. This hub is the map for money
              besides down payment, how Utah Housing / other DPA can sit next to a gift on an FHA loan, and what is
              actually unique about a Utah title closing. Snapshot as of {LENDING_FACTS_AS_OF}.
            </p>
            <h2>Start with the cash stack</h2>
            <p>
              Read{" "}
              <Link href="/blog/utah-cash-to-close-besides-down-payment">how much cash besides down payment</Link> before
              you shop as if 3.5% is the whole number. Then{" "}
              <Link href="/blog/earnest-money-vs-down-payment-vs-closing-costs">
                earnest money vs down payment vs closing costs
              </Link>{" "}
              for the three cash lines, and the{" "}
              <Link href="/blog/utah-closing-costs-title-origination-prepaids">Utah closing-cost guide</Link> for title,
              origination, and prepaids that vary by county and title company. Remaining assets after that stack:{" "}
              <Link href="/blog/mortgage-reserves-months-of-pitia">reserves as months of PITIA</Link>. After you close,
              Utah’s once-a-year tax bill vs the first impound analysis:{" "}
              <Link href="/blog/utah-property-tax-calendar-first-escrow-analysis">
                property tax calendar vs first escrow analysis
              </Link>{" "}
              and <Link href="/blog/escrow-cushion-how-it-is-set">how the escrow cushion is set</Link>. After the first
              year, a shortage on the analysis notice is a different letter:{" "}
              <Link href="/blog/escrow-shortage-after-first-year">escrow shortage after the first year</Link>.
            </p>
            <h2>If family or an agency is helping</h2>
            <ul>
              <li>
                <Link href="/blog/gift-funds-down-payment-rules">Gift-fund paper trail</Link> — the gift letter is not
                optional.
              </li>
              <li>
                <Link href="/blog/parent-gifting-down-payment-who-signs">Parent is gifting: who signs what</Link> —
                occupancy and title are not the same as a donor signature.
              </li>
              <li>
                <Link href="/blog/student-loans-dti-idr-save">Student loans and DTI after IDR / SAVE</Link> — a $0
                dashboard line is not automatically $0 in underwriting.
              </li>
              <li>
                <Link href="/blog/should-i-wait-for-20-percent-down">Should I wait for 20% down?</Link> — PMI vs
                saving longer is a cash-and-timeline trade, not how MIP later ends.
              </li>
              <li>
                <Link href="/blog/utah-repc-deadline-and-your-loan">What a Utah REPC deadline does to your loan</Link> —
                due diligence and financing are separate 5:00 p.m. Mountain Time clocks.
              </li>
              <li>
                <Link href="/blog/how-long-first-purchase-takes">How long a first purchase usually takes</Link> — ranges
                from pre-approval to CTC, not a closing-date promise.
              </li>
              <li>
                <Link href="/blog/first-time-buyer-file-mistakes">File mistakes, not lifestyle listicles</Link> — new
                debt, job change, large deposits, occupancy.
              </li>
              <li>
                <Link href="/blog/townhome-vs-condo-hoa-docs-lenders-ask">Townhome vs condo HOA docs</Link> — not every
                townhome is a condo. The plat is the underwrite. Insurance form:{" "}
                <Link href="/blog/hazard-vs-ho3-vs-ho6-condo-insurance">hazard vs HO-3 vs HO-6</Link>.
              </li>
              <li>
                <Link href="/blog/relocating-to-utah-job-seasoning">Relocating when the job starts in 60 days</Link> —
                offer-letter seasoning is not a published 60-day rule.
              </li>
              <li>
                <Link href="/blog/dpa-stacked-with-fha-gift-funds">DPA stacked with an FHA gift</Link> — a second lien is
                not a gift.
              </li>
              <li>
                <Link href="/buy/first-time/grants">Grants and assistance map</Link> — agency rules change; confirm
                with the agency.
              </li>
            </ul>
            <h2>Then pick a program</h2>
            <p>
              <Link href="/blog/fha-vs-conventional-loans-utah">FHA vs conventional</Link> is the usual first comparison.{" "}
              <Link href="/loans/usda">USDA</Link> only if the{" "}
              <Link href="/blog/usda-map-income-limit-eligibility">map and income tests</Link> pass.{" "}
              <Link href="/loans/va">VA</Link> if you have remaining entitlement.
            </p>
          </div>
          <ContentFaq items={faqs} />
          <RelatedContent path="/learn/first-time" title="Guides in this cluster" />
          <NextStepCta
            path="/learn/first-time"
            heading="Bring a cash-to-close number, not just a price"
            body="Use the closing-cost and affordability calculators for illustrations, then talk with a loan officer about sourced funds."
          />
          <LendingDisclaimer className="mt-8" />
        </div>
      </article>
    </main>
  )
}
