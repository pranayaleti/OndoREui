import type { CityMarketData } from "./city-market-data"

export type SubServiceDefinition = {
  name: string
  slug: string
  parentService: "property-management" | "loans" | "buy-sell"
  parentName: string
  parentHref: string
  metaTitle: (city: string) => string
  metaDescription: (city: string) => string
  features: { title: string; description: string; iconName: string }[]
  howItWorks: { step: string; title: string; desc: string }[]
  localizedIntro: (city: string, data: CityMarketData) => string
  localizedBenefits: (city: string, data: CityMarketData) => string[]
  baseFaqs: { q: string; a: string }[]
}

function fmt(n: number): string {
  return n.toLocaleString("en-US")
}
function fmtUsd(n: number): string {
  return "$" + fmt(n)
}
function pct(n: number): string {
  return n + "%"
}

// ─── Property Management Sub-Services ──────────────────────────────────────

const tenantScreening: SubServiceDefinition = {
  name: "Tenant Screening",
  slug: "tenant-screening",
  parentService: "property-management",
  parentName: "Property Management",
  parentHref: "/property-management",
  metaTitle: (city) => `Tenant Screening in ${city}, Utah`,
  metaDescription: (city) =>
    `Comprehensive tenant screening for ${city} landlords, credit, criminal, eviction, and income verification. Fair Housing compliant. Powered by Ondo Real Estate.`,
  features: [
    { title: "Credit Report", description: "Full tri-merge credit report with score, payment history, collections, and debt-to-income analysis", iconName: "FileText" },
    { title: "Criminal Background", description: "National and state-level criminal background search with sex offender registry check", iconName: "Shield" },
    { title: "Eviction History", description: "National eviction database search covering court filings, judgments, and landlord-tenant disputes", iconName: "UserCheck" },
    { title: "Income Verification", description: "Employer verification, pay stub review, and bank statement analysis for 3× rent threshold", iconName: "DollarSign" },
  ],
  howItWorks: [
    { step: "1", title: "Applicant Applies Online", desc: "Prospective tenants complete a standardized application through the Ondo portal. Consent for background and credit checks is collected digitally, ensuring compliance with the Fair Credit Reporting Act and Utah-specific disclosure requirements." },
    { step: "2", title: "Automated Screening Reports", desc: "Our system runs credit, criminal, eviction, and income checks within minutes. Results are scored against your pre-set criteria: minimum FICO score, income multiple, eviction history tolerance, and criminal conviction guidelines that comply with HUD guidance." },
    { step: "3", title: "Owner Review & Decision", desc: "You review the full report in your owner dashboard. Our team flags any concerns and provides a placement recommendation based on comparable applicant data in your market. You always make the final decision." },
  ],
  localizedIntro: (city, data) =>
    `Finding the right tenant in ${city} is critical to protecting your investment. With a median home price of ${fmtUsd(data.medianHomePrice)} and median rent of ${fmtUsd(data.medianRent)}/month, a single bad placement can cost $8,000–15,000 in lost rent, legal fees, and turnover costs. Our systematic screening process applies consistent, documented criteria to every applicant, protecting your asset and keeping you compliant with Utah Fair Housing law. In ${city}'s ${data.schoolDistrict} area, where ${pct(data.ownerOccupiedPct)} of homes are owner-occupied, the rental market is competitive and filling vacancies quickly matters. Our screening typically returns results within 24 hours, so you never lose a strong applicant to delays.`,
  localizedBenefits: (city, data) => [
    `Screen against ${city}-specific rental comps, we know that ${fmtUsd(data.medianRent)}/month is the local benchmark and set income thresholds accordingly`,
    `${data.schoolDistrict} families applying for school-adjacent rentals get the same thorough screening as every other applicant, no shortcuts`,
    `Digital application process reaches the tech-savvy renter pool drawn to ${city} by employers like ${data.topEmployers[0]} and ${data.topEmployers[1] || "local businesses"}`,
    `Consistent criteria documentation protects you from discrimination claims in ${city}'s growing rental market`,
  ],
  baseFaqs: [
    { q: "What does your tenant screening include?", a: "Every applicant receives a full tri-merge credit report, national criminal background check, sex offender registry search, nationwide eviction history search, employment and income verification, and previous landlord reference checks. We verify that reported income meets at least 3× the monthly rent and confirm employment stability. The entire process is Fair Housing compliant and follows HUD guidance on the use of criminal records in housing decisions." },
    { q: "How long does screening take?", a: "Most screening reports are complete within 24 hours of the applicant submitting their application. Credit and criminal checks return within minutes; income and landlord verification may take 1–2 business days depending on employer and landlord responsiveness. We follow up proactively to avoid delays that could cost you a qualified applicant." },
    { q: "What are your screening criteria?", a: "We work with each owner to establish customized screening criteria that comply with Fair Housing law. Common thresholds include a minimum credit score (typically 600–650), gross income of at least 3× monthly rent, no evictions in the past 5 years, and no felony convictions in the past 7 years. Criteria are applied consistently to every applicant and documented for your protection." },
    { q: "How much does tenant screening cost?", a: "Screening costs are typically passed through to the applicant as an application fee, so there is no direct cost to you as the property owner. Application fees are set in accordance with Utah Code § 57-22-4 and cover the actual cost of obtaining screening reports. We handle all fee collection and disclosure requirements." },
    { q: "What if an applicant disputes their screening results?", a: "Under the Fair Credit Reporting Act, applicants have the right to dispute inaccurate information. We provide every denied applicant with an adverse action notice that includes the name and contact information of the reporting agency, their right to obtain a free copy of their report, and their right to dispute inaccurate information. This protects both you and the applicant." },
  ],
}

