import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, QUALIFY_CONVERSATION } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/what-a-mortgage-conversation-asks"

const faqs = [
  {
    question: "Will the first conversation approve me or lock a rate?",
    answer: QUALIFY_CONVERSATION.notPromised,
  },
  {
    question: "Do I need two years of tax returns on the first call?",
    answer: QUALIFY_CONVERSATION.notNeededFirstCall,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "asked", heading: "Usually asked" },
  { id: "not", heading: "Not promised" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "file",
    criterion: "Your file",
    cells: {
      asked: QUALIFY_CONVERSATION.asked,
      not: QUALIFY_CONVERSATION.notPromised,
    },
  },
  {
    id: "docs",
    criterion: "Documents",
    cells: {
      asked: "Income type so we know whether paystubs, returns, K-1s, or statements even apply. Occupancy and property type if you have an address.",
      not: "A complete underwrite from a phone call. Findings come after an application, credit, and the stack the investor requires.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "What a Mortgage Conversation Asks — and What It Will Not Promise",
  description:
    "Occupancy, income type, debts, assets, and credit authorization. A conversation is not approval, a lock, or a quote.",
  published: "2026-08-29",
  category: "Mortgages",
  keywords: ["mortgage prequalification questions", "what lenders ask", "mortgage conversation not approval"],
  faqs,
})

export default function QualifyAsksGuidePage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "What a Mortgage Conversation Asks — and What It Will Not Promise",
        description:
          "Occupancy, income type, debts, assets, and credit authorization. A conversation is not approval, a lock, or a quote.",
        published: "2026-08-29",
        category: "Mortgages",
        bannerSubtitle: "Bring the situation. Do not expect a credit decision from a web form.",
        faqs,
        keywords: ["what will I be asked for a mortgage", "prequalify questions"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A first mortgage conversation is a scoping call: occupancy, how you are paid, what you owe, what cash you can
        document, and whether you are ready for a credit pull. It is not an approval, a lock, an APR, or a promise
        that a program will fit. The live version of this list sits on the{" "}
        <Link href="/qualify">qualify page</Link>. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <ComparisonTable
        caption={`What a conversation is for as of ${LENDING_FACTS_AS_OF}.`}
        columns={columns}
        rows={rows}
        footnote="Fair Housing: we ask about the file (income, debts, occupancy, property), not about protected class. Anyone who applies is underwritten on documentation."
      />

      <h2>Checklist before you talk</h2>
      <ul>
        <li>How you are paid (W-2, 1099, K-1, mixed) — see the <Link href="/learn/variable-income">variable-income hub</Link> if it is not the same every month.</li>
        <li>Monthly debts you know about, including a car you might finance next week.</li>
        <li>Whether gift funds or DPA are in the plan.</li>
        <li>Occupancy: you will live there, second home, or rental.</li>
      </ul>
      <p>{QUALIFY_CONVERSATION.notNeededFirstCall}</p>

      <h2>After the conversation</h2>
      <p>
        If a letter is issued, that is still only a snapshot. The three stages — letter, AUS findings, clear to close —
        are <Link href="/blog/pre-approval-vs-aus-vs-clear-to-close">pre-approval vs AUS vs CTC</Link>. Typical late
        fails: <Link href="/blog/declined-after-pre-approval">declined after pre-approval</Link>.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>
          Read the <Link href="/qualify">qualify page</Link> so the questions are not a surprise.
        </li>
        <li>
          Send a message or book time via <Link href="/contact">contact</Link>. Asking is not a loan application.
        </li>
        <li>
          Use calculators as illustrations only — <Link href="/calculators/affordability">affordability</Link> does not
          underwrite you.
        </li>
      </ol>
    </ArticleShell>
  )
}
