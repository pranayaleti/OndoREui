import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { ARM_CAPS, LENDING_FACTS_AS_OF } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/arm-caps-in-plain-english"

const faqs = [
  {
    question: "What does 2/1/5 mean on an ARM?",
    answer: `${ARM_CAPS.notation} In that example, the first adjustment can move up to 2 points, later adjustments up to 1 point each, and the rate cannot rise more than 5 points above the start rate.`,
  },
  {
    question: "Do caps protect my full monthly payment?",
    answer: ARM_CAPS.paymentNote,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "initial", heading: "Initial cap" },
  { id: "periodic", heading: "Periodic cap" },
  { id: "lifetime", heading: "Lifetime cap" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "meaning",
    criterion: "What it limits",
    cells: {
      initial: ARM_CAPS.initial,
      periodic: ARM_CAPS.periodic,
      lifetime: ARM_CAPS.lifetime,
    },
  },
  {
    id: "example",
    criterion: "Example on a 5/1 ARM starting at a 6% note rate (illustration only)",
    cells: {
      initial: "With a 2-point initial cap, the first adjustment cannot take the note above 8% from that start rate.",
      periodic: "With a 1-point periodic cap, later annual changes cannot jump more than 1 point at a time.",
      lifetime: "With a 5-point lifetime cap, the note cannot exceed 11% no matter what the index does.",
    },
  },
  {
    id: "not",
    criterion: "What it is not",
    cells: {
      initial: "Not a promise the rate will rise, fall, or stay. Not a payment cap.",
      periodic: "Not a cap on taxes, insurance, or HOA.",
      lifetime: "Not a quote, lock, or APR. Not ‘the best ARM structure.’",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "ARM Caps in Plain English",
  description:
    "Initial, periodic, and lifetime caps are percentage-point limits on the note rate — not a payment promise.",
  published: "2026-08-29",
  category: "Mortgages",
  keywords: ["ARM caps explained", "2/1/5 ARM", "adjustable rate cap initial periodic lifetime"],
  faqs,
})

export default function ArmCapsPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "ARM Caps in Plain English",
        description:
          "Initial, periodic, and lifetime caps are percentage-point limits on the note rate — not a payment promise.",
        published: "2026-08-29",
        category: "Mortgages",
        bannerSubtitle: "Read the three numbers on the ARM. They limit the note rate, not the rest of the payment.",
        faqs,
        keywords: ["ARM caps", "adjustable rate mortgage caps"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        ARM caps are percentage-point limits on how far the <em>note rate</em> can move. They are written as initial /
        periodic / lifetime (for example 2/1/5). They are not a promise of a payment, a lock, or a current rate.
        Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <h2>The three numbers</h2>
      <p>{ARM_CAPS.notation}</p>
      <ComparisonTable
        caption={`How to read ARM caps as of ${LENDING_FACTS_AS_OF}. Illustration rates are not a quote.`}
        columns={columns}
        rows={rows}
        footnote="Start rate, index, and margin are on the Loan Estimate and the note. This table does not price an ARM."
      />

      <h2>Index, margin, and the fully indexed rate</h2>
      <p>{ARM_CAPS.fullyIndexed}</p>
      <p>
        After the fixed period (5, 7, or 10 years on a 5/1, 7/1, or 10/1), the lender calculates index plus margin,
        then applies the caps. A lower start rate than a 30-year fixed is a trade: you are planning around the first
        adjustment, not collecting a discount with no limit.
      </p>
      <p>{ARM_CAPS.paymentNote}</p>

      <h2>How this sits next to a quote</h2>
      <p>
        A news average is still not your quote — see{" "}
        <Link href="/buy/rates">why your quote is not the 30-year average</Link>. Product shape (fixed vs ARM) lives
        on <Link href="/buy/adjustable-rate">adjustable-rate mortgages</Link> and{" "}
        <Link href="/buy/fixed-rate">fixed-rate mortgages</Link>. Use the{" "}
        <Link href="/calculators/mortgage-payment">payment calculator</Link> with an illustration rate you type in; it
        cannot apply caps for you.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Ask for the cap structure in writing (initial / periodic / lifetime) on the same Loan Estimate as the start rate, index, and margin.</li>
        <li>Plan for the first adjustment date, not only year-one principal and interest.</li>
        <li>If you might refinance before that date, still run <Link href="/blog/refinance-break-even-when-lower-rate-loses">break-even after costs</Link> — an ARM is not a free refinance option.</li>
      </ol>
    </ArticleShell>
  )
}