const maintenanceCoordination: SubServiceDefinition = {
  name: "Maintenance Coordination",
  slug: "maintenance-coordination",
  parentService: "property-management",
  parentName: "Property Management",
  parentHref: "/property-management",
  metaTitle: (city) => `Maintenance Coordination in ${city}, Utah`,
  metaDescription: (city) =>
    `24/7 maintenance coordination for ${city} rental properties. Licensed vendors, transparent pricing, and owner approval workflows. Ondo Real Estate.`,
  features: [
    { title: "24/7 Emergency Line", description: "Round-the-clock emergency response for after-hours issues like burst pipes, HVAC failures, and lockouts", iconName: "Phone" },
    { title: "Licensed Vendor Network", description: "Pre-vetted, licensed, and insured contractors across plumbing, electrical, HVAC, roofing, and general repair", iconName: "Wrench" },
    { title: "Owner Approval Workflow", description: "Transparent cost estimates with owner approval required for non-emergency repairs above your set threshold", iconName: "CheckCircle" },
    { title: "Digital Work Orders", description: "Tenants submit requests online with photos; you track status, costs, and completion in your owner dashboard", iconName: "ClipboardList" },
  ],
  howItWorks: [
    { step: "1", title: "Tenant Submits Request", desc: "Tenants log maintenance requests through the Ondo portal with photos and descriptions. Requests are automatically categorized by urgency: emergency (immediate), urgent (24–48 hours), or routine (scheduled). Emergency requests trigger an immediate alert to our team." },
    { step: "2", title: "We Coordinate the Repair", desc: "Our team dispatches a licensed vendor from our pre-vetted network. For non-emergency repairs exceeding your approval threshold, we send you a cost estimate for authorization before work begins. Emergency repairs are handled immediately to prevent property damage." },
    { step: "3", title: "Completion & Documentation", desc: "The vendor completes the repair and provides before/after documentation. We verify the work quality, process the invoice, and update your owner dashboard with full cost records. You always have a complete maintenance history for your property." },
  ],
  localizedIntro: (city, data) =>
    `Maintaining rental properties in ${city} requires reliable, responsive vendor relationships and clear communication between owners, tenants, and contractors. With ${city}'s ${data.geographyNote ? data.geographyNote.toLowerCase() : "local climate"}, seasonal maintenance demands include furnace inspections before winter, cooling system checks in summer, and landscaping coordination year-round. Our maintenance coordination service handles the logistics so you don't have to field 2 AM phone calls or chase down contractor bids. In ${city}, where the median rent is ${fmtUsd(data.medianRent)}/month, keeping your property well-maintained directly impacts tenant retention and protects your ${fmtUsd(data.medianHomePrice)} investment.`,
  localizedBenefits: (city, data) => [
    `Local vendor network familiar with ${city} building codes and ${data.schoolDistrict} area HOA requirements`,
    `Preventive maintenance scheduling tailored to ${city}'s elevation and climate conditions`,
    `Transparent pricing, we share vendor bids and never mark up materials or labor`,
    `24/7 emergency line plus portal maintenance requests for ${city} properties, with urgent issues triaged 24–48 hours and routine work scheduled during business hours`,
  ],
  baseFaqs: [
    { q: "How do tenants submit maintenance requests?", a: "Tenants submit requests through the Ondo portal or mobile app, 24/7. They can include photos and detailed descriptions of the issue. Requests are automatically categorized by urgency, emergency issues like water leaks or no heat trigger immediate alerts, while routine requests are scheduled during normal business hours. Tenants receive status updates at each stage." },
    { q: "What is your emergency maintenance policy?", a: "Emergencies are defined as conditions that threaten life, safety, or property, burst pipes, gas leaks, no heat in winter, electrical hazards, and flooding. We maintain a 24/7 emergency line and dispatch licensed vendors immediately for emergency situations. Non-emergency repairs are handled during business hours with owner notification." },
    { q: "Do I approve repair costs before work begins?", a: "Yes, for non-emergency repairs. You set an approval threshold (e.g., $300). Any repair estimated above that amount requires your authorization before we dispatch a vendor. For emergencies, we proceed immediately to prevent property damage and notify you as soon as possible. All costs are documented in your owner dashboard." },
    { q: "How do you select maintenance vendors?", a: "Every vendor in our network is licensed, insured, and background-checked. We evaluate vendors on response time, work quality, pricing transparency, and tenant feedback. We maintain relationships with multiple vendors per trade so we can always get competitive pricing and fast response times for your property." },
  ],
}

const ownerReporting: SubServiceDefinition = {
  name: "Owner Reporting",
  slug: "owner-reporting",
  parentService: "property-management",
  parentName: "Property Management",
  parentHref: "/property-management",
  metaTitle: (city) => `Owner Reporting & Analytics in ${city}, Utah`,
  metaDescription: (city) =>
    `Real-time financial reporting and property analytics for ${city} rental owners. Monthly statements, year-end tax packages, and performance dashboards.`,
  features: [
    { title: "Monthly Statements", description: "Detailed income and expense statements with line-item breakdowns for rent, maintenance, and management fees", iconName: "BarChart3" },
    { title: "Real-Time Dashboard", description: "Live view of rent collections, vacancy status, maintenance tickets, and lease expirations across your portfolio", iconName: "LayoutDashboard" },
    { title: "Year-End Tax Package", description: "1099 forms, annual income/expense summary, and depreciation schedules ready for your CPA by January 31", iconName: "FileSpreadsheet" },
    { title: "Market Comparables", description: "Quarterly rent comp analysis showing how your properties compare to similar listings in your area", iconName: "TrendingUp" },
  ],
  howItWorks: [
    { step: "1", title: "Data Collection", desc: "Every financial transaction: rent payments, maintenance costs, management fees, utility reimbursements: is automatically recorded and categorized in real time. No manual entry, no spreadsheets, no waiting for month-end to know where you stand." },
    { step: "2", title: "Monthly Reports", desc: "By the 5th of each month, you receive a detailed statement covering the prior month's income, expenses, and net owner distribution. Reports include year-to-date totals and variance analysis against budget. Digital copies are stored in your owner portal for easy access." },
    { step: "3", title: "Annual Tax Preparation", desc: "By January 31, you receive a complete year-end tax package including 1099-MISC forms, annual income/expense summary organized by IRS Schedule E categories, and documentation for all capital expenditures. Your CPA can import the data directly." },
  ],
  localizedIntro: (city, data) =>
    `Owning rental property in ${city} should generate returns, not paperwork headaches. With a median home price of ${fmtUsd(data.medianHomePrice)} and rental income potential of ${fmtUsd(data.medianRent)}/month, you need clear financial visibility to make informed decisions about your investment. Our owner reporting platform gives you real-time access to every dollar flowing in and out of your ${city} properties. Whether you own one single-family home near ${data.notableSchools[0] || data.schoolDistrict} or a multi-property portfolio, you get the same institutional-grade reporting that large REITs use, adapted for individual investors in the ${city} market.`,
  localizedBenefits: (city, data) => [
    `Rent comp analysis benchmarked against ${city} market data, know if your ${fmtUsd(data.medianRent)}/month is above or below market`,
    `Year-end tax packages organized by IRS Schedule E categories, specific to Utah state tax requirements`,
    `Portfolio-level analytics for owners with multiple ${city}-area properties`,
    `Vacancy cost tracking showing the real impact of each day your ${city} property sits empty`,
  ],
  baseFaqs: [
    { q: "When do I receive monthly statements?", a: "Monthly owner statements are delivered by the 5th of each month, covering the prior month's activity. Statements include all rent collected, maintenance expenses, management fees, and your net owner distribution. Year-to-date totals and variance analysis are included so you can track performance trends. Digital copies are permanently available in your owner portal." },
    { q: "What's included in the year-end tax package?", a: "Your year-end package includes 1099-MISC forms for rental income, a complete annual income and expense summary organized by IRS Schedule E line items, documentation for all capital expenditures, and a depreciation schedule. We deliver everything by January 31 so your CPA has plenty of time before the April filing deadline. The package is designed to make tax preparation straightforward." },
    { q: "Can I access reports in real time?", a: "Yes. Your owner dashboard shows live data including current rent collection status, outstanding maintenance tickets with costs, lease expiration dates, and vacancy status. You can access the dashboard from any device at any time. We also send automated alerts for important events like late rent payments or maintenance costs exceeding your threshold." },
    { q: "Do you provide market rent analysis?", a: "Yes. Each quarter we run a rent comparable analysis for your properties, comparing your current rent to similar properties in the area. The analysis considers property type, size, condition, and location to give you an accurate picture of where your rent sits relative to market. We include a recommendation on whether to adjust rent at lease renewal." },
  ],
}

