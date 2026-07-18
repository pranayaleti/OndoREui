import { describe, it, expect } from "vitest";
import {
  calculateMonthlyPI,
  calculateMaxLoanFromPayment,
  calculateTotalInterest,
  estimateRemainingMonths,
  getBuydownRateSchedule,
  calculateTemporaryBuydown,
  calculateRefinance,
  hasCompleteRefinanceInputs,
  getLtv,
  applyFinancedUpfrontToLoan,
  getProgramDTI,
  getProgramMI,
  clampCreditScore,
  DEFAULT_MORTGAGE_RATE,
  type LoanProgram,
} from "./mortgage-utils";

describe("calculateMonthlyPI", () => {
  it("returns 0 for zero-interest loan as equal principal split", () => {
    expect(calculateMonthlyPI(120_000, 0, 30)).toBeCloseTo(120_000 / 360, 5);
  });

  it("non-finite payment when term is 0 with positive rate (amortization undefined; UI should validate)", () => {
    const p = calculateMonthlyPI(100_000, 6.5, 0);
    expect(Number.isFinite(p)).toBe(false);
  });

  it("computes standard fixed-rate payment", () => {
    const pmt = calculateMonthlyPI(400_000, 6.5, 30);
    expect(pmt).toBeGreaterThan(2500);
    expect(pmt).toBeLessThan(2600);
  });

  it("handles small principal without NaN", () => {
    const pmt = calculateMonthlyPI(1, 5, 30);
    expect(Number.isFinite(pmt)).toBe(true);
    expect(pmt).toBeGreaterThan(0);
  });
});

describe("calculateMaxLoanFromPayment", () => {
  it("handles zero rate as payment × months (no NaN)", () => {
    expect(calculateMaxLoanFromPayment(1000, 0, 30)).toBe(1000 * 360);
  });

  it("inverts calculateMonthlyPI for positive rates", () => {
    const principal = 300_000;
    const rate = DEFAULT_MORTGAGE_RATE;
    const term = 30;
    const pmt = calculateMonthlyPI(principal, rate, term);
    expect(calculateMaxLoanFromPayment(pmt, rate, term)).toBeCloseTo(principal, 0);
  });

  it("returns 0 for non-positive payment", () => {
    expect(calculateMaxLoanFromPayment(0, 6.5, 30)).toBe(0);
    expect(calculateMaxLoanFromPayment(-100, 6.5, 30)).toBe(0);
  });
});

describe("temporary buydown", () => {
  it("2-1 schedule steps note−2 then note−1", () => {
    expect(getBuydownRateSchedule("2-1", 6.5)).toEqual([4.5, 5.5]);
  });

  it("3-2-1 schedule steps note−3, −2, −1", () => {
    expect(getBuydownRateSchedule("3-2-1", 6.5)).toEqual([3.5, 4.5, 5.5]);
  });

  it("models subsidy cost as sum of full − temporary payments (not permanent rate cut)", () => {
    const noteRate = 6.5;
    const loan = 300_000;
    const term = 30;
    const result = calculateTemporaryBuydown({
      loanAmount: loan,
      noteRate,
      loanTermYears: term,
      structure: "2-1",
    });
    expect(result).not.toBeNull();
    if (!result) return;

    const full = calculateMonthlyPI(loan, noteRate, term);
    const y1 = calculateMonthlyPI(loan, 4.5, term);
    const y2 = calculateMonthlyPI(loan, 5.5, term);
    const expectedCost = (full - y1) * 12 + (full - y2) * 12;

    expect(result.fullMonthlyPayment).toBeCloseTo(full, 5);
    expect(result.estimatedBuydownCost).toBeCloseTo(expectedCost, 2);
    expect(result.schedule).toHaveLength(2);
    expect(result.effectiveBuydownRate).toBeCloseTo((4.5 + 5.5) / 2, 5);
    // Must be far smaller than a permanent 2pp rate cut over 30 years
    const permanentCutSavings =
      (full - calculateMonthlyPI(loan, 4.5, term)) * term * 12;
    expect(result.estimatedBuydownCost).toBeLessThan(permanentCutSavings / 5);
  });

  it("flat structure requires temporary rate below note rate", () => {
    expect(
      calculateTemporaryBuydown({
        loanAmount: 200_000,
        noteRate: 6.5,
        loanTermYears: 30,
        structure: "flat",
        flatBuydownRate: 6.5,
        flatYears: 2,
      })
    ).toBeNull();
  });

  it("flat 2-year buydown uses constant temporary rate", () => {
    const result = calculateTemporaryBuydown({
      loanAmount: 250_000,
      noteRate: 7,
      loanTermYears: 30,
      structure: "flat",
      flatBuydownRate: 5,
      flatYears: 2,
    });
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.schedule).toHaveLength(2);
    expect(result.schedule[0].ratePercent).toBe(5);
    expect(result.schedule[1].ratePercent).toBe(5);
    expect(result.buydownMonths).toBe(24);
  });
});

