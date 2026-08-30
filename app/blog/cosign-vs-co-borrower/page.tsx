import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { COSIGN_VS_COBORROWER, LENDING_FACTS_AS_OF, PARENT_GIFTING } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/cosign-vs-co-borrower"

const faqs = [
  {
    question: "If someone only cosigns, are they still underwritten?",
    answer: COSIGN_VS_COBORROWER.cosign,
  },
  {
    question: "Is being on title the same as being on the note?",
    answer: COSIGN_VS_COBORROWER.title,
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "note", heading: "On the note", href: "/qualify" },
  { id: "title", heading: "On title (deed)" },
  { id: "gift", heading: "Helping credit / gift only", href: "/blog/parent-gifting-down-payment-who-signs" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "who",
    criterion: "Who they are",
    cells: {
      note: COSIGN_VS_COBORROWER.coBorrower,
      title: COSIGN_VS_COBORROWER.title,
      gift: COSIGN_VS_COBORROWER.giftVsHelp,
    },
  },
  {
    id: "credit",
    criterion: "Credit and DTI",
    cells: {
      note: "Their tri-merge and counted debts are in the file. Income can count when they applied and it is documented.",
      title: "Title alone does not put their income in qualifying. It can still create occupancy and overlay issues.",
      gift: "A donor who is not on the note is not a credit overlay to “boost” the file. Gift rules are a paper trail.",
    },
  },
  {
    id: "occupy",
    criterion: "Occupancy",
    cells: {
      note: COSIGN_VS_COBORROWER.nonOccupant,
      title: "Who lives there still has to match the occupancy you stated. A parent on title who will not occupy is a different file from a gift.",
      gift: PARENT_GIFTING.occupancy,
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Cosign vs Co-Borrower",
  description:
    "Who is on the note, who is on title, and who is only helping credit. A silent auto-loan cosigner is not how most mortgage files work.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["cosign vs co-borrower mortgage", "non-occupant co-borrower", "on the note vs on title"],
  faqs,
})

export default function CosignVsCoborrowerPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Cosign vs Co-Borrower",
        description:
          "Who is on the note, who is on title, and who is only helping credit. Not a silent auto-loan cosigner.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "The note, the deed, and a gift letter are three different signatures.",
        faqs,
        keywords: ["cosigner mortgage", "co-borrower vs title"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        On a mortgage, “cosign” usually means someone will be on the note — and then they are underwritten as a
        borrower, occupant or not. That is different from being on title only, and different from a parent who only
        gifts. A silent auto-loan cosigner is not how most purchase files work. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>
      <p>{COSIGN_VS_COBORROWER.fairHousing}</p>

      <h2>Note vs title vs gift</h2>
      <ComparisonTable
        caption={`Note, title, and gift-only help as of ${LENDING_FACTS_AS_OF}. Not legal advice.`}
        columns={columns}
        rows={rows}
        footnote="Educational snapshot. Overlay and occupancy still apply."
      />
      <p>{COSIGN_VS_COBORROWER.cosign}</p>

      <h2>Non-occupant co-borrower is still a borrower</h2>
      <p>{COSIGN_VS_COBORROWER.nonOccupant}</p>
      <p>
        Occupancy types: <Link href="/blog/second-home-vs-investment-occupancy">primary vs second home vs investment</Link>
        . A parent who is only gifting:{" "}
        <Link href="/blog/parent-gifting-down-payment-who-signs">who signs what</Link>. Gift paper trail:{" "}
        <Link href="/blog/gift-funds-down-payment-rules">gift-fund rules</Link>.
      </p>

      <h2>Scenarios</h2>
      <ul>
        <li>
          <strong>Parent will occupy and apply.</strong> That is a co-borrower file: both credit files, both counted
          debts, occupancy of who lives where.
        </li>
        <li>
          <strong>Parent will not occupy but will apply.</strong> Non-occupant co-borrower overlays. Not a way to
          finance a rental as a primary.
        </li>
        <li>
          <strong>Parent only wires down payment.</strong> Stay off the note and usually off title on the child’s
          primary. {PARENT_GIFTING.signatures}
        </li>
      </ul>
      <p>
        Adding someone mid-file is a new application, not a nickname. New installment debt if they also buy a car:{" "}
        <Link href="/blog/new-auto-loan-during-underwriting">auto loan during underwriting</Link>. File-level first-time
        stalls: <Link href="/blog/first-time-buyer-file-mistakes">file mistakes</Link>.
      </p>

      <h2>What this page will not do</h2>
      <ul>
        <li>Tell you to put a relative on title to “help credit” without underwriting them.</li>
        <li>Prefer married applicants or require a spouse. {COSIGN_VS_COBORROWER.fairHousing}</li>
        <li>Quote a score boost from an authorized-user tradeline. That is a different overlay conversation.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Decide whether the helper is a donor, a co-borrower, or someone who will take title — then match the contract and the application.</li>
        <li>
          Tri-merge mechanics: <Link href="/blog/what-a-tri-merge-credit-report-shows">what a tri-merge shows</Link>.
        </li>
        <li>
          Conversation: <Link href="/qualify">what a mortgage conversation asks</Link>. Adding a person is not a
          paperwork trick.
        </li>
      </ol>
    </ArticleShell>
  )
}
