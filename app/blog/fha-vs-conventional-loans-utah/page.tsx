import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import { ArticleCallout } from "@/components/content/article-callout"
import { ComparisonTable } from "@/components/content/comparison-table"
import { IsThisRightForMe } from "@/components/content/is-this-right-for-me"
import { ProsCons } from "@/components/content/pros-cons"
import { StepList } from "@/components/content/step-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  CONFORMING_LIMIT_NOTE,
  CONVENTIONAL_SNAPSHOT,
  EXAMPLE_NOTE,
  EXAMPLE_PURCHASE_PRICE_UTAH,
  FHA_CONDO_ROSTER,
  FHA_COUNTY_LIMIT_NOTE,
  FHA_HOUSE_HACK,
  FHA_SNAPSHOT,
  LENDING_FACTS_AS_OF,
  LOAN_ASSUMPTION,
  USDA_SNAPSHOT,
} from "@/lib/content"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"

const slug = "/blog/fha-vs-conventional-loans-utah"
const title = "FHA vs Conventional in Utah, Plus USDA: Down Payment, MIP, Condos and Assumptions"
const description =
  "Compare FHA, conventional and USDA for Utah buyers: down payment, MIP vs PMI, condo approval, duplex house hacking, DPA with gift funds, and FHA assumptions."
const published = "2026-03-23"
const modified = "2026-10-19"
const author = "Ondo RE Team"
const category = "Mortgages"
const image = "/modern-apartment-balcony.webp"
const keywords = [
  "FHA vs conventional Utah",
  "Utah FHA loan",
  "conventional loan Utah",
  "USDA loan Utah eligibility",
  "FHA condo approval",
  "FHA duplex house hack",
  "FHA loan assumption",
  "down payment assistance FHA gift funds",
]

const takeaways = [
  "FHA, conventional and USDA differ on down payment, mortgage insurance and who is eligible. The cheaper file over five to seven years is not always the one with the lower note rate.",
  "FHA MIP usually stays for the life of the loan when you put down less than 10%. Conventional PMI can come off with equity. Compare the insurance line on two Loan Estimates, not the rate alone.",
  "A condo needs the project to be currently approved on HUD's list, not only the borrower. A duplex you occupy can use FHA without the condo roster, and the self-sufficiency test is a 3 to 4 unit rule.",
  "Gift funds and down payment assistance can sit on the same FHA purchase. They are different instruments and each needs its own paper trail.",
  "USDA is zero down only when the address passes the map and household income passes the area limit. An FHA assumption keeps the old rate, but you still qualify and you cover the equity gap in cash.",
] as const

const faqs = [
  {
    question: "Can I get an FHA loan in Utah with a 640 credit score?",
    answer: `${FHA_SNAPSHOT.scoreNote} A 640 file is usually an FHA-first comparison, not an automatic conventional denial and not an FHA approval. Run both Loan Estimates.`,
  },
  {
    question: "Does FHA mortgage insurance ever go away?",
    answer:
      "Usually not on its own when you put down less than 10%. FHA annual MIP is typically charged for the life of the loan at that level, and a refinance into conventional is the usual exit. Conventional PMI can be canceled once the loan reaches the investor's equity threshold.",
  },
  {
    question: "Is every Utah condo FHA-eligible if I qualify as a borrower?",
    answer:
      "No. The project has to be currently approved on HUD's condominium list, or your lender has to obtain single-unit approval. Your credit does not override an expired or rejected project.",
  },
  {
    question: "Does the FHA self-sufficiency test apply to a duplex?",
    answer: FHA_HOUSE_HACK.duplexVs34,
  },
  {
    question: "Can a gift and down payment assistance both be used on the same FHA down payment?",
    answer: `Often, when each source is eligible and documented. ${FHA_SNAPSHOT.giftFunds} DPA is usually a second lien or grant with its own note, occupancy, and income tests. It is not a gift letter.`,
  },
  {
    question: "If my city sounds rural, is it USDA-eligible?",
    answer: USDA_SNAPSHOT.mapNote,
  },
  {
    question: "Do I still have to qualify to assume an FHA loan?",
    answer: LOAN_ASSUMPTION.creditStillApplies,
  },
  {
    question: "Is an FHA assumption cheaper than a new loan?",
    answer:
      "Not automatically. The rate may be lower, but you still have to cover the gap between the price and the remaining balance. On a seasoned loan that gap is often larger than a normal down payment, so the cash required can be higher even when the payment is lower.",
  },
] as const

