import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { ASSET_DEPLETION, LENDING_FACTS_AS_OF, NON_QM } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/asset-depletion-qualifying-non-qm"

const faqs = [
  {
    question: "If I have a large brokerage account, am I automatically qualified?",
    answer: ASSET_DEPLETION.what,
  },
  {
    question: "Is asset-depletion the same as a bank-statement loan or DSCR?",
    answer: ASSET_DEPLETION.vsBankAndDscr,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "bank", heading: "Bank-statement", href: "/blog/bank-statement-loans-when-tax-returns-undercount-income" },
  { id: "dscr", heading: "DSCR", href: "/blog/dscr-vs-full-doc-rental-loan" },
  { id: "asset", heading: "Asset-depletion" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "engine",
    criterion: "What typically qualifies the file",
    cells: {
      bank: NON_QM.bankStatement,
      dscr: NON_QM.dscr,
      asset: ASSET_DEPLETION.what,
    },
  },
  {
    id: "who",
    criterion: "Who it is usually a conversation for",
    cells: {
      bank: "Self-employed borrowers whose tax returns undercount cash flow after write-offs.",
      dscr: "Investors; occupancy is usually investment. Rent versus the proposed payment.",
      asset: ASSET_DEPLETION.who,
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Asset-Depletion Qualifying: Retirement and Investment Assets",
  description:
    "Eligible assets can be treated as qualifying income under a written formula. Agency and Non-QM paths differ. Not “cash means approved.”",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["asset depletion mortgage", "asset based qualifying Non-QM", "retirement assets as income mortgage"],
  faqs,
})

export default function AssetDepletionQualifyingPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Asset-Depletion Qualifying: Retirement and Investment Assets",
        description:
          "Eligible assets can be treated as qualifying income under a written formula. Agency and Non-QM paths differ. Not “cash means approved.”",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "A written formula on eligible assets — not a screenshot of a brokerage balance.",
        faqs,
        keywords: ["asset depletion qualifying", "assets as income mortgage"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Asset-depletion qualifying treats eligible liquid and sometimes retirement assets as a stream of qualifying
        income under a written formula. It is not “you have cash, so you are approved,” and it is not a cheaper jumbo
        conventional shortcut you can assume. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{ASSET_DEPLETION.agencyVsNonQm}</p>

      <h2>Three Non-QM conversations (plus an agency cousin)</h2>
      <ComparisonTable
        caption={`Bank-statement vs DSCR vs asset-depletion as of ${LENDING_FACTS_AS_OF}. Overlays differ by investor.`}
        columns={columns}
        rows={rows}
        footnote="If an agency W-2 or return file already qualifies, that path is usually more standard. See the Non-QM hub."
      />
      <p>
        Parent map: <Link href="/learn/non-qm">Non-QM, bank-statement, and DSCR</Link>. {NON_QM.notAgency}
      </p>

      <h2>How the formula usually looks (not an approval calculator)</h2>
      <p>{ASSET_DEPLETION.formulaShape}</p>
      <p>{ASSET_DEPLETION.eligible}</p>
      <ul>
        <li>Seasoned accounts in the borrower’s name, with statements.</li>
        <li>Subtract funds needed to close and required reserves — those dollars are not also “income.”</li>
        <li>Haircuts on stocks, concentrated holdings, and retirement are common.</li>
        <li>Recently deposited gifts and business accounts are often limited or excluded.</li>
      </ul>
      <p>
        Reserves after cash to close are a separate test:{" "}
        <Link href="/blog/mortgage-reserves-months-of-pitia">months of PITIA</Link>.
      </p>

      <h2>Who this is (and is not) for</h2>
      <p>{ASSET_DEPLETION.who}</p>
      <ul>
        <li>Retirement or high-asset files where employment income is thin on paper.</li>
        <li>Not a way to skip occupancy rules on a rental. Occupancy still has to match use.</li>
        <li>
          Not a substitute for{" "}
          <Link href="/blog/just-went-1099-last-month">brand-new 1099 income</Link> unless the overlay actually uses
          assets — ask, do not assume.
        </li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>If agency income already documents, start there. Asset-depletion is the branch when it does not.</li>
        <li>Bring statements, not a net-worth slide. Large deposits still have to be sourced.</li>
        <li>
          Investment occupancy, if that is the property: <Link href="/learn/investment">investment hub</Link> and{" "}
          <Link href="/blog/dscr-vs-full-doc-rental-loan">DSCR vs full-doc</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
