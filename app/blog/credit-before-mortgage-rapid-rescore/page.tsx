import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ArticleCallout } from "@/components/content/article-callout"
import { ComparisonTable } from "@/components/content/comparison-table"
import { StepList } from "@/components/content/step-list"
import {
  ALTERNATIVE_CREDIT,
  AUTHORIZED_USER_TRADELINES,
  CLOSING_CREDIT_CARD,
  CREDIT_BEFORE_MORTGAGE,
  LENDING_FACTS_AS_OF,
  MEDICAL_COLLECTIONS,
  NEW_DEBT_UNDERWRITING,
  STUDENT_LOAN_DTI,
  TRI_MERGE,
} from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/credit-before-mortgage-rapid-rescore"
const title = "Credit Before a Mortgage: Tri-Merge Scores, Rescores, Collections, Student Loans and New Debt"
const description =
  "What a mortgage tri-merge shows, what a rapid rescore can and cannot do, and how closed cards, AU lines, medical collections and student loans read in a file."
const published = "2026-09-17"
const modified = "2026-10-19"
const keywords = [
  "credit before mortgage",
  "rapid rescore",
  "tri-merge credit report mortgage",
  "middle FICO score underwriting",
  "closing credit card before mortgage",
  "authorized user tradelines mortgage",
  "medical collections mortgage FICO",
  "alternative credit mortgage",
  "new car loan during mortgage underwriting",
  "student loans DTI mortgage",
]

const faqs = [
  {
    question: "What is a rapid rescore, and can I pay for one myself?",
    answer: `${CREDIT_BEFORE_MORTGAGE.rescoreIsLenderSide} If a service offers to sell you one directly, look closely at what you are actually buying.`,
  },
  {
    question: "Is my Credit Karma score the mortgage score?",
    answer: TRI_MERGE.models,
  },
  {
    question: "Will closing a card raise my mortgage score?",
    answer:
      "Not in any way this guide can promise. Closing a card shrinks available credit, so the same balance can read as higher utilization, and closing the oldest account can shorten average account age. Ask the loan officer before closing anything in the weeks around application.",
  },
  {
    question: "Do authorized-user tradelines help a mortgage file?",
    answer: AUTHORIZED_USER_TRADELINES.whatItDoes,
  },
  {
    question: "Will paying a medical collection raise my mortgage score?",
    answer:
      "Not necessarily. Many mortgage files still use older FICO models, and a paid collection that still appears on the tri-merge may not raise that score. Whether it must be paid at closing is a separate underwriting question.",
  },
  {
    question: "If I have no credit cards, can I still get a mortgage?",
    answer:
      "Sometimes, if you can document nontraditional credit references such as rent and utilities for about 12 months. That is not the same as having traditional credit that is simply weak. It is not a promise of approval.",
  },
  {
    question: "Can I buy a car after I get a mortgage pre-approval?",
    answer: NEW_DEBT_UNDERWRITING.autoLoan,
  },
  {
    question: "If my student loans show $0, is my DTI $0 for that debt?",
    answer: `${STUDENT_LOAN_DTI.creditReportPayment} ${STUDENT_LOAN_DTI.saveNote}`,
  },
]

const triMergeColumns: readonly ComparisonColumn[] = [
  { id: "app", heading: "Consumer app / one bureau" },
  { id: "tri", heading: "Mortgage tri-merge" },
]

const triMergeRows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      app: "Often one bureau and a newer FICO or VantageScore. Useful for monitoring. Not the file.",
      tri: TRI_MERGE.what,
    },
  },
  {
    id: "score",
    criterion: "Which number is used",
    cells: {
      app: "Whatever that app displays. It can be higher or lower than the mortgage middle score.",
      tri: TRI_MERGE.middleScore,
    },
  },
  {
    id: "model",
    criterion: "Typical model",
    cells: {
      app: "Often FICO 8/9/10 or VantageScore.",
      tri: TRI_MERGE.models,
    },
  },
]

const closingColumns: readonly ComparisonColumn[] = [
  { id: "open", heading: "Leave open, pay down" },
  { id: "close", heading: "Close the account" },
]

