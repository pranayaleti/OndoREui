export type UtahPmRow = {
  name: string
  headline: string
  mgmtFee: string
  leasingFee: string
  setupFee: string
  techStack: string
  ownerFit: string
  cons: string
  isUs: boolean
}

/**
 * Side-by-side figures for /compare-utah-property-managers.
 * Competitor fees are from public advertising at the time noted in the copy.
 * Always shown with a “verify before relying” note on the page.
 */
export const UTAH_PM_COMPARISON: readonly UtahPmRow[] = [
  {
    name: "Ondo RE",
    headline: "Tech-forward, owner + tenant portals, AI risk alerts",
    mgmtFee: "Starter 10% (1–4 units), Growth 8% (5–15), custom 16+",
    leasingFee: "50% of one month's rent",
    setupFee: "None — onboarding is included",
    techStack: "Custom owner portal + AI assistant (Next.js + Supabase)",
    ownerFit: "Real-time owner portal and custom tech stack",
    cons: "Newer (2024 founded), smaller than incumbents",
    isUs: true,
  },
  {
    name: "Rentomatic",
    headline: "Utah PM, advertised flat monthly fee",
    mgmtFee: "$159/mo flat per unit (as advertised Aug 2026)",
    leasingFee: "$0 placement (as advertised Aug 2026)",
    setupFee: "Standard onboarding — verify",
    techStack: "PM software not disclosed on their public site — verify",
    ownerFit: "Flat monthly line item, independent of collected rent",
    cons:
      "Flat fee does not move with rent collected, so percentage alignment is a tradeoff; $0 placement as advertised trades against a one-time leasing fee of 50% of first month’s rent",
    isUs: false,
  },
  {
    name: "Rhino Property Management",
    headline: "Wasatch Front legacy player, full-service",
    mgmtFee: "8–10% typical",
    leasingFee: "One month's rent",
    setupFee: "Standard onboarding",
    techStack: "AppFolio / Buildium",
    ownerFit: "Long-tenured Wasatch Front team",
    cons: "Published stack is AppFolio / Buildium. Ask for recent owner references on response time.",
    isUs: false,
  },
  {
    name: "Wolfnest Property Management",
    headline: "Salt Lake / Provo focused, owner-friendly reporting",
    mgmtFee: "8–10%",
    leasingFee: "75% of one month's rent",
    setupFee: "Standard",
    techStack: "Propertyware / AppFolio",
    ownerFit: "Detailed monthly owner reporting",
    cons: "Smaller geographic coverage outside core metro",
    isUs: false,
  },
  {
    name: "Keyrenter Salt Lake",
    headline: "Franchise PM, guarantee-forward marketing, Midvale HQ",
    mgmtFee: "~9% typical (franchise range; verify locally)",
    leasingFee: "35% of one month's rent (Keyrenter Salt Lake site, as of Aug 2026)",
    setupFee: "Standard onboarding",
    techStack: "AppFolio-class franchise stack",
    ownerFit: "National franchise brand and named performance guarantees",
    cons: "Franchisee-run, guarantee terms vary by market; less bespoke than local operators",
    isUs: false,
  },
]
