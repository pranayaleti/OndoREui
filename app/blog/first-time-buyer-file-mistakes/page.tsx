import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { FTHB_FILE_MISTAKES, LENDING_FACTS_AS_OF, NEW_DEBT_UNDERWRITING, OCCUPANCY_TYPES } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/first-time-buyer-file-mistakes"

const faqs = [
  {
    question: "Are these the same as generic “homebuying mistakes” lists?",
    answer: FTHB_FILE_MISTAKES.notLifestyle,
  },
  {
    question: "Can a new car payment after pre-approval stall the file?",
    answer: FTHB_FILE_MISTAKES.newDebt,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "debt", heading: "New debt", href: "/blog/new-auto-loan-during-underwriting" },
  { id: "deposit", heading: "Large deposit", href: "/blog/large-deposits-60-day-paper-trail" },
  { id: "occupy", heading: "Occupancy", href: "/blog/second-home-vs-investment-occupancy" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What the file sees",
    cells: {
      debt: NEW_DEBT_UNDERWRITING.autoLoan,
      deposit: FTHB_FILE_MISTAKES.largeDeposit,
      occupy: FTHB_FILE_MISTAKES.occupancy,
    },
  },
  {
    id: "next",
    criterion: "What to do",
    cells: {
      debt: NEW_DEBT_UNDERWRITING.whatToDo,
      deposit: "Tell the loan officer before the underwriter finds an unsourced wire. Gift letters belong with donor statements.",
      occupy: OCCUPANCY_TYPES.fraud,
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "First-Time Buyer Mistakes That Are Really File Mistakes",
  description:
    "New debt, job change, large deposits, and occupancy — the underwriting stalls, not a generic homebuying-mistakes listicle.",
  published: "2026-08-29",
  category: "First-Time Buyers",
  keywords: ["first-time buyer file mistakes", "mortgage underwriting mistakes", "new debt during underwriting"],
  faqs,
})

export default function FthbFileMistakesPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "First-Time Buyer Mistakes That Are Really File Mistakes",
        description:
          "New debt, job change, large deposits, and occupancy — underwriting stalls, not a lifestyle listicle.",
        published: "2026-08-29",
        category: "First-Time Buyers",
        bannerSubtitle: "The letter is a snapshot. The underwrite is the file you keep feeding.",
        faqs,
        keywords: ["first-time buyer underwriting mistakes", "file conditions"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        The first-time “mistakes” that actually kill a purchase file are underwriting facts: new installment debt, a
        job or hours change, an unsourced large deposit, or occupancy that does not match how you will live. They
        are not a generic listicle about inspections and overbidding. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{FTHB_FILE_MISTAKES.whatThisIs}</p>

      <h2>The four that show up in conditions</h2>
      <ComparisonTable
        caption={`File mistakes underwriters actually condition, as of ${LENDING_FACTS_AS_OF}.`}
        columns={columns}
        rows={rows}
        footnote="Not a complete list of every possible condition. Not a decline prediction."
      />

      <h2>Job change is a file change</h2>
      <p>{FTHB_FILE_MISTAKES.jobChange}</p>
      <p>
        Why the letter and the clear-to-close are different documents:{" "}
        <Link href="/blog/pre-approval-vs-aus-vs-clear-to-close">pre-approval vs AUS vs CTC</Link>. Typical later
        fails: <Link href="/blog/declined-after-pre-approval">declined after pre-approval</Link>.
      </p>

      <h2>Closing a card is utilization, not a lifestyle tip</h2>
      <p>
        {FTHB_FILE_MISTAKES.closingCard} Deep guide:{" "}
        <Link href="/blog/closing-credit-card-before-mortgage">closing a credit card before you apply</Link>.
      </p>
      <p>
        Adding a parent the wrong way (title vs note vs gift):{" "}
        <Link href="/blog/cosign-vs-co-borrower">cosign vs co-borrower</Link> and{" "}
        <Link href="/blog/parent-gifting-down-payment-who-signs">who signs a gift</Link>.
      </p>

      <h2>What this page will not do</h2>
      <ul>
        <li>Clone “10 homebuying mistakes” about skip-the-inspection or “always offer over ask.”</li>
        <li>Promise that avoiding these items guarantees approval. {FTHB_FILE_MISTAKES.notLifestyle}</li>
        <li>Coach occupancy misrepresentation. {OCCUPANCY_TYPES.fraud}</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Ask before you sign a new installment, change jobs, or move a large cash gift.</li>
        <li>
          Timeline of the file, not “dreams”: <Link href="/blog/how-long-first-purchase-takes">how long a first purchase usually takes</Link>
          .
        </li>
        <li>
          Cash stack: <Link href="/learn/first-time">first-time cash and closing</Link>. Conversation:{" "}
          <Link href="/qualify">qualify</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
