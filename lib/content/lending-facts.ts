/**
 * Stale-prone lending figures live here so pages do not hard-code them.
 * These are educational snapshots, not quotes. Confirm against the
 * published VA, FHA, FHFA, and investor overlays before advising a borrower.
 */

export const LENDING_FACTS_AS_OF = "2026-08"

export const LENDING_FACTS_VERIFY =
  "Program rules, fees, and county loan limits change. Confirm the current published schedule and lender overlays. Nothing here is a quote, a lock, or a credit decision."

export const VA_FUNDING_FEE = {
  asOf: LENDING_FACTS_AS_OF,
  source: "VA funding fee schedule (confirm on va.gov before quoting)",
  firstUseLessThan5PercentDown: "2.15%",
  subsequentUseLessThan5PercentDown: "3.30%",
  firstUse5ToLessThan10PercentDown: "1.50%",
  firstUse10PercentOrMoreDown: "1.25%",
  exemptionNote:
    "The funding fee is typically waived for veterans with a qualifying service-connected disability rating and for some surviving spouses. Entitlement and occupancy rules also apply.",
  downPaymentNote:
    "Zero down is available only with remaining entitlement and when the loan otherwise meets VA and lender guidelines. It is not automatic for every veteran.",
} as const

export const FHA_SNAPSHOT = {
  asOf: LENDING_FACTS_AS_OF,
  source: "FHA / HUD published MIP and credit policy (confirm current HUD handbook and lender overlays)",
  minDownPayment580Plus: "3.5%",
  minDownPayment500To579: "10%",
  scoreNote:
    "HUD allows 580+ for 3.5% down and 500–579 with 10% down. Many lenders set higher overlays. A 500 score is not a promise that a file will be originated.",
  upfrontMip: "1.75% of the base loan amount (often financed)",
  annualMipNote:
    "Annual MIP is a range that depends on term, loan amount, and LTV. It is not a single published percent for every file.",
  occupancy: "Primary residence (with limited exceptions)",
  giftFunds:
    "Gift funds from an eligible donor can often cover the full down payment when documented correctly. Lenders still need a sourced paper trail; that is not the same as “no seasoning required.”",
  dtiNote:
    "HUD allows higher backend DTI than many conventional files when compensating factors exist. A published maximum is not a promise that a high-DTI file will close.",
} as const

export const CONVENTIONAL_SNAPSHOT = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Fannie Mae / Freddie Mac selling guides plus typical lender overlays",
  typicalMinimumScore: "620 (overlays often higher)",
  lowDownOptions: "Some first-time and low-down conventional products start around 3% down for eligible borrowers.",
  pmiRemoval:
    "Conventional PMI can usually be removed once the loan reaches the investor’s equity threshold (commonly 20% based on original value, or by a new appraisal under the program rules).",
  dtiNote:
    "Many files target at or below about 45% backend DTI. Higher DTI is sometimes possible with strong compensating factors. It is not a ceiling you can assume.",
  giftFunds:
    "Gift funds are often allowed when the donor is eligible and the paper trail is complete. Program overlays still apply.",
} as const

export const CONFORMING_LIMIT_NOTE =
  "FHFA publishes conforming loan limits each year by county. Utah counties differ (for example Salt Lake vs Summit). Look up the current-year FHFA table for the property county. Do not treat a number on a marketing page as the limit that will apply to your file."

export const FHA_COUNTY_LIMIT_NOTE =
  "FHA county loan limits are published annually by HUD and differ from FHFA conforming limits. Look up the current HUD table for the property county. Do not treat a number on a marketing page as the limit that will apply to your file."

export const DTI_EDUCATION = {
  asOf: LENDING_FACTS_AS_OF,
  frontendNote: "Front-end DTI is housing payment (PITI plus HOA if applicable) divided by gross monthly income.",
  backendNote: "Back-end DTI is all counted monthly debts divided by gross monthly income.",
  variableIncomeNote:
    "When income is overtime, bonus, commission, or 1099, underwriters typically average a documented history (often 12–24 months) rather than using the highest recent month.",
} as const

export const DTI_HOA = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Agency DTI definitions (PITI plus applicable HOA) plus typical condo overlays",
  frontEnd:
    "HOA dues that are required for the subject property are housing expense. They sit in front-end DTI with principal, interest, taxes, and insurance — not in the “other debts” box of an affordability toy.",
  backEnd:
    "Back-end DTI still includes that housing payment plus counted installment, revolving, and other debts. A condo with a modest PITI and a large HOA can fail DTI even when the note payment looks comfortable.",
  specialAssessment:
    "A special assessment or pending litigation at the project is a property-eligibility question as well as a payment question. It is not the same line as regular HOA dues.",
  notPmi:
    "HOA is not mortgage insurance. PMI/MIP can change with LTV or program. HOA is set by the association and can rise after you close.",
} as const

export const EXAMPLE_PURCHASE_PRICE_UTAH = 450_000
export const EXAMPLE_NOTE =
  "Dollar figures on education pages are worked examples for illustration. They are not your payment, cash to close, or an offer of credit."

export const FHFA_LOOKUP = {
  asOf: LENDING_FACTS_AS_OF,
  officialUrl: "https://www.fhfa.gov/data/conforming-loan-limit",
  hudFhaLimitsUrl: "https://www.hud.gov/program_offices/housing/sfh/lender/origination/mortgagelimits",
  howTo:
    "Look up the property county on FHFA’s current-year conforming loan limit table. High-cost counties can have a higher ceiling than the baseline. A loan above that county’s limit is jumbo for conventional conforming purposes. FHA uses a different HUD table.",
  utahNote:
    "Utah counties are not identical. Summit County (Park City / Snyderville Basin) has historically been treated as high-cost relative to Salt Lake, Utah, and Davis counties. Always use this year’s table for the property county, not last year’s blog post.",
} as const

export const USDA_SNAPSHOT = {
  asOf: LENDING_FACTS_AS_OF,
  source: "USDA Rural Development guaranteed SFH program (confirm current RD handbook and eligibility tools)",
  mapToolUrl: "https://eligibility.sc.egov.usda.gov/eligibility/welcomeAction.do",
  mapNote:
    "Eligibility is address-specific. A nearby city name is not enough. Run the property address on USDA’s published map tool before you write an offer as if USDA is available.",
  incomeNote:
    "Household income, not just the borrowers on the note, is tested against the current area limit and household size. Look it up on USDA’s published income tool. Do not use a marketing-page AMI figure.",
  occupancy: "Primary residence. Investment property is not eligible.",
  upfrontGuaranteeFee: "1.00% of the loan amount (often financed)",
  annualFee: "0.35% of remaining principal (annualized; confirm current RD fee notice)",
  feeNote:
    "USDA publishes an upfront guarantee fee and an annual fee. The percents in this module are a dated snapshot, not a quote. Confirm the current RD fee notice before anyone prices a file.",
  creditNote:
    "Automated GUS findings and lender overlays often sit near the mid-600s. That is not a published floor that guarantees an approval.",
} as const

export const VA_ENTITLEMENT = {
  asOf: LENDING_FACTS_AS_OF,
  source: "VA Lender's Handbook (confirm current entitlement and occupancy rules on va.gov)",
  remainingEntitlement:
    "A veteran can sometimes use remaining entitlement while another VA loan is still outstanding. Occupancy of the new property, remaining guaranty, and the applicable county limit all still apply. It is not a second-home product by default.",
  restoration:
    "Entitlement is often restored when the prior VA loan is paid off and the property is disposed of under VA rules, or in limited one-time restoration cases. Ask before you assume you can keep both properties on VA financing.",
  occupancy:
    "VA purchase occupancy is a program rule, not a slogan. If you still occupy a home with a VA loan, a second VA purchase is a remaining-entitlement and occupancy conversation, not an automatic yes.",
} as const

export const VA_RESIDUAL_INCOME = {
  asOf: LENDING_FACTS_AS_OF,
  source: "VA residual income tables in the VA Lender's Handbook (confirm current region and family-size table)",
  method:
    "Residual income is cash left after the proposed PITI, counted debts, and estimated maintenance and utilities. It is a separate test from DTI. A DTI that “looks fine” can still fail residual, and a higher DTI can still pass when residual is strong.",
  utahRegionNote:
    "Utah files typically use the West region residual table. Family size and loan amount change the required residual. Confirm the current published table; do not memorize a dollar figure from a blog post.",
} as const

export const SELF_EMPLOYED_HISTORY = {
  asOf: LENDING_FACTS_AS_OF,
  twoYearTypical:
    "Agency (Fannie Mae, Freddie Mac, and many FHA) files typically want two years of self-employment in the same line of work, documented with tax returns and transcripts.",
  oneYearOverlay:
    "Some lender overlays allow a shorter history when the borrower has a documented track record in the same occupation as a W-2 employee, a complete year of returns, year-to-date profit and loss, and strong compensating factors. That is an overlay, not a published right.",
} as const

export const VARIABLE_INCOME_LIKELY_TO_CONTINUE = {
  asOf: LENDING_FACTS_AS_OF,
  overtime:
    "Overtime, bonus, and commission are often averaged over 12 or 24 months and included only when the history supports that they are likely to continue. A paystub spike without a matching W-2 history is frequently limited or excluded.",
  commissionDownYear:
    "A down year is usually averaged in, not ignored. A declining trend can reduce the qualifying average even if the most recent month recovered.",
} as const

export const K1_INCOME = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Fannie Mae / Freddie Mac self-employment and K-1 income guides plus typical lender overlays",
  typical:
    "Partnership, LLC, and S-corporation income is usually taken from the K-1 and matching returns, not from distributions alone. Two years of K-1s in the same business is a common agency ask. Guaranteed payments, ordinary business income, and W-2 wages from the same entity are different lines and are not interchangeable.",
  declining:
    "A declining K-1 trend is typically averaged in or limited. One strong year after a weak year does not replace a two-year average.",
  liquidity:
    "Ownership percentage, access to income, and whether the business can support the withdrawal still matter. Income on a K-1 that the borrower cannot actually take is often limited or excluded.",
} as const

export const SCHEDULE_E_RENTAL = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Agency rental-income calculation on Schedule E (confirm current selling guide and lender overlays)",
  method:
    "Rental income already on the borrower’s tax returns is usually taken from Schedule E, often with depreciation added back, then averaged. PITI, HOA, and vacancy on those rentals still sit in the file.",
  history:
    "Many agency files want a history of receipt (often 12–24 months) or a lease plus tax-return support. A listing screenshot or a ‘it will rent for’ note is not Schedule E.",
  subjectProperty:
    "Proposed rent on a property you do not yet own is a different calculation from history on properties you already own. Occupancy (you will live there vs it is a rental) changes which rules apply.",
} as const

export const JUST_WENT_1099 = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Agency self-employment history plus typical one-year overlays",
  seasoning:
    "Income from work you started as 1099 last month is usually not yet a qualifying average. Agency files typically want a history in the same line of work. Remaining W-2 wages can still count. A brand-new 1099 invoice does not.",
  sameOccupation:
    "A documented W-2 career in the same occupation can support a shorter-history overlay conversation. It does not turn last month’s first invoice into two years of 1099s. See two-year vs one-year overlays.",
} as const

