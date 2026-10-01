/**
 * Annual property-management fee from a percent-of-rent input.
 *
 * The rental calculators used to accept "annual $ or % as decimal" in one box and
 * guess which was meant (anything between 0 and 1 was a percent, everything else
 * dollars), so typing 10 for 10% silently meant $10 a year. The field is now
 * always "% of gross rent" and the percent is converted here.
 */
export function propertyManagementFee(grossAnnualRent: number, percent: number): number {
  if (!Number.isFinite(grossAnnualRent) || !Number.isFinite(percent)) return 0
  if (grossAnnualRent <= 0 || percent <= 0) return 0
  return grossAnnualRent * (percent / 100)
}
