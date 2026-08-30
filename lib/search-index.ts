import { getNotaryCitiesByStateSlug, notaryCityPath, notaryStatePath } from './notary-cities'
import { getServedRonStates } from './notary-ron-states'

export interface SearchResult {
  id: string
  title: string
  description: string
  href: string
  category: 'Page' | 'Calculator' | 'Blog' | 'Service'
  keywords?: string[]
}

// Navigation pages
const pages: SearchResult[] = [
  {
    id: 'buy',
    title: 'Buy a Home',
    description: 'Find your dream home in Utah',
    href: '/buy',
    category: 'Page',
    keywords: ['buy', 'purchase', 'home', 'house', 'property', 'real estate']
  },
  {
    id: 'sell',
    title: 'Sell a Home',
    description: 'Sell your property with expert guidance',
    href: '/sell',
    category: 'Page',
    keywords: ['sell', 'sale', 'home', 'house', 'property', 'listing']
  },
  {
    id: 'properties',
    title: 'Properties',
    description: 'Browse available rental properties',
    href: '/properties',
    category: 'Page',
    keywords: ['properties', 'rentals', 'rent', 'listings', 'apartments', 'houses']
  },
  {
    id: 'loans',
    title: 'Mortgage Loans',
    description: 'Compare conventional, FHA, VA, and USDA education. Talk with a loan officer.',
    href: '/loans',
    category: 'Service',
    keywords: ['loans', 'mortgage', 'financing', 'pre-approval', 'lending', 'learn']
  },
  {
    id: 'learn',
    title: 'Mortgage learning hub',
    description: 'Topic clusters for loan programs, variable income, first-time buyers, and refinance',
    href: '/learn',
    category: 'Page',
    keywords: ['mortgage education', 'learn', 'loan programs', 'variable income', 'first time buyer']
  },
  {
    id: 'learn-variable-income',
    title: 'Variable income mortgages',
    description: 'How underwriters treat overtime, 1099, commission, and self-employed income',
    href: '/learn/variable-income',
    category: 'Page',
    keywords: ['self employed', '1099', 'commission', 'variable income', 'bank statement loan', 'K-1', 'Schedule E']
  },
  {
    id: 'learn-first-time',
    title: 'First-time buyer cash and closing',
    description: 'Cash besides down payment, DPA stacked with gifts, and Utah closing costs',
    href: '/learn/first-time',
    category: 'Page',
    keywords: ['first time buyer', 'cash to close', 'down payment assistance', 'Utah closing costs', 'gift letter', 'parent gift']
  },
  {
    id: 'learn-non-qm',
    title: 'Non-QM, bank-statement, and DSCR',
    description: 'When agency tax-return income does not match cash flow: bank-statement, DSCR, asset-depletion',
    href: '/learn/non-qm',
    category: 'Page',
    keywords: ['Non-QM', 'bank statement', 'DSCR', 'asset depletion', 'self employed']
  },
  {
    id: 'learn-investment',
    title: 'Investment property financing',
    description: 'DSCR vs full-doc, occupancy types, cash-out to buy a rental, FHA duplex house-hack',
    href: '/learn/investment',
    category: 'Page',
    keywords: ['investment property', 'DSCR', 'house hack', 'occupancy', 'rental loan']
  },
  {
    id: 'qualify',
    title: 'Start a mortgage conversation',
    description: 'What you will be asked, and what a conversation will not promise',
    href: '/qualify',
    category: 'Page',
    keywords: ['qualify', 'prequalify', 'mortgage conversation', 'pre-approval questions']
  },
  {
    id: 'notary',
    title: 'Notary Services',
    description: 'Remote online notary (RON) nationwide',
    href: '/notary',
    category: 'Service',
    keywords: ['notary', 'notarization', 'remote notary', 'ron', 'signing']
  },
  {
    id: 'notary-on-demand',
    title: 'On-Demand Notary',
    description: 'Urgent notarization, we try to accommodate same-day when capacity allows',
    href: '/notary/on-demand',
    category: 'Service',
    keywords: ['on demand notary', 'same day notary', 'urgent notary', 'same-day notarization']
  },
  {
    id: 'socials',
    title: 'Socials & Updates',
    description: 'Curated social posts, profile links, and latest real estate news',
    href: '/socials',
    category: 'Page',
    keywords: ['socials', 'social media', 'updates', 'news', 'linktree']
  },
  {
    id: 'calculators',
    title: 'Calculators',
    description: 'Real estate calculators and tools',
    href: '/calculators',
    category: 'Page',
    keywords: ['calculators', 'tools', 'mortgage calculator', 'affordability']
  },
  {
    id: 'why-utah',
    title: 'Why Utah',
    description: 'Why choose Utah for real estate',
    href: '/why-utah',
    category: 'Page',
    keywords: ['utah', 'location', 'why utah', 'real estate market']
  },
  {
    id: 'moving-to-utah',
    title: 'New to Utah',
    description: 'Commute minutes, typical rents, and next steps for a Wasatch Front start date',
    href: '/moving-to-utah',
    category: 'Page',
    keywords: ['moving', 'relocation', 'commute', 'start date', 'new to utah', 'incoming', 'wasatch']
  },
  {
    id: 'about',
    title: 'About Us',
    description: 'Learn about our company and mission',
    href: '/about',
    category: 'Page',
    keywords: ['about', 'company', 'team', 'mission']
  },
  {
    id: 'contact',
    title: 'Contact Us',
    description: 'Get in touch with our team',
    href: '/contact',
    category: 'Page',
    keywords: ['contact', 'get in touch', 'support', 'help']
  },
  {
    id: 'faq',
    title: 'FAQ',
    description: 'Frequently asked questions',
    href: '/faq',
    category: 'Page',
    keywords: ['faq', 'questions', 'help', 'answers']
  },
  {
    id: 'blog',
    title: 'Blog',
    description: 'Real estate insights and tips',
    href: '/blog',
    category: 'Page',
    keywords: ['blog', 'articles', 'insights', 'tips', 'news']
  },
  {
    id: 'sweepstakes',
    title: 'Win Prizes',
    description: 'Enter our sweepstakes to win prizes',
    href: '/sweepstakes',
    category: 'Page',
    keywords: ['sweepstakes', 'prizes', 'win', 'contest']
  }
]

