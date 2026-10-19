import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ArticleCallout } from "@/components/content/article-callout"
import { ComparisonTable } from "@/components/content/comparison-table"
import {
  COMPENSATING_FACTORS,
  FTHB_FILE_MISTAKES,
  LENDING_FACTS_AS_OF,
  NEW_DEBT_UNDERWRITING,
  OCCUPANCY_TYPES,
  PREAPPROVAL_STAGES,
  PURCHASE_TIMELINE,
  QUALIFY_CONVERSATION,
} from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/pre-approval-vs-aus-vs-clear-to-close"
const title = "From First Conversation to Clear to Close: Pre-Approval, AUS Findings and Why Files Get Declined"
const description =
  "What a first mortgage conversation asks, what a pre-approval letter, AUS findings and clear to close each mean, and why files get declined after the letter."
const published = "2026-08-29"
const modified = "2026-10-19"
const category = "Credit"

const keywords = [
  "pre-approval vs underwriting",
  "AUS findings",
  "clear to close meaning",
  "declined after pre-approval",
  "compensating factors mortgage",
  "what lenders ask",
  "first-time buyer file mistakes",
]

const faqs = [
  {
    question: "Will the first conversation approve me or lock a rate?",
    answer: QUALIFY_CONVERSATION.notPromised,
  },
  {
    question: "Do I need two years of tax returns on the first call?",
    answer: QUALIFY_CONVERSATION.notNeededFirstCall,
  },
  {
    question: "Is a pre-approval the same as automated underwriting approval?",
    answer: PREAPPROVAL_STAGES.notTheSame,
  },
  {
    question: "What does clear to close actually mean?",
    answer: PREAPPROVAL_STAGES.ctc,
  },
  {
    question: "Can a new car payment after pre-approval stall the file?",
    answer: FTHB_FILE_MISTAKES.newDebt,
  },
  {
    question: "If I have extra reserves, will findings automatically approve?",
    answer: COMPENSATING_FACTORS.notAGuarantee,
  },
  {
    question: "Can I omit HOA from DTI and call it a compensating factor?",
    answer: COMPENSATING_FACTORS.notHiddenIncome,
  },
  {
    question: "If I was declined, can I reapply somewhere else immediately?",
    answer:
      "You can ask. The same undocumented deposit or new auto loan will usually fail the next file too. Fix the condition, then talk with a loan officer.",
  },
]

const takeaways = [
  "A first conversation scopes the file: occupancy, income type, debts, assets, and credit authorization. It does not approve you, lock a rate, or quote APR.",
  "A pre-approval letter, AUS findings, and clear to close are three different documents doing three different jobs, not three words for approval.",
  "The late fails are file facts: new debt, a job or income change, an unsourced deposit, or a property or occupancy the program does not allow.",
  "Compensating factors are documented strengths that print in findings or a manual underwrite. They are not a second score that overrides a decline.",
  "If you are declined, get the failed condition in writing. That is what tells you whether a fix and a re-run are possible.",
]

const conversationColumns: readonly ComparisonColumn[] = [
  { id: "asked", heading: "Usually asked" },
  { id: "not", heading: "Not promised" },
]

const conversationRows: readonly ComparisonRow[] = [
  {
    id: "file",
    criterion: "Your file",
    cells: {
      asked: QUALIFY_CONVERSATION.asked,
      not: QUALIFY_CONVERSATION.notPromised,
    },
  },
  {
    id: "docs",
    criterion: "Documents",
    cells: {
      asked:
        "Income type so we know whether paystubs, returns, K-1s, or statements even apply. Occupancy and property type if you have an address.",
      not: "A complete underwrite from a phone call. Findings come after an application, credit, and the stack the investor requires.",
    },
  },
]

const stageColumns: readonly ComparisonColumn[] = [
  { id: "letter", heading: "Pre-approval letter" },
  { id: "aus", heading: "AUS findings" },
  { id: "ctc", heading: "Clear to close" },
]

const stageRows: readonly ComparisonRow[] = [
  {
    id: "job",
    criterion: "Job",
    cells: {
      letter: PREAPPROVAL_STAGES.preApproval,
      aus: PREAPPROVAL_STAGES.aus,
      ctc: PREAPPROVAL_STAGES.ctc,
    },
  },
  {
    id: "property",
    criterion: "Does it know the house?",
    cells: {
      letter: "Often not. Many letters are written before an accepted offer. Property type can still be assumed wrong.",
      aus: "Usually run on a specific program, LTV, and often a property type. Condo and manufactured overlays still matter.",
      ctc: "Yes. Appraisal, title, insurance, and program rules for this address have been conditioned and cleared as of that date.",
    },
  },
  {
    id: "promise",
    criterion: "What it is not",
    cells: {
      letter: "Not a lock, not CTC, not a property approval.",
      aus: "Not CTC. Approve/Eligible can still fail on conditions, appraisal, or a file change.",
      ctc: "Not a promise that funding cannot be delayed if the CD, insurance, or your job changes before the wire.",
    },
  },
]

