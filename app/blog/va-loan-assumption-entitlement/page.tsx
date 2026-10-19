import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ArticleCallout } from "@/components/content/article-callout"
import { ComparisonTable } from "@/components/content/comparison-table"
import { StepList } from "@/components/content/step-list"
import {
  DTI_EDUCATION,
  EXAMPLE_NOTE,
  EXAMPLE_PURCHASE_PRICE_UTAH,
  FHA_SNAPSHOT,
  HILL_AFB_VA,
  LENDING_FACTS_AS_OF,
  LOAN_ASSUMPTION,
  OCCUPANCY_TYPES,
  RURAL_VETERAN_COMPARE,
  USDA_SNAPSHOT,
  VA_ENTITLEMENT,
  VA_ENTITLEMENT_RESTORATION,
  VA_FUNDING_FEE,
  VA_RESIDUAL_INCOME,
} from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"
import Link from "next/link"

const path = "/blog/va-loan-assumption-entitlement"
const title = "VA Loans in Utah: Entitlement, Funding Fee, Residual Income and Assumptions"
const description =
  "Utah VA guide: COE and occupancy, funding fee finance vs cash, remaining entitlement, residual income vs DTI, restoration after a sale, and assumptions."
const published = "2026-09-17"
const modified = "2026-10-19"

const faqs = [
  {
    question: "Is the VA funding fee always charged?",
    answer: VA_FUNDING_FEE.exemptionNote,
  },
  {
    question: "If I finance the funding fee, do I still pay it?",
    answer:
      "Yes. Financing adds it to the loan amount, so you pay interest on it. Paying cash raises cash to close and keeps the loan smaller. Neither choice is automatically better.",
  },
  {
    question: "Can I have two VA loans at once?",
    answer: VA_ENTITLEMENT.remainingEntitlement,
  },
  {
    question: "If my DTI is under 41%, do I skip residual income?",
    answer:
      "No. Residual income is a separate VA test. A DTI that looks comfortable can still fail residual, depending on family size, region, and the proposed payment.",
  },
  {
    question: "If I sell my house and pay off the VA loan, do I get my entitlement back?",
    answer: VA_ENTITLEMENT_RESTORATION.afterSale,
  },
  {
    question: "Does restoration put me back on the first-use funding fee?",
    answer: VA_ENTITLEMENT_RESTORATION.fundingFee,
  },
  {
    question: "Can a non-veteran assume a VA loan?",
    answer:
      "Often yes, with VA and servicer approval, but the seller's entitlement generally stays tied to that loan, because there is no eligible buyer to substitute their own. That is the trade-off a veteran seller has to understand before agreeing.",
  },
  {
    question: "Should a veteran always pick VA over USDA in a rural tract?",
    answer:
      "No. VA is often the first conversation when remaining entitlement, occupancy and residual income fit, but USDA's map and income limit, and the rest of the file, decide what works. If two programs fit, compare two Loan Estimates.",
  },
]

const baseHousingColumns: readonly ComparisonColumn[] = [
  { id: "base", heading: "On-base housing" },
  { id: "buy", heading: "VA purchase off-base", href: "/loans/va" },
]

const baseHousingRows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      base: "Typically a lease. Occupancy of the unit is a housing assignment, not a VA note.",
      buy: HILL_AFB_VA.occupancy,
    },
  },
  {
    id: "coe",
    criterion: "COE",
    cells: {
      base: "A COE is not required to live in base housing.",
      buy: "Required to close. It shows remaining entitlement; it does not certify occupancy.",
    },
  },
  {
    id: "bah",
    criterion: "BAH",
    cells: {
      base: HILL_AFB_VA.bah,
      buy: "BAH can help a household budget. It is not a substitute for residual income, DTI, or occupancy certification on the VA file.",
    },
  },
]

const restoreColumns: readonly ComparisonColumn[] = [
  { id: "restore", heading: "Sell, pay off, restore" },
  { id: "keep", heading: "Keep the first VA loan" },
]

