import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ArticleCallout } from "@/components/content/article-callout"
import { ProsCons } from "@/components/content/pros-cons"
import { DIVORCE_AND_MORTGAGE, LENDING_FACTS_AS_OF, LOAN_ASSUMPTION } from "@/lib/content"
import Link from "next/link"

const path = "/blog/divorce-and-the-mortgage"

const faqs = [
  {
    question: "The decree says my ex is responsible for the mortgage. Am I off it?",
    answer: `${DIVORCE_AND_MORTGAGE.decreeDoesNotBind} This is general information, not legal advice about your decree. Talk to a family-law attorney about the decree and a loan officer about the loan.`,
  },
  {
    question: "What are the ways to separate a mortgage?",
    answer: DIVORCE_AND_MORTGAGE.threePaths,
  },
  {
    question: "Can I assume the loan instead of refinancing?",
    answer:
      "Sometimes, where the program and servicer allow it. Assumption keeps the existing rate and term, which can matter a great deal, but you still qualify on your own and the servicer can decline.",
  },
  {
    question: "Does child support or alimony count as income?",
    answer: DIVORCE_AND_MORTGAGE.qualifyingAlone,
  },
  {
    question: "Is a buyout refinance treated as cash-out?",
    answer: DIVORCE_AND_MORTGAGE.equityBuyout,
  },
]

export const metadata = articleMetadata({
  path,
  title: "Divorce and the Mortgage: Assume, Refinance, or Sell",
  description:
    "A decree allocates responsibility between two people. It does not remove either from the note. What actually separates a mortgage, and what each path requires.",
  published: "2026-09-17",
  category: "Credit",
  keywords: ["divorce mortgage", "remove ex from mortgage", "divorce buyout refinance"],
  faqs,
})

export default function DivorceAndMortgagePage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Divorce and the Mortgage: Assume, Refinance, or Sell",
        description:
          "A decree allocates responsibility between two people. It does not remove either from the note. What actually separates a mortgage, and what each path requires.",
        published: "2026-09-17",
        category: "Credit",
        bannerSubtitle: "The decree binds the two of you. It does not bind the lender.",
        takeaways: [
          "A divorce decree allocates responsibility between the parties. It does not remove either borrower from the note, because the lender was not a party to it.",
          "Until the loan is refinanced, assumed, or paid off, a missed payment can still reach both credit reports.",
          "The three real paths are refinancing into one name, assuming the loan where the program allows, or selling. Which are open depends on the loan, the equity, and whether one party qualifies alone.",
          "Support payments may count as income or as a debt depending on documentation and continuance — an underwriting question, not a settled one.",
        ],
        takeawaysCaption:
          "Summary only, and general information rather than legal advice about your decree. The detail, the current figures, and the disclosures are in the article below.",
        faqs,
        keywords: ["divorce mortgage options", "assumption after divorce"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        The most common and most costly misunderstanding here is a simple one: people believe the decree separated the
        mortgage. It did not. Snapshot as of {LENDING_FACTS_AS_OF}. {DIVORCE_AND_MORTGAGE.notAPromise}
      </p>

      <ArticleCallout variant="warning" title="The decree does not bind the lender">
        {DIVORCE_AND_MORTGAGE.decreeDoesNotBind} If the person keeping the house pays late, it can land on both credit
        reports. Whatever the decree gives the other party is between them and their attorney — it is not something the
        servicer or the credit bureaus act on.
      </ArticleCallout>

      <h2>The three paths</h2>
      <p>{DIVORCE_AND_MORTGAGE.threePaths}</p>
      <ProsCons
        prosHeading="Keeping the house can work when"
        consHeading="Selling is often the cleaner answer when"
        pros={[
          "One party qualifies alone on documented income, including how support is treated.",
          "The existing loan can be assumed, so an attractive rate and term survive the split.",
          "There is enough equity to fund a buyout without leaving the remaining borrower short on reserves.",
        ]}
        cons={[
          "Neither party qualifies alone, which no amount of agreement between them changes.",
          "The equity buyout would require more cash than the property can support.",
          "Both parties want a clean separation of liability, which a sale achieves and an informal arrangement does not.",
        ]}
      />

      <h2>Refinancing into one name</h2>
      <p>{DIVORCE_AND_MORTGAGE.qualifyingAlone}</p>
      <p>{DIVORCE_AND_MORTGAGE.equityBuyout}</p>

      <ArticleCallout variant="note" title="One federal exception matters here">
        On most residential loans a lender generally may not call the balance due because the property transferred to a
        spouse under a divorce decree or a property settlement. That protects the transfer — it does <em>not</em>
        release the departing spouse from the note, and it is not the same thing as assuming the loan. Confirm how it
        applies with the servicer, and with your attorney on the decree side.
      </ArticleCallout>

      <h2>Assuming the loan</h2>
      <p>
        Where the program and servicer allow it, an assumption keeps the existing rate, term, and balance — which in a
        higher-rate environment can be the difference between keeping the house and not.{" "}
        {LOAN_ASSUMPTION.creditStillApplies}
      </p>
      <p>
        The mechanics are the same as any assumption, including the release of liability that actually removes the
        departing spouse: <Link href="/blog/how-fha-loan-assumption-works">how an FHA loan assumption works</Link>. On a
        VA loan there is an entitlement question on top:{" "}
        <Link href="/blog/va-loan-assumption-entitlement">VA assumption and entitlement</Link>.
      </p>

      <ArticleCallout variant="pitfall" title="Quitclaim deeds do not move the debt">
        Signing a quitclaim deed transfers an interest in the property. It does nothing to the note. It is entirely
        possible to be off the title and still on the loan — which is the worst of both positions, and it happens
        regularly. Which deed to use, and whether to sign one at all, is a question for your attorney, not for the loan
        file.
      </ArticleCallout>

      <ArticleCallout variant="note" title="Two different professionals">
        {DIVORCE_AND_MORTGAGE.notAPromise}
      </ArticleCallout>

      <h2>What happens next</h2>
      <p>
        Find out early whether either party qualifies alone, because that single answer decides which paths exist. Then
        settle liability explicitly — refinance, documented assumption with release, or sale — rather than relying on
        the decree to have done it. <Link href="/qualify">Start a conversation</Link>.
      </p>
    </ArticleShell>
  )
}
