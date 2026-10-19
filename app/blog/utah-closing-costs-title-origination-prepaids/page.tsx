import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import { StepList } from "@/components/content/step-list"
import {
  EARNEST_VS_DOWN_VS_CLOSING,
  EXAMPLE_NOTE,
  EXAMPLE_PURCHASE_PRICE_UTAH,
  LENDING_FACTS_AS_OF,
  TITLE_OWNER_VS_LENDER,
  UTAH_CLOSING_NOTES,
  UTAH_REPC,
} from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/utah-closing-costs-title-origination-prepaids"
const title = "Utah Closing Costs and Cash to Close: Title, Origination, Prepaids and Earnest Money"
const description =
  "Utah closes at a title company with a deed of trust and no transfer tax. How earnest money, title insurance, prepaids, and reserves add up to cash to close."
const published = "2026-08-29"
const modified = "2026-10-19"
const category = "First-Time Buyers"

const takeaways = [
  "Down payment is one line on the stack. Earnest money, lender fees, title and escrow, recording, prepaids, and sometimes reserves sit on top of it.",
  "Utah closings fund at a title company, are secured by a deed of trust, and skip a statewide transfer tax. That changes the fee lines, not the need to read a Loan Estimate.",
  "Earnest money moves first, when you sign the REPC, and is normally credited to your cash at closing. Under the Utah REPC it can be at risk once a written deadline passes.",
  "A lender’s title policy covers the lender’s lien. Only an owner’s policy covers your equity, and when both issue together the owner’s premium is usually a simultaneous-issue rate.",
  "Title premiums, escrow fees, recording, and the property tax calendar differ by county and by title company, so one purchase price does not produce one cash-to-close figure.",
]

const faqs = [
  {
    question: "Does Utah charge a real estate transfer tax?",
    answer:
      "No. Utah has no statewide real estate transfer tax, but county recording fees still apply and differ by county.",
  },
  {
    question: "Is 3.5% down the amount I need in the bank?",
    answer:
      "No. The down payment is one line. Earnest money, lender fees, title and escrow, recording, prepaid taxes and insurance, and any required reserves also have to be sourced and documented. Seller concessions can offset part of the fee stack within program caps.",
  },
  {
    question: "Does earnest money count toward my down payment?",
    answer:
      "It is usually credited at settlement toward the funds you already owe, so it reduces the wire you bring to closing. You still needed those dollars available when you wrote the offer, and the REPC controls when they leave your account.",
  },
  {
    question: "If I miss a Utah REPC deadline, is earnest money automatically refunded?",
    answer:
      "No. Refunds depend on which deadline passed and whether the buyer gave the written notice the contract calls for. After the Financing & Appraisal Deadline, a cancellation can send earnest money to the seller as liquidated damages. Read the form you signed and ask a Utah real estate attorney about a dispute.",
  },
  {
    question: "Does the lender’s title policy protect me?",
    answer:
      "No. The lender’s policy insures the lender’s lien up to the loan amount. Your equity is covered only by an owner’s policy, which is a separate contract with its own covered risks and exclusions.",
  },
  {
    question: "Is an owner’s title policy required in Utah?",
    answer:
      "Not by the lender. Whether one is issued, and who pays for it, is set by the purchase contract you sign with the seller. Optional is not a reason to waive coverage you have not read. Ask the title company what the simultaneous-issue premium adds before deciding.",
  },
  {
    question: "Why is my friend’s Lehi title bill different from mine in Salt Lake County?",
    answer:
      "Title premiums and escrow or closing fees vary by title company, even inside the same county, and recording fees differ by county. Compare the title and recording lines on each Loan Estimate.",
  },
  {
    question: "Can seller concessions cover my whole cash to close?",
    answer:
      "Usually not. Concessions are capped by program and by occupancy, and they can pay closing costs and prepaids but not the down payment on most programs. Whatever the cap does not absorb still comes from your documented funds.",
  },
]

const earnestColumns: readonly ComparisonColumn[] = [
  { id: "earnest", heading: "Earnest money" },
  { id: "down", heading: "Down payment" },
  { id: "closing", heading: "Closing costs + prepaids" },
]