export const PARENT_GIFTING = {
  asOf: LENDING_FACTS_AS_OF,
  source: "FHA, Fannie Mae, and VA gift-fund documentation plus occupancy / title overlays",
  occupancy:
    "A parent who only gifts is not on the note and usually should not go on title if occupancy is the child’s primary residence. A parent who will occupy or co-borrow is a different file: co-borrower vs gift, occupancy, and who signs the purchase contract and deed.",
  signatures:
    "Typical gift signatures: a gift letter (amount, relationship, no repayment), evidence the donor had the funds, and evidence they moved. The parent generally does not sign the mortgage unless they are also a borrower. Title vesting is separate from the gift letter.",
} as const

export const STUDENT_LOAN_DTI = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "Fannie Mae Selling Guide B3-6-05 (student loans), Freddie Mac, HUD 4000.1, and VA Lender's Handbook — confirm the guide in force for the product",
  creditReportPayment:
    "If a monthly student loan payment greater than $0 appears on the credit report, many files use that amount unless documentation shows a different current payment.",
  fannieZero:
    "Fannie Mae: if the credit report shows $0 or no payment, the lender must calculate a qualifying payment. A documented income-driven repayment of $0 can be used when verified from the servicer. Deferred or forbearance loans can be calculated at 1% of the outstanding balance or a fully amortizing payment from documented terms.",
  freddieFha:
    "Freddie Mac and FHA typically calculate a payment from the outstanding balance (commonly 0.5%) when the reported payment is $0, deferred, or not amortizing. A credit-report $0 is not automatically a $0 DTI line.",
  saveNote:
    "Federal IDR plans, including SAVE, have been in legal and servicing flux. A SAVE or forbearance $0 on a student-aid dashboard is not the same as a documented IDR payment an investor will accept. Confirm current repayment status with the servicer and the investor calculation — not a 2024 blog post.",
  vaNote:
    "VA uses its own student-loan treatment (often a percentage of balance when no payment is reporting). Do not import a conventional percent onto a VA file. Confirm the current VA Lender's Handbook. This page does not quote residual-income dollars.",
} as const

export const ARM_CAPS = {
  asOf: LENDING_FACTS_AS_OF,
  source: "ARM note structure (index, margin, caps). Not a rate quote.",
  notation:
    "Caps are often written as initial / periodic / lifetime, for example 2/1/5. Those numbers are percentage-point limits on how far the note rate can move, not a promise of what it will do.",
  initial: "The initial adjustment cap limits the first rate change after the fixed period.",
  periodic: "The periodic cap limits later adjustments (often each year after the first change).",
  lifetime: "The lifetime cap is the maximum the rate can rise above the start rate over the life of the loan.",
  fullyIndexed:
    "After the fixed period, the rate is typically index plus margin, then limited by the caps. Many current ARMs use a SOFR-based index. This page does not quote a current ARM start rate.",
  paymentNote:
    "A cap on the rate is not a cap on taxes, insurance, or HOA. The full payment can still rise when those change.",
} as const

export const FHA_CONDO_ROSTER = {
  asOf: LENDING_FACTS_AS_OF,
  source: "HUD Handbook 4000.1 condominium project approval and single-unit approval (confirm current HUD tools)",
  rosterUrl: "https://entp.hud.gov/idapp/html/condlook.cfm",
  projectApproval:
    "An FHA purchase of a condo unit usually needs the project to appear as currently approved on HUD’s condominium list, or to qualify for single-unit approval. An expired, rejected, or withdrawn project is not the same as approved.",
  singleUnit:
    "Single-unit approval (sometimes called spot approval) is a lender-submitted path for one unit when the project is not currently approved. The project still has to meet HUD’s published tests. It is not a promise that any condo can be forced onto FHA.",
  recertification:
    "Project approvals expire and must be recertified. Look up the project on HUD’s current list before you write an FHA offer as if the building is eligible.",
} as const

export const MORTGAGE_INSURANCE_EXIT = {
  asOf: LENDING_FACTS_AS_OF,
  source: "HUD MIP duration (case numbers on or after June 3, 2013) and Homeowners Protection Act PMI cancellation — confirm current rules and your note",
  fhaPost2013:
    "For FHA case numbers assigned on or after June 3, 2013, annual MIP generally lasts 11 years when original LTV is 90% or less (10% or more down), or for the remaining loan term (up to 30 years) when original LTV is above 90%. Later equity from payments or appreciation does not cancel annual MIP the way conventional PMI often can.",
  conventionalHpa:
    "Borrower-paid conventional PMI can often be requested off at 80% of original value and is typically automatically terminated at 78% of original value under the Homeowners Protection Act, if the loan is current. Lender-paid PMI and some investor products differ.",
  notWaitFor20:
    "This page is about how mortgage insurance already on a loan ends. It is not the purchase question of whether to wait until you can put 20% down.",
  notAppraisalPmi:
    "Canceling conventional PMI with a new appraisal based on current value is a separate investor conversation from automatic HPA termination on original value.",
} as const

export const WAIT_FOR_20_DOWN = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Conventional PMI vs FHA MIP duration, plus cash-to-close vs rent-while-saving — not a rate quote",
  tradeoff:
    "Waiting until you can put 20% down can avoid conventional PMI. It also delays the purchase: you keep paying rent (or staying put), and the price and insurance lines can move while you save. Buying sooner with PMI is a cash-and-timeline trade, not a moral failing.",
  lowDownExists:
    "Some conventional products start around 3% down for eligible borrowers. FHA can start around 3.5% down under HUD policy (overlays often sit higher). Neither is a promise that a file will close, and neither is “the best” down-payment number.",
  pmiIsTemporaryOften:
    "On many conventional loans, borrower-paid PMI can later come off with equity (original-value HPA path or, separately, a current-value appraisal path). That is different from FHA annual MIP, which is timed from original LTV and often does not drop off just because the house appraised higher.",
  notMipExit:
    "This page is the purchase question: wait for 20% vs buy sooner. It is not how MIP vs PMI already on a loan ends, and it is not the servicer mechanics of PMI cancellation.",
} as const

export const PMI_REMOVAL = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Homeowners Protection Act (original value) plus typical investor/servicer current-value cancellation — confirm the note and servicer",
  originalValue:
    "For many borrower-paid conventional loans, you can request PMI cancellation at 80% of the original property value and the servicer typically must terminate automatically at 78% of original value if the loan is current. Those tests use original value and scheduled amortization — not today’s Zillow number.",
  newAppraisal:
    "A cancellation based on a new appraisal of current value is an investor/servicer path, not the HPA original-value clock. It usually needs seasoning, a current LTV test that can be tighter than 80% of original value, and a paid appraisal. It can be declined. It is not available on every product (lender-paid PMI is a common exception).",
  notWaitFor20:
    "This page is how PMI already on a conventional loan can come off. It is not whether a first-time buyer should wait until they can put 20% down.",
  notFhaMip:
    "FHA annual MIP does not cancel the same way. Post-2013 MIP duration is timed from original LTV. A higher current value does not usually turn off annual MIP; refinancing out of FHA is the usual early exit conversation.",
} as const

export const DISCOUNT_POINTS = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Loan Estimate line for discount points (prepaid interest). Not a quote and not a recommendation to buy points.",
  definition:
    "One discount point is typically 1% of the loan amount paid at closing to lower the note rate for the life of that loan (or until you refinance or sell). It is prepaid interest, not a fee that “gets you approved.”",
  breakeven:
    "Break-even months ≈ point cost ÷ the monthly principal-and-interest savings versus the same loan with fewer or no points. If you sell, refinance, or recast before that month, the points can lose. Origination and lender credits are a different LE line — do not mix them into “points” casually.",
  notTempBuydown:
    "Discount points change the note rate for the whole term. A temporary buydown (2-1 / 3-2-1) only subsidizes the payment for the first years; the note rate is still the note rate. Those are different products.",
  notBestRate:
    "Buying points is not how you get “the best rate.” Pricing is file-specific. Compare two Loan Estimates with the same lock period, not a blog’s favorite point strategy.",
} as const

export const TEMPORARY_BUYDOWN = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Temporary buydown structures on purchase Loan Estimates (2-1, 3-2-1, flat). Not a rate quote.",
  twoOne:
    "A 2-1 buydown typically means year 1 is about 2 percentage points below the note rate, year 2 about 1 point below, then the full note payment. The note rate does not change; a subsidy account covers the difference.",
  threeTwoOne:
    "A 3-2-1 buydown typically tapers over three years (about 3, then 2, then 1 point below the note) before the full note payment. Year 4 is not a surprise rate hike on the note — it is the payment you already agreed to.",
  whoPays:
    "The subsidy can be funded by a seller, a builder, the borrower, or sometimes a lender credit. Who pays is a contract and LE question, not a slogan. A “free” buydown is often in the price or in other credits.",
  yearThree:
    "When the subsidy ends, you pay the full note payment plus taxes, insurance, and HOA. Plan for that payment, not only year-one principal and interest. If you expect to refinance before then, still run break-even after costs — a buydown is not a free refinance option.",
  notDiscountPoints:
    "This is not buying discount points. Points lower the note for the life of the loan. A temporary buydown is a payment subsidy with an end date.",
} as const

export const NEW_DEBT_UNDERWRITING = {
  asOf: LENDING_FACTS_AS_OF,
  source: "AUS and final underwrite re-pull credit; new installment debt changes DTI",
  autoLoan:
    "A new auto loan during processing or underwriting usually appears on a credit refresh. The monthly payment is counted in back-end DTI. Findings that were eligible can come back ineligible. That is a common reason a pre-approval letter does not match the clear-to-close.",
  otherDebt:
    "Financed furniture, a new credit card with a balance, or co-signing has the same shape: new debt, new DTI, sometimes a new AUS run. “I can pay it off at closing” is not the same as the debt already being gone on the report.",
  whatToDo:
    "Ask before you sign a new installment. If you already signed, tell the loan officer immediately so the file can be re-run rather than failing a last-minute condition. This page is not advice to buy or not buy a car.",
} as const

export const PREAPPROVAL_STAGES = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Typical purchase file stages (letter → AUS findings → underwriter CTC). Not a timeline promise.",
  preApproval:
    "A pre-approval letter is a snapshot after a credit pull and a review of the documents you sent then. It is for shopping and offers. It is not a commitment to lend, not a lock, and not a property approval.",
  aus:
    "AUS (automated underwriting system) findings — commonly Fannie Mae Desktop Underwriter or Freddie Mac Loan Product Advisor — are an eligibility engine result for a specific program, LTV, and credit file. Approve/Eligible (or the Freddie equivalent) is not CTC. Ineligible findings are not a lifetime ban.",
  ctc:
    "Clear to close means the underwriter has signed off that conditions are satisfied for this property and this file as of that date. Title, insurance binder, and a final CD still have to match. CTC is not a promise that the market or your job cannot change before funding.",
  notTheSame:
    "Pre-approval, AUS findings, and CTC are three different documents. Do not treat a letter as findings, or findings as CTC.",
} as const

