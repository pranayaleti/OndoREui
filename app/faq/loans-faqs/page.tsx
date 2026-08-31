import { PageBanner } from "@/components/page-banner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd, generateFAQJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import { ArrowLeft, DollarSign } from "lucide-react"
import { RelatedContent } from "@/components/content/related-content"
import { NextStepCta } from "@/components/content/next-step-cta"
import { LendingDisclaimer } from "@/components/content/lending-disclaimer"
import Script from "next/script"
import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: "Loans & Financing FAQs | Ondo Real Estate",
  description: "Get answers to common questions about Utah home loans, mortgages, pre-approval, down payments, and refinancing options.",
  alternates: { canonical: `${SITE_URL}/faq/loans-faqs/` },
  openGraph: {
    title: "Loans & Financing FAQs | Ondo Real Estate",
    description: "Get answers to common questions about Utah home loans, mortgages, pre-approval, down payments, and refinancing options.",
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}


export default function LoansFAQPage() {
  const faqs = [
    {
      question: "How much do I need for a down payment?",
      answer:
        "For many Utah buyers, conventional loans can start around 3% down, FHA around 3.5%, and some VA/USDA programs can be 0% down if you qualify. You'll still want extra funds for closing costs and reserves. Use our affordability and payment calculators, then we'll help you match your numbers to the right program on the Loans page.",
    },
    {
      question: "What is the difference between pre-qualification and pre-approval?",
      answer:
        "A pre-qualification is a quick estimate based on self‑reported info. A true pre‑approval means a loan team has pulled credit, reviewed documents, and issued a letter that sellers can trust. We recommend going straight to pre‑approval before you seriously shop so you know your numbers are solid.",
    },
    {
      question: "Should I fix my credit before I buy a home?",
      answer:
        "Small credit changes can change pricing. We will not claim a dollar savings on this page. Before you wait a full year, ask a loan officer to model your current file versus a slightly stronger score. Buying now versus waiting is file-specific.",
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
        "Mortgage rates change daily and vary by loan type, credit score, and down payment. A news 30-year average is not your Loan Estimate. Contact a loan officer for a current pricing discussion. See why your quote is not the 30-year average. This page is not a quote.",
    },
    {
      question: "How long does the loan process take?",
      answer:
        "Many first purchases close about 21–45 days after acceptance when the contract and file cooperate. That is a range, not a promise. Pre-approval, AUS findings, and clear-to-close are different documents. See how long a first purchase usually takes.",
    },
    {
      question: "Can I get a mortgage if my income changes every month?",
      answer:
        "Often yes if you can document a pattern. Underwriters typically average overtime, bonus, commission, or 1099 income over a history rather than using the highest recent month. See the variable-income hub and the 1099 documentation checklist on this site.",
    },
    {
      question: "Can I use gift funds for a down payment?",
      answer:
        "Often, when the donor is eligible and the paper trail is complete. Program rules differ for FHA, conventional, and VA. Do not move large cash without asking how it must be sourced.",
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
        "Residual income is cash left after the proposed housing payment, counted debts, and estimated utilities. It is a separate VA test from DTI. Utah files typically use the West region table — confirm the current published table rather than a blog dollar figure.",
    },
    {
      question: "How do I know if USDA is even available?",
      answer:
        "Run the property address on USDA’s published map tool and test household income against the current area limit. A city name is not a map result. See the USDA map eligibility guide on this site.",
    },
    {
      question: "Why would a file be declined after pre-approval?",
      answer:
        "A pre-approval is not a commitment to lend. Typical later fails include a job change, undocumented large deposits, new debt, or a property that does not meet the program’s standards.",
    },
    {
      question: "If I just went 1099, can that income count yet?",
      answer:
        "Usually not as a full average. Remaining W-2 wages and a documented history in the same occupation can still matter. Last month’s first invoice does not replace tax-year history. See the just-went-1099 guide and the variable-income hub.",
    },
    {
      question: "Does a $0 student-loan IDR payment mean $0 in DTI?",
      answer:
        "Not automatically. Investors calculate a payment from the credit report, a servicer statement, or a percent of the balance. SAVE and other federal plans have been in flux. Confirm the current investor rule — see the student-loans DTI guide.",
    },
    {
      question: "How do FHA MIP and conventional PMI actually end?",
      answer:
        "They are different products. Post-2013 FHA annual MIP is timed from original LTV (11 years or life of loan). Conventional borrower-paid PMI can often come off with equity under the Homeowners Protection Act. See the MIP vs PMI guide. This is not the question of whether to wait for 20% down.",
    },
    {
      question: "Is a streamline refinance a no-docs refinance?",
      answer:
        "No. FHA Streamline and VA IRRRL reduce documentation. Occupancy, payment history, and a net-benefit test still apply. Cash-out is generally not a streamline. See the streamline guide and break-even math.",
    },
    {
      question: "Do large deposits in the last 60 days have to be sourced?",
      answer:
        "Yes. Purchase files typically include about 60 days of statements. Large deposits need a paper trail (payroll, documented gift, sale of an asset, or transfer between your accounts). Undocumented cash is a common condition fail.",
    },
    {
      question: "Should I wait until I can put 20% down?",
      answer:
        "Not automatically. Waiting can avoid conventional PMI; buying sooner with PMI is a cash-and-timeline trade. How MIP vs PMI later ends, and how PMI is cancelled on an existing loan, are different questions. See the wait-for-20% guide.",
    },
    {
      question: "What is the difference between a pre-approval letter, AUS findings, and clear to close?",
      answer:
        "A letter is a snapshot for shopping. AUS (often DU or LPA) is an engine result for a program and credit file. CTC is an underwriter sign-off on this property as of that date. None of them is a guarantee you will fund. See the stages guide.",
    },
    {
      question: "Can I buy a car after I am pre-approved?",
      answer:
        "A new auto loan usually appears on the next credit pull and changes DTI. Findings can flip. Ask before you sign. See the new-auto-loan-during-underwriting guide.",
    },
    {
      question: "Is HOA part of DTI?",
      answer:
        "Required HOA dues are housing expense (front-end) and then sit in back-end with other counted debts. A modest note payment plus a large HOA can still fail the ratio. See the DTI + HOA guide.",
    },
    {
      question: "What will a first mortgage conversation ask — and promise?",
      answer:
        "Expect occupancy, income type, debts, assets, and credit authorization when you are ready. A conversation does not approve you, lock a rate, or quote APR. See the qualify page.",
    },
    {
      question: "Is DSCR the same as a full-doc rental loan?",
      answer:
        "No. DSCR typically qualifies on the property’s rent versus the payment. Full-doc qualifies the borrower with DTI and a rental worksheet. Occupancy still has to match use. See the DSCR vs full-doc guide.",
    },
    {
      question: "What does a Utah REPC financing deadline do to my loan?",
      answer:
        "Due diligence and financing/appraisal are separate contract clocks, usually 5:00 p.m. Mountain Time. A lender timeline is not a REPC deadline. Missing written notice can put earnest money at risk. Not legal advice — see the REPC deadline guide.",
    },
    {
      question: "Will paying a medical collection raise my mortgage score?",
      answer:
        "Not as a promise. Bureau reporting of medical collections changed in 2022–2023, but many mortgage files still use classic FICO on a tri-merge. See the medical-collections guide. This is not a score-raise claim.",
    },
    {
      question: "Can I get a mortgage with no traditional credit?",
      answer:
        "Sometimes, if you can document alternative references such as rent and utilities. That is not the same as weak traditional credit, and it is not assigned by who you are. See the alternative-credit guide.",
    },
    {
      question: "If I sell a home with a VA loan, is entitlement restored?",
      answer:
        "Typically when the VA loan is paid in full and the property is disposed of under current VA rules, used entitlement is restored. That is different from keeping a VA loan and buying another. This FAQ does not quote entitlement dollars. See the entitlement-restoration guide and look up current VA rules.",
    },
    {
      question: "Does a CPA letter replace tax returns for a self-employed mortgage?",
      answer:
        "Usually no. Agency files are moved by returns and transcripts. A CPA letter and YTD P&L can support that stack. See the CPA letter vs tax returns guide.",
    },
    {
      question: "Is a no-closing-cost refinance free?",
      answer:
        "Usually the lender credit that covers fees is paid for with a higher note rate. Prepaids can still show as cash. Run break-even. See the no-closing-cost refinance guide.",
    },
    {
      question: "What does a tri-merge credit report show?",
      answer:
        "Equifax, Experian, and TransUnion together. Mortgage files often use classic FICO and the middle score, not a monitoring-app number. See the tri-merge guide.",
    },
    {
      question: "Is earnest money extra on top of down payment?",
      answer:
        "It is usually credited at closing toward funds you already owe. Timing still matters: it leaves your account when the REPC is executed. See earnest vs down vs closing costs.",
    },
    {
      question: "If I still live in my house, is the rental I buy a second home?",
      answer:
        "Usually no. A house you will rent as a business is typically investment occupancy. A duplex you will live in is a house-hack. Do not relabel occupancy for pricing. See first-rental occupancy.",
    },
    {
      question: "Do compensating factors guarantee AUS will approve?",
      answer:
        "No. They are documented strengths that can appear in findings or a manual underwrite. They are not a second score. See compensating factors in findings.",
    },
    {
      question: "Should a veteran in a rural tract always take USDA?",
      answer:
        "No. VA, USDA, and FHA are different tests (entitlement, map and household income, MIP). This FAQ does not pick a program. See USDA vs VA vs FHA.",
    },
    {
      question: "Is an ITIN the same as an SSN for an agency mortgage?",
      answer:
        "Often no. Many agency and FHA files expect a valid SSN for credit and AUS. An ITIN-only file is typically a Non-QM overlay conversation. Citizenship is a legal eligibility topic, not a national-origin preference. See the ITIN documentation guide.",
    },
    {
      question: "Does biweekly extra principal beat a refinance?",
      answer:
        "They are different tools. Biweekly is one extra payment a year on the current note. A refinance changes rate, term, and costs. This FAQ does not quote interest saved. See biweekly vs refinance and break-even.",
    },
    {
      question: "If I locked and rates drop, do I automatically get the lower rate?",
      answer:
        "No. A lock holds the quoted rate for the window. A float-down, if it exists, is a written lock-desk policy. Distinct from extending an expiring lock. See what a lock does if rates drop.",
    },
    {
      question: "Is a mortgage cosigner the same as a co-borrower?",
      answer:
        "If someone is on the note, they are underwritten as a borrower. Title (the deed) is a different signature from the note. A parent who only gifts is usually neither. See cosign vs co-borrower.",
    },
    {
      question: "Should I close a credit card before I apply?",
      answer:
        "Closing a card can raise utilization by shrinking available credit. AUS reads the tri-merge. This FAQ does not quote a score change. See closing a credit card before you apply.",
    },
    {
      question: "Can I cash-out refinance a house I just bought with cash?",
      answer:
        "Sometimes, under an agency delayed-financing exception — a selling-guide exception, not a statute. Distinct from HELOC seasoning on a financed purchase. See delayed financing after a cash purchase.",
    },
    {
      question: "Do authorized-user tradelines help a mortgage file?",
      answer:
        "They can appear on a tri-merge and still be discounted or excluded. They do not make you a co-borrower. This FAQ does not teach piggybacking. See authorized-user tradelines.",
    },
    {
      question: "Is an interest-only payment a teaser rate?",
      answer:
        "No. IO skips scheduled principal for a stated period. Payment shock when amortization starts is the risk. Distinct from an ARM and from a temporary buydown. See interest-only mortgages.",
    },
    {
      question: "Should I recast or refinance after a lump sum?",
      answer:
        "A recast keeps the rate and re-spreads the payment. A refinance is a new note with costs. Run break-even. See recast vs refinance. This FAQ does not quote a recast fee.",
    },
    {
      question: "Can I finance a manufactured home or an ADU the same way as a house?",
      answer:
        "No. A HUD-code manufactured home and an accessory dwelling unit are different property types, with different title, foundation, zoning, and occupancy questions. This FAQ does not invent a HUD program code. See manufactured housing and ADU financing.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Loans & Financing FAQs | Ondo Real Estate"
        description="Get answers to common questions about Utah home loans, mortgages, pre-approval, down payments, and refinancing options."
        pathname="/faq/loans-faqs"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "FAQ", url: `${SITE_URL}/faq` },
            { name: "Loans FAQs", url: `${SITE_URL}/faq/loans-faqs` },
          ]),
          generateFAQJsonLd(faqs),
        ]}
      />
      <PageBanner
        title="Loans & Financing FAQs"
        subtitle="Common questions about mortgages, pre-approval, and loan options"
      />

      <main className="flex-1 py-12 bg-gradient-to-b from-background to-card">
        <div className="container px-4 md:px-6">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-[accent-2] hover:text-[accent-1] mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all FAQs</span>
          </Link>

          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[accent-1] to-[accent-2] flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Loans & Financing Questions</h2>
                <p className="text-gray-300 text-sm">Everything about mortgages, pre-approval, and loan programs</p>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-white/10 rounded-xl bg-card/60 px-6 py-2 backdrop-blur-sm"
                >
                  <AccordionTrigger className="text-white hover:no-underline py-4">
                    <span className="text-left font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 pb-4 pt-2 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 text-center">
              <p className="text-gray-300 mb-4">Need help with your loan application?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/loans"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[accent-1] to-[accent-2] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Explore Loan Options
                </Link>
                <Link
                  href="/calculators"
                  className="inline-flex items-center justify-center px-6 py-3 border border-[accent-1] text-[accent-2] font-semibold rounded-lg hover:bg-[accent-1]/10 transition-colors"
                >
                  Use Loan Calculators
                </Link>
              </div>
            </div>
            <RelatedContent path="/faq/loans-faqs" title="Guides that answer these in depth" />
            <NextStepCta path="/faq/loans-faqs" />
            <LendingDisclaimer className="mt-8" />
          </div>
        </div>
      </main>

      {/* FAQ JSON-LD */}
      <Script id="loans-faq-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        })}
      </Script>
    </div>
  )
}
