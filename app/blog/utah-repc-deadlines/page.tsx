import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ArticleCallout } from "@/components/content/article-callout"
import { StepList } from "@/components/content/step-list"
import { LENDING_FACTS_AS_OF, UTAH_REPC } from "@/lib/content"
import Link from "next/link"

const path = "/blog/utah-repc-deadlines"

const faqs = [
  {
    question: "What are the four REPC deadlines?",
    answer: UTAH_REPC.fourDeadlines,
  },
  {
    question: "If I waive due diligence, have I waived the appraisal too?",
    answer:
      "No. The deadlines are independent. Waiving the Due Diligence Condition does not waive the appraisal or financing conditions, which share a separate deadline.",
  },
  {
    question: "Does my lender have to meet the REPC deadlines?",
    answer: UTAH_REPC.lenderNotAParty,
  },
  {
    question: "What time of day is a deadline?",
    answer: UTAH_REPC.timeOfEssence,
  },
  {
    question: "What happens to earnest money after the Financing & Appraisal Deadline?",
    answer: `${UTAH_REPC.financingAppraisal} This describes the state-approved form generally; the contract you signed may have been altered by addendum, and nothing here promises earnest money will be refunded. Ask your agent, and a Utah real-estate attorney about disputes.`,
  },
]

export const metadata = articleMetadata({
  path,
  title: "Utah REPC Deadlines and What They Do to Your Loan File",
  description:
    "Four independent deadlines, calendar days, 5 p.m. Mountain — and a lender who is not a party to any of them. How REPC timing interacts with underwriting.",
  published: "2026-09-17",
  category: "First-Time Buyers",
  keywords: ["Utah REPC deadlines", "due diligence deadline Utah", "financing and appraisal deadline"],
  faqs,
})

export default function UtahRepcDeadlinesPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Utah REPC Deadlines and What They Do to Your Loan File",
        description:
          "Four independent deadlines, calendar days, 5 p.m. Mountain — and a lender who is not a party to any of them. How REPC timing interacts with underwriting.",
        published: "2026-09-17",
        category: "First-Time Buyers",
        bannerSubtitle: "The contract runs on its own clock. Your loan file does not control it.",
        takeaways: [
          "The REPC typically carries four independent deadlines — Seller Disclosure, Due Diligence, Financing & Appraisal, and Settlement. Clearing one does not clear another.",
          "Time is of the essence, days are calendar days, and a dated performance is generally due by 5:00 p.m. Mountain on that date.",
          "Your lender, title company, and appraiser are not parties to the contract, so nothing in your loan pipeline extends a contract deadline.",
          "Written notice is what preserves a cancel right. A deadline that passes without it can put earnest money at risk even when the underlying problem was real.",
        ],
        takeawaysCaption:
          "Summary only, and general information rather than legal advice about your contract. The detail, the current figures, and the disclosures are in the article below.",
        faqs,
        keywords: ["Utah REPC deadlines", "Utah purchase contract timing"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Most Utah purchase problems that look like loan problems are actually timing problems. The contract runs on its
        own clock, and it does not pause because underwriting is still working. Snapshot as of {LENDING_FACTS_AS_OF}.{" "}
        {UTAH_REPC.notLegalAdvice}
      </p>

      <h2>Four deadlines, independent of each other</h2>
      <p>{UTAH_REPC.fourDeadlines}</p>
      <p>
        That independence is the part that catches people. A buyer who waives due diligence to strengthen an offer has
        not touched the financing and appraisal conditions, and a buyer who clears financing early still has a
        settlement date to meet.
      </p>

      <h2>How the clock is counted</h2>
      <p>{UTAH_REPC.timeOfEssence}</p>

      <ArticleCallout variant="warning" title="Your lender is not on this clock">
        {UTAH_REPC.lenderNotAParty} A pre-approval letter, favourable AUS findings, or an expected clear-to-close are
        not contract performance. The three stages and what each one actually does are in{" "}
        <Link href="/blog/pre-approval-vs-aus-vs-clear-to-close">pre-approval vs AUS vs clear to close</Link>.
      </ArticleCallout>

      <h2>Due diligence</h2>
      <p>{UTAH_REPC.dueDiligence}</p>

      <h2>Financing and appraisal</h2>
      <p>{UTAH_REPC.financingAppraisal}</p>
      <p>
        This is why a low appraisal is a timing question as much as a value question — see{" "}
        <Link href="/blog/appraisal-comes-in-low">when the appraisal comes in low</Link>. And it is why the earnest
        money in your <Link href="/blog/utah-cash-to-close-besides-down-payment">cash stack</Link> is not purely a
        timing entry once deadlines start passing.
      </p>

      <h2>What to actually do</h2>
      <StepList
        steps={[
          {
            title: "Write the four dates down at acceptance",
            body: "Not the loan milestones — the contract dates. They are the ones with consequences.",
          },
          {
            title: "Ask your loan officer where the file will realistically be on each date",
            body: "A gap between the pipeline and the contract is much cheaper to find at the start than the week of a deadline.",
          },
          {
            title: "Ask your agent what notice your contract requires",
            body: "The state form contemplates written notice by the deadline; addenda can change the mechanics, and a call to the other agent is generally not the notice the form describes.",
          },
          {
            title: "Extend in writing if you need more time",
            body: "An extension is an agreement between the parties, documented as an addendum — not an assumption that everyone is being reasonable.",
          },
        ]}
      />

      <ArticleCallout variant="note" title="This is education, not legal advice">
        {UTAH_REPC.notLegalAdvice}
      </ArticleCallout>

      <h2>What happens next</h2>
      <p>
        Bring your contract dates to the loan officer at the start, not when something slips.{" "}
        <Link href="/qualify">Start a conversation</Link>.
      </p>
    </ArticleShell>
  )
}