const notaryLocationPages: SearchResult[] = [
  {
    id: 'notary-locations',
    title: 'Notary locations',
    description: 'State hubs for remote online notary nationwide',
    href: '/notary/locations',
    category: 'Service',
    keywords: ['notary locations', 'RON states', 'online notary near me']
  },
  ...getServedRonStates().map((state) => ({
    id: `notary-${state.slug}`,
    title: `Remote online notary in ${state.name}`,
    description: `${state.name} RON hub page`,
    href: notaryStatePath(state.slug),
    category: 'Service' as const,
    keywords: ['remote online notary', state.name.toLowerCase(), `${state.code} notary`],
  })),
  ...getNotaryCitiesByStateSlug('utah').map((city) => ({
    id: `notary-${city.stateSlug}-${city.slug}`,
    title: `Remote online notary in ${city.name}, Utah`,
    description: `Utah remote online notary (RON) for ${city.name}`,
    href: notaryCityPath(city.stateSlug, city.slug),
    category: 'Service' as const,
    keywords: ['online notary', 'utah', city.name.toLowerCase()],
  })),
]

// Calculators
const calculators: SearchResult[] = [
  {
    id: 'mortgage-payment',
    title: 'Mortgage Payment Calculator',
    description: 'Calculate your monthly mortgage payment including principal, interest, taxes, and insurance',
    href: '/calculators/mortgage-payment',
    category: 'Calculator',
    keywords: ['mortgage payment', 'monthly payment', 'principal', 'interest', 'PITI']
  },
  {
    id: 'affordability',
    title: 'Affordability Calculator',
    description: 'Determine how much house you can afford based on your income and expenses',
    href: '/calculators/affordability',
    category: 'Calculator',
    keywords: ['affordability', 'how much can I afford', 'income', 'expenses']
  },
  {
    id: 'income',
    title: 'Income Calculator',
    description: 'Calculate required income to qualify for a specific mortgage amount',
    href: '/calculators/income',
    category: 'Calculator',
    keywords: ['income', 'qualify', 'mortgage qualification', 'required income']
  },
  {
    id: 'closing-cost',
    title: 'Closing Cost Calculator',
    description: 'Estimate all closing costs when purchasing a home',
    href: '/calculators/closing-cost',
    category: 'Calculator',
    keywords: ['closing costs', 'closing', 'purchase costs', 'fees']
  },
  {
    id: 'refinance',
    title: 'Refinance Calculator',
    description: 'Analyze the benefits of refinancing your existing mortgage',
    href: '/calculators/refinance',
    category: 'Calculator',
    keywords: ['refinance', 'refinancing', 'mortgage refinance', 'lower rate']
  },
  {
    id: 'home-sale',
    title: 'Home Sale Calculator',
    description: 'Calculate net proceeds from selling your home after all costs',
    href: '/calculators/home-sale',
    category: 'Calculator',
    keywords: ['home sale', 'selling', 'net proceeds', 'sale proceeds']
  },
  {
    id: 'buying-power',
    title: 'Buying Power Calculator',
    description: 'Determine your maximum home purchase price based on available funds',
    href: '/calculators/buying-power',
    category: 'Calculator',
    keywords: ['buying power', 'purchase price', 'maximum price', 'down payment']
  },
  {
    id: 'temporary-buydown',
    title: 'Temporary Buydown Calculator',
    description: 'Calculate temporary interest rate buydown benefits and costs',
    href: '/calculators/temporary-buydown',
    category: 'Calculator',
    keywords: ['buydown', 'temporary buydown', 'interest rate buydown']
  },
  {
    id: 'rent-vs-own',
    title: 'Rent vs Own Calculator',
    description: 'Compare the financial implications of renting versus buying a home',
    href: '/calculators/rent-vs-own',
    category: 'Calculator',
    keywords: ['rent vs own', 'renting vs buying', 'rent or buy', 'comparison']
  },
  {
    id: 'retirement',
    title: 'Retirement Calculator',
    description: 'Plan your retirement savings and investment strategy for real estate',
    href: '/calculators/retirement',
    category: 'Calculator',
    keywords: ['retirement', 'retirement planning', 'savings', 'investment']
  },
  {
    id: 'cash-on-cash',
    title: 'Cash-on-Cash Return Calculator',
    description: 'Calculate the annual return on your actual cash investment in rental properties',
    href: '/calculators/cash-on-cash',
    category: 'Calculator',
    keywords: ['cash on cash', 'return', 'ROI', 'rental investment', 'cash return']
  },
  {
    id: 'cap-rate',
    title: 'Cap Rate Calculator',
    description: 'Calculate the capitalization rate to evaluate property income potential',
    href: '/calculators/cap-rate',
    category: 'Calculator',
    keywords: ['cap rate', 'capitalization rate', 'property income', 'investment']
  },
  {
    id: 'roi',
    title: 'ROI Calculator',
    description: 'Calculate total return on investment including cash flow and appreciation',
    href: '/calculators/roi',
    category: 'Calculator',
    keywords: ['ROI', 'return on investment', 'cash flow', 'appreciation']
  },
  {
    id: 'grm',
    title: 'Gross Rent Multiplier Calculator',
    description: 'Quick screening tool to evaluate property price relative to rental income',
    href: '/calculators/grm',
    category: 'Calculator',
    keywords: ['GRM', 'gross rent multiplier', 'rental income', 'screening']
  },
  {
    id: 'dscr',
    title: 'DSCR Calculator',
    description: 'Calculate Debt Service Coverage Ratio for investment property loans',
    href: '/calculators/dscr',
    category: 'Calculator',
    keywords: ['DSCR', 'debt service coverage ratio', 'investment property', 'rental qualification', 'full doc']
  },
  {
    id: 'one-percent-rule',
    title: '1% Rule Calculator',
    description: 'Quick screening tool: monthly rent should be at least 1% of purchase price',
    href: '/calculators/one-percent-rule',
    category: 'Calculator',
    keywords: ['1% rule', 'one percent rule', 'rental screening', 'rule of thumb']
  },
  {
    id: 'fifty-percent-rule',
    title: '50% Rule Calculator',
    description: 'Estimate operating expenses: typically 50% of gross rental income',
    href: '/calculators/fifty-percent-rule',
    category: 'Calculator',
    keywords: ['50% rule', 'fifty percent rule', 'operating expenses', 'expenses']
  }
]

