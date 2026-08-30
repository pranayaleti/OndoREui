import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import {
  assertContentGraph,
  getAllContentNodes,
  getContentNodeByPath,
  relatedLinksForPath,
} from "./index"
import {
  ARM_CAPS,
  DISCOUNT_POINTS,
  DTI_HOA,
  FHA_CONDO_ROSTER,
  K1_INCOME,
  LARGE_DEPOSITS,
  LENDING_FACTS_AS_OF,
  MORTGAGE_INSURANCE_EXIT,
  NEW_DEBT_UNDERWRITING,
  NON_QM,
  PMI_REMOVAL,
  PREAPPROVAL_STAGES,
  QUALIFY_CONVERSATION,
  SPOUSE_INCOME_OFFSET,
  STREAMLINE_REFI,
  STUDENT_LOAN_DTI,
  TEMPORARY_BUYDOWN,
  VA_FUNDING_FEE,
  WAIT_FOR_20_DOWN,
  ALTERNATIVE_CREDIT,
  APR_VS_RATE,
  ASSET_DEPLETION,
  BIWEEKLY_VS_REFI,
  BUSINESS_PERSONAL_COMINGLING,
  CASH_OUT_TO_RENTAL,
  COMPENSATING_FACTORS,
  CPA_LETTER_VS_RETURNS,
  CROSS_COLLATERAL,
  DEPRECIATION_ADD_BACK,
  DSCR_VS_FULL_DOC,
  EARNEST_VS_DOWN_VS_CLOSING,
  ESCROW_CUSHION,
  FHA_HOUSE_HACK,
  FIRST_RENTAL_OCCUPANCY,
  GIG_PLUS_W2,
  HELOC_SEASONING,
  ITIN_DOCUMENTATION,
  LOCK_VS_FLOAT,
  MEDICAL_COLLECTIONS,
  NO_CLOSING_COST_REFI,
  OCCUPANCY_TYPES,
  RELOCATION_SEASONING,
  RESERVES_PITIA,
  RURAL_VETERAN_COMPARE,
  TOWNHOME_VS_CONDO,
  TRI_MERGE,
  UTAH_REPC,
  UTAH_TAX_CALENDAR,
  VA_ENTITLEMENT_RESTORATION,
  CONFORMING_LIMIT_NOTE,
  CONVENTIONAL_SNAPSHOT,
  USDA_SNAPSHOT,
  FHFA_LOOKUP,
  UTAH_CLOSING_NOTES,
  NEWS_AVERAGE_VS_QUOTE,
  LOCK_IF_RATES_DROP,
  ESCROW_SHORTAGE,
  HILL_AFB_VA,
  DELAYED_FINANCING,
  COSIGN_VS_COBORROWER,
  FTHB_FILE_MISTAKES,
  PURCHASE_TIMELINE,
  CLOSING_CREDIT_CARD,
  HAZARD_HO3_HO6,
} from "./lending-facts"

const RESTRICTED = /guaranteed approval|you will qualify|best rate|lowest rate guaranteed/i