// ─── Loan Sub-Services ─────────────────────────────────────────────────────

const fhaLoans: SubServiceDefinition = {
  name: "FHA Loans",
  slug: "fha",
  parentService: "loans",
  parentName: "Loans",
  parentHref: "/loans",
  metaTitle: (city) => `FHA Loans in ${city}, Utah`,
  metaDescription: (city) =>
    `FHA home loans in ${city}, UT, 3.5% down payment, flexible credit requirements, and competitive rates. Get pre-qualified with Ondo Real Estate.`,
  features: [
    { title: "Low Down Payment", description: "As little as 3.5% down: significantly less than the 20% required for many conventional loans", iconName: "Percent" },
    { title: "Flexible Credit", description: "Credit scores as low as 580 may qualify with 3.5% down; scores 500–579 may qualify with 10% down", iconName: "CreditCard" },
    { title: "Competitive Rates", description: "FHA-insured loans often carry lower interest rates than comparable conventional mortgages", iconName: "TrendingDown" },
    { title: "Seller Contributions", description: "Sellers can contribute up to 6% of the sale price toward your closing costs", iconName: "Handshake" },
  ],
  howItWorks: [
    { step: "1", title: "Get Pre-Qualified", desc: "We review your income, credit, and savings to determine your FHA eligibility and purchasing power. Pre-qualification typically takes 24–48 hours and gives you a clear budget range for your home search." },
    { step: "2", title: "Find Your Home", desc: "Work with our local agents who know the neighborhoods, schools, and market conditions. We help you find properties that meet FHA property standards so there are no surprises at appraisal." },
    { step: "3", title: "Close with Confidence", desc: "Our loan team manages the FHA appraisal, underwriting, and closing process. We coordinate with the seller's agent, title company, and FHA appraiser to keep your timeline on track." },
  ],
  localizedIntro: (city, data) =>
    `An FHA loan makes homeownership accessible in ${city}, where the median home price is ${fmtUsd(data.medianHomePrice)}. With just 3.5% down, your minimum down payment would be approximately ${fmtUsd(Math.round(data.medianHomePrice * 0.035))}, compared to ${fmtUsd(Math.round(data.medianHomePrice * 0.2))} for a conventional 20% down payment. For first-time buyers in ${city}'s ${data.schoolDistrict} area, where the median household income is ${fmtUsd(data.medianHouseholdIncome)}, the lower down payment requirement means you can start building equity years sooner. FHA loans are especially popular with buyers near ${data.topEmployers[0]} and ${data.topEmployers[1] || "local employers"} who have steady income but haven't had time to save a large down payment.`,
  localizedBenefits: (city, data) => [
    `Down payment as low as ${fmtUsd(Math.round(data.medianHomePrice * 0.035))} for a median-priced ${city} home`,
    `Monthly payment estimate: ${fmtUsd(Math.round(data.medianHomePrice * 0.965 * 0.006))} (principal + interest at current rates), compare to ${fmtUsd(data.medianRent)}/month rent`,
    `Gift funds accepted for down payment, family can help you buy in ${city}`,
    `FHA-approved condos and townhomes available in ${city} for lower price points`,
  ],
  baseFaqs: [
    { q: "What credit score do I need for an FHA loan?", a: "The minimum credit score for an FHA loan with 3.5% down is 580. If your credit score is between 500 and 579, you may still qualify with a 10% down payment. These are FHA minimums, individual lenders may have overlays that require higher scores. We work with multiple FHA-approved lenders to find the best fit for your credit profile. If your score is below the minimum, we can recommend credit counseling resources to help you get mortgage-ready." },
    { q: "What are FHA mortgage insurance premiums?", a: "FHA loans require both an upfront mortgage insurance premium (UFMIP) of 1.75% of the loan amount and an annual mortgage insurance premium (MIP) paid monthly. The annual MIP rate depends on your loan amount, down payment, and term length. For most borrowers putting 3.5% down on a 30-year loan, the annual MIP is 0.55% of the loan balance. Unlike conventional PMI, FHA MIP remains for the life of the loan unless you refinance to a conventional loan after building sufficient equity." },
    { q: "Are there FHA loan limits?", a: "Yes. FHA loan limits vary by county and are updated annually. In Utah County and Salt Lake County, the current FHA loan limit for a single-family home is significantly higher than the national baseline. We can confirm the exact limit for your target area and help you determine if the median home price in your desired neighborhood falls within FHA limits. If you need a loan above the FHA limit, we can explore conventional and jumbo options." },
    { q: "Can I use an FHA loan for a fixer-upper?", a: "Yes. The FHA 203(k) rehabilitation loan lets you finance both the purchase price and renovation costs in a single mortgage. There are two types: the Limited 203(k) for cosmetic improvements up to $35,000, and the Standard 203(k) for larger structural renovations. This can be especially valuable in older neighborhoods where homes may need updating. We guide you through the contractor selection and draw process." },
  ],
}

