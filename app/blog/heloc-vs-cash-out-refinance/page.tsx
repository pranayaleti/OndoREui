import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { IsThisRightForMe } from "@/components/content/is-this-right-for-me"
import { LENDING_FACTS_AS_OF } from "@/lib/content"
import Link from "next/link"

const path = "/blog/heloc-vs-cash-out-refinance"

const faqs = [
  {
    question: "Is HELOC interest always tax-deductible?",
    answer:
      "It depends on how the funds are used and on current tax law. Ask a tax professional. This page is not tax advice.",
  },
  {
    question: "Does a HELOC reset my first-mortgage rate?",
    answer:
      "No. The first lien stays. That is the usual reason people compare a HELOC when the existing rate is worth keeping.",
  },
]

export const metadata = articleMetadata({
  path,
  title: "Cash-Out vs HELOC: Payment, Lien Position, and Tax Questions",
  description:
    "A cash-out refinance replaces the first lien. A HELOC sits in second position. Payment, rate risk, and tax questions differ. Not tax advice.",
  published: "2026-08-29",
  category: "Refinance",
  keywords: ["HELOC vs cash-out refinance", "cash-out vs home equity line"],
  faqs,
})

export default function HelocVsCashoutPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Cash-Out vs HELOC: Payment, Lien Position, and Tax Questions",
        description:
          "A cash-out refinance replaces the first lien. A HELOC sits in second position. Payment, rate risk, and tax questions differ. Not tax advice.",
        published: "2026-08-29",
        category: "Refinance",
        bannerSubtitle: "Same equity. Different lien, payment, and rate risk.",
        faqs,
        keywords: ["HELOC vs cash-out", "home equity line vs refinance"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A cash-out refinance replaces your first mortgage with a larger one and wires the difference. A HELOC leaves
        the first mortgage in place and adds a second lien you can draw. Payment, rate risk, and tax questions are
        not the same. Snapshot as of {LENDING_FACTS_AS_OF}. This is not tax advice and not a recommendation to take
        cash out.
      </p>

      <IsThisRightForMe table="equity" />

      <h2>Decision framework</h2>
      <ul>
        <li>
          <strong>Keep a low first-lien rate, need draws over time.</strong> HELOC is usually the comparison.{" "}
          <Link href="/loans/heloc">HELOC overview</Link>.
        </li>
        <li>
          <strong>Want one payment and a new first-lien rate or term.</strong> Cash-out (or rate-and-term if you do
          not need cash). <Link href="/refinance/cash-out">Cash-out</Link>.
        </li>
        <li>
          <strong>Need a lump sum larger than a comfortable second lien.</strong> Cash-out LTV overlays still apply.
        </li>
      </ul>
      <p>
        If the goal is a lower rate without cash, that is{" "}
        <Link href="/blog/refinance-break-even-when-lower-rate-loses">break-even math</Link>, not this comparison.
      </p>

      <h2>What happens next</h2>
      <p>
        Model payment change in the <Link href="/calculators/refinance">refinance calculator</Link> for a first-lien
        refinance. A HELOC payment depends on the draw and index — ask for a structured comparison, not a slogan.
      </p>
    </ArticleShell>
  )
}