const closingRows: readonly ComparisonRow[] = [
  {
    id: "util",
    criterion: "Utilization",
    cells: {
      open: "Available credit, the denominator, stays. Paying the balance can lower utilization.",
      close: CLOSING_CREDIT_CARD.utilization,
    },
  },
  {
    id: "age",
    criterion: "Age of accounts",
    cells: {
      open: "The tradeline can keep aging on the tri-merge.",
      close: CLOSING_CREDIT_CARD.age,
    },
  },
  {
    id: "file",
    criterion: "During a mortgage file",
    cells: {
      open: TRI_MERGE.duringUw,
      close: CLOSING_CREDIT_CARD.duringFile,
    },
  },
]

const auColumns: readonly ComparisonColumn[] = [
  { id: "au", heading: "Authorized user" },
  { id: "borrower", heading: "You are obligated" },
  { id: "coborrower", heading: "Co-borrower", href: "/blog/cosign-vs-co-borrower" },
]

const auRows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      au: AUTHORIZED_USER_TRADELINES.what,
      borrower: "A revolving or installment tradeline in your name that you are contractually obligated to pay.",
      coborrower: "Someone who applies with you: on the note, credit and debts in DTI, income can count when documented.",
    },
  },
  {
    id: "uw",
    criterion: "What underwriting often does",
    cells: {
      au: AUTHORIZED_USER_TRADELINES.overlays,
      borrower: "Counts it. Obligated tradelines are the history AUS and overlays are built to read.",
      coborrower: AUTHORIZED_USER_TRADELINES.vsCosign,
    },
  },
]

const medicalColumns: readonly ComparisonColumn[] = [
  { id: "consumer", heading: "Consumer app score (often FICO 8/9 or VantageScore)", href: "/faq/loans-faqs" },
  { id: "mortgage", heading: "Mortgage tri-merge (often classic FICO 2/4/5)", href: "/blog/pre-approval-vs-aus-vs-clear-to-close" },
]

const medicalRows: readonly ComparisonRow[] = [
  {
    id: "paid",
    criterion: "Paid medical collections",
    cells: {
      consumer: "Newer FICO models and VantageScore often ignore paid collections. FICO 8 still can count collections that remain on the report.",
      mortgage: "Classic mortgage models can still treat a collection that remains on the tri-merge. Paying it is not a promised score increase on those models.",
    },
  },
  {
    id: "small",
    criterion: "Unpaid medical under $500",
    cells: {
      consumer: "The three bureaus stated they would stop including these on credit reports from 2023. If it is not on the report, it cannot score.",
      mortgage: "Same report feed: if the bureau no longer lists it, the tri-merge usually will not either. Confirm the actual report. This is not a score-raise promise.",
    },
  },
  {
    id: "uw",
    criterion: "Must it be paid at closing?",
    cells: {
      consumer: "A consumer score does not answer payoff conditions.",
      mortgage: MEDICAL_COLLECTIONS.underwriting,
    },
  },
]

const altCreditColumns: readonly ComparisonColumn[] = [
  { id: "none", heading: "No or thin traditional credit", href: "/loans/fha" },
  { id: "weak", heading: "Traditional credit that is weak" },
]

const altCreditRows: readonly ComparisonRow[] = [
  {
    id: "meaning",
    criterion: "What the file usually is",
    cells: {
      none: "Little or no score because tradelines were never opened, or not enough to generate a usable score after a three-bureau check.",
      weak: "Scores exist. Late pays, collections, or high utilization are on traditional revolving and installment lines.",
    },
  },
  {
    id: "path",
    criterion: "Typical documentation path",
    cells: {
      none: ALTERNATIVE_CREDIT.fannie,
      weak: "Underwrite the traditional file: scores, AUS, overlays, and any payoff conditions. Alternative-credit references do not erase derogatory tradelines.",
    },
  },
  {
    id: "fha",
    criterion: "FHA note",
    cells: {
      none: ALTERNATIVE_CREDIT.fha,
      weak: "FHA may still be a conversation when scores exist but sit near overlays. That is a credit-file question, not a steering slogan.",
    },
  },
]