const earnestRows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      earnest: EARNEST_VS_DOWN_VS_CLOSING.earnest,
      down: EARNEST_VS_DOWN_VS_CLOSING.down,
      closing: EARNEST_VS_DOWN_VS_CLOSING.closing,
    },
  },
  {
    id: "when",
    criterion: "When the cash typically moves",
    cells: {
      earnest: "When the REPC is executed, per the contract. Utah performance times are usually 5:00 p.m. Mountain Time.",
      down: "At closing, minus the earnest credit (and any gift or DPA that lands on this line).",
      closing:
        "At closing, on the Loan Estimate and Closing Disclosure cash-to-close line. Concessions reduce this bucket within program caps.",
    },
  },
  {
    id: "risk",
    criterion: "What can go wrong",
    cells: {
      earnest: "A missed written deadline under the REPC can shift it to the seller.",
      down: "Undocumented deposits or late gift funds can stall underwriting on this line.",
      closing: "Fees that were estimated low early on show up as a higher cash-to-close figure on the Closing Disclosure.",
    },
  },
]

/** Two policies side by side. Rendered as cards, not a second ComparisonTable, so the page has one swipe hint. */
const titlePolicies = [
  {
    heading: "Lender’s policy",
    protects: TITLE_OWNER_VS_LENDER.lender,
    appears: "Required on most purchase and refinance mortgages so the lien is insurable.",
    refinance: TITLE_OWNER_VS_LENDER.refinance,
  },
  {
    heading: "Owner’s policy",
    protects: TITLE_OWNER_VS_LENDER.owner,
    appears: TITLE_OWNER_VS_LENDER.simultaneous,
    refinance:
      "The purchase-dated owner’s policy may still apply to you, subject to its date and exclusions. Ask title.",
  },
] as const

export const metadata = articleMetadata({
  seoTitle: "Utah Closing Costs and Cash to Close Explained",
  path,
  title,
  description,
  published,
  modified,
  category,
  keywords: [
    "Utah closing costs",
    "Utah cash to close",
    "earnest money vs down payment",
    "owner vs lender title insurance Utah",
    "Utah title company origination prepaids",
  ],
  faqs,
})

