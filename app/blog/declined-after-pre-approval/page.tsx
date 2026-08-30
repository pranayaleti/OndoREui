import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { LENDING_FACTS_AS_OF } from "@/lib/content"
import Link from "next/link"

const path = "/blog/declined-after-pre-approval"

const faqs = [
  {
    question: "Is a pre-approval a commitment to lend?",
    answer:
      "No. It is a snapshot based on the documents reviewed then. Conditions, an appraisal, title, and a final underwrite still sit between the letter and a clear-to-close.",
  },
  {
    question: "If I was declined, can I reapply somewhere else immediately?",
    answer:
      "You can ask. The same undocumented deposit or new auto loan will usually fail the next file too. Fix the condition, then talk with a loan officer.",
  },
]

export const metadata = articleMetadata({
  path,
  title: "Declined After Pre-Approval: Typical Condition Fails",
  description:
    "A pre-approval is not a commitment to lend. Job changes, large deposits, new debt, and income that will not average are the usual late fails.",
  published: "2026-08-29",
  category: "Credit",
  keywords: ["declined after pre-approval", "mortgage conditions failed underwriting"],
  faqs,
})

export default function DeclinedAfterPreapprovalPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Declined After Pre-Approval: Typical Condition Fails",
        description:
          "A pre-approval is not a commitment to lend. Job changes, large deposits, new debt, and income that will not average are the usual late fails.",
        published: "2026-08-29",
        category: "Credit",
        bannerSubtitle: "The letter is a snapshot. The underwrite is the file.",
        faqs,
        keywords: ["pre-approval declined", "mortgage underwriting conditions"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A decline after pre-approval usually means a condition failed, the file changed, or the AUS findings never
        matched what closed. It is not proof that “the market turned.” Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <h2>Typical fails</h2>
      <ul>
        <li>
          <strong>Job or income change.</strong> Switching to 1099, losing overtime, or a new employer after the
          letter. Verification methods:{" "}
          <Link href="/blog/how-underwriters-verify-income">how income is verified</Link>.
        </li>
        <li>
          <strong>Large undocumented deposits.</strong> Cash that cannot be sourced, or a gift moved without a letter.
          See the <Link href="/blog/large-deposits-60-day-paper-trail">60-day paper trail</Link>.
        </li>
        <li>
          <strong>New debt.</strong> A car loan or financed furniture during underwriting changes DTI. See{" "}
          <Link href="/blog/new-auto-loan-during-underwriting">new auto loan during underwriting</Link>.
        </li>
        <li>
          <strong>Credit inquiry / new tradeline</strong> that was not on the tri-merge used for the letter.
        </li>
        <li>
          <strong>Property.</strong> Appraisal, condo project, or HUD minimum property standards the contract did not
          anticipate. FHA condos:{" "}
          <Link href="/blog/fha-condo-roster-project-approval">project roster / single-unit approval</Link>.
        </li>
        <li>
          <strong>Occupancy or program mismatch.</strong> USDA map, VA occupancy, or FHA condo approval discovered
          late.
        </li>
      </ul>

      <h2>What a pre-approval was never doing</h2>
      <p>
        It was not locking a rate by itself, not waiving an appraisal, and not promising that variable income would
        average the way you hoped. The three stages — letter, AUS, CTC — are{" "}
        <Link href="/blog/pre-approval-vs-aus-vs-clear-to-close">pre-approval vs AUS vs clear to close</Link>. Tight DTI
        with documented strengths is{" "}
        <Link href="/blog/compensating-factors-in-aus-findings">compensating factors in findings</Link> — not a promise
        the letter will hold. See{" "}
        <Link href="/faq/loans-faqs">loans FAQs</Link> for pre-approval vs pre-qualification. First-time underwriting
        stalls in one map: <Link href="/blog/first-time-buyer-file-mistakes">file mistakes</Link>. Timeline ranges:{" "}
        <Link href="/blog/how-long-first-purchase-takes">how long a first purchase usually takes</Link>.
      </p>

      <h2>What happens next</h2>
      <p>
        Ask which condition failed, in writing. Do not open new credit or move large cash while you regroup. Then talk
        with a loan officer about whether the same program can be re-run after a fix, or whether a different program
        even applies. That conversation is not a new promise of approval.
      </p>
    </ArticleShell>
  )
}
