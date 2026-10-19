import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ComparisonTable } from "@/components/content/comparison-table"
import {
  APR_VS_RATE,
  ARM_CAPS,
  DISCOUNT_POINTS,
  LENDING_FACTS_AS_OF,
  LOCK_IF_RATES_DROP,
  LOCK_VS_FLOAT,
  TEMPORARY_BUYDOWN,
} from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/rate-lock-if-rates-drop"
const title = "Mortgage Rates, Locks and APR: What Moves Your Rate, Locks, Buydowns and ARM Caps"
const description =
  "What moves mortgage rates, rate vs APR on a Loan Estimate, what a lock does if rates drop, extensions vs floating, 2-1 buydowns and ARM caps. Not a rate table."
const published = "2026-08-29"
const modified = "2026-10-19"
const category = "Mortgages"
const keywords = [
  "what moves mortgage rates",
  "APR vs interest rate Loan Estimate",
  "mortgage lock rates drop",
  "float down after lock",
  "rate lock extension vs floating",
  "2-1 buydown who pays",
  "ARM caps explained",
]

const takeaways = [
  "Thirty-year mortgage rates track long-term bond yields, mainly the 10-year Treasury plus a spread, not the Fed’s overnight rate.",
  "A headline average is not your quote. Credit, down payment, property type, occupancy, loan amount, points and lock period set your price.",
  "Compare Loan Estimates on the same loan amount, occupancy, property type and lock period, and read note rate, APR, points, credits and cash to close together.",
  "A lock holds a quoted rate for a window. If rates drop after you lock, you do not automatically get the lower rate; a float-down is a written lock-desk policy.",
  "A temporary buydown subsidizes the payment for a few years while the note rate stays the same. ARM caps limit the note rate, not taxes, insurance or HOA.",
]

const faqs = [
  {
    question: "Does the Federal Reserve set mortgage rates?",
    answer:
      "No. The Fed sets a short-term overnight rate. Thirty-year mortgage rates follow longer-term yields, mainly the 10-year Treasury plus a spread that reflects inflation expectations and investor demand for mortgage bonds. A Fed cut is a signal, not a promise that your quote drops.",
  },
  {
    question: "Is a lower APR always the cheaper loan?",
    answer:
      "Not by itself. APR assumes you keep the loan for the full term and leaves out many third-party charges. A lower note rate bought with points can show a higher APR than a no-point file and still cost less if you keep the loan long enough, or more if you sell or refinance early. Read APR next to points, credits and cash to close on Loan Estimates with the same lock period.",
  },
  {
    question: "If I already locked and rates drop, do I automatically get the lower rate?",
    answer:
      "No. Your lock holds the rate and points on your confirmation for the stated window. Some lenders write a limited float-down into the lock, usually one time, with a minimum drop and sometimes a fee or a worse credit. If your lock confirmation is silent, assume the locked rate stands and ask the lock desk in writing.",
  },
  {
    question: "Is a float-down the same as a lock extension?",
    answer:
      "No. A float-down is what might happen if rates fall while your lock is still live. An extension is what happens if the lock expires before funding, and it usually costs a fee, worse pricing or a relock at the then-current market. They are different desks answering different questions.",
  },
  {
    question: "Should I lock or float?",
    answer:
      "Nobody can tell you which way rates will move before your closing, including this page. If the payment works at today’s quote and closing is inside the lock window, locking removes market risk from the file. Floating keeps the quote open in both directions, and a float plan still needs a lock before closing.",
  },
  {
    question: "Who usually pays for a 2-1 or 3-2-1 buydown?",
    answer: TEMPORARY_BUYDOWN.whoPays,
  },
  {
    question: "What does 2/1/5 mean on an ARM?",
    answer:
      "The three numbers are the initial, periodic and lifetime caps, in percentage points, on the note rate. On a 2/1/5, the first adjustment can move the rate up to 2 points, later adjustments up to 1 point each, and the rate can never rise more than 5 points above the start rate. Caps do not limit taxes, insurance or HOA.",
  },
  {
    question: "Does this site publish today’s rates?",
    answer: LOCK_VS_FLOAT.notARate,
  },
]

const leColumns: readonly ComparisonColumn[] = [
  { id: "rate", heading: "Interest rate (note rate)", href: "/buy/rates" },
  { id: "apr", heading: "APR" },
  { id: "pay", heading: "Monthly payment", href: "/calculators/mortgage-payment" },
]

