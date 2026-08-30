import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, UTAH_CLOSING_NOTES, UTAH_REPC } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/utah-repc-deadline-and-your-loan"

const faqs = [
  {
    question: "If my loan is not clear to close by the Financing & Appraisal Deadline, do I automatically get earnest money back?",
    answer: UTAH_REPC.financingAppraisal,
  },
  {
    question: "Is a pre-approval letter the same as meeting the REPC financing condition?",
    answer: UTAH_REPC.lenderNotAParty,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "dd", heading: "Due Diligence Deadline", href: "/learn/first-time" },
  { id: "fa", heading: "Financing & Appraisal Deadline", href: "/blog/pre-approval-vs-aus-vs-clear-to-close" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What the clock is for",
    cells: {
      dd: "Property, disclosures, inspections, insurance availability — buyer’s sole discretion if the condition is checked.",
      fa: "Appraisal at or above price, and whether the buyer is satisfied with loan terms. Separate from due diligence.",
    },
  },
  {
    id: "miss",
    criterion: "If you miss written notice",
    cells: {
      dd: "The due-diligence condition is generally waived. Financing and appraisal can still be alive until their deadline.",
      fa: "Appraisal and financing cancel rights in the form are easier to lose. After the deadline, a loan that never funds can send remaining earnest money to the seller.",
    },
  },
  {
    id: "lender",
    criterion: "What the lender’s calendar does",
    cells: {
      dd: "Nothing by itself. The lender is not a party to the REPC.",
      fa: "AUS findings and CTC are file stages, not Section 24 dates. Align them in writing with your agent before the clock expires.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "What a Utah REPC Deadline Actually Does to Your Loan",
  description:
    "Utah due diligence and financing/appraisal are separate 5:00 p.m. Mountain Time clocks. A lender timeline is not a REPC deadline. Not legal advice.",
  published: "2026-08-29",
  category: "First-Time Buyers",
  keywords: ["Utah REPC deadline", "financing contingency Utah", "due diligence vs financing Utah"],
  faqs,
})

export default function UtahRepcDeadlinePage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "What a Utah REPC Deadline Actually Does to Your Loan",
        description:
          "Utah due diligence and financing/appraisal are separate 5:00 p.m. Mountain Time clocks. A lender timeline is not a REPC deadline.",
        published: "2026-08-29",
        category: "First-Time Buyers",
        bannerSubtitle: "The contract clock and the underwriting clock are not the same machine.",
        faqs,
        keywords: ["Utah REPC", "financing and appraisal deadline"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A Utah Real Estate Purchase Contract (REPC) deadline is a contract clock between buyer and seller. It is not
        your lender’s underwriting calendar. Missing a written cancel notice can waive a condition even if the loan
        file is still open. Snapshot as of {LENDING_FACTS_AS_OF} ({UTAH_REPC.source}).
      </p>
      <p>{UTAH_REPC.notLegalAdvice}</p>

      <h2>Four dates, 5:00 p.m. Mountain Time</h2>
      <p>{UTAH_REPC.timeOfEssence}</p>
      <p>{UTAH_REPC.fourDeadlines}</p>
      <p>
        {UTAH_CLOSING_NOTES.closingVenue} Settlement on the REPC is signing and delivering funds the contract requires;
        Closing in the form also needs loan proceeds and recording. See{" "}
        <Link href="/blog/utah-closing-costs-title-origination-prepaids">Utah closing costs</Link>.
      </p>

      <h2>Due diligence is not financing</h2>
      <p>{UTAH_REPC.dueDiligence}</p>
      <ComparisonTable
        caption={`Independent REPC clocks as of ${LENDING_FACTS_AS_OF}. Confirm the form you signed.`}
        columns={columns}
        rows={rows}
        footnote="Parties may alter the form. Addenda control if they conflict. This table is not legal advice."
      />

      <h2>What the financing condition actually does to the loan</h2>
      <p>{UTAH_REPC.financingAppraisal}</p>
      <p>
        That is the Utah-specific trap: canceling for loan terms <em>before</em> the Financing & Appraisal Deadline can
        still send a filled-in slice of earnest money to the seller. Waiting until after that deadline because “the
        underwriter needed one more condition” can put the rest of the deposit at risk if loan proceeds never arrive.
        {UTAH_REPC.lenderNotAParty}
      </p>
      <p>
        Map the file stages separately:{" "}
        <Link href="/blog/pre-approval-vs-aus-vs-clear-to-close">pre-approval vs AUS vs clear to close</Link>. A letter
        in the offer packet does not extend Section 24.
      </p>

      <h2>Earnest money vs cash to close</h2>
      <p>
        Earnest money is usually credited toward what you already owe at closing. Timing still matters: the deposit
        leaves your account when the REPC says it must. Pair this with{" "}
        <Link href="/blog/utah-cash-to-close-besides-down-payment">cash besides down payment</Link> and the{" "}
        <Link href="/learn/first-time">first-time hub</Link>. If you are moving for a job that has not started, the
        contract clock still runs — see{" "}
        <Link href="/blog/relocating-to-utah-job-seasoning">relocating and job seasoning</Link>.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Read Section 24 dates on the form you signed. They are calendar days at 5:00 p.m. Mountain Time unless altered.</li>
        <li>Tell the loan officer those dates on day one. Ask what has to be true before the Financing & Appraisal Deadline.</li>
        <li>
          Any cancel or extension is written notice under the contract, signed, and received — not a text to the lender.
        </li>
      </ol>
    </ArticleShell>
  )
}