const conventionalLoans: SubServiceDefinition = {
  name: "Conventional Loans",
  slug: "conventional",
  parentService: "loans",
  parentName: "Loans",
  parentHref: "/loans",
  metaTitle: (city) => `Conventional Home Loans in ${city}, Utah`,
  metaDescription: (city) =>
    `Conventional mortgage options in ${city}, UT, competitive rates, flexible terms, and no upfront mortgage insurance. Ondo Real Estate.`,
  features: [
    { title: "No Upfront MIP", description: "Unlike FHA loans, conventional loans have no upfront mortgage insurance premium: reducing your closing costs", iconName: "BadgeDollarSign" },
    { title: "PMI Cancellation", description: "Private mortgage insurance automatically drops off when you reach 78% loan-to-value: saving you hundreds per month", iconName: "ShieldOff" },
    { title: "Flexible Terms", description: "Choose from 10, 15, 20, 25, or 30-year fixed-rate terms, or adjustable-rate options for shorter hold periods", iconName: "Settings" },
    { title: "Higher Loan Limits", description: "Conforming limits exceed FHA limits in most Utah counties, letting you finance more expensive properties", iconName: "ArrowUpCircle" },
  ],
  howItWorks: [
    { step: "1", title: "Pre-Approval", desc: "We pull your credit, verify income and assets, and issue a pre-approval letter that sellers take seriously. Pre-approval shows you're a qualified buyer and strengthens your offer in competitive situations." },
    { step: "2", title: "Rate Lock & Home Search", desc: "Once you're pre-approved, we can lock your interest rate while you shop. Rate locks are available for 30, 45, or 60 days, protecting you from market fluctuations while you find the right property." },
    { step: "3", title: "Underwriting & Close", desc: "Our processing team manages appraisal ordering, title work, insurance verification, and underwriting conditions. We keep you informed at every stage and target a 30-day close for most transactions." },
  ],
  localizedIntro: (city, data) =>
    `A conventional mortgage is a common loan type in ${city}. The median home price snapshot we use is ${fmtUsd(data.medianHomePrice)}; confirm whether that sits under the current FHFA conforming limit for the property county. Credit, down payment, and DTI overlays decide pricing. PMI on conventional can often be removed with enough equity, unlike typical FHA MIP on low-down files. For ${city} buyers, conventional terms still depend on the file, from 15-year options that build equity faster to 30-year terms that keep the payment lower.`,
  localizedBenefits: (city, _data) => [
    `PMI can often drop off at 78% of original value on conventional loans; that threshold depends on the original value, not a marketing shortcut`,
    `No upfront MIP, unlike FHA. Do not treat a dollar comparison on this page as your cash to close.`,
    `Pricing for ${city} borrowers still depends on credit, LTV, and occupancy, not a promised rate`,
    `Investment property financing may be available for ${city} rental investors when occupancy and LTV fit`,
  ],
  baseFaqs: [
    { q: "What's the minimum down payment for a conventional loan?", a: "The minimum down payment is 3% for first-time homebuyers through programs like Conventional 97 or HomeReady, and 5% for most other borrowers. Putting 20% or more down eliminates private mortgage insurance entirely. For an investment property, expect a minimum of 15–25% down. We help you weigh the tradeoffs between a lower down payment (preserving cash) and a higher down payment (lower monthly payments and no PMI)." },
    { q: "How does conventional compare to FHA?", a: "Conventional loans have no upfront mortgage insurance premium, PMI cancels automatically at 78% LTV (FHA MIP is permanent on most loans), higher loan limits in many Utah counties, and no FHA-specific property condition requirements. However, FHA loans have more flexible credit requirements and lower down payment minimums. If you have a credit score above 680 and can put at least 5% down, conventional is typically the better long-term value." },
    { q: "Can I get a conventional loan for an investment property?", a: "Conventional loans are a common path for investment properties. Down payment, occupancy, and pricing differ from a primary residence. We will not publish a promised rate markup." },
    { q: "What credit score do I need?", a: "Most conventional programs start around a 620 score, with overlays often higher. Higher scores often improve pricing, but there is no single “best rate” score. Scores between 620 and 700 can still fit some files with different PMI or pricing. That is not a promise of approval." },
  ],
}

