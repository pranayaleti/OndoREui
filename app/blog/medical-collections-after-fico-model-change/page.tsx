import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, MEDICAL_COLLECTIONS } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/medical-collections-after-fico-model-change"

const faqs = [
  {
    question: "Will paying a medical collection raise my mortgage score?",
    answer: MEDICAL_COLLECTIONS.noPromise,
  },
  {
    question: "Did the bureaus stop reporting all medical debt?",
    answer: MEDICAL_COLLECTIONS.bureauReporting,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "consumer", heading: "Consumer app score (often FICO 8/9 or VantageScore)", href: "/faq/loans-faqs" },
  { id: "mortgage", heading: "Mortgage tri-merge (often classic FICO 2/4/5)", href: "/blog/pre-approval-vs-aus-vs-clear-to-close" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "paid",
    criterion: "Paid medical collections",
    cells: {
      consumer: "Newer FICO models and VantageScore often ignore paid collections. FICO 8 still can count collections that remain on the report.",
      mortgage: "Classic mortgage models can still treat a collection that remains on the tri-merge. Paying it is not a promised score increase on those models.",
    },
  },
  {
    id: "small",
    criterion: "Unpaid medical under $500",
    cells: {
      consumer: "The three bureaus stated they would stop including these on credit reports from 2023. If it is not on the report, it cannot score.",
      mortgage: "Same report feed — if the bureau no longer lists it, the tri-merge usually will not either. Confirm the actual report. This is not a score-raise promise.",
    },
  },
  {
    id: "uw",
    criterion: "Must it be paid at closing?",
    cells: {
      consumer: "A consumer score does not answer payoff conditions.",
      mortgage: MEDICAL_COLLECTIONS.underwriting,
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Medical Collections After the FICO Model Change",
  description:
    "Bureau medical-collection reporting changed in 2022–2023. Mortgage files often still use classic FICO. Dated snapshot — not a score-raise promise.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["medical collections mortgage FICO", "medical debt credit score mortgage"],
  faqs,
})

export default function MedicalCollectionsPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Medical Collections After the FICO Model Change",
        description:
          "Bureau medical-collection reporting changed in 2022–2023. Mortgage files often still use classic FICO. Not a score-raise promise.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "The score on a free app is often not the score on the tri-merge.",
        faqs,
        keywords: ["medical collections FICO", "mortgage credit medical debt"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Medical collections are treated differently than they were a few years ago — on <em>credit reports</em> and on
        some <em>consumer</em> scores. A mortgage file still often uses older FICO models on a tri-merge. This page is
        a dated snapshot of that gap. It does not say your score will go up. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{MEDICAL_COLLECTIONS.noPromise}</p>

      <h2>What the bureaus said they would stop reporting</h2>
      <p>{MEDICAL_COLLECTIONS.bureauReporting}</p>
      <p>
        A proposed federal rule to strip medical debt from credit reports more broadly was not a durable, in-force
        replacement for those bureau policies as of this snapshot. Confirm current reporting on your actual tri-merge —
        not a 2023 headline.
      </p>

      <h2>What mortgage scores still are</h2>
      <p>{MEDICAL_COLLECTIONS.mortgageScores}</p>
      <ComparisonTable
        caption={`Score models as of ${LENDING_FACTS_AS_OF}. Confirm what your lender pulls.`}
        columns={columns}
        rows={rows}
        footnote="Educational snapshot. GSE required models can change. This table does not predict a score."
      />

      <h2>Payoff vs score</h2>
      <p>
        An underwriter’s payoff condition and a score model are different machines. Paying a collection to satisfy a
        condition can still be the right file move even if classic FICO does not reward the payment the way FICO 9
        would. That is not advice to pay or not pay a collector.
      </p>
      <p>
        Thin files without traditional tradelines are a different path:{" "}
        <Link href="/blog/no-traditional-credit-alternative-credit">alternative credit</Link>. Derogatory traditional
        credit is not “no credit.”
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Do not treat a Credit Karma or issuer FICO 8 as the mortgage middle score.</li>
        <li>
          Ask a loan officer to read the tri-merge that will actually be used — after you authorize a pull. See{" "}
          <Link href="/blog/what-a-mortgage-conversation-asks">what a conversation asks</Link>.
        </li>
        <li>If a medical collection still reports, ask whether it is a score issue, a payoff condition, or both.</li>
      </ol>
    </ArticleShell>
  )
}
