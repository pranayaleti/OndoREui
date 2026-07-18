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
    description: 'Get pre-approved for a mortgage',
    href: '/loans',
    category: 'Service',
    keywords: ['loans', 'mortgage', 'financing', 'pre-approval', 'lending']
  },
  {
    id: 'notary',
    title: 'Notary Services',
    description: 'Mobile and remote online notary services',
    href: '/notary',
    category: 'Service',
    keywords: ['notary', 'notarization', 'remote notary', 'mobile notary', 'signing']
  },
  {
    id: 'notary-on-demand',
    title: 'On-Demand Notary',
    description: 'Urgent notarization — we try to accommodate same-day when capacity allows',
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
    description: `Utah RON and mobile notary for ${city.name}`,
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
    keywords: ['DSCR', 'debt service coverage ratio', 'investment property', 'loan']
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
    description: 'Balancing fast, volatile assets with slow, cashflowing rentals—without co-mingling risk',
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
    description: 'High-ROI automations for rent, maintenance, and owner reporting—built by a dev-operator',
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
    title: 'Mobile Notary Utah County Guide',
    description: 'Complete guide to mobile notary services in Utah County',
    href: '/blog/mobile-notary-utah-county-guide',
    category: 'Blog',
    keywords: ['mobile notary', 'utah county', 'notary services']
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