export const SPOUSE_INCOME_OFFSET = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Agency joint-application vs non-borrowing spouse treatment. Utah is not a community-property state.",
  jointApplication:
    "If both people apply, both incomes can be in the qualifying average and both credit files and counted debts are in the DTI. A W-2 that is steadier than a 1099 can support the file when both applicants are borrowers. That is a joint application, not a hidden extra paycheck.",
  nonBorrowing:
    "A spouse who is not on the note is usually not a source of qualifying income. Their W-2 does not automatically “offset” 1099 volatility on the borrower’s file. Adding them as a co-borrower is a credit, occupancy, and title decision — not a paperwork trick.",
  utahNotCommunityProperty:
    "Utah is not a community-property state. Community-property income and debt rules that apply in some other licensed states are not Utah’s default. This site does not publish doorway pages that swap Utah copy onto Texas or Arizona homestead or community-property law.",
  fairHousing:
    "Marital status is not a credit score. These pages describe how income and applications are documented. They do not prefer married applicants, require a spouse, or treat unmarried co-borrowers as a different class of people. Anyone who applies is underwritten on the file.",
} as const

export const QUALIFY_CONVERSATION = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Typical first mortgage conversation and application fields. Not an application form and not a credit decision.",
  asked:
    "Expect questions about occupancy (primary, second home, or investment), income type (W-2, 1099, K-1, bank-statement), monthly debts, assets and large deposits, gift funds, property type if known, and authorization to pull credit when you are ready. Identity and contact information are required to continue.",
  notPromised:
    "A conversation does not approve you, lock a rate, quote APR, or promise that a program will fit. Pre-approval, if issued later, is still not a commitment to lend. Calculators on this site are illustrations.",
  notNeededFirstCall:
    "You do not need a complete tax-return stack on the first call. You will need a documented stack before an underwriter can issue findings. Do not move large cash or open new credit while you wait without asking how it must be sourced.",
} as const

export const NON_QM = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Non-QM investor overlays (bank-statement, DSCR, asset-depletion). Not agency selling guides and not a quote.",
  what:
    "Non-QM means the loan is not a Qualified Mortgage under CFPB ability-to-repay rules in the same way agency QM loans are. Pricing, prepayment, reserves, and documentation differ. It is a product family, not a single form.",
  bankStatement:
    "Bank-statement programs underwrite from deposits (often 12 or 24 months), typically when tax returns undercount cash flow after write-offs. They still have credit, assets, and property rules. They are not pre-2008 stated income.",
  dscr:
    "DSCR (debt-service coverage) programs typically qualify on the property’s rent versus the proposed payment, not on the borrower’s personal DTI. Occupancy is usually investment. Personal income can still be in the file for other tests.",
  assetDepletion:
    "Asset-depletion / asset-based qualifying treats eligible liquid assets as a source of qualifying income under a written formula (not “you have cash, so you are approved”). Overlays on which accounts count, seasoning, and haircuts apply. This is not a jumbo conventional shortcut you can assume.",
  notAgency:
    "If an agency (Fannie, Freddie, FHA, VA, USDA) file can be documented, that path is usually cheaper and more standard. Non-QM is a conversation when agency income calc does not match documentable cash flow or when the property is an investment that the agency stack will not buy.",
} as const

export const STREAMLINE_REFI = {
  asOf: LENDING_FACTS_AS_OF,
  source: "FHA Streamline refinance and VA IRRRL (confirm current HUD 4000.1 and VA Lender's Handbook)",
  fha:
    "An FHA Streamline (FHA-to-FHA) can reduce documentation versus a full credit-qualifying refinance. Occupancy, a net-tangible-benefit test, payment history, and whether the new loan is credit-qualifying or non-credit-qualifying still matter. It is not a no-docs product.",
  va:
    "VA IRRRL (Interest Rate Reduction Refinance Loan) is VA’s streamline. Reduced documentation still usually includes occupancy certification, a recoupment or net-benefit test, and whatever credit report the lender overlay requires. Residual income is not always re-run the same way as a cash-out, but overlays apply. This page does not quote residual dollars.",
  stillRequires:
    "Title work, a new note, and often an appraisal waiver rather than ‘no closing.’ Cash-out is generally not a streamline. Recent late payments usually knock the file off the reduced-doc path.",
} as const

export const LARGE_DEPOSITS = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Agency asset documentation (typically two months of statements) plus typical large-deposit overlays",
  window:
    "Purchase files typically include about 60 days of asset statements. Large deposits in that window have to be sourced and seasoned, or explained with paper.",
  conventionalThreshold:
    "On many conventional files, a large deposit is a single deposit exceeding about 50% of total monthly qualifying income. Overlays can be tighter. Gifts, sale of an asset, tax refunds, and transfers between the borrower’s own accounts are common explanations when documented.",
  cash:
    "Repeated cash deposits and undocumented wires are a common condition fail. Do not park cash from a parent without a gift letter and a donor trail.",
} as const

export const UTAH_CLOSING_NOTES = {
  asOf: LENDING_FACTS_AS_OF,
  closingVenue:
    "Utah residential closings typically fund at a title company, not through a real-estate attorney as in attorney-closing states.",
  instrument:
    "Most Utah purchase loans are secured by a deed of trust recorded with the county, not a mortgage instrument.",
  transferTax:
    "Utah does not levy a statewide real estate transfer tax. County recording fees still apply and differ by county.",
  titleVaries:
    "Owner’s and lender’s title premiums and escrow/closing fees vary by title company even inside the same county. Treat any range as a range.",
  taxCalendar:
    "Utah property tax billing is county-specific. The first escrow analysis can surprise buyers because the tax year and the mortgage escrow year do not line up the same way in every county.",
  rangeNote:
    "Origination can appear as a fee or as a lender credit. Title and escrow on a typical Wasatch Front purchase are often a few thousand dollars combined, not a single statewide tariff. Prepaids (taxes, insurance, prepaid interest) often dwarf origination. Confirm on a Loan Estimate.",
} as const

export const DSCR_VS_FULL_DOC = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Non-QM DSCR overlays vs agency investment-property income calc (Schedule E / proposed rent). Not a quote.",
  dscr:
    "A DSCR (debt-service coverage) file typically qualifies on the property’s rent versus the proposed PITIA, not on the borrower’s personal DTI. Occupancy is usually investment. Personal tax returns can still be in the file for identity, assets, or other tests — they are not the qualifying income engine.",
  fullDoc:
    "A full-doc rental purchase usually underwrites the borrower: W-2 / returns, DTI, and rental income from Schedule E (properties already owned) or a tighter proposed-rent worksheet (the house in this purchase). Pricing is often closer to agency investment overlays when the file fits — it is not automatically cheaper, and it is not DSCR.",
  occupancy:
    "Calling a rental a second home or a primary to get a cheaper occupancy price is occupancy misrepresentation. Occupancy has to match how you will actually use the property. See second home vs investment occupancy.",
  notAQuote:
    "DSCR ratios, reserve months, and prepayment terms are investor overlays. A calculator illustration is not an approval, a lock, or “the best rate.”",
} as const

export const BUSINESS_PERSONAL_COMINGLING = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Agency asset documentation plus typical bank-statement / self-employed overlays",
  problem:
    "Business deposits in a personal account, or personal spending from a business account, make it hard to source assets and to average deposits. Underwriters cannot tell what is income, what is a transfer, and what is a one-off. That stall is common on 1099, K-1, and bank-statement files.",
  seasoning:
    "Purchase files typically include about 60 days of statements. Co-mingled large deposits in that window still have to be sourced. Moving money between business and personal the week of application without a paper trail is a frequent condition fail — not a seasoning trick.",
  bankStatement:
    "Bank-statement programs that qualify from deposits usually want a business account (or a clearly labeled business pattern). A personal account stuffed with business wires, cash, and transfers is often unusable or heavily haircut. Co-mingling is not a substitute for two years of returns, and it is not a shortcut around a brand-new 1099 job.",
} as const

export const UTAH_REPC = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "Utah Real Estate Commission / Office of the Attorney General Real Estate Purchase Contract (form effective December 4, 2024). Confirm the form actually signed; parties may alter it. Not legal advice.",
  timeOfEssence:
    "Time is of the essence. Unless the contract says otherwise, performance that references a date is required by 5:00 p.m. Mountain Time on that date. “Days” are calendar days, counted beginning the day after the triggering event (for example, Acceptance).",
  fourDeadlines:
    "Section 24 typically lists four contract deadlines: Seller Disclosure, Due Diligence, Financing & Appraisal, and Settlement. They are independent. Waiving due diligence does not waive financing and appraisal.",
  dueDiligence:
    "If the Due Diligence Condition is checked, the buyer may cancel in writing by the Due Diligence Deadline if the results are unacceptable in the buyer’s sole discretion, and earnest money is typically released to the buyer. Missing that written notice generally waives the due-diligence condition.",
  financingAppraisal:
    "Appraisal and financing are separate conditions that share a Financing & Appraisal Deadline. An appraisal cancel typically needs a written notice of appraised value below price. A financing cancel before that deadline is available if the buyer is not satisfied with loan terms — and the form often releases a filled-in portion of earnest money to the seller. After that deadline, if loan proceeds are not delivered as the contract requires, cancellation can send the remaining earnest money to the seller as liquidated damages.",
  lenderNotAParty:
    "The REPC says performance dates are not binding on lenders, title companies, or appraisers who are not parties, except as they separately agree. A pre-approval letter, AUS findings, or a hoped-for clear-to-close is not a REPC deadline. Written notice under the contract is what preserves a cancel right.",
  notLegalAdvice:
    "This is education about how a Utah purchase-contract deadline interacts with a loan file. It is not legal advice, not a review of your addenda, and not a promise that earnest money will be refunded. Read the form you signed with your agent; ask a Utah real-estate attorney about disputes.",
} as const

export const OCCUPANCY_TYPES = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Uniform Residential Loan Application occupancy plus agency occupancy overlays. Not a how-to for misrepresentation.",
  primary:
    "Primary residence means you intend to occupy the property as your principal home (FHA, VA, and USDA purchase occupancy is this category, with limited exceptions).",
  secondHome:
    "A second home is typically for the borrower’s exclusive use for some portion of the year — a vacation or seasonal home, not a unit you treat as a rental business. Exclusive-use and occupancy overlays apply. It is not “investment occupancy with a cheaper label.”",
  investment:
    "Investment occupancy means you will not occupy the property as a primary or second home. Pricing, down payment, and documentation are different. Renting it is the point of the occupancy type.",
  fraud:
    "Stating the wrong occupancy to get a cheaper rate or a program that does not allow that use is occupancy fraud — a federal crime, not a paperwork preference. These pages do not coach anyone to “live there 14 days” or to list a rental as a second home.",
  fairHousing:
    "Occupancy is about how the applicant will use the property. It is not a statement about who should live in a neighborhood. Protected-class steering has no place on these pages.",
} as const

