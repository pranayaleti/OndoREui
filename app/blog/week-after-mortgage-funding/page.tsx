import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { FIRST_STATEMENT_VS_NOTE, LENDING_FACTS_AS_OF, PURCHASE_TIMELINE, WEEK_AFTER_FUNDING } from "@/lib/content"
import Link from "next/link"

const path = "/blog/week-after-mortgage-funding"

const faqs = [
  {
    question: "When is the first mortgage payment due?",
    answer: WEEK_AFTER_FUNDING.firstPayment,
  },
  {
    question: "Did my rate change if I get a servicing letter?",
    answer: WEEK_AFTER_FUNDING.servicing,
  },
]

export const metadata = articleMetadata({
  path,
  title: "What Happens the Week After Funding",
  description:
    "Recording, first payment timing, and possible servicing transfer after a Utah title-company closing. Ranges, not legal advice.",
  published: "2026-08-29",
  category: "First-Time Buyers",
  keywords: ["week after mortgage funding", "first mortgage payment after closing", "Utah recording after funding"],
  faqs,
})

export default function WeekAfterFundingPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "What Happens the Week After Funding",
        description:
          "Recording, first payment date, and servicing letters. Not legal advice and not a closing-date promise.",
        published: "2026-08-29",
        category: "First-Time Buyers",
        bannerSubtitle: "Funding is not the same as the first statement, and it is not a rate change.",
        faqs,
        keywords: ["after mortgage closing", "first payment after funding"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        The week after funding is mostly recording, calendaring the first payment from the note and Closing Disclosure,
        and watching for a servicing-transfer letter — not a new underwrite and not a rate change. Snapshot as of{" "}
        {LENDING_FACTS_AS_OF}.
      </p>
      <p>{WEEK_AFTER_FUNDING.notLegalAdvice}</p>

      <h2>What typically happens</h2>
      <p>{WEEK_AFTER_FUNDING.whatHappens}</p>
      <p>{WEEK_AFTER_FUNDING.recording}</p>
      <ul>
        <li>
          <strong>Keys.</strong> On a Utah purchase, you usually already have keys at funding. Construction or rent-back
          is a contract fact, not this page.
        </li>
        <li>
          <strong>Insurance.</strong> Your binder should already be in the file. Canceling a seller’s policy is not your
          servicer’s job.
        </li>
        <li>
          <strong>Title.</strong> Owner’s vs lender’s coverage:{" "}
          <Link href="/blog/title-insurance-owner-vs-lender">owner’s vs lender’s title insurance</Link>.
        </li>
      </ul>

      <h2>First payment timing</h2>
      <p>{WEEK_AFTER_FUNDING.firstPayment}</p>
      <p>
        Why the first bill can look different from the note rate:{" "}
        <Link href="/blog/first-mortgage-statement-vs-note-rate">first statement vs note rate</Link>.{" "}
        {FIRST_STATEMENT_VS_NOTE.oddDays}
      </p>

      <h2>Servicing may move</h2>
      <p>{WEEK_AFTER_FUNDING.servicing}</p>
      <p>
        Pay the party named on the notice. Autopay set up with the originator can miss a transfer. That is an operations
        issue, not a change to the note.
      </p>

      <h2>How this sits on the purchase timeline</h2>
      <p>
        {PURCHASE_TIMELINE.ctcToClose} Ranges from pre-approval through CTC:{" "}
        <Link href="/blog/how-long-first-purchase-takes">how long a first purchase usually takes</Link>. Utah contract
        clocks: <Link href="/blog/utah-repc-deadline-and-your-loan">REPC deadlines</Link>.
      </p>

      <h2>Checklist for the first ten days</h2>
      <ol>
        <li>Find the first due date on the CD and the note — do not wait for a statement.</li>
        <li>Save the servicer phone number and loan number from the CD or welcome letter.</li>
        <li>Watch mail and email for a hello / goodbye servicing letter.</li>
        <li>Keep hazard insurance in force. Impounds vs paying your own bills:{" "}
          <Link href="/blog/impounds-vs-waiving-escrow">impounds vs waiving escrow</Link>.</li>
      </ol>

      <h2>What this page will not do</h2>
      <ul>
        <li>Give legal advice, homestead advice, or a punch-list for construction defects.</li>
        <li>Promise a recording date or that servicing will or will not transfer.</li>
        <li>Quote your first payment.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>If a statement’s P&amp;I line does not match the note, call the servicer with the note in hand.</li>
        <li>
          Escrow calendar:{" "}
          <Link href="/blog/utah-property-tax-calendar-first-escrow-analysis">Utah tax calendar vs first analysis</Link>
          .
        </li>
        <li>
          First-time hub: <Link href="/learn/first-time">cash, assistance, closing</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
