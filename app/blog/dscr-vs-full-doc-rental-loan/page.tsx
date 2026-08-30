import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { DSCR_VS_FULL_DOC, LENDING_FACTS_AS_OF, NON_QM } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/dscr-vs-full-doc-rental-loan"

const faqs = [
  {
    question: "Does a DSCR loan ignore my personal income?",
    answer:
      "It typically does not use personal DTI as the qualifying engine. Personal returns can still be in the file for identity, assets, or other tests. It is not a pre-2008 stated-income product.",
  },
  {
    question: "If I can document agency investment income, should I still use DSCR?",
    answer: NON_QM.notAgency,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "dscr", heading: "DSCR (property qualifies)", href: "/calculators/dscr" },
  { id: "full", heading: "Full-doc rental (borrower qualifies)", href: "/blog/schedule-e-rental-income-purchase-file" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "engine",
    criterion: "What is used to qualify",
    cells: {
      dscr: DSCR_VS_FULL_DOC.dscr,
      full: DSCR_VS_FULL_DOC.fullDoc,
    },
  },
  {
    id: "occupancy",
    criterion: "Typical occupancy",
    cells: {
      dscr: "Investment. The property is not your primary or second home.",
      full: "Investment on an agency rental purchase. If you will live in one unit, that is a house-hack / primary file — not this column.",
    },
  },
  {
    id: "docs",
    criterion: "Documents the file usually wants",
    cells: {
      dscr: "Lease or market-rent support, a rent-vs-payment worksheet, credit, assets, and property eligibility. Tax returns are not the income engine.",
      full: "Personal income docs plus Schedule E history or a proposed-rent worksheet. See rental income on Schedule E.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "DSCR vs Full-Doc Rental Loan",
  description:
    "DSCR qualifies on rent versus the payment. Full-doc qualifies the borrower. Occupancy and documents differ. Not a quote.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["DSCR vs full doc", "DSCR rental loan", "investment property mortgage documentation"],
  faqs,
})

export default function DscrVsFullDocPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "DSCR vs Full-Doc Rental Loan",
        description:
          "DSCR qualifies on rent versus the payment. Full-doc qualifies the borrower. Occupancy and documents differ.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "Two qualification paths for a rental. Occupancy is not a label you shop for a cheaper rate.",
        faqs,
        keywords: ["DSCR loan", "full documentation investment property"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A DSCR rental loan typically asks whether the property’s rent covers the proposed payment. A full-doc rental
        loan typically asks whether <em>you</em> cover the payment after DTI and a rental-income worksheet. They are
        different stacks, not two names for the same approval. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <h2>Side by side</h2>
      <ComparisonTable
        caption={`DSCR vs full-doc as of ${LENDING_FACTS_AS_OF}. Overlays differ by investor.`}
        columns={columns}
        rows={rows}
        footnote="Educational snapshot. Not a menu, not a quote, and not occupancy advice."
      />
      <p>{DSCR_VS_FULL_DOC.notAQuote}</p>

      <h2>When full-doc is the first conversation</h2>
      <p>
        If you already have rental history on Schedule E, start with{" "}
        <Link href="/blog/schedule-e-rental-income-purchase-file">Schedule E on a purchase file</Link>. Agency
        investment pricing is often more standard when the borrower can be qualified. {NON_QM.notAgency}
      </p>
      <p>
        Bank-statement is a third stack: it underwrites deposits when tax returns undercount cash flow. It is still
        usually a <em>borrower</em> qualification, not DSCR. Map it on the{" "}
        <Link href="/learn/non-qm">Non-QM hub</Link>.
      </p>

      <h2>When DSCR even enters the chat</h2>
      <p>
        {NON_QM.dscr} Use the <Link href="/calculators/dscr">DSCR calculator</Link> as an illustration of rent versus
        payment — including vacancy and expenses the investor will haircut. The tool cannot see occupancy or your tax
        returns.
      </p>
      <p>
        Funding a rental down payment from a cash-out on the house you occupy is a different trap: two occupancies, two
        LTVs. See <Link href="/blog/cash-out-to-buy-a-rental">cash-out to buy a rental</Link>. Occupancy labels are{" "}
        <Link href="/blog/second-home-vs-investment-occupancy">primary, second home, or investment</Link> — not a
        pricing hack. {DSCR_VS_FULL_DOC.occupancy}
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Say how you will actually use the property. Occupancy is the first fork, not the last.</li>
        <li>
          If you have Schedule E history, bring two years of returns. If you do not, a DSCR illustration is still not an
          application.
        </li>
        <li>
          Ask a loan officer which investor stack can see the cash flow you can document. That conversation is not
          approval.
        </li>
      </ol>
    </ArticleShell>
  )
}