export const CASH_OUT_TO_RENTAL = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Conventional cash-out LTV overlays plus occupancy on the subject and on the next purchase. Not tax advice.",
  occupancyTrap:
    "Cash-out on a house you occupy as a primary is underwritten as owner-occupied cash-out. If you then buy a rental with the proceeds, that second loan is an investment purchase. Do not recast the first house as a rental occupancy after the fact without telling the lender — occupancy on each note has to match use.",
  ltvTrap:
    "Cash-out LTV is often tighter than rate-and-term (a common conventional overlay sits near 80% of value, not a statute). Investment purchase LTV on the rental is a separate overlay, often with more down payment than a primary. Two LTVs, two occupancy types.",
  vsHeloc:
    "A HELOC keeps the first lien and draws a second. A cash-out replaces the first lien and resets term and costs. Neither is “the best” way to fund a rental down payment. Run break-even on the refinance and DSCR or full-doc on the rental.",
} as const

export const MEDICAL_COLLECTIONS = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "Credit-bureau medical-collection reporting (2022–2023 industry changes), classic mortgage FICO models, and agency collection treatment. Confirm the tri-merge in force. Not a score promise.",
  bureauReporting:
    "Equifax, Experian, and TransUnion stated they would stop reporting paid medical collections (from July 2022) and unpaid medical collections under $500 (from 2023), with a longer waiting period before unpaid medical collections appear. Those are bureau reporting policies, not a federal guarantee that every medical bill is invisible.",
  mortgageScores:
    "Many mortgage tri-merge files still use classic FICO models (commonly Score 2, 4, and 5 by bureau) rather than the consumer FICO 8/9/10 app score. Newer models that ignore paid collections or de-emphasize medical collections are not automatically the score on your Loan Estimate. A GSE transition to other models has been discussed; confirm what your lender actually pulls.",
  underwriting:
    "Whether a remaining medical collection must be paid at closing is an investor and AUS question, separate from the score. Fannie Mae, Freddie Mac, FHA, and VA publish collection-payoff rules that can treat medical collections differently from other charge-offs. A paid collection that still sits on a classic mortgage score is not a promise that paying it will raise that score.",
  noPromise:
    "This page does not say medical collections “don’t matter,” that paying them will raise your score, or that a consumer-app score is the mortgage score. Dated snapshot only.",
} as const

export const ALTERNATIVE_CREDIT = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Fannie Mae Selling Guide B3-5.4 (nontraditional credit) and HUD 4000.1 non-traditional credit. Confirm the guide in force.",
  who:
    "Alternative / nontraditional credit is for people with no usable traditional score or a thin traditional file — rent, utilities, insurance, and similar documented payments — not for people who have traditional credit that is simply weak. Derogatory traditional credit is a different conversation from “I never used credit cards.”",
  fannie:
    "Fannie Mae: lenders first check all three repositories. When a borrower has no score, a documented nontraditional history is typically required (often including housing payments on DU files). References usually cover about the most recent 12 months. Overlays and DU messages still apply. This is not a published right to skip credit.",
  fha:
    "FHA: lack of a traditional credit history is not, by itself, a reason to reject. HUD describes a non-traditional credit path (often several 12-month references, commonly including housing). Lender overlays can still require a score. FHA is not “the credit product for a protected class.”",
  fairHousing:
    "Who gets which documentation path is about the credit file, not race, national origin, religion, sex, disability, familial status, or other protected characteristics. These pages do not steer anyone to a program based on who they are.",
} as const

export const FHA_HOUSE_HACK = {
  asOf: LENDING_FACTS_AS_OF,
  source: "HUD Handbook 4000.1 1–4 unit principal-residence and self-sufficiency rules. Confirm current handbook and county limits.",
  occupancy:
    "FHA 1–4 unit purchases are principal-residence occupancy: a borrower occupies one unit as a home. Treating the duplex as a pure investment while using FHA is not an allowed occupancy type. Move-in timing is a program rule (often within 60 days of closing — confirm the handbook in force), not a slogan.",
  duplexVs34:
    "HUD’s self-sufficiency test applies to three- and four-unit properties, not to a typical two-unit (duplex). A duplex can still use a rental-income worksheet on the unit you will not occupy. “No self-sufficiency test” is not “no underwriting.”",
  limits:
    "FHA county loan limits are higher for 2-unit properties than for 1-unit in the same county. Look up this year’s HUD table for the property county. Do not treat a blog dollar figure as the limit.",
  notCondo:
    "A side-by-side or up-down duplex on its own parcel is not a condo. HUD’s condominium project roster applies to condo projects, not to a typical two-unit house. If the building is actually a condo regime, then project approval is a different file.",
} as const

export const RELOCATION_SEASONING = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Fannie Mae Selling Guide B3-3.3-03 Employment Offers or Contracts (confirm current). Overlays differ for FHA, VA, and Freddie Mac.",
  question60Days:
    "A job that starts in about 60 days can sometimes be used as qualifying income on a conventional purchase when the investor’s future-employment tests are met. Sixty days is a common borrower question, not a published Fannie Mae “60-day rule.”",
  fannieOption2:
    "Fannie Mae’s path when a paystub is not in the file before delivery is limited: purchase of a one-unit principal residence, fixed base pay (not commission-only or self-employed income from the new job), employer is not a family member or a party to the transaction, and the start date is no earlier than 30 days before the note date and no later than 90 days after. The offer or contract must be fully executed and non-contingent; remaining conditions (background check, license) generally have to be cleared before closing.",
  reserves:
    "That no-paystub path typically adds reserve tests: often six months’ PITIA, or liquid resources to cover counted monthly liabilities (including the new PITIA) for the months between the note date and the start date, plus one. Confirm the guide in force.",
  not1099:
    "A brand-new 1099 or self-employed start is not this offer-letter path. See just-went-1099 and two-year vs one-year overlays.",
  utahNote:
    "Utah-specific pieces are the closing venue (title company, deed of trust) and the REPC deadlines, which still run even if the first paycheck has not hit. Utah is not a community-property state. Commute and city context live on the moving-to-Utah page; this page is seasoning, not a second doorway city mill.",
} as const

export const APR_VS_RATE = {
  asOf: LENDING_FACTS_AS_OF,
  source: "CFPB Loan Estimate (Regulation Z / TILA). Not a live rate table and not a quote.",
  noteRate:
    "The interest rate on page 1 of the Loan Estimate is the note rate used to calculate principal and interest. Discount points can buy that rate down. The typed rate in a calculator is not this number.",
  apr:
    "APR (annual percentage rate) is a broader cost measure that includes the note rate plus most lender prepaid finance charges (origination, borrower-paid discount points, and certain other fees defined by TILA). Two files with the same note rate can have different APRs. Title, recording, and many third-party charges often sit outside APR.",
  howToCompare:
    "Compare Loan Estimates with the same loan amount, occupancy, property type, and lock period. Read note rate, APR, points, lender credits, and cash to close together. APR assumes you keep the loan for the full term; if you sell or refinance sooner, break-even on points is a different math problem.",
  notATable:
    "This site does not publish a fake live-rate table. A news average is not an LE. APR is not a payment, not a lock, and not “the best rate.”",
} as const

export const VA_ENTITLEMENT_RESTORATION = {
  asOf: LENDING_FACTS_AS_OF,
  source: "VA Lender's Handbook entitlement restoration and Certificate of Eligibility (confirm current rules on va.gov)",
  afterSale:
    "When the prior VA loan is paid in full and the property is disposed of under current VA rules, used entitlement is typically restored so it can be used again on a later purchase. Restoration is a VA process reflected on an updated Certificate of Eligibility. It is not automatic the day the listing goes live.",
  notRemaining:
    "Keeping the first VA loan and buying another home is remaining entitlement plus occupancy — a different file from selling, paying off, and restoring. Do not use this page as a second-VA-loan answer.",
  oneTime:
    "VA also describes limited restoration without disposing of the property when the prior loan is paid in full (often called one-time restoration). Whether that path is still available on a given COE, and occupancy on any later purchase, must be confirmed against current VA rules — not assumed from a blog.",
  substitution:
    "If a VA-eligible buyer assumes the loan and substitutes their entitlement, the seller’s used entitlement can sometimes be restored without a cash payoff of the loan. Assumption, substitution, and release of liability are VA and lender processes, not a listing-agent slogan.",
  fundingFee:
    "Restoration of entitlement is not the same as first-use funding-fee status. Subsequent-use funding fee often still applies after a prior use even when entitlement is restored, unless an exemption applies. Confirm the current schedule.",
  notADollar:
    "This page does not quote basic entitlement, bonus entitlement, or county guaranty dollars. Those figures and county loan limits change. The COE and current VA tables are the source of truth. Look up current VA rules; do not memorize a marketing-page number.",
} as const

export const CPA_LETTER_VS_RETURNS = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Agency self-employment income (returns and transcripts) plus typical CPA P&L overlays. Not tax advice.",
  typical:
    "On agency (Fannie Mae, Freddie Mac, and many FHA) self-employed files, signed tax returns and IRS transcripts are what usually move the income calc. A CPA letter is supporting documentation. It does not replace the return stack.",
  whatHelps:
    "A CPA-prepared year-to-date profit and loss, and a letter confirming the business exists and the borrower is self-employed in that line of work, can support a file that already has returns. That is common while the current year is still open.",
  whatDoesNot:
    "A letter that states an annual income number without matching returns, transcripts, and a paper trail of deposits is typically not a qualifying method on an agency file. It is not a substitute for two years of returns, and it does not turn last month’s first 1099 into a history.",
  k1Note:
    "K-1 income is still taken from the K-1 and matching returns, not from a CPA summary of distributions. See K-1: what usually counts.",
  nonQm:
    "Some Non-QM overlays weigh CPA letters and P&Ls more heavily, still next to bank statements or assets. That is an investor overlay, not a reason to skip transcripts on an agency file.",
} as const

export const LOCK_VS_FLOAT = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Typical lock-desk policy (lock, float, extension, float-down). Not a live rate table and not a lock.",
  lock:
    "A lock holds a quoted rate and points for a stated window (often 30–60 days) for a specific loan amount, occupancy, and product. It is not a commitment to lend, and it is not a promise that the market will not move.",
  float:
    "Floating means the rate is not held. The quote can improve or worsen until you lock. There is no published “float until closing and you will win” benefit.",
  extension:
    "If the lock expires before funding, the lender may offer an extension for a fee, worse pricing, or a relock at then-current market. Extension cost is file- and investor-specific. This page does not quote a fee or a current rate.",
  floatDown:
    "Some locks include a limited float-down if rates drop. That is a written lock policy, not a blog right. Ask for the lock-desk terms before you treat a drop as yours.",
  notARate:
    "This site does not publish current rates, lock fees, or extension costs. Compare lock period, points, and credits on Loan Estimates. APR vs note rate is a different question from whether to lock.",
} as const

export const NO_CLOSING_COST_REFI = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Loan Estimate lender credits vs note rate. Not a quote and not a recommendation to refinance.",
  tradeoff:
    "A “no closing cost” refinance usually means the lender credits enough to cover most origination and many third-party fees. That credit is typically paid for with a higher note rate (or a worse point/credit position on the pricing sheet). The cost is in the rate, not gone.",
  stillCash:
    "Prepaids (interest, escrow cushion) and some third-party items can still show as cash to close. “No closing cost” is not “no cash and no cost over the life of the loan.”",
  vsBreakEven:
    "Run break-even on the higher payment versus a lower-rate file that you pay costs on. If you keep the loan a long time, the higher rate can cost more than paying costs in cash. If you move or refinance again soon, the credit can win. Neither is “the best rate.”",
  vsStreamline:
    "FHA Streamline and VA IRRRL reduce documentation. They still have title, a new note, and often a net-benefit test. They are not automatically no-cost, and cash-out is generally not a streamline.",
} as const