describe("refinance helpers", () => {
  it("does not accept incomplete inputs (no silent defaults)", () => {
    expect(
      hasCompleteRefinanceInputs({
        currentBalance: 0,
        currentRate: 7,
        currentPayment: 1600,
        newRate: 6.5,
        newTermYears: 30,
        closingCosts: 3000,
        annualPropertyTax: 3000,
        annualInsurance: 1200,
      })
    ).toBe(false);

    expect(
      calculateRefinance({
        currentBalance: 200_000,
        currentRate: 7,
        currentPayment: 0,
        newRate: 6.5,
        newTermYears: 30,
        closingCosts: 3000,
        annualPropertyTax: 3000,
        annualInsurance: 1200,
      })
    ).toBeNull();
  });

  it("guards zero newRate without NaN", () => {
    const result = calculateRefinance({
      currentBalance: 120_000,
      currentRate: 5,
      currentPayment: 1200,
      newRate: 0,
      newTermYears: 30,
      closingCosts: 2000,
      annualPropertyTax: 2400,
      annualInsurance: 1200,
    });
    expect(result).not.toBeNull();
    if (!result) return;
    expect(Number.isFinite(result.newPI)).toBe(true);
    expect(result.newPI).toBeCloseTo(120_000 / 360, 5);
  });

  it("computes interest savings when remaining term is estimable", () => {
    const balance = 200_000;
    const currentRate = 7;
    const newRate = 5.5;
    const newTerm = 30;
    const tax = 3000;
    const ins = 1200;
    const escrows = tax / 12 + ins / 12;
    // Current P&I roughly matching a prior 30y loan at 7%
    const currentPI = calculateMonthlyPI(balance, currentRate, 25);
    const currentPayment = currentPI + escrows;

    const result = calculateRefinance({
      currentBalance: balance,
      currentRate,
      currentPayment,
      newRate,
      newTermYears: newTerm,
      closingCosts: 3000,
      annualPropertyTax: tax,
      annualInsurance: ins,
    });
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.interestSavings).not.toBeNull();
    expect(result.estimatedRemainingMonths).not.toBeNull();
    expect(result.comparisonMonths).toBeCloseTo(result.estimatedRemainingMonths!, 5);
    // Horizon-aligned: net payment savings uses remaining months, not full new term
    expect(result.comparisonMonths).toBeLessThan(newTerm * 12);
    expect(result.netPaymentSavingsOverNewTerm).not.toBe(result.interestSavings);
    expect(result.extendsTerm).toBe(true);
  });

  it("horizon-aligns net savings so a term reset does not inflate P&I savings", () => {
    const balance = 200_000;
    const currentRate = 7;
    const tax = 0;
    const ins = 0;
    const remainingYears = 10;
    const currentPI = calculateMonthlyPI(balance, currentRate, remainingYears);
    const result = calculateRefinance({
      currentBalance: balance,
      currentRate,
      currentPayment: currentPI,
      newRate: 5.5,
      newTermYears: 30,
      closingCosts: 3000,
      annualPropertyTax: tax,
      annualInsurance: ins,
    });
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.extendsTerm).toBe(true);
    expect(result.comparisonMonths).toBeCloseTo(remainingYears * 12, 0);
    const inflated = (result.currentPI - result.newPI) * 360 - 3000;
    expect(result.netPaymentSavingsOverNewTerm).toBeLessThan(inflated);
  });

  it("is not beneficial when monthly payment does not decrease", () => {
    const balance = 200_000;
    const currentRate = 4;
    const tax = 0;
    const ins = 0;
    // Short remaining term → low payment; refi to same rate but keep short term vs higher rate long term
    const currentPI = calculateMonthlyPI(balance, currentRate, 15);
    const result = calculateRefinance({
      currentBalance: balance,
      currentRate,
      currentPayment: currentPI,
      newRate: 6.5,
      newTermYears: 15,
      closingCosts: 3000,
      annualPropertyTax: tax,
      annualInsurance: ins,
    });
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.monthlyPaymentSavings).toBeLessThan(0);
    expect(result.isBeneficial).toBe(false);
  });

  it("gates isBeneficial on lower payment, interest savings, and break-even", () => {
    const balance = 200_000;
    const currentRate = 7;
    const tax = 2400;
    const ins = 1200;
    const escrows = tax / 12 + ins / 12;
    const currentPI = calculateMonthlyPI(balance, currentRate, 25);
    const result = calculateRefinance({
      currentBalance: balance,
      currentRate,
      currentPayment: currentPI + escrows,
      newRate: 5.5,
      newTermYears: 25,
      closingCosts: 2000,
      annualPropertyTax: tax,
      annualInsurance: ins,
    });
    expect(result).not.toBeNull();
    if (!result) return;
    expect(result.monthlyPaymentSavings).toBeGreaterThan(0);
    expect(result.interestSavings).toBeGreaterThan(0);
    expect(result.breakEvenMonths).not.toBeNull();
    expect(result.isBeneficial).toBe(true);
  });

  it("estimateRemainingMonths matches payment formula inversion", () => {
    const balance = 250_000;
    const rate = 6.5;
    const termYears = 20;
    const pmt = calculateMonthlyPI(balance, rate, termYears);
    const months = estimateRemainingMonths(balance, rate, pmt);
    expect(months).not.toBeNull();
    expect(months!).toBeCloseTo(termYears * 12, 5);
  });

  it("calculateTotalInterest is payment×n − principal", () => {
    const interest = calculateTotalInterest(100_000, 6, 15);
    const pmt = calculateMonthlyPI(100_000, 6, 15);
    expect(interest).toBeCloseTo(pmt * 180 - 100_000, 2);
  });
});