const leRows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it measures",
    cells: {
      rate: APR_VS_RATE.noteRate,
      apr: APR_VS_RATE.apr,
      pay: "Principal and interest from the note, plus taxes, insurance, HOA, and PMI/MIP when they apply. APR is not this number.",
    },
  },
  {
    id: "points",
    criterion: "Discount points",
    cells: {
      rate: "Points can lower the note. That cost is prepaid interest, not a fee that gets you approved.",
      apr: "Borrower-paid points are typically inside APR. A lower note with points can still show a higher APR than a no-point file.",
      pay: "Principal and interest falls if the note falls. Cash to close rises by the point cost unless someone else pays it.",
    },
  },
  {
    id: "compare",
    criterion: "How to compare two lenders",
    cells: {
      rate: "Same lock period, or you are not comparing the same product.",
      apr: "Read APR with cash to close. APR assumes you keep the loan for the full term.",
      pay: "Match occupancy, loan amount and impounds. A payment screenshot without a Loan Estimate is not a comparison.",
    },
  },
]

const lockColumns: readonly ComparisonColumn[] = [
  { id: "lock", heading: "Lock" },
  { id: "float", heading: "Float" },
  { id: "extend", heading: "Extension" },
  { id: "floatDown", heading: "Float-down" },
]

const lockRows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      lock: LOCK_VS_FLOAT.lock,
      float: LOCK_VS_FLOAT.float,
      extend: LOCK_VS_FLOAT.extension,
      floatDown: LOCK_IF_RATES_DROP.floatDown,
    },
  },
  {
    id: "risk",
    criterion: "What can still move",
    cells: {
      lock: "File changes (score, LTV, occupancy, loan amount, lock period) can still reprice while the lock clock runs. A lock is not clear to close.",
      float: "The quoted rate can rise or fall until you lock. There is no published win for waiting.",
      extend: "The fee, the pricing hit, or the relock rate. Cost is file- and investor-specific and is not quoted here.",
      floatDown: "A small market move may not meet the minimum drop, and a rewrite can still change points or credits.",
    },
  },
  {
    id: "ask",
    criterion: "What to ask in writing",
    cells: {
      lock: "Lock period, expiration date, note rate, points or credits, and whether a float-down exists at all.",
      float: "What has to happen before you can lock, and how many days the lock desk needs before closing.",
      extend: "The extension policy and its cost before the lock expires, not the week it does.",
      floatDown: "One-time or not, the minimum drop, any fee or worse credit, and whether product and lock period must stay the same.",
    },
  },
]

const buydownColumns: readonly ComparisonColumn[] = [
  { id: "twoOne", heading: "2-1 buydown" },
  { id: "three", heading: "3-2-1 buydown" },
]

const buydownRows: readonly ComparisonRow[] = [
  {
    id: "shape",
    criterion: "Payment shape",
    cells: {
      twoOne: TEMPORARY_BUYDOWN.twoOne,
      three: TEMPORARY_BUYDOWN.threeTwoOne,
    },
  },
  {
    id: "year3",
    criterion: "Year 3 (and after)",
    cells: {
      twoOne: "Year 3 is typically the full note payment; the 2-1 subsidy has ended. Taxes, insurance and HOA still sit on top.",
      three: "Year 3 is still subsidized (about 1 point below the note on a classic 3-2-1). Year 4 is the full note payment.",
    },
  },
  {
    id: "not",
    criterion: "Not this product",
    cells: {
      twoOne: TEMPORARY_BUYDOWN.notDiscountPoints,
      three: "Not an ARM. Caps on an adjustable note are a different structure, covered in the next section.",
    },
  },
]

const armColumns: readonly ComparisonColumn[] = [
  { id: "initial", heading: "Initial cap" },
  { id: "periodic", heading: "Periodic cap" },
  { id: "lifetime", heading: "Lifetime cap" },
]

const armRows: readonly ComparisonRow[] = [
  {
    id: "meaning",
    criterion: "What it limits",
    cells: {
      initial: ARM_CAPS.initial,
      periodic: ARM_CAPS.periodic,
      lifetime: ARM_CAPS.lifetime,
    },
  },
  {
    id: "example",
    criterion: "Example on a 5/1 ARM starting at a 6% note rate (illustration only)",
    cells: {
      initial: "With a 2-point initial cap, the first adjustment cannot take the note above 8% from that start rate.",
      periodic: "With a 1-point periodic cap, later annual changes cannot jump more than 1 point at a time.",
      lifetime: "With a 5-point lifetime cap, the note cannot exceed 11% no matter what the index does.",
    },
  },
  {
    id: "not",
    criterion: "What it is not",
    cells: {
      initial: "Not a promise the rate will rise, fall or stay. Not a payment cap.",
      periodic: "Not a cap on taxes, insurance or HOA.",
      lifetime: "Not a quote, a lock or an APR.",
    },
  },
]

