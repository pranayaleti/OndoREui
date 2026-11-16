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
    title: 'Socials & Links',
    description: 'Social profiles and every Ondo link in one place',
    href: '/links',
    category: 'Page',
    keywords: ['socials', 'social media', 'updates', 'news']
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
    href: '/moving-to-utah/#why-utah-heading',
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
    id: 'dscr',
    title: 'DSCR Calculator',
    description: 'Calculate Debt Service Coverage Ratio for investment property loans',
    href: '/calculators/dscr',
    category: 'Calculator',
    keywords: ['DSCR', 'debt service coverage ratio', 'investment property', 'rental qualification', 'full doc']
  },
  {
    id: 'one-percent-rule',
    title: '1% and 50% Rule Calculator',
    description: 'Two quick rental screens: rent as a share of price and expenses as half of rent',
    href: '/calculators/one-percent-rule',
    category: 'Calculator',
    keywords: ['1% rule', 'one percent rule', '50% rule', 'fifty percent rule', 'operating expenses', 'rental screening', 'rule of thumb']
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
    id: 'new-landlord-mistakes-systems',
    title: 'New Landlord Mistakes and the Systems That Prevent Them',
    description: 'Documentation, reserves, maintenance states, and comms playbooks to avoid expensive errors',
    href: '/blog/new-landlord-mistakes-systems',
    category: 'Blog',
    keywords: ['landlord', 'mistakes', 'systems', 'documentation', 'maintenance']
  },
  {
    id: 'property-management-automation-checklist',
    title: 'Property Management Automation Checklist',
    description: 'High-ROI automations for rent, maintenance, and owner reporting for small rental portfolios',
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
    id: 'mobile-notary-utah-county-guide',
    title: 'Notary in Utah County: Remote Online Notarization',
    description: 'RON for Utah County clients, posted fees, same-day when capacity allows, no mobile travel appointments',
    href: '/blog/mobile-notary-utah-county-guide',
    category: 'Blog',
    keywords: ['remote online notary', 'utah county', 'ron', 'notary services']
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
    id: 'utah-closing-costs-title-origination-prepaids',
    title: 'Utah Closing Costs',
    description: 'Title, origination, and prepaids that vary by county',
    href: '/blog/utah-closing-costs-title-origination-prepaids',
    category: 'Blog',
    keywords: ['Utah closing costs', 'title', 'origination']
  },
  {
    id: 'renting-vs-buying-salt-lake-city',
    title: 'Renting vs. Buying in Salt Lake City (2026 Analysis)',
    description: 'Break-even timeline, total cost of ownership, and neighborhood-level analysis for renting versus buying',
    href: '/blog/renting-vs-buying-salt-lake-city',
    category: 'Blog',
    keywords: ['rent vs buy', 'renting', 'buying', 'Salt Lake City', 'comparison']
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
    id: 'dscr-vs-full-doc-rental-loan',
    title: 'DSCR vs Full-Doc Rental Loan',
    description: 'Property qualifies vs borrower qualifies. Occupancy still has to match use',
    href: '/blog/dscr-vs-full-doc-rental-loan',
    category: 'Blog',
    keywords: ['DSCR', 'full doc', 'investment property', 'rental loan']
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
    id: 'townhome-vs-condo-hoa-docs-lenders-ask',
    title: 'Townhome vs Condo HOA Docs',
    description: 'Not every townhome is a condo. Lenders underwrite the plat',
    href: '/blog/townhome-vs-condo-hoa-docs-lenders-ask',
    category: 'Blog',
    keywords: ['townhome vs condo', 'HOA questionnaire', 'PUD', 'FHA condo']
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
    id: 'cosign-vs-co-borrower',
    title: 'Cosign vs Co-Borrower',
    description: 'Note vs title vs gift-only help. Not a silent auto-loan cosigner',
    href: '/blog/cosign-vs-co-borrower',
    category: 'Blog',
    keywords: ['cosign vs co-borrower', 'on the note', 'non-occupant co-borrower']
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
    id: 'interest-only-mortgages-who-they-are-for',
    title: 'Interest-Only Mortgages: Who They Are For',
    description: 'Payment shock when IO ends. Not a teaser-rate promise',
    href: '/blog/interest-only-mortgages-who-they-are-for',
    category: 'Blog',
    keywords: ['interest only mortgage', 'IO payment shock', 'interest-only vs ARM']
  },
  {
    id: 'manufactured-housing-adu-financing',
    title: 'Manufactured Housing and ADU Financing',
    description: 'Two property types. No invented HUD codes as a permanent product',
    href: '/blog/manufactured-housing-adu-financing',
    category: 'Blog',
    keywords: ['manufactured home mortgage', 'ADU financing', 'HUD code home loan']
  },
  {
    id: 'week-after-mortgage-funding',
    title: 'What Happens the Week After Funding',
    description: 'Recording, first payment timing, servicing transfer. Not legal advice',
    href: '/blog/week-after-mortgage-funding',
    category: 'Blog',
    keywords: ['after funding', 'first mortgage payment', 'servicing transfer']
  },
  {
    id: 'first-mortgage-statement-vs-note-rate',
    title: 'First Mortgage Statement vs Note Rate',
    description: 'PITI and odd days, not a secret rate change',
    href: '/blog/first-mortgage-statement-vs-note-rate',
    category: 'Blog',
    keywords: ['first mortgage statement', 'note rate vs payment', 'odd days interest']
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