const studentLoanColumns: readonly ComparisonColumn[] = [
  { id: "fannie", heading: "Fannie Mae (typical)", href: "/loans/conventional" },
  { id: "freddie-fha", heading: "Freddie Mac / FHA (typical)", href: "/loans/fha" },
  { id: "va", heading: "VA (typical)", href: "/loans/va" },
]

const studentLoanRows: readonly ComparisonRow[] = [
  {
    id: "reported",
    criterion: "Credit report shows a payment above $0",
    cells: {
      fannie: "Often use that payment, or the documented current statement if it differs.",
      "freddie-fha": "Often use the reported or documented payment.",
      va: "VA has its own student-loan treatment. Confirm the current handbook, do not import a conventional percent.",
    },
  },
  {
    id: "idr-zero",
    criterion: "IDR payment documented at $0",
    cells: {
      fannie:
        "May qualify with $0 when the servicer documents an income-driven payment of $0. A dashboard screenshot is not enough.",
      "freddie-fha": STUDENT_LOAN_DTI.freddieFha,
      va: STUDENT_LOAN_DTI.vaNote,
    },
  },
  {
    id: "forbearance",
    criterion: "Deferred or forbearance (including some SAVE fallout)",
    cells: {
      fannie: "Often 1% of the outstanding balance, or a fully amortizing payment from documented terms.",
      "freddie-fha": "Often 0.5% of the outstanding balance when the reported payment is $0 or not amortizing.",
      va: "Do not assume a conventional percent. Confirm the current VA student-loan rule.",
    },
  },
]

export const metadata = articleMetadata({
  seoTitle: "Credit Before a Mortgage: Scores, Rescores and Debt",
  path,
  title,
  description,
  published,
  modified,
  category: "Credit",
  keywords,
  faqs,
})

