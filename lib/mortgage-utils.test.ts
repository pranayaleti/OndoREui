import { describe, it, expect } from "vitest";
import {
  calculateMonthlyPI,
  getLtv,
  applyFinancedUpfrontToLoan,
  getProgramDTI,
  getProgramMI,
  clampCreditScore,
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
