import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { LENDING_FACTS_AS_OF } from "@/lib/content"
import Link from "next/link"

const path = "/blog/bank-statement-loans-when-tax-returns-undercount-income"

const faqs = [
  {
    question: "Is a bank-statement loan the same as stated income?",
    answer:
      "No. Modern bank-statement programs usually analyze deposits against written guidelines. They are not the pre-2008 “stated income” products, and they still include credit, assets, and property rules.",
  },
  {
    question: "Will this get me a lower rate than conventional?",
    answer:
      "Often the opposite. Non-QM pricing, reserves, and prepayment terms can be less favorable than a well-documented agency file. Use it when agency income calc does not reflect cash flow you can document, not as a default.",
  },
]

export const metadata = articleMetadata({
  path,
  title: "Bank-Statement Loans When Tax Returns Undercount Income",
  description:
    "When write-offs shrink taxable income, some Non-QM programs look at bank deposits. Who they are for, what they cost, and what they are not.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["bank statement loan", "Non-QM self employed", "self employed mortgage tax returns"],
  faqs,
})

export default function BankStatementLoansPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Bank-Statement Loans When Tax Returns Undercount Income",
        description:
          "When write-offs shrink taxable income, some Non-QM programs look at bank deposits. Who they are for, what they cost, and what they are not.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "A different income method. Not a shortcut around credit, occupancy, or honesty.",
        faqs,
        keywords: ["bank statement loan", "Non-QM"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        If you run a real business, tax returns can show a small number after depreciation, retirement contributions,
        and other deductions, while the operating account shows a living. Some Non-QM (non-qualified mortgage)
        programs underwrite from 12 or 24 months of statements instead of the adjusted tax figure. That can be a
        fit. It is not a secret conventional product, and it is not automatically available.
      </p>

      <h2>Who this is even about</h2>
      <ul>
        <li>Self-employed borrowers whose qualifying agency income is far below documented deposits.</li>
        <li>Borrowers who can produce complete personal and/or business statements without missing months.</li>
        <li>Files that still meet credit, reserve, and property guidelines for that investor.</li>
      </ul>

      <h2>What “bank statement” usually means (as of {LENDING_FACTS_AS_OF})</h2>
      <p>
        Investors publish a method: eligible deposits, minus disallowed items (for example transfers, cash, or
        refunds, depending on the guide), then a factor or expense ratio. The result is an illustrative qualifying
        income. Overlays differ by lender. We will not invent a factor on this page.
      </p>

      <h2>Tradeoffs to ask about</h2>
      <ul>
        <li>Price and fees vs a documented conventional or FHA file.</li>
        <li>Prepayment penalties on some products.</li>
        <li>Higher reserve requirements.</li>
        <li>Occupancy and property-type limits.</li>
      </ul>

      <h2>What to do first</h2>
      <p>
        If your returns already support the payment you want, start with{" "}
        <Link href="/loans/conventional">conventional</Link> or <Link href="/loans/fha">FHA</Link>. If they do not,
        start at the <Link href="/learn/non-qm">Non-QM hub</Link>, bring complete statements, and the{" "}
        <Link href="/blog/1099-mortgage-documentation-checklist">1099 checklist</Link> to a conversation. Use{" "}
        <Link href="/calculators/affordability">affordability</Link> only as an illustration. Asking about Non-QM is
        not an application and not an approval.
      </p>
    </ArticleShell>
  )
}
