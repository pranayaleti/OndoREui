import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ArticleCallout } from "@/components/content/article-callout"
import { StepList } from "@/components/content/step-list"
import {
  LENDING_FACTS_AS_OF,
  LOAN_ASSUMPTION,
  VA_ENTITLEMENT_RESTORATION,
} from "@/lib/content"
import Link from "next/link"

const path = "/blog/va-loan-assumption-entitlement"

const faqs = [
  {
    question: "Can a non-veteran assume a VA loan?",
    answer:
      "Often yes, with VA and servicer approval — but the seller's entitlement generally stays tied to that loan, because there is no eligible buyer to substitute their own. That is the trade-off a veteran seller has to understand before agreeing.",
  },
  {
    question: "What is substitution of entitlement?",
    answer: VA_ENTITLEMENT_RESTORATION.substitution,
  },
  {
    question: "Do I still owe anything after someone assumes my VA loan?",
    answer:
      "Not automatically. On a VA loan the release has to come from both the loan holder and VA — VA's release addresses your liability to the Government. Neither one restores your entitlement; only substitution does. Get both named in writing before closing.",
  },
  {
    question: "Does the buyer pay a VA funding fee on an assumption?",
    answer:
      "Assumptions have their own fee treatment, which is not the same as the purchase funding-fee schedule. Confirm the current amount with the servicer and against current VA rules rather than assuming a purchase figure applies.",
  },
  {
    question: "Can I get my entitlement back without the buyer being a veteran?",
    answer: VA_ENTITLEMENT_RESTORATION.afterSale,
  },
]

export const metadata = articleMetadata({
  path,
  title: "VA Loan Assumption and What Happens to Entitlement",
  description:
    "A VA loan can often be assumed — but the seller's entitlement stays tied up unless an eligible buyer substitutes theirs and the VA approves a release of liability.",
  published: "2026-09-17",
  category: "Loan Programs",
  keywords: ["VA loan assumption", "substitution of entitlement", "VA release of liability"],
  faqs,
})

export default function VaLoanAssumptionPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "VA Loan Assumption and What Happens to Entitlement",
        description:
          "A VA loan can often be assumed — but the seller's entitlement stays tied up unless an eligible buyer substitutes theirs and the VA approves a release of liability.",
        published: "2026-09-17",
        category: "Loan Programs",
        bannerSubtitle: "Two things have to happen on a VA assumption: release of liability, and substitution of entitlement.",
        takeaways: [
          "A VA loan can often be assumed, including by a buyer who is not a veteran, with VA and servicer approval.",
          "For the seller, the risk is not the debt alone — it is entitlement. It generally stays tied to that loan unless an eligible buyer substitutes their own.",
          "Release of liability and substitution of entitlement are two separate approvals. Getting one does not give you the other.",
          "A veteran who sells by assumption without both can stay liable for the loan and be unable to use that entitlement on a next purchase.",
        ],
        faqs,
        keywords: ["VA assumption entitlement", "VA release of liability"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        VA loans are generally assumable, which makes them attractive when existing rates sit below new ones. For a
        veteran seller, though, the important question is not whether someone can take over the payment. It is what
        happens to the entitlement that made the loan possible. Snapshot as of {LENDING_FACTS_AS_OF}.{" "}
        {VA_ENTITLEMENT_RESTORATION.notADollar}
      </p>

      <h2>The mechanics are the same as any assumption</h2>
      <p>{LOAN_ASSUMPTION.whatItIs}</p>
      <p>
        {LOAN_ASSUMPTION.creditStillApplies} The buyer also covers the gap between price and remaining balance —{" "}
        {LOAN_ASSUMPTION.theEquityGap} The general mechanics are laid out in{" "}
        <Link href="/blog/how-fha-loan-assumption-works">how an FHA loan assumption works</Link>; what follows is what
        is specific to VA.
      </p>

      <h2>Entitlement is the part people miss</h2>
      <p>{VA_ENTITLEMENT_RESTORATION.substitution}</p>
      <p>
        It is worth seeing the contrast. Entitlement is restored the ordinary way when the prior VA loan is paid in full
        and the property is disposed of under VA rules. An assumption does neither — the loan survives, so restoration
        has to come from substitution by an eligible buyer, not from payoff. If you are trying to keep the first home
        and buy another, that is a different question again — see{" "}
        <Link href="/blog/va-entitlement-second-va-loan">a second VA loan</Link>.
      </p>

      <ArticleCallout variant="warning" title="Selling by assumption to a non-veteran">
        A buyer who is not VA-eligible can often still assume the loan, but has no entitlement to substitute. The
        seller's entitlement generally stays tied to that property until the loan is paid off. A veteran who plans to
        buy again should understand that before agreeing to an assumption, not after.
      </ArticleCallout>

      <h2>What a veteran seller should insist on</h2>
      <StepList
        steps={[
          {
            title: "Ask whether the buyer is VA-eligible",
            body: "It determines whether substitution of entitlement is even on the table. This is the single question that changes the outcome for you.",
          },
          {
            title: "Require a documented release of liability",
            body: LOAN_ASSUMPTION.releaseOfLiability,
          },
          {
            title: "Request substitution of entitlement in the same package",
            body: "Release of liability and substitution are separate approvals. Ask for both explicitly; do not assume one carries the other.",
          },
          {
            title: "Confirm the updated Certificate of Eligibility afterwards",
            body: (
              <>
                {VA_ENTITLEMENT_RESTORATION.afterSale} Verify what your COE says before you rely on that entitlement for
                a next purchase.
              </>
            ),
          },
        ]}
      />

      <h2>For the buyer</h2>
      <p>
        An assumption on a VA loan is a servicer process with its own timeline. {LOAN_ASSUMPTION.timing} Servicers
        generally expect the assuming buyer to occupy the property and will ask for an occupancy certification in the
        assumption package. Confirm that requirement with the servicer and against current VA policy rather than
        treating an assumption as a route to an investment property. Program overview:{" "}
        <Link href="/loans/va">VA loans</Link>.
      </p>
      <p>
        {VA_ENTITLEMENT_RESTORATION.fundingFee} Do not carry a purchase funding-fee percentage into an assumption
        conversation; ask the servicer what applies to this transaction.
      </p>

      <h2>What happens next</h2>
      <p>
        Get the servicer's assumption requirements in writing, and — if you are the veteran seller — get release of
        liability and substitution of entitlement named explicitly in what you agree to. {LOAN_ASSUMPTION.notAPromise} A
        loan officer can compare an assumption against a normal file:{" "}
        <Link href="/qualify">start a conversation</Link>.
      </p>
    </ArticleShell>
  )
}
