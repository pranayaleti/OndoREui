import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import {
  ASSET_DEPLETION,
  BUSINESS_PERSONAL_COMINGLING,
  CPA_LETTER_VS_RETURNS,
  DEPRECIATION_ADD_BACK,
  DTI_EDUCATION,
  EXAMPLE_NOTE,
  EXAMPLE_PURCHASE_PRICE_UTAH,
  GIG_PLUS_W2,
  JUST_WENT_1099,
  K1_INCOME,
  LARGE_DEPOSITS,
  LENDING_FACTS_AS_OF,
  RELOCATION_SEASONING,
  SCHEDULE_E_RENTAL,
  SELF_EMPLOYED_HISTORY,
  SPOUSE_INCOME_OFFSET,
  UTAH_CLOSING_NOTES,
  VARIABLE_INCOME_LIKELY_TO_CONTINUE,
} from "@/lib/content"
import Link from "next/link"

const path = "/blog/how-underwriters-verify-income"
const title = "How Lenders Verify Income: W-2, 1099, Self-Employed and Bank Statements"
const description =
  "How lenders verify W-2, overtime, commission, 1099, K-1, Schedule E rental and bank-statement income: what gets averaged, what counts, and what does not."
const published = "2026-08-29"
const modified = "2026-10-19"

const faqs = [
  {
    question: "Will a lender use my best month?",
    answer:
      "Usually no. Variable income is typically averaged over a documented period. A spike without a history is more likely to be treated as non-qualifying or limited.",
  },
  {
    question: "Is a verbal VOE enough for W-2 overtime?",
    answer:
      "Usually you still need W-2s and year-to-date paystubs. VOE supports that the job and overtime are likely to continue. It does not replace the average.",
  },
  {
    question: "If last year was a down year, can we skip it?",
    answer:
      "Usually no. A down year is typically averaged in. A declining trend can reduce the qualifying average even if the most recent quarter recovered.",
  },
  {
    question: "Do Fannie and Freddie always require two years of self-employment?",
    answer:
      "Two years in the same line of work is the usual agency ask. Some lender overlays accept a shorter history when you have a documented W-2 track record in the same occupation, a complete year of returns, a year-to-date profit and loss, and strong compensating factors. That is an overlay, not a published right.",
  },
  {
    question: "Can last month’s first 1099 invoice count as income?",
    answer: JUST_WENT_1099.seasoning,
  },
  {
    question: "Can my spouse’s W-2 count if they are not on the loan?",
    answer: SPOUSE_INCOME_OFFSET.nonBorrowing,
  },
  {
    question: "Can I qualify on K-1 distributions instead of the income line?",
    answer:
      "Usually no. Underwriters typically start from the K-1 income that matches the tax returns, not from cash you took out of the company. Distributions that exceed documented income often need a different explanation.",
  },
  {
    question: "When do bank statements replace tax returns?",
    answer:
      "On some Non-QM products, not on a typical agency file. Taxable income is still the starting point for most conventional and FHA self-employed files. Modern bank-statement programs analyze deposits against written guidelines; they are not the pre-2008 stated-income products, and their pricing, reserves, and prepayment terms are often less favorable than a documented agency file.",
  },
]

const takeaways = [
  "Underwriting is trying to establish a durable average it can use in DTI, not to confirm that last month was good.",
  "W-2 files prove it with paystubs, W-2s, and a verification of employment. Overtime, bonus, and commission need a documented history that is likely to continue, and a down year stays in the math.",
  "1099, self-employed, and K-1 files prove it with returns and transcripts that match. Two years in the same line of work is the usual agency ask; one year is an overlay conversation; last month’s first invoice is not yet a history.",
  "Rental income you already receive comes from Schedule E, often with depreciation added back. Proposed rent on the house you are buying is a different calculation.",
  "Bank-statement and asset-depletion programs are Non-QM products with their own pricing and overlays, not a conventional shortcut.",
]

