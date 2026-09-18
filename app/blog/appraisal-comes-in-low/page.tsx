import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ArticleCallout } from "@/components/content/article-callout"
import { StepList } from "@/components/content/step-list"
import { APPRAISAL_GAP, LENDING_FACTS_AS_OF, UTAH_REPC } from "@/lib/content"
import Link from "next/link"

const path = "/blog/appraisal-comes-in-low"

const faqs = [
  {
    question: "Why does a low appraisal change my loan if my income has not changed?",
    answer: APPRAISAL_GAP.lowerOfNote,
  },
  {
    question: "What are my options when the appraisal is low?",
    answer: APPRAISAL_GAP.optionsNote,
  },
  {
    question: "Can I appeal the appraisal?",
    answer: APPRAISAL_GAP.reconsideration,
  },
  {
    question: "Is my earnest money safe if the appraisal comes in low?",
    answer: `${APPRAISAL_GAP.utahDeadline} Whether a cancellation returns your earnest money depends on the contract you signed and on giving the required notice in time. Read it with your agent.`,
  },
  {
    question: "Can the seller just lower the price to the appraised value?",
    answer:
      "They can agree to, and often that is the cleanest fix — but they are not required to. A low appraisal is information; it does not change the contract by itself.",
  },
]

export const metadata = articleMetadata({
  path,
  title: "When the Appraisal Comes In Low",
  description:
    "Lenders size the loan from the lower of price or appraised value. That turns an appraisal gap into cash, a renegotiation, or a cancellation — on a deadline.",
  published: "2026-09-17",
  category: "First-Time Buyers",
  keywords: ["appraisal came in low", "appraisal gap", "reconsideration of value"],
  faqs,
})

export default function AppraisalLowPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "When the Appraisal Comes In Low",
        description:
          "Lenders size the loan from the lower of price or appraised value. That turns an appraisal gap into cash, a renegotiation, or a cancellation — on a deadline.",
        published: "2026-09-17",
        category: "First-Time Buyers",
        bannerSubtitle: "The loan is sized from the lower of price or value. Everything else follows from that.",
        takeaways: [
          "Lenders generally size the loan from the lower of contract price or appraised value, so a gap becomes the buyer's cash problem even when income and credit are unchanged.",
          "The usual paths are renegotiating the price, covering the difference in cash, requesting a reconsideration of value, or cancelling under the contract's appraisal condition.",
          "A reconsideration of value is a documented request built on comparable sales the appraiser did not use. It is not an appeal, and many do not change the value.",
          "In Utah this runs on a deadline. Cancelling on value typically needs written notice by the Financing & Appraisal Deadline.",
        ],
        faqs,
        keywords: ["low appraisal options", "appraisal gap Utah"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A low appraisal is one of the few moments in a purchase where nothing about you changed and the file still
        moved. Understanding why makes the options obvious. Snapshot as of {LENDING_FACTS_AS_OF}.{" "}
        {APPRAISAL_GAP.notAPromise}
      </p>

      <h2>What an appraisal gap is</h2>
      <p>{APPRAISAL_GAP.whatItIs}</p>
      <p>{APPRAISAL_GAP.lowerOfNote}</p>

      <h2>The four paths</h2>
      <p>{APPRAISAL_GAP.optionsNote}</p>
      <StepList
        steps={[
          {
            title: "Renegotiate the price",
            body: "Often the cleanest fix, and the most common outcome. The seller is not obliged to agree — a low appraisal is information, not an amendment.",
          },
          {
            title: "Cover the difference in cash",
            body: (
              <>
                This is cash on top of the down payment and everything else in the{" "}
                <Link href="/blog/utah-cash-to-close-besides-down-payment">cash stack</Link>, and it is not financeable,
                because the loan is already capped by value.
              </>
            ),
          },
          {
            title: "Request a reconsideration of value",
            body: APPRAISAL_GAP.reconsideration,
          },
          {
            title: "Cancel under the appraisal condition",
            body: (
              <>
                Available only if that right still exists and the required written notice is given in time. See{" "}
                <Link href="/blog/utah-repc-deadlines">Utah REPC deadlines</Link>.
              </>
            ),
          },
        ]}
      />

      <ArticleCallout variant="warning" title="The deadline is the real risk">
        {APPRAISAL_GAP.utahDeadline} {UTAH_REPC.lenderNotAParty}
      </ArticleCallout>

      <ArticleCallout variant="note" title="One more reason to file">
        If anything in the report describes you, the neighbourhood's residents, or a protected characteristic rather
        than the property itself, say so explicitly in the request. A reconsideration of value is the channel for
        raising an appraisal-bias concern, and a complaint can also be filed with HUD or the CFPB.
      </ArticleCallout>

      <h2>What a reconsideration of value is not</h2>
      <p>
        It is not a negotiation with the appraiser, and it is not a second opinion ordered because the first was
        disappointing. {APPRAISAL_GAP.reconsideration} Send the comparable sales and let the analysis stand on its own.
      </p>

      <ArticleCallout variant="note" title="Appraisal and inspection are different reports">
        An appraisal is an opinion of value for the lender. An inspection is a condition report for you. Neither
        substitutes for the other — see{" "}
        <Link href="/blog/home-inspection-vs-appraisal">home inspection vs appraisal</Link>.
      </ArticleCallout>

      <h2>What happens next</h2>
      <p>
        Ask your loan officer what the loan amount becomes at the appraised value, and your agent what notice the
        contract requires and by when. Those two answers decide which of the four paths is actually open.{" "}
        <Link href="/qualify">Start a conversation</Link>.
      </p>
    </ArticleShell>
  )
}
