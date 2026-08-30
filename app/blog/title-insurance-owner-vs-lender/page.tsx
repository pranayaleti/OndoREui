import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, TITLE_OWNER_VS_LENDER, UTAH_CLOSING_NOTES } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/title-insurance-owner-vs-lender"

const faqs = [
  {
    question: "Does the lender’s policy protect me?",
    answer: TITLE_OWNER_VS_LENDER.lender,
  },
  {
    question: "Is an owner’s policy required in Utah?",
    answer: TITLE_OWNER_VS_LENDER.owner,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "lender", heading: "Lender’s policy" },
  { id: "owner", heading: "Owner’s policy" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "who",
    criterion: "Who it protects",
    cells: {
      lender: TITLE_OWNER_VS_LENDER.lender,
      owner: TITLE_OWNER_VS_LENDER.owner,
    },
  },
  {
    id: "when",
    criterion: "When it usually appears",
    cells: {
      lender: "Required on most purchase and refinance mortgages so the lien is insurable.",
      owner: TITLE_OWNER_VS_LENDER.simultaneous,
    },
  },
  {
    id: "refi",
    criterion: "On a later refinance",
    cells: {
      lender: TITLE_OWNER_VS_LENDER.refinance,
      owner: "The purchase-dated owner’s policy may still apply to you, subject to date and exclusions — ask title.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Title Insurance: Owner’s vs Lender’s Policy",
  description:
    "The lender’s policy protects the lien. The owner’s policy protects your equity. Simultaneous issue is common in Utah title closings. Not legal advice.",
  published: "2026-08-29",
  category: "First-Time Buyers",
  keywords: ["owner vs lender title insurance", "Utah title insurance", "lender's title policy"],
  faqs,
})

export default function TitleInsuranceOwnerVsLenderPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Title Insurance: Owner’s vs Lender’s Policy",
        description:
          "Lender’s policy protects the loan. Owner’s policy protects you. Not legal advice and not a premium quote.",
        published: "2026-08-29",
        category: "First-Time Buyers",
        bannerSubtitle: "Two policies, two insureds. The lender’s coverage is not a substitute for yours.",
        faqs,
        keywords: ["owner title insurance", "lender title policy Utah"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Owner’s versus lender’s title insurance is a who-is-insured question: the lender’s policy covers the lender’s
        lien; the owner’s policy covers your title and equity. They are not interchangeable, and the lender’s policy is
        not “your” policy. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{TITLE_OWNER_VS_LENDER.notLegalAdvice}</p>

      <h2>Two policies</h2>
      <ComparisonTable
        caption={`Owner’s vs lender’s title as of ${LENDING_FACTS_AS_OF}. Not a premium quote.`}
        columns={columns}
        rows={rows}
        footnote="Premiums vary by title company even inside the same Utah county. Treat any range as a range."
      />
      <p>{TITLE_OWNER_VS_LENDER.simultaneous}</p>

      <h2>Utah closings sit at title</h2>
      <p>{TITLE_OWNER_VS_LENDER.utah}</p>
      <p>
        {UTAH_CLOSING_NOTES.closingVenue} {UTAH_CLOSING_NOTES.instrument} Fee buckets:{" "}
        <Link href="/blog/utah-closing-costs-title-origination-prepaids">
          closing costs — title, origination, prepaids
        </Link>
        . Cash besides down payment:{" "}
        <Link href="/blog/utah-cash-to-close-besides-down-payment">cash to close</Link>.
      </p>

      <h2>What a commitment is for</h2>
      <ul>
        <li>Covered risks and exclusions — survey, later construction, and zoning are common conversation topics.</li>
        <li>Who must be paid off (liens, judgments) before the policy will issue.</li>
        <li>Endorsements the lender requires on the lender’s policy.</li>
      </ul>
      <p>
        After funding, recording and the first payment calendar:{" "}
        <Link href="/blog/week-after-mortgage-funding">the week after funding</Link>.
      </p>

      <h2>What this page will not do</h2>
      <ul>
        <li>Quote an owner’s or lender’s premium.</li>
        <li>Tell you to skip the owner’s policy as a money-saving trick.</li>
        <li>Give legal advice on a claim or a boundary dispute.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Read the title commitment with the title company before you waive coverage you do not understand.</li>
        <li>
          Illustrate ranges on the <Link href="/calculators/closing-cost">closing-cost calculator</Link> — still not a
          title quote.
        </li>
        <li>
          First-time cash map: <Link href="/learn/first-time">first-time hub</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
