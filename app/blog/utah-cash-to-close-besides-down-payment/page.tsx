import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import {
  EXAMPLE_NOTE,
  EXAMPLE_PURCHASE_PRICE_UTAH,
  LENDING_FACTS_AS_OF,
  UTAH_CLOSING_NOTES,
} from "@/lib/content"
import Link from "next/link"

const path = "/blog/utah-cash-to-close-besides-down-payment"

const faqs = [
  {
    question: "Is 3.5% down the amount I need in the bank?",
    answer:
      "No. Down payment is one line. Earnest money, origination or lender fees, title/escrow, recording, prepaid taxes and insurance, and any reserves still have to be sourced. Seller concessions can offset some costs within program caps.",
  },
  {
    question: "Does earnest money count toward down payment?",
    answer:
      "It is usually credited at closing toward funds you already owe. You still needed those dollars available when you wrote the offer. Timing and the REPC control when it leaves your account.",
  },
]

export const metadata = articleMetadata({
  path,
  title: "How Much Cash Do I Need Besides Down Payment in Utah?",
  description:
    "Earnest money, title, origination, prepaids, and reserves sit on top of down payment. Utah closings vary by county and title company.",
  published: "2026-08-29",
  category: "First-Time Buyers",
  keywords: ["Utah cash to close", "first time buyer closing costs besides down payment"],
  faqs,
})

export default function CashToClosePage() {
  const price = EXAMPLE_PURCHASE_PRICE_UTAH.toLocaleString("en-US")
  const fhaDown = Math.round(EXAMPLE_PURCHASE_PRICE_UTAH * 0.035).toLocaleString("en-US")

  return (
    <ArticleShell
      meta={{
        path,
        title: "How Much Cash Do I Need Besides Down Payment in Utah?",
        description:
          "Earnest money, title, origination, prepaids, and reserves sit on top of down payment. Utah closings vary by county and title company.",
        published: "2026-08-29",
        category: "First-Time Buyers",
        bannerSubtitle: "Down payment is the line everyone quotes. Cash to close is the file.",
        faqs,
        keywords: ["Utah cash to close", "cash besides down payment"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Besides down payment, you typically need earnest money, closing costs, and prepaids — and sometimes reserves.
        On a ${price} illustration, {`3.5%`} down is ${fhaDown}. That is not cash to close. {EXAMPLE_NOTE} Snapshot as
        of {LENDING_FACTS_AS_OF}.
      </p>

      <h2>The cash stack, in order</h2>
      <ol>
        <li>
          <strong>Earnest money.</strong> Due per the Utah REPC. Usually credited at closing, not extra forever, but it
          leaves your account when you go under contract. Three lines:{" "}
          <Link href="/blog/earnest-money-vs-down-payment-vs-closing-costs">
            earnest vs down payment vs closing costs
          </Link>
          .
        </li>
        <li>
          <strong>Down payment.</strong> Program minimums differ. Gift funds and DPA can fill this line when documented.
          See <Link href="/blog/gift-funds-down-payment-rules">gift funds</Link> and{" "}
          <Link href="/blog/dpa-stacked-with-fha-gift-funds">DPA stacked with an FHA gift</Link>.
        </li>
        <li>
          <strong>Origination and lender fees.</strong> Can show as a fee or a lender credit. Credits reduce cash; they
          are usually paid for in rate.
        </li>
        <li>
          <strong>Title, escrow, and recording.</strong> {UTAH_CLOSING_NOTES.closingVenue}{" "}
          {UTAH_CLOSING_NOTES.titleVaries} Details:{" "}
          <Link href="/blog/utah-closing-costs-title-origination-prepaids">Utah closing costs</Link>.
        </li>
        <li>
          <strong>Prepaids.</strong> Homeowners insurance, prepaid interest, and tax impounds.{" "}
          {UTAH_CLOSING_NOTES.taxCalendar}
        </li>
        <li>
          <strong>Reserves.</strong> Some programs and overlays want months of PITI left after closing. That is still
          cash even if it stays in your account. See{" "}
          <Link href="/blog/mortgage-reserves-months-of-pitia">mortgage reserves (months of PITIA)</Link>.
        </li>
      </ol>

      <h2>Utah-specific, without cloning city pages</h2>
      <p>
        {UTAH_CLOSING_NOTES.transferTax} Recording and tax amounts still differ in{" "}
        <Link href="/loans/salt-lake-city">Salt Lake City</Link>, <Link href="/loans/lehi">Lehi</Link>,{" "}
        <Link href="/loans/provo">Provo</Link>, and <Link href="/loans/draper">Draper</Link>. Those landings are market
        context, not a second set of fee tables.
      </p>

      <h2>What happens next</h2>
      <p>
        Use the <Link href="/calculators/closing-cost">closing-cost calculator</Link> for a range, then ask for a Loan
        Estimate. Compare cash to close on that form, not a blog illustration. First-time program overview:{" "}
        <Link href="/buy/first-time">first-time buyers</Link>.
      </p>
    </ArticleShell>
  )
}
