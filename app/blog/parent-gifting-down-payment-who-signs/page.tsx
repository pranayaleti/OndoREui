import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, PARENT_GIFTING } from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/parent-gifting-down-payment-who-signs"

const faqs = [
  {
    question: "Does a parent who gifts have to sign the mortgage?",
    answer:
      "Generally no. If they are only gifting, they sign the gift letter and provide donor statements. They sign the note only if they are also a borrower.",
  },
  {
    question: "Can the parent go on title without going on the loan?",
    answer:
      "Sometimes, and it often creates occupancy, gift-of-equity, and program problems on a primary-residence file. Ask before you add a parent to the deed as a workaround.",
  },
]

const columns: readonly ComparisonColumn[] = [
  { id: "gift", heading: "Gift only", href: "/blog/gift-funds-down-payment-rules" },
  { id: "title", heading: "Parent on title, not the loan", href: "/learn/first-time" },
  { id: "coborrower", heading: "Parent is a co-borrower", href: "/qualify" },
]

const rows: readonly ComparisonRow[] = [
  {
    id: "who-signs-letter",
    criterion: "Gift letter",
    cells: {
      gift: "Parent (donor) signs. States amount, relationship, and that repayment is not required.",
      title: "Still needed if any money is a gift. Title vesting does not replace the letter.",
      coborrower: "Usually not a gift file. Their income and credit are in the application.",
    },
  },
  {
    id: "who-signs-note",
    criterion: "Note and mortgage / deed of trust",
    cells: {
      gift: "Child (borrower) only.",
      title: "Borrower signs the loan. Parent on title is a separate deed conversation and a common overlay issue.",
      coborrower: "Parent and child both sign.",
    },
  },
  {
    id: "occupancy",
    criterion: "Occupancy",
    cells: {
      gift: "Child occupies as primary residence. Parent does not move in as a workaround to get on the loan.",
      title: "If the parent will live there, this may be a co-borrower or non-occupant co-borrower file — not a quiet gift.",
      coborrower: "Who occupies must match the program. Non-occupant co-borrower rules differ by FHA vs conventional.",
    },
  },
  {
    id: "repc",
    criterion: "Utah REPC / purchase contract",
    cells: {
      gift: "Buyers on the contract should match the borrowers. A parent who is only gifting usually stays off the REPC.",
      title: "If the parent is taking title, they often need to be on the contract. That is not a gift-only file.",
      coborrower: "All borrowers who will take title should be on the contract.",
    },
  },
]

export const metadata = articleMetadata({
  path,
  title: "Parent Is Gifting: Who Signs What",
  description:
    "Gift letter, donor statements, occupancy, and title — who signs when a parent helps with down payment.",
  published: "2026-08-29",
  category: "First-Time Buyers",
  keywords: ["parent gift down payment signatures", "who signs gift letter mortgage", "parent on title vs gift"],
  faqs,
})

export default function ParentGiftingPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Parent Is Gifting: Who Signs What",
        description:
          "Gift letter, donor statements, occupancy, and title — who signs when a parent helps with down payment.",
        published: "2026-08-29",
        category: "First-Time Buyers",
        bannerSubtitle: "A gift is paperwork and occupancy. It is not a quiet extra signature on the deed.",
        faqs,
        keywords: ["parent gifting down payment", "gift letter who signs"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        If a parent is helping with down payment, the parent signs a gift letter and proves the money left their
        account. They do not sign the mortgage unless they are also a borrower. Putting them on title “just in case”
        is a different file. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <h2>Gift-only vs co-borrower vs on title</h2>
      <p>{PARENT_GIFTING.occupancy}</p>
      <p>{PARENT_GIFTING.signatures}</p>
      <ComparisonTable
        caption={`Who typically signs as of ${LENDING_FACTS_AS_OF}. Program overlays still apply.`}
        columns={columns}
        rows={rows}
        footnote="This is not a closing instruction. Title companies and investors can require additional affidavits."
      />

      <h2>Donor documentation (signatures and paper)</h2>
      <p>
        The paper trail itself lives on{" "}
        <Link href="/blog/gift-funds-down-payment-rules">gift-fund rules</Link>. This page is who touches which
        document:
      </p>
      <ul>
        <li>
          <strong>Gift letter</strong> — donor signs. Amount, relationship, no repayment.
        </li>
        <li>
          <strong>Donor statements</strong> — show the money was theirs, then left. Screenshots without a bank header
          stall files.
        </li>
        <li>
          <strong>Wire or cashier’s check</strong> — to escrow, with instructions that match the letter. A cash deposit
          into the buyer’s account is the{" "}
          <Link href="/blog/large-deposits-60-day-paper-trail">large-deposit</Link> problem, not a gift.
        </li>
        <li>
          <strong>Notary</strong> — some lenders want the gift letter notarized. That is an overlay, not a federal
          ritual.
        </li>
      </ul>

      <h2>If down payment assistance is also in the stack</h2>
      <p>
        A second-lien DPA is not a gift and has its own signatures (note, deed of trust, agency affidavits). How they
        sit together: <Link href="/blog/dpa-stacked-with-fha-gift-funds">DPA stacked with an FHA gift</Link>.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Decide whether the parent is a donor, a co-borrower, or taking title — pick one story and keep it. Note vs title vs gift:{" "}
          <Link href="/blog/cosign-vs-co-borrower">cosign vs co-borrower</Link>.</li>
        <li>Do not move money until a loan officer says how this program wants it sourced.</li>
        <li>
          First-time cash and closing map: <Link href="/learn/first-time">first-time hub</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