export const TRI_MERGE = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "Typical mortgage tri-merge (Equifax, Experian, TransUnion) and classic FICO mortgage models. Confirm the report in the file. Not a score-raise method.",
  what:
    "A tri-merge is a credit report that pulls Equifax, Experian, and TransUnion together. Mortgage underwriting typically uses that combined file, not a single-bureau consumer-app score.",
  middleScore:
    "When three classic FICO scores are present, many files use the middle score (not the average, not the highest). If only two bureaus return a score, the lower is commonly used. Overlays can differ. This is not a way to raise a score.",
  models:
    "Many mortgage files still use classic FICO models (commonly Score 2, 4, and 5 by bureau) rather than FICO 8/9/10 on a consumer app. A credit-monitoring app number is not the tri-merge.",
  shows:
    "The report shows tradelines, balances, payment history, inquiries, public records, and collections as each bureau reports them. Bureaus can disagree. Medical collections and thin-file alternative credit are separate conversations.",
  duringUw:
    "A credit refresh during processing can add inquiries and new accounts. That is a common path from a pre-approval letter to a later decline. Do not open new credit mid-file without asking.",
  fairHousing:
    "Whose credit is pulled is about who applied. These pages do not steer anyone to a program based on race, national origin, religion, sex, disability, familial status, or other protected characteristics.",
} as const

export const EARNEST_VS_DOWN_VS_CLOSING = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Utah REPC earnest-money treatment plus typical Loan Estimate cash-to-close lines. Not legal advice.",
  earnest:
    "Earnest money is a deposit with the purchase contract. In Utah it is typically held and applied at settlement toward funds you already owe. It leaves your account when the REPC is executed. It is not a fourth pile of cash on top of down payment forever, and it is not automatically refundable if you miss a written deadline.",
  down:
    "Down payment is the equity you bring at purchase (price minus loan amount). Program minimums and gift/DPA rules apply to this line.",
  closing:
    "Closing costs are origination, title/escrow, recording, and similar fees. Prepaids (taxes, insurance, prepaid interest) sit next to them on cash to close. Seller concessions can offset some costs within program caps — not the whole stack.",
  timing:
    "Cash timing differs: earnest money first, then remaining down payment and costs at closing, minus the earnest credit. Reserves, if required, stay in your accounts after closing.",
} as const

export const TOWNHOME_VS_CONDO = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Legal property regime (condo vs PUD/fee-simple) plus HUD condominium project tests and HOA-as-housing DTI. Confirm the recorded plat.",
  legal:
    "Lenders underwrite the legal regime, not the listing photo. A “townhome” can be a fee-simple planned-unit development (you typically own the land under the unit) or a condominium (you own the unit plus an interest in common elements). The recorded plat and CC&Rs decide. Do not treat every townhome as a condo.",
  condoDocs:
    "Condo files typically need an HOA questionnaire, budget, insurance (walls-in vs master), litigation, occupancy mix, and — for FHA — current project approval on HUD’s list or single-unit approval.",
  pudDocs:
    "PUD / fee-simple townhomes still produce CC&Rs and often an HOA questionnaire. FHA condo-roster and concentration tests usually do not apply the same way as a condo regime. Overlays still exist.",
  hoaDti:
    "Required HOA dues are housing expense either way. A modest PITI plus a large HOA can fail DTI on a townhome or a condo.",
  notOccupant:
    "This page describes the property’s legal structure and documents. It does not describe who should live there.",
} as const

export const RESERVES_PITIA = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Agency and typical Non-QM reserve overlays (months of PITIA). Confirm the guide in force. Not a cash-to-close quote.",
  what:
    "Reserves are liquid assets remaining after cash to close, measured as months of PITIA (principal, interest, taxes, insurance, and association dues when they apply).",
  counted:
    "Checking, savings, and many vested brokerage and retirement accounts can count, often with haircuts on retirement. The cash that pays earnest money, down payment, and closing costs is not also reserves. Gift funds are often limited or excluded as reserves — confirm the program.",
  howMany:
    "Required months depend on occupancy, program, unit count, and overlays. A primary 1-unit file may need few or no months; investment and 2–4 unit files commonly need more. Relocation / future-employment paths can add reserve tests. This page does not publish a single required number.",
  notCashToClose:
    "Reserves are not extra closing costs you write a check for at the table. They are documented remaining assets. Cash to close is a different stack.",
} as const

export const ASSET_DEPLETION = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "Non-QM asset-depletion overlays plus agency “employment-related assets as qualifying income” (confirm the selling guide in force). Not a quote.",
  what:
    "Asset-depletion (asset-based qualifying) treats eligible liquid and sometimes retirement assets as a stream of qualifying income under a written formula. It is not “you have cash, so you are approved,” and it is not a jumbo conventional shortcut you can assume.",
  agencyVsNonQm:
    "Some agency files have a limited path that converts documented eligible assets into monthly qualifying income under the selling guide. Standalone asset-depletion products with different haircuts, prepayment terms, and employment tests are typically Non-QM. They are not interchangeable.",
  formulaShape:
    "A common shape is eligible assets, minus funds needed to close and any required reserves, divided by a month count (overlays often use 240 or 360 months). Haircuts on stocks, retirement, and concentrated holdings are typical. This page does not publish a formula you can plug into a blog as an approval.",
  eligible:
    "Investors usually want seasoned, documented assets in the borrower’s name. Business accounts, recently deposited gifts, and non-liquid real estate equity are often limited or excluded. Retirement accounts may count with a haircut if accessible under the overlay.",
  who:
    "Typical conversation: substantial eligible assets and thinner documented employment income (for example retirement or high-asset self-employed). If agency W-2 or return income already qualifies, that path is usually more standard.",
  vsBankAndDscr:
    "Bank-statement qualifies from deposits. DSCR qualifies from the property’s rent. Asset-depletion qualifies from assets. Combining them is an overlay, not a default.",
} as const

export const GIG_PLUS_W2 = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Agency variable-income averaging (W-2 vs 1099/gig as separate streams). Not a credit decision.",
  method:
    "Gig or 1099 income and W-2 wages are usually calculated as separate streams, then added. The W-2 average does not automatically “cover” an undocumented gig. The gig average does not replace a missing W-2 history.",
  gigLeg:
    "The gig / 1099 / side-hustle leg typically needs a documented history (often 12–24 months) and is averaged, including slow months. A peak app-month is not the qualifying method. Brand-new gig income is usually not yet an average.",
  w2Leg:
    "W-2 base pay is often more stable. Overtime, bonus, and commission on the W-2 are still variable and use the likely-to-continue tests. Do not mix a W-2 bonus into the gig average.",
  joint:
    "A spouse or partner’s W-2 only joins the average when that person is a borrower. Marital status is not a credit score; anyone who applies is underwritten on the file.",
} as const

export const DEPRECIATION_ADD_BACK = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "Fannie Mae / Freddie Mac rental-income worksheets on Schedule E (depreciation and certain non-cash expenses added back). Confirm the selling guide in force. Not tax advice.",
  what:
    "On many agency files, depreciation and some other non-cash expenses on Schedule E are added back when the underwriter calculates net rental income. The tax return is still the source document. An add-back is a qualifying worksheet, not extra cash in your account.",
  typicalAdds:
    "Common add-backs, when the guide allows them, include depreciation, and sometimes insurance, mortgage interest, taxes, HOA, and homeowners dues that the worksheet already treats elsewhere so they are not double-counted. Exact lines change with the form year and the investor.",
  notAlways:
    "Not every Schedule E line is added back. Amortization, depletion, and one-off casualty losses are often treated differently. A K-1 rental is a different stack from personal Schedule E. DSCR does not use this worksheet as the qualifying engine.",
  notTaxAdvice:
    "Adding depreciation back for a mortgage file is not the same as how you report income to the IRS. This page is not tax advice and not a promise that every add-back on last year’s return will be allowed on your product.",
} as const

export const COMPENSATING_FACTORS = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "Fannie Mae and Freddie Mac AUS messages, HUD 4000.1 compensating factors for high DTI, and VA residual-income overlays. Confirm the guide and findings in force.",
  what:
    "Compensating factors are documented strengths that can appear in automated underwriting findings or a manual underwrite when DTI, reserves, or another test is tight. They are comments and overlays, not a second score that overrides a decline.",
  typical:
    "Factors that actually show up in files include documented reserves after cash to close, a modest housing-payment increase, unused overtime or bonus history, residual income (especially VA), low LTV, and a long, clean housing payment history. Energy-efficient and additional unused income appear on some FHA lists.",
  notAGuarantee:
    "A compensating-factor list is not a guarantee that findings will flip to approve. AUS still runs the credit file, occupancy, and property. Manual underwriting is a different path with its own published tests.",
  notHiddenIncome:
    "A factor only counts if it is documented in the file. Informal ‘they have a rich relative’ or HOA you omitted from DTI is not a compensating factor.",
} as const

export const UTAH_TAX_CALENDAR = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "Utah Code property-tax due date (typically November 30) plus county treasurer billing practice. Confirm the county treasurer for the property. Not tax or legal advice.",
  dueDate:
    "Utah property taxes are typically due November 30. If that date falls on a weekend or holiday, the next business day is commonly treated as the due date. Unpaid amounts generally become delinquent the following day. Confirm the county treasurer — this is not a penalty calculator.",
  annualBill:
    "Utah counties typically bill once a year, not on a spring-and-fall split used in some other states. Valuation notices and tax notices are separate mailings (often mid-year valuation, then a fall tax notice). Dates differ by county.",
  escrowMismatch:
    "A mortgage escrow year is not the county tax year. The first escrow analysis after origination can surprise buyers because closing collected an estimate of months until the next November disbursement plus a cushion, then actual billed tax and insurance arrived.",
  notAdvice:
    "This is education about calendar timing. It is not tax advice, not a protest-deadline guide, and not a quote of your next escrow payment.",
} as const

export const ESCROW_CUSHION = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "RESPA / Regulation X aggregate escrow analysis (12 CFR 1024.17). Confirm current CFPB text. Servicer contracts can require less, not more than the published maximum.",
  maxCushion:
    "Federal aggregate accounting generally lets a servicer require a cushion of no more than 1/6 of estimated annual disbursements — often described as about two months of taxes and insurance. That is a ceiling, not a requirement that every servicer use two months.",
  whyItMoves:
    "The cushion and the monthly escrow portion change when the servicer’s annual analysis uses a new tax bill, a new insurance premium, or a shortage/surplus from the prior year. A first analysis after origination is the usual surprise because the closing estimate was a projection.",
  notUniversal:
    "Do not treat a blog formula as a universal servicer formula. Some loans waive escrow. Some investors require it. Shortage options (spread vs lump sum) are a servicing notice, not origination pricing. This is not a universal servicer formula.",
  shortageVsCushion:
    "A shortage is money the account is short for the next 12 months of bills. The cushion is extra the servicer may keep in the account. They are related and not the same line.",
} as const