const condoColumns: readonly ComparisonColumn[] = [
  { id: "project", heading: "Project approval (roster)", href: "/loans/fha" },
  { id: "sua", heading: "Single-unit approval", href: "/loans/fha" },
]

const condoRows: readonly ComparisonRow[] = [
  {
    id: "what",
    criterion: "What it is",
    cells: {
      project: FHA_CONDO_ROSTER.projectApproval,
      sua: FHA_CONDO_ROSTER.singleUnit,
    },
  },
  {
    id: "who",
    criterion: "Who starts it",
    cells: {
      project: "HOA or sponsor / DE lender through HUD's project process. Recertification is on a timer.",
      sua: "Your lender submits HUD's single-unit questionnaire with the case. You do not apply to HUD yourself.",
    },
  },
  {
    id: "fail",
    criterion: "Common fails",
    cells: {
      project: "Expired status, litigation, insurance gaps, owner-occupancy or concentration tests, incomplete recertification.",
      sua: "HOA will not produce budgets and insurance, project too small, manufactured housing, or HUD concentration limits already hit.",
    },
  },
]

const unitColumns: readonly ComparisonColumn[] = [
  { id: "duplex", heading: "2-unit (duplex) you occupy", href: "/loans/fha" },
  { id: "tri", heading: "3 to 4 unit you occupy", href: "/loans/fha" },
]

const unitRows: readonly ComparisonRow[] = [
  {
    id: "occ",
    criterion: "Occupancy",
    cells: {
      duplex: "Principal residence: you occupy one unit as your home.",
      tri: "Same occupancy rule. FHA is not an investment-occupancy purchase on 3 to 4 units either.",
    },
  },
  {
    id: "self",
    criterion: "Self-sufficiency test",
    cells: {
      duplex: "Does not apply to a typical two-unit. A rental-income worksheet on the other unit still can.",
      tri: "Applies. Adjusted market rent on all units must cover the proposed PITIA per HUD's current handbook.",
    },
  },
  {
    id: "limits",
    criterion: "Loan limits",
    cells: {
      duplex: FHA_HOUSE_HACK.limits,
      tri: "3- and 4-unit FHA limits are a different HUD column for the same county. Look them up. Do not memorize a blog dollar figure.",
    },
  },
]

export const metadata = articleMetadata({
  seoTitle: "FHA vs Conventional vs USDA Loans in Utah",
  path: slug,
  title,
  description,
  published,
  modified,
  author,
  category,
  image,
  keywords,
  takeaways,
  faqs,
})

