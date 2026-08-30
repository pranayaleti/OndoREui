import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { BreakEvenTable } from "@/components/content/break-even-table"
import { BIWEEKLY_VS_REFI, LENDING_FACTS_AS_OF, RECAST_VS_REFI } from "@/lib/content"
import Link from "next/link"

const path = "/blog/recast-vs-refinance"

const faqs = [
  {
    question: "Does a recast lower the interest rate?",
    answer: RECAST_VS_REFI.recast,
  },
  {
    question: "Is a recast cheaper than refinancing?",
    answer: RECAST_VS_REFI.feeVsCosts,
  },
]

export const metadata = articleMetadata({
  path,
  title: "Recast vs Refinance",
  description:
    "A recast re-amortizes the same note after a principal curtailment. A refinance is a new loan with costs. Compare the fee vs break-even. Not a savings quote.",
  published: "2026-08-29",
  category: "Refinance",
  keywords: ["recast vs refinance", "mortgage recast fee", "principal curtailment recast"],
  faqs,
})

export default function RecastVsRefinancePage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Recast vs Refinance",
        description:
          "Recast keeps the rate and re-spreads the payment after a lump sum. Refinance changes the note. Not a savings quote.",
        published: "2026-08-29",
        category: "Refinance",
        bannerSubtitle: "A recast fee is not closing costs, and a refinance is not a recast.",
        faqs,
        keywords: ["mortgage recast vs refinance", "re-amortization"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Recast versus refinance is a cost-and-rate question: a recast keeps your note rate and lowers the required
        payment after you send a principal curtailment; a refinance buys a different rate or term and has to earn its
        closing costs back. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{RECAST_VS_REFI.notAQuote}</p>

      <h2>What a recast does</h2>
      <p>{RECAST_VS_REFI.recast}</p>
      <p>{RECAST_VS_REFI.whoAllows}</p>
      <p>{RECAST_VS_REFI.vsBiweekly}</p>
      <p>
        Extra principal without a recast:{" "}
        <Link href="/blog/biweekly-extra-principal-vs-refinance">biweekly vs refinance</Link>. Tactics overview:{" "}
        <Link href="/blog/mortgage-paydown-hacks">mortgage pay-down hacks</Link>. {BIWEEKLY_VS_REFI.extraPrincipal}
      </p>

      <h2>What a refinance does</h2>
      <p>{RECAST_VS_REFI.refinance}</p>
      <p>
        Deep math:{" "}
        <Link href="/blog/refinance-break-even-when-lower-rate-loses">when a lower rate still loses after costs</Link>.
        Lender-credit files:{" "}
        <Link href="/blog/no-closing-cost-refinance-rate-credit-tradeoff">“no closing cost” refinance</Link>.
      </p>

      <h2>Reusable comparison (same table as the refinance hub)</h2>
      <BreakEvenTable table="recast-vs-refi" />
      <p>{RECAST_VS_REFI.feeVsCosts}</p>

      <h2>Stay-horizon illustrations if you refinance instead</h2>
      <BreakEvenTable table="stay-scenarios" />

      <h2>Checklist before you ask for either</h2>
      <ul>
        <li>Do you like the current note rate? If yes, recast or extra principal is usually the first conversation.</li>
        <li>Will the servicer recast this investor and this product? Ask in writing.</li>
        <li>If you want a lower rate, put points and origination into break-even — not just the appraisal.</li>
        <li>A lump sum that you need later for reserves or another purchase is not “free” recast money.</li>
      </ul>

      <h2>What this page will not do</h2>
      <ul>
        <li>Quote a recast fee, a new rate, or interest saved.</li>
        <li>Clone a standalone “recast after a lump sum” how-to (a different matrix item if written later).</li>
        <li>Promise that every servicer recasts FHA, VA, or ARM notes.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Ask the servicer whether a recast is allowed and what the fee is — on your note, not a blog.</li>
        <li>
          If you are shopping a refinance, use the{" "}
          <Link href="/calculators/refinance">refinance calculator</Link> and the stay-horizon table above.
        </li>
        <li>
          Program hub: <Link href="/refinance">refinance</Link>. A conversation is not approval:{" "}
          <Link href="/qualify">qualify</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
