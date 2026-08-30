import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, PREAPPROVAL_STAGES, PURCHASE_TIMELINE, UTAH_REPC } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/how-long-first-purchase-takes"

const faqs = [
  {
    question: "Is 30 days a promise I will close?",
    answer: PURCHASE_TIMELINE.notAPromise,
  },
  {
    question: "Is a pre-approval letter the same as clear to close?",
    answer: PREAPPROVAL_STAGES.notTheSame,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "stage", heading: "Stage", href: "/blog/pre-approval-vs-aus-vs-clear-to-close" },
  { id: "range", heading: "Common range (not a promise)" },
  { id: "clock", heading: "Whose clock" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "pre",
    criterion: "Pre-approval",
    cells: {
      stage: PREAPPROVAL_STAGES.preApproval,
      range: PURCHASE_TIMELINE.preapproval,
      clock: "Lender file. Not a REPC deadline.",
    },
  },
  {
    id: "contract",
    criterion: "Contract → underwrite",
    cells: {
      stage: "After acceptance, appraisal is ordered and the full application is submitted. AUS findings can run before CTC.",
      range: PURCHASE_TIMELINE.contractToUw,
      clock: UTAH_REPC.financingAppraisal,
    },
  },
  {
    id: "ctc",
    criterion: "Underwrite → CTC",
    cells: {
      stage: PREAPPROVAL_STAGES.aus,
      range: PURCHASE_TIMELINE.uwToCtc,
      clock: "Conditions list. Findings are not CTC.",
    },
  },
  {
    id: "fund",
    criterion: "CTC → close",
    cells: {
      stage: PREAPPROVAL_STAGES.ctc,
      range: PURCHASE_TIMELINE.ctcToClose,
      clock: "Closing Disclosure waiting period, title figures, insurance binder. Utah typically funds at title.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "How Long a First Purchase Usually Takes",
  description:
    "Pre-approval through contract, underwriting, clear to close, and funding. Ranges, not a closing-date promise. Links Utah REPC and AUS vs CTC.",
  published: "2026-08-29",
  category: "First-Time Buyers",
  keywords: ["how long to close on a house Utah", "first-time home buyer timeline", "preapproval to closing"],
  faqs,
})

export default function PurchaseTimelinePage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "How Long a First Purchase Usually Takes",
        description:
          "Pre-approval through contract, underwriting, CTC, and funding. Ranges, not a closing-date promise.",
        published: "2026-08-29",
        category: "First-Time Buyers",
        bannerSubtitle: "The REPC dates and the file speed set the calendar — not a blog’s favorite number of days.",
        faqs,
        keywords: ["how long first purchase takes", "mortgage timeline Utah"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A first purchase is a file, not a vision board. Many files close about 21–45 days after the contract is
        accepted when the dates and documents cooperate. That is a range, not a promise you will fund on day 30.
        Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{PURCHASE_TIMELINE.overall}</p>
      <p>{PURCHASE_TIMELINE.notAPromise}</p>

      <h2>Stages, not one blob called “escrow”</h2>
      <ComparisonTable
        caption={`Purchase file stages as of ${LENDING_FACTS_AS_OF}. Ranges, not promises.`}
        columns={columns}
        rows={rows}
        footnote="The form you signed can change every date. Not legal advice."
      />

      <h2>The Utah contract clock is not the lender’s wish</h2>
      <p>
        {UTAH_REPC.lenderNotAParty} Deep guide:{" "}
        <Link href="/blog/utah-repc-deadline-and-your-loan">what a Utah REPC deadline does to your loan</Link>. Time is
        of the essence: {UTAH_REPC.timeOfEssence}
      </p>
      <p>
        Pre-approval, AUS, and CTC are three documents:{" "}
        <Link href="/blog/pre-approval-vs-aus-vs-clear-to-close">pre-approval vs AUS vs CTC</Link>. If a condition fails
        after the letter: <Link href="/blog/declined-after-pre-approval">declined after pre-approval</Link>.
      </p>

      <h2>What actually stretches a first file</h2>
      <ul>
        <li>Appraisal queue, condo questionnaire, or a project that is not FHA-eligible.</li>
        <li>
          File mistakes: new debt, job change, unsourced deposits.{" "}
          <Link href="/blog/first-time-buyer-file-mistakes">file mistakes, not lifestyle listicles</Link>.
        </li>
        <li>Insurance binder that does not match the legal regime (HO-3 vs HO-6).</li>
      </ul>

      <h2>What this page will not do</h2>
      <ul>
        <li>Guarantee a closing date or a number of days to CTC.</li>
        <li>Treat a pre-approval letter as a lock or a commitment to lend.</li>
        <li>Replace the REPC you signed. {UTAH_REPC.notLegalAdvice}</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Read the four deadline lines on your REPC before you treat “30 days” as the loan’s promise.</li>
        <li>
          Cash besides down payment: <Link href="/learn/first-time">first-time hub</Link>. Commercial path:{" "}
          <Link href="/buy/first-time">first-time programs</Link>.
        </li>
        <li>
          Illustration: <Link href="/calculators/closing-cost">closing-cost calculator</Link>. Then{" "}
          <Link href="/qualify">a conversation</Link> — not a date guarantee.
        </li>
      </ol>
    </ArticleShell>
  )
}
