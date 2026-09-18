import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ArticleCallout } from "@/components/content/article-callout"
import { ProsCons } from "@/components/content/pros-cons"
import { LENDING_FACTS_AS_OF, SELLER_CONCESSIONS } from "@/lib/content"
import Link from "next/link"

const path = "/blog/seller-concessions-what-they-cover"

const faqs = [
  {
    question: "Can a seller credit cover my down payment?",
    answer: SELLER_CONCESSIONS.notDownPayment,
  },
  {
    question: "Is there a limit on how much the seller can pay?",
    answer: SELLER_CONCESSIONS.capped,
  },
  {
    question: "What happens if we agree to more than the cap?",
    answer:
      "It does not simply get paid anyway. Depending on the program the excess is either disallowed and reallocated at closing or — on FHA, where an over-limit contribution is treated as an inducement to purchase — subtracted from the value used to size the loan, which cuts the loan amount as well. Either way the buyer is short at the table, and by more than the excess in the second case. Get the applicable limit from the loan officer before the concession goes into the contract.",
  },
  {
    question: "Is a seller credit better than a lower price?",
    answer:
      "It depends on what the buyer is short on. A credit helps a buyer who has the down payment but not the closing costs. A price reduction helps a buyer constrained by the loan amount or the appraisal. They are not interchangeable.",
  },
  {
    question: "Can we raise the price to fund the credit?",
    answer: SELLER_CONCESSIONS.priceInteraction,
  },
]

export const metadata = articleMetadata({
  path,
  title: "Seller Concessions: What They Can and Cannot Pay For",
  description:
    "A seller credit can cover closing costs, prepaids, and a rate buydown — not the down payment. Every program caps the amount, and the cap depends on the file.",
  published: "2026-09-17",
  category: "First-Time Buyers",
  keywords: ["seller concessions", "seller paid closing costs", "seller credit limits"],
  faqs,
})

export default function SellerConcessionsPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Seller Concessions: What They Can and Cannot Pay For",
        description:
          "A seller credit can cover closing costs, prepaids, and a rate buydown — not the down payment. Every program caps the amount, and the cap depends on the file.",
        published: "2026-09-17",
        category: "First-Time Buyers",
        bannerSubtitle: "A credit is negotiated in the contract but spent under program rules.",
        takeaways: [
          "A seller concession is a credit at closing toward closing costs, prepaids, or a rate buydown. It is negotiated in the contract and spent under program rules.",
          "It generally cannot go toward the down payment on agency financing. A buyer short there needs something else, such as documented gift funds.",
          "Every program caps the contribution, and the cap moves with program, occupancy, and loan-to-value — so the number belongs in the offer after a loan officer confirms it, not before.",
          "Raising the price to fund a credit changes the loan amount and still has to appraise at the higher figure.",
        ],
        faqs,
        keywords: ["seller concessions cap", "seller paid closing costs Utah"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Asking the seller to cover costs is one of the most common moves in a negotiation, and one of the easiest to
        write incorrectly. The contract can say anything the parties agree to. What actually gets paid at closing is
        decided by the program. Snapshot as of {LENDING_FACTS_AS_OF}. {SELLER_CONCESSIONS.notAPromise}
      </p>

      <h2>What a concession is</h2>
      <p>{SELLER_CONCESSIONS.whatItIs}</p>
      <p>
        That is the whole mechanism — money moving from the seller's side of the settlement statement to the buyer's
        costs. It is not a discount applied to the loan, and it does not reduce the amount being borrowed.
      </p>

      <h2>What it can pay for</h2>
      <p>
        Closing costs, prepaids, and a rate buydown are the usual targets. Those are the lines described in{" "}
        <Link href="/blog/utah-closing-costs-title-origination-prepaids">Utah closing costs</Link> and{" "}
        <Link href="/blog/utah-cash-to-close-besides-down-payment">cash to close</Link>.
      </p>
      <p>{SELLER_CONCESSIONS.buydownUse}</p>

      <ArticleCallout variant="warning" title="Not the down payment">
        {SELLER_CONCESSIONS.notDownPayment} This is the single most common misunderstanding about concessions, and it
        surfaces late — usually when cash to close is being finalised. If the down payment is the gap, look at{" "}
        <Link href="/blog/gift-funds-down-payment-rules">gift funds</Link> instead.
      </ArticleCallout>

      <h2>The cap</h2>
      <p>{SELLER_CONCESSIONS.capped}</p>
      <p>
        We deliberately do not print a percentage here. Caps differ across programs and move with occupancy and
        loan-to-value, and a stale number in a blog post is exactly how an offer gets written wrong. Ask the loan
        officer for the cap that applies to this file before the concession goes into the contract.
      </p>

      <h2>Credit or price reduction?</h2>
      <ProsCons
        prosHeading="A credit tends to help when"
        consHeading="A price reduction tends to help when"
        pros={[
          "The buyer has the down payment but is short on closing costs and prepaids.",
          "The parties want to fund a rate buydown rather than move the price.",
          "Cash at the table is the binding constraint, not the loan amount.",
        ]}
        cons={[
          "The appraisal is the constraint — a lower price is a lower value to support.",
          "The concession would exceed the program cap anyway.",
          "The buyer will hold the loan a long time, where a permanently lower balance can outweigh a one-time credit.",
        ]}
      />
      <p>{SELLER_CONCESSIONS.priceInteraction}</p>

      <h2>What happens next</h2>
      <p>
        Before the offer goes out, get the applicable cap and a rough closing-cost figure from the loan officer so the
        concession you ask for is one that can actually be paid. If the appraisal is the real risk, read{" "}
        <Link href="/blog/appraisal-comes-in-low">when the appraisal comes in low</Link>.{" "}
        <Link href="/qualify">Start a conversation</Link>.
      </p>
    </ArticleShell>
  )
}