const vaLoans: SubServiceDefinition = {
  name: "VA Loans",
  slug: "va",
  parentService: "loans",
  parentName: "Loans",
  parentHref: "/loans",
  metaTitle: (city) => `VA Home Loans in ${city}, Utah`,
  metaDescription: (city) =>
    `VA home loans in ${city}, UT: ask about zero down and no monthly PMI when entitlement and occupancy rules are met. This is not a quote.`,
  features: [
    { title: "Zero down when eligible", description: "Zero down is available only with remaining entitlement and when the loan otherwise meets VA and lender guidelines. It is not automatic.", iconName: "Home" },
    { title: "No PMI", description: "VA loans do not charge monthly PMI. That is not a published monthly savings versus conventional.", iconName: "ShieldCheck" },
    { title: "VA pricing", description: "VA loans are often priced differently from conventional because of the guarantee. That is not a promise of a lower rate on your file.", iconName: "TrendingDown" },
    { title: "Credit and DTI", description: "VA residual income and DTI overlays differ from conventional. There is still a maximum loan amount that fits entitlement, residual income, and the property.", iconName: "UserCheck" },
  ],
  howItWorks: [
    { step: "1", title: "Certificate of Eligibility", desc: "We help you obtain your Certificate of Eligibility (COE) to confirm your VA loan entitlement. This can often be retrieved instantly through the VA's automated system. We verify your remaining entitlement and any prior VA loan usage." },
    { step: "2", title: "Pre-Approval & Home Search", desc: "With your COE confirmed, we issue a pre-approval letter and connect you with agents experienced in VA transactions. VA loans have specific property requirements, and our team ensures you're looking at eligible properties from the start." },
    { step: "3", title: "VA Appraisal & Close", desc: "The VA appraisal ensures the property meets VA Minimum Property Requirements (MPRs). Our team manages the appraisal process, coordinates with the VA, and guides you through closing: typically in 30–45 days." },
  ],
  localizedIntro: (city, data) =>
    `Veterans and active-duty service members in ${city} can ask about VA eligibility. Zero down is available only with remaining entitlement. The median published home price we use for ${city} is ${fmtUsd(data.medianHomePrice)}; that is a city snapshot, not your contract price. VA loans typically have no monthly PMI. ${data.topEmployers.some(e => e.toLowerCase().includes("afb") || e.toLowerCase().includes("air force") || e.toLowerCase().includes("hill") || e.toLowerCase().includes("military")) ? `With ${data.topEmployers.find(e => e.toLowerCase().includes("afb") || e.toLowerCase().includes("air force") || e.toLowerCase().includes("hill")) || "nearby military installations"} in the area, many ${city} residents may be eligible to apply for VA benefits.` : `Whether you are active duty, a veteran, or a surviving spouse, eligibility still depends on service history, occupancy, and remaining entitlement.`}`,
  localizedBenefits: (city, data) => [
    `Zero down on a ${fmtUsd(data.medianHomePrice)} ${city} median snapshot only if entitlement and occupancy rules are met`,
    `No monthly PMI. We do not publish a monthly dollar savings versus conventional.`,
    `VA funding fee can often be financed; confirm the current published schedule before quoting`,
    `Loan amount still has to fit remaining entitlement, residual income, and overlays in ${city}`,
  ],
  baseFaqs: [
    { q: "Who is eligible for a VA loan?", a: "VA loan eligibility extends to active-duty service members (after 90 continuous days of service during wartime or 181 days during peacetime), veterans with an honorable discharge, National Guard and Reserve members (with 6 years of service or 90 days of activation), and surviving spouses of service members who died in service or from a service-connected disability. We help you navigate your specific eligibility scenario." },
    { q: "Is there a VA funding fee?", a: "Yes, the VA charges a one-time funding fee that varies based on your service category, down payment amount, and whether it's your first VA loan. For first-time use with zero down, the fee is typically 2.15% of the loan amount. The fee can be financed into your loan. Disabled veterans and surviving spouses receiving DIC benefits are exempt from the funding fee entirely." },
    { q: "Can I use a VA loan more than once?", a: "Yes. VA loan entitlement can be restored and reused. If you've sold a previous VA-financed home and paid off the loan, your full entitlement is restored. You can even have two VA loans simultaneously if you have remaining entitlement. We analyze your Certificate of Eligibility to determine your available entitlement and purchasing power." },
    { q: "What are VA Minimum Property Requirements?", a: "The VA requires that properties be safe, structurally sound, and sanitary. The VA appraisal checks for adequate heating, plumbing, electrical, and roofing; safe water supply and sewage disposal; no lead-based paint hazards; adequate access from a public road; and no termite or pest damage. These requirements exist to protect veterans from purchasing substandard properties." },
  ],
}

const usdaLoans: SubServiceDefinition = {
  name: "USDA Loans",
  slug: "usda",
  parentService: "loans",
  parentName: "Loans",
  parentHref: "/loans",
  metaTitle: (city) => `USDA Home Loans in ${city}, Utah`,
  metaDescription: (city) =>
    `USDA rural development loans in ${city}, UT, zero down payment for eligible rural and suburban areas. Check your eligibility with Ondo Real Estate.`,
  features: [
    { title: "Zero down when the property qualifies", description: "100% financing is available only for eligible properties in USDA-eligible areas when income limits fit. It is not automatic for every rural-looking address.", iconName: "Home" },
    { title: "USDA guarantee fee", description: "USDA charges guarantee fees that differ from FHA MIP and conventional PMI. Confirm the current USDA schedule; this page does not publish a single percent.", iconName: "Percent" },
    { title: "Income-based eligibility", description: "USDA uses household income limits that change by county and household size. Confirm the current USDA table for the property.", iconName: "Users" },
    { title: "Check the map first", description: "Eligibility is the property census tract, not a city slogan. The USDA map changes.", iconName: "TrendingDown" },
  ],
  howItWorks: [
    { step: "1", title: "Eligibility Check", desc: "We verify two things: that the property location falls within a USDA-eligible area, and that your household income meets USDA guidelines (up to 115% of area median income). Many suburban Utah communities qualify: the boundaries may surprise you." },
    { step: "2", title: "Pre-Approval", desc: "Once eligibility is confirmed, we process your loan application with USDA-approved lenders. Pre-approval includes income verification, credit review, and a determination of your maximum purchase price." },
    { step: "3", title: "USDA Review & Close", desc: "After your offer is accepted, the loan package goes through both lender underwriting and USDA review. We manage both processes in parallel to minimize delays. Typical closing timelines are 45–60 days." },
  ],
  localizedIntro: (city, data) =>
    `USDA rural development loans offer zero-down financing in qualifying areas of ${city} and surrounding communities. With the median home price at ${fmtUsd(data.medianHomePrice)}, a USDA loan eliminates the need for a ${fmtUsd(Math.round(data.medianHomePrice * 0.035))}–${fmtUsd(Math.round(data.medianHomePrice * 0.05))} down payment entirely. Income eligibility in the ${city} area extends to households earning up to 115% of the area median income, approximately ${fmtUsd(Math.round(data.medianHouseholdIncome * 1.15))}, which covers a large share of ${city} working families. Many buyers assume USDA loans are only for farmland, but eligible areas include suburban communities throughout Utah, check the USDA eligibility map to see if ${city} qualifies.`,
  localizedBenefits: (city, _data) => [
    `Zero down is available only when the ${city} property is on the current USDA map and household income fits`,
    `Income limits are published by USDA by county and household size. Confirm the table; a median-income snapshot is not your limit.`,
    `Guarantee fees differ from FHA MIP and conventional PMI. Confirm the current USDA schedule rather than a percent on this page.`,
    `Closing costs may be financed or covered by seller contributions only up to program rules`,
  ],
  baseFaqs: [
    { q: "Is my area USDA-eligible?", a: "USDA eligibility is determined by the property's location, not the buyer's address. Many suburban Utah communities outside Salt Lake City's urban core qualify. The USDA eligibility map is updated periodically, and areas can be added or removed. We check the current map for every property you're considering and can provide a list of USDA-eligible neighborhoods in your target area." },
    { q: "What are the income limits?", a: "USDA income limits are set at 115% of the area median income and vary by county and household size. The income of all adult household members is counted, not just the borrowers on the loan. This is different from conventional loans which only consider borrower income. We calculate your specific eligibility based on your household composition and location." },
    { q: "How long does a USDA loan take to close?", a: "USDA loans typically take 45–60 days to close because the loan must pass through both lender underwriting and USDA review. We manage both processes in parallel and submit a complete package to minimize back-and-forth. Setting realistic timeline expectations with the seller upfront helps avoid issues during the transaction." },
    { q: "Can I use a USDA loan for a manufactured home?", a: "Yes, USDA loans can finance manufactured homes that are permanently affixed to a foundation, meet HUD standards, and are classified as real property. The home must be new or an existing manufactured home already financed by a USDA loan. Site-built homes, condos, and townhomes in eligible areas are also covered." },
  ],
}