export default function CreditBeforeMortgagePage() {
  return (
    <ArticleShell
      meta={{
        path,
        title,
        description,
        published,
        modified,
        category: "Credit",
        bannerSubtitle: "The score on a free app is often not the score on the tri-merge. Here is what the file reads.",
        takeaways: [
          "Mortgage underwriting reads a tri-merge of all three bureaus and, when three classic FICO scores are present, often the middle one. A monitoring-app number is not the file.",
          "A rapid rescore is lender-initiated and only speeds up reporting of something already true. It is not credit repair, and you cannot buy one directly.",
          "Closing a card, filing a dispute mid-file, or signing a new auto loan can each stall a file that was working. Ask the loan officer before any of them.",
          "Authorized-user lines, paid medical collections, and a $0 student-loan line each read differently on a mortgage file than on a consumer app or a servicer dashboard.",
          "No traditional credit is a documentation path (rent, utilities, about 12 months), not a workaround for weak traditional credit. Which path applies is about the file, never about who you are.",
        ],
        faqs,
        keywords,
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Credit is the part of a mortgage file borrowers most want to fix quickly, which is exactly why it attracts bad
        advice. This guide covers what the report a lender actually pulls contains, what a rapid rescore can and cannot
        do, and how six common situations read in underwriting: a closed card, an authorized-user line, a medical
        collection, a thin file, a new auto loan, and a student loan on an income-driven plan. Snapshot as of{" "}
        {LENDING_FACTS_AS_OF}. {CREDIT_BEFORE_MORTGAGE.notAPromise}
      </p>

      <h2>What a tri-merge report shows and which score is used</h2>
      <p>
        {TRI_MERGE.what} When three classic FICO scores are present, many files use the middle score, not the average
        and not the highest. If only two bureaus return a score, the lower one is commonly used. Overlays can differ.
        None of this is a way to raise a score; it is how the number on your Loan Estimate gets chosen.
      </p>
      <ComparisonTable
        caption={`Consumer monitoring vs a mortgage tri-merge as of ${LENDING_FACTS_AS_OF}.`}
        columns={triMergeColumns}
        rows={triMergeRows}
        footnote="Educational snapshot. Confirm the report actually in the file."
      />
      <p>{TRI_MERGE.shows}</p>
      <ul>
        <li>Tradelines: installment loans, revolving accounts, mortgages, authorized-user lines.</li>
        <li>Balances, credit limits, and payment history as each bureau reports them.</li>
        <li>Inquiries. A cluster of new auto or card inquiries during underwriting is a common re-pull surprise.</li>
        <li>Public records and collections, including medical collections, which have their own reporting snapshot below.</li>
      </ul>
      <p>
        If two bureaus disagree on a collection, that disagreement sits on the tri-merge. Bring the paper. A
        spouse’s or partner’s credit is in the file when that person is a borrower, not as a hidden extra score. Who
        the lender pulls is about who applied.
      </p>

      <h2>What a rapid rescore does and does not do</h2>
      <p>{CREDIT_BEFORE_MORTGAGE.rescoreIsLenderSide}</p>
      <p>
        The useful way to think about it: a rescore changes <em>when</em> something is reported, not <em>what</em> is
        reported. If you paid a balance down, it can reflect that sooner. If a bureau is carrying an error and you have
        documentation, it can reflect the correction sooner. If nothing changed, there is nothing to rescore.
      </p>
      <ArticleCallout variant="warning" title="A rescore is not credit repair">
        {CREDIT_BEFORE_MORTGAGE.notRepair} Be careful with any service that promises to delete accurate items or
        guarantees a score outcome. That is a regulated industry with its own federal rules, and a file built on it
        does not survive underwriting.
      </ArticleCallout>

      <h2>What tends to move a score during a file</h2>
      <p>
        Revolving utilization is one of the larger score factors and one of the few you can change quickly, because
        card balances update every statement cycle. Most other factors, such as payment history and account age, move
        on a timeline measured in months and years, which is why most mid-file credit advice should be about not
        breaking anything rather than about optimizing a number.
      </p>
      <StepList
        steps={[
          {
            title: "Pay revolving balances down before the statement cuts",
            body: "Reported balances are usually statement balances. Paying after the statement posts can mean the higher figure is the one that reports, and the one a rescore would be asked to refresh.",
          },
          {
            title: "Leave old accounts open",
            body: CREDIT_BEFORE_MORTGAGE.closingCardsNote,
          },
          {
            title: "Do not open anything new",
            body: (
              <>
                New debt during underwriting moves DTI and shows on the next pull, a common reason a letter does not
                hold. The auto-loan version is covered below, and the broader pattern is in{" "}
                <Link href="/blog/pre-approval-vs-aus-vs-clear-to-close">declined after pre-approval</Link>.
              </>
            ),
          },
          {
            title: "Tell the loan officer before you file a dispute mid-file",
            body: CREDIT_BEFORE_MORTGAGE.disputeWarning,
          },
        ]}
      />
      <h2>Closing a credit card before you apply</h2>
      <p>
        Closing a card before you apply can raise revolving utilization even if the balance does not change, because
        available credit is the denominator. Mortgage AUS reads a tri-merge, not a consumer-app tip about cutting up
        cards. {CLOSING_CREDIT_CARD.notARaise}
      </p>
      <ComparisonTable
        caption={`Pay down vs close, as of ${LENDING_FACTS_AS_OF}. Not a score-raise method.`}
        columns={closingColumns}
        rows={closingRows}
        footnote="Educational snapshot. Overlays and classic FICO models still apply."
      />
      <p>{CLOSING_CREDIT_CARD.aus}</p>
      <p>
        The common version: you close a high-limit card you never use, and utilization jumps on the same balances.
        Ask before you close anything in the 60 days around application. Other first-time file mistakes in the same
        family are collected in <Link href="/blog/pre-approval-vs-aus-vs-clear-to-close">file mistakes</Link>.
      </p>

      <h2>Authorized-user tradelines</h2>
      <p>
        Authorized-user tradelines can show on a mortgage tri-merge, and they still often fail to do what people hope.{" "}
        {AUTHORIZED_USER_TRADELINES.whatItDoes}
      </p>
      <p>{AUTHORIZED_USER_TRADELINES.whatItDoesNot}</p>
      <ComparisonTable
        caption={`AU vs obligated tradeline vs co-borrower as of ${LENDING_FACTS_AS_OF}. Not a score promise.`}
        columns={auColumns}
        rows={auRows}
        footnote="Mortgage files typically use the tri-merge and classic FICO models, not a monitoring-app number."
      />
      <ul>
        <li>
          <strong>You have been an AU for years and also have your own cards and installment history.</strong> The AU
          line may be noise. The obligated tradelines usually drive AUS.
        </li>
        <li>
          <strong>The only revolving history is someone else’s card.</strong> Overlays and AUS often treat that as not
          enough of <em>your</em> history. Documented alternative credit, covered below, may be the conversation, not
          adding more AU cards.
        </li>
        <li>
          <strong>Someone offers to add you for a fee.</strong> That is not a mortgage documentation method. Do not buy
          tradelines.
        </li>
      </ul>
      <p>
        {AUTHORIZED_USER_TRADELINES.notPiggyback} If someone else will be on the <em>note</em>, that is{" "}
        <Link href="/blog/cosign-vs-co-borrower">cosign vs co-borrower</Link>, not AU.
      </p>

      <h2>Medical collections after the FICO model change</h2>
      <p>
        Medical collections are treated differently than they were a few years ago, on <em>credit reports</em> and on
        some <em>consumer</em> scores. A mortgage file still often uses older FICO models on a tri-merge. This section
        is a dated snapshot of that gap. {MEDICAL_COLLECTIONS.noPromise}
      </p>
      <p>{MEDICAL_COLLECTIONS.bureauReporting}</p>
      <p>
        A proposed federal rule to strip medical debt from credit reports more broadly was not a durable, in-force
        replacement for those bureau policies as of this snapshot. Confirm current reporting on your actual tri-merge,
        not a 2023 headline.
      </p>
      <p>{MEDICAL_COLLECTIONS.mortgageScores}</p>
      <ComparisonTable
        caption={`Score models as of ${LENDING_FACTS_AS_OF}. Confirm what your lender pulls.`}
        columns={medicalColumns}
        rows={medicalRows}
        footnote="Educational snapshot. GSE required models can change. This table does not predict a score."
      />
      <p>
        An underwriter’s payoff condition and a score model are different machines. Paying a collection to satisfy a
        condition can still be the right file move even if classic FICO does not reward the payment the way FICO 9
        would. That is not advice to pay or not pay a collector. If a medical collection still reports, ask whether it
        is a score issue, a payoff condition, or both.
      </p>

      <h2>No traditional credit and alternative credit</h2>
      <p>
        If you have little or no traditional credit, some purchase programs can still look at documented rent,
        utilities, and similar payments, often about 12 months, after the lender checks all three repositories.{" "}
        {ALTERNATIVE_CREDIT.who}
      </p>
      <ComparisonTable
        caption={`Two different credit conversations as of ${LENDING_FACTS_AS_OF}.`}
        columns={altCreditColumns}
        rows={altCreditRows}
        footnote="Educational snapshot. Overlays apply. Not a credit decision."
      />
      <p>What usually counts as a reference:</p>
      <ul>
        <li>Housing payments to a landlord or documented private housing payments (not a relative’s informal IOU without paper).</li>
        <li>Utilities billed in your name, electricity, gas, water, phone, internet, when they are not already inside the rent.</li>
        <li>Insurance premiums, documented private installment payments, or similar 12-month patterns the guide allows.</li>
      </ul>
      <p>
        Canceled checks, statements, or a nontraditional mortgage credit report are typical paper. Twelve months with
        late pays on those references is usually not the same as a clean alternative-credit history. Compare programs
        on <Link href="/blog/fha-vs-conventional-loans-utah">FHA vs conventional</Link> the same way any other buyer
        would, occupancy, MIP vs PMI, cash to close, not as a product for a type of person.
      </p>

      <h2>A new auto loan during underwriting</h2>
      <p>{NEW_DEBT_UNDERWRITING.autoLoan}</p>
      <p>{NEW_DEBT_UNDERWRITING.otherDebt}</p>
      <p>
        The letter did not see it because a pre-approval is not AUS findings and not clear to close. Those three stages
        are spelled out in{" "}
        <Link href="/blog/pre-approval-vs-aus-vs-clear-to-close">pre-approval vs AUS vs CTC</Link>. The letter used
        the debts that were on the report <em>then</em>. A dealer pull and a funded auto loan are a new tradeline.
      </p>
      <p>What underwriters are checking when the refresh comes back different:</p>
      <ul>
        <li>The new installment payment in DTI. A fine front-end housing ratio does not save a file whose back-end ratio breaks.</li>
        <li>A new inquiry pattern if several dealers pulled credit.</li>
        <li>
          Whether cash for the car down payment also created a{" "}
          <Link href="/blog/should-i-wait-for-20-percent-down">large-deposit</Link> problem on the mortgage asset
          statements.
        </li>
      </ul>
      <p>
        A plan to pay the car off at closing is not a payoff letter; the debt has to be gone on the report the
        underwriter uses. {NEW_DEBT_UNDERWRITING.whatToDo}
      </p>

      <h2>Student loans in DTI under IDR and SAVE</h2>
      <p>
        Student loans still count in DTI even when you are on an income-driven plan. A $0 IDR or SAVE-related
        forbearance on a dashboard is not automatically a $0 underwriting payment. The investor calculates a payment
        from the credit report, the servicer statement, or a percent of the balance.
      </p>
      <p>
        {STUDENT_LOAN_DTI.creditReportPayment} If the report shows $0 or no payment, the lender has to calculate one,
        and each investor has its own worksheet for that.
      </p>
      <ComparisonTable
        caption={`Typical student-loan DTI treatment as of ${LENDING_FACTS_AS_OF}. Confirm the guide in force.`}
        columns={studentLoanColumns}
        rows={studentLoanRows}
        footnote="Percents are published-guide snapshots, not a quote for your balance. Lender overlays can be tighter."
      />
      <p>
        SAVE has been in legal and servicing flux. Borrowers who were on SAVE may be in a forbearance or a different
        IDR. Underwriting follows the <em>current</em> repayment status and the investor’s student-loan rule, not the
        plan name on an old letter. Ask the servicer for a current statement before you shop as if DTI ignores the
        balance, and do not assume Fannie Mae’s documented-IDR $0 applies to FHA, Freddie Mac, or VA.
      </p>
      <p>Documents that actually move the file:</p>
      <ul>
        <li>Current student-loan statement(s) showing repayment plan, payment, and outstanding balance.</li>
        <li>If you claim IDR $0, written servicer confirmation of that payment, not only the credit report.</li>
        <li>If loans are in forbearance, the forbearance terms and when payment resumes.</li>
      </ul>
      <p>
        First-time cash still has to close on top of DTI. The{" "}
        <Link href="/learn/first-time">first-time cash and closing guide</Link> and the{" "}
        <Link href="/calculators/affordability">affordability calculator</Link> both work better when you enter the
        student-loan payment the investor is likely to count, not $0 because a website said $0.
      </p>

      <h2>What a score does not decide on its own</h2>
      <p>
        A score is one input. Program overlays, DTI, reserves, and documentation all sit alongside it, and a strong
        score does not override a file that does not otherwise work. The reverse is also true: a file with a modest
        score, clean recent history, documented income, and no new debt can be easier to close than one with a higher
        app score and a car loan signed last week.
      </p>
      <p>{ALTERNATIVE_CREDIT.fairHousing}</p>

      <h2>What happens next</h2>
      <ol>
        <li>Pull your own reports and treat a monitoring-app screenshot as a hint, not the underwrite.</li>
        <li>
          Bring anything that looks wrong to the loan officer rather than to a dispute form, and ask which scores and
          model the lender actually pulled.
        </li>
        <li>
          Before you close a card, sign for a car, or respond to an offer to add you to someone’s account, ask what
          the tri-merge counted.
        </li>
        <li>
          If the file is thin rather than weak, gather 12 months of rent and utility proof in your name. If student
          loans are in the picture, get a current servicer statement.
        </li>
        <li>
          Ask what the file actually needs before optimizing a number. A conversation does not pull credit until you
          authorize it, and it is not a commitment to lend. <Link href="/qualify">Start a conversation</Link>.
        </li>
      </ol>
    </ArticleShell>
  )
}