describe("getLtv", () => {
  it("returns 0 for non-positive home price", () => {
    expect(getLtv(0, 0)).toBe(0);
    expect(getLtv(-100, 0)).toBe(0);
  });

  it("clamps loan to non-negative", () => {
    expect(getLtv(200_000, 250_000)).toBe(0);
  });

  it("computes LTV for typical down payment", () => {
    expect(getLtv(400_000, 80_000)).toBeCloseTo(0.8, 6);
  });
});

describe("applyFinancedUpfrontToLoan", () => {
  it("adds upfront fee when financed", () => {
    expect(applyFinancedUpfrontToLoan(100_000, 1750, true)).toBe(101_750);
  });

  it("does not add when not financed", () => {
    expect(applyFinancedUpfrontToLoan(100_000, 1750, false)).toBe(100_000);
  });
});

describe("getProgramDTI", () => {
  it.each<[LoanProgram, number, number]>([
    ["conventional", 28, 36],
    ["fha", 31, 43],
    ["va", 0, 41],
    ["usda", 29, 41],
  ])("returns expected DTI bands for %s", (program, front, back) => {
    const dti = getProgramDTI(program);
    expect(dti.frontPercent).toBe(front);
    expect(dti.backPercent).toBe(back);
  });
});

describe("getProgramMI", () => {
  it("returns no PMI for conventional when LTV < 80%", () => {
    const mi = getProgramMI("conventional", 320_000, 400_000, 760, 30, 100_000);
    expect(mi.monthlyMI).toBe(0);
    expect(mi.description).toContain("No PMI");
  });

  it("charges FHA upfront and monthly MIP", () => {
    const mi = getProgramMI("fha", 300_000, 320_000, 720, 30, 20_000);
    expect(mi.upfrontFee).toBeCloseTo(300_000 * 0.0175, 2);
    expect(mi.monthlyMI).toBeGreaterThan(0);
  });

  it("VA has no monthly MI but funding fee", () => {
    const mi = getProgramMI("va", 400_000, 500_000, 740, 30, 0);
    expect(mi.monthlyMI).toBe(0);
    expect(mi.upfrontFee).toBeGreaterThan(0);
  });
});

describe("clampCreditScore", () => {
  it("returns 740 for non-finite input (safe default)", () => {
    expect(clampCreditScore(Number.NaN)).toBe(740);
  });

  it("clamps to 300–850", () => {
    expect(clampCreditScore(100)).toBe(300);
    expect(clampCreditScore(900)).toBe(850);
  });

  it("rounds fractional scores", () => {
    expect(clampCreditScore(742.7)).toBe(743);
  });
});