const jumboLoans: SubServiceDefinition = {
  name: "Jumbo Loans",
  slug: "jumbo",
  parentService: "loans",
  parentName: "Loans",
  parentHref: "/loans",
  metaTitle: (city) => `Jumbo Mortgage Loans in ${city}, Utah`,
  metaDescription: (city) =>
    `Jumbo home loans in ${city}, UT for properties that exceed the current FHFA conforming limit for the county. This is not a quote.`,
  features: [
    { title: "Higher Loan Amounts", description: "Finance luxury and high-value properties that exceed conforming loan limits: no arbitrary ceiling on your home purchase", iconName: "Building" },
    { title: "Competitive Rates", description: "Jumbo rates have narrowed significantly and are often comparable to conforming rates for well-qualified borrowers", iconName: "TrendingDown" },
    { title: "Flexible Structures", description: "Fixed-rate, adjustable-rate, and interest-only options available to match your financial strategy", iconName: "Settings" },
    { title: "Portfolio Lending", description: "Loans held in-house by the lender, allowing for more flexible underwriting guidelines on complex income situations", iconName: "Briefcase" },
  ],
  howItWorks: [
    { step: "1", title: "Financial Review", desc: "Jumbo loans require thorough documentation. We review your income, assets, reserves, and credit to match you with lenders whose guidelines fit your profile. Self-employed borrowers and those with complex income need a lender experienced with non-standard documentation." },
    { step: "2", title: "Rate Shopping", desc: "We compare jumbo rates and terms from multiple portfolio lenders and correspondent lenders. Jumbo pricing varies more between lenders than conforming loans, so shopping is especially valuable at this price point." },
    { step: "3", title: "Appraisal & Close", desc: "High-value properties often require a full appraisal by an appraiser experienced with luxury homes. We ensure the appraiser has comparable sales data that supports your purchase price, and manage the underwriting process to a smooth close." },
  ],
  localizedIntro: (city, data) =>
    `For ${city} properties priced above conforming loan limits, a jumbo mortgage is the financing path when the purchase price exceeds FHFA limits. With a median home price of ${fmtUsd(data.medianHomePrice)}, ${city} includes both entry-level and high-value homes, and the high end requires specialized financing. Jumbo loans are used for ${city} neighborhoods where homes regularly exceed $750,000. Buyers in the ${data.schoolDistrict} area where home values can reach $1M+ work with jumbo lenders who can structure financing around complex income documentation common in ${city}'s tech and professional employment base.`,
  localizedBenefits: (city, _data) => [
    `Finance ${city} properties above the current FHFA conforming limit for that county. Look up the table; do not use a number from an old post.`,
    `Term options can include 30-year fixed and ARMs. Interest-only is an overlay, not a promise.`,
    `Portfolio lending may exist for self-employed buyers when documentation fits`,
    `Second home and investment jumbo options depend on occupancy and LTV, not a slogan`,
  ],
  baseFaqs: [
    { q: "What is the current conforming loan limit?", a: "Conforming loan limits are set annually by the Federal Housing Finance Agency. In most Utah counties, the limit for a single-family home is updated each year. Properties priced above this limit require jumbo financing. We can confirm the current limit for your county and help you determine whether conforming or jumbo financing is the right path. Some high-cost areas may have higher conforming limits." },
    { q: "What are jumbo loan requirements?", a: "Jumbo loans typically require a minimum credit score of 700–720, a down payment of 10–20% (some lenders offer 10% down with strong reserves), 6–12 months of reserves after closing, and a debt-to-income ratio below 43%. Requirements vary by lender, portfolio lenders often have more flexibility on income documentation and reserve requirements." },
    { q: "Are jumbo rates higher than conforming?", a: "Not necessarily. The spread between jumbo and conforming pricing changes. Compare Loan Estimates. We will not publish a promised spread such as 0.125–0.25%." },
    { q: "Can I get a jumbo loan for an investment property?", a: "Yes, but expect stricter requirements. Investment property jumbo loans typically require 25–30% down, credit scores of 720+, and 12 months of reserves. Rental income from the subject property may be used to qualify if supported by a lease or comparable rent analysis. We work with lenders experienced in investor jumbo financing." },
  ],
}

// ─── Buy-Sell Sub-Services ─────────────────────────────────────────────────

