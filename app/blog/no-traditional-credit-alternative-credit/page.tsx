import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { ALTERNATIVE_CREDIT, LENDING_FACTS_AS_OF } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/no-traditional-credit-alternative-credit"

const faqs = [
  {
    question: "If I have no credit cards, can I still get a mortgage?",
    answer:
      "Sometimes, if you can document nontraditional credit references such as rent and utilities for about 12 months. That is not the same as having traditional credit that is simply weak. It is not a promise of approval.",
  },
  {
    question: "Is FHA the loan for people without credit?",
    answer:
      "FHA has a documented non-traditional credit path, and so does Fannie Mae. Who uses which path is about the credit file, not who the applicant is. These pages do not steer anyone to a program by protected class.",
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "none", heading: "No or thin traditional credit", href: "/loans/fha" },
  { id: "weak", heading: "Traditional credit that is weak", href: "/blog/medical-collections-after-fico-model-change" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "meaning",
    criterion: "What the file usually is",
    cells: {
      none: "Little or no score because tradelines were never opened — or not enough to generate a usable score after a three-bureau check.",
      weak: "Scores exist. Late pays, collections, or high utilization are on traditional revolving and installment lines.",
    },
  },
  {
    id: "path",
    criterion: "Typical documentation path",
    cells: {
      none: ALTERNATIVE_CREDIT.fannie,
      weak: "Underwrite the traditional file: scores, AUS, overlays, and any payoff conditions. Alternative-credit references do not erase derogatory tradelines.",
    },
  },
  {
    id: "fha",
    criterion: "FHA note",
    cells: {
      none: ALTERNATIVE_CREDIT.fha,
      weak: "FHA may still be a conversation when scores exist but sit near overlays. That is a credit-file question, not a steering slogan.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "No Traditional Credit / Alternative Credit",
  description:
    "Rent and utilities can document a thin file. Weak traditional credit is a different path. Fair Housing safe — no steering.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["alternative credit mortgage", "no credit history FHA", "nontraditional credit Fannie Mae"],
  faqs,
})

export default function AlternativeCreditPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "No Traditional Credit / Alternative Credit",
        description:
          "Rent and utilities can document a thin file. Weak traditional credit is a different path. Fair Housing safe.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "No score is not the same as a low score. Documented payments can still be a file.",
        faqs,
        keywords: ["nontraditional credit", "thin credit file mortgage"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        If you have little or no traditional credit, some purchase programs can still look at documented rent, utilities,
        and similar payments — often about 12 months. That path is for a thin or no-hit file after the lender checks
        all three repositories. It is not a workaround for bad traditional credit, and it is not assigned by who you
        are. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{ALTERNATIVE_CREDIT.fairHousing}</p>

      <h2>Thin file vs weak file</h2>
      <p>{ALTERNATIVE_CREDIT.who}</p>
      <ComparisonTable
        caption={`Two different credit conversations as of ${LENDING_FACTS_AS_OF}.`}
        columns={columns}
        rows={rows}
        footnote="Educational snapshot. Overlays apply. Not a credit decision."
      />

      <h2>What usually counts as a reference</h2>
      <ul>
        <li>Housing payments to a landlord or documented private housing payments (not a relative’s informal IOU without paper).</li>
        <li>Utilities billed in your name — electricity, gas, water, phone, internet — when they are not already inside the rent.</li>
        <li>Insurance premiums, documented private installment payments, or similar 12-month patterns the guide allows.</li>
      </ul>
      <p>
        Cancelled checks, statements, or a nontraditional mortgage credit report are typical paper. Twelve months with
        late pays on those references is usually not the same as a clean alternative-credit history.
      </p>

      <h2>Fannie Mae and FHA are both documentation paths</h2>
      <p>{ALTERNATIVE_CREDIT.fannie}</p>
      <p>
        {ALTERNATIVE_CREDIT.fha} Compare programs on{" "}
        <Link href="/blog/fha-vs-conventional-loans-utah">FHA vs conventional</Link> the same way any other buyer would —
        occupancy, MIP vs PMI, cash to close — not as a product “for” a type of person. Medical collections that still
        report are{" "}
        <Link href="/blog/medical-collections-after-fico-model-change">a different, dated credit snapshot</Link>.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Gather 12 months of rent and utility proof in your name before you apply.</li>
        <li>Expect the lender to still pull all three bureaus. Alternative credit starts after that check.</li>
        <li>
          A conversation can map documentation. It will not approve you. See{" "}
          <Link href="/qualify">what you will be asked</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
