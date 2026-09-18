import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ArticleCallout } from "@/components/content/article-callout"
import { StepList } from "@/components/content/step-list"
import { CREDIT_BEFORE_MORTGAGE, LENDING_FACTS_AS_OF } from "@/lib/content"
import Link from "next/link"

const path = "/blog/credit-before-mortgage-rapid-rescore"

const faqs = [
  {
    question: "What is a rapid rescore?",
    answer: CREDIT_BEFORE_MORTGAGE.rescoreIsLenderSide,
  },
  {
    question: "Can I pay for a rapid rescore myself?",
    answer:
      "No. It runs through the lender and the bureaus, not the consumer. If a service offers to sell you one directly, that is a signal to look closely at what you are actually buying.",
  },
  {
    question: "Will a rescore remove a late payment?",
    answer: CREDIT_BEFORE_MORTGAGE.notRepair,
  },
  {
    question: "Should I pay off my credit cards before applying?",
    answer: CREDIT_BEFORE_MORTGAGE.utilizationNote,
  },
  {
    question: "Should I close old accounts to tidy up my report?",
    answer: CREDIT_BEFORE_MORTGAGE.closingCardsNote,
  },
  {
    question: "I disputed something on my report. Does that help?",
    answer: CREDIT_BEFORE_MORTGAGE.disputeWarning,
  },
]

export const metadata = articleMetadata({
  path,
  title: "Credit Before a Mortgage: What a Rapid Rescore Is and Is Not",
  description:
    "A rescore speeds up reporting of something already true. It does not remove accurate information. What actually moves a score during a loan file, and what stalls one.",
  published: "2026-09-17",
  category: "Credit",
  keywords: ["rapid rescore", "credit before mortgage", "improve credit score for mortgage"],
  faqs,
})

export default function CreditBeforeMortgagePage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Credit Before a Mortgage: What a Rapid Rescore Is and Is Not",
        description:
          "A rescore speeds up reporting of something already true. It does not remove accurate information. What actually moves a score during a loan file, and what stalls one.",
        published: "2026-09-17",
        category: "Credit",
        bannerSubtitle: "A rescore changes the timing of the truth, not the truth.",
        takeaways: [
          "A rapid rescore is lender-initiated. It asks the bureaus to reflect a correction or a paid-down balance sooner than the normal cycle — you cannot buy one directly.",
          "It speeds up reporting of something already true. It does not remove accurate information, and a lender cannot use a score built on inaccurate removals.",
          "Revolving utilisation is one of the few factors that moves quickly, because balances update each cycle.",
          "Two well-meant moves can hurt during a file: closing old accounts, and filing disputes. Raise both with the loan officer first.",
        ],
        faqs,
        keywords: ["rapid rescore mortgage", "credit utilisation before mortgage"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Credit is the part of a mortgage file borrowers most want to fix quickly, which is exactly why it attracts bad
        advice. Snapshot as of {LENDING_FACTS_AS_OF}. {CREDIT_BEFORE_MORTGAGE.notAPromise}
      </p>

      <h2>What a rapid rescore actually does</h2>
      <p>{CREDIT_BEFORE_MORTGAGE.rescoreIsLenderSide}</p>
      <p>
        The useful way to think about it: a rescore changes <em>when</em> something is reported, not <em>what</em> is
        reported. If you paid a balance down, it can reflect that sooner. If nothing changed, there is nothing to
        rescore.
      </p>

      <ArticleCallout variant="warning" title="A rescore is not credit repair">
        {CREDIT_BEFORE_MORTGAGE.notRepair} Be careful with any service that promises to delete accurate items or
        guarantees a score outcome — that is a regulated industry with its own federal rules, and a file built on it
        does not survive underwriting.
      </ArticleCallout>

      <h2>What tends to move a score during a file</h2>
      <p>{CREDIT_BEFORE_MORTGAGE.utilizationNote}</p>
      <StepList
        steps={[
          {
            title: "Pay revolving balances down before the statement cuts",
            body: "Reported balances are usually statement balances. Paying after the statement posts can mean the higher figure is the one that reports.",
          },
            {
            title: "Leave old accounts open",
            body: CREDIT_BEFORE_MORTGAGE.closingCardsNote,
          },
          {
            title: "Do not open anything new",
            body: (
              <>
                New debt during underwriting moves DTI and shows on the next pull — a common reason a letter does not
                hold. See <Link href="/blog/declined-after-pre-approval">declined after pre-approval</Link>.
              </>
            ),
          },
          {
            title: "Tell the loan officer before you file a dispute mid-file",
            body: CREDIT_BEFORE_MORTGAGE.disputeWarning,
          },
        ]}
      />

      <ArticleCallout variant="pitfall" title="The dispute trap">
        {CREDIT_BEFORE_MORTGAGE.disputeWarning} It is genuinely counterintuitive: doing the responsible thing at the
        wrong moment can stall the file you are trying to save.
      </ArticleCallout>

      <h2>What a score does not decide on its own</h2>
      <p>
        A score is one input. Program overlays, DTI, reserves, and documentation all sit alongside it, and a strong
        score does not override a file that does not otherwise work. How scoring-model changes have affected one common
        category: <Link href="/blog/medical-collections-after-fico-model-change">medical collections</Link>.
      </p>

      <h2>What happens next</h2>
      <p>
        Pull your own report, bring anything that looks wrong to the loan officer rather than to a dispute form, and ask
        what the file actually needs before optimising a number. {CREDIT_BEFORE_MORTGAGE.notAPromise}{" "}
        <Link href="/qualify">Start a conversation</Link>.
      </p>
    </ArticleShell>
  )
}
