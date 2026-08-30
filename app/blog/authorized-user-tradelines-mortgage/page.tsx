import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { AUTHORIZED_USER_TRADELINES, LENDING_FACTS_AS_OF, TRI_MERGE } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/authorized-user-tradelines-mortgage"

const faqs = [
  {
    question: "Do authorized-user tradelines help a mortgage file?",
    answer: AUTHORIZED_USER_TRADELINES.whatItDoes,
  },
  {
    question: "Is adding myself to a parent’s card a mortgage strategy?",
    answer: AUTHORIZED_USER_TRADELINES.notPiggyback,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "au", heading: "Authorized user" },
  { id: "borrower", heading: "You are obligated", href: "/blog/what-a-tri-merge-credit-report-shows" },
  { id: "coborrower", heading: "Co-borrower", href: "/blog/cosign-vs-co-borrower" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      au: AUTHORIZED_USER_TRADELINES.what,
      borrower: "A revolving or installment tradeline in your name that you are contractually obligated to pay.",
      coborrower: "Someone who applies with you: on the note, credit and debts in DTI, income can count when documented.",
    },
  },
  {
    id: "uw",
    criterion: "What underwriting often does",
    cells: {
      au: AUTHORIZED_USER_TRADELINES.overlays,
      borrower: TRI_MERGE.shows,
      coborrower: AUTHORIZED_USER_TRADELINES.vsCosign,
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Authorized User Tradelines: Help or Overlay Risk",
  description:
    "What AU tradelines do and do not do on a mortgage tri-merge. Overlays often discount them. Not a piggyback scheme and not a score-raise method.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["authorized user tradelines mortgage", "AU tradeline underwriting", "piggyback credit mortgage"],
  faqs,
})

export default function AuthorizedUserTradelinesPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Authorized User Tradelines: Help or Overlay Risk",
        description:
          "What AU tradelines do and do not do on a mortgage tri-merge. Not a piggyback scheme.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "A card you can swipe is not automatically a tradeline the AUS will count.",
        faqs,
        keywords: ["authorized user mortgage", "AU tradeline overlay"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Authorized-user tradelines can show on a mortgage tri-merge, and they still often fail to do what people hope:
        they do not automatically become your credit history, they do not make you a co-borrower, and they are not a
        published way to “boost” a file. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{AUTHORIZED_USER_TRADELINES.notPiggyback}</p>
      <p>{AUTHORIZED_USER_TRADELINES.fairHousing}</p>

      <h2>What an AU tradeline is</h2>
      <p>{AUTHORIZED_USER_TRADELINES.what}</p>
      <p>{AUTHORIZED_USER_TRADELINES.whatItDoes}</p>
      <p>{AUTHORIZED_USER_TRADELINES.whatItDoesNot}</p>
      <ComparisonTable
        caption={`AU vs obligated tradeline vs co-borrower as of ${LENDING_FACTS_AS_OF}. Not a score promise.`}
        columns={columns}
        rows={rows}
        footnote="Mortgage files typically use the tri-merge and classic FICO models, not a monitoring-app number."
      />

      <h2>What the tri-merge actually shows</h2>
      <p>
        {TRI_MERGE.what} {TRI_MERGE.middleScore} Deep guide:{" "}
        <Link href="/blog/what-a-tri-merge-credit-report-shows">what a tri-merge shows</Link>.
      </p>
      <p>
        Closing a card you <em>are</em> obligated on is a different utilization problem:{" "}
        <Link href="/blog/closing-credit-card-before-mortgage">closing a credit card before you apply</Link>. A thin
        traditional file is a different path from AU cosmetics:{" "}
        <Link href="/blog/no-traditional-credit-alternative-credit">alternative credit</Link>.
      </p>

      <h2>Scenarios (file facts, not coaching)</h2>
      <ul>
        <li>
          <strong>You have been an AU for years and also have your own cards and installment history.</strong> The AU
          line may be noise. The obligated tradelines usually drive AUS.
        </li>
        <li>
          <strong>The only revolving history is a parent’s card.</strong> Overlays and AUS often treat that as not
          enough of <em>your</em> history. Alternative credit (rent, utilities) may be the conversation — not adding
          more AU cards.
        </li>
        <li>
          <strong>Someone offers to “add you” for a fee.</strong> That is not a mortgage documentation method. Do not
          buy tradelines.
        </li>
      </ul>

      <h2>What this page will not do</h2>
      <ul>
        <li>Quote a FICO change from becoming an authorized user.</li>
        <li>Walk through how to piggyback, season, or hide whose debt is whose.</li>
        <li>Treat marital status or family structure as a credit product. {AUTHORIZED_USER_TRADELINES.fairHousing}</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Ask what the tri-merge counted — obligated tradelines vs AU — not what a consumer app displayed.</li>
        <li>
          If someone else will be on the <em>note</em>, that is{" "}
          <Link href="/blog/cosign-vs-co-borrower">cosign vs co-borrower</Link>, not AU.
        </li>
        <li>
          A conversation is not approval: <Link href="/qualify">start a mortgage conversation</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
