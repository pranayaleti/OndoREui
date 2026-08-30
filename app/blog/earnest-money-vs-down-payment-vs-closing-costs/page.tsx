import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { EARNEST_VS_DOWN_VS_CLOSING, LENDING_FACTS_AS_OF, UTAH_REPC } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/earnest-money-vs-down-payment-vs-closing-costs"

const faqs = [
  {
    question: "Is earnest money extra cash on top of down payment?",
    answer: EARNEST_VS_DOWN_VS_CLOSING.earnest,
  },
  {
    question: "If I miss a Utah REPC deadline, is earnest money automatically refunded?",
    answer: `${UTAH_REPC.financingAppraisal} ${UTAH_REPC.notLegalAdvice}`,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "earnest", heading: "Earnest money" },
  { id: "down", heading: "Down payment" },
  { id: "closing", heading: "Closing costs + prepaids" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      earnest: EARNEST_VS_DOWN_VS_CLOSING.earnest,
      down: EARNEST_VS_DOWN_VS_CLOSING.down,
      closing: EARNEST_VS_DOWN_VS_CLOSING.closing,
    },
  },
  {
    id: "when",
    criterion: "When the cash typically moves",
    cells: {
      earnest: "When the REPC is executed, per the contract. Utah performance times are usually 5:00 p.m. Mountain Time.",
      down: "At closing, minus the earnest credit (and any gift/DPA that lands on this line).",
      closing: "At closing on the Loan Estimate / Closing Disclosure cash-to-close. Seller concessions can offset some of this stack within program caps.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Earnest Money vs Down Payment vs Closing Costs",
  description:
    "Three different cash lines. Earnest money is usually credited at closing. Timing and the Utah REPC still matter. Not legal advice.",
  published: "2026-08-29",
  category: "First-Time Buyers",
  keywords: ["earnest money vs down payment", "closing costs vs down payment Utah", "REPC earnest money"],
  faqs,
})

export default function EarnestVsDownVsClosingPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Earnest Money vs Down Payment vs Closing Costs",
        description:
          "Three different cash lines. Earnest money is usually credited at closing. Timing and the Utah REPC still matter. Not legal advice.",
        published: "2026-08-29",
        category: "First-Time Buyers",
        bannerSubtitle: "Earnest money is timing. Down payment is equity. Closing costs are fees and prepaids.",
        faqs,
        keywords: ["earnest money Utah", "down payment vs closing costs"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Earnest money, down payment, and closing costs are three different cash lines. Earnest money is a deposit with
        the purchase contract and is usually credited at closing toward funds you already owe — it is not a fourth pile
        of cash forever, and it is not automatically extra on top of down payment. Snapshot as of {LENDING_FACTS_AS_OF}.
        Not legal advice.
      </p>
      <p>{EARNEST_VS_DOWN_VS_CLOSING.timing}</p>

      <h2>Three lines, not one lump</h2>
      <ComparisonTable
        caption={`Earnest vs down vs closing costs as of ${LENDING_FACTS_AS_OF}. Confirm the REPC you signed.`}
        columns={columns}
        rows={rows}
        footnote="Educational snapshot. Program caps on seller concessions differ for FHA, conventional, VA, and USDA."
      />

      <h2>How this fits Utah cash to close</h2>
      <p>
        The stack (earnest, down, title, origination, prepaids, sometimes reserves) is mapped in{" "}
        <Link href="/blog/utah-cash-to-close-besides-down-payment">how much cash besides down payment</Link>. Title,
        origination, and prepaid ranges:{" "}
        <Link href="/blog/utah-closing-costs-title-origination-prepaids">Utah closing costs</Link>. Reserves are remaining
        assets after that stack: <Link href="/blog/mortgage-reserves-months-of-pitia">months of PITIA</Link>.
      </p>

      <h2>The REPC can put earnest money at risk</h2>
      <p>
        {UTAH_REPC.timeOfEssence} Due diligence and financing are separate clocks:{" "}
        <Link href="/blog/utah-repc-deadline-and-your-loan">what a Utah REPC deadline does to your loan</Link>.{" "}
        {UTAH_REPC.lenderNotAParty}
      </p>
      <p>{UTAH_REPC.notLegalAdvice}</p>

      <h2>Scenario: $8,000 earnest on a first purchase</h2>
      <ul>
        <li>Those dollars leave your account when you go under contract.</li>
        <li>At closing they typically reduce cash to close. You still needed down payment and costs as well.</li>
        <li>
          Gift funds that arrive after earnest is already wired still need a paper trail:{" "}
          <Link href="/blog/gift-funds-down-payment-rules">gift-fund rules</Link>.
        </li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Budget cash to close, not only the down-payment percent on a flyer.</li>
        <li>
          Use the <Link href="/calculators/closing-cost">closing-cost calculator</Link> for a range, then read cash to
          close on a Loan Estimate.
        </li>
        <li>
          Hub: <Link href="/learn/first-time">first-time cash, assistance, and closing</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