export const metadata = articleMetadata({
  seoTitle: "Mortgage Rates, Rate Locks, APR and Buydowns",
  path,
  title,
  description,
  published,
  modified,
  category,
  keywords,
  takeaways,
  faqs,
})

export default function MortgageRatesLocksAndAprPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title,
        description,
        published,
        modified,
        category,
        keywords,
        takeaways,
        faqs,
        bannerSubtitle: "One guide for the rate questions that come up between the first quote and the closing table.",
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Rates make the news, but your Loan Estimate is what you pay. This guide covers what moves mortgage rates, why
        a headline average is not your quote, how to read rate against APR, what a lock does if rates drop after you
        lock, when an extension beats floating, how a temporary buydown works and who pays for it, and what ARM caps
        limit. It does not publish current rates and does not predict where they go next. Snapshot as of{" "}
        {LENDING_FACTS_AS_OF}.
      </p>
      <p>
        Everything here is educational: not a quote, not a commitment to lend, and not advice to wait for a drop.
        Program rules and lock-desk policies change, so confirm the document in front of you.
      </p>

      <h2>What moves mortgage rates</h2>
      <p>
        The 30-year fixed rate is not set by the Federal Reserve. It tracks the yield on the 10-year Treasury, plus a
        spread that pays investors in mortgage-backed securities for prepayment and credit risk. In calmer markets that
        spread has often run around 150 to 200 basis points, and it widened well beyond that in 2022 and 2023 when bond
        markets were volatile. The Fed’s federal funds rate moves the short end of the yield curve. Longer-term yields
        move on inflation expectations, growth, government borrowing and investor appetite for bonds.
      </p>
      <p>The inputs worth watching, in rough order of influence:</p>
      <ul>
        <li>
          <strong>10-year Treasury yield.</strong> The single best leading indicator for 30-year fixed rates.
        </li>
        <li>
          <strong>PCE inflation.</strong> Personal Consumption Expenditures is the Fed’s preferred inflation gauge, and
          bond investors price it in before the Fed acts.
        </li>
        <li>
          <strong>Jobs data.</strong> Strong employment keeps inflation sticky and long yields elevated.
        </li>
        <li>
          <strong>MBS spreads.</strong> The gap between mortgage-backed securities and Treasuries reflects how much
          risk investors will carry. When it widens, mortgage rates rise even if Treasuries do not.
        </li>
      </ul>
      <p>
        The 2022 to 2023 hiking cycle was the fastest in four decades. The weekly 30-year average went from under 3% in
        2021 to nearly 8% in late 2023. When the Fed began cutting its benchmark rate in September 2024, mortgage rates
        did not fall in step, because bond investors had already priced in what they expected the Fed to do. A Fed cut
        is a signal, not a promise that your quote drops.
      </p>
      <p>
        This guide does not track daily lows, weekly averages or forecasts. Timing rates perfectly is not a skill
        anyone has shown consistently, professional bond traders included. Use the averages for direction and your
        Loan Estimate for decisions.
      </p>

      <h2>A headline average is not your quote</h2>
      <p>
        The weekly average in the news is a survey number for a typical borrower. Your quote is priced on your file.
        Two files with the same note rate can have different costs, and two files that close the same week can carry
        different rates for good reasons. The inputs that move your price:
      </p>
      <ul>
        <li>Credit score, and whether the mortgage tri-merge agrees with the consumer app you checked.</li>
        <li>Down payment and loan-to-value.</li>
        <li>Occupancy: primary residence, second home or investment property.</li>
        <li>Property type: a condo, a manufactured home or a property with an ADU carries different overlays.</li>
        <li>
          Loan amount and program: conventional, FHA, VA, USDA, or jumbo once the loan passes the{" "}
          <Link href="/blog/jumbo-vs-conforming-fhfa-county-limit">FHFA county limit</Link>.
        </li>
        <li>Points you buy or lender credits you take, and the lock period you choose.</li>
        <li>Purchase or refinance, and cash-out or rate-and-term if it is a refinance.</li>
      </ul>
      <p>
        Utah’s steady population growth supports housing demand, which can soften rate-driven price swings compared
        with slower-growth markets. Local conditions still vary by city and price point. Check the{" "}
        <Link href="/market-reports">city market reports</Link>, and model a purchase on how long you plan to stay
        rather than on trying to time a market bottom. Why a quote differs from the news average lives on{" "}
        <Link href="/buy/rates">the rates hub</Link>, which is also not a rate table.
      </p>

      <h2>Rate vs APR on a Loan Estimate</h2>
      <p>
        Page 1 of a Loan Estimate shows two percentages for a reason. The interest rate is the note rate used to
        calculate principal and interest. APR is a broader Truth in Lending cost measure that folds in most lender
        prepaid finance charges. They answer different questions, and neither one is the headline average.
      </p>
      <ComparisonTable
        caption={`Rate vs APR vs payment as of ${LENDING_FACTS_AS_OF}. Confirm the Loan Estimate in front of you.`}
        columns={leColumns}
        rows={leRows}
        footnote="Educational snapshot. Title, recording, and many third-party fees often sit outside APR."
      />
      <h3>How to compare two Loan Estimates</h3>
      <p>{APR_VS_RATE.howToCompare}</p>
      <p>
        Hold the inputs constant first, then read the numbers. If one quote is locked for 30 days and the other for 60,
        or one assumes a primary residence and the other an investment property, you are comparing two products, not
        two lenders. Ask for a revised Loan Estimate on matching terms before you decide anything.
      </p>
      <h3>Discount points are a separate math problem</h3>
      <p>
        {DISCOUNT_POINTS.definition} {DISCOUNT_POINTS.breakeven} Pricing is specific to your file, so compare two Loan
        Estimates rather than assuming a standard payback period. The full walk-through is{" "}
        <Link href="/blog/refinance-break-even-when-lower-rate-loses">break-even when a lower rate loses</Link>, which
        covers points alongside refinance math.
      </p>

      <h2>What a lock does, and what happens if rates drop after you lock</h2>
      <p>
        A rate lock holds a quoted rate and points for a stated number of days on a specific loan amount, occupancy and
        product. It is a window, not a promise that the market, or your file, cannot change. The four words that get
        mixed up at the lock desk:
      </p>
      <ComparisonTable
        caption={`Lock, float, extension and float-down as of ${LENDING_FACTS_AS_OF}. Confirm the lock confirmation on your file.`}
        columns={lockColumns}
        rows={lockRows}
        footnote="Educational snapshot. Not a lock, not a fee schedule, and not advice to float or to wait for a drop."
      />
      <p>
        {LOCK_IF_RATES_DROP.notAutomatic} The lock confirmation is the document that answers the question, not a news
        screenshot. Three situations borrowers run into after locking:
      </p>
      <ul>
        <li>
          <strong>Your lock confirmation is silent on float-down.</strong> Assume you keep the locked rate unless the
          lock desk writes something else. Asking is the next step.
        </li>
        <li>
          <strong>There is a one-time float-down with a minimum drop.</strong> A small move may not qualify, and
          exercising it can change points or credits. This page does not publish a required drop in basis points or a
          float-down fee.
        </li>
        <li>
          <strong>You also changed the file.</strong> {LOCK_IF_RATES_DROP.stillReprices} A new auto loan or a lower
          appraised value is a different conversation from a market drop.
        </li>
      </ul>

      <h2>Lock extension vs floating</h2>
      <p>
        Floating means you have not locked and the quote can move in either direction. An extension is what happens
        when a lock you already hold is about to expire before funding. Borrowers often treat them as one decision,
        but they sit on opposite sides of the lock date.
      </p>
      <ul>
        <li>
          <strong>Closing is inside the lock.</strong> Stay on the conditions list. A{" "}
          <Link href="/blog/credit-before-mortgage-rapid-rescore">new auto loan or credit change</Link> or a large
          unsourced deposit can
          still reprice the file even while the lock clock runs.
        </li>
        <li>
          <strong>Appraisal or title is late.</strong> Ask about extension cost before the lock expires. Once it
          lapses, the choice is often a relock at the then-current market, which can be better or worse than what you
          held.
        </li>
        <li>
          <strong>You are still floating and closing is weeks out.</strong> Decide what has to be true for you to lock
          and tell the lock desk. If the payment already works at today’s quote and closing is inside the window a lock
          would cover, locking removes market risk from the file. Floating keeps that risk in exchange for the chance
          of a better quote, and a float plan still ends in a lock before closing.
        </li>
      </ul>
      <p>
        Longer locks usually cost more than shorter ones, so know your closing timeline before you pick a lock period.
        A lock that is too short buys an extension conversation later; a lock that is too long pays for days you do
        not need.
      </p>

      <h2>Temporary buydowns: who pays, and what year three looks like</h2>
      <p>
        A temporary buydown (2-1, 3-2-1 or flat) lowers the payment for the first years by funding a subsidy account at
        closing. The note rate does not change. When the subsidy ends, you pay the full note payment plus taxes,
        insurance and HOA. Who funds the subsidy is a contract and Loan Estimate question, not a free gift.
      </p>
      <ComparisonTable
        caption={`How 2-1 and 3-2-1 structures typically taper as of ${LENDING_FACTS_AS_OF}. Illustration, not a quote.`}
        columns={buydownColumns}
        rows={buydownRows}
        footnote="Flat buydowns (a single temporary rate for a set number of years) also exist. Model the structure on the Loan Estimate, not a flyer."
      />
      <h3>Who pays</h3>
      <p>
        On new construction, a builder-funded buydown is often in the price or in other concessions, and program caps
        on seller concessions still apply. A resale seller can fund one as a negotiated credit. A borrower can fund one
        too; compare that against paying points or keeping the cash before you do. A pitch to buy your rate down that does not show a subsidy
        amount on the Loan Estimate is incomplete.
      </p>
      <h3>Year three is the planning number</h3>
      <p>{TEMPORARY_BUYDOWN.yearThree}</p>
      <p>
        Model the subsidy years and the full payment on the{" "}
        <Link href="/calculators/temporary-buydown">temporary buydown calculator</Link>. If you expect to refinance
        before the subsidy ends, run{" "}
        <Link href="/blog/refinance-break-even-when-lower-rate-loses">break-even after costs</Link> first. A buydown
        does not prepay a refinance, and nothing on this page says rates will be lower when the subsidy ends.
      </p>

      <h2>ARM caps in plain English</h2>
      <p>
        {ARM_CAPS.notation} The three numbers are usually written in the order initial / periodic / lifetime, and they
        apply to the <em>note rate</em> only.
      </p>
      <ComparisonTable
        caption={`How to read ARM caps as of ${LENDING_FACTS_AS_OF}. Illustration rates are not a quote.`}
        columns={armColumns}
        rows={armRows}
        footnote="Start rate, index, and margin are on the Loan Estimate and the note. This table does not price an ARM."
      />
      <h3>Index, margin and the fully indexed rate</h3>
      <p>{ARM_CAPS.fullyIndexed}</p>
      <p>
        After the fixed period (5, 7 or 10 years on a 5/1, 7/1 or 10/1), the lender calculates index plus margin, then
        applies the caps. A start rate below a 30-year fixed is a trade: you are planning around the first adjustment
        date, not collecting a discount with no limit. {ARM_CAPS.paymentNote}
      </p>
      <p>
        Product shape lives on <Link href="/buy/adjustable-rate">adjustable-rate mortgages</Link> and{" "}
        <Link href="/buy/fixed-rate">fixed-rate mortgages</Link>. The{" "}
        <Link href="/calculators/mortgage-payment">payment calculator</Link> takes an illustration rate you type in; it
        cannot apply caps for you, and a typed rate there is not a lock.
      </p>

      <h2>What this guide will not do</h2>
      <ul>
        <li>Publish this week’s rates, a basis-point trigger, a float-down fee or an extension fee.</li>
        <li>Tell you to float because rates always drop, or to lock because they always rise.</li>
        <li>Treat a lock, a buydown or an ARM cap as a commitment to lend or as clear to close.</li>
      </ul>

      <h2>What happens next</h2>
      <ol>
        <li>Read the lock confirmation. If float-down is not written there, it is not yours by default.</li>
        <li>
          Hold loan amount, occupancy, property type and lock period constant across lenders, then read note rate, APR,
          points, credits and cash to close on the same page.
        </li>
        <li>
          Get any buydown structure, and any ARM cap structure, in writing on the same Loan Estimate as the start rate,
          index and margin.
        </li>
        <li>
          Budget the payment you will carry after the subsidy or the fixed period ends, not year-one principal and
          interest.
        </li>
        <li>
          Ask questions about a specific Loan Estimate. A conversation about this article does not lock a rate, and{" "}
          <Link href="/qualify">a pre-approval</Link> is where the file-specific answers start.
        </li>
      </ol>
    </ArticleShell>
  )
}