const keywords = [
  "how lenders verify income",
  "W-2 vs 1099 vs bank statement mortgage",
  "self employed mortgage two years tax returns",
  "K-1 income mortgage",
  "Schedule E rental income mortgage",
]

export const metadata = articleMetadata({
  seoTitle: "How Lenders Verify Income for a Mortgage in Utah",
  path,
  title,
  description,
  published,
  modified,
  category: "Credit",
  keywords,
  faqs,
})

export default function VerifyIncomePage() {
  const examplePrice = EXAMPLE_PURCHASE_PRICE_UTAH.toLocaleString("en-US")

  return (
    <ArticleShell
      meta={{
        path,
        title,
        description,
        published,
        modified,
        category: "Credit",
        bannerSubtitle: "Each stack is proving a durable average, not a good week.",
        takeaways,
        faqs,
        keywords,
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Underwriters verify income to support an average that can be used in DTI, not to rubber-stamp last month’s
        deposit. W-2, 1099, K-1, rental, and bank-statement files prove that average with different paper. This guide
        walks through each stack: what is usually counted, what is usually limited, and what stalls the file. Snapshot
        as of {LENDING_FACTS_AS_OF}. {EXAMPLE_NOTE}
      </p>

      <h2>What every income file is trying to prove</h2>
      <p>
        Many people with overtime, bonus, commission, tips, gig work, or 1099 income get mortgages. The underwriter is
        usually asking whether the average is durable, not whether you had a strong March. {DTI_EDUCATION.variableIncomeNote}
      </p>
      <p>
        Your lender’s overlay can be stricter than the investor guide. That is normal. Across every income type, the
        same things tend to help: the same line of work for a documented period, paper that matches (paystubs and W-2s,
        or returns plus transcripts), and a written explanation for gaps, job changes, or a drop in the most recent
        year. The same things tend to hurt: cash that never hit a statement, a verbal promise of future overtime or
        contract work, and large gifts moved without a paper trail.{" "}
        <Link href="/blog/should-i-wait-for-20-percent-down">Gift-fund documentation</Link> is its own file.
      </p>

      <h2>W-2 base pay, overtime, and bonus</h2>
      <p>
        Typical stack: paystubs, W-2s, and a verification of employment (VOE). Base pay is the easy line. Overtime and
        bonus can be qualifying income, but the test is not whether you worked extra last month. It is whether the
        history shows a pattern that is likely to continue. {VARIABLE_INCOME_LIKELY_TO_CONTINUE.overtime}
      </p>
      <p>What “likely to continue” is asking for:</p>
      <ul>
        <li>Two years of W-2s that show overtime or bonus in the same job or line of work, not a one-off project.</li>
        <li>Year-to-date paystubs that do not contradict the story. A sudden zero is a red flag.</li>
        <li>An employer that still offers the overtime. VOE language matters more than a text from a supervisor.</li>
      </ul>
      <p>
        A worked example, for illustration only. On a ${examplePrice} purchase in Utah, your base hourly pay is steady
        and overtime shows on two years of W-2s plus year-to-date paystubs. An underwriter may average the overtime, add
        it to base pay, and run DTI on that total. If overtime collapsed this year, the average drops even if your offer
        letter still lists an overtime pool. A written explanation and current paystubs matter more than a promise that
        it will come back.
      </p>

      <h2>Commission and a down year</h2>
      <p>
        Commission-only pay can support a mortgage when the history is documented. The underwriter is usually averaging
        12 or 24 months, not taking your best listing year. {VARIABLE_INCOME_LIKELY_TO_CONTINUE.commissionDownYear}
      </p>
      <ul>
        <li>
          <strong>Stable or rising two-year history.</strong> Many files average the two years, or year-to-date plus
          last year, depending on the guide and the trend.
        </li>
        <li>
          <strong>Down year.</strong> The low year usually stays in the math. You can explain it. You rarely get to
          delete it.
        </li>
        <li>
          <strong>New to commission.</strong> Time in the same line of work matters. Switching from salaried teaching to
          100% commission real estate last month is not the same file as a decade of W-2 plus commission in the same
          industry, and a brand-new 100% commission role is one of the harder files because there is no base salary
          floor.
        </li>
      </ul>
      <p>
        Documents that usually show up: two years of W-2s (if there is any base) or 1099s plus tax returns and
        transcripts, year-to-date paystubs or a commission statement that matches deposits, and a written explanation
        for a gap, a broker change, or a market down year. Do not shop using last month’s commission check as monthly
        income.
      </p>

      <h2>Gig or 1099 income on top of a W-2</h2>
      <p>
        {GIG_PLUS_W2.method} A strong gig month does not replace W-2 overtime rules, and the W-2 does not automatically
        cover an undocumented side hustle.
      </p>
      <p>
        <strong>The W-2 leg.</strong> {GIG_PLUS_W2.w2Leg}
      </p>
      <p>
        <strong>The gig leg.</strong> {GIG_PLUS_W2.gigLeg}
      </p>
      <p>
        A worked shape, not your qualifying income: a W-2 base documented on the last two W-2s can be a stable core. Gig
        1099s that show $40,000 one year and $22,000 the next are usually averaged, or limited if the trend is
        declining, and the $4,000 app month inside the file window does not replace that average. Keep the paystubs and
        W-2s separate from the 1099s and gig statements; do not blend them into one spreadsheet total.
      </p>

      <h2>When a spouse or partner’s W-2 is part of the plan</h2>
      <p>
        A steadier W-2 can support a 1099 or commission average when the person who earns the W-2 is on the application
        as a borrower. {SPOUSE_INCOME_OFFSET.jointApplication}
      </p>
      <p>
        “Offset” is a loose word for what happens. Underwriters do not subtract a W-2 from a 1099. On a joint file, each
        income is calculated on its own history, then added, and both credit files and both counted debts are in the
        DTI, so a thin credit file on the second applicant can also constrain pricing. If the W-2 earner should not be
        on the loan, you are qualifying on the 1099 or mixed file alone; that can still work with a documented average,
        but it is not “using their W-2.” Adding a co-borrower is a credit pull, a DTI change, and a title decision, and
        title vesting is separate from who is on the note.
      </p>
      <p>
        {SPOUSE_INCOME_OFFSET.utahNotCommunityProperty} {SPOUSE_INCOME_OFFSET.fairHousing}
      </p>

      <h2>1099 and self-employed: two years, one year, and the paper stack</h2>
      <p>
        If you are paid on 1099s or you own the business, the mortgage file is closer to a small-business file than a
        W-2 file. {SELF_EMPLOYED_HISTORY.twoYearTypical} Transcripts have to match what was filed, and a year-to-date
        profit and loss supports the current year.
      </p>
      <p>
        Two years is not a souvenir collection. Underwriters need a pattern of net income after expenses that they can
        average. One strong year after a W-2 career can still be thin if the business has no history of surviving a slow
        season. Write-offs that lower taxable income also lower qualifying income; that trade-off is the single most
        common surprise on these files.
      </p>
      <p>
        <strong>When a one-year file even enters the conversation.</strong> {SELF_EMPLOYED_HISTORY.oneYearOverlay} The
        compensating pieces people typically bring, still not a promise: same occupation and similar duties as the prior
        W-2 role (for example, a nurse who went 1099 in the same specialty), a full year of filed returns with matching
        transcripts and a year-to-date profit and loss a CPA will stand behind, and reserves, a stable contract, and DTI
        that is not already at the edge.
      </p>
      <p>Gather this stack before you shop, even if you hope an overlay applies:</p>
      <ul>
        <li>Government ID and Social Security number (or ITIN, if that is how you file).</li>
        <li>Two years of personal federal tax returns, all schedules, plus IRS transcripts when the lender orders them.</li>
        <li>
          Year-to-date profit and loss if you are in a new tax year. Note whether it is CPA-prepared or self-prepared;
          lenders weigh those differently.
        </li>
        <li>Business returns if you file as an entity (S-corp, partnership) rather than a sole proprietor.</li>
        <li>Two months of bank statements, often more for self-employed borrowers. Large deposits need a source.</li>
        <li>Current contracts or offer letters that show the work is ongoing, not a one-off invoice.</li>
      </ul>
      <p>
        Common stalls: returns that do not match transcripts, a brand-new LLC with no operating history, using gross
        1099 receipts as qualifying income when the return shows much lower net, and co-mingled personal and business
        accounts with unexplained transfers. FHA and conventional can both work for documented 1099 income; neither is
        a shortcut around tax returns.
      </p>

      <h2>If you just went 1099 last month</h2>
      <p>
        If you left a W-2 last month and you are now on 1099s, the new contract income is usually not yet a number an
        underwriter can average, because there is no filed history to work from. What is usually usable now: base pay
        from a W-2 job you still hold (with overtime or bonus only on a history that is likely to continue) and a
        co-borrower’s documented W-2 on a joint file. What is usually not: the job you already quit, unless a one-time
        payout is documented as non-continuing and excluded correctly, and the new 1099 work itself. Contracts can
        support the story; they do not replace a tax-year history, and a co-borrower’s income does not season your new
        1099. A W-2 career in the same occupation supports a shorter-history overlay conversation; it does not turn last
        month’s first invoice into two tax years.
      </p>
      <p>
        This month: do not write an offer that assumes the new 1099 income will count. Gather what is already
        documentable (W-2s, the last paystubs from the job you left, and any contracts), ask which lines can be used
        now, and run the numbers on documented income only. If you must buy now, the realistic levers are a
        co-borrower, a smaller loan, or waiting, not a hidden exception. A brand-new LLC or S-election last year sits
        closer to this section than to a seasoned partner file, even if the income now arrives on a K-1.
      </p>

      <h2>K-1 income from a partnership or S-corp</h2>
      <p>
        If you are a partner or S-corp owner, underwriters usually count K-1 income that shows up on the tax returns and
        that you can actually take, not the cash that hit your personal account last quarter. {K1_INCOME.typical}
      </p>
      <p>
        {K1_INCOME.liquidity} {K1_INCOME.declining}
      </p>
      <ul>
        <li>
          <strong>Ordinary business income</strong>: often counted when it is recurring, on two years of returns, and
          accessible to you; limited when the trend is declining or the ownership share is small; excluded when it is a
          one-time item or income the partnership agreement does not let you take.
        </li>
        <li>
          <strong>Guaranteed payments</strong>: counted when they appear consistently on the K-1 and match the return;
          limited when they started in the most recent year; excluded when they are really a distribution labeled as a
          payment.
        </li>
        <li>
          <strong>W-2 wages from the same S-corp</strong>: a separate line from the K-1, and both can count when
          documented. A sudden W-2 increase with no matching history is often limited; a W-2 that does not match payroll
          or the business return is often excluded.
        </li>
      </ul>
      <p>
        Documents to gather: two years of personal returns with all K-1s, the entity’s business returns, transcripts
        when ordered, a year-to-date profit and loss, the operating agreement or bylaws if ownership percentage or
        distribution rights are in question, and W-2s and paystubs if you also take a salary from the S-corp.
      </p>

      <h2>Rental income on Schedule E, and the depreciation add-back</h2>
      <p>
        If you already own rentals, a purchase file usually starts from Schedule E, not from last month’s deposits or
        an “it will rent for” note on the house you are buying. {SCHEDULE_E_RENTAL.method}
      </p>
      <p>
        The underwriter typically takes the rental income and expenses from the Schedule E for each property, adds back
        depreciation and other non-cash items the guide allows, averages the result (often across two years when both
        are in the file), then either nets it against PITI and HOA or counts the full housing on that rental, depending
        on the worksheet. A one-year spike after a vacancy, a 1031 year, or a property that was personal use for part of
        the year can shrink the average. {SCHEDULE_E_RENTAL.history}
      </p>
      <p>
        <strong>The add-back, in detail.</strong> {DEPRECIATION_ADD_BACK.what} {DEPRECIATION_ADD_BACK.typicalAdds}{" "}
        Amortization, depletion, and one-off casualty losses are often treated differently. Adding depreciation back for
        a mortgage file is not how you report income to the IRS; this is not tax advice.
      </p>
      <p>
        <strong>The house in this purchase is a different calculation.</strong> {SCHEDULE_E_RENTAL.subjectProperty} If
        you will occupy it, the new PITI is housing expense, not rental income. If it will be a rental, proposed rent
        needs a lease plus market rent support, not a screenshot of a listing, and occupancy has to match the program.
        Occupancy on a first rental when you still live there has{" "}
        <Link href="/blog/first-rental-occupancy-if-you-still-live-there">its own rules</Link>.
      </p>
      <p>
        Many files are a W-2 or 1099 primary job plus Schedule E on the side. The job is still verified the usual way;
        the rentals do not replace a missing job history. If the rentals are held in an entity, you may have K-1 income
        instead of, or in addition to, Schedule E, and entity depreciation is not automatically the same add-back. A
        DSCR product that qualifies on the property’s rent is a different stack; the{" "}
        <Link href="/calculators/dscr">DSCR calculator</Link> illustrates that path only.
      </p>

      <h2>CPA letters, P&amp;Ls, and what actually moves the file</h2>
      <p>{CPA_LETTER_VS_RETURNS.typical}</p>
      <p>
        <strong>Where a CPA package helps.</strong> {CPA_LETTER_VS_RETURNS.whatHelps} It can also support a one-year
        overlay conversation next to a full year of filed returns, not instead of them.
      </p>
      <p>
        <strong>Where it stalls the file.</strong> {CPA_LETTER_VS_RETURNS.whatDoesNot} “My CPA says I make $X” with no
        matching 1040, K-1, or transcripts is a testimonial, not a qualifying method, and a letter cannot paper over a
        1099 job that started last month or co-mingled deposits that the P&amp;L cannot explain. K-1 income is still
        taken from the K-1 and matching returns, not from a CPA summary of distributions.
      </p>
      <p>{CPA_LETTER_VS_RETURNS.nonQm}</p>

      <h2>Business and personal bank accounts: co-mingling</h2>
      <p>
        Mixing business deposits into a personal account, or paying household bills from the business, is what
        underwriters call co-mingling. {BUSINESS_PERSONAL_COMINGLING.problem}
      </p>
      <p>
        {LARGE_DEPOSITS.conventionalThreshold} When the same account also shows owner draws, cash, Venmo, and client
        wires, every large line becomes a condition: a wire could be income, a loan, a client refund, or a family gift,
        and the underwriter cannot tell. The{" "}
        <Link href="/blog/should-i-wait-for-20-percent-down">60-day paper trail</Link> explains how sourcing works on
        any purchase file.
      </p>
      <p>
        <strong>Seasoning is not a workaround.</strong> {BUSINESS_PERSONAL_COMINGLING.seasoning} A brand-new 1099 who
        deposits the first invoices into personal checking has two problems, history and mixing, and owner draws dumped
        into a personal account without K-1 support do not replace the return.
      </p>
      <p>
        {BUSINESS_PERSONAL_COMINGLING.bankStatement} Bring business and personal statements for the same window with an
        explanation of every large transfer, and do not shuffle accounts the week of application without asking how it
        must be sourced.
      </p>

      <h2>Bank-statement programs when returns undercount income</h2>
      <p>
        If you run a real business, tax returns can show a small number after depreciation, retirement contributions,
        and other deductions while the operating account shows a living. Some Non-QM (non-qualified mortgage) programs
        underwrite from 12 or 24 months of statements instead of the adjusted tax figure. That can be a fit for a
        self-employed borrower whose agency qualifying income sits far below documented deposits, who can produce
        complete statements without missing months, and whose file still meets that investor’s credit, reserve, and
        property guidelines. It is not a secret conventional product, it is not automatically available, and it is not
        “better” by default.
      </p>
      <p>
        What “bank statement” usually means: investors publish a method. Eligible deposits, minus disallowed items (for
        example transfers, cash, or refunds, depending on the guide), then a factor or expense ratio. The result is an
        illustrative qualifying income. Overlays differ by lender, and this page does not invent a factor. Tradeoffs to
        ask about: price and fees versus a documented conventional or FHA file, prepayment penalties on some products,
        higher reserve requirements, and occupancy and property-type limits.
      </p>
      <p>
        If your returns already support the payment you want, start with{" "}
        <Link href="/loans/conventional">conventional</Link> or <Link href="/loans/fha">FHA</Link>. If they do not,
        start at the <Link href="/learn/non-qm">Non-QM hub</Link> with complete statements and the self-employed stack
        above. Asking about Non-QM is not an application.
      </p>

      <h2>Asset depletion: assets as qualifying income</h2>
      <p>
        {ASSET_DEPLETION.what} {ASSET_DEPLETION.agencyVsNonQm}
      </p>
      <p>
        <strong>How the formula usually looks.</strong> {ASSET_DEPLETION.formulaShape} {ASSET_DEPLETION.eligible}
      </p>
      <p>
        {ASSET_DEPLETION.who} Reserves after cash to close are a separate test, measured in{" "}
        <Link href="/blog/should-i-wait-for-20-percent-down">months of PITIA</Link>, and those dollars are not also
        “income.” Asset depletion is not a way to skip occupancy rules on a rental, and it is not a substitute for
        brand-new 1099 income unless the overlay actually uses assets. A DSCR product, which qualifies on a rental’s
        rent rather than on you, is a third Non-QM conversation:{" "}
        <Link href="/blog/dscr-vs-full-doc-rental-loan">DSCR vs full-doc</Link>.
      </p>

      <h2>Relocating to Utah with a new job: offer letters and seasoning</h2>
      <p>
        If you are relocating to Utah and the new job starts in about 60 days, some conventional purchase files can use
        a fully executed, non-contingent offer letter as qualifying income, when the investor’s future-employment tests
        are met. Sixty days is a common borrower question, not a published Fannie Mae “60-day rule.” Source:{" "}
        {RELOCATION_SEASONING.source}
      </p>
      <p>{RELOCATION_SEASONING.fannieOption2}</p>
      <p>
        {RELOCATION_SEASONING.reserves} Future self-employment or commission from a job that has not started is usually
        not this offer-letter path; a brand-new 1099 start is the seasoning problem described earlier.
      </p>
      <p>
        What is Utah-specific here is the closing, not the income rule. {UTAH_CLOSING_NOTES.closingVenue}{" "}
        {UTAH_CLOSING_NOTES.instrument} The purchase contract still has 5:00 p.m. Mountain Time deadlines even if
        payroll has not started;{" "}
        <Link href="/blog/utah-repc-deadline-and-your-loan">a Utah REPC deadline and your loan</Link> covers that
        interaction. Commute, rent, and city context live on <Link href="/moving-to-utah">New to Utah</Link>.
      </p>
      <p>
        Bring the signed offer (employer, position, pay type, start date, and any remaining conditions), ask whether the
        start date sits inside the investor window, and line the REPC Financing &amp; Appraisal Deadline up with
        underwriting rather than with your first paycheck.
      </p>

      <h2>What happens next</h2>
      <p>
        Bring the stack that matches how you are paid, then use the{" "}
        <Link href="/calculators/income">income calculator</Link> and the{" "}
        <Link href="/calculators/affordability">affordability calculator</Link> with a documented average, not the best
        month. Those tools do not know your overtime history or your write-offs. The{" "}
        <Link href="/learn/variable-income">variable-income hub</Link> maps the rest of the file. If a pre-approval later
        fails, the usual reasons are in{" "}
        <Link href="/blog/pre-approval-vs-aus-vs-clear-to-close">declined after pre-approval</Link>.
      </p>
      <p>
        Then ask a loan officer which average the investor will accept for your product before you write an offer that
        assumes it. That conversation is not an application and not a commitment to lend.
      </p>
    </ArticleShell>
  )
}