export const RURAL_VETERAN_COMPARE = {
  asOf: LENDING_FACTS_AS_OF,
  source: "VA, USDA RD, and HUD occupancy/eligibility overviews. Fee percents live in the dated snapshots, not in this note.",
  notAPick:
    "This is a comparison of typical tests, not a recommendation that a veteran should take USDA, VA, or FHA. Eligibility, occupancy, and overlays decide the file.",
  vaFirst:
    "If remaining entitlement, occupancy, and residual income fit, VA is often the first conversation because monthly PMI is not charged and zero down can apply. That is not automatic for every veteran and not a promise it beats USDA or FHA on APR.",
  usdaMap:
    "USDA still needs an eligible address, household income under the current area limit, and primary occupancy. A rural tract is not a city-name slogan. Run the published map.",
  fhaFallback:
    "FHA has no USDA map test and no VA COE. It has MIP and HUD occupancy. A veteran without remaining entitlement, or a property that fails USDA’s map or income test, sometimes lands here. That is a file fact, not a preference.",
  fairHousing:
    "VA eligibility is a service benefit. USDA eligibility is map plus household income. FHA is credit and MIP policy. None of these pages steer by national origin or other protected class.",
} as const

export const HELOC_SEASONING = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "Typical HELOC and cash-out ownership/occupancy overlays plus Fannie delayed-financing exception (cash purchase, then cash-out). Confirm the investor. Not a waiting-period statute.",
  yearTwo:
    "Many HELOC and cash-out overlays want a documented period of ownership and occupancy — commonly six to twelve months, sometimes described as ‘after year one’ or into year two. That is an overlay conversation, not a federal waiting period you can calendar as a right.",
  justClosed:
    "If you just closed a purchase, tapping equity immediately is often limited: cash-out LTV, HELOC combined LTV, occupancy, and whether the first-lien investor even allows a second. ‘I just got the keys’ is not a product.",
  delayedFinancing:
    "A cash purchase followed by a cash-out within a published window is a delayed-financing exception on some conventional files — a different fact pattern from seasoning a financed purchase for a HELOC.",
  notAFederalWait:
    "There is not a federal waiting period that says every homeowner must wait two years. Investor overlays, title seasoning, and occupancy drive the file. This is not tax advice.",
  vsStructure:
    "HELOC vs cash-out as a structure (lien position, payment, tax questions) is a different page. This page is when you can ask after a recent closing.",
} as const

export const CROSS_COLLATERAL = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Portfolio / private-lender blanket and pledged-asset overlays. Not an agency purchase product you can assume.",
  what:
    "Cross-collateral (sometimes a blanket mortgage or pledged additional property) means more than one property secures the same debt. Default on the loan can put both properties at risk. That is the tradeoff for using existing equity without always taking cash out first.",
  vsCashOut:
    "Cash-out extracts cash from one house, then you bring that cash to a second purchase. Cross-collateral keeps the houses tied. A HELOC on the first house is a second lien you draw; it is not automatically a blanket on the second house.",
  notInvented:
    "Agency conventional, FHA, VA, and USDA purchase files do not treat cross-collateral as a standard way to buy another house. Some portfolio, credit-union, or Non-QM investors offer it as an overlay. This page does not invent that Ondo or any named investor will originate it. It is not a published product you can assume.",
  occupancy:
    "Each property still has an occupancy type. Pledging a primary residence to buy a rental does not turn the rental into owner-occupied pricing. Occupancy has to match use.",
} as const

export const BIWEEKLY_VS_REFI = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Amortization arithmetic (26 half-payments = 13 full payments) vs refinance break-even including costs. Not a savings quote.",
  biweekly:
    "A true biweekly schedule is half the monthly principal-and-interest every two weeks. That is 26 half-payments, or 13 full payments in a year — one extra compared with 12 monthly payments. Confirm the servicer actually applies it to principal and does not merely split the same 12 payments.",
  extraPrincipal:
    "The same extra dollars sent as additional principal on a monthly loan often match the amortization effect of biweekly, without a third-party biweekly vendor. Ask the servicer how extra principal is applied.",
  vsRefi:
    "A refinance changes the note rate, term, and costs. Extra principal does not. If the goal is a lower rate, run break-even including points and origination. If the goal is faster payoff at the current rate, extra principal or a recast is a different tool.",
  noPromise:
    "This page does not quote a dollar of interest saved, a number of years shaved, or a guaranteed payoff date. Illustrate on a calculator with your balance, rate, and extra amount.",
} as const

export const FIRST_RENTAL_OCCUPANCY = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Uniform Residential Loan Application occupancy plus agency occupancy overlays. Not occupancy coaching.",
  stayPut:
    "If you will keep living in your current home and the new house will be rented, the new loan is typically investment occupancy. The existing loan stays a primary as long as you still occupy that house as your principal residence.",
  moveIn:
    "If you will move into the new house and rent the old one, the new purchase is typically a primary. The old loan’s occupancy changes when you no longer live there — tell the servicer; do not leave the file labeled as if you still occupy it.",
  notHouseHack:
    "This is not a duplex house-hack. A house-hack is buying a 2–4 unit and occupying one unit. First-rental occupancy is buying a separate property while you already have a home you occupy.",
  notSecondHome:
    "A house you will rent as a business is not a second home. Second-home occupancy is exclusive personal use. See second home vs investment occupancy.",
  fraud:
    "Do not label the rental a primary or second home to get owner-occupied pricing. Occupancy has to match how you will actually use each house.",
} as const

export const ITIN_DOCUMENTATION = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "IRS ITIN definition, HUD 4000.1 Social Security number policy, Fannie Mae Selling Guide B2-2-01 (citizenship / residency) plus typical Non-QM ITIN overlays. Confirm the guide in force. Not immigration or legal advice.",
  whatItinIs:
    "An ITIN is an IRS tax-processing number for people who need to file U.S. tax returns but do not have a Social Security number. It is not work authorization and not a substitute for a credit score.",
  notNationalOrigin:
    "Citizenship and immigration status are legal eligibility and documentation topics for some federal loan programs. They are not a proxy for national origin. This page does not prefer any country, ethnicity, or visa nationality.",
  agencyVsNonQm:
    "Many agency conventional and FHA files expect a valid Social Security number for the credit report and automated underwriting, plus evidence of lawful presence when the borrower is not a U.S. citizen. An ITIN-only file is typically a Non-QM or portfolio overlay conversation, not a published Fannie, Freddie, or HUD product you can assume.",
  docs:
    "Lenders typically collect identity, tax, and status documents as categories: government-issued ID, an SSN card or IRS ITIN letter, tax returns, and — when the file needs it — visa, employment-authorization, or permanent-resident documentation. Which category applies is a file fact.",
  visaExamples:
    "Visa and authorization categories (for example H-1B, L-1, or an employment-authorization document) appear in files as documentation labels. Overlay lists change. Do not treat a blog list as the current investor chart or as a ranking of who is preferred.",
  noEasier:
    "This page does not say a file is easier if you are from a particular country, hold a particular visa, or belong to a particular group.",
  utahNote:
    "Utah is not a community-property state. Non-borrowing-spouse documentation rules that appear in some community-property states do not automatically apply here.",
} as const

export const NEWS_AVERAGE_VS_QUOTE = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "Freddie Mac Primary Mortgage Market Survey (PMMS) published methodology. Confirm the current description at freddiemac.com/pmms. Not a live rate and not a quote.",
  officialUrl: "https://www.freddiemac.com/pmms",
  what: "The 30-year figure on the news is usually a national survey average of 30-year fixed quotes, not your Loan Estimate. In the U.S. that series is commonly Freddie Mac’s Primary Mortgage Market Survey (PMMS).",
  typicalFile:
    "PMMS is built around conventional, conforming, fully amortizing purchase applications — typically described as about 20% down (80% LTV) and excellent credit. It is not FHA, VA, USDA, jumbo, investment occupancy, or a thin-credit file.",
  methodology:
    "Since November 2022 Freddie Mac has described PMMS as coming from Loan Product Advisor applications that meet those filters, not from calling a small lender panel. Confirm the current published methodology. This site does not republish this week’s percent.",
  notYourQuote:
    "Your quote is a Loan Estimate for your occupancy, credit, LTV, property type, lock period, and points or credits. A news average is not an LE, not a lock, and not “the best rate.”",
  notATable:
    "This site does not publish a fake live-rate table and does not quote a current PMMS percent. Look up the official survey if you want the headline number; then compare two Loan Estimates.",
} as const

export const LOCK_IF_RATES_DROP = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Typical lock-desk float-down language. Not a published borrower right. Confirm the lock confirmation on your file.",
  notAutomatic:
    "A lock holds the quoted rate and points for the window you agreed to. If market rates fall after you lock, you do not automatically get the lower rate.",
  floatDown:
    "Some lenders write a limited float-down into the lock: often one-time, a minimum drop, a fee or worse credit, and the same product and lock period. That is a written lock policy, not a blog right.",
  vsExtension:
    "Extension is what happens if the lock expires before funding. Float-down is what might happen if rates fall while the lock is still live. They are different desks. See lock extension vs floating.",
  stillReprices:
    "Even with a float-down, file changes (score, LTV, occupancy, loan amount, lock period) can still reprice. A lock is not CTC and not a commitment to lend.",
  notARate:
    "This page does not publish current rates, a required drop in basis points, or a float-down fee. Ask for the lock-desk terms in writing.",
} as const

export const ESCROW_SHORTAGE = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "RESPA / Regulation X aggregate escrow analysis (12 CFR 1024.17) plus typical servicer annual analysis notices. Confirm current CFPB text. Not tax advice.",
  howItAppears:
    "After the first year, the servicer’s annual analysis compares what it collected to what it actually disbursed for taxes and insurance, then projects the next 12 months. A shortage means the account would not cover those projected bills plus any allowed cushion.",
  vsCushion:
    "The cushion is extra the servicer may keep (federally capped, often described as about two months). A shortage is money the account is short for the next cycle. They can appear on the same notice.",
  options:
    "The analysis notice typically offers paying the shortage in a lump sum or spreading it over the next 12 monthly payments. If the shortage is smaller than one month’s escrow deposit, federal rules can allow a shorter payoff window. This is a servicing notice, not a new loan.",
  utahNote:
    "Utah’s once-a-year November tax bill is a common reason the first analysis after origination looks different from the closing estimate. See the tax calendar guide. This is not tax advice.",
  notAdvice:
    "This page does not tell you to waive escrow, protest taxes, or pick lump sum versus spread. Read the notice. Confirm with the servicer. Not tax advice.",
} as const

