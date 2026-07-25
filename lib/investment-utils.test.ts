import { describe, it, expect } from "vitest";
import { computeCagr } from "./investment-utils";

describe("computeCagr", () => {
  it("returns 100% when the value doubles over one year", () => {
    expect(computeCagr(100, 200, 1)).toBeCloseTo(100, 5);
  });

  it("returns ~10% for 100 -> 133.1 over three years", () => {
    expect(computeCagr(100, 133.1, 3)).toBeCloseTo(10, 3);
  });

  it("returns 0% when the value is unchanged", () => {
    expect(computeCagr(150000, 150000, 5)).toBeCloseTo(0, 6);
  });

  it("guards non-positive beginning value or years", () => {
    expect(computeCagr(0, 200, 3)).toBe(0);
    expect(computeCagr(-100, 200, 3)).toBe(0);
    expect(computeCagr(100, 200, 0)).toBe(0);
    expect(computeCagr(100, 200, -2)).toBe(0);
  });
});
