import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { HILL_AFB_VA, LENDING_FACTS_AS_OF, OCCUPANCY_TYPES, VA_ENTITLEMENT, VA_FUNDING_FEE } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/hill-afb-va-coe-occupancy"

const faqs = [
  {
    question: "Is Hill Air Force Base in Utah?",
    answer: HILL_AFB_VA.where,
  },
  {
    question: "Can I keep living in base housing and call a purchased house a VA primary?",
    answer: HILL_AFB_VA.baseHousingVsPurchase,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "base", heading: "On-base housing" },
  { id: "buy", heading: "VA purchase off-base", href: "/loans/va" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      base: "Typically a lease. Occupancy of the unit is a housing assignment, not a VA note.",
      buy: HILL_AFB_VA.occupancy,
    },
  },
  {
    id: "coe",
    criterion: "COE",
    cells: {
      base: "A COE is not required to live in base housing.",
      buy: HILL_AFB_VA.coe,
    },
  },
  {
    id: "bah",
    criterion: "BAH",
    cells: {
      base: HILL_AFB_VA.bah,
      buy: "BAH can help a household budget. It is not a substitute for residual income, DTI, or occupancy certification on the VA file.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Hill AFB / VA: Certificate of Eligibility and Occupancy",
  description:
    "Hill Air Force Base is in Davis County, Utah. COE, occupancy, and base housing vs a purchase — not a mill doorway. Occupancy must match use.",
  published: "2026-08-29",
  category: "Loan Programs",
  keywords: ["Hill AFB VA loan", "Hill Air Force Base COE", "VA occupancy Utah"],
  faqs,
})

export default function HillAfbVaPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Hill AFB / VA: Certificate of Eligibility and Occupancy",
        description:
          "Hill Air Force Base is in Davis County, Utah. COE and occupancy — not a mill doorway. Occupancy must match use.",
        published: "2026-08-29",
        category: "Loan Programs",
        bannerSubtitle: "A useful Utah veteran resource. Not a /hill-afb-mortgage mill.",
        faqs,
        keywords: ["Hill AFB VA", "VA Certificate of Eligibility occupancy"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Hill Air Force Base is in Davis County, Utah. A VA purchase there still needs a Certificate of Eligibility
        and occupancy that matches how you will actually live. This is not a mill doorway, not a second-VA-loan
        clone, and not a restoration guide. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{HILL_AFB_VA.where}</p>
      <p>{OCCUPANCY_TYPES.fairHousing}</p>

      <h2>COE first, occupancy still separate</h2>
      <p>{HILL_AFB_VA.coe}</p>
      <p>
        Remaining entitlement, a second VA loan while another is open, and occupancy of the new property:{" "}
        <Link href="/blog/va-entitlement-second-va-loan">can I use VA if I still have a VA loan?</Link>. Funding fee
        (finance vs cash, exemptions):{" "}
        <Link href="/blog/va-funding-fee-finance-vs-pay-cash">VA funding fee</Link>. Residual income vs DTI:{" "}
        <Link href="/blog/va-residual-income-vs-dti">residual vs DTI</Link>. After a sale and payoff:{" "}
        <Link href="/blog/selling-with-va-loan-entitlement-restoration">entitlement restoration</Link>.{" "}
        {HILL_AFB_VA.notRestoration}
      </p>
      <p>
        {VA_ENTITLEMENT.occupancy} {VA_FUNDING_FEE.downPaymentNote}
      </p>

      <h2>Base housing vs a purchase</h2>
      <ComparisonTable
        caption={`On-base housing vs a VA purchase as of ${LENDING_FACTS_AS_OF}. Occupancy has to match use.`}
        columns={columns}
        rows={rows}
        footnote="Not occupancy coaching. Not a BAH quote."
      />
      <p>{HILL_AFB_VA.baseHousingVsPurchase}</p>
      <p>
        {OCCUPANCY_TYPES.fraud} Primary vs second home vs investment:{" "}
        <Link href="/blog/second-home-vs-investment-occupancy">occupancy types</Link>.
      </p>

      <h2>Commute geography, not a mill</h2>
      <p>{HILL_AFB_VA.commute}</p>
      <p>
        Program overview: <Link href="/loans/va">VA loans in Utah</Link>. A veteran in a rural tract is a different
        comparison: <Link href="/blog/usda-vs-va-vs-fha-veteran-rural">USDA vs VA vs FHA</Link>.
      </p>

      <h2>BAH is not a permanent number on this page</h2>
      <p>
        {HILL_AFB_VA.bah} Official lookup (opens a Department of Defense site):{" "}
        <a href={HILL_AFB_VA.bahLookupUrl} className="underline underline-offset-4" rel="noopener noreferrer" target="_blank">
          DTMO BAH rate lookup
        </a>
        . Confirm it is still the published tool.
      </p>

      <h2>What this page will not do</h2>
      <ul>
        <li>Invent a current BAH dollar figure or treat BAH as qualifying income by itself.</li>
        <li>Coach anyone to label a rental as a VA primary while remaining in base housing.</li>
        <li>Publish a city mill of “best Hill AFB lenders” or swap Utah copy onto another base.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Ask a loan officer to pull or review the COE before you treat zero-down as automatic.</li>
        <li>Say how you will occupy the house — including PCS timing and whether you will leave base housing.</li>
        <li>
          Conversation, not a promise: <Link href="/qualify">start a mortgage conversation</Link>. Residual and
          funding-fee questions belong in that file, not in a neighborhood slogan.
        </li>
      </ol>
    </ArticleShell>
  )
}