const firstTimeBuyers: SubServiceDefinition = {
  name: "First-Time Home Buyers",
  slug: "first-time-buyers",
  parentService: "buy-sell",
  parentName: "Buy & Sell",
  parentHref: "/buy-sell",
  metaTitle: (city) => `First-Time Home Buyers in ${city}, Utah`,
  metaDescription: (city) =>
    `First-time home buyer guide for ${city}, UT, down payment assistance, loan options, and local agent guidance. Ondo Real Estate.`,
  features: [
    { title: "Down Payment Assistance", description: "Access Utah Housing Corporation grants and loans that cover up to 6% of your purchase price for down payment and closing costs", iconName: "PiggyBank" },
    { title: "Buyer Education", description: "Free homebuyer education courses that satisfy lender requirements and help you make informed decisions", iconName: "GraduationCap" },
    { title: "Local Market Guidance", description: "Agents who know the neighborhoods, schools, and market conditions in your target area", iconName: "MapPin" },
    { title: "Negotiation Support", description: "Expert negotiation on price, repairs, and seller concessions to protect your interests and your budget", iconName: "Handshake" },
  ],
  howItWorks: [
    { step: "1", title: "Assess Your Budget", desc: "We review your income, savings, credit, and monthly expenses to determine a realistic home budget. We explore all available programs: FHA, conventional, VA, USDA, and Utah Housing down payment assistance: to find the combination that minimizes your out-of-pocket costs." },
    { step: "2", title: "Home Search & Offers", desc: "Using your budget and priorities, we search for homes that match your needs. Our agents provide local insight on neighborhoods, commute patterns, school quality, and resale value. When you find the right home, we craft a competitive offer strategy." },
    { step: "3", title: "Inspection to Close", desc: "We guide you through home inspection, negotiate any needed repairs, coordinate your loan closing, and ensure you understand every document you sign. From offer to keys, we're with you at every step." },
  ],
  localizedIntro: (city, data) =>
    `Buying your first home in ${city} is one of the biggest financial decisions you'll make, and the local market rewards buyers who are prepared. With a median home price of ${fmtUsd(data.medianHomePrice)} and homes averaging ${data.avgDaysOnMarket} days on market, ${city} moves at a pace that requires pre-approval, clear priorities, and an agent who knows the area. First-time buyers in ${city} often work near ${data.topEmployers[0]} or ${data.topEmployers[1] || "local employers"}, earning around the ${city} median household income of ${fmtUsd(data.medianHouseholdIncome)}. Utah Housing Corporation offers down payment assistance grants and second mortgages that can cover your 3.5% FHA or 3% conventional down payment, making homeownership possible sooner than you think.`,
  localizedBenefits: (city, data) => [
    `Utah Housing down payment assistance covers up to ${fmtUsd(Math.round(data.medianHomePrice * 0.06))} on a median-priced ${city} home`,
    `Monthly mortgage payment of ~${fmtUsd(Math.round(data.medianHomePrice * 0.965 * 0.006))} may be comparable to ${city}'s median rent of ${fmtUsd(data.medianRent)}`,
    `${data.schoolDistrict} school quality supports long-term property value appreciation in ${city}`,
    `${city} homes average ${data.avgDaysOnMarket} days on market, we help you move quickly when the right home appears`,
  ],
  baseFaqs: [
    { q: "How much do I need for a down payment?", a: "It depends on your loan type and whether you qualify for down payment assistance. FHA loans require 3.5% down, conventional loans start at 3%, VA loans require zero down, and USDA loans require zero down in eligible areas. Utah Housing Corporation offers grants and forgivable second mortgages that can cover your entire down payment and some closing costs. We help you identify every available program to minimize your out-of-pocket costs." },
    { q: "What's the first step to buying a home?", a: "Ask a lender about a documented pre-approval before you shop. A letter can clarify a budget range and which programs might fit. It does not tell you that you will qualify or lock a payment. Sellers often want to see a letter. We can connect you with lenders who work with first-time buyer programs." },
    { q: "How long does it take to buy a home?", a: "From pre-approval to closing typically takes 45–90 days, depending on how quickly you find a home and your loan type. The home search itself varies, some buyers find a home in a week, others take several months. Once you're under contract, expect 30–45 days to close for conventional and FHA loans, and 45–60 days for VA and USDA loans. We set realistic timelines based on your specific situation." },
    { q: "What costs beyond the down payment should I budget for?", a: "Plan for closing costs (2–4% of the purchase price), home inspection ($350–500), appraisal fee ($400–600), homeowner's insurance (first year paid at closing), and moving expenses. Some of these costs can be negotiated as seller concessions. We provide a detailed cost estimate early in the process so there are no surprises." },
  ],
}

const investmentProperties: SubServiceDefinition = {
  name: "Investment Properties",
  slug: "investment-properties",
  parentService: "buy-sell",
  parentName: "Buy & Sell",
  parentHref: "/buy-sell",
  metaTitle: (city) => `Investment Properties in ${city}, Utah`,
  metaDescription: (city) =>
    `Find and analyze rental investment properties in ${city}, UT. Cap rates, cash flow analysis, and property management. Ondo Real Estate.`,
  features: [
    { title: "Cash Flow Analysis", description: "Detailed pro forma projections including rent estimates, operating expenses, debt service, and net cash flow", iconName: "Calculator" },
    { title: "Market Comparables", description: "Rental and sales comparables to validate purchase price and projected rental income", iconName: "BarChart3" },
    { title: "Property Management", description: "Seamless transition from purchase to managed rental: tenant placement, maintenance, and reporting included", iconName: "Building2" },
    { title: "1031 Exchange Support", description: "Coordination with qualified intermediaries for tax-deferred exchanges when upgrading your portfolio", iconName: "ArrowRightLeft" },
  ],
  howItWorks: [
    { step: "1", title: "Investment Criteria", desc: "We define your target returns, budget, preferred property type, and management expectations. Whether you're buying your first rental or adding to a portfolio, we tailor the search to your investment thesis." },
    { step: "2", title: "Deal Analysis", desc: "For every property we present, you get a cash flow analysis including purchase price, down payment, financing costs, projected rent, operating expenses (vacancy, maintenance, insurance, taxes, management), and net yield. No surprises." },
    { step: "3", title: "Acquire & Manage", desc: "Once you close, our property management team takes over: marketing, tenant placement, rent collection, maintenance, and reporting. You get passive income without the daily operational burden." },
  ],
  localizedIntro: (city, data) =>
    `${city}'s rental market presents a compelling investment opportunity. With a median home price of ${fmtUsd(data.medianHomePrice)} and median rent of ${fmtUsd(data.medianRent)}/month, the gross rent multiplier sits at approximately ${(data.medianHomePrice / (data.medianRent * 12)).toFixed(1)}×, meaning the purchase price represents roughly ${(data.medianHomePrice / (data.medianRent * 12)).toFixed(1)} years of gross rental income. Population growth of ${data.growthRate} annually, driven by employers like ${data.topEmployers[0]} and ${data.topEmployers[1] || "local businesses"}, supports sustained rental demand. With ${pct(100 - data.ownerOccupiedPct)} of ${city} households renting, the tenant pool is established and active. We help investors identify properties that generate positive cash flow from day one and build long-term equity in ${city}'s appreciating market.`,
  localizedBenefits: (city, data) => [
    `Gross rent multiplier of ${(data.medianHomePrice / (data.medianRent * 12)).toFixed(1)}× at ${city}'s median price point`,
    `${pct(100 - data.ownerOccupiedPct)} renter-occupied households in ${city} provide an established tenant pool`,
    `${data.growthRate} annual population growth drives increasing rental demand`,
    `Turn-key property management included, from tenant placement to monthly owner reporting`,
  ],
  baseFaqs: [
    { q: "What return should I expect on a rental property?", a: "Returns vary by property, financing, and management approach. In the current market, cash-on-cash returns for a well-purchased rental property typically range from 4–8% before appreciation. Cap rates for single-family rentals generally run 4–6%. Total returns including appreciation, principal paydown, and tax benefits can exceed 12–15% annually. We provide property-specific pro forma analysis so you know exactly what to expect before making an offer." },
    { q: "How much down payment do I need for an investment property?", a: "Investment property loans typically require 15–25% down for a single-family rental and 25% for 2–4 unit properties. Some portfolio lenders offer 10% down for strong borrowers. DSCR (debt service coverage ratio) loans are available for investors who prefer to qualify based on the property's rental income rather than personal income. We help you structure financing that preserves capital for multiple acquisitions." },
    { q: "Should I self-manage or hire a property manager?", a: "It depends on your time, proximity, and number of properties. Self-management saves the management fee (typically 8–10% of rent) but requires you to handle tenant calls, maintenance coordination, rent collection, and legal compliance. As your portfolio grows past 2–3 units, the time investment usually exceeds the management fee savings. Our property management service handles everything from day one." },
    { q: "What about 1031 exchanges?", a: "A 1031 exchange lets you defer capital gains taxes when you sell an investment property and reinvest the proceeds into a like-kind replacement property. Strict timelines apply: 45 days to identify replacement properties and 180 days to close. We coordinate with qualified intermediaries and help you identify replacement properties that improve your portfolio's cash flow and appreciation potential." },
  ],
}

