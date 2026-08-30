import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { DELAYED_FINANCING, HELOC_SEASONING, LENDING_FACTS_AS_OF, OCCUPANCY_TYPES } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/delayed-financing-after-cash-purchase"

const faqs = [
  {
    question: "Is delayed financing a federal waiting period I can calendar as a right?",
    answer: DELAYED_FINANCING.what,
  },
  {
    question: "Is this the same as tapping a HELOC after year two on a financed purchase?",
    answer: DELAYED_FINANCING.vsSeasoning,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "delayed", heading: "Delayed financing", href: "/refinance/cash-out" },
  { id: "seasoned", heading: "HELOC after seasoning", href: "/blog/heloc-after-year-two-vs-cash-out" },
  { id: "rental", heading: "Cash-out to buy a rental", href: "/blog/cash-out-to-buy-a-rental" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "fact",
    criterion: "Fact pattern",
    cells: {
      delayed: DELAYED_FINANCING.what,
      seasoned: HELOC_SEASONING.yearTwo,
      rental: "You already have a financed primary. You take cash out (or a HELOC) to buy another house as a rental.",
    },
  },
  {
    id: "lien",
    criterion: "What is on the house you just bought",
    cells: {
      delayed: "Typically no mortgage on that purchase. Title should show no existing liens on the subject.",
      seasoned: "You already have a first lien from the purchase. Seasoning overlays apply to a second or a cash-out.",
      rental: "The rental is a second property. Occupancy on each note has to match use.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Delayed Financing After a Cash Purchase",
  description:
    "Agency delayed-financing exception: cash purchase, then a cash-out later. Distinct from HELOC seasoning. Overlay is not a statute.",
  published: "2026-08-29",
  category: "Refinance",
  keywords: ["delayed financing exception", "cash purchase then mortgage", "Fannie delayed financing"],
  faqs,
})

export default function DelayedFinancingPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Delayed Financing After a Cash Purchase",
        description:
          "Agency delayed-financing exception: cash purchase, then a cash-out later. Overlay is not a statute.",
        published: "2026-08-29",
        category: "Refinance",
        bannerSubtitle: "Cash now, mortgage later — a published exception shape, not a guaranteed product.",
        faqs,
        keywords: ["delayed financing", "cash out after cash purchase"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Delayed financing is the agency conversation when you bought a house with cash — no mortgage on that
        purchase — and later want a cash-out on the same property. Fannie Mae publishes a delayed-financing exception
        in Selling Guide B2-1.3-03. That is a selling-guide exception, not a statute, and overlays can be tighter.
        Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{DELAYED_FINANCING.notInvented}</p>

      <h2>What the exception is trying to allow</h2>
      <p>{DELAYED_FINANCING.what}</p>
      <p>{DELAYED_FINANCING.docs}</p>
      <p>{DELAYED_FINANCING.loanAmount}</p>
      <p>{DELAYED_FINANCING.giftsAndBorrowed}</p>
      <p>{DELAYED_FINANCING.stillCashOut}</p>

      <h2>Not HELOC seasoning, not cash-out to buy a rental</h2>
      <ComparisonTable
        caption={`Delayed financing vs nearby equity conversations as of ${LENDING_FACTS_AS_OF}.`}
        columns={columns}
        rows={rows}
        footnote="Confirm the investor in force. This is not tax advice."
      />
      <p>
        {DELAYED_FINANCING.vsSeasoning} Named on{" "}
        <Link href="/blog/heloc-after-year-two-vs-cash-out">HELOC after year two vs cash-out</Link>. If the cash-out is
        to fund another house: <Link href="/blog/cash-out-to-buy-a-rental">cash-out to buy a rental</Link>. If you still
        live in your current home and the new house is the rental:{" "}
        <Link href="/blog/first-rental-occupancy-if-you-still-live-there">first rental occupancy</Link>.
      </p>
      <p>
        {OCCUPANCY_TYPES.fraud} Occupancy types:{" "}
        <Link href="/blog/second-home-vs-investment-occupancy">second home vs investment</Link>.
      </p>

      <h2>Scenarios</h2>
      <ul>
        <li>
          <strong>You paid cash from seasoned accounts, arm’s length, and want to replenish reserves.</strong> The
          exception conversation is about documented investment plus costs, not pulling out a new appraisal windfall.
        </li>
        <li>
          <strong>A parent gifted the purchase funds.</strong> {DELAYED_FINANCING.giftsAndBorrowed} Gift paper trail:{" "}
          <Link href="/blog/gift-funds-down-payment-rules">gift funds</Link>.
        </li>
        <li>
          <strong>You already financed the purchase.</strong> Delayed financing is the wrong page. Use{" "}
          <Link href="/blog/heloc-after-year-two-vs-cash-out">seasoning overlays</Link>.
        </li>
      </ul>

      <h2>What this page will not do</h2>
      <ul>
        <li>Invent an Ondo overlay or treat six months as a federal right you can calendar without the guide.</li>
        <li>Quote a cash-out LTV percent as if every file used the same number.</li>
        <li>Coach occupancy misrepresentation so a rental prices like a primary.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Keep the purchase Closing Disclosure and the source-of-funds statements from the cash closing.</li>
        <li>
          Commercial path: <Link href="/refinance/cash-out">cash-out refinance</Link>. Illustration:{" "}
          <Link href="/calculators/refinance">refinance calculator</Link>.
        </li>
        <li>
          Investment hub: <Link href="/learn/investment">occupancy and DSCR</Link>. Ask before you treat delayed
          financing as automatic.
        </li>
      </ol>
    </ArticleShell>
  )
}
