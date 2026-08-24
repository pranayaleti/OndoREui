export interface CreativeFinancing {
  headline: string
  overview: string
  structures: string[]
  notes?: string[]
}

export interface InvestmentOpportunity {
  slug: string
  title: string
  location: string
  assetClass: string
  minInvestment: number
  targetReturn: string
  holdPeriod: string
  distributionFrequency: string
  status: "open" | "coming-soon" | "fully-funded"
  image: string
  description: string
  highlights: string[]
  riskFactors: string[]
  creativeFinancing?: CreativeFinancing
}

export interface AssetClass {
  name: string
  icon: string
  description: string
}

export const ASSET_CLASSES: AssetClass[] = [
  {
    name: "Office",
    icon: "Building2",
    description:
      "Class A and B office buildings in growing metro areas with stable tenant demand and long-term lease structures.",
  },
  {
    name: "Retail",
    icon: "Store",
    description:
      "Grocery-anchored centers and neighborhood retail with essential-service tenants and NNN lease structures.",
  },
  {
    name: "Industrial",
    icon: "Warehouse",
    description:
      "Warehouses and distribution facilities driven by e-commerce growth and supply-chain demand.",
  },
  {
    name: "Multifamily",
    icon: "Hotel",
    description:
      "Apartment complexes and mixed-use residential properties in high-growth markets with strong occupancy.",
  },
  {
    name: "Medical Office",
    icon: "HeartPulse",
    description:
      "Healthcare-focused facilities leased to medical providers with recession-resistant demand profiles.",
  },
  {
    name: "Self-Storage",
    icon: "Container",
    description:
      "Climate-controlled and traditional storage facilities benefiting from steady consumer and business demand.",
  },
]