const homeValuation: SubServiceDefinition = {
  name: "Home Valuation",
  slug: "home-valuation",
  parentService: "buy-sell",
  parentName: "Buy & Sell",
  parentHref: "/buy-sell",
  metaTitle: (city) => `Home Valuation in ${city}, Utah`,
  metaDescription: (city) =>
    `Free home valuation for ${city}, UT properties. Accurate CMA based on recent sales, condition, and local market trends. Ondo Real Estate.`,
  features: [
    { title: "Comparative Market Analysis", description: "Detailed CMA using recent sales of similar homes in your neighborhood: not just Zestimate-style algorithms", iconName: "Search" },
    { title: "Condition Adjustments", description: "Adjustments for upgrades, deferred maintenance, lot size, and view premiums that automated tools miss", iconName: "SlidersHorizontal" },
    { title: "Market Trend Context", description: "Analysis of current supply, demand, days on market, and price trends specific to your neighborhood", iconName: "TrendingUp" },
    { title: "Net Proceeds Estimate", description: "Estimate of your net proceeds after selling costs, remaining mortgage, and closing fees", iconName: "Receipt" },
  ],
  howItWorks: [
    { step: "1", title: "Property Information", desc: "Share your property address, any upgrades you've made, and your timeline. We pull tax records, previous sale data, and current market listings for your area to begin the analysis." },
    { step: "2", title: "CMA Preparation", desc: "We identify 5–10 comparable properties that have sold recently in your area, adjusting for differences in size, condition, lot, and features. This produces a market-supported value range: not a single number, but a range that reflects realistic buyer expectations." },
    { step: "3", title: "Strategy Session", desc: "We walk you through the CMA, discuss pricing strategy (at, above, or below market and why), estimate your net proceeds, and outline a marketing plan if you decide to sell." },
  ],
  localizedIntro: (city, data) =>
    `Understanding your home's value in ${city}'s current market is the foundation of any selling decision. With the median home price at ${fmtUsd(data.medianHomePrice)} and homes averaging ${data.avgDaysOnMarket} days on market, pricing accuracy is critical, overpriced homes sit, underpriced homes leave money on the table. Our comparative market analysis goes beyond algorithm-based estimates by accounting for condition, upgrades, lot characteristics, and hyperlocal trends specific to your ${city} neighborhood. Whether you're considering selling, refinancing, or simply want to track your equity, a professional CMA gives you the data you need to make an informed decision.`,
  localizedBenefits: (city, data) => [
    `Analysis based on real ${city} sales data, not nationwide algorithm estimates`,
    `Condition and upgrade adjustments that automated tools miss (kitchen remodel, new roof, landscaping)`,
    `Net proceeds estimate after selling costs, mortgage payoff, and closing fees`,
    `Market context: ${city} homes average ${data.avgDaysOnMarket} days on market with ${data.growthRate} annual price growth`,
  ],
  baseFaqs: [
    { q: "How accurate are online home value estimates?", a: "Online tools like Zillow's Zestimate and Redfin estimates use algorithms based on public data, tax records, previous sales, and area averages. They can be off by 5–15% because they can't account for interior condition, upgrades, lot characteristics, views, or hyperlocal factors. A professional CMA uses recent comparable sales with manual adjustments for these factors, producing a much more accurate value range." },
    { q: "What makes a good comp?", a: "The best comparables are homes that sold within the last 3–6 months, are within a half-mile of your property, are similar in size (within 200 sq ft), have the same number of bedrooms and bathrooms, and are in similar condition. We adjust for differences, a recently renovated kitchen, a larger lot, a finished basement, to normalize the comparison." },
    { q: "How often should I get a home valuation?", a: "We recommend a professional CMA annually for homeowners considering selling within the next 2–3 years, or whenever a life event (job change, family size change, retirement planning) prompts a housing decision. Active refinancers should get a CMA before ordering a formal appraisal, since the CMA helps you understand whether the appraisal is likely to support your refinance goal." },
    { q: "Is a CMA the same as an appraisal?", a: "No. A CMA is a market analysis prepared by a real estate agent for pricing and marketing purposes. An appraisal is a formal valuation by a licensed appraiser, required by lenders for mortgage transactions. CMAs and appraisals use similar methodology (comparable sales analysis with adjustments), but appraisals carry legal weight and follow stricter USPAP guidelines. Our CMAs are thorough enough to serve as a reliable preview of what an appraisal might find." },
  ],
}

// ─── Export ────────────────────────────────────────────────────────────────

export const subServiceDefinitions: Record<string, SubServiceDefinition> = {
  "tenant-screening": tenantScreening,
  "maintenance-coordination": maintenanceCoordination,
  "owner-reporting": ownerReporting,
  fha: fhaLoans,
  conventional: conventionalLoans,
  va: vaLoans,
  usda: usdaLoans,
  jumbo: jumboLoans,
  "first-time-buyers": firstTimeBuyers,
  "investment-properties": investmentProperties,
  "home-valuation": homeValuation,
}

export function getSubServicesForParent(
  parent: "property-management" | "loans" | "buy-sell",
): SubServiceDefinition[] {
  return Object.values(subServiceDefinitions).filter(
    (s) => s.parentService === parent,
  )
}

export function getSubServiceSlugsForParent(
  parent: "property-management" | "loans" | "buy-sell",
): string[] {
  return getSubServicesForParent(parent).map((s) => s.slug)
}
