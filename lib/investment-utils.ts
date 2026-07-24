/**
 * Investment metric helpers shared by calculators and content pages.
 */

/**
 * Compound Annual Growth Rate, returned as a percentage.
 * CAGR = (ending / beginning) ^ (1 / years) - 1
 * Returns 0 when inputs are non-positive (beginning <= 0 or years <= 0).
 */
export function computeCagr(beginningValue: number, endingValue: number, years: number): number {
  if (beginningValue <= 0 || years <= 0) return 0
  return (Math.pow(endingValue / beginningValue, 1 / years) - 1) * 100
}