export default function UtahClosingCostsPage() {
  const price = EXAMPLE_PURCHASE_PRICE_UTAH.toLocaleString("en-US")
  const fhaDown = Math.round(EXAMPLE_PURCHASE_PRICE_UTAH * 0.035).toLocaleString("en-US")

  return (
    <ArticleShell
      meta={{
        path,
        title,
        description,
        published,
        modified,
        category,
        bannerSubtitle: "Down payment is the line everyone quotes. Cash to close is the file.",
        takeaways,
        faqs,
        keywords: ["Utah title closing costs", "Utah deed of trust recording", "cash besides down payment"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Utah purchase closings typically fund at a title company, are secured by a deed of trust, and do not add a
        statewide transfer tax. Origination, title premiums, recording, and prepaid taxes still vary by lender, title
        company, and county, and all of them sit on top of your down payment. Snapshot as of {LENDING_FACTS_AS_OF}.{" "}
        {UTAH_CLOSING_NOTES.rangeNote}
      </p>

      <h2>What makes a Utah closing different</h2>
      <ul>
        <li>{UTAH_CLOSING_NOTES.closingVenue}</li>
        <li>{UTAH_CLOSING_NOTES.instrument}</li>
        <li>{UTAH_CLOSING_NOTES.transferTax}</li>
        <li>{UTAH_CLOSING_NOTES.taxCalendar}</li>
      </ul>
      <p>
        That is why this page covers Utah only. Arizona, Colorado, Oregon, and Texas have different closing customs
        and, in some cases, different taxes. A closing-cost article written for an attorney state or a transfer-tax
        state will overstate some lines and leave out others.
      </p>

      <h2>Three buckets on the Loan Estimate</h2>
      <p>
        Page 2 of the Loan Estimate groups every charge into lettered sections. Reading it as three buckets keeps the
        math manageable.
      </p>
      <ol>
        <li>
          <strong>Origination (Section A).</strong> Lender charges or credits. Points that buy the rate down belong
          here, not “hidden” in the note rate. A lender credit works in the other direction: it lowers this bucket in
          exchange for a higher rate, so compare the rate and the credit together, never one without the other.
        </li>
        <li>
          <strong>Title, settlement, and recording (Sections B, C, and E).</strong> Lender’s and owner’s title
          premiums, the title company’s escrow or settlement fee, and the county recorder. {UTAH_CLOSING_NOTES.titleVaries}{" "}
          Section C is the one you can shop; the lender gives you a provider list, and a different title company can
          change the number.
        </li>
        <li>
          <strong>Prepaids and initial escrow (Sections F and G).</strong> The first year of homeowners insurance,
          interest from funding to month-end, and the opening deposit into your tax and insurance escrow. On a first
          purchase these often cost more than origination, and they are the lines buyers most often leave out of a
          budget.
        </li>
      </ol>

      <h2>Cash to close beyond the down payment</h2>
      <p>
        On a ${price} illustration, 3.5% down is ${fhaDown}. That is not cash to close. The down payment is one entry in
        a longer stack, and each entry below either leaves your account at a different time or has to be shown sitting
        there. {EXAMPLE_NOTE}
      </p>
      <StepList
        steps={[
          {
            title: "Earnest money",
            body: "Due per the Utah REPC, usually within a few days of acceptance. It leaves your account when you go under contract and is applied at settlement, so it is a timing line more than an extra cost. The section below walks through the three-way comparison with down payment and closing costs.",
          },
          {
            title: "Down payment",
            body: (
              <>
                Program minimums differ. Gift funds and down payment assistance can fill this line when documented.
                Rules for each: <Link href="/blog/should-i-wait-for-20-percent-down">gift funds</Link> and{" "}
                <Link href="/blog/fha-vs-conventional-loans-utah">DPA stacked with an FHA gift</Link>.
              </>
            ),
          },
          {
            title: "Origination and lender fees",
            body: "Can show as a fee or a lender credit. Credits reduce cash; they are usually paid for in rate.",
          },
          {
            title: "Title, escrow, and recording",
            body: "The title company’s settlement fee, both title policies, and the county recording charge. Which policy protects whom is covered in the title insurance section further down.",
          },
          {
            title: "Prepaids",
            body: "Homeowners insurance, prepaid interest, and the opening escrow deposit for taxes and insurance. The Utah tax calendar section below explains why this line can be larger or smaller depending on your closing month.",
          },
          {
            title: "Reserves",
            body: (
              <>
                Some programs and overlays want months of PITIA left after closing. That is still cash even if it stays
                in your account. Detail: <Link href="/blog/should-i-wait-for-20-percent-down">mortgage reserves</Link>.
              </>
            ),
          },
        ]}
      />
      <p>
        Add the stack up and compare it with the cash-to-close line on the Loan Estimate. If the two disagree, the Loan
        Estimate is the document that counts, and the loan officer should be able to explain the difference line by
        line.
      </p>

      <h2>Earnest money vs down payment vs closing costs</h2>
      <p>
        These are three different cash lines with three different clocks. Earnest money is a deposit that travels with
        the purchase contract. Down payment is the equity you bring. Closing costs and prepaids are the fees and
        advance payments that make the loan and the escrow account work. Not legal advice.
      </p>
      <ComparisonTable
        caption={`Earnest vs down vs closing costs as of ${LENDING_FACTS_AS_OF}. Confirm the REPC you signed.`}
        columns={earnestColumns}
        rows={earnestRows}
        footnote="Educational snapshot. Program caps on seller concessions differ for FHA, conventional, VA, and USDA."
      />
      <p>{EARNEST_VS_DOWN_VS_CLOSING.timing}</p>

      <h3>How the earnest credit shows up at closing</h3>
      <p>
        The brokerage or title company holds the earnest deposit in a trust account. On the Closing Disclosure it appears as a
        credit in the buyer’s column, which lowers the final wire. The money did not disappear and it did not become a
        fourth cost; it was simply paid early. What changes is sourcing: the lender traces the earnest check back to
        the account it came from, and a gift that arrives after the earnest was already wired still needs its own
        paper trail.
      </p>
      <h3>Scenario: $8,000 earnest on a first purchase</h3>
      <ul>
        <li>Those dollars leave your account when you go under contract.</li>
        <li>At closing they typically reduce cash to close. You still needed down payment and costs as well.</li>
        <li>
          If the deal falls apart after a deadline passes without written notice, part or all of that $8,000 can go to
          the seller rather than back to you.
        </li>
      </ul>

      <h2>How the Utah REPC treats earnest money</h2>
      <p>
        {UTAH_REPC.timeOfEssence} {UTAH_REPC.fourDeadlines}
      </p>
      <p>{UTAH_REPC.dueDiligence}</p>
      <p>{UTAH_REPC.financingAppraisal}</p>
      <p>
        {UTAH_REPC.lenderNotAParty} How the loan file and each deadline interact, clock by clock:{" "}
        <Link href="/blog/utah-repc-deadline-and-your-loan">what a Utah REPC deadline does to your loan</Link>.
      </p>
      <p>{UTAH_REPC.notLegalAdvice}</p>

      <h2>Owner’s vs lender’s title insurance</h2>
      <p>
        Owner’s versus lender’s title insurance is a who-is-insured question: the lender’s policy covers the lender’s
        lien; the owner’s policy covers your title and equity. They are not interchangeable, and the lender’s policy is
        not “your” policy even though you pay for it.
      </p>
      <div className="not-prose my-8 grid gap-4 md:grid-cols-2">
        {titlePolicies.map((policy) => (
          <div key={policy.heading} className="rounded-lg border border-border bg-card/60 p-5">
            <h3 className="mb-3 text-base font-semibold text-foreground">{policy.heading}</h3>
            <dl className="space-y-3 text-sm leading-relaxed text-foreground/80">
              <div>
                <dt className="font-medium text-foreground">Who it protects</dt>
                <dd>{policy.protects}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">When it usually appears</dt>
                <dd>{policy.appears}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">On a later refinance</dt>
                <dd>{policy.refinance}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
      <p className="text-sm text-foreground/70">
        Owner’s vs lender’s title as of {LENDING_FACTS_AS_OF}. Not a premium quote. Premiums vary by title company even
        inside the same Utah county, so any figure you hear is a range, not a tariff.
      </p>
      <p>{TITLE_OWNER_VS_LENDER.notLegalAdvice}</p>

      <h3>What the title commitment is for</h3>
      <p>
        Before either policy issues, the title company sends a commitment. It is the document to read with them, not
        the policy that arrives after recording. Three things to look for:
      </p>
      <ul>
        <li>Covered risks and exclusions. Survey matters, later construction, and zoning are common conversation topics.</li>
        <li>Who must be paid off (liens, judgments) before the policy will issue.</li>
        <li>Endorsements the lender requires on the lender’s policy, each of which can carry its own charge.</li>
      </ul>
      <p>
        After funding, the deed and deed of trust go to the county recorder and the first payment date is set by the
        note. What that first stretch looks like:{" "}
        <Link href="/blog/week-after-mortgage-funding">the week after funding</Link>.
      </p>

      <h2>Prepaids and the Utah tax calendar</h2>
      <p>
        Prepaids are not fees. They are money you would pay anyway, collected early so the first year runs without a
        gap. Three lines drive the total.
      </p>
      <ul>
        <li>
          <strong>Prepaid interest.</strong> Interest from the funding date through the end of that month. Closing late
          in the month shrinks this line and closing early in the month grows it, while the first payment date usually
          stays the first of the month after the first full month either way.
        </li>
        <li>
          <strong>Homeowners insurance.</strong> The first annual premium is typically paid at closing, and a few
          months of it are also deposited into escrow.
        </li>
        <li>
          <strong>Initial escrow deposit.</strong> Utah counties bill property tax once a year, typically due November
          30. How many months the lender collects at closing depends on how far away that bill is, which is why the
          same house can produce a different prepaid total in March than in October.
        </li>
      </ul>
      <p>
        The first escrow analysis after closing can move the payment even when nothing about the house changed. Why
        that happens and how the cushion is set:{" "}
        <Link href="/blog/escrow-shortage-after-first-year">Utah property tax calendar vs your first escrow analysis</Link>{" "}
        and <Link href="/blog/escrow-shortage-after-first-year">how the escrow cushion is set</Link>.
      </p>

      <h2>Seller concessions and lender credits</h2>
      <p>
        Two things can shrink the cash-to-close line without shrinking the fees themselves. A seller concession is money
        the seller agrees in the REPC to put toward your closing costs and prepaids; each loan program caps it, often
        by occupancy and down payment, so an amount negotiated above the cap is not usable. A lender
        credit is the lender paying part of the costs in exchange for a higher note rate. Both are legitimate tools;
        neither reduces the down payment on a typical purchase, and neither one is free. What concessions can and cannot
        pay for: <Link href="/blog/seller-concessions-what-they-cover">seller concessions</Link>.
      </p>

      <h2>City pages are market context, not a fee sheet</h2>
      <p>
        For market context only: <Link href="/loans/salt-lake-city">Salt Lake City</Link>,{" "}
        <Link href="/loans/lehi">Lehi</Link>, <Link href="/loans/provo">Provo</Link>,{" "}
        <Link href="/loans/draper">Draper</Link>. Recording and tax amounts differ among them, but those pages do not
        carry a second set of fee tables, and nothing on them replaces the title and recording lines on your own Loan
        Estimate.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>Budget cash to close, not only the down-payment percent on a flyer.</li>
        <li>
          Use the <Link href="/calculators/closing-cost">closing-cost calculator</Link> for a range, then compare the
          cash-to-close line on a Loan Estimate from a licensed loan officer. The calculator is an illustration and
          not a commitment to lend.
        </li>
        <li>Read the title commitment with the title company before you waive coverage you do not understand.</li>
        <li>
          First-time program overview: <Link href="/buy/first-time">first-time buyers</Link>. Cash, assistance, and
          closing in one place: <Link href="/learn/first-time">the first-time hub</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