// Blog posts
const blogPosts: SearchResult[] = [
  {
    id: 'remote-online-notary-all-50-states',
    title: 'Remote Online Notary in All 50 States',
    description: 'How ONDO Notary delivers secure Remote Online Notarization nationwide with ID checks, audit trails, and lender-ready documents',
    href: '/blog/remote-online-notary-all-50-states',
    category: 'Blog',
    keywords: ['notary', 'remote notary', 'online notary', 'RON', 'notarization']
  },
  {
    id: 'renting-vs-owning-hidden-math',
    title: 'The Hidden Math Behind Renting vs Owning',
    description: 'Opportunity cost, equity velocity, and inflation-adjusted rent modeled by a developer-landlord',
    href: '/blog/renting-vs-owning-hidden-math',
    category: 'Blog',
    keywords: ['rent vs own', 'renting', 'owning', 'math', 'comparison']
  },
  {
    id: 'full-stack-dev-landlord-gaps',
    title: 'I\'m a Full-Stack Dev and Landlord: What Software Gets Wrong',
    description: 'UX gaps in property software and how to design flows that serve tenants and owners',
    href: '/blog/full-stack-dev-landlord-gaps',
    category: 'Blog',
    keywords: ['software', 'property management', 'UX', 'landlord', 'tenant']
  },
  {
    id: 'commercial-real-estate-101-tenant-mix',
    title: 'Commercial Real Estate 101: Cap Rates, NNN, and Tenant Mix',
    description: 'A practical primer on how cap rates, lease structures, and tenant mix shape CRE value',
    href: '/blog/commercial-real-estate-101-tenant-mix',
    category: 'Blog',
    keywords: ['commercial real estate', 'cap rates', 'NNN', 'tenant mix', 'CRE']
  },
  {
    id: 'crypto-and-real-estate-hedge',
    title: 'Crypto and Real Estate: Building a Barbell Hedge',
    description: 'Balancing fast, volatile assets with slow, cashflowing rentals, without co-mingling risk',
    href: '/blog/crypto-and-real-estate-hedge',
    category: 'Blog',
    keywords: ['crypto', 'real estate', 'hedge', 'investment', 'strategy']
  },
  {
    id: 'new-landlord-mistakes-systems',
    title: 'New Landlord Mistakes and the Systems That Prevent Them',
    description: 'Documentation, reserves, maintenance states, and comms playbooks to avoid expensive errors',
    href: '/blog/new-landlord-mistakes-systems',
    category: 'Blog',
    keywords: ['landlord', 'mistakes', 'systems', 'documentation', 'maintenance']
  },
  {
    id: 'utah-rent-vs-buy-wasatch-front',
    title: 'Utah Rent vs Buy: Wasatch Front Playbook',
    description: 'Corridor-specific math on taxes, transit, schools, and maintenance along the Wasatch Front',
    href: '/blog/utah-rent-vs-buy-wasatch-front',
    category: 'Blog',
    keywords: ['utah', 'rent vs buy', 'wasatch front', 'utah real estate']
  },
  {
    id: 'property-management-automation-checklist',
    title: 'Property Management Automation Checklist',
    description: 'High-ROI automations for rent, maintenance, and owner reporting, built by a dev-operator',
    href: '/blog/property-management-automation-checklist',
    category: 'Blog',
    keywords: ['property management', 'automation', 'checklist', 'ROI']
  },
  {
    id: 'vacancy-risk-playbook',
    title: 'Vacancy Risk Playbook',
    description: 'Model, reduce, and recover from vacancy with renewals, turns, and seasonality tactics',
    href: '/blog/vacancy-risk-playbook',
    category: 'Blog',
    keywords: ['vacancy', 'risk', 'playbook', 'renewals', 'turnover']
  },
  {
    id: 'why-utah-best-real-estate-investment',
    title: 'Why Utah is the Best Real Estate Investment',
    description: 'Analysis of Utah\'s real estate market and investment potential',
    href: '/blog/why-utah-best-real-estate-investment',
    category: 'Blog',
    keywords: ['utah', 'real estate investment', 'utah market', 'investment']
  },
  {
    id: 'maintenance-capex-strategy',
    title: 'Maintenance and CapEx Strategy',
    description: 'How to plan and budget for property maintenance and capital expenditures',
    href: '/blog/maintenance-capex-strategy',
    category: 'Blog',
    keywords: ['maintenance', 'capex', 'capital expenditures', 'budgeting']
  },
  {
    id: 'dashboards-for-landlords',
    title: 'Dashboards for Landlords',
    description: 'Building effective dashboards to track property performance and metrics',
    href: '/blog/dashboards-for-landlords',
    category: 'Blog',
    keywords: ['dashboards', 'landlord', 'metrics', 'performance', 'tracking']
  },
  {
    id: 'designing-property-owner-portal',
    title: 'Designing Property Owner Portal',
    description: 'UX and design considerations for property owner portals',
    href: '/blog/designing-property-owner-portal',
    category: 'Blog',
    keywords: ['property owner', 'portal', 'UX', 'design']
  },
  {
    id: 'engineering-real-estate-investment-calculators',
    title: 'Engineering Real Estate Investment Calculators',
    description: 'Technical deep dive into building accurate real estate calculators',
    href: '/blog/engineering-real-estate-investment-calculators',
    category: 'Blog',
    keywords: ['calculators', 'engineering', 'real estate', 'investment']
  },
  {
    id: 'building-high-performance-real-estate-nextjs-supabase',
    title: 'Building High Performance Real Estate Apps with Next.js and Supabase',
    description: 'Technical guide to building scalable real estate applications',
    href: '/blog/building-high-performance-real-estate-nextjs-supabase',
    category: 'Blog',
    keywords: ['nextjs', 'supabase', 'performance', 'real estate apps']
  },
  {
    id: 'mobile-notary-utah-county-guide',
    title: 'Notary in Utah County: Remote Online Notarization',
    description: 'RON for Utah County clients, posted fees, same-day when capacity allows, no mobile travel appointments',
    href: '/blog/mobile-notary-utah-county-guide',
    category: 'Blog',
    keywords: ['remote online notary', 'utah county', 'ron', 'notary services']
  },
  {
    id: 'modernizing-notary-workflows-integration',
    title: 'Modernizing Notary Workflows and Integration',
    description: 'How to modernize notary workflows with technology and integrations',
    href: '/blog/modernizing-notary-workflows-integration',
    category: 'Blog',
    keywords: ['notary', 'workflows', 'integration', 'technology']
  },
  {
    id: 'prepare-for-remote-online-notary-session',
    title: 'Prepare for Remote Online Notary Session',
    description: 'Step-by-step guide to preparing for a remote online notary session',
    href: '/blog/prepare-for-remote-online-notary-session',
    category: 'Blog',
    keywords: ['remote notary', 'online notary', 'preparation', 'session']
  },
  {
    id: 'remote-online-notary-real-estate-closings',
    title: 'Remote Online Notary for Real Estate Closings',
    description: 'How remote online notary is transforming real estate closings',
    href: '/blog/remote-online-notary-real-estate-closings',
    category: 'Blog',
    keywords: ['remote notary', 'real estate closings', 'closings', 'notarization']
  },
  {
    id: 'technical-seo-for-real-estate',
    title: 'Technical SEO for Real Estate',
    description: 'SEO strategies and best practices for real estate websites',
    href: '/blog/technical-seo-for-real-estate',
    category: 'Blog',
    keywords: ['SEO', 'technical SEO', 'real estate', 'marketing']
  },
  {
    id: 'can-i-get-a-mortgage-if-my-income-changes-every-month',
    title: 'Can I Get a Mortgage If My Income Changes Every Month?',
    description: 'How underwriters average overtime, commission, and 1099 income',
    href: '/blog/can-i-get-a-mortgage-if-my-income-changes-every-month',
    category: 'Blog',
    keywords: ['variable income', 'commission', 'overtime', 'mortgage qualification']
  },
  {
    id: '1099-mortgage-documentation-checklist',
    title: '1099 Mortgage Documentation Checklist',
    description: 'Documents contract workers typically gather for a mortgage file',
    href: '/blog/1099-mortgage-documentation-checklist',
    category: 'Blog',
    keywords: ['1099', 'self employed', 'mortgage documents']
  },
  {
    id: 'bank-statement-loans-when-tax-returns-undercount-income',
    title: 'Bank-Statement Loans When Tax Returns Undercount Income',
    description: 'Non-QM bank-statement programs when write-offs shrink taxable income',
    href: '/blog/bank-statement-loans-when-tax-returns-undercount-income',
    category: 'Blog',
    keywords: ['bank statement loan', 'Non-QM', 'self employed']
  },
  {
    id: 'gift-funds-down-payment-rules',
    title: 'Gift Funds for a Down Payment',
    description: 'Gift letters and paper trails for FHA, conventional, and VA',
    href: '/blog/gift-funds-down-payment-rules',
    category: 'Blog',
    keywords: ['gift funds', 'down payment', 'gift letter']
  },
  {
    id: 'two-years-of-tax-returns-vs-one-year-mortgage',
    title: 'Two Years of Tax Returns vs One Year',
    description: 'When overlays allow a shorter self-employed history',
    href: '/blog/two-years-of-tax-returns-vs-one-year-mortgage',
    category: 'Blog',
    keywords: ['self employed', 'tax returns', 'one year overlay']
  },
  {
    id: 'w2-overtime-likely-to-continue',
    title: 'Overtime on a W-2',
    description: 'What likely to continue means for overtime income',
    href: '/blog/w2-overtime-likely-to-continue',
    category: 'Blog',
    keywords: ['overtime', 'W-2', 'variable income']
  },
  {
    id: 'commission-income-mortgage-averaging',
    title: 'Commission-Only Sales Averaging',
    description: 'How a down year is averaged on a commission file',
    href: '/blog/commission-income-mortgage-averaging',
    category: 'Blog',
    keywords: ['commission', 'sales income', 'mortgage averaging']
  },
  {
    id: 'utah-cash-to-close-besides-down-payment',
    title: 'Cash Besides Down Payment in Utah',
    description: 'Earnest money, title, prepaids, and reserves on top of down payment',
    href: '/blog/utah-cash-to-close-besides-down-payment',
    category: 'Blog',
    keywords: ['cash to close', 'first time buyer', 'Utah closing']
  },
  {
    id: 'dpa-stacked-with-fha-gift-funds',
    title: 'DPA Stacked with an FHA Gift',
    description: 'How assistance and gift funds can sit on the same FHA purchase',
    href: '/blog/dpa-stacked-with-fha-gift-funds',
    category: 'Blog',
    keywords: ['DPA', 'UHC', 'gift funds', 'FHA']
  },
  {
    id: 'va-funding-fee-finance-vs-pay-cash',
    title: 'VA Funding Fee: Finance vs Cash',
    description: 'Worked examples of financing the fee versus paying it at closing',
    href: '/blog/va-funding-fee-finance-vs-pay-cash',
    category: 'Blog',
    keywords: ['VA funding fee', 'veteran', 'VA loan']
  },
  {
    id: 'va-entitlement-second-va-loan',
    title: 'Can I Use VA If I Still Have a VA Loan?',
    description: 'Remaining entitlement, occupancy, and restoration',
    href: '/blog/va-entitlement-second-va-loan',
    category: 'Blog',
    keywords: ['VA entitlement', 'second VA loan']
  },
  {
    id: 'va-residual-income-vs-dti',
    title: 'VA Residual Income vs DTI',
    description: 'Why leftover cash can fail when DTI looks fine',
    href: '/blog/va-residual-income-vs-dti',
    category: 'Blog',
    keywords: ['VA residual income', 'DTI']
  },
  {
    id: 'usda-map-income-limit-eligibility',
    title: 'USDA Map and Income Limit',
    description: 'Address and household tests before you assume zero down',
    href: '/blog/usda-map-income-limit-eligibility',
    category: 'Blog',
    keywords: ['USDA map', 'USDA income limit', 'rural']
  },
  {
    id: 'jumbo-vs-conforming-fhfa-county-limit',
    title: 'Jumbo vs Conforming FHFA Lookup',
    description: 'How to look up this year’s county conforming limit',
    href: '/blog/jumbo-vs-conforming-fhfa-county-limit',
    category: 'Blog',
    keywords: ['jumbo', 'conforming', 'FHFA', 'loan limit']
  },
  {
    id: 'refinance-break-even-when-lower-rate-loses',
    title: 'When a Lower Rate Still Loses After Costs',
    description: 'Break-even including points and origination',
    href: '/blog/refinance-break-even-when-lower-rate-loses',
    category: 'Blog',
    keywords: ['refinance', 'break even', 'points']
  },
  {
    id: 'heloc-vs-cash-out-refinance',
    title: 'HELOC vs Cash-Out Refinance',
    description: 'Payment, lien position, and tax questions',
    href: '/blog/heloc-vs-cash-out-refinance',
    category: 'Blog',
    keywords: ['HELOC', 'cash-out', 'home equity']
  },
  {
    id: 'how-underwriters-verify-income',
    title: 'How Underwriters Verify Income',
    description: 'W-2 vs 1099 vs bank-statement stacks',
    href: '/blog/how-underwriters-verify-income',
    category: 'Blog',
    keywords: ['underwriting', 'income verification', 'W-2', '1099']
  },
  {
    id: 'declined-after-pre-approval',
    title: 'Declined After Pre-Approval',
    description: 'Typical condition fails between the letter and clear-to-close',
    href: '/blog/declined-after-pre-approval',
    category: 'Blog',
    keywords: ['pre-approval', 'declined', 'underwriting conditions']
  },
  {
    id: 'utah-closing-costs-title-origination-prepaids',
    title: 'Utah Closing Costs',
    description: 'Title, origination, and prepaids that vary by county',
    href: '/blog/utah-closing-costs-title-origination-prepaids',
    category: 'Blog',
    keywords: ['Utah closing costs', 'title', 'origination']
  },
  {
    id: 'utah-county-conforming-loan-limit-lookup',
    title: 'Utah County Conforming Limit How-To',
    description: 'Look up this year’s FHFA table for the property county',
    href: '/blog/utah-county-conforming-loan-limit-lookup',
    category: 'Blog',
    keywords: ['Utah loan limit', 'FHFA', 'Summit County']
  },
  {
    id: 'k-1-income-what-usually-counts',
    title: 'K-1 Income: What Usually Counts',
    description: 'Partnership and S-corp K-1 income vs distributions',
    href: '/blog/k-1-income-what-usually-counts',
    category: 'Blog',
    keywords: ['K-1', 'S-corp', 'partnership', 'qualifying income']
  },
  {
    id: 'schedule-e-rental-income-purchase-file',
    title: 'Schedule E Rental Income on a Purchase',
    description: 'How existing rental income is averaged vs proposed rent',
    href: '/blog/schedule-e-rental-income-purchase-file',
    category: 'Blog',
    keywords: ['Schedule E', 'rental income', 'depreciation', 'purchase']
  },
  {
    id: 'just-went-1099-last-month',
    title: 'I Just Went 1099 Last Month',
    description: 'Why brand-new 1099 income is usually not yet a qualifying average',
    href: '/blog/just-went-1099-last-month',
    category: 'Blog',
    keywords: ['1099', 'contractor', 'career change', 'seasoning']
  },
  {
    id: 'parent-gifting-down-payment-who-signs',
    title: 'Parent Is Gifting: Who Signs What',
    description: 'Gift letter, occupancy, and title when a parent helps with down payment',
    href: '/blog/parent-gifting-down-payment-who-signs',
    category: 'Blog',
    keywords: ['gift letter', 'parent gift', 'down payment signatures']
  },
  {
    id: 'student-loans-dti-idr-save',
    title: 'Student Loans and DTI After IDR / SAVE',
    description: 'A $0 dashboard line is not automatically $0 in DTI',
    href: '/blog/student-loans-dti-idr-save',
    category: 'Blog',
    keywords: ['student loans', 'DTI', 'IDR', 'SAVE']
  },
  {
    id: 'arm-caps-in-plain-english',
    title: 'ARM Caps in Plain English',
    description: 'Initial, periodic, and lifetime caps on the note rate',
    href: '/blog/arm-caps-in-plain-english',
    category: 'Blog',
    keywords: ['ARM', 'caps', '2/1/5', 'adjustable rate']
  },
  {
    id: 'fha-condo-roster-project-approval',
    title: 'FHA Condo Roster / Project Approval',
    description: 'Look up HUD project approval before an FHA condo offer',
    href: '/blog/fha-condo-roster-project-approval',
    category: 'Blog',
    keywords: ['FHA condo', 'HUD roster', 'single-unit approval']
  },
  {
    id: 'mip-vs-pmi-how-mortgage-insurance-ends',
    title: 'How MIP vs PMI Actually Leaves the Loan',
    description: 'FHA MIP clock vs conventional PMI cancellation',
    href: '/blog/mip-vs-pmi-how-mortgage-insurance-ends',
    category: 'Blog',
    keywords: ['MIP', 'PMI', 'mortgage insurance', 'FHA']
  },
  {
    id: 'fha-va-streamline-refinance-less-docs',
    title: 'Streamline Refi: What Less Docs Still Requires',
    description: 'FHA Streamline and VA IRRRL occupancy and net-benefit tests',
    href: '/blog/fha-va-streamline-refinance-less-docs',
    category: 'Blog',
    keywords: ['streamline', 'IRRRL', 'FHA refinance', 'less docs']
  },
  {
    id: 'large-deposits-60-day-paper-trail',
    title: 'Large Deposits: 60-Day Paper Trail',
    description: 'Source large deposits on about 60 days of statements',
    href: '/blog/large-deposits-60-day-paper-trail',
    category: 'Blog',
    keywords: ['large deposits', 'source of funds', 'underwriting', 'gift']
  },
  {
    id: 'should-i-wait-for-20-percent-down',
    title: 'Should I Wait for 20% Down?',
    description: 'PMI vs saving longer: a cash-and-timeline trade, not MIP exit',
    href: '/blog/should-i-wait-for-20-percent-down',
    category: 'Blog',
    keywords: ['20% down', 'PMI', 'wait to buy', 'first time']
  },
  {
    id: 'pmi-removal-original-value-vs-new-appraisal',
    title: 'Removing PMI: Original Value vs New Appraisal',
    description: 'HPA original-value clock vs a current-value appraisal path',
    href: '/blog/pmi-removal-original-value-vs-new-appraisal',
    category: 'Blog',
    keywords: ['PMI removal', 'PMI cancellation', 'appraisal', 'HPA']
  },
  {
    id: 'discount-points-breakeven-without-sales-pitch',
    title: 'Discount Points: Breakeven Without a Sales Pitch',
    description: 'Cost divided by monthly P&I savings. Not a temporary buydown',
    href: '/blog/discount-points-breakeven-without-sales-pitch',
    category: 'Blog',
    keywords: ['discount points', 'buy points', 'mortgage points', 'breakeven']
  },
  {
    id: 'what-a-mortgage-conversation-asks',
    title: 'What a Mortgage Conversation Asks',
    description: 'What you will be asked and what will not be promised',
    href: '/blog/what-a-mortgage-conversation-asks',
    category: 'Blog',
    keywords: ['qualify', 'prequalify', 'mortgage questions', 'application']
  },
  {
    id: 'new-auto-loan-during-underwriting',
    title: 'New Auto Loan During Underwriting',
    description: 'A car payment after pre-approval can flip DTI and findings',
    href: '/blog/new-auto-loan-during-underwriting',
    category: 'Blog',
    keywords: ['auto loan', 'car during underwriting', 'new debt', 'DTI']
  },
  {
    id: 'dti-frontend-backend-with-hoa',
    title: 'DTI: Front-End vs Back-End with HOA',
    description: 'HOA dues are housing expense in front-end DTI',
    href: '/blog/dti-frontend-backend-with-hoa',
    category: 'Blog',
    keywords: ['DTI', 'HOA', 'front-end', 'back-end', 'condo']
  },
  {
    id: 'pre-approval-vs-aus-vs-clear-to-close',
    title: 'Pre-Approval vs AUS vs Clear to Close',
    description: 'Letter, automated findings, and underwriter CTC are three stages',
    href: '/blog/pre-approval-vs-aus-vs-clear-to-close',
    category: 'Blog',
    keywords: ['pre-approval', 'AUS', 'DU', 'LPA', 'clear to close', 'CTC']
  },
  {
    id: 'spouse-w2-offset-1099-volatility',
    title: 'Using a Spouse’s W-2 to Offset 1099 Volatility',
    description: 'The W-2 counts when that person is a co-borrower. Utah is not community property',
    href: '/blog/spouse-w2-offset-1099-volatility',
    category: 'Blog',
    keywords: ['spouse income', 'joint application', '1099', 'non-borrowing spouse']
  },
  {
    id: 'temporary-buydown-who-pays-year-three',
    title: 'Temporary Buydown: Who Pays, Year 3',
    description: '2-1 and 3-2-1 payment subsidies. Distinct from discount points',
    href: '/blog/temporary-buydown-who-pays-year-three',
    category: 'Blog',
    keywords: ['2-1 buydown', '3-2-1', 'temporary buydown', 'builder']
  },
  {
    id: 'dscr-vs-full-doc-rental-loan',
    title: 'DSCR vs Full-Doc Rental Loan',
    description: 'Property qualifies vs borrower qualifies. Occupancy still has to match use',
    href: '/blog/dscr-vs-full-doc-rental-loan',
    category: 'Blog',
    keywords: ['DSCR', 'full doc', 'investment property', 'rental loan']
  },
  {
    id: 'business-vs-personal-bank-co-mingling',
    title: 'Business vs Personal Co-Mingling',
    description: 'Mixed business and personal deposits stall sourcing and averages',
    href: '/blog/business-vs-personal-bank-co-mingling',
    category: 'Blog',
    keywords: ['co-mingling', 'business bank', 'self employed deposits', 'seasoning']
  },
  {
    id: 'utah-repc-deadline-and-your-loan',
    title: 'What a Utah REPC Deadline Does to Your Loan',
    description: 'Due diligence vs financing clocks at 5:00 p.m. Mountain Time. Not legal advice',
    href: '/blog/utah-repc-deadline-and-your-loan',
    category: 'Blog',
    keywords: ['Utah REPC', 'financing contingency', 'due diligence', 'earnest money']
  },
  {
    id: 'second-home-vs-investment-occupancy',
    title: 'Second Home vs Investment Occupancy',
    description: 'Occupancy types. Misstating occupancy is fraud, not a strategy',
    href: '/blog/second-home-vs-investment-occupancy',
    category: 'Blog',
    keywords: ['occupancy', 'second home', 'investment property', 'occupancy fraud']
  },
  {
    id: 'cash-out-to-buy-a-rental',
    title: 'Cash-Out to Buy a Rental',
    description: 'Two occupancies and two LTV tests when proceeds fund a rental',
    href: '/blog/cash-out-to-buy-a-rental',
    category: 'Blog',
    keywords: ['cash-out', 'rental down payment', 'equity', 'investment']
  },
  {
    id: 'medical-collections-after-fico-model-change',
    title: 'Medical Collections After the FICO Model Change',
    description: 'Bureau reporting vs classic mortgage FICO. Not a score-raise promise',
    href: '/blog/medical-collections-after-fico-model-change',
    category: 'Blog',
    keywords: ['medical collections', 'FICO', 'mortgage credit', 'tri-merge']
  },
  {
    id: 'no-traditional-credit-alternative-credit',
    title: 'No Traditional Credit / Alternative Credit',
    description: 'Rent and utilities for a thin file. Fair Housing safe, no steering',
    href: '/blog/no-traditional-credit-alternative-credit',
    category: 'Blog',
    keywords: ['alternative credit', 'nontraditional credit', 'thin file', 'FHA']
  },
  {
    id: 'house-hacking-duplex-with-fha',
    title: 'House-Hacking a Duplex with FHA',
    description: 'Occupy one unit. Self-sufficiency is a 3–4 unit test',
    href: '/blog/house-hacking-duplex-with-fha',
    category: 'Blog',
    keywords: ['FHA duplex', 'house hack', '2 unit', 'self-sufficiency']
  },
  {
    id: 'relocating-to-utah-job-seasoning',
    title: 'Relocating to Utah: Job Seasoning',
    description: 'Offer letters when the job starts in about 60 days. Not a 60-day rule',
    href: '/blog/relocating-to-utah-job-seasoning',
    category: 'Blog',
    keywords: ['relocating Utah', 'offer letter', 'job seasoning', 'employment start date']
  },
  {
    id: 'apr-vs-rate-on-a-loan-estimate',
    title: 'APR vs Rate on a Loan Estimate',
    description: 'Note rate vs APR vs payment. Not a live-rate table',
    href: '/blog/apr-vs-rate-on-a-loan-estimate',
    category: 'Blog',
    keywords: ['APR', 'Loan Estimate', 'interest rate', 'compare lenders']
  },
  {
    id: 'selling-with-va-loan-entitlement-restoration',
    title: 'Selling with a VA Loan: Entitlement Restoration',
    description: 'Restoration after sale and payoff. Distinct from keeping a VA loan and buying another',
    href: '/blog/selling-with-va-loan-entitlement-restoration',
    category: 'Blog',
    keywords: ['VA entitlement restoration', 'sell VA loan', 'Certificate of Eligibility']
  },
  {
    id: 'cpa-letter-vs-tax-returns-underwriting',
    title: 'CPA Letter vs Tax Returns',
    description: 'A CPA letter supports; returns and transcripts usually move agency income',
    href: '/blog/cpa-letter-vs-tax-returns-underwriting',
    category: 'Blog',
    keywords: ['CPA letter mortgage', 'self employed tax returns', 'P&L underwriting']
  },
  {
    id: 'rate-lock-extension-vs-floating',
    title: 'Rate Lock Extension vs Floating',
    description: 'A lock is a window. An extension is usually a cost. Not a live-rate table',
    href: '/blog/rate-lock-extension-vs-floating',
    category: 'Blog',
    keywords: ['rate lock', 'lock extension', 'float vs lock', 'mortgage lock']
  },
  {
    id: 'no-closing-cost-refinance-rate-credit-tradeoff',
    title: 'No Closing Cost Refinance',
    description: 'The lender credit that covers fees is usually paid for in the rate',
    href: '/blog/no-closing-cost-refinance-rate-credit-tradeoff',
    category: 'Blog',
    keywords: ['no closing cost refinance', 'lender credit', 'refinance break even']
  },
  {
    id: 'what-a-tri-merge-credit-report-shows',
    title: 'What a Tri-Merge Credit Report Shows',
    description: 'Three bureaus, classic FICO, middle score. Not a monitoring-app number',
    href: '/blog/what-a-tri-merge-credit-report-shows',
    category: 'Blog',
    keywords: ['tri-merge', 'middle FICO', 'Equifax Experian TransUnion', 'mortgage credit']
  },
  {
    id: 'earnest-money-vs-down-payment-vs-closing-costs',
    title: 'Earnest Money vs Down Payment vs Closing Costs',
    description: 'Three cash lines. Earnest money is usually credited at closing',
    href: '/blog/earnest-money-vs-down-payment-vs-closing-costs',
    category: 'Blog',
    keywords: ['earnest money', 'down payment', 'closing costs', 'Utah REPC']
  },
  {
    id: 'townhome-vs-condo-hoa-docs-lenders-ask',
    title: 'Townhome vs Condo HOA Docs',
    description: 'Not every townhome is a condo. Lenders underwrite the plat',
    href: '/blog/townhome-vs-condo-hoa-docs-lenders-ask',
    category: 'Blog',
    keywords: ['townhome vs condo', 'HOA questionnaire', 'PUD', 'FHA condo']
  },
  {
    id: 'mortgage-reserves-months-of-pitia',
    title: 'Mortgage Reserves: Months of PITIA',
    description: 'Remaining assets after cash to close, not extra closing costs',
    href: '/blog/mortgage-reserves-months-of-pitia',
    category: 'Blog',
    keywords: ['mortgage reserves', 'PITIA', 'months of reserves', 'gift funds reserves']
  },
  {
    id: 'asset-depletion-qualifying-non-qm',
    title: 'Asset-Depletion Qualifying',
    description: 'Eligible assets as income under a written formula. Not cash means approved',
    href: '/blog/asset-depletion-qualifying-non-qm',
    category: 'Blog',
    keywords: ['asset depletion', 'asset based qualifying', 'Non-QM', 'retirement assets']
  },
  {
    id: 'gig-plus-w2-income-mortgage-average',
    title: 'Gig Plus W-2: How the Average Is Built',
    description: 'Two income streams averaged separately, then added',
    href: '/blog/gig-plus-w2-income-mortgage-average',
    category: 'Blog',
    keywords: ['gig economy mortgage', 'W-2 plus 1099', 'side hustle income', 'variable income']
  },
  {
    id: 'first-rental-occupancy-if-you-still-live-there',
    title: 'First Rental Occupancy If You Still Live There',
    description: 'Stay-put rental is investment occupancy. Not a duplex house-hack',
    href: '/blog/first-rental-occupancy-if-you-still-live-there',
    category: 'Blog',
    keywords: ['first rental occupancy', 'investment occupancy', 'buy rental while occupying primary']
  },
  {
    id: 'depreciation-add-back-schedule-e',
    title: 'Depreciation Add-Back on Schedule E',
    description: 'What agency files allow. Not tax advice',
    href: '/blog/depreciation-add-back-schedule-e',
    category: 'Blog',
    keywords: ['depreciation add back', 'Schedule E rental qualifying']
  },
  {
    id: 'compensating-factors-in-aus-findings',
    title: 'Compensating Factors in AUS Findings',
    description: 'Documented strengths, not a guarantee findings will flip',
    href: '/blog/compensating-factors-in-aus-findings',
    category: 'Blog',
    keywords: ['compensating factors', 'AUS findings', 'manual underwrite']
  },
  {
    id: 'utah-property-tax-calendar-first-escrow-analysis',
    title: 'Utah Property Tax Calendar vs First Escrow Analysis',
    description: 'November 30 due date and why the first analysis can surprise',
    href: '/blog/utah-property-tax-calendar-first-escrow-analysis',
    category: 'Blog',
    keywords: ['Utah property tax', 'escrow analysis', 'November 30']
  },
  {
    id: 'escrow-cushion-how-it-is-set',
    title: 'Escrow Cushion: How It Is Set',
    description: 'RESPA 1/6 ceiling. Not a universal servicer formula',
    href: '/blog/escrow-cushion-how-it-is-set',
    category: 'Blog',
    keywords: ['escrow cushion', 'RESPA', 'impound account']
  },
  {
    id: 'usda-vs-va-vs-fha-veteran-rural',
    title: 'USDA vs VA vs FHA for a Veteran in a Rural Tract',
    description: 'Comparison of tests, not a recommendation to take one program',
    href: '/blog/usda-vs-va-vs-fha-veteran-rural',
    category: 'Blog',
    keywords: ['USDA vs VA', 'veteran rural loan', 'FHA']
  },
  {
    id: 'heloc-after-year-two-vs-cash-out',
    title: 'HELOC After Year Two vs Cash-Out',
    description: 'Seasoning overlays after a recent closing, not a federal two-year wait',
    href: '/blog/heloc-after-year-two-vs-cash-out',
    category: 'Blog',
    keywords: ['HELOC seasoning', 'cash out after purchase', 'equity']
  },
  {
    id: 'cross-collateral-equity-to-buy-another-house',
    title: 'Cross-Collateral and Using Equity to Buy Another House',
    description: 'Educational only. Not a published agency product you can assume',
    href: '/blog/cross-collateral-equity-to-buy-another-house',
    category: 'Blog',
    keywords: ['cross collateral', 'blanket mortgage', 'equity to buy another house']
  },
  {
    id: 'biweekly-extra-principal-vs-refinance',
    title: 'Biweekly Extra Principal vs Refinance',
    description: 'One extra payment a year versus a new note. No savings promise',
    href: '/blog/biweekly-extra-principal-vs-refinance',
    category: 'Blog',
    keywords: ['biweekly mortgage', 'extra principal', 'refinance break-even']
  },
  {
    id: 'itin-non-us-citizen-mortgage-documentation',
    title: 'ITIN / Non-U.S. Citizen Mortgage Documentation',
    description: 'Legal eligibility documents, not a national-origin preference',
    href: '/blog/itin-non-us-citizen-mortgage-documentation',
    category: 'Blog',
    keywords: ['ITIN mortgage', 'non-citizen documentation', 'SSN vs ITIN']
  },
  {
    id: 'rate-lock-if-rates-drop',
    title: 'What a Lock Does If Rates Drop After You Lock',
    description: 'Float-down is a written lock policy, not automatic. Not a live-rate table',
    href: '/blog/rate-lock-if-rates-drop',
    category: 'Blog',
    keywords: ['float down', 'rates dropped after lock', 'mortgage lock']
  },
  {
    id: 'escrow-shortage-after-first-year',
    title: 'Escrow Shortage After the First Year',
    description: 'Pay vs spread after the first annual analysis. Not tax advice',
    href: '/blog/escrow-shortage-after-first-year',
    category: 'Blog',
    keywords: ['escrow shortage', 'impound shortage', 'annual escrow analysis']
  },
  {
    id: 'hill-afb-va-coe-occupancy',
    title: 'Hill AFB / VA: COE and Occupancy',
    description: 'Davis County, Utah. Not a mill doorway. Occupancy must match use',
    href: '/blog/hill-afb-va-coe-occupancy',
    category: 'Blog',
    keywords: ['Hill AFB VA', 'VA COE', 'Hill Air Force Base mortgage']
  },
  {
    id: 'delayed-financing-after-cash-purchase',
    title: 'Delayed Financing After a Cash Purchase',
    description: 'Agency exception after a cash purchase. Overlay is not a statute',
    href: '/blog/delayed-financing-after-cash-purchase',
    category: 'Blog',
    keywords: ['delayed financing', 'cash purchase refinance', 'Fannie delayed financing']
  },
  {
    id: 'cosign-vs-co-borrower',
    title: 'Cosign vs Co-Borrower',
    description: 'Note vs title vs gift-only help. Not a silent auto-loan cosigner',
    href: '/blog/cosign-vs-co-borrower',
    category: 'Blog',
    keywords: ['cosign vs co-borrower', 'on the note', 'non-occupant co-borrower']
  },
  {
    id: 'first-time-buyer-file-mistakes',
    title: 'First-Time Buyer File Mistakes',
    description: 'New debt, job change, deposits, occupancy — not a lifestyle listicle',
    href: '/blog/first-time-buyer-file-mistakes',
    category: 'Blog',
    keywords: ['first-time buyer mistakes', 'mortgage file mistakes', 'underwriting conditions']
  },
  {
    id: 'how-long-first-purchase-takes',
    title: 'How Long a First Purchase Usually Takes',
    description: 'Pre-approval through CTC. Ranges, not a closing-date promise',
    href: '/blog/how-long-first-purchase-takes',
    category: 'Blog',
    keywords: ['how long to close', 'first purchase timeline', 'preapproval to closing']
  },
  {
    id: 'closing-credit-card-before-mortgage',
    title: 'Closing a Credit Card Before You Apply',
    description: 'Utilization vs available credit. Not a score-raise method',
    href: '/blog/closing-credit-card-before-mortgage',
    category: 'Blog',
    keywords: ['close credit card mortgage', 'credit utilization', 'available credit AUS']
  },
  {
    id: 'hazard-vs-ho3-vs-ho6-condo-insurance',
    title: 'Hazard vs HO-3 vs HO-6',
    description: 'Lender hazard vs HO-3 vs condo HO-6 plus master. Not insurance advice',
    href: '/blog/hazard-vs-ho3-vs-ho6-condo-insurance',
    category: 'Blog',
    keywords: ['HO-6 condo insurance', 'HO-3 homeowners', 'hazard insurance mortgage']
  }
]

