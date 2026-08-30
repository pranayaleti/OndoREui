import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { LENDING_FACTS_AS_OF } from "@/lib/content"
import Link from "next/link"

const path = "/blog/1099-mortgage-documentation-checklist"

const faqs = [
  {
    question: "Do I need two years of 1099s?",
    answer:
      "Many conventional and FHA files want a two-year history of self-employment or contract income in the same line of work. Some overlays are stricter. A loan officer has to match the product, not this checklist.",
  },
  {
    question: "Are profit-and-loss statements enough without tax returns?",
    answer:
      "On standard agency files, usually no. Unaudited P&Ls support the story; tax returns and transcripts typically carry the income. Bank-statement programs are a separate path.",
  },
]

export const metadata = articleMetadata({
  path,
  title: "1099 Mortgage Documentation Checklist",
  description:
    "What contract and gig workers typically gather for a mortgage: returns, transcripts, YTD P&L, statements, and contracts.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["1099 mortgage documents", "self employed mortgage checklist", "contract worker home loan"],
  faqs,
})

export default function TenNinetyNineDocsPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "1099 Mortgage Documentation Checklist",
        description:
          "What contract and gig workers typically gather for a mortgage: returns, transcripts, YTD P&L, statements, and contracts.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "Bring the file an underwriter can trace. Not a folder of screenshots.",
        faqs,
        keywords: ["1099 mortgage documents", "gig worker mortgage"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        If you are paid on 1099s, the mortgage file is closer to a small-business file than a W-2 file. The goal is a
        paper trail that matches: identity, income, deposits, and (when required) business existence. This is a
        preparation list, not a promise that any one stack will be accepted.
      </p>

      <h2>Gather this first</h2>
      <ul>
        <li>Government ID and Social Security number (or ITIN, if that is how you file).</li>
        <li>Two years of personal federal tax returns, all schedules, plus IRS transcripts when the lender orders them.</li>
        <li>Year-to-date profit and loss if you are in a new tax year. Note whether it is CPA-prepared or self-prepared.</li>
        <li>Business returns if you file as an entity (S-corp, partnership) rather than a sole proprietor.</li>
        <li>Two months of bank statements (often more for self-employed). Large deposits need a source.</li>
        <li>Current contracts or offer letters that show the work is ongoing, not a one-off invoice.</li>
      </ul>

      <h2>Common stalls (as of {LENDING_FACTS_AS_OF})</h2>
      <ul>
        <li>Returns that do not match transcripts.</li>
        <li>A brand-new LLC with no operating history.</li>
        <li>Using gross 1099 receipts as qualifying income when the return shows much lower net.</li>
        <li>Co-mingled personal and business accounts with unexplained transfers.</li>
      </ul>

      <h2>How this connects to products</h2>
      <p>
        FHA and conventional can both work for documented 1099 income. The{" "}
        <Link href="/blog/fha-vs-conventional-loans-utah">FHA vs conventional guide</Link> is about credit, down
        payment, and mortgage insurance, not a shortcut around tax returns. If the returns are the problem, read{" "}
        <Link href="/blog/bank-statement-loans-when-tax-returns-undercount-income">bank-statement loans</Link>.
      </p>
      <p>
        Start with the income pattern on{" "}
        <Link href="/blog/can-i-get-a-mortgage-if-my-income-changes-every-month">variable monthly income</Link>{" "}
        and the cluster hub at{" "}
        <Link href="/learn/variable-income">/learn/variable-income</Link>. If you{" "}
        <Link href="/blog/just-went-1099-last-month">just went 1099 last month</Link>, that is a seasoning question,
        not this checklist. If a partner’s W-2 is part of the story, they generally need to be a borrower:{" "}
        <Link href="/blog/spouse-w2-offset-1099-volatility">spouse W-2 offset</Link>. Partners and S-corp owners:{" "}
        <Link href="/blog/k-1-income-what-usually-counts">K-1 income — what usually counts</Link>.
      </p>
    </ArticleShell>
  )
}
