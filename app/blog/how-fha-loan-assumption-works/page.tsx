import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ArticleCallout } from "@/components/content/article-callout"
import { ProsCons } from "@/components/content/pros-cons"
import { StepList } from "@/components/content/step-list"
import {
  EXAMPLE_NOTE,
  EXAMPLE_PURCHASE_PRICE_UTAH,
  LENDING_FACTS_AS_OF,
  LOAN_ASSUMPTION,
} from "@/lib/content"
import Link from "next/link"

const path = "/blog/how-fha-loan-assumption-works"

const faqs = [
  {
    question: "Do I still have to qualify to assume an FHA loan?",
    answer: LOAN_ASSUMPTION.creditStillApplies,
  },
  {
    question: "Is an assumption cheaper than a new loan?",
    answer:
      "Not automatically. The rate may be lower, but you still have to cover the gap between the price and the remaining balance. On a seasoned loan that gap is often larger than a normal down payment, so the cash required can be higher even when the payment is lower.",
  },
  {
    question: "Does assuming an FHA loan get rid of the mortgage insurance?",
    answer: LOAN_ASSUMPTION.mipContinues,
  },
  {
    question: "Can I assume an FHA loan as a rental or second home?",
    answer: LOAN_ASSUMPTION.occupancy,
  },
  {
    question: "How long does an assumption take?",
    answer: LOAN_ASSUMPTION.timing,
  },
  {
    question: "Is the seller off the hook once I assume the loan?",
    answer: LOAN_ASSUMPTION.releaseOfLiability,
  },
]

export const metadata = articleMetadata({
  path,
  title: "How an FHA Loan Assumption Actually Works",
  description:
    "Assuming an FHA loan transfers the existing rate and balance to the buyer. You still qualify, you still cover the equity gap, and the mortgage insurance travels with the loan.",
  published: "2026-09-17",
  category: "Loan Programs",
  keywords: ["FHA loan assumption", "assumable FHA mortgage", "how to assume an FHA loan"],
  faqs,
})