export const HILL_AFB_VA = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "VA occupancy and Certificate of Eligibility (confirm current VA Lender's Handbook and va.gov). Hill AFB is in Davis County, Utah. Not a mill doorway.",
  where:
    "Hill Air Force Base is in Davis County, Utah, west of I-15 between Ogden and Salt Lake City, adjacent to Clearfield and Layton. This page is COE and occupancy education, not a /hill-afb-mortgage mill.",
  commute:
    "Off-base purchases commonly sit along the I-15 / FrontRunner corridor (Clearfield, Layton, Roy, Clinton, Syracuse, Ogden, Kaysville). Commute and housing type are geography. These pages do not describe who should live in a neighborhood.",
  baseHousingVsPurchase:
    "On-base housing is typically a lease. A VA purchase is a loan on a home you intend to occupy as your principal residence. They are different. Do not treat a purchased house as a rental while you stay in base housing and still call it a VA primary.",
  bah: "Basic Allowance for Housing (BAH) is a military pay item that changes with rank, dependency status, and ZIP. This page does not publish BAH dollars. Look up the current official DTMO table. BAH is not a mortgage qualification formula by itself.",
  bahLookupUrl: "https://www.travel.dod.mil/Allowances/Basic-Allowance-for-Housing/BAH-Rate-Lookup/",
  coe: "A Certificate of Eligibility shows remaining entitlement and is required to close a VA loan. Most lenders pull it from VA systems. Occupancy of the new property is a separate certification from the COE.",
  occupancy:
    "VA purchase occupancy is intent to occupy the subject as your principal home (timing is a program rule — confirm the handbook in force). PCS orders, unaccompanied tours, and keeping on-base housing are occupancy facts. Do not misstate occupancy to use VA on a rental.",
  notRestoration:
    "This is not selling-and-restoring entitlement, and not a remaining-entitlement second VA loan by itself. Those are separate guides.",
} as const

export const DELAYED_FINANCING = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "Fannie Mae Selling Guide B2-1.3-03 cash-out refinance delayed financing exception (confirm the guide in force). Freddie Mac publishes a related exception. Lender overlays can be tighter. Not a statute.",
  what: "Delayed financing is a cash-out refinance after you bought the same house with cash (no mortgage on that purchase), usually within a published window measured from purchase date to the new loan’s disbursement. Fannie Mae’s commonly cited window is six months. Confirm the current guide — it is not a federal waiting-period statute.",
  vsSeasoning:
    "This is not HELOC-after-year-two seasoning on a financed purchase. If you already have a mortgage on the house, delayed financing is the wrong page.",
  docs: "Typical agency asks: an arm’s-length purchase, a settlement statement (or allowed substitute) showing no mortgage financing, title with no existing liens on the subject, and a paper trail of the cash used to buy.",
  loanAmount:
    "The new loan amount is typically capped at the documented cash you actually invested in the purchase, plus permitted closing costs, prepaids, and points on the new loan, and still limited by cash-out LTV on the current appraised value. You do not automatically get to pull out appreciation.",
  giftsAndBorrowed:
    "Gift funds used to buy the property typically cannot be reimbursed with the new loan. If the “cash” was an unsecured loan or a HELOC on another property, proceeds usually have to pay that debt down or off. Confirm the guide in force.",
  stillCashOut:
    "The refinance is still a cash-out for pricing and eligibility. Occupancy has to match how you will use the house. Overlays can decline a file the selling guide would allow.",
  notInvented:
    "This page describes a published agency exception shape. It does not invent an overlay as if it were a statute, and it does not promise that every cash purchase can be financed later.",
} as const

export const COSIGN_VS_COBORROWER = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Uniform Residential Loan Application (who applies) plus agency occupant vs non-occupant co-borrower overlays. Not legal advice.",
  coBorrower:
    "A co-borrower applies with you: they are on the note, their credit and counted debts are in DTI, and their income can be in the qualifying average when documented. They usually take title when they will own the home.",
  cosign:
    "“Cosign” in auto-loan language often means someone liable on the note who is not using the car. Mortgage files rarely use a silent cosigner. If someone is on the note, they are underwritten as a borrower (occupant or non-occupant).",
  title:
    "The deed (title) is who owns the property. The note is who owes the lender. They can differ, and that difference is an overlay problem — especially a parent on title who is not on the loan on a primary-residence file.",
  nonOccupant:
    "A non-occupant co-borrower is on the note but will not occupy. Agency rules differ (FHA vs conventional). Occupancy of the occupying borrower still has to be true. This is not a way to label a rental as a primary.",
  giftVsHelp:
    "A parent who only gifts is not on the note. A parent who is on the note is a co-borrower. Mixing those without asking is a common file stall.",
  fairHousing:
    "Who is on the application is about the credit file and occupancy, not marital status as a preference. These pages do not require a spouse or treat unmarried co-borrowers as a different class of people.",
} as const

export const FTHB_FILE_MISTAKES = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Typical purchase underwrite condition fails (new debt, job change, large deposits, occupancy). Not a generic homebuying-mistakes listicle.",
  whatThisIs:
    "The mistakes that actually stall a first-purchase file are underwriting facts: new installment debt, a job or hours change, an unsourced large deposit, or occupancy that does not match how you will live. They are not “forgot to get inspections” lifestyle tips.",
  newDebt:
    "A new auto loan, furniture financing, or co-signed installment usually appears on a credit refresh and changes DTI.",
  jobChange:
    "A job change, unpaid leave, or commission-only switch after pre-approval can break the income average the letter used.",
  largeDeposit: "Purchase files typically include about 60 days of statements. Large deposits need a paper trail.",
  occupancy:
    "Stating primary when you will not occupy — or a second home when you will rent — is occupancy misrepresentation.",
  closingCard:
    "Closing a revolving account before you apply can raise utilization by shrinking available credit. See closing a credit card.",
  notLifestyle:
    "This page does not clone generic “homebuying mistakes” listicles (inspections, overbidding, skipping an agent). Those are not file conditions.",
} as const

export const PURCHASE_TIMELINE = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Typical Utah purchase file stages plus Utah REPC clocks. Ranges, not promises. Not legal advice.",
  notAPromise:
    "These are common ranges, not a closing-date guarantee. The REPC you signed, the appraisal queue, and your document speed set the file.",
  preapproval:
    "If documents are complete, a pre-approval snapshot is often issued in a few business days. It is not CTC.",
  contractToUw:
    "After acceptance, the financing and appraisal clock on the Utah REPC is often a few weeks — read your dates. Appraisal is commonly one to two weeks after it is ordered when the panel is not backed up.",
  uwToCtc: "Underwriting conditions can clear in days or take a few weeks. AUS findings are not CTC.",
  ctcToClose:
    "Clear-to-close to funding often needs a few days for the Closing Disclosure waiting period, title figures, and insurance binder. Utah closings typically fund at a title company.",
  overall:
    "Many first purchases close about 21–45 days after acceptance when the contract and file cooperate. That is a range, not a promise you will fund on day 30.",
} as const

export const CLOSING_CREDIT_CARD = {
  asOf: LENDING_FACTS_AS_OF,
  source: "Mortgage tri-merge / AUS revolving utilization. Not a score-raise method.",
  utilization:
    "Revolving utilization is balances divided by total revolving limits. Closing a card with available credit shrinks the denominator. The same balance can look worse.",
  aus: "AUS (DU / LPA) reads the tri-merge. Available credit, utilization, and age of accounts can affect findings even when you “don’t use the card.”",
  age: "Closing the oldest revolving account can shorten average age of accounts. Paying the balance down while leaving the account open is a different fact from closing it.",
  duringFile:
    "Closing or opening revolving accounts after a pre-approval can show on a credit refresh. Ask before you close a card mid-file.",
  notARaise:
    "This page does not say closing a card will raise or lower your score by a number of points, and it is not advice to keep high-limit debt. It is utilization and AUS education.",
  fairHousing:
    "Credit-file mechanics are not assigned by protected class. These pages do not steer anyone to a program based on who they are.",
} as const

export const HAZARD_HO3_HO6 = {
  asOf: LENDING_FACTS_AS_OF,
  source: "ISO homeowners form names plus typical mortgagee insurance requirements. Not an insurance quote and not insurance advice.",
  hazard:
    "In a mortgage file, “hazard insurance” usually means the dwelling coverage the lender requires so a fire or similar loss can rebuild the collateral. It is a lender condition, not a shopping slogan.",
  ho3: "HO-3 is the common homeowners form for a house you own (often a fee-simple dwelling). It typically covers the dwelling, other structures, personal property, and liability, subject to the policy. Many detached-house files bind an HO-3.",
  ho6: "HO-6 is the common unit-owners (“walls-in”) form for a condominium. The association’s master policy usually covers the building and common elements; the HO-6 covers the interior, personal property, loss assessment, and improvements — confirm the master walls-in vs walls-out.",
  condo:
    "Condo and many HOA files need evidence of the master policy and a unit-owners policy (often HO-6). A townhome that is legally a condo uses this stack. A fee-simple PUD townhome may bind an HO-3. The plat decides, not the listing photo.",
  lender:
    "The mortgagee clause, coverage amount (often replacement or loan amount per investor), and deductible are loan conditions. A binder that does not match occupancy or legal regime stalls CTC.",
  notAdvice:
    "This page does not pick a carrier, a deductible, or a coverage limit. Ask a licensed insurance producer. Link townhome vs condo and the FHA condo roster for project eligibility. Not insurance advice.",
} as const

export const AUTHORIZED_USER_TRADELINES = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "Typical AUS and investor treatment of authorized-user tradelines on a mortgage tri-merge. Confirm the selling guide and overlay in force. Not a score-raise method.",
  what:
    "An authorized-user (AU) tradeline is a revolving account you can use that is contractually someone else’s. It can appear on a tri-merge. Appearance is not the same as the underwriter treating it as your credit history.",
  whatItDoes:
    "A long, well-paid AU card can sometimes show in a consumer score. Mortgage AUS and overlays often discount, exclude, or re-underwrite AU tradelines when the borrower is not contractually obligated. A thin file that is mostly AU cards can still fail even if an app score looks fine.",
  whatItDoesNot:
    "An AU tradeline does not make you a co-borrower, does not put you on the note, and does not automatically satisfy a minimum-tradeline overlay. It is not a substitute for documented alternative credit (rent, utilities) when the traditional file is thin.",
  overlays:
    "Investors and AUS findings often want tradelines the borrower is obligated on. Spousal or parent AU cards are a common conversation — and a common overlay haircut. Confirm the guide in force; this page does not quote a FICO delta.",
  notPiggyback:
    "This page does not teach adding yourself to someone else’s card to inflate a score, buying “seasoned tradelines,” or any piggyback scheme. Misrepresenting whose debt you pay can be fraud. Ask a loan officer what the tri-merge actually counted — do not manufacture credit history.",
  vsCosign:
    "A co-borrower is on the note. A silent auto-loan “cosigner” is not how most mortgage files work. AU is a revolving tradeline, not occupancy or title. See cosign vs co-borrower and what a tri-merge shows.",
  fairHousing:
    "Whose name is on a tradeline is a credit-file fact. These pages do not prefer any family structure, marital status, or protected class, and they do not steer anyone to a program based on who they are.",
} as const

