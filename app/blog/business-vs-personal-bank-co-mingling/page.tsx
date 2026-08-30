import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { BUSINESS_PERSONAL_COMINGLING, LENDING_FACTS_AS_OF, LARGE_DEPOSITS } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/business-vs-personal-bank-co-mingling"

const faqs = [
  {
    question: "Can I use a personal account if that is where clients pay me?",
    answer: BUSINESS_PERSONAL_COMINGLING.bankStatement,
  },
  {
    question: "Does moving money between accounts the week I apply help seasoning?",
    answer: BUSINESS_PERSONAL_COMINGLING.seasoning,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "separate", heading: "Separated books", href: "/blog/bank-statement-loans-when-tax-returns-undercount-income" },
  { id: "mixed", heading: "Co-mingled accounts", href: "/blog/large-deposits-60-day-paper-trail" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "source",
    criterion: "Sourcing a large deposit",
    cells: {
      separate: "Payroll, 1099 deposits, or a labeled transfer matching the business statements.",
      mixed: "A wire that could be income, a loan, a client refund, or a family gift. The underwriter cannot tell.",
    },
  },
  {
    id: "average",
    criterion: "Deposit average (bank-statement files)",
    cells: {
      separate: "Deposits in a business account can be averaged after NSFs and transfers are treated per the overlay.",
      mixed: "Personal spending, cash, and transfers usually get haircut or excluded. The average shrinks.",
    },
  },
  {
    id: "k1",
    criterion: "Entity income (K-1)",
    cells: {
      separate: "K-1 and matching returns are the income engine; distributions still have to be possible.",
      mixed: "Owner draws dumped into a personal account without K-1 support do not replace the return.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Business Bank vs Personal: Co-Mingling That Stalls Files",
  description:
    "Business deposits in a personal account stall sourcing and deposit averages. Seasoning is a paper trail, not a workaround.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["business personal bank co-mingling mortgage", "self employed deposits underwriting"],
  faqs,
})

export default function CominglingPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Business Bank vs Personal: Co-Mingling That Stalls Files",
        description:
          "Business deposits in a personal account stall sourcing and deposit averages. Seasoning is a paper trail, not a workaround.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "One account for everything is convenient. It is also a common underwriting stall.",
        faqs,
        keywords: ["co-mingling bank accounts mortgage", "self employed large deposits"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Mixing business deposits into a personal account — or paying household bills from the business — is what
        underwriters call co-mingling. {BUSINESS_PERSONAL_COMINGLING.problem} Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <h2>Why the file stalls</h2>
      <p>
        Purchase files typically include about 60 days of statements.{" "}
        <Link href="/blog/large-deposits-60-day-paper-trail">Large deposits in that window have to be sourced</Link>.{" "}
        {LARGE_DEPOSITS.conventionalThreshold} When the same account also shows owner draws, cash, Venmo, and client
        wires, every large line becomes a condition.
      </p>
      <ComparisonTable
        caption={`Separated vs co-mingled accounts as of ${LENDING_FACTS_AS_OF}.`}
        columns={columns}
        rows={rows}
        footnote="Educational snapshot. Overlays differ. This is not advice to open or close accounts mid-file without asking."
      />

      <h2>Seasoning is not a workaround</h2>
      <p>{BUSINESS_PERSONAL_COMINGLING.seasoning}</p>
      <p>
        A brand-new 1099 who deposits the first invoices into a personal checking account has two problems: history and
        mixing. See <Link href="/blog/just-went-1099-last-month">I just went 1099 last month</Link>. K-1 income is
        taken from the form and matching returns, not from whatever hit personal checking —{" "}
        <Link href="/blog/k-1-income-what-usually-counts">what usually counts on a K-1</Link>.
      </p>

      <h2>Bank-statement programs still want a pattern</h2>
      <p>
        {BUSINESS_PERSONAL_COMINGLING.bankStatement} If tax returns undercount cash flow after write-offs, the{" "}
        <Link href="/blog/bank-statement-loans-when-tax-returns-undercount-income">bank-statement guide</Link> and the{" "}
        <Link href="/learn/non-qm">Non-QM hub</Link> explain that stack. Co-mingling does not convert a personal
        account into 24 months of business deposits.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Bring business and personal statements for the same window, plus an explanation of every large transfer.</li>
        <li>Do not park cash or shuffle accounts the week of application without asking how it must be sourced.</li>
        <li>
          Use an income average you can document on the <Link href="/calculators/income">income calculator</Link> — not
          last month’s best deposit.
        </li>
      </ol>
    </ArticleShell>
  )
}
