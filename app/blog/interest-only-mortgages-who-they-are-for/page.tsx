import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { ARM_CAPS, INTEREST_ONLY, LENDING_FACTS_AS_OF, TEMPORARY_BUYDOWN } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/interest-only-mortgages-who-they-are-for"

const faqs = [
  {
    question: "Is interest-only a teaser rate?",
    answer: INTEREST_ONLY.notTeaser,
  },
  {
    question: "What is payment shock on an IO loan?",
    answer: INTEREST_ONLY.paymentShock,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "io", heading: "Interest-only" },
  { id: "arm", heading: "ARM (amortizing)", href: "/buy/adjustable-rate" },
  { id: "buydown", heading: "Temporary buydown", href: "/blog/temporary-buydown-who-pays-year-three" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it changes",
    cells: {
      io: INTEREST_ONLY.what,
      arm: ARM_CAPS.notation,
      buydown: TEMPORARY_BUYDOWN.twoOne,
    },
  },
  {
    id: "end",
    criterion: "When the payment can jump",
    cells: {
      io: INTEREST_ONLY.paymentShock,
      arm: ARM_CAPS.paymentNote,
      buydown: TEMPORARY_BUYDOWN.yearThree,
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Interest-Only Mortgages: Who They Are For, Who They Hurt",
  description:
    "IO payments skip scheduled principal for a stated period. Payment shock when amortization starts is the risk. Not a teaser-rate promise.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["interest only mortgage", "IO payment shock", "interest-only vs ARM"],
  faqs,
})

export default function InterestOnlyMortgagesPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Interest-Only Mortgages: Who They Are For, Who They Hurt",
        description:
          "IO skips scheduled principal for a stated period. Payment shock is the risk. Not a teaser-rate promise.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "A lower required payment is not the same as a lower note rate, and it is not forever.",
        faqs,
        keywords: ["interest-only mortgage", "IO vs ARM"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        An interest-only mortgage is for borrowers who can document a plan for the fully amortizing payment when the IO
        period ends — typically jumbo or portfolio overlays, not a standard conforming 30-year you can assume. It hurts
        anyone who budgets only the interest draft and treats IO as a teaser that never ends. Snapshot as of{" "}
        {LENDING_FACTS_AS_OF}.
      </p>
      <p>{INTEREST_ONLY.notAPromise}</p>

      <h2>What interest-only is</h2>
      <p>{INTEREST_ONLY.what}</p>
      <p>{INTEREST_ONLY.whoFor}</p>
      <ComparisonTable
        caption={`IO vs ARM vs temporary buydown as of ${LENDING_FACTS_AS_OF}. Not a rate quote.`}
        columns={columns}
        rows={rows}
        footnote="Some ARMs are also IO. Caps and IO are still different machines."
      />

      <h2>Payment shock</h2>
      <p>{INTEREST_ONLY.paymentShock}</p>
      <ul>
        <li>Write down the fully amortizing P&amp;I the note describes after IO — not only year-one interest.</li>
        <li>Add taxes, insurance, HOA, and mortgage insurance. Those lines are not capped by an IO schedule.</li>
        <li>
          Extra principal during IO is optional. It is not the same as a recast or a refinance. See{" "}
          <Link href="/blog/recast-vs-refinance">recast vs refinance</Link>.
        </li>
      </ul>

      <h2>Not a teaser, not an ARM slogan</h2>
      <p>{INTEREST_ONLY.notTeaser}</p>
      <p>
        {INTEREST_ONLY.vsArm} Cap structure:{" "}
        <Link href="/blog/arm-caps-in-plain-english">ARM caps in plain English</Link>. Commercial ARM overview:{" "}
        <Link href="/buy/adjustable-rate">adjustable-rate mortgages</Link>. Why a news average is not your quote:{" "}
        <Link href="/buy/rates">rates hub</Link>.
      </p>

      <h2>Who it is for vs who it hurts</h2>
      <ul>
        <li>
          <strong>Often in the conversation:</strong> high cash-flow files, jumbo/portfolio overlays, borrowers who
          will sell or refinance with eyes open before amortization starts — still run{" "}
          <Link href="/blog/refinance-break-even-when-lower-rate-loses">break-even after costs</Link> if a refinance is
          the plan.
        </li>
        <li>
          <strong>Often a poor fit:</strong> stretching to the IO draft on a first home, treating IO as “the best rate,”
          or ignoring the reset. Jumbo context: <Link href="/loans/jumbo">jumbo loans</Link>.
        </li>
      </ul>

      <h2>What this page will not do</h2>
      <ul>
        <li>Quote an IO start rate or a payment.</li>
        <li>Promise that Ondo or any investor will originate IO on your file.</li>
        <li>Call IO a teaser, a buydown, or a forever-low payment.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>On any Loan Estimate, find whether the payment is IO or fully amortizing, and for how long.</li>
        <li>
          Illustrate P&amp;I on the <Link href="/calculators/mortgage-payment">payment calculator</Link> using the
          post-IO payment, not only the IO draft.
        </li>
        <li>
          Talk through overlays: <Link href="/qualify">start a mortgage conversation</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