const restoreRows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What you are asking",
    cells: {
      restore: "Can used entitlement come back after this loan is gone so a later purchase can use VA again?",
      keep: "Can I buy another home with VA while this loan is still open?",
    },
  },
  {
    id: "engine",
    criterion: "What VA is testing",
    cells: {
      restore: "Payoff in full plus disposition of the property under current VA rules, then an updated COE.",
      keep: "Remaining entitlement, remaining guaranty against the county limit, and occupancy of the new property.",
    },
  },
  {
    id: "occupancy",
    criterion: "Occupancy",
    cells: {
      restore: "You typically will not occupy the sold house. The next VA purchase still has to meet occupancy on that new property.",
      keep: "You have to intend to occupy the new home as your principal residence. Keeping the first house as a rental does not change that test.",
    },
  },
]

export const metadata = articleMetadata({
  seoTitle: "VA Loans in Utah: Entitlement, Funding Fee and Assumptions",
  path,
  title,
  description,
  published,
  modified,
  category: "Loan Programs",
  keywords: [
    "VA loan Utah",
    "VA entitlement",
    "VA funding fee finance vs cash",
    "VA residual income vs DTI",
    "Hill AFB VA loan",
    "VA entitlement restoration",
    "VA loan assumption",
  ],
  faqs,
})