export const INTEREST_ONLY = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "Interest-only payment structure vs fully amortizing notes and ARM teaser language. Typical jumbo/portfolio overlays. Not a rate quote and not a teaser-rate promise.",
  what:
    "Interest-only (IO) means scheduled payments for a stated period cover interest, not principal. The note rate still exists. Principal usually starts amortizing when the IO period ends, or earlier if you pay extra principal.",
  whoFor:
    "Typical conversation: jumbo or portfolio files, high cash-flow borrowers, and some investors who plan the payment change. It is an overlay product, not a standard conforming 30-year you can assume.",
  paymentShock:
    "When IO ends, the payment is recalculated to amortize remaining principal over the remaining term. That payment can jump even if the note rate did not. Taxes, insurance, and HOA can still rise during IO. Plan the fully amortizing payment, not only year-one interest.",
  notTeaser:
    "IO is not a temporary buydown and not an ARM teaser. A 2-1 buydown subsidizes a fully amortizing note for a few years. An ARM changes the rate after a fixed period. IO changes whether principal is required. Do not market IO as “the best rate” or a forever-low payment.",
  vsArm:
    "Some ARMs are also IO; many are not. Caps limit rate movement on an ARM. They do not prevent IO payment shock when amortization starts. Read ARM caps and this page as different machines.",
  notAPromise:
    "This page does not quote an IO rate, a payment, or a promise that an IO file will be originated. Compare Loan Estimates. Extra principal during IO is a choice, not a required amortization schedule.",
} as const

export const MANUFACTURED_AND_ADU = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "Agency and FHA manufactured-home and accessory-dwelling overlays. Confirm the current selling guide and HUD handbook. Do not treat a blog’s program nickname as the product you will be originated.",
  distinct:
    "Manufactured housing and an accessory dwelling unit (ADU) are different property types. A factory-built home on a chassis is not an ADU over a garage. Do not collapse them in underwriting or on a listing.",
  manufactured:
    "A manufactured home is typically built to the HUD Code and transported to the site. Many agency and FHA purchase files want it permanently affixed to a foundation, titled as real property (not chattel), and meeting current investor tests. Pre-HUD “mobile homes” and homes still titled as personal property are a different, often ineligible, conversation.",
  noInventedHudCode:
    "This page does not publish a permanent HUD program code, Title I vs Title II nickname, or a foundation-engineering form number as if it never changes. FHA and agencies have used different manufactured-home paths over time. Look up the handbook and investor overlay in force.",
  landHome:
    "Land-home (real property) financing is a different stack from chattel / personal-property loans on a home that is not real estate. Cash to close, appraisal, and title differ. This site does not originate a chattel product you can assume from a blog.",
  adu:
    "An ADU is a second dwelling on the same parcel — basement, garage, or detached — subject to zoning and the recorded use. Occupancy of the main house vs renting the ADU changes income calc and, sometimes, unit count. Proposed ADU rent is not Schedule E history on a house you do not own yet.",
  aduIncome:
    "ADU rental income, if allowed, is typically a worksheet overlay (lease, market rent, or tax-return history), not a listing screenshot. Treating an ADU rental as a duplex house-hack is only accurate when the legal unit count and occupancy match. See house-hacking a duplex with FHA when the building is actually 2–4 units you will occupy.",
  notAQuote:
    "Property-type overlays change. This page is a map of questions — foundation, title, zoning, occupancy — not a promise that a manufactured home or ADU will finance on a given program.",
} as const

export const RECAST_VS_REFI = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "Typical servicer recast (re-amortization after a principal curtailment) vs refinance break-even including costs. Confirm the note and servicer. Not a savings quote.",
  recast:
    "A recast (re-amortization) is a servicing request after a lump-sum principal payment: the servicer recalculates the monthly principal-and-interest at the same note rate over the remaining term. The rate does not change. A recast fee is often a few hundred dollars — overlay, not a statute.",
  refinance:
    "A refinance replaces the note. Rate, term, and costs change. Break-even months ≈ cash costs (including points and origination, minus credits) ÷ monthly P&I savings. A lower rate can still lose if you move first.",
  feeVsCosts:
    "Compare a recast fee plus the cash you send as principal with refinance closing costs. Recast does not buy a lower rate. Refinance does not recast the old note; it is a new loan.",
  whoAllows:
    "Not every investor or servicer recasts. ARMs, FHA, VA, and some conventional notes are commonly limited or excluded. Ask the servicer in writing. This page does not invent a recast right.",
  vsBiweekly:
    "Extra principal or biweekly drafts pay the current note down without a recast. The payment often stays the same until you request a recast. See biweekly vs refinance. Matrix “recast after a lump sum” as a standalone how-to is a different page when written.",
  notAQuote:
    "This page does not quote a recast fee, a rate, or interest saved. Illustrate. Not a recommendation to recast or refinance.",
} as const

export const CONDO_AGING_HOA = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "Fannie Mae / Freddie Mac condo project eligibility plus HUD condominium approval. Confirm the current selling guide and HOA questionnaire. Not insurance or legal advice.",
  what:
    "Refinancing a condo is a unit file and a project file. An aging association — thin reserves, deferred maintenance, special assessments, litigation, or insurance gaps — can stall or ineligible the project even when your credit and DTI are fine.",
  reserves:
    "Project reserve studies and budgeted reserves are typical questionnaire lines. A chronically underfunded HOA is a project-risk overlay, not a paint color. Special assessments can sit in DTI and in project eligibility.",
  litigation:
    "Pending litigation (construction defects, directors, or insurance claims) is a common ineligible or exception path. The HOA questionnaire and attorney letters matter. This is not a promise that every lawsuit kills every loan.",
  insurance:
    "Master policy, fidelity, and walls-in vs walls-out still apply on a refinance. An aging building with a non-renewed master or a huge deductible is a project issue. See hazard vs HO-3 vs HO-6 — not insurance advice.",
  fannieProject:
    "Conventional condo project review (limited vs full, and any Fannie Project Eligibility Review Service path) is dated overlay language. Do not memorize a review type from a blog. FHA files still need current HUD project approval or single-unit approval — see the FHA condo roster. They are different lists.",
  notRosterClone:
    "This page is aging-HOA project risk on a refinance. It is not the FHA roster how-to and not the townhome-vs-condo docs list, though those still apply.",
  notAPromise:
    "A well-run older building can still finance. A new building with no reserves can fail. Age is a clue, not a credit decision.",
} as const

export const TITLE_OWNER_VS_LENDER = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "ALTA owner’s vs lender’s title insurance in a purchase or refinance escrow. Utah typically funds at a title company. Not legal advice and not a premium quote.",
  lender:
    "A lender’s title policy protects the lender’s lien against covered title defects, up to the loan amount, subject to the policy. Most purchase and refinance mortgages require it. It does not protect your equity.",
  owner:
    "An owner’s title policy protects the owner’s title and equity against covered defects, up to the policy amount, subject to the policy. It is typically optional as a matter of contract — and often issued simultaneously with the lender’s policy. Optional is not the same as “you should skip it.”",
  simultaneous:
    "When both policies are issued in the same transaction, the owner’s premium is often a simultaneous-issue rate, not two full standalone premiums. Title companies quote this. This page does not publish a Utah tariff.",
  utah:
    "Utah residential closings typically sit at a title company, with a deed of trust recorded at the county. Owner’s and lender’s premiums still vary by company. See Utah closing costs. Not legal advice.",
  refinance:
    "A refinance usually needs a new lender’s policy (or a substitution/endorsement path the title company offers). An existing owner’s policy from the purchase may still protect the owner, subject to its date and exclusions — ask the title company, not this page.",
  notLegalAdvice:
    "Title insurance is a contract with exclusions (survey, zoning, later work). This is not a review of your commitment, not a claim, and not legal advice. Read the commitment with the title company.",
} as const

export const WEEK_AFTER_FUNDING = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "Typical post-closing timeline after a Utah title-company funding. Ranges, not promises. Not legal advice.",
  whatHappens:
    "After funding, the deed and deed of trust are sent for county recording. You usually already have keys at a Utah purchase funding. The first payment date is on the note and Closing Disclosure — it is often the first of the month after the first full month, because odd-days interest was prepaid at closing.",
  firstPayment:
    "Do not wait for a statement to learn the first due date. The CD and note state it. A statement can arrive later, especially if servicing transfers.",
  servicing:
    "The originator is not always the servicer. A “hello” / servicing-transfer letter can arrive in the first weeks. Pay the party the notice names. A transfer does not change the note rate by itself.",
  recording:
    "Recording can take days to a few weeks depending on the county queue. Title typically handles the package. This is not a promise of a recording date.",
  notLegalAdvice:
    "This is a servicing and calendar map, not legal advice, not a homestead filing guide, and not a punch-list for construction defects. Ask the title company and servicer about your file.",
} as const

export const FIRST_STATEMENT_VS_NOTE = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "Closing Disclosure prepaid interest, escrowed PITI, and first monthly statement. Not a rate-change notice.",
  whyDifferent:
    "The note rate prices principal and interest. The first mortgage statement is usually PITI: that P&I plus the escrow (impound) portion for taxes and insurance, and mortgage insurance when it applies. The total due is supposed to look larger than note-rate P&I alone.",
  oddDays:
    "Interest from the funding date through the end of that month is typically collected as prepaid interest at closing (odd days). That is why the first regular payment is often skipped until the next cycle. It is not a free month and not a rate change.",
  escrow:
    "The monthly escrow line is an estimate until the first analysis. Utah’s once-a-year tax bill makes that first analysis noisy. See the tax calendar, cushion, and shortage guides. A higher total payment than the note P&I is expected when escrow is on.",
  notARateChange:
    "A first statement that does not match the note-rate P&I you memorized is usually escrow, odd days, or PMI/MIP — not the lender changing the note. If the P&I line itself is wrong, call the servicer with the note in hand.",
  notAdvice:
    "This page does not quote your first payment. Read the CD and the first statement together. Not tax advice.",
} as const

export const ESCROW_WAIVER = {
  asOf: LENDING_FACTS_AS_OF,
  source:
    "Typical conventional escrow-waiver overlays vs required impounds on FHA, VA, and many high-LTV files. Confirm the investor and state. Not a promise you can waive.",
  impounds:
    "Impounds (escrow, impound account) mean the servicer collects a monthly share of property taxes and homeowners insurance with the P&I, then pays those bills. Required on many government loans and many high-LTV conventional files.",
  waiver:
    "A conventional escrow waiver, when it exists, is an overlay: often enough equity (commonly discussed around 20% down / 80% LTV), a clean housing history, and sometimes a fee or a slightly different price. It is not a federal right, not automatic at 20%, and not available on every product.",
  government:
    "FHA, VA, and USDA files commonly require escrow for taxes and insurance. Do not assume a government loan can waive impounds because a conventional friend did.",
  tradeoff:
    "Waiving escrow lowers the monthly draft and raises cash you must have when the tax and insurance bills arrive (Utah typically November for taxes). Keeping escrow raises the monthly payment and spreads those bills. Cash-to-close at origination also changes because an escrow cushion may be collected — see how the cushion is set.",
  notAPromise:
    "This page does not promise you can waive escrow, quote a waiver fee, or tell you which option is cheaper. Shortage and surplus still happen on impounded loans. See escrow shortage after the first year.",
} as const