export default function FhaLoanAssumptionPage() {
  const price = EXAMPLE_PURCHASE_PRICE_UTAH.toLocaleString("en-US")
  const balance = Math.round(EXAMPLE_PURCHASE_PRICE_UTAH * 0.6).toLocaleString("en-US")
  const gap = Math.round(EXAMPLE_PURCHASE_PRICE_UTAH * 0.4).toLocaleString("en-US")

  return (
    <ArticleShell
      meta={{
        path,
        title: "How an FHA Loan Assumption Actually Works",
        description:
          "Assuming an FHA loan transfers the existing rate and balance to the buyer. You still qualify, you still cover the equity gap, and the mortgage insurance travels with the loan.",
        published: "2026-09-17",
        category: "Loan Programs",
        bannerSubtitle: "The rate travels with the loan. So does the mortgage insurance — and so does the underwriting.",
        takeaways: [
          "An assumption transfers the existing loan to the buyer on its existing terms. The rate, remaining term, and balance travel with it.",
          "You still qualify. On FHA loans originated since December 1, 1986, the servicer reviews credit, income, and debts and can decline.",
          "The cash is the catch: you cover the gap between the price and the remaining balance, which on a seasoned loan is often larger than a normal down payment.",
          "Assuming an FHA loan does not reset or remove its annual mortgage insurance, and FHA assumptions generally require you to occupy the home.",
        ],
        faqs,
        keywords: ["FHA loan assumption", "assumable mortgage Utah"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        When existing loans carry rates below what is available on a new loan, assuming one starts to look attractive.
        An FHA assumption is a real path, not a loophole — and it has a specific cost structure that decides whether it
        helps your file. Snapshot as of {LENDING_FACTS_AS_OF}. {LOAN_ASSUMPTION.notAPromise}
      </p>

      <h2>What an assumption actually is</h2>
      <p>{LOAN_ASSUMPTION.whatItIs}</p>
      <p>{LOAN_ASSUMPTION.whichLoansTypical}</p>

      <h2>Who can assume an FHA loan</h2>
      <p>{LOAN_ASSUMPTION.creditStillApplies}</p>
      <p>
        {LOAN_ASSUMPTION.occupancy} That makes an assumption a different conversation from buying a rental — occupancy
        is a program rule here, not a label you pick. See{" "}
        <Link href="/blog/second-home-vs-investment-occupancy">second home vs investment occupancy</Link>.
      </p>
      <p>
        Credit standards on an assumption come from a servicer creditworthiness review against FHA's requirements plus
        the servicer's own — not from the purchase down-payment matrix. An assuming buyer makes no down payment, so a
        minimum-score-and-down-payment figure from a purchase page does not transfer to this conversation. Program
        overview: <Link href="/loans/fha">FHA loans</Link>.
      </p>

      <h2>The step-by-step process</h2>
      <StepList
        steps={[
          {
            title: "Confirm the loan is actually assumable",
            body: (
              <>
                Ask the seller for the servicer's name and the note. Whether the loan may be assumed is set by the note
                and the program, not by what the listing says.
              </>
            ),
          },
          {
            title: "Contact the servicer's assumption department",
            body: "This is a separate process from a normal origination, with its own packet and its own queue. Ask what they require and how long it typically takes.",
          },
          {
            title: "Work out how you will cover the equity gap",
            body: "Price minus the remaining balance is yours to cover, in cash or through other financing. Settle this before you write an offer, not after.",
          },
          {
            title: "Submit the application and documents",
            body: (
              <>
                Expect an income, credit, and debt review to program standards — the same stack described in{" "}
                <Link href="/blog/how-underwriters-verify-income">how underwriters verify income</Link>.
              </>
            ),
          },
          {
            title: "Get the release of liability in writing",
            body: LOAN_ASSUMPTION.releaseOfLiability,
          },
        ]}
      />

      <h2>What it costs: the equity gap</h2>
      <p>{LOAN_ASSUMPTION.theEquityGap}</p>
      <p>
        Illustration: on a ${price} purchase where the seller owes ${balance}, the buyer covers roughly ${gap} to
        assume — before closing costs. That is the number that decides whether an assumption is available to you, and
        it has nothing to do with how good the rate is. {EXAMPLE_NOTE}
      </p>
      <p>
        {LOAN_ASSUMPTION.mipContinues} How FHA mortgage insurance ends is a separate question:{" "}
        <Link href="/blog/mip-vs-pmi-how-mortgage-insurance-ends">MIP vs PMI</Link>. What else sits on top of the
        down payment: <Link href="/blog/utah-cash-to-close-besides-down-payment">Utah cash to close</Link>.
      </p>

      <h2>Assumption vs a new loan</h2>
      <ProsCons
        prosHeading="An assumption can help when"
        consHeading="A new loan is usually simpler when"
        pros={[
          "The existing rate is meaningfully below what a new loan would carry, and you will hold the loan long enough for that to matter.",
          "You have the cash to cover the equity gap without straining reserves.",
          "You will occupy the property, so the FHA occupancy rule is not a problem.",
        ]}
        cons={[
          "The equity gap is larger than the cash you have, which is the usual reason assumptions fall apart.",
          "You need to close on a predictable timeline — servicer assumption queues are not an origination pipeline.",
          "You want the loan structured around your file: term, mortgage insurance, and product are fixed on an assumption.",
        ]}
      />

      <h2>Pitfalls worth knowing before you offer</h2>
      <ArticleCallout variant="pitfall" title="A low rate is not a low cash requirement">
        The headline on an assumption is always the rate. The number that decides whether you can do it is the gap
        between price and balance. A well-seasoned loan with an attractive rate is often the one with the largest gap,
        because the seller has paid the balance down and the property has appreciated.
      </ArticleCallout>

      <ArticleCallout variant="warning" title="Sellers: liability does not transfer by itself">
        {LOAN_ASSUMPTION.releaseOfLiability} On a VA loan there is a second step as well — entitlement. See{" "}
        <Link href="/blog/va-loan-assumption-entitlement">VA loan assumption and entitlement</Link>.
      </ArticleCallout>

      <h2>What happens next</h2>
      <p>
        Get the servicer's assumption packet and the remaining balance in writing, then price a normal FHA or
        conventional file next to it. An assumption is worth pursuing when the cash works — not because the rate looks
        good. A loan officer can run both: <Link href="/qualify">start a conversation</Link>. {LOAN_ASSUMPTION.timing}
      </p>
    </ArticleShell>
  )
}