// Combine all searchable items
export const searchIndex: SearchResult[] = [
  ...pages,
  ...notaryLocationPages,
  ...calculators,
  ...blogPosts
]

// Search function
export function search(query: string): SearchResult[] {
  if (!query || query.trim().length === 0) {
    return []
  }

  const normalizedQuery = query.toLowerCase().trim()
  const queryWords = normalizedQuery.split(/\s+/)

  return searchIndex
    .map(item => {
      const title = item.title.toLowerCase()
      const description = item.description.toLowerCase()
      const keywords = item.keywords?.join(' ').toLowerCase() || ''
      const _searchableText = `${title} ${description} ${keywords}`

      // Calculate relevance score
      let score = 0

      // Exact title match gets highest score
      if (title === normalizedQuery) {
        score += 100
      } else if (title.startsWith(normalizedQuery)) {
        score += 50
      } else if (title.includes(normalizedQuery)) {
        score += 30
      }

      // Description match
      if (description.includes(normalizedQuery)) {
        score += 20
      }

      // Keyword matches
      queryWords.forEach(word => {
        if (keywords.includes(word)) {
          score += 10
        }
        if (title.includes(word)) {
          score += 15
        }
        if (description.includes(word)) {
          score += 5
        }
      })

      return { item, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)
    .slice(0, 20) // Limit to top 20 results
}