export default function FhaVsConventionalLoansUtah() {
  const price = EXAMPLE_PURCHASE_PRICE_UTAH.toLocaleString("en-US")
  const fhaDown = Math.round(EXAMPLE_PURCHASE_PRICE_UTAH * 0.035).toLocaleString("en-US")
  const conventionalDown = Math.round(EXAMPLE_PURCHASE_PRICE_UTAH * 0.05).toLocaleString("en-US")
  const assumedBalance = Math.round(EXAMPLE_PURCHASE_PRICE_UTAH * 0.6).toLocaleString("en-US")
  const equityGap = Math.round(EXAMPLE_PURCHASE_PRICE_UTAH * 0.4).toLocaleString("en-US")

  return (
    <ArticleShell
      meta={{
        path: slug,
        title,
        description,
        published,
        modified,
        author,
        category,
        image,
        keywords,
        takeaways,
        faqs,
        bannerSubtitle: "The right loan depends on your credit, your cash, the property, and how long you plan to stay.",
      }}
    >
      <p className="lead text-xl text-foreground/70 mb-6">
        Compare FHA, conventional and USDA on down payment, mortgage insurance, credit overlays and loan limits, then on
        the property tests that decide a file before pricing does: condo project approval, two-unit occupancy, the USDA
        map and household income. The cheaper file over five to seven years is not always the one with the lower note
        rate. This page is education, not a recommendation for your file, and nothing on it is a commitment to lend.
        Snapshot as of {LENDING_FACTS_AS_OF}.
      </p>

      <h2>The basics: FHA, conventional and USDA</h2>
      <p>
        An <strong>FHA loan</strong> is insured by the Federal Housing Administration and underwritten by approved
        lenders. Files often land here when score, down payment, or DTI is tighter than conventional overlays. A{" "}
        <strong>conventional loan</strong> is not government-backed; conforming files follow Fannie Mae or Freddie Mac
        guides, and jumbo files follow private-investor overlays above the FHFA county limit. A{" "}
        <strong>USDA guaranteed loan</strong> is backed by USDA Rural Development and can be zero down, but only for an
        address on the current USDA map and a household under the current area income limit. On the Wasatch Front that
        second program is often ruled out by the map before anyone prices it.
      </p>
      <p>
        The rest of this guide walks through the questions in the order an underwriter meets them: how much cash,
        what score, what insurance, how large a loan, and whether the property itself passes the program's test.
      </p>

      <h2>Down payment requirements</h2>
      <ul>
        <li>
          <strong>FHA:</strong> {FHA_SNAPSHOT.minDownPayment580Plus} minimum with a 580+ credit score;{" "}
          {FHA_SNAPSHOT.minDownPayment500To579} minimum with a 500 to 579 credit score. {FHA_SNAPSHOT.scoreNote}
        </li>
        <li>
          <strong>Conventional:</strong> {CONVENTIONAL_SNAPSHOT.lowDownOptions} Below 20% typically triggers private
          mortgage insurance (PMI).
        </li>
        <li>
          <strong>USDA:</strong> Zero down when the property map, household income, and occupancy tests are met. The
          upfront guarantee fee is usually financed, so zero down is not zero cost.
        </li>
      </ul>
      <p>
        Illustration on a ${price} purchase: {FHA_SNAPSHOT.minDownPayment580Plus} FHA down is ${fhaDown}; 5%
        conventional down is ${conventionalDown}. {EXAMPLE_NOTE} FHA's lower cash-to-close can look cheaper on day one;
        MIP vs PMI over a few years is what you should compare next. Down payment is also not the whole cash
        requirement. Prepaids, closing costs, and reserves sit on top of it, and the section on gift funds and down
        payment assistance below covers where that money can come from.
      </p>

      <h2>Credit score requirements</h2>
      <ul>
        <li>
          <strong>FHA:</strong> {FHA_SNAPSHOT.scoreNote}
        </li>
        <li>
          <strong>Conventional:</strong> {CONVENTIONAL_SNAPSHOT.typicalMinimumScore}. Higher scores often improve
          pricing, but there is no single best-rate score.
        </li>
        <li>
          <strong>USDA:</strong> {USDA_SNAPSHOT.creditNote}
        </li>
      </ul>
      <p>
        If your score is below typical conventional overlays, FHA is often the remaining agency path. Between the low
        600s and high 600s, run both Loan Estimates. A higher score does not automatically make conventional cheaper
        once MIP vs PMI and term are included.
      </p>
      <h3>A 640 FICO in Utah: compare both, promise neither</h3>
      <p>
        A 640 middle score is a common &ldquo;am I even in the conversation?&rdquo; question. HUD policy can allow FHA
        at 580+ with 3.5% down, but lender overlays often sit higher. Conventional agency guides often talk about 620,
        and many Utah overlays sit above that. A 640 file is frequently an FHA-first comparison, not an automatic
        conventional denial and not an FHA approval.
      </p>
      <ul>
        <li>
          <strong>Ask about FHA when</strong> conventional overlays look tight on score or down payment, you need HUD's
          more flexible DTI policy with compensating factors, or gift funds need to cover the full down payment.{" "}
          {FHA_SNAPSHOT.dtiNote}
        </li>
        <li>
          <strong>Still price conventional</strong> if reserves, occupancy, and the property (especially condos) fit,
          or if you care about PMI that can come off with equity. Compare 5 to 7 year total housing cost including MIP
          vs PMI.
        </li>
        <li>
          <strong>Do not treat 640 as a magic number.</strong> Pricing, AUS findings, and overlays move. The product
          that wins is the Loan Estimate you can actually close, not a blog table.
        </li>
      </ul>

      <h2>Mortgage insurance: MIP, PMI and the USDA guarantee fee</h2>
      <p>This is where most buyers make a costly mistake by focusing only on the interest rate.</p>
      <p>
        <strong>FHA Mortgage Insurance Premium (MIP):</strong>
      </p>
      <ul>
        <li>Upfront MIP: {FHA_SNAPSHOT.upfrontMip}</li>
        <li>Annual MIP: {FHA_SNAPSHOT.annualMipNote}</li>
        <li>
          <strong>Key difference:</strong> FHA MIP is typically charged for the life of the loan if you put down less
          than 10%. You generally cannot drop it by building equity; a refinance into conventional is the usual exit.
        </li>
      </ul>
      <p>
        <strong>Conventional PMI:</strong>
      </p>
      <ul>
        <li>Premium depends on credit score and LTV; it is not a single published percent.</li>
        <li>
          {CONVENTIONAL_SNAPSHOT.pmiRemoval} Under the Homeowners Protection Act, automatic cancellation is tied to 78%
          of original value, not a marketing &ldquo;purchase price&rdquo; shortcut.
        </li>
      </ul>
      <p>
        <strong>USDA guarantee fee:</strong>
      </p>
      <ul>
        <li>Upfront: {USDA_SNAPSHOT.upfrontGuaranteeFee}</li>
        <li>Annual: {USDA_SNAPSHOT.annualFee}</li>
        <li>{USDA_SNAPSHOT.feeNote}</li>
      </ul>
      <p>
        We do not publish a monthly MIP or PMI dollar figure here. Compare the insurance line on two Loan Estimates
        over a 5 to 7 year horizon instead of assuming FHA is always more expensive, or conventional always cheaper.
        How each product actually leaves the loan:{" "}
        <Link href="/blog/should-i-wait-for-20-percent-down">MIP vs PMI exit</Link>. If the property is a
        condominium, there is a separate HUD project test before any of this matters; it is covered below.
      </p>

      <h2>Loan limits in Utah</h2>
      <p>All three programs cap loan size, and the caps change every year:</p>
      <ul>
        <li>
          <strong>Conventional conforming:</strong> {CONFORMING_LIMIT_NOTE}
        </li>
        <li>
          <strong>FHA:</strong> {FHA_COUNTY_LIMIT_NOTE}
        </li>
        <li>
          <strong>USDA:</strong> Area loan limits exist, but the map and income tests usually bind first.
        </li>
      </ul>
      <p>
        If the purchase is above the current conforming limit for that county, you are in jumbo territory, where
        neither FHA nor standard conventional applies. <Link href="/loans/jumbo">Jumbo</Link> overlays (down payment,
        score, reserves) are set by the investor, not by a number on this page.
      </p>

      <h2>Property condition and seller acceptance</h2>
      <p>
        FHA has stricter property condition standards. The home must meet HUD minimum property requirements; issues
        like peeling paint, broken windows, missing handrails, or roof concerns can trigger required repairs before
        closing. Conventional loans have more flexible property standards, making them easier to use on fixer-uppers
        or homes with deferred maintenance. USDA appraisals follow HUD's minimum property requirements as well.
      </p>
      <p>
        In competitive Utah markets like Draper, Lehi, and Salt Lake City, sellers sometimes prefer conventional
        offers, especially if the property has condition issues that could delay an FHA appraisal. If you are
        competing in multiple-offer situations, a conventional offer may have a practical advantage even if FHA would
        cost you less.
      </p>

      <h2>FHA condo project approval and the roster</h2>
      <p>
        An FHA loan on a condominium needs the <em>project</em> to work, not only the borrower. Look the building up on
        HUD's current condominium list before you write an FHA offer. Expired, withdrawn, or missing is not approved.
        Match the legal project name, not the marketing name on a listing site.
      </p>
      <StepList
        steps={[
          {
            title: "Open HUD's condominium search",
            body: (
              <>
                Opens HUD.gov in a new tab:{" "}
                <a
                  href={FHA_CONDO_ROSTER.rosterUrl}
                  className="underline underline-offset-4"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  HUD condominium approval search
                </a>
                . Confirm it is still the published tool; HUD moves URLs.
              </>
            ),
          },
          {
            title: "Search by project name, city, or state",
            body: "Match the legal project name, not the marketing name used on listing sites.",
          },
          {
            title: "Read the status, not just the listing",
            body: "Status must be currently approved. Expired, rejected, and withdrawn are different statuses.",
          },
        ]}
      />
      <p>{FHA_CONDO_ROSTER.recertification}</p>
      <ComparisonTable
        caption={`Project roster vs single-unit approval as of ${LENDING_FACTS_AS_OF}.`}
        columns={condoColumns}
        rows={condoRows}
        footnote="HUD handbook tests change. This is a map, not a project underwrite."
      />
      <h3>What the HOA still has to produce</h3>
      <ul>
        <li>
          Budget, reserves, and insurance certificates (including fidelity coverage when required). Condo unit-owner
          coverage is typically HO-6 next to the master policy:{" "}
          <Link href="/blog/townhome-vs-condo-hoa-docs-lenders-ask">hazard vs HO-3 vs HO-6</Link>.
        </li>
        <li>Litigation disclosure. Active construction-defect or HOA lawsuits stall both paths.</li>
        <li>
          Owner-occupancy and FHA-concentration facts. A building full of FHA units can fail concentration even if
          the roster was once approved.
        </li>
      </ul>
      <p>
        Conventional condo overlays exist too, but they are not this HUD list. If the project is not approved, ask a
        loan officer whether single-unit approval is even possible before you spend inspection money. A late condo
        fail is a common <Link href="/blog/pre-approval-vs-aus-vs-clear-to-close">decline after pre-approval</Link>.
      </p>

      <h2>House hacking a duplex with FHA</h2>
      <p>
        House hacking a duplex with FHA means you buy a two-unit property and occupy one unit as your principal
        residence. The other unit's rent may help qualify. It is not an FHA investment loan, and it is not a promise
        that any duplex in Utah will fit this year's county limit.
      </p>
      <p>
        {FHA_HOUSE_HACK.occupancy} If you will not live there, look at{" "}
        <Link href="/blog/second-home-vs-investment-occupancy">occupancy types</Link> and{" "}
        <Link href="/blog/dscr-vs-full-doc-rental-loan">DSCR vs full-doc</Link> instead of relabeling the file.
      </p>
      <p>{FHA_HOUSE_HACK.duplexVs34}</p>
      <ComparisonTable
        caption={`FHA 2-unit vs 3 to 4 unit as of ${LENDING_FACTS_AS_OF}. Confirm HUD 4000.1.`}
        columns={unitColumns}
        rows={unitRows}
        footnote="Educational snapshot. Appraiser market rent, not a listing screenshot, drives the worksheet."
      />
      <p>
        Two-unit limits are a different column from one-unit on HUD's table, so confirm the property county before you
        write an offer as if last year's number still applies. Down payment and MIP follow the FHA rules above.
      </p>
      <p>
        {FHA_HOUSE_HACK.notCondo} The condo roster section above is for condominium projects, not a typical duplex on
        its own parcel. Bring leases or ask how proposed rent on the other unit is counted. Existing rentals you
        already own still use <Link href="/blog/how-underwriters-verify-income">Schedule E</Link>.
      </p>

      <h2>Stacking down payment assistance with FHA and gift funds</h2>
      <p>
        Family gift funds and a down payment assistance (DPA) program can sit on the same FHA purchase. They are not
        the same source of funds. The gift needs a donor paper trail. DPA needs the agency's note, disclosures, and
        first-lien pairing.
      </p>
      <ul>
        <li>
          <strong>Gift.</strong> Eligible donor, gift letter, evidence the money left the donor and arrived with you or
          at closing. Not repayable. Details: <Link href="/blog/should-i-wait-for-20-percent-down">gift-fund rules</Link>.
        </li>
        <li>
          <strong>DPA (including many Utah Housing Corporation products).</strong> Often a second mortgage, a silent
          second, or a grant with recapture. Income, purchase-price, education class, and occupancy tests apply. Look
          at the <Link href="/buy/first-time/grants">grants page</Link> for the map, then confirm the live agency
          guide.
        </li>
      </ul>
      <p>{FHA_SNAPSHOT.giftFunds}</p>
      <ol>
        <li>The first lien is FHA (or another program the DPA allows). Not every DPA pairs with every first lien.</li>
        <li>The DPA fills part of the down payment or closing costs per that product's formula.</li>
        <li>A gift can fill the remainder when the donor and paper trail meet FHA and the DPA overlay.</li>
        <li>Layered liens still have to fit CLTV and any subordinate-financing rules. That is an underwriting test.</li>
      </ol>
      <p>
        Do not move family money into your account &ldquo;to look stronger&rdquo; before the DPA underwriter has a
        sourcing plan. Large undocumented deposits stall both layers. This guide does not list this year's UHC dollar
        amounts, rate sheets, or income limits, because those go stale, and it does not tell you that you will receive
        assistance. Ask a loan officer which first-lien and DPA pairing is being offered this month, then read{" "}
        <Link href="/blog/utah-closing-costs-title-origination-prepaids">cash besides down payment</Link> so you still fund
        prepaids.
      </p>

      <h2>USDA map and income-limit eligibility</h2>
      <p>
        USDA guaranteed loans can be zero down, but only after two gates: the property address is on the current USDA
        map, and household income is under the current area limit. A suburb that &ldquo;feels rural&rdquo; is not a
        map result. Source: {USDA_SNAPSHOT.source}.
      </p>
      <h3>Step 1: map the address</h3>
      <p>{USDA_SNAPSHOT.mapNote}</p>
      <p>
        Use the official tool:{" "}
        <a href={USDA_SNAPSHOT.mapToolUrl} rel="noopener noreferrer" target="_blank">
          USDA eligibility map
        </a>
        . Run the exact property, not the city name. Infill on the Wasatch Front is often ineligible even when a
        neighboring pocket is eligible.
      </p>
      <h3>Step 2: test household income</h3>
      <p>{USDA_SNAPSHOT.incomeNote}</p>
      <p>
        This page does not publish an AMI dollar figure. Those numbers change and differ by county and household size.
        If household income is over the limit, FHA or conventional is the usual next comparison, not a USDA exception.
      </p>
      <h3>Other USDA gates that still apply</h3>
      <ul>
        <li>{USDA_SNAPSHOT.occupancy}</li>
        <li>{USDA_SNAPSHOT.creditNote}</li>
        <li>The guarantee fee snapshot is in the mortgage insurance section above.</li>
      </ul>
      <p>
        Map the address, then talk with a loan officer before you write a USDA offer. Program page:{" "}
        <Link href="/loans/usda">USDA loans in Utah</Link>. If the map fails, FHA is often the fallback for a low down
        payment.
      </p>

      <h2>How an FHA loan assumption works</h2>
      <p>
        When existing loans carry rates below what is available on a new loan, assuming one starts to look attractive.
        An FHA assumption is a real path, not a loophole, and it has a specific cost structure that decides whether it
        helps your file. {LOAN_ASSUMPTION.notAPromise}
      </p>
      <p>{LOAN_ASSUMPTION.whatItIs}</p>
      <p>{LOAN_ASSUMPTION.whichLoansTypical}</p>
      <h3>Who can assume an FHA loan</h3>
      <p>{LOAN_ASSUMPTION.creditStillApplies}</p>
      <p>
        {LOAN_ASSUMPTION.occupancy} Credit standards on an assumption come from a servicer creditworthiness review
        against FHA's requirements plus the servicer's own, not from the purchase down-payment table above. An assuming
        buyer makes no down payment, so a minimum-score-and-down-payment figure from a purchase page does not transfer
        to this conversation.
      </p>
      <h3>The step-by-step process</h3>
      <StepList
        steps={[
          {
            title: "Confirm the loan is actually assumable",
            body: "Ask the seller for the servicer's name and the note. Whether the loan may be assumed is set by the note and the program, not by what the listing says.",
          },
          {
            title: "Contact the servicer's assumption department",
            body: "This is a separate process from a normal origination, with its own packet and its own queue. Ask what they require and how long it typically takes.",
          },
          {
            title: "Work out how you will cover the equity gap",
            body: "Price minus the remaining balance is yours to cover, in cash or through other financing. Settle this before you write an offer, not after.",
          },
          {
            title: "Submit the application and documents",
            body: (
              <>
                Expect an income, credit, and debt review to program standards, the same stack described in{" "}
                <Link href="/blog/how-underwriters-verify-income">how underwriters verify income</Link>.
              </>
            ),
          },
          {
            title: "Get the release of liability in writing",
            body: LOAN_ASSUMPTION.releaseOfLiability,
          },
        ]}
      />
      <h3>What it costs: the equity gap</h3>
      <p>{LOAN_ASSUMPTION.theEquityGap}</p>
      <p>
        Illustration: on a ${price} purchase where the seller owes ${assumedBalance}, the buyer covers roughly $
        {equityGap} to assume, before closing costs. That is the number that decides whether an assumption is
        available to you, and it has nothing to do with how good the rate is. {EXAMPLE_NOTE}
      </p>
      <p>{LOAN_ASSUMPTION.mipContinues}</p>
      <ProsCons
        prosHeading="An assumption can help when"
        consHeading="A new loan is usually simpler when"
        pros={[
          "The existing rate is meaningfully below what a new loan would carry, and you will hold the loan long enough for that to matter.",
          "You have the cash to cover the equity gap without straining reserves.",
          "You will occupy the property, so the FHA occupancy rule is not a problem.",
        ]}
        cons={[
          "The equity gap is larger than the cash you have, which is the usual reason assumptions fall apart.",
          "You need to close on a predictable timeline; servicer assumption queues are not an origination pipeline.",
          "You want the loan structured around your file: term, mortgage insurance, and product are fixed on an assumption.",
        ]}
      />
      <ArticleCallout variant="pitfall" title="A low rate is not a low cash requirement">
        The headline on an assumption is always the rate. The number that decides whether you can do it is the gap
        between price and balance. A well-seasoned loan with an attractive rate is often the one with the largest gap,
        because the seller has paid the balance down and the property has appreciated.
      </ArticleCallout>
      <ArticleCallout variant="warning" title="Sellers: liability does not transfer by itself">
        {LOAN_ASSUMPTION.releaseOfLiability} On a VA loan there is a second step as well, entitlement:{" "}
        <Link href="/blog/va-loan-assumption-entitlement">VA loan assumption and entitlement</Link>.
      </ArticleCallout>
      <p>
        Get the servicer's assumption packet and the remaining balance in writing, then price a normal FHA or
        conventional file next to it. An assumption is worth pursuing when the cash works, not because the rate looks
        good. {LOAN_ASSUMPTION.timing}
      </p>

      <h2>Which should you compare first?</h2>
      <ul>
        <li>
          <strong>Ask about FHA when:</strong> conventional overlays look tight on score or down payment, you need
          HUD's more flexible DTI policy with compensating factors, or the property is a duplex you will occupy.
        </li>
        <li>
          <strong>Ask about conventional when:</strong> you can document a stronger credit profile, more down payment,
          or you care about PMI that can come off with equity. Condos that are not on HUD's roster often end up here.
        </li>
        <li>
          <strong>Ask about USDA when:</strong> the exact address passes the map and household income is under the
          area limit. If either gate fails, there is no USDA exception to ask for.
        </li>
        <li>
          <strong>Ask about an assumption when:</strong> the seller's FHA loan carries a lower rate than a new loan and
          you have the cash for the equity gap.
        </li>
        <li>
          <strong>Run the scenarios:</strong> Get Loan Estimates for each program that fits and compare the total
          monthly payment including insurance over a 5 to 7 year horizon. That comparison is not a credit decision.
        </li>
      </ul>

      <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href="/loans/fha">Explore Utah FHA Loans</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/loans/conventional">Conventional Loan Options</Link>
        </Button>
      </div>

      <p>
        Ondo RE offers <Link href="/loans/fha">FHA</Link>, <Link href="/loans/conventional">conventional</Link> and{" "}
        <Link href="/loans/usda">USDA</Link> loan programs for Utah home buyers. Use our{" "}
        <Link href="/calculators">mortgage calculator</Link> to compare total monthly payments side by side, or{" "}
        <Link href="/contact">schedule a consultation</Link> with our lending team about your file. That is not a
        personalized recommendation generated by this page.
      </p>

      <IsThisRightForMe table="purchase" programs={["fha", "conventional", "usda"]} highlight="fha" />
    </ArticleShell>
  )
}
