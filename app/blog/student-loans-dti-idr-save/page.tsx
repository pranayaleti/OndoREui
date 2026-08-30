import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, STUDENT_LOAN_DTI } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/student-loans-dti-idr-save"

const faqs = [
  {
    question: "If my student loans show $0, is my DTI $0 for that debt?",
    answer: `${STUDENT_LOAN_DTI.creditReportPayment} ${STUDENT_LOAN_DTI.saveNote}`,
  },
  {
    question: "Does Fannie Mae always accept a documented IDR $0?",
    answer: STUDENT_LOAN_DTI.fannieZero,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "fannie", heading: "Fannie Mae (typical)", href: "/loans/conventional" },
  { id: "freddie-fha", heading: "Freddie Mac / FHA (typical)", href: "/loans/fha" },
  { id: "va", heading: "VA (typical)", href: "/loans/va" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "reported",
    criterion: "Credit report shows a payment above $0",
    cells: {
      fannie: "Often use that payment, or the documented current statement if it differs.",
      "freddie-fha": "Often use the reported or documented payment.",
      va: "VA has its own student-loan treatment. Confirm the current handbook — do not import a conventional percent.",
    },
  },
  {
    id: "idr-zero",
    criterion: "IDR payment documented at $0",
    cells: {
      fannie:
        "May qualify with $0 when the servicer documents an income-driven payment of $0. A dashboard screenshot is not enough.",
      "freddie-fha": STUDENT_LOAN_DTI.freddieFha,
      va: STUDENT_LOAN_DTI.vaNote,
    },
  },
  {
    id: "forbearance",
    criterion: "Deferred or forbearance (including some SAVE fallout)",
    cells: {
      fannie: "Often 1% of the outstanding balance, or a fully amortizing payment from documented terms.",
      "freddie-fha": "Often 0.5% of the outstanding balance when the reported payment is $0 or not amortizing.",
      va: "Do not assume a conventional percent. Confirm the current VA student-loan rule.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Student Loans and DTI After IDR / SAVE Changes",
  description:
    "A $0 student-loan line on a dashboard is not automatically $0 in DTI. How agencies typically count IDR, deferment, and forbearance.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["student loans DTI mortgage", "IDR SAVE mortgage qualification", "income driven repayment home loan"],
  faqs,
})

export default function StudentLoansIdrPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Student Loans and DTI After IDR / SAVE Changes",
        description:
          "A $0 student-loan line on a dashboard is not automatically $0 in DTI. How agencies typically count IDR, deferment, and forbearance.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "The repayment plan on StudentAid.gov is not the DTI line until the investor says it is.",
        faqs,
        keywords: ["student loan DTI", "IDR mortgage", "SAVE forbearance mortgage"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Student loans still count in DTI even when you are on an income-driven plan. A $0 IDR or SAVE-related
        forbearance on a dashboard is not automatically a $0 underwriting payment. The investor calculates a payment
        from the credit report, the servicer statement, or a percent of the balance. Snapshot as of {LENDING_FACTS_AS_OF}
        .
      </p>

      <h2>What actually goes into DTI</h2>
      <p>{STUDENT_LOAN_DTI.creditReportPayment}</p>
      <p>{STUDENT_LOAN_DTI.saveNote}</p>
      <ComparisonTable
        caption={`Typical student-loan DTI treatment as of ${LENDING_FACTS_AS_OF}. Confirm the guide in force.`}
        columns={columns}
        rows={rows}
        footnote="Percents are published-guide snapshots, not a quote for your balance. Lender overlays can be tighter."
      />

      <h2>SAVE and other IDR plans</h2>
      <p>
        SAVE has been in legal and servicing flux. Borrowers who were on SAVE may be in a forbearance or a different
        IDR. Underwriting follows the <em>current</em> repayment status and the investor’s student-loan rule — not the
        plan name on an old letter. Ask the servicer for a current statement before you shop as if DTI ignores the
        balance.
      </p>
      <p>
        First-time cash still has to close on top of DTI. See{" "}
        <Link href="/learn/first-time">first-time cash and closing</Link> and the{" "}
        <Link href="/calculators/affordability">affordability calculator</Link> — enter the student-loan payment the
        investor is likely to count, not $0 because a website said $0.
      </p>

      <h2>Documents that actually move the file</h2>
      <ul>
        <li>Current student-loan statement(s) showing repayment plan, payment, and outstanding balance.</li>
        <li>If you claim IDR $0, written servicer confirmation of that payment — not only the credit report.</li>
        <li>If loans are in forbearance, the forbearance terms and when payment resumes.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Do not assume Fannie’s documented-IDR $0 applies to FHA, Freddie, or VA.</li>
        <li>
          Run affordability with a counted payment you can defend, then talk with a loan officer about which investor
          worksheet fits.
        </li>
        <li>
          Loans FAQ context: <Link href="/faq/loans-faqs">mortgage FAQs</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
