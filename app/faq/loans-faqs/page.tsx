import { PageBanner } from "@/components/page-banner"
import { FaqAccordion, guideLink } from "@/components/faq-accordion"
import { PURCHASE_CLOSING_RANGE } from "@/lib/service-faq"
import { FIND_YOUR_SERVICER, HUD_COUNSELING_PHONE, NOT_A_SERVICER } from "@/lib/content/mortgage-referral"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL, pageTitle, pageTitleText } from "@/lib/site"
import Link from "next/link"
import { ArrowLeft, DollarSign } from "lucide-react"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: pageTitle("Loans & Financing FAQs | Ondo Real Estate"),
  description: "Utah home loan questions: pre-approval, programs, credit, gift funds, refinancing, and where to get help with a loan you already have.",
  alternates: { canonical: `${SITE_URL}/faq/loans-faqs/` },
  openGraph: {
    type: "website",
    title: pageTitleText("Loans & Financing FAQs | Ondo Real Estate"),
    description: "Utah home loan questions: pre-approval, programs, credit, gift funds, refinancing, and where to get help with a loan you already have.",
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}


export default function LoansFAQPage() {
  const faqs = [
    {
      question: "How much do I need for a down payment?",
      answer:
        "The minimum down payment depends on the loan program and on whether you qualify. You'll still want extra funds for closing costs and reserves. Use our affordability and payment calculators, then we'll help you match your numbers to the right program on the Loans page.",
    },
    {
      question: "What is the difference between pre-qualification and pre-approval?",
      answer:
        "A pre-qualification is a quick estimate based on self‑reported info. A true pre‑approval means a loan team has pulled credit, reviewed documents, and issued a letter that sellers can trust. We recommend going straight to pre‑approval before you seriously shop so you know your numbers are solid.",
    },
    {
      question: "Should I fix my credit before I buy a home?",
      answer:
        "Small credit changes can change pricing. Before you wait a full year, ask a loan officer to model your current file versus a slightly stronger score. Buying now versus waiting is file-specific.",
      links: [guideLink("credit-before-mortgage-rapid-rescore", "Credit before a mortgage")],
    },
    {
      question: "What monthly payment should I target?",
      answer:
        "Instead of just shopping by price, we encourage you to shop by comfortable monthly payment. Start from your budget, plug it into our calculators, then walk that back to a price range. This keeps you from getting emotionally attached to homes that would feel too tight month‑to‑month.",
    },
    {
      question: "What types of home loans do you offer in Utah?",
      answer:
        "We originate conventional, FHA, VA, USDA, and jumbo loans when the property and file fit. A loan officer matches guidelines to your documentation, not a slogan about the 'best' program.",
    },
    {
      question: "How do I get pre-approved for a mortgage?",
      answer:
        "Start by completing our application or contacting a loan officer. We review income, credit, and assets to determine whether we can issue a pre-approval letter. That letter is not a commitment to lend.",
    },
    {
      question: "What are current Utah mortgage rates?",
      answer:
        "Mortgage rates change daily and vary by loan type, credit score, and down payment. A news 30-year average is not your Loan Estimate. Contact a loan officer for a current pricing discussion. This page is not a quote.",
      links: [guideLink("apr-vs-rate-on-a-loan-estimate", "Rate vs APR on a Loan Estimate")],
    },
    {
      question: "How long does the loan process take?",
      answer:
        `Many first purchases close about ${PURCHASE_CLOSING_RANGE} after acceptance when the contract and file cooperate. That is a range, not a promise. Pre-approval, AUS findings, and clear-to-close are different documents.`,
      links: [guideLink("how-long-first-purchase-takes", "How long a first purchase takes"), guideLink("pre-approval-vs-aus-vs-clear-to-close", "Pre-approval vs AUS vs clear to close")],
    },
    {
      question: "Can I get a mortgage if my income changes every month?",
      answer:
        "Often yes if you can document a pattern. Underwriters typically average overtime, bonus, commission, or 1099 income over a history rather than using the highest recent month.",
      links: [{ label: "Variable income hub", href: "/learn/variable-income/" }, guideLink("1099-mortgage-documentation-checklist", "1099 documentation checklist")],
    },
    {
      question: "Can I use gift funds for a down payment?",
      answer:
        "Often, when the donor is eligible and the paper trail is complete. Program rules differ for FHA, conventional, and VA. Do not move large cash without asking how it must be sourced.",
      links: [guideLink("gift-funds-down-payment-rules", "Gift fund rules")],
    },
    {
      question: "Do you offer first-time home buyer programs?",
      answer:
        "Yes. We work with first-time buyer programs including down payment assistance and low down payment options available in Utah. Terms are published by the agency or investor, not as a special rate on this page.",
    },
    {
      question: "Can I refinance my existing Utah mortgage?",
      answer:
        "You can ask about rate-and-term, cash-out, and FHA or VA streamline refinances when your file and the property fit. A refinance is not a promise of lower payments.",
    },
    {
      question: "What is VA residual income?",
      answer:
        "Residual income is cash left after the proposed housing payment, counted debts, and estimated utilities. It is a separate VA test from DTI. Utah files typically use the West region table. Confirm the current published table rather than a blog dollar figure.",
      links: [guideLink("va-residual-income-vs-dti", "VA residual income vs DTI")],
    },
    {
      question: "Why would a file be declined after pre-approval?",
      answer:
        "A pre-approval is not a commitment to lend. Typical later fails include a job change, undocumented large deposits, new debt, or a property that does not meet the program’s standards.",
      links: [guideLink("declined-after-pre-approval", "Declined after pre-approval")],
    },
    {
      question: "Do large deposits in the last 60 days have to be sourced?",
      answer:
        "Yes. Purchase files typically include about 60 days of statements. Large deposits need a paper trail (payroll, documented gift, sale of an asset, or transfer between your accounts). Undocumented cash is a common condition fail.",
    },
    {
      question: "Should I wait until I can put 20% down?",
      answer:
        "Not automatically. Waiting can avoid conventional PMI; buying sooner with PMI is a cash-and-timeline trade.",
      links: [guideLink("should-i-wait-for-20-percent-down", "Wait for 20% down?"), guideLink("mip-vs-pmi-how-mortgage-insurance-ends", "MIP vs PMI")],
    },
  ]

  // Ondo does not service loans. These answers point people at their servicer and free counseling.
  const servicingFaqs = [
    {
      question: "How do I get a payoff quote?",
      answer: `Ask your mortgage servicer. ${FIND_YOUR_SERVICER} ${NOT_A_SERVICER}`,
    },
    {
      question: "I cannot make my mortgage payment. What do I do?",
      answer: `Call your servicer before you miss the payment if you can, and ask about a repayment plan, deferral, forbearance or modification. ${NOT_A_SERVICER} Only your servicer, or the investor that owns the loan, can offer those options.`,
    },
    {
      question: "Who can help me for free?",
      answer: `A HUD-approved housing counselor can review your situation and help you talk to your servicer at no cost. Call ${HUD_COUNSELING_PHONE} or visit hud.gov. The Consumer Financial Protection Bureau takes complaints about mortgage servicers at consumerfinance.gov.`,
    },
    {
      question: "How do I avoid hardship scams?",
      answer: "Be careful with anyone who asks for a fee up front to change your loan, tells you to stop talking to your servicer, or asks you to sign over your deed. Real housing counseling through HUD is free.",
    },
    {
      question: "My home was damaged in a disaster. Can I get help with the mortgage?",
      answer: "Call your servicer and ask about disaster relief; forbearance pauses payments but they are still owed. If your area has a federal disaster declaration, apply at disasterassistance.gov. Document the damage and file your insurance claim first.",
    },
    {
      question: "What happens after I pay off my loan?",
      answer: "Your servicer releases the lien and records the release with the county. Ask for the timeline and keep your final statement and the recorded release.",
    },
  ]


  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Loans & Financing FAQs | Ondo Real Estate"
        description="Utah home loan questions: pre-approval, programs, credit, gift funds, refinancing, and where to get help with a loan you already have."
        pathname="/faq/loans-faqs"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "FAQ", url: `${SITE_URL}/faq` },
            { name: "Loans FAQs", url: `${SITE_URL}/faq/loans-faqs` },
          ]),
          generateFAQJsonLd([...faqs, ...servicingFaqs]),
        ]}
      />
      <PageBanner
        title="Home loan FAQs"
        subtitle="Getting a loan, and help with the one you already have."
      />

      <main className="flex-1 py-12 bg-gradient-to-b from-background to-card">
        <div className="container px-4 md:px-6">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-accent-2 hover:text-accent-1 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all FAQs</span>
          </Link>

          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-1 to-accent-2 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Getting a loan</h2>
                <p className="text-muted-foreground text-sm">Pre-approval, programs, credit and timing</p>
              </div>
            </div>

            <FaqAccordion items={faqs} />

            <h2 className="mt-14 mb-2 text-2xl font-bold text-foreground">Your current loan</h2>
            <p className="mb-6 text-sm text-muted-foreground">Payoffs, hardship and disaster help start with your servicer, not with us.</p>
            <FaqAccordion items={servicingFaqs} />

            <p className="mt-12 text-center text-muted-foreground">
              Ready to talk through a file?{" "}
              <Link href="/qualify/" className="font-medium text-primary underline-offset-4 hover:underline">
                Talk with a loan officer
              </Link>
              .
            </p>
            <LendingDisclaimer className="mt-8" />
          </div>
        </div>
      </main>

    </div>
  )
}