const mistakeColumns: readonly ComparisonColumn[] = [
  { id: "debt", heading: "New debt", href: "/blog/credit-before-mortgage-rapid-rescore" },
  { id: "deposit", heading: "Large deposit", href: "/blog/should-i-wait-for-20-percent-down" },
  { id: "occupy", heading: "Occupancy", href: "/blog/second-home-vs-investment-occupancy" },
]

const mistakeRows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What the file sees",
    cells: {
      debt: NEW_DEBT_UNDERWRITING.autoLoan,
      deposit: FTHB_FILE_MISTAKES.largeDeposit,
      occupy: FTHB_FILE_MISTAKES.occupancy,
    },
  },
  {
    id: "next",
    criterion: "What to do",
    cells: {
      debt: NEW_DEBT_UNDERWRITING.whatToDo,
      deposit: "Tell the loan officer before the underwriter finds an unsourced wire. Gift letters belong with donor statements.",
      occupy: OCCUPANCY_TYPES.fraud,
    },
  },
]

const factorColumns: readonly ComparisonColumn[] = [
  { id: "aus", heading: "AUS findings" },
  { id: "manual", heading: "Manual underwrite" },
]

const factorRows: readonly ComparisonRow[] = [
  {
    id: "job",
    criterion: "What the factor is doing",
    cells: {
      aus: "Messages and overlays on an automated result (often DU or LPA). They comment on a file that already ran.",
      manual:
        "Published lists (FHA high-DTI compensating factors are the usual example) a human underwriter may apply when AUS is not the path.",
    },
  },
  {
    id: "examples",
    criterion: "What actually appears",
    cells: {
      aus: COMPENSATING_FACTORS.typical,
      manual: "Often the same themes, reserves, residual, payment shock, unused income, with a written test, not a vibe.",
    },
  },
]

export const metadata = articleMetadata({
  seoTitle: "Pre-Approval to Clear to Close: Every Loan Stage",
  path,
  title,
  description,
  published,
  modified,
  category,
  keywords,
  faqs,
})

