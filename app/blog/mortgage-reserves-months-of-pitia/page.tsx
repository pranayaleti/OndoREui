import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, RELOCATION_SEASONING, RESERVES_PITIA } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/mortgage-reserves-months-of-pitia"

const faqs = [
  {
    question: "Are reserves extra money I pay at closing?",
    answer: RESERVES_PITIA.notCashToClose,
  },
  {
    question: "Can gift funds count as reserves?",
    answer: RESERVES_PITIA.counted,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "ctc", heading: "Cash to close", href: "/blog/utah-cash-to-close-besides-down-payment" },
  { id: "res", heading: "Reserves (months of PITIA)" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      ctc: "Down payment, remaining earnest, closing costs, and prepaids due at the table (minus credits).",
      res: RESERVES_PITIA.what,
    },
  },
  {
    id: "where",
    criterion: "Where the money sits",
    cells: {
      ctc: "Leaves your accounts at closing (or was already earnest).",
      res: "Stays in documented accounts after closing. It is still sourced.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Mortgage Reserves: How Many Months of PITIA",
  description:
    "Reserves are remaining liquid assets after cash to close, counted as months of PITIA. Not extra closing costs. Gift funds often cannot fill this line.",
  published: "2026-08-29",
  category: "First-Time Buyers",
  keywords: ["mortgage reserves PITIA", "months of reserves underwriting", "gift funds as reserves"],
  faqs,
})

export default function MortgageReservesPitiaPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Mortgage Reserves: How Many Months of PITIA",
        description:
          "Reserves are remaining liquid assets after cash to close, counted as months of PITIA. Not extra closing costs. Gift funds often cannot fill this line.",
        published: "2026-08-29",
        category: "First-Time Buyers",
        bannerSubtitle: "Months of the full housing payment left after you close — not a second earnest-money check.",
        faqs,
        keywords: ["PITIA reserves", "mortgage reserve months"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Reserves are liquid assets that remain after cash to close, measured as months of PITIA — principal, interest,
        taxes, insurance, and association dues when they apply. They are not extra closing costs you write a check for
        at the table. Snapshot as of {LENDING_FACTS_AS_OF}. This page does not publish a single required number of
        months.
      </p>
      <p>{RESERVES_PITIA.howMany}</p>

      <h2>Cash to close vs reserves</h2>
      <ComparisonTable
        caption={`Two different cash questions as of ${LENDING_FACTS_AS_OF}.`}
        columns={columns}
        rows={rows}
        footnote="Earnest money that already left your account is not also reserves."
      />
      <p>
        Utah cash stack:{" "}
        <Link href="/blog/utah-cash-to-close-besides-down-payment">cash besides down payment</Link>. Earnest vs down vs
        costs:{" "}
        <Link href="/blog/earnest-money-vs-down-payment-vs-closing-costs">three cash lines</Link>. HOA in the payment:{" "}
        <Link href="/blog/dti-frontend-backend-with-hoa">DTI with HOA</Link>.
      </p>

      <h2>What usually counts</h2>
      <p>{RESERVES_PITIA.counted}</p>
      <ul>
        <li>Checking and savings in the borrower’s name, seasoned and sourced.</li>
        <li>Brokerage accounts, often with a haircut on stocks.</li>
        <li>Retirement accounts, often with a larger haircut if accessible.</li>
        <li>Not: the same dollars already used for down payment, and often not undocumented cash.</li>
      </ul>

      <h2>When months go up</h2>
      <ul>
        <li>
          Investment occupancy and 2–4 unit files commonly need more months than a primary 1-unit. See{" "}
          <Link href="/learn/investment">investment financing</Link>.
        </li>
        <li>
          Some future-employment / relocation paths add reserve tests: {RELOCATION_SEASONING.reserves} Guide:{" "}
          <Link href="/blog/relocating-to-utah-job-seasoning">job seasoning when work starts in 60 days</Link>.
        </li>
        <li>Non-QM overlays (DSCR, asset-depletion, bank-statement) often set their own reserve months.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Keep two months of statements. Large deposits in that window still have to be sourced.</li>
        <li>Do not spend the “reserve” account down to pay furniture after you are under contract without asking.</li>
        <li>
          Hub: <Link href="/learn/first-time">first-time cash and closing</Link>. Affordability illustrations:{" "}
          <Link href="/calculators/affordability">affordability calculator</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