describe("mortgage content graph", () => {
  it("has unique ids, unique paths, and valid related ids", () => {
    expect(assertContentGraph()).toEqual([])
  })

  it("does not use restricted lending promises in titles or descriptions", () => {
    for (const node of getAllContentNodes()) {
      expect(`${node.title} ${node.description}`, node.id).not.toMatch(RESTRICTED)
    }
  })

  it("resolves the variable-income cluster to supporting guides and a calculator", () => {
    const pillar = getContentNodeByPath("/learn/variable-income/")
    expect(pillar?.kind).toBe("pillar")
    const links = relatedLinksForPath("/learn/variable-income", { limit: 8 })
    const hrefs = links.map((link) => link.href)
    expect(hrefs).toContain("/blog/can-i-get-a-mortgage-if-my-income-changes-every-month")
    expect(hrefs).toContain("/calculators/income")
  })

  it("keeps lending snapshots dated so they are easy to refresh", () => {
    expect(LENDING_FACTS_AS_OF).toMatch(/^\d{4}-\d{2}$/)
    expect(VA_FUNDING_FEE.asOf).toBe(LENDING_FACTS_AS_OF)
    expect(VA_FUNDING_FEE.exemptionNote.length).toBeGreaterThan(20)
    expect(CONFORMING_LIMIT_NOTE).not.toMatch(/\$\d{3},\d{3}/)
    expect(CONVENTIONAL_SNAPSHOT.dtiNote).toMatch(/not a ceiling/i)
    expect(USDA_SNAPSHOT.upfrontGuaranteeFee).toMatch(/1\.00%/)
    expect(FHFA_LOOKUP.officialUrl).toMatch(/fhfa\.gov/)
    expect(UTAH_CLOSING_NOTES.transferTax).toMatch(/does not levy a statewide/i)
    expect(K1_INCOME.asOf).toBe(LENDING_FACTS_AS_OF)
    expect(STUDENT_LOAN_DTI.saveNote).toMatch(/not a 2024 blog post/i)
    expect(MORTGAGE_INSURANCE_EXIT.notWaitFor20).toMatch(/20% down/i)
    expect(STREAMLINE_REFI.fha).toMatch(/not a no-docs product/i)
    expect(ARM_CAPS.notation).toMatch(/2\/1\/5/)
    expect(FHA_CONDO_ROSTER.rosterUrl).toMatch(/hud\.gov/)
    expect(LARGE_DEPOSITS.window).toMatch(/60 days/)
    expect(WAIT_FOR_20_DOWN.notMipExit).toMatch(/wait for 20%/i)
    expect(PMI_REMOVAL.notWaitFor20).toMatch(/20% down/i)
    expect(DISCOUNT_POINTS.notBestRate).toMatch(/best rate/i)
    expect(TEMPORARY_BUYDOWN.notDiscountPoints).toMatch(/discount points/i)
    expect(NEW_DEBT_UNDERWRITING.autoLoan).toMatch(/auto loan/i)
    expect(DTI_HOA.frontEnd).toMatch(/HOA/i)
    expect(PREAPPROVAL_STAGES.notTheSame).toMatch(/three different/i)
    expect(SPOUSE_INCOME_OFFSET.utahNotCommunityProperty).toMatch(/not a community-property state/i)
    expect(QUALIFY_CONVERSATION.notPromised).toMatch(/does not approve you/i)
    expect(NON_QM.notAgency).toMatch(/Non-QM is a conversation/i)
    expect(DSCR_VS_FULL_DOC.occupancy).toMatch(/occupancy misrepresentation/i)
    expect(BUSINESS_PERSONAL_COMINGLING.seasoning).toMatch(/60 days/i)
    expect(UTAH_REPC.timeOfEssence).toMatch(/5:00 p\.m\. Mountain Time/i)
    expect(OCCUPANCY_TYPES.fraud).toMatch(/occupancy fraud/i)
    expect(CASH_OUT_TO_RENTAL.ltvTrap).toMatch(/Two LTVs/i)
    expect(MEDICAL_COLLECTIONS.noPromise).toMatch(/does not say/i)
    expect(ALTERNATIVE_CREDIT.fairHousing).toMatch(/protected/i)
    expect(FHA_HOUSE_HACK.duplexVs34).toMatch(/not to a typical two-unit/i)
    expect(RELOCATION_SEASONING.question60Days).toMatch(/not a published/i)
    expect(APR_VS_RATE.notATable).toMatch(/live-rate table/i)
    expect(VA_ENTITLEMENT_RESTORATION.notADollar).toMatch(/does not quote/i)
    expect(CPA_LETTER_VS_RETURNS.whatDoesNot).toMatch(/not a substitute/i)
    expect(LOCK_VS_FLOAT.notARate).toMatch(/does not publish current rates/i)
    expect(NO_CLOSING_COST_REFI.tradeoff).toMatch(/cost is in the rate/i)
    expect(TRI_MERGE.middleScore).toMatch(/middle score/i)
    expect(EARNEST_VS_DOWN_VS_CLOSING.earnest).toMatch(/applied at settlement/i)
    expect(TOWNHOME_VS_CONDO.legal).toMatch(/Do not treat every townhome as a condo/i)
    expect(RESERVES_PITIA.notCashToClose).toMatch(/not extra closing costs/i)
    expect(ASSET_DEPLETION.what).toMatch(/not “you have cash, so you are approved/i)
    expect(GIG_PLUS_W2.method).toMatch(/separate streams/i)
    expect(DEPRECIATION_ADD_BACK.notTaxAdvice).toMatch(/not tax advice/i)
    expect(COMPENSATING_FACTORS.notAGuarantee).toMatch(/not a guarantee/i)
    expect(UTAH_TAX_CALENDAR.dueDate).toMatch(/November 30/)
    expect(ESCROW_CUSHION.maxCushion).toMatch(/1\/6/)
    expect(ESCROW_CUSHION.notUniversal).toMatch(/not a universal servicer formula/i)
    expect(RURAL_VETERAN_COMPARE.notAPick).toMatch(/not a recommendation/i)
    expect(HELOC_SEASONING.notAFederalWait).toMatch(/not a federal waiting period/i)
    expect(CROSS_COLLATERAL.notInvented).toMatch(/not a published product you can assume/i)
    expect(BIWEEKLY_VS_REFI.noPromise).toMatch(/does not quote a dollar of interest saved/i)
    expect(FIRST_RENTAL_OCCUPANCY.notHouseHack).toMatch(/not a duplex house-hack/i)
    expect(ITIN_DOCUMENTATION.notNationalOrigin).toMatch(/not a proxy for national origin/i)
    expect(ITIN_DOCUMENTATION.noEasier).toMatch(/does not say a file is easier/i)
    expect(NEWS_AVERAGE_VS_QUOTE.notATable).toMatch(/does not publish a fake live-rate table/i)
    expect(NEWS_AVERAGE_VS_QUOTE.officialUrl).toMatch(/freddiemac.com\/pmms/)
    expect(LOCK_IF_RATES_DROP.notAutomatic).toMatch(/do not automatically get the lower rate/i)
    expect(LOCK_IF_RATES_DROP.vsExtension).toMatch(/different desks/i)
    expect(ESCROW_SHORTAGE.options).toMatch(/lump sum/i)
    expect(ESCROW_SHORTAGE.notAdvice).toMatch(/not tax advice/i)
    expect(HILL_AFB_VA.where).toMatch(/Davis County/i)
    expect(HILL_AFB_VA.bah).toMatch(/does not publish BAH dollars/i)
    expect(DELAYED_FINANCING.notInvented).toMatch(/not invent an overlay as if it were a statute/i)
    expect(DELAYED_FINANCING.what).toMatch(/B2-1\.3-03|six months/i)
    expect(COSIGN_VS_COBORROWER.fairHousing).toMatch(/not require a spouse/i)
    expect(FTHB_FILE_MISTAKES.notLifestyle).toMatch(/does not clone/i)
    expect(PURCHASE_TIMELINE.notAPromise).toMatch(/not a closing-date guarantee/i)
    expect(CLOSING_CREDIT_CARD.notARaise).toMatch(/does not say closing a card will raise/i)
    expect(HAZARD_HO3_HO6.notAdvice).toMatch(/not insurance advice/i)
  })

  it("does not hard-code a dollar conforming limit on jumbo or FHA-vs-conventional pages", () => {
    const stale = /\$\d{3},\d{3}\s*(conforming|loan limit|Utah conforming)/i
    const files = [
      "app/loans/jumbo/page.tsx",
      "app/blog/fha-vs-conventional-loans-utah/page.tsx",
    ]
    for (const file of files) {
      const text = readFileSync(join(process.cwd(), file), "utf8")
      expect(text, file).not.toMatch(stale)
      expect(text, file).toMatch(/CONFORMING_LIMIT_NOTE/)
    }
  })

  it("resolves first-time and VA clusters to supporting guides", () => {
    const firstTime = getContentNodeByPath("/learn/first-time")
    expect(firstTime?.kind).toBe("pillar")
    const firstHrefs = relatedLinksForPath("/learn/first-time", { limit: 8 }).map((link) => link.href)
    expect(firstHrefs).toContain("/blog/utah-cash-to-close-besides-down-payment")
    expect(firstHrefs).toContain("/blog/dpa-stacked-with-fha-gift-funds")
    expect(firstHrefs).toContain("/blog/parent-gifting-down-payment-who-signs")

    const vaHrefs = relatedLinksForPath("/loans/va", { limit: 8 }).map((link) => link.href)
    expect(vaHrefs).toContain("/blog/va-funding-fee-finance-vs-pay-cash")
    expect(vaHrefs).toContain("/blog/va-entitlement-second-va-loan")
    expect(vaHrefs).toContain("/blog/va-residual-income-vs-dti")
  })

  it("registers batch-3 education slugs and wires commercial pages", () => {
    const slugs = [
      "/blog/k-1-income-what-usually-counts",
      "/blog/schedule-e-rental-income-purchase-file",
      "/blog/just-went-1099-last-month",
      "/blog/parent-gifting-down-payment-who-signs",
      "/blog/student-loans-dti-idr-save",
      "/blog/arm-caps-in-plain-english",
      "/blog/fha-condo-roster-project-approval",
      "/blog/mip-vs-pmi-how-mortgage-insurance-ends",
      "/blog/fha-va-streamline-refinance-less-docs",
      "/blog/large-deposits-60-day-paper-trail",
    ]
    for (const path of slugs) {
      expect(getContentNodeByPath(path)?.kind, path).toBe("guide")
    }

    const variableHrefs = relatedLinksForPath("/learn/variable-income", { limit: 8 }).map((link) => link.href)
    expect(variableHrefs).toContain("/blog/k-1-income-what-usually-counts")
    expect(variableHrefs).toContain("/blog/just-went-1099-last-month")

    const fhaHrefs = relatedLinksForPath("/loans/fha", { limit: 8 }).map((link) => link.href)
    expect(fhaHrefs).toContain("/blog/fha-condo-roster-project-approval")
    expect(fhaHrefs).toContain("/blog/mip-vs-pmi-how-mortgage-insurance-ends")

    const convHrefs = relatedLinksForPath("/loans/conventional", { limit: 8 }).map((link) => link.href)
    expect(convHrefs).toContain("/blog/mip-vs-pmi-how-mortgage-insurance-ends")

    const refiHrefs = relatedLinksForPath("/refinance", { limit: 8 }).map((link) => link.href)
    expect(refiHrefs).toContain("/blog/fha-va-streamline-refinance-less-docs")

    const armHrefs = relatedLinksForPath("/buy/adjustable-rate", { limit: 8 }).map((link) => link.href)
    expect(armHrefs).toContain("/blog/arm-caps-in-plain-english")
  })

  it("registers batch-4 education slugs and wires PMI / rates / underwriting / Non-QM clusters", () => {
    const slugs = [
      "/blog/should-i-wait-for-20-percent-down",
      "/blog/pmi-removal-original-value-vs-new-appraisal",
      "/blog/discount-points-breakeven-without-sales-pitch",
      "/blog/what-a-mortgage-conversation-asks",
      "/blog/new-auto-loan-during-underwriting",
      "/blog/dti-frontend-backend-with-hoa",
      "/blog/pre-approval-vs-aus-vs-clear-to-close",
      "/blog/spouse-w2-offset-1099-volatility",
      "/blog/temporary-buydown-who-pays-year-three",
    ]
    for (const path of slugs) {
      expect(getContentNodeByPath(path)?.kind, path).toBe("guide")
    }

    expect(getContentNodeByPath("/learn/non-qm")?.kind).toBe("pillar")
    expect(getContentNodeByPath("/qualify")?.kind).toBe("conversion")

    const firstHrefs = relatedLinksForPath("/learn/first-time", { limit: 8 }).map((link) => link.href)
    expect(firstHrefs).toContain("/blog/should-i-wait-for-20-percent-down")

    const convHrefs = relatedLinksForPath("/loans/conventional", { limit: 8 }).map((link) => link.href)
    expect(convHrefs).toContain("/blog/should-i-wait-for-20-percent-down")
    expect(convHrefs).toContain("/blog/pmi-removal-original-value-vs-new-appraisal")

    const mipHrefs = relatedLinksForPath("/blog/mip-vs-pmi-how-mortgage-insurance-ends", { limit: 8 }).map(
      (link) => link.href,
    )
    expect(mipHrefs).toContain("/blog/should-i-wait-for-20-percent-down")
    expect(mipHrefs).toContain("/blog/pmi-removal-original-value-vs-new-appraisal")

    const ratesHrefs = relatedLinksForPath("/buy/rates", { limit: 8 }).map((link) => link.href)
    expect(ratesHrefs).toContain("/blog/discount-points-breakeven-without-sales-pitch")
    expect(ratesHrefs).toContain("/blog/temporary-buydown-who-pays-year-three")

    const nonQmHrefs = relatedLinksForPath("/learn/non-qm", { limit: 8 }).map((link) => link.href)
    expect(nonQmHrefs).toContain("/blog/bank-statement-loans-when-tax-returns-undercount-income")
    expect(nonQmHrefs).toContain("/blog/just-went-1099-last-month")
    expect(nonQmHrefs).toContain("/blog/k-1-income-what-usually-counts")

    const declinedHrefs = relatedLinksForPath("/blog/declined-after-pre-approval", { limit: 8 }).map((link) => link.href)
    expect(declinedHrefs).toContain("/blog/new-auto-loan-during-underwriting")
    expect(declinedHrefs).toContain("/blog/pre-approval-vs-aus-vs-clear-to-close")

    const qualifyHrefs = relatedLinksForPath("/qualify", { limit: 8 }).map((link) => link.href)
    expect(qualifyHrefs).toContain("/blog/what-a-mortgage-conversation-asks")

    const variableHrefs = relatedLinksForPath("/learn/variable-income", { limit: 8 }).map((link) => link.href)
    expect(variableHrefs).toContain("/blog/spouse-w2-offset-1099-volatility")

    const affordHrefs = relatedLinksForPath("/calculators/affordability", { limit: 8 }).map((link) => link.href)
    expect(affordHrefs).toContain("/blog/dti-frontend-backend-with-hoa")
  })

  it("registers batch-5 education slugs and wires investment / credit / Utah / rates clusters", () => {
    const slugs = [
      "/blog/dscr-vs-full-doc-rental-loan",
      "/blog/business-vs-personal-bank-co-mingling",
      "/blog/utah-repc-deadline-and-your-loan",
      "/blog/second-home-vs-investment-occupancy",
      "/blog/cash-out-to-buy-a-rental",
      "/blog/medical-collections-after-fico-model-change",
      "/blog/no-traditional-credit-alternative-credit",
      "/blog/house-hacking-duplex-with-fha",
      "/blog/relocating-to-utah-job-seasoning",
      "/blog/apr-vs-rate-on-a-loan-estimate",
    ]
    for (const path of slugs) {
      expect(getContentNodeByPath(path)?.kind, path).toBe("guide")
    }

    expect(getContentNodeByPath("/learn/investment")?.kind).toBe("pillar")

    const investHrefs = relatedLinksForPath("/learn/investment", { limit: 8 }).map((link) => link.href)
    expect(investHrefs).toContain("/blog/dscr-vs-full-doc-rental-loan")
    expect(investHrefs).toContain("/blog/second-home-vs-investment-occupancy")
    expect(investHrefs).toContain("/blog/cash-out-to-buy-a-rental")
    expect(investHrefs).toContain("/blog/house-hacking-duplex-with-fha")

    const nonQmHrefs = relatedLinksForPath("/learn/non-qm", { limit: 8 }).map((link) => link.href)
    expect(nonQmHrefs).toContain("/blog/dscr-vs-full-doc-rental-loan")

    const fhaHrefs = relatedLinksForPath("/loans/fha", { limit: 8 }).map((link) => link.href)
    expect(fhaHrefs).toContain("/blog/house-hacking-duplex-with-fha")

    const cashOutHrefs = relatedLinksForPath("/refinance/cash-out", { limit: 8 }).map((link) => link.href)
    expect(cashOutHrefs).toContain("/blog/cash-out-to-buy-a-rental")

    const ratesHrefs = relatedLinksForPath("/buy/rates", { limit: 8 }).map((link) => link.href)
    expect(ratesHrefs).toContain("/blog/apr-vs-rate-on-a-loan-estimate")

    const firstHrefs = relatedLinksForPath("/learn/first-time", { limit: 8 }).map((link) => link.href)
    expect(firstHrefs).toContain("/blog/utah-repc-deadline-and-your-loan")

    const variableHrefs = relatedLinksForPath("/learn/variable-income", { limit: 8 }).map((link) => link.href)
    expect(variableHrefs).toContain("/blog/business-vs-personal-bank-co-mingling")

    const dscrHrefs = relatedLinksForPath("/calculators/dscr", { limit: 8 }).map((link) => link.href)
    expect(dscrHrefs).toContain("/blog/dscr-vs-full-doc-rental-loan")
  })

  it("registers batch-6 education slugs and wires VA restoration / lock / Non-QM / FTHB clusters", () => {
    const slugs = [
      "/blog/selling-with-va-loan-entitlement-restoration",
      "/blog/cpa-letter-vs-tax-returns-underwriting",
      "/blog/rate-lock-extension-vs-floating",
      "/blog/no-closing-cost-refinance-rate-credit-tradeoff",
      "/blog/what-a-tri-merge-credit-report-shows",
      "/blog/earnest-money-vs-down-payment-vs-closing-costs",
      "/blog/townhome-vs-condo-hoa-docs-lenders-ask",
      "/blog/mortgage-reserves-months-of-pitia",
      "/blog/asset-depletion-qualifying-non-qm",
      "/blog/gig-plus-w2-income-mortgage-average",
    ]
    for (const path of slugs) {
      expect(getContentNodeByPath(path)?.kind, path).toBe("guide")
    }

    const vaHrefs = relatedLinksForPath("/loans/va", { limit: 8 }).map((link) => link.href)
    expect(vaHrefs).toContain("/blog/selling-with-va-loan-entitlement-restoration")
    expect(vaHrefs).toContain("/blog/va-entitlement-second-va-loan")

    const variableHrefs = relatedLinksForPath("/learn/variable-income", { limit: 8 }).map((link) => link.href)
    expect(variableHrefs).toContain("/blog/cpa-letter-vs-tax-returns-underwriting")
    expect(variableHrefs).toContain("/blog/gig-plus-w2-income-mortgage-average")

    const ratesHrefs = relatedLinksForPath("/buy/rates", { limit: 8 }).map((link) => link.href)
    expect(ratesHrefs).toContain("/blog/rate-lock-extension-vs-floating")
    expect(ratesHrefs).toContain("/blog/apr-vs-rate-on-a-loan-estimate")

    const refiHrefs = relatedLinksForPath("/refinance", { limit: 8 }).map((link) => link.href)
    expect(refiHrefs).toContain("/blog/no-closing-cost-refinance-rate-credit-tradeoff")
    expect(refiHrefs).toContain("/blog/refinance-break-even-when-lower-rate-loses")

    const firstHrefs = relatedLinksForPath("/learn/first-time", { limit: 8 }).map((link) => link.href)
    expect(firstHrefs).toContain("/blog/earnest-money-vs-down-payment-vs-closing-costs")
    expect(firstHrefs).toContain("/blog/mortgage-reserves-months-of-pitia")

    const fhaHrefs = relatedLinksForPath("/loans/fha", { limit: 8 }).map((link) => link.href)
    expect(fhaHrefs).toContain("/blog/townhome-vs-condo-hoa-docs-lenders-ask")
    expect(fhaHrefs).toContain("/blog/fha-condo-roster-project-approval")

    const nonQmHrefs = relatedLinksForPath("/learn/non-qm", { limit: 8 }).map((link) => link.href)
    expect(nonQmHrefs).toContain("/blog/asset-depletion-qualifying-non-qm")

    const declinedHrefs = relatedLinksForPath("/blog/declined-after-pre-approval", { limit: 8 }).map((link) => link.href)
    expect(declinedHrefs).toContain("/blog/what-a-tri-merge-credit-report-shows")
  })

  it("registers batch-7 education slugs and wires investment / escrow / VA / refinance clusters", () => {
    const slugs = [
      "/blog/first-rental-occupancy-if-you-still-live-there",
      "/blog/depreciation-add-back-schedule-e",
      "/blog/compensating-factors-in-aus-findings",
      "/blog/utah-property-tax-calendar-first-escrow-analysis",
      "/blog/escrow-cushion-how-it-is-set",
      "/blog/usda-vs-va-vs-fha-veteran-rural",
      "/blog/heloc-after-year-two-vs-cash-out",
      "/blog/cross-collateral-equity-to-buy-another-house",
      "/blog/biweekly-extra-principal-vs-refinance",
      "/blog/itin-non-us-citizen-mortgage-documentation",
    ]
    for (const path of slugs) {
      expect(getContentNodeByPath(path)?.kind, path).toBe("guide")
    }

    expect(getContentNodeByPath("/faq/escrow-faqs")?.kind).toBe("faq")

    const investHrefs = relatedLinksForPath("/learn/investment", { limit: 8 }).map((link) => link.href)
    expect(investHrefs).toContain("/blog/first-rental-occupancy-if-you-still-live-there")
    expect(investHrefs).toContain("/blog/depreciation-add-back-schedule-e")
    expect(investHrefs).toContain("/blog/cross-collateral-equity-to-buy-another-house")
    expect(investHrefs).toContain("/blog/dscr-vs-full-doc-rental-loan")
    expect(investHrefs).toContain("/blog/house-hacking-duplex-with-fha")

    const vaHrefs = relatedLinksForPath("/loans/va", { limit: 8 }).map((link) => link.href)
    expect(vaHrefs).toContain("/blog/usda-vs-va-vs-fha-veteran-rural")
    expect(vaHrefs).toContain("/blog/va-funding-fee-finance-vs-pay-cash")

    const usdaHrefs = relatedLinksForPath("/loans/usda", { limit: 8 }).map((link) => link.href)
    expect(usdaHrefs).toContain("/blog/usda-vs-va-vs-fha-veteran-rural")

    const fhaHrefs = relatedLinksForPath("/loans/fha", { limit: 8 }).map((link) => link.href)
    expect(fhaHrefs).toContain("/blog/usda-vs-va-vs-fha-veteran-rural")
    expect(fhaHrefs).toContain("/blog/house-hacking-duplex-with-fha")

    const refiHrefs = relatedLinksForPath("/refinance", { limit: 8 }).map((link) => link.href)
    expect(refiHrefs).toContain("/blog/biweekly-extra-principal-vs-refinance")
    expect(refiHrefs).toContain("/blog/heloc-after-year-two-vs-cash-out")
    expect(refiHrefs).toContain("/blog/refinance-break-even-when-lower-rate-loses")

    const helocHrefs = relatedLinksForPath("/loans/heloc", { limit: 8 }).map((link) => link.href)
    expect(helocHrefs).toContain("/blog/heloc-after-year-two-vs-cash-out")
    expect(helocHrefs).toContain("/blog/heloc-vs-cash-out-refinance")

    const declinedHrefs = relatedLinksForPath("/blog/declined-after-pre-approval", { limit: 8 }).map((link) => link.href)
    expect(declinedHrefs).toContain("/blog/compensating-factors-in-aus-findings")

    const closingHrefs = relatedLinksForPath("/blog/utah-closing-costs-title-origination-prepaids", { limit: 8 }).map(
      (link) => link.href,
    )
    expect(closingHrefs).toContain("/blog/utah-property-tax-calendar-first-escrow-analysis")
    expect(closingHrefs).toContain("/blog/escrow-cushion-how-it-is-set")

    const nonQmHrefs = relatedLinksForPath("/learn/non-qm", { limit: 8 }).map((link) => link.href)
    expect(nonQmHrefs).toContain("/blog/itin-non-us-citizen-mortgage-documentation")
    expect(nonQmHrefs).toContain("/blog/asset-depletion-qualifying-non-qm")
  })

  it("does not invent VA or USDA fee percents on the rural veteran comparison page", () => {
    const text = readFileSync(join(process.cwd(), "app/blog/usda-vs-va-vs-fha-veteran-rural/page.tsx"), "utf8")
    expect(text).toMatch(/VA_FUNDING_FEE/)
    expect(text).toMatch(/USDA_SNAPSHOT/)
    expect(text).toMatch(/FHA_SNAPSHOT/)
    expect(text).not.toMatch(/firstUseLessThan5PercentDown:\s*["']\d/)
  })

  it("does not coach occupancy misrepresentation on the first-rental occupancy page", () => {
    const text = readFileSync(
      join(process.cwd(), "app/blog/first-rental-occupancy-if-you-still-live-there/page.tsx"),
      "utf8",
    )
    expect(text).toMatch(/OCCUPANCY_TYPES/)
    expect(text).toMatch(/FIRST_RENTAL_OCCUPANCY/)
    expect(text).toMatch(/house-hacking-duplex-with-fha/)
    expect(text).toMatch(/second-home-vs-investment-occupancy/)
    expect(text).not.toMatch(/live there (14|15) days/i)
  })

  it("keeps ITIN documentation Fair Housing safe and dated", () => {
    const text = readFileSync(
      join(process.cwd(), "app/blog/itin-non-us-citizen-mortgage-documentation/page.tsx"),
      "utf8",
    )
    expect(text).toMatch(/ITIN_DOCUMENTATION/)
    expect(text).not.toMatch(/easier if you(?:'re| are)/i)
    expect(text).not.toMatch(/prefer (?:borrowers|clients) from/i)
  })

  it("does not invent VA entitlement dollars on the restoration page", () => {
    const text = readFileSync(
      join(process.cwd(), "app/blog/selling-with-va-loan-entitlement-restoration/page.tsx"),
      "utf8",
    )
    expect(text).not.toMatch(/\$\d{2,3},\d{3}/)
    expect(text).toMatch(/VA_ENTITLEMENT_RESTORATION/)
    expect(text).toMatch(/va-entitlement-second-va-loan/)
  })

  it("does not hard-code a dollar conforming limit on jumbo how-to pages", () => {
    const stale = /\$\d{3},\d{3}/
    const files = [
      "app/blog/jumbo-vs-conforming-fhfa-county-limit/page.tsx",
      "app/blog/utah-county-conforming-loan-limit-lookup/page.tsx",
    ]
    for (const file of files) {
      const text = readFileSync(join(process.cwd(), file), "utf8")
      expect(text, file).not.toMatch(stale)
    }
  })

  it("registers batch-8 education slugs and wires rates / escrow / VA / FTHB / insurance clusters", () => {
    const slugs = [
      "/blog/rate-lock-if-rates-drop",
      "/blog/escrow-shortage-after-first-year",
      "/blog/hill-afb-va-coe-occupancy",
      "/blog/delayed-financing-after-cash-purchase",
      "/blog/cosign-vs-co-borrower",
      "/blog/first-time-buyer-file-mistakes",
      "/blog/how-long-first-purchase-takes",
      "/blog/closing-credit-card-before-mortgage",
      "/blog/hazard-vs-ho3-vs-ho6-condo-insurance",
    ]
    for (const path of slugs) {
      expect(getContentNodeByPath(path)?.kind, path).toBe("guide")
    }

    const ratesHrefs = relatedLinksForPath("/buy/rates", { limit: 8 }).map((link) => link.href)
    expect(ratesHrefs).toContain("/blog/rate-lock-if-rates-drop")
    expect(ratesHrefs).toContain("/blog/rate-lock-extension-vs-floating")

    const lockHrefs = relatedLinksForPath("/blog/rate-lock-extension-vs-floating", { limit: 8 }).map((link) => link.href)
    expect(lockHrefs).toContain("/blog/rate-lock-if-rates-drop")

    const escrowHrefs = relatedLinksForPath("/faq/escrow-faqs", { limit: 8 }).map((link) => link.href)
    expect(escrowHrefs).toContain("/blog/escrow-shortage-after-first-year")
    expect(escrowHrefs).toContain("/blog/hazard-vs-ho3-vs-ho6-condo-insurance")

    const vaHrefs = relatedLinksForPath("/loans/va", { limit: 8 }).map((link) => link.href)
    expect(vaHrefs).toContain("/blog/hill-afb-va-coe-occupancy")
    expect(vaHrefs).toContain("/blog/va-funding-fee-finance-vs-pay-cash")

    const investHrefs = relatedLinksForPath("/learn/investment", { limit: 10 }).map((link) => link.href)
    expect(investHrefs).toContain("/blog/delayed-financing-after-cash-purchase")

    const refiHrefs = relatedLinksForPath("/refinance", { limit: 8 }).map((link) => link.href)
    expect(refiHrefs).toContain("/blog/delayed-financing-after-cash-purchase")

    const firstHrefs = relatedLinksForPath("/learn/first-time", { limit: 8 }).map((link) => link.href)
    expect(firstHrefs).toContain("/blog/first-time-buyer-file-mistakes")

    const firstHrefsLong = relatedLinksForPath("/learn/first-time", { limit: 12 }).map((link) => link.href)
    expect(firstHrefsLong).toContain("/blog/how-long-first-purchase-takes")

    const fhaHrefs = relatedLinksForPath("/loans/fha", { limit: 8 }).map((link) => link.href)
    expect(fhaHrefs).toContain("/blog/hazard-vs-ho3-vs-ho6-condo-insurance")

    const declinedHrefs = relatedLinksForPath("/blog/declined-after-pre-approval", { limit: 8 }).map((link) => link.href)
    expect(declinedHrefs).toContain("/blog/first-time-buyer-file-mistakes")
  })

  it("does not invent current rates on the rates hub or float-down page", () => {
    const rates = readFileSync(join(process.cwd(), "app/buy/rates/page.tsx"), "utf8")
    expect(rates).toMatch(/NEWS_AVERAGE_VS_QUOTE/)
    expect(rates).toMatch(/rate-lock-if-rates-drop/)
    expect(rates).not.toMatch(/\d\.\d{2}%/)

    const drop = readFileSync(join(process.cwd(), "app/blog/rate-lock-if-rates-drop/page.tsx"), "utf8")
    expect(drop).toMatch(/LOCK_IF_RATES_DROP/)
    expect(drop).toMatch(/rate-lock-extension-vs-floating/)
    expect(drop).not.toMatch(/\d\.\d{2}%/)
  })

  it("keeps Hill AFB VA occupancy and BAH lookup safe", () => {
    const text = readFileSync(join(process.cwd(), "app/blog/hill-afb-va-coe-occupancy/page.tsx"), "utf8")
    expect(text).toMatch(/HILL_AFB_VA/)
    expect(text).toMatch(/OCCUPANCY_TYPES/)
    expect(text).toMatch(/va-entitlement-second-va-loan/)
    expect(text).toMatch(/va-funding-fee-finance-vs-pay-cash/)
    expect(text).not.toMatch(/live there (14|15) days/i)
    expect(text).not.toMatch(/BAH is \$\d/)
  })

  it("does not invent delayed-financing overlay as a statute", () => {
    const text = readFileSync(join(process.cwd(), "app/blog/delayed-financing-after-cash-purchase/page.tsx"), "utf8")
    expect(text).toMatch(/DELAYED_FINANCING/)
    expect(text).toMatch(/B2-1\.3-03/)
    expect(text).toMatch(/heloc-after-year-two-vs-cash-out/)
    expect(text).toMatch(/cash-out-to-buy-a-rental/)
    expect(text).toMatch(/selling-guide exception, not a statute/)
    expect(text).toMatch(/DELAYED_FINANCING\.notInvented/)
  })

  it("treats first-time mistakes as underwriting facts, not a lifestyle listicle", () => {
    const text = readFileSync(join(process.cwd(), "app/blog/first-time-buyer-file-mistakes/page.tsx"), "utf8")
    expect(text).toMatch(/FTHB_FILE_MISTAKES/)
    expect(text).toMatch(/new-auto-loan-during-underwriting/)
    expect(text).toMatch(/large-deposits-60-day-paper-trail/)
    expect(text).toMatch(/second-home-vs-investment-occupancy/)
    expect(text).not.toMatch(/watermelon/i)
  })

  it("does not coach occupancy on delayed financing or treat closing a card as a score-raise", () => {
    const delayed = readFileSync(join(process.cwd(), "app/blog/delayed-financing-after-cash-purchase/page.tsx"), "utf8")
    expect(delayed).toMatch(/OCCUPANCY_TYPES/)
    expect(delayed).not.toMatch(/live there (14|15) days/i)

    const card = readFileSync(join(process.cwd(), "app/blog/closing-credit-card-before-mortgage/page.tsx"), "utf8")
    expect(card).toMatch(/CLOSING_CREDIT_CARD/)
    expect(card).toMatch(/CLOSING_CREDIT_CARD\.notARaise/)
    expect(card).toMatch(/will raise or lower a score by a number of points/)
  })
})
