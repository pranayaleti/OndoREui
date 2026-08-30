import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, TEMPORARY_BUYDOWN } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/temporary-buydown-who-pays-year-three"

const faqs = [
  {
    question: "Who usually pays for a 2-1 or 3-2-1 buydown?",
    answer: TEMPORARY_BUYDOWN.whoPays,
  },
  {
    question: "What happens when the buydown years end?",
    answer: TEMPORARY_BUYDOWN.yearThree,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "twoOne", heading: "2-1 buydown" },
  { id: "three", heading: "3-2-1 buydown" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "shape",
    criterion: "Payment shape",
    cells: {
      twoOne: TEMPORARY_BUYDOWN.twoOne,
      three: TEMPORARY_BUYDOWN.threeTwoOne,
    },
  },
  {
    id: "year3",
    criterion: "Year 3 (and after)",
    cells: {
      twoOne: "Year 3 is typically the full note payment (the 2-1 subsidy has ended). Taxes, insurance, and HOA still sit on top.",
      three: "Year 3 is still subsidized (about 1 point below the note on a classic 3-2-1). Year 4 is the full note payment.",
    },
  },
  {
    id: "not",
    criterion: "Not this product",
    cells: {
      twoOne: TEMPORARY_BUYDOWN.notDiscountPoints,
      three: "Not an ARM. Caps on an adjustable note are a different structure — see ARM caps in plain English.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Temporary Buydown: Who Pays, What Happens in Year 3",
  description:
    "2-1 and 3-2-1 buydowns subsidize the payment for a few years. The note rate does not change. Distinct from buying discount points.",
  published: "2026-08-29",
  category: "Mortgages",
  keywords: ["2-1 buydown", "3-2-1 buydown who pays", "temporary mortgage buydown year 3"],
  faqs,
})

export default function TemporaryBuydownPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Temporary Buydown: Who Pays, What Happens in Year 3",
        description:
          "2-1 and 3-2-1 buydowns subsidize the payment for a few years. The note rate does not change. Distinct from buying discount points.",
        published: "2026-08-29",
        category: "Mortgages",
        bannerSubtitle: "Year-one payment is a subsidy. Year-three payment is the note you already signed.",
        faqs,
        keywords: ["temporary buydown", "builder 2-1 buydown"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A temporary buydown (2-1 or 3-2-1) lowers the payment for the first years by funding a subsidy account. The
        note rate does not change. When the subsidy ends, you pay the full note payment plus taxes, insurance, and
        HOA. Who pays for the subsidy — seller, builder, borrower, or a lender credit — is a contract and Loan
        Estimate question, not a free gift. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <p>{TEMPORARY_BUYDOWN.notDiscountPoints}</p>
      <p>
        Buying points for the life of the loan is{" "}
        <Link href="/blog/discount-points-breakeven-without-sales-pitch">discount points: breakeven</Link>. A news
        average is still not your quote: <Link href="/buy/rates">rates hub</Link>.
      </p>

      <ComparisonTable
        caption={`How 2-1 and 3-2-1 structures typically taper as of ${LENDING_FACTS_AS_OF}. Illustration, not a quote.`}
        columns={columns}
        rows={rows}
        footnote="Flat buydowns (a single temporary rate for N years) also exist. Model the structure on the LE, not a flyer."
      />

      <h2>Who pays</h2>
      <p>{TEMPORARY_BUYDOWN.whoPays}</p>
      <p>
        On new construction, a builder credit is often in the price or in other concessions. Program caps on seller
        concessions still apply. A “we’ll buy your rate down” pitch that does not show a subsidy amount on the LE is
        incomplete.
      </p>

      <h2>Year 3 is the planning number</h2>
      <p>{TEMPORARY_BUYDOWN.yearThree}</p>
      <p>
        Model the subsidy and the full payment on the{" "}
        <Link href="/calculators/temporary-buydown">temporary buydown calculator</Link>. If you plan to refinance before
        the subsidy ends, still run <Link href="/blog/refinance-break-even-when-lower-rate-loses">break-even after
        costs</Link> — a buydown is not a prepaid refinance.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Get the structure in writing (2-1, 3-2-1, or flat) and who is funding the subsidy account.</li>
        <li>Budget the full note payment, not year-one principal and interest.</li>
        <li>
          Compare that offer to buying points on two Loan Estimates with the same lock period — different products,
          different calendars.
        </li>
      </ol>
    </ArticleShell>
  )
}
