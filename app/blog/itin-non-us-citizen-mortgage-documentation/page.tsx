import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { ALTERNATIVE_CREDIT, ITIN_DOCUMENTATION, LENDING_FACTS_AS_OF } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/itin-non-us-citizen-mortgage-documentation"

const faqs = [
  {
    question: "Is an ITIN the same as a Social Security number for an agency loan?",
    answer: ITIN_DOCUMENTATION.agencyVsNonQm,
  },
  {
    question: "Is national origin a reason to pick a program or a document stack?",
    answer: ITIN_DOCUMENTATION.noEasier,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "agency", heading: "Agency / FHA documentation", href: "/loans/fha" },
  { id: "nonqm", heading: "ITIN / Non-QM overlays", href: "/learn/non-qm" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "id",
    criterion: "Typical identity / tax number",
    cells: {
      agency: ITIN_DOCUMENTATION.agencyVsNonQm,
      nonqm: ITIN_DOCUMENTATION.whatItinIs,
    },
  },
  {
    id: "docs",
    criterion: "Documentation categories (not preferences)",
    cells: {
      agency: ITIN_DOCUMENTATION.docs,
      nonqm:
        "Same categories, plus investor overlays that may accept an ITIN file when agency AUS will not. Overlays change. Not a ranking of visa types.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "ITIN / Non-U.S. Citizen Mortgage Documentation",
  description:
    "What lenders typically document for ITIN and lawful-presence files. Citizenship is a legal eligibility topic, not a national-origin preference. Educational only.",
  published: "2026-08-29",
  category: "Credit",
  keywords: [
    "ITIN mortgage documentation",
    "non-U.S. citizen mortgage documents",
    "SSN vs ITIN home loan",
  ],
  faqs,
})

export default function ItinDocumentationPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "ITIN / Non-U.S. Citizen Mortgage Documentation",
        description:
          "What lenders typically document for ITIN and lawful-presence files. Citizenship is a legal eligibility topic, not a national-origin preference.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "Legal eligibility and documents — not who we prefer.",
        faqs,
        keywords: ["ITIN mortgage", "non-citizen documentation"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Lenders document citizenship and immigration status because some federal loan programs have legal eligibility
        rules — not because national origin is a credit score. An ITIN is an IRS tax number, not work authorization and
        not a promise of approval. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{ITIN_DOCUMENTATION.notNationalOrigin}</p>
      <p>{ITIN_DOCUMENTATION.noEasier}</p>
      <p>
        Thin traditional credit is a different path:{" "}
        <Link href="/blog/no-traditional-credit-alternative-credit">alternative credit</Link>.{" "}
        {ALTERNATIVE_CREDIT.fairHousing}
      </p>

      <h2>What an ITIN is (and is not)</h2>
      <p>{ITIN_DOCUMENTATION.whatItinIs}</p>
      <p>{ITIN_DOCUMENTATION.agencyVsNonQm}</p>
      <p>{ITIN_DOCUMENTATION.utahNote}</p>

      <h2>Documentation categories — not a preference list</h2>
      <ComparisonTable
        caption={`Documentation categories as of ${LENDING_FACTS_AS_OF}. Confirm the guide in force.`}
        columns={columns}
        rows={rows}
        footnote="Visa types are labels on documents. They are not a ranking of applicants."
      />
      <p>{ITIN_DOCUMENTATION.docs}</p>
      <p>{ITIN_DOCUMENTATION.visaExamples}</p>

      <h2>What this page will not do</h2>
      <ul>
        <li>Rank a file by country of origin or visa nationality.</li>
        <li>Treat GSE or HUD residency rules as frozen forever — confirm the guide in force.</li>
        <li>Give immigration, tax, or legal advice.</li>
        <li>Steer anyone to a neighborhood or a program by national origin.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>
          If agency income already documents with a valid SSN and lawful presence, start there —{" "}
          <Link href="/loans">loan programs</Link> and{" "}
          <Link href="/blog/1099-mortgage-documentation-checklist">1099 checklist</Link> when income is contract.
        </li>
        <li>
          If the file is ITIN-only, that is typically a <Link href="/learn/non-qm">Non-QM</Link> overlay conversation,
          not a cheaper conventional shortcut.
        </li>
        <li>
          Bring identity and tax documents as categories, not as a story about where you are from. A conversation does
          not approve you: <Link href="/qualify">qualify</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