export default function VaLoanGuidePage() {
  const price = EXAMPLE_PURCHASE_PRICE_UTAH
  const feeRate = 0.0215
  const financedFee = Math.round(price * feeRate)
  const financedLoan = price + financedFee

  return (
    <ArticleShell
      meta={{
        path,
        title,
        description,
        published,
        modified,
        category: "Loan Programs",
        bannerSubtitle:
          "Entitlement, occupancy, the funding fee, and residual income are separate tests. This guide walks through each one.",
        takeaways: [
          "A VA purchase runs several separate tests: the Certificate of Eligibility, occupancy, residual income, and the funding fee. Passing one does not pass the others.",
          "The funding fee can usually be financed or paid in cash. Financing raises the loan balance; paying cash raises cash to close. Some veterans are exempt.",
          "A second VA loan while the first is still open is a remaining-entitlement and occupancy question. Selling and paying off is a restoration question. They are different files.",
          "On an assumption, a veteran seller needs two separate approvals: release of liability and substitution of entitlement. Getting one does not give you the other.",
          "Fee percents here are dated snapshots. Nothing on this page is a quote, a rate lock, or a commitment to lend.",
        ],
        faqs,
        keywords: ["VA loan Utah", "VA entitlement", "VA funding fee", "VA residual income", "VA assumption"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        VA financing is one program, but a VA file is several separate tests, and the questions people ask tend to
        cross between them. Can I buy again while I still have a VA loan? Should I finance the funding fee? Why did
        residual income fail when my DTI looked fine? What happens to my entitlement if someone assumes my loan? This
        guide answers each in turn, in the order a Utah purchase usually meets them. Snapshot as of{" "}
        {LENDING_FACTS_AS_OF}. {VA_ENTITLEMENT_RESTORATION.notADollar}
      </p>

      <h2>Start with the Certificate of Eligibility</h2>
      <p>{HILL_AFB_VA.coe}</p>
      <p>
        That last point matters more than it sounds. A COE tells the lender how much entitlement you have available.
        It does not say anything about how you plan to live in the house. Occupancy is certified separately on the
        loan application, and it is tested on every VA purchase, first use or fifth. {VA_FUNDING_FEE.downPaymentNote}
      </p>
      <p>
        Pull or update the COE before you write an offer. Most lenders can retrieve it through VA systems in minutes,
        and it is the only document that shows whether a prior VA loan has already used part of your entitlement. A
        loan officer reading the COE is the step that turns "I am a veteran, so zero down" into an actual file.
      </p>

      <h3>Occupancy for Hill Air Force Base families</h3>
      <p>
        {HILL_AFB_VA.where} {HILL_AFB_VA.commute}
      </p>
      <p>{OCCUPANCY_TYPES.fairHousing}</p>
      <p>
        The occupancy question comes up constantly near the base because so many households are moving on orders or
        deciding whether to leave base housing. The table below sets the two situations side by side.
      </p>
      <ComparisonTable
        caption={`On-base housing vs a VA purchase as of ${LENDING_FACTS_AS_OF}. Occupancy has to match use.`}
        columns={baseHousingColumns}
        rows={baseHousingRows}
        footnote="Not a BAH quote."
      />
      <p>{HILL_AFB_VA.baseHousingVsPurchase}</p>
      <p>
        {OCCUPANCY_TYPES.fraud} The difference between primary, second home, and investment occupancy is covered in{" "}
        <Link href="/blog/second-home-vs-investment-occupancy">occupancy types</Link>. For BAH, use the official
        lookup (opens a Department of Defense site):{" "}
        <a href={HILL_AFB_VA.bahLookupUrl} className="underline underline-offset-4" rel="noopener noreferrer" target="_blank">
          DTMO BAH rate lookup
        </a>
        . This page does not publish a BAH dollar figure, does not treat BAH as qualifying income by itself, and does
        not rank lenders near the base.
      </p>

      <h2>The funding fee: finance it or pay cash</h2>
      <p>
        Most VA purchases include a funding fee unless an exemption applies. You can often finance it into the loan or
        pay it in cash at closing. That is a cash-to-close versus loan-size tradeoff, not a trick to erase the fee.
      </p>
      <h3>Snapshot percents (confirm before anyone quotes)</h3>
      <ul>
        <li>First use, less than 5% down: {VA_FUNDING_FEE.firstUseLessThan5PercentDown}</li>
        <li>Subsequent use, less than 5% down: {VA_FUNDING_FEE.subsequentUseLessThan5PercentDown}</li>
        <li>First use, 5% to less than 10% down: {VA_FUNDING_FEE.firstUse5ToLessThan10PercentDown}</li>
        <li>First use, 10% or more down: {VA_FUNDING_FEE.firstUse10PercentOrMoreDown}</li>
      </ul>
      <p>
        Source: {VA_FUNDING_FEE.source}. {VA_FUNDING_FEE.exemptionNote} If you believe an exemption applies, the COE
        is where it shows; raise it with the loan officer before the Loan Estimate is built, not after.
      </p>
      <h3>Illustration: finance vs cash on a ${price.toLocaleString("en-US")} purchase</h3>
      <p>
        Assume first use, less than 5% down, at the {VA_FUNDING_FEE.firstUseLessThan5PercentDown} snapshot, zero down,
        and that the schedule still applies. Fee is about ${financedFee.toLocaleString("en-US")}.
      </p>
      <ul>
        <li>
          <strong>Finance the fee.</strong> Loan amount is about ${financedLoan.toLocaleString("en-US")}. Monthly
          principal and interest is calculated on the higher balance, so you pay interest on the fee for as long as
          you hold the loan. Cash to close is mostly closing costs and prepaids.
        </li>
        <li>
          <strong>Pay the fee in cash.</strong> Loan stays at about ${price.toLocaleString("en-US")}. Cash to close
          rises by roughly the fee plus the same costs and prepaids.
        </li>
      </ul>
      <p>
        {EXAMPLE_NOTE} Compare the two shapes on a Loan Estimate, not on this paragraph. The{" "}
        <Link href="/calculators/mortgage-payment">payment calculator</Link> can show the monthly difference as an
        illustration. If cash is tight, financing keeps you in the house; if you plan to hold the loan a long time,
        paying cash avoids years of interest on the fee. There is no universal right answer, only your file.
      </p>

      <h2>Residual income is not DTI</h2>
      <p>{VA_RESIDUAL_INCOME.method}</p>
      <p>
        {DTI_EDUCATION.frontendNote} {DTI_EDUCATION.backendNote} Residual starts after those housing and debt numbers,
        then subtracts estimated maintenance and utilities. What is left has to clear the published table for region,
        loan amount, and family size.
      </p>
      <p>
        {VA_RESIDUAL_INCOME.utahRegionNote} Source: {VA_RESIDUAL_INCOME.source}.
      </p>
      <h3>Why a comfortable DTI can still fail residual</h3>
      <ul>
        <li>A larger family size raises the residual requirement.</li>
        <li>High taxes, insurance, or HOA inflate PITI even when the note rate looks ordinary.</li>
        <li>Counted debts, including student loans as the investor requires, shrink leftover cash.</li>
      </ul>
      <p>
        The reverse is also true: a file with a higher DTI can pass when residual is strong, because residual measures
        dollars rather than a ratio. Compensating factors can matter on residual just as they do on DTI, but they are
        findings in the file, not a slogan. Income still has to be documented:{" "}
        <Link href="/blog/how-underwriters-verify-income">how underwriters verify income</Link>. Ask a loan officer to
        run residual on the actual proposed PITI and family size; the{" "}
        <Link href="/calculators/affordability">affordability calculator</Link> is an illustration only and does not
        run a residual table.
      </p>

      <h2>Remaining entitlement and a second VA loan</h2>
      <p>
        Can you use VA again while you still have a VA loan? Sometimes yes, if remaining entitlement and occupancy
        rules work for the new property. It is not automatic, and it is not a VA second-home product by default.
        Source: {VA_ENTITLEMENT.source}.
      </p>
      <ol>
        <li>
          <strong>Remaining entitlement.</strong> {VA_ENTITLEMENT.remainingEntitlement} County limits matter when
          entitlement is partial, because the remaining guaranty is measured against the limit for the property
          county. How to look that up:{" "}
          <Link href="/blog/jumbo-vs-conforming-fhfa-county-limit">county limit how-to</Link>.
        </li>
        <li>
          <strong>Occupancy.</strong> {VA_ENTITLEMENT.occupancy} Moving for work or a permanent change of station is a
          facts-and-circumstances file, not a blog yes. The same occupancy standard described above for Hill AFB
          families applies here.
        </li>
        <li>
          <strong>Funding fee on a subsequent use.</strong> A second use is usually priced at the subsequent-use rate
          ({VA_FUNDING_FEE.subsequentUseLessThan5PercentDown} at less than 5% down in the snapshot above), unless an
          exemption applies. Confirm the current schedule.
        </li>
      </ol>
      <p>
        Residual income still applies to the second purchase, and if you keep the first house as a rental, the
        underwriter decides how much of that rent counts. Do not write an offer that assumes a second zero-down VA
        loan until a loan officer has read the COE and applied current VA and lender overlays.
      </p>

      <h2>Selling: how entitlement is restored</h2>
      <p>
        If you sell a home that has a VA loan and that loan is paid in full, used entitlement is typically restored so
        you can use VA again on a later purchase. That is restoration after sale, which is a different question from
        keeping the first VA loan and buying another house. The table separates the two.
      </p>
      <ComparisonTable
        caption={`Restoration after sale vs remaining entitlement as of ${LENDING_FACTS_AS_OF}. Confirm the COE.`}
        columns={restoreColumns}
        rows={restoreRows}
        footnote="Educational snapshot. Occupancy, remaining guaranty, and lender overlays still apply."
      />
      <h3>How restoration usually happens after a sale</h3>
      <ol>
        <li>
          <strong>The VA loan is paid in full.</strong> Sale proceeds, a conventional refinance that pays VA off, or
          cash can do that. A listing is not a payoff.
        </li>
        <li>
          <strong>The property is disposed of under current VA rules.</strong> {VA_ENTITLEMENT_RESTORATION.afterSale}
        </li>
        <li>
          <strong>The Certificate of Eligibility is updated.</strong> Restoration shows on the COE. Ask the next lender
          to pull it rather than assuming last year's COE still matches.
        </li>
      </ol>
      <h3>Other restoration paths</h3>
      <ul>
        <li>
          <strong>One-time restoration without a sale.</strong> {VA_ENTITLEMENT_RESTORATION.oneTime}
        </li>
        <li>
          <strong>Assumption and substitution.</strong> A VA-eligible buyer who assumes your loan can substitute their
          own entitlement for yours. The next section covers how that works and what it does not do.
        </li>
      </ul>
      <p>{VA_ENTITLEMENT_RESTORATION.fundingFee}</p>
      <h3>If you are under contract to sell</h3>
      <ul>
        <li>Tell the listing side and the loan officer that the loan to be paid is VA. Payoff letters take time.</li>
        <li>
          If you will buy again with VA, do not write the next offer as if zero-down entitlement is already restored
          until the COE reflects it, or until a loan officer has applied current VA rules to the timeline.
        </li>
        <li>
          A Utah purchase contract still runs its own clocks:{" "}
          <Link href="/blog/utah-repc-deadline-and-your-loan">REPC deadlines</Link>.
        </li>
      </ul>

      <h2>VA loan assumptions: release of liability and substitution of entitlement</h2>
      <p>
        VA loans are generally assumable, which makes them attractive when existing rates sit below new ones. For a
        veteran seller, though, the important question is not whether someone can take over the payment. It is what
        happens to the entitlement that made the loan possible.
      </p>
      <p>{LOAN_ASSUMPTION.whatItIs}</p>
      <p>
        {LOAN_ASSUMPTION.creditStillApplies} The buyer also covers the gap between price and remaining balance.{" "}
        {LOAN_ASSUMPTION.theEquityGap} Those mechanics are the same on any assumable loan; what follows is what is
        specific to VA.
      </p>
      <h3>Entitlement is the part people miss</h3>
      <p>{VA_ENTITLEMENT_RESTORATION.substitution}</p>
      <p>
        Contrast that with the ordinary path above. Restoration after a sale comes from payoff plus disposition. An
        assumption does neither: the loan survives, so restoration has to come from substitution by an eligible
        buyer, not from payoff.
      </p>
      <ArticleCallout variant="warning" title="Selling by assumption to a non-veteran">
        A buyer who is not VA-eligible can often still assume the loan, but has no entitlement to substitute. The
        seller's entitlement generally stays tied to that property until the loan is paid off. A veteran who plans to
        buy again should understand that before agreeing to an assumption, not after.
      </ArticleCallout>
      <h3>What a veteran seller should insist on</h3>
      <StepList
        steps={[
          {
            title: "Ask whether the buyer is VA-eligible",
            body: "It determines whether substitution of entitlement is even on the table. This is the single question that changes the outcome for you.",
          },
          {
            title: "Require a documented release of liability",
            body: LOAN_ASSUMPTION.releaseOfLiability,
          },
          {
            title: "Request substitution of entitlement in the same package",
            body: "Release of liability and substitution are separate approvals. Ask for both explicitly; do not assume one carries the other. VA's release addresses your liability to the Government. Neither release restores your entitlement; only substitution does.",
          },
          {
            title: "Confirm the updated Certificate of Eligibility afterwards",
            body: "Verify what your COE says before you rely on that entitlement for a next purchase. Restoration by substitution is a VA process, and it shows on the COE, not on the closing statement.",
          },
        ]}
      />
      <h3>For the assuming buyer</h3>
      <p>
        An assumption on a VA loan is a servicer process with its own timeline. {LOAN_ASSUMPTION.timing} Servicers
        generally expect the assuming buyer to occupy the property and will ask for an occupancy certification in the
        assumption package. Confirm that requirement with the servicer and against current VA policy rather than
        treating an assumption as a route to an investment property.
      </p>
      <p>
        Assumptions also have their own fee treatment, which is not the same as the purchase funding-fee schedule
        above. Do not carry a purchase percentage into an assumption conversation; ask the servicer what applies to
        this transaction. {LOAN_ASSUMPTION.notAPromise}
      </p>

      <h2>USDA vs VA vs FHA for a veteran in a rural tract</h2>
      <p>
        A veteran buying in a rural census tract may have three primary-residence conversations, VA, USDA, and FHA,
        and this guide does not pick one. Run the USDA map, remaining VA entitlement, and HUD occupancy as separate
        tests. {RURAL_VETERAN_COMPARE.notAPick}
      </p>
      <p>{RURAL_VETERAN_COMPARE.fairHousing}</p>
      <ul>
        <li>
          <strong>VA.</strong> {RURAL_VETERAN_COMPARE.vaFirst} The funding fee and residual income sections above are
          the VA-specific tests. Program page: <Link href="/loans/va">VA loans</Link>.
        </li>
        <li>
          <strong>USDA.</strong> {RURAL_VETERAN_COMPARE.usdaMap} Upfront guarantee fee snapshot:{" "}
          {USDA_SNAPSHOT.upfrontGuaranteeFee}; annual {USDA_SNAPSHOT.annualFee}. Program page:{" "}
          <Link href="/loans/usda">USDA loans</Link>.
        </li>
        <li>
          <strong>FHA.</strong> {RURAL_VETERAN_COMPARE.fhaFallback} Down payment at 580+:{" "}
          {FHA_SNAPSHOT.minDownPayment580Plus}. Upfront MIP: {FHA_SNAPSHOT.upfrontMip}. Occupancy:{" "}
          {FHA_SNAPSHOT.occupancy}. <Link href="/loans/fha">FHA loans</Link> and{" "}
          <Link href="/blog/fha-vs-conventional-loans-utah">FHA vs conventional</Link>.
        </li>
      </ul>

      <h3>Scenarios (file facts, not advice)</h3>
      <ul>
        <li>
          <strong>COE and remaining entitlement fit, property is primary.</strong> VA is often the first conversation.
          USDA's household income cap and map can still fail even if VA would work.
        </li>
        <li>
          <strong>Entitlement is tied up, USDA map and income pass.</strong> USDA may be in the conversation. It is
          still primary occupancy, not an investment. {USDA_SNAPSHOT.occupancy}
        </li>
        <li>
          <strong>Map fails or household income is over the USDA limit, and VA does not fit.</strong> FHA may be the
          remaining low-down primary path. MIP is not a VA funding fee and not a USDA guarantee fee.
        </li>
      </ul>
      <p>
        {USDA_SNAPSHOT.incomeNote} Run the property address on the{" "}
        <Link href={USDA_SNAPSHOT.mapToolUrl}>official USDA eligibility tool</Link>, not a city name. If two programs
        both fit, compare two Loan Estimates.
      </p>

      <h2>What happens next</h2>
      <ol>
        <li>
          Ask a loan officer to pull or review the COE before you treat zero-down as automatic. If you have a prior
          VA loan, say whether it is paid off, still open, or being assumed, because each one is a different file.
        </li>
        <li>
          Say how you will occupy the house, including PCS timing and whether you will leave base housing. Then ask
          for residual income to be run on the real proposed PITI and your family size.
        </li>
        <li>
          Decide finance versus cash on the funding fee from a Loan Estimate, and confirm exemption status and the
          current VA schedule before anyone quotes a percent.
        </li>
        <li>
          If you are selling by assumption, get release of liability and substitution of entitlement named explicitly
          in what you agree to, in writing, before closing.
        </li>
      </ol>
      <p>
        A loan officer can compare an assumption against a normal file, or VA against USDA and FHA on the same
        property: <Link href="/qualify">start a conversation</Link>. It is a conversation, not a commitment to lend,
        and a conversation does not restore entitlement.
      </p>
    </ArticleShell>
  )
}
