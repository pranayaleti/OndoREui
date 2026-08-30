import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { LENDING_FACTS_AS_OF, UTAH_CLOSING_NOTES } from "@/lib/content"
import Link from "next/link"

const path = "/blog/utah-closing-costs-title-origination-prepaids"

const faqs = [
  {
    question: "Does Utah charge a real estate transfer tax?",
    answer: UTAH_CLOSING_NOTES.transferTax,
  },
  {
    question: "Why is my friend’s Lehi title bill different from mine in Salt Lake County?",
    answer: `${UTAH_CLOSING_NOTES.titleVaries} ${UTAH_CLOSING_NOTES.taxCalendar}`,
  },
]

export const metadata = articleMetadata({
  path,
  title: "Closing Costs in Utah: Title, Origination, and Prepaids",
  description:
    "Utah funds at title companies, uses deeds of trust, and has no statewide transfer tax. Recording, title premiums, and tax calendars still vary by county.",
  published: "2026-08-29",
  category: "First-Time Buyers",
  keywords: ["Utah closing costs", "Utah title company origination prepaids"],
  faqs,
})

export default function UtahClosingCostsPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Closing Costs in Utah: Title, Origination, and Prepaids",
        description:
          "Utah funds at title companies, uses deeds of trust, and has no statewide transfer tax. Recording, title premiums, and tax calendars still vary by county.",
        published: "2026-08-29",
        category: "First-Time Buyers",
        bannerSubtitle: "Utah is a title-company closing state. Fees still are not a statewide tariff.",
        faqs,
        keywords: ["Utah title closing costs", "Utah deed of trust recording"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Utah purchase closings typically fund at a title company, are secured by a deed of trust, and do not add a
        statewide transfer tax. Origination, title premiums, recording, and prepaid taxes still vary by lender, title
        company, and county. Snapshot as of {LENDING_FACTS_AS_OF}. {UTAH_CLOSING_NOTES.rangeNote}
      </p>

      <h2>What is actually unique here</h2>
      <ul>
        <li>{UTAH_CLOSING_NOTES.closingVenue}</li>
        <li>{UTAH_CLOSING_NOTES.instrument}</li>
        <li>{UTAH_CLOSING_NOTES.transferTax}</li>
        <li>{UTAH_CLOSING_NOTES.taxCalendar}</li>
      </ul>
      <p>
        That is why this site does not clone a Utah fee table onto Arizona, Colorado, Oregon, or Texas pages. Those
        states have different closing customs and, in some cases, different taxes.
      </p>

      <h2>Three buckets on the Loan Estimate</h2>
      <ol>
        <li>
          <strong>Origination.</strong> Lender charges or credits. Points that buy the rate down belong here, not
          “hidden” in the note rate.
        </li>
        <li>
          <strong>Title and recording.</strong> Owner’s vs lender’s title, escrow, and county recorder.{" "}
          {UTAH_CLOSING_NOTES.titleVaries}
        </li>
        <li>
          <strong>Prepaids.</strong> Insurance, interest from funding to month-end, and tax impounds. These often
          dwarf origination on a first purchase.
        </li>
      </ol>

      <h2>City landings are not a second fee sheet</h2>
      <p>
        For market context only: <Link href="/loans/salt-lake-city">Salt Lake City</Link>,{" "}
        <Link href="/loans/lehi">Lehi</Link>, <Link href="/loans/provo">Provo</Link>,{" "}
        <Link href="/loans/draper">Draper</Link>. Cash besides down payment:{" "}
        <Link href="/blog/utah-cash-to-close-besides-down-payment">cash-to-close stack</Link>.
      </p>

      <h2>What happens next</h2>
      <p>
        Use the <Link href="/calculators/closing-cost">closing-cost calculator</Link> for a range, then compare the
        cash-to-close line on a Loan Estimate from a licensed loan officer.
      </p>
    </ArticleShell>
  )
}