export default function PreapprovalStagesPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title,
        description,
        published,
        modified,
        category,
        bannerSubtitle: "The conversation scopes the file. The letter lets you shop. The underwrite decides.",
        takeaways,
        faqs,
        keywords,
      }}
    >
      <p className="lead text-xl text-foreground/70">
        A purchase file moves through four things that get called “approval” and are not the same: a first
        conversation, a pre-approval letter, automated underwriting (AUS) findings, and a clear to close (CTC). The
        conversation scopes your situation. The letter helps you shop. AUS, often Fannie Mae Desktop Underwriter or
        Freddie Mac Loan Product Advisor, tests one program against the credit file. CTC is an underwriter stating that
        conditions for this property are satisfied as of that date. Mixing them up is how “I was approved” turns into a
        stalled closing. This guide walks the whole path, including the file mistakes that break it and what a
        compensating factor can and cannot do. Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <h2>The first conversation: what it asks and what it will not promise</h2>
      <p>
        A first mortgage conversation is a scoping call: occupancy, how you are paid, what you owe, what cash you can
        document, and whether you are ready for a credit pull. It is not an approval, a lock, an APR, or a promise that
        a program will fit. The live version of the question list sits on the{" "}
        <Link href="/qualify">qualify page</Link>, so none of it is a surprise when you call.
      </p>
      <ComparisonTable
        caption={`What a conversation is for as of ${LENDING_FACTS_AS_OF}.`}
        columns={conversationColumns}
        rows={conversationRows}
        footnote="Fair Housing: we ask about the file (income, debts, occupancy, property), not about protected class. Anyone who applies is underwritten on documentation."
      />

      <h3>Checklist before you talk</h3>
      <ul>
        <li>
          How you are paid (W-2, 1099, K-1, mixed). If it is not the same every month, the{" "}
          <Link href="/learn/variable-income">variable-income hub</Link> explains what an underwriter averages.
        </li>
        <li>Monthly debts you know about, including a car you might finance next week.</li>
        <li>Whether gift funds or down payment assistance are in the plan.</li>
        <li>Occupancy: you will live there, second home, or rental.</li>
      </ul>
      <p>{QUALIFY_CONVERSATION.notNeededFirstCall}</p>
      <p>
        Asking is not a loan application. Calculators are illustrations only; the{" "}
        <Link href="/calculators/affordability">affordability calculator</Link> does not underwrite you.
      </p>

      <h2>Three documents, three jobs</h2>
      <p>{PREAPPROVAL_STAGES.notTheSame}</p>
      <p>
        The letter deserves one plain sentence because sellers and buyers both lean on it harder than it can bear: a
        pre-approval is not a commitment to lend. It is a snapshot of what was verified on the day it was written. The
        file keeps moving after that, and the underwrite is the file, not the letter.
      </p>
      <ComparisonTable
        caption={`Three stages of a purchase file as of ${LENDING_FACTS_AS_OF}. Not a timeline promise.`}
        columns={stageColumns}
        rows={stageRows}
        footnote="GUS (USDA) and TOTAL Scorecard (FHA) are different engines with the same idea: an automated result is not a human CTC."
      />

      <h3>How long each stage usually takes</h3>
      <p>{PURCHASE_TIMELINE.notAPromise}</p>
      <ul>
        <li>
          <strong>Conversation to letter.</strong> {PURCHASE_TIMELINE.preapproval}
        </li>
        <li>
          <strong>Accepted offer to underwriting.</strong> {PURCHASE_TIMELINE.contractToUw}
        </li>
        <li>
          <strong>Underwriting to CTC.</strong> {PURCHASE_TIMELINE.uwToCtc}
        </li>
        <li>
          <strong>CTC to funding.</strong> {PURCHASE_TIMELINE.ctcToClose}
        </li>
      </ul>
      <p>
        {PURCHASE_TIMELINE.overall} The stage-by-stage ranges are in{" "}
        <Link href="/blog/how-long-first-purchase-takes">how long a first purchase usually takes</Link>.
      </p>

      <h2>First-time buyer mistakes that are really file mistakes</h2>
      <p>{FTHB_FILE_MISTAKES.whatThisIs}</p>
      <p>
        This section covers underwriting facts, not general advice about inspections or overbidding. Avoiding these
        items does not guarantee approval. It removes the most common reasons a file that was eligible comes back
        ineligible.
      </p>
      <ComparisonTable
        caption={`File mistakes underwriters actually condition, as of ${LENDING_FACTS_AS_OF}.`}
        columns={mistakeColumns}
        rows={mistakeRows}
        footnote="Not a complete list of every possible condition. Not a decline prediction."
      />
      <p>{NEW_DEBT_UNDERWRITING.otherDebt}</p>

      <h3>Job change is a file change</h3>
      <p>
        {FTHB_FILE_MISTAKES.jobChange} Switching to 1099, losing overtime, or starting with a new employer after the
        letter all change what the underwriter can count. How that verification works is in{" "}
        <Link href="/blog/how-underwriters-verify-income">how underwriters verify income</Link>.
      </p>

      <h3>Closing a card is utilization, not a lifestyle tip</h3>
      <p>
        {FTHB_FILE_MISTAKES.closingCard} The deep guide is{" "}
        <Link href="/blog/credit-before-mortgage-rapid-rescore">closing a credit card before you apply</Link>.
      </p>
      <p>
        Adding a parent the wrong way (title vs note vs gift) is another file fact, not a family decision. Read{" "}
        <Link href="/blog/cosign-vs-co-borrower">cosign vs co-borrower</Link> and{" "}
        <Link href="/blog/should-i-wait-for-20-percent-down">who signs a gift</Link> before anyone wires money.
      </p>

      <h3>Occupancy is a statement of fact</h3>
      <p>
        {OCCUPANCY_TYPES.primary} {OCCUPANCY_TYPES.fairHousing}
      </p>

      <h2>Compensating factors in AUS findings</h2>
      <p>{COMPENSATING_FACTORS.what}</p>
      <p>{COMPENSATING_FACTORS.notAGuarantee}</p>
      <ComparisonTable
        caption={`Where compensating factors show up as of ${LENDING_FACTS_AS_OF}.`}
        columns={factorColumns}
        rows={factorRows}
        footnote="Confirm the guide and the findings in force for the product."
      />

      <h3>Factors that actually show up</h3>
      <p>{COMPENSATING_FACTORS.typical}</p>
      <ul>
        <li>
          <strong>Reserves after cash to close.</strong>{" "}
          <Link href="/blog/should-i-wait-for-20-percent-down">Months of PITIA</Link> remaining in your accounts after
          funding, not extra closing costs.
        </li>
        <li>
          <strong>DTI that includes HOA.</strong> A “modest payment” that omitted dues is not a factor. The split is
          in <Link href="/blog/dti-frontend-backend-with-hoa">front-end vs back-end DTI with HOA</Link>.
        </li>
        <li>
          <strong>VA residual income.</strong> A separate test from DTI, explained in{" "}
          <Link href="/blog/va-loan-assumption-entitlement">residual income vs DTI</Link>. This page does not quote residual
          dollars.
        </li>
        <li>
          <strong>Unused income.</strong> Overtime or bonus that was not used to qualify can appear only if it is
          documented and likely to continue.
        </li>
      </ul>
      <p>{COMPENSATING_FACTORS.notHiddenIncome}</p>
      <p>
        If findings are tight, ask which messages actually printed, not which slogan to add to the letter. Then
        document the reserves, housing history, and unused income the guide will accept. Informal stories do not count.
        A decline after a letter is usually a later condition fail, covered next, not a missing pep talk in the
        findings.
      </p>

      <h2>Why a file gets declined after pre-approval</h2>
      <p>
        A decline after pre-approval usually means a condition failed, the file changed, or the AUS findings never
        matched what closed. It is not proof that “the market turned.” The typical fails:
      </p>
      <ul>
        <li>
          <strong>Job or income change.</strong> Switching to 1099, losing overtime, or a new employer after the
          letter, so the income average the letter used no longer holds.
        </li>
        <li>
          <strong>Large undocumented deposits.</strong> Cash that cannot be sourced, or a gift moved without a letter.
          The <Link href="/blog/should-i-wait-for-20-percent-down">60-day paper trail</Link> explains what the
          underwriter needs to see.
        </li>
        <li>
          <strong>New debt.</strong> A car loan or financed furniture during underwriting changes DTI, as the file
          mistakes above describe.
        </li>
        <li>
          <strong>Credit inquiry or new tradeline</strong> that was not on the tri-merge used for the letter.
        </li>
        <li>
          <strong>Property.</strong> Appraisal, condo project, or HUD minimum property standards the contract did not
          anticipate. For FHA condos, read{" "}
          <Link href="/blog/fha-vs-conventional-loans-utah">project roster and single-unit approval</Link>.
        </li>
        <li>
          <strong>Occupancy or program mismatch.</strong> USDA map, VA occupancy, or FHA condo approval discovered
          late.
        </li>
      </ul>

      <ArticleCallout variant="pitfall" title="The two that catch people mid-underwriting">
        Opening new credit and moving large amounts of cash are the two things most likely to undo a letter you already
        have, and both usually feel harmless at the time. Neither is a reason to panic if it has happened, it is a
        reason to tell your loan officer before underwriting finds it.
      </ArticleCallout>

      <h3>What a pre-approval was never doing</h3>
      <p>
        It was not locking a rate by itself, not waiving an appraisal, and not promising that variable income would
        average the way you hoped. Tight DTI with documented strengths is a compensating factor in findings, as
        described above, not a promise the letter will hold. The{" "}
        <Link href="/faq/loans-faqs">loans FAQs</Link> cover pre-approval vs pre-qualification.
      </p>

      <h3>If you are declined</h3>
      <p>
        The lender owes you a written notice, either the specific principal reasons or your right to request them. Ask
        which condition failed, in writing; that is what tells you whether a fix and a re-run are possible. Do not open
        new credit or move large cash while you regroup. Then talk with a loan officer about whether the same program
        can be re-run after a fix, or whether a different program even applies. That conversation is not a new promise
        of approval.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>
          Read the <Link href="/qualify">qualify page</Link>, then send a message or book time via{" "}
          <Link href="/contact">contact</Link>. Asking is not a loan application.
        </li>
        <li>Treat the letter as permission to shop, not as a property or rate lock.</li>
        <li>Ask whether AUS has actually been run on this program and this LTV, and what the findings were.</li>
        <li>Ask before you sign a new installment, change jobs, or move a large cash gift.</li>
        <li>
          Do not schedule movers off a letter. CTC plus a CD that matches is closer to a closing date. The cash stack
          for a first purchase is in <Link href="/learn/first-time">first-time cash and closing</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
