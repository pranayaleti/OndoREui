import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { LENDING_FACTS_AS_OF, NEW_DEBT_UNDERWRITING } from "@/lib/content"
import Link from "next/link"

const path = "/blog/new-auto-loan-during-underwriting"

const faqs = [
  {
    question: "Can I buy a car after I get a mortgage pre-approval?",
    answer: NEW_DEBT_UNDERWRITING.autoLoan,
  },
  {
    question: "What if I already signed the auto loan?",
    answer: NEW_DEBT_UNDERWRITING.whatToDo,
  },
]

export const metadata = articleMetadata({
  path,
  title: "New Auto Loan During Underwriting",
  description:
    "A car payment signed after pre-approval usually shows on the next credit pull and changes DTI. Ask before you sign.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["new car loan during mortgage underwriting", "auto loan after pre-approval", "do not buy a car before closing"],
  faqs,
})

export default function NewAutoLoanUnderwritingPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "New Auto Loan During Underwriting",
        description:
          "A car payment signed after pre-approval usually shows on the next credit pull and changes DTI. Ask before you sign.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "The letter was a snapshot. The auto loan is new debt on the next pull.",
        faqs,
        keywords: ["auto loan mortgage underwriting", "new debt after pre-approval"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A new auto loan during processing or underwriting usually appears when credit is refreshed. The monthly
        payment is counted in back-end DTI. Automated findings that were eligible can come back ineligible. That is
        one of the most common “but I was pre-approved” stalls. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <p>{NEW_DEBT_UNDERWRITING.autoLoan}</p>
      <p>{NEW_DEBT_UNDERWRITING.otherDebt}</p>

      <h2>Why the letter did not see it</h2>
      <p>
        A pre-approval is not AUS findings and not clear to close. Those three stages are spelled out in{" "}
        <Link href="/blog/pre-approval-vs-aus-vs-clear-to-close">pre-approval vs AUS vs CTC</Link>. The letter used
        the debts that were on the report <em>then</em>. A dealer pull and a funded auto loan are a new tradeline.
      </p>

      <h2>What underwriters are checking</h2>
      <ul>
        <li>New installment payment in DTI (front-end housing ratio does not save you if back-end breaks).</li>
        <li>A new inquiry pattern if several dealers pulled credit.</li>
        <li>
          Whether cash for the car down payment also created a{" "}
          <Link href="/blog/large-deposits-60-day-paper-trail">large-deposit</Link> problem on the mortgage asset
          statements.
        </li>
      </ul>

      <h2>If the findings flip</h2>
      <p>
        That can look like a decline after the letter. Typical condition fails, including new debt:{" "}
        <Link href="/blog/declined-after-pre-approval">declined after pre-approval</Link>. Paying the car off “at
        closing” only helps if the debt is actually gone on the report the underwriter uses — a plan is not a payoff
        letter.
      </p>
      <p>{NEW_DEBT_UNDERWRITING.whatToDo}</p>

      <h2>What happens next</h2>
      <ol>
        <li>If you have not signed yet, ask the loan officer to re-run DTI with the proposed car payment before you commit.</li>
        <li>If you already signed, send the contract and the payment. Do not hide it for closing week.</li>
        <li>
          Hold other new credit too — furniture, cards, co-signs. Same DTI math. Then talk through the file; that is
          not a new promise of approval.
        </li>
      </ol>
    </ArticleShell>
  )
}