export const MOCK_OPPORTUNITIES: InvestmentOpportunity[] = [
  {
    slug: "lehi-tech-corridor-office",
    title: "Lehi Tech Corridor Office Complex",
    location: "Lehi, UT",
    assetClass: "Office",
    minInvestment: 25000,
    targetReturn: "8–12%",
    holdPeriod: "5–7 years",
    distributionFrequency: "Quarterly",
    status: "open",
    image: "/modern-office-building.webp",
    description:
      "A 48,000 sq ft Class A office building in Silicon Slopes with 92% occupancy and tenants including two publicly traded tech firms. The property benefits from proximity to I-15 and the FrontRunner commuter rail.",
    highlights: [
      "92% occupied with weighted average lease term of 4.2 years",
      "Located in Utah's fastest-growing tech employment corridor",
      "Below-market rents with 3% annual escalations",
      "Recent capital improvements to common areas and HVAC systems",
    ],
    riskFactors: [
      "Tenant concentration risk with two major tenants",
      "Interest rate changes may affect refinancing terms",
      "Local market supply additions could impact occupancy",
      "Economic downturn may reduce demand for office space",
    ],
    creativeFinancing: {
      headline: "Institutional senior loan with room for preferred equity",
      overview:
        "The sponsor has secured a conventional senior loan with competitive terms. For qualified investors, Ondo may structure a preferred equity tranche or co-invest alongside the sponsor to optimize leverage while maintaining conservative coverage ratios.",
      structures: [
        "Senior loan at fixed rate with 5-year term and 25-year amortization",
        "Potential preferred equity slice for larger check sizes seeking priority distributions",
        "Capital call flexibility for value‑add leasing or future tenant improvements",
      ],
      notes: [
        "Lender approval is required for any material changes to capital structure.",
        "Future refinancing terms will depend on interest rate environment and asset performance.",
      ],
    },
  },
  {
    slug: "provo-student-housing-complex",
    title: "Provo Student Housing Complex",
    location: "Provo, UT",
    assetClass: "Multifamily",
    minInvestment: 10000,
    targetReturn: "7–10%",
    holdPeriod: "3–5 years",
    distributionFrequency: "Monthly",
    status: "open",
    image: "/modern-apartment-balcony.webp",
    description:
      "A 120-unit student housing property adjacent to Brigham Young University with consistent demand driven by enrollment growth. The property was renovated in 2022 with modern unit finishes.",
    highlights: [
      "98% average occupancy over the past three academic years",
      "Walking distance to BYU campus and UVX bus rapid transit",
      "Renovated in 2022 with in-unit washer/dryer and smart locks",
      "Below-market rents compared to newer competitive supply",
    ],
    riskFactors: [
      "Seasonal vacancy during summer months",
      "Dependence on university enrollment trends",
      "Potential for new student housing competition",
      "Regulatory changes affecting student rental properties",
    ],
    creativeFinancing: {
      headline: "Blend of agency debt and investor equity",
      overview:
        "Given the stabilized student housing performance, this asset is well suited for agency-style financing with attractive leverage and longer amortization schedules. Ondo structures LP interests so investors can participate alongside the sponsor with lower minimums.",
      structures: [
        "Agency-style loan with interest‑only period during initial years",
        "Limited partner equity interests through an LLC or SPV for investors",
        "Optional DRIP-style (distribution reinvestment) program for select investors subject to offering terms",
      ],
      notes: [
        "Loan assumptions are subject to lender underwriting and prevailing market conditions.",
        "Some investors may elect to receive cash distributions rather than reinvest.",
      ],
    },
  },
  {
    slug: "salt-lake-industrial-warehouse",
    title: "Salt Lake Industrial Distribution Center",
    location: "Salt Lake City, UT",
    assetClass: "Industrial",
    minInvestment: 50000,
    targetReturn: "9–13%",
    holdPeriod: "7–10 years",
    distributionFrequency: "Quarterly",
    status: "open",
    image: "/modern-office-building.webp",
    description:
      "A 120,000 sq ft distribution warehouse near the Salt Lake City International Airport with direct freeway access. The facility serves regional logistics for two national retail brands.",
    highlights: [
      "100% leased to creditworthy tenants on NNN lease structure",
      "Five minutes from SLC International Airport and I-80",
      "30-foot clear height with cross-dock loading configuration",
      "Industrial vacancy in Salt Lake County below 3%",
    ],
    riskFactors: [
      "Single-asset concentration with limited tenant diversification",
      "Potential environmental remediation obligations",
      "Logistics industry disruption could affect tenant demand",
      "Long hold period limits liquidity options",
    ],
    creativeFinancing: {
      headline: "Conservative leverage with potential supplemental financing",
      overview:
        "The industrial distribution center is financed with a conservative senior loan to preserve cash flow resilience. If NOI grows meaningfully, the sponsor may pursue supplemental financing or refinancing to return capital while maintaining healthy coverage ratios.",
      structures: [
        "Senior term loan with moderate loan‑to‑value and NNN-backed cash flow",
        "Potential supplemental loan or refinance once value creation milestones are reached",
        "Equity interests structured through a manager‑led LLC with waterfall distributions",
      ],
      notes: [
        "Any supplemental financing is contingent on lender approval and property performance.",
        "Distributions may fluctuate based on occupancy, rental rates, and financing costs.",
      ],
    },
  },
  {
    slug: "draper-medical-office-park",
    title: "Draper Medical Office Park",
    location: "Draper, UT",
    assetClass: "Medical Office",
    minInvestment: 25000,
    targetReturn: "7–9%",
    holdPeriod: "5–7 years",
    distributionFrequency: "Quarterly",
    status: "coming-soon",
    image: "/modern-apartment-balcony.webp",
    description:
      "A two-building medical office park totaling 32,000 sq ft leased to Intermountain Health affiliates and independent specialists. Located in the Draper corridor with strong population growth.",
    highlights: [
      "Healthcare tenants provide recession-resistant income",
      "Long-term leases with annual rent escalations",
      "Draper is one of the fastest-growing cities in Utah",
      "Property adjacent to new TRAX light rail station",
    ],
    riskFactors: [
      "Healthcare policy changes may impact tenant operations",
      "Specialized build-out limits alternative use flexibility",
      "Tenant renewal risk at lease expiration",
      "Rising construction costs may affect capital improvements",
    ],
    creativeFinancing: {
      headline: "Staggered capital calls aligned with lease-up milestones",
      overview:
        "Because medical office build-outs can be capital intensive, Ondo may structure investor commitments with staged capital calls. This helps align funding with construction and leasing milestones while reducing idle capital.",
      structures: [
        "Senior loan sized to in‑place income with additional TI/LC reserves",
        "Staged equity capital calls tied to build‑out, occupancy, and stabilization targets",
        "Option for co‑GP or larger LP positions for strategic healthcare investors",
      ],
      notes: [
        "Capital call schedules and amounts are defined in the final offering documents.",
        "Failure to fund capital calls may result in dilution or other remedies under the operating agreement.",
      ],
    },
  },
  {
    slug: "orem-grocery-anchored-retail",
    title: "Orem Grocery-Anchored Retail Center",
    location: "Orem, UT",
    assetClass: "Retail",
    minInvestment: 15000,
    targetReturn: "8–11%",
    holdPeriod: "5–7 years",
    distributionFrequency: "Quarterly",
    status: "coming-soon",
    image: "/modern-office-building.webp",
    description:
      "A 65,000 sq ft neighborhood retail center anchored by a national grocery chain with inline tenants including a pharmacy, dental office, and quick-service restaurants.",
    highlights: [
      "Grocery anchor on a 15-year NNN lease",
      "Located at a signalized intersection with 30,000+ daily traffic count",
      "Inline tenants provide service-based offerings resistant to e-commerce",
      "Strong demographics with growing households within a 3-mile radius",
    ],
    riskFactors: [
      "Anchor tenant departure would significantly impact value",
      "Retail sector remains subject to broader consumer spending trends",
      "Inline tenant turnover may create periodic vacancy",
      "Property tax reassessment risk upon acquisition",
    ],
    creativeFinancing: {
      headline: "Anchor-backed loan with potential mezzanine tranche",
      overview:
        "The long-term grocery anchor lease supports a primary loan with attractive terms. For certain offerings, Ondo may introduce a small mezzanine or preferred equity tranche to enhance returns while managing risk through conservative sizing.",
      structures: [
        "Primary senior loan underwritten to anchor tenant cash flows",
        "Optional mezzanine or preferred equity for investors seeking higher target yields",
        "Ability to re‑tenant inline suites using reserves and additional capital when needed",
      ],
      notes: [
        "Any mezzanine or preferred equity is subject to intercreditor agreements with the senior lender.",
        "Anchor lease renewals and co‑tenancy clauses are key drivers of long‑term financing flexibility.",
      ],
    },
  },
  {
    slug: "american-fork-self-storage",
    title: "American Fork Climate-Controlled Storage",
    location: "American Fork, UT",
    assetClass: "Self-Storage",
    minInvestment: 10000,
    targetReturn: "8–10%",
    holdPeriod: "3–5 years",
    distributionFrequency: "Monthly",
    status: "fully-funded",
    image: "/modern-apartment-balcony.webp",
    description:
      "A 450-unit climate-controlled self-storage facility in American Fork serving the north Utah County market. The facility opened in 2021 and has reached stabilized occupancy ahead of projections.",
    highlights: [
      "90% occupancy achieved within 18 months of opening",
      "Climate-controlled units command premium rental rates",
      "Limited new storage supply in the immediate trade area",
      "Month-to-month leases allow dynamic pricing adjustments",
    ],
    riskFactors: [
      "Self-storage is sensitive to local supply additions",
      "Month-to-month lease structure creates revenue volatility",
      "Fully funded, this opportunity is no longer accepting investors",
      "Operational costs may increase with utility rate changes",
    ],
    creativeFinancing: {
      headline: "Stabilized permanent loan with potential recapitalization",
      overview:
        "This self-storage facility has already been fully capitalized and placed into a long-term financing structure. While no new equity is being accepted, investors may benefit from future recapitalization or sale should performance continue to outperform underwriting.",
      structures: [
        "Long-term permanent loan sized to stabilized NOI",
        "Equity interests already fully subscribed through prior offering",
        "Potential recapitalization event or sale providing liquidity in the medium term",
      ],
      notes: [
        "No additional investor capital is being raised for this opportunity at this time.",
        "Any recapitalization or sale will be evaluated based on market conditions and investor approval thresholds.",
      ],
    },
  },
]
