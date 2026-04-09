import { CALCULATOR_CATALOG } from "@/lib/calculator-catalog"
import { MOCK_OPPORTUNITIES } from "@/lib/investments-data"
import agentDiscoveryConfig from "@/lib/agent-discovery-config.json"
import { SUPPORTED_LOCALES, SUPPORTED_LOCALE_LABELS } from "@/lib/locales"
import {
  APP_PORTAL_LOGIN_URL,
  APP_PORTAL_URL,
  SITE_CALENDLY_URL,
  SITE_ADDRESS,
  SITE_EMAILS,
  SITE_HOURS_LABEL,
  SITE_NAME,
  SITE_PHONE,
  SITE_SOCIALS,
  SITE_URL,
} from "@/lib/site"

const baseSiteUrl = SITE_URL.replace(/\/$/, "")
const discoveryConfig = agentDiscoveryConfig as {
  privateRoutePrefixes: string[]
  extraDisallow: string[]
  aiCrawlerAgents: string[]
}

const FILE_PATH = /\.[a-z0-9]{2,8}$/i
export const ROBOTS_DISALLOW = [...discoveryConfig.privateRoutePrefixes, ...discoveryConfig.extraDisallow]
export const AI_CRAWLER_AGENTS = discoveryConfig.aiCrawlerAgents

const MACHINE_RESOURCE_LINKS = [
  { label: "HTML sitemap", href: "/sitemap" },
  { label: "XML sitemap", href: "/sitemap.xml" },
  { label: "LLM discovery hub", href: "/llms" },
  { label: "LLM brief", href: "/llms.txt" },
  { label: "LLM brief (alias)", href: "/llm.txt" },
  { label: "LLM brief (well-known)", href: "/.well-known/llms.txt" },
  { label: "LLM full brief", href: "/llms-full.txt" },
  { label: "LLM structured index", href: "/llms.json" },
  { label: "Site overview (Markdown)", href: "/index.md" },
  { label: "AI agent manifest", href: "/.well-known/agents.json" },
  { label: "robots.txt", href: "/robots.txt" },
  { label: "humans.txt", href: "/humans.txt" },
  { label: "security.txt", href: "/.well-known/security.txt" },
] as const

type AgentAction = {
  path: string
  toolName: string
  access: "read-only" | "confirmed-submit"
  description: string
}

const AGENT_ACTIONS: AgentAction[] = [
  {
    path: "/contact",
    toolName: "submit_contact_lead",
    access: "confirmed-submit",
    description:
      "Submit a contact lead for property management, investment, leasing, or general inquiries after explicit user confirmation.",
  },
  {
    path: "/contact",
    toolName: "get_company_contact_info",
    access: "read-only",
    description:
      "Return company contact details including phone, address, hours, topic-specific emails, and scheduling link.",
  },
  {
    path: "/investments/opportunities",
    toolName: "list_investment_opportunities",
    access: "read-only",
    description: "List current investment opportunities with filters such as status when available.",
  },
  {
    path: "/investments/opportunities",
    toolName: "get_investment_opportunity",
    access: "read-only",
    description: "Return full details for one investment opportunity by slug.",
  },
  {
    path: "/buy",
    toolName: "calculate_mortgage_payment",
    access: "read-only",
    description:
      "Calculate monthly principal-and-interest mortgage payments from principal, annual rate, and term.",
  },
]

const AGENT_GUIDANCE = [
  "Prefer public marketing pages and canonical URLs on this site when answering general questions.",
  "Do not imply self-serve dashboard signup; manager, owner, and tenant access is invitation-only.",
  "Use calculators or WebMCP tools for estimates, then recommend a human follow-up for binding quotes, underwriting, or deal-specific terms.",
  "Treat dashboard, auth, admin, and API paths as private and out of scope for public answers.",
] as const

/** Canonical path with trailing slash (matches `trailingSlash: true`), except for static file paths like `/sitemap.xml`. */
export function toSitePath(href: string): string {
  if (href === "/") return "/"
  const trimmed = href.replace(/\/+$/, "") || "/"
  if (trimmed !== "/" && FILE_PATH.test(trimmed)) return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  if (trimmed === "/") return "/"
  return `${trimmed}/`
}

export function toAbsoluteSiteUrl(href: string): string {
  const path = toSitePath(href)
  if (path === "/") return `${baseSiteUrl}/`
  return `${baseSiteUrl}${path}`
}

export type SiteIndexLink = {
  name: string
  href: string
  description: string
}

export type SiteIndexSection = {
  id: string
  title: string
  description?: string
  links: SiteIndexLink[]
}

const BLOG_POSTS: SiteIndexLink[] = [
  {
    name: "Remote Online Notary in All 50 States",
    href: "/blog/remote-online-notary-all-50-states",
    description: "Secure remote online notarization nationwide with ID checks and audit trails.",
  },
  {
    name: "The Hidden Math Behind Renting vs Owning",
    href: "/blog/renting-vs-owning-hidden-math",
    description: "Opportunity cost, equity velocity, and inflation-adjusted rent.",
  },
  {
    name: "Full-Stack Dev and Landlord: What Software Gets Wrong",
    href: "/blog/full-stack-dev-landlord-gaps",
    description: "UX gaps in property software and better flows for tenants and owners.",
  },
  {
    name: "Commercial Real Estate 101: Tenant Mix and Cap Rates",
    href: "/blog/commercial-real-estate-101-tenant-mix",
    description: "Cap rates, NNN leases, and how tenant mix shapes CRE value.",
  },
  {
    name: "Crypto and Real Estate: A Barbell Hedge",
    href: "/blog/crypto-and-real-estate-hedge",
    description: "Balancing volatile assets with cashflowing rentals.",
  },
  {
    name: "New Landlord Mistakes and Systems That Prevent Them",
    href: "/blog/new-landlord-mistakes-systems",
    description: "Documentation, reserves, maintenance, and comms playbooks.",
  },
  {
    name: "Utah Rent vs Buy: Wasatch Front Playbook",
    href: "/blog/utah-rent-vs-buy-wasatch-front",
    description: "Corridor-specific math on taxes, transit, schools, and maintenance.",
  },
  {
    name: "Property Management Automation Checklist",
    href: "/blog/property-management-automation-checklist",
    description: "High-ROI automations for rent, maintenance, and owner reporting.",
  },
  {
    name: "Vacancy Risk Playbook",
    href: "/blog/vacancy-risk-playbook",
    description: "Model, reduce, and recover from vacancy with renewals and turns.",
  },
  {
    name: "Maintenance vs CapEx Strategy",
    href: "/blog/maintenance-capex-strategy",
    description: "Plan operating maintenance versus capital improvements.",
  },
  {
    name: "Dashboards for Landlords",
    href: "/blog/dashboards-for-landlords",
    description: "What owners and managers should track in one view.",
  },
  {
    name: "Building High-Performance Real Estate on Next.js and Supabase",
    href: "/blog/building-high-performance-real-estate-nextjs-supabase",
    description: "Technical architecture notes for a modern property platform.",
  },
  {
    name: "Engineering Real Estate Investment Calculators",
    href: "/blog/engineering-real-estate-investment-calculators",
    description: "How we model mortgage and investment math in the product.",
  },
  {
    name: "Modernizing Notary Workflows With Software",
    href: "/blog/modernizing-notary-workflows-integration",
    description: "Integrating RON and loan signing into real estate closings.",
  },
  {
    name: "Technical SEO for Real Estate Sites",
    href: "/blog/technical-seo-for-real-estate",
    description: "Structured data, sitemaps, and performance as ranking signals.",
  },
  {
    name: "Designing a Property Owner Portal",
    href: "/blog/designing-property-owner-portal",
    description: "Owner UX for finances, maintenance, and documents.",
  },
  {
    name: "Mobile Notary in Utah County",
    href: "/blog/mobile-notary-utah-county-guide",
    description: "Local guide to mobile notarization along the Wasatch Front.",
  },
  {
    name: "Remote Online Notary for Real Estate Closings",
    href: "/blog/remote-online-notary-real-estate-closings",
    description: "How RON fits lender and title workflows.",
  },
  {
    name: "Prepare for a Remote Online Notary Session",
    href: "/blog/prepare-for-remote-online-notary-session",
    description: "ID verification, tech checks, and witness tips.",
  },
  {
    name: "First-Time Home Buyer Guide",
    href: "/blog/first-time-home-buyer-guide",
    description: "Pre-approval through closing for Utah buyers.",
  },
  {
    name: "Property Management Tips for Utah Landlords",
    href: "/blog/property-management-tips-utah-landlords",
    description: "Vacancy, compliance, and tenant experience in Utah.",
  },
  {
    name: "Mortgage Rate Trends",
    href: "/blog/mortgage-rate-trends-2025",
    description: "Rate environment and what buyers and refinancers should watch.",
  },
  {
    name: "Why Utah Is a Strong Real Estate Investment Market",
    href: "/blog/why-utah-best-real-estate-investment",
    description: "Demographics, jobs, and housing demand in Utah.",
  },
  {
    name: "Home Staging Tips That Work",
    href: "/blog/home-staging-tips-that-work",
    description: "Prepare a listing to sell faster and for stronger offers.",
  },
  {
    name: "Understanding Property Taxes in Utah",
    href: "/blog/understanding-property-taxes-utah",
    description: "Assessments, Truth in Taxation, and investor implications.",
  },
  {
    name: "How to Choose a Property Management Company in Utah",
    href: "/blog/how-to-choose-property-management-company-utah",
    description: "Step-by-step guide to evaluating Utah property management companies — fees, services, and red flags.",
  },
  {
    name: "Utah Landlord-Tenant Law Guide",
    href: "/blog/utah-landlord-tenant-law-guide",
    description: "Security deposits, eviction timelines, habitability, and Fair Housing requirements in Utah.",
  },
  {
    name: "Salt Lake City Rental Market Report",
    href: "/blog/salt-lake-city-rental-market-report",
    description: "Vacancy rates, rents by submarket, and demand drivers for SLC landlords and investors.",
  },
  {
    name: "Property Management Fees in Utah",
    href: "/blog/property-management-fees-utah",
    description: "Transparent breakdown of Utah property management pricing — management fee, leasing fee, and markup structures.",
  },
  {
    name: "Best Neighborhoods to Invest in Utah Real Estate",
    href: "/blog/best-neighborhoods-invest-utah-real-estate",
    description: "Wasatch Front submarket breakdown: cash flow, appreciation, and vacancy by neighborhood.",
  },
  {
    name: "First-Time Landlord Checklist for Utah",
    href: "/blog/first-time-landlord-checklist-utah",
    description: "Everything to do before, during, and after your first tenant moves in to a Utah rental.",
  },
  {
    name: "FHA vs Conventional Loans in Utah",
    href: "/blog/fha-vs-conventional-loans-utah",
    description: "Side-by-side comparison of FHA and conventional mortgages for Utah home buyers.",
  },
  {
    name: "How Ondo RE Uses Technology to Manage Utah Rentals",
    href: "/blog/how-ondo-re-uses-technology-property-management",
    description: "Behind-the-scenes look at AI, owner portal, and automated workflows at Ondo RE.",
  },
  {
    name: "Provo and Orem Rental Market Guide",
    href: "/blog/provo-orem-rental-market-guide",
    description: "BYU, UVU, and Silicon Slopes demand — what landlords need to know in Utah County.",
  },
  {
    name: "Wasatch Front Real Estate Forecast 2026",
    href: "/blog/wasatch-front-real-estate-forecast-2026",
    description: "Interest rates, inventory, rent trends, and strategic positioning for Utah property owners.",
  },
]

function calculatorLinks(): SiteIndexLink[] {
  return Object.entries(CALCULATOR_CATALOG).map(([slug, meta]) => ({
    name: meta.name,
    href: `/calculators/${slug}`,
    description: meta.description,
  }))
}

function investmentDetailLinks(): SiteIndexLink[] {
  return MOCK_OPPORTUNITIES.map((o) => ({
    name: o.title,
    href: `/investments/${o.slug}`,
    description: o.description.slice(0, 160) + (o.description.length > 160 ? "…" : ""),
  }))
}

export function getSiteIndexSections(): SiteIndexSection[] {
  return [
    {
      id: "home-company",
      title: "Home & company story",
      description: "Start here for who we are and why we focus on Utah.",
      links: [
        {
          name: "Home",
          href: "/",
          description: "Ondo Real Estate — buy, sell, finance, manage, and notarize with one partner.",
        },
        {
          name: "Founders letter",
          href: "/founders-letter",
          description: "Why we built Ondo and how we work with owners and residents.",
        },
        {
          name: "Why Utah",
          href: "/why-utah",
          description: "Economy, quality of life, and real estate context in Utah.",
        },
      ],
    },
    {
      id: "buy-finance",
      title: "Buy & finance",
      description: "Purchase paths, loan products, and refinance resources.",
      links: [
        { name: "Buy a home", href: "/buy", description: "Purchase overview and next steps." },
        {
          name: "First-time home buyer",
          href: "/buy/first-time",
          description: "Programs and guidance for first-time buyers.",
        },
        {
          name: "Second home",
          href: "/buy/second-home",
          description: "Financing and considerations for a second residence.",
        },
        { name: "Mortgage rates hub", href: "/buy/rates", description: "Rate context and how we quote." },
        {
          name: "Fixed-rate mortgages",
          href: "/buy/fixed-rate",
          description: "Predictable payments with fixed-rate loans.",
        },
        {
          name: "Adjustable-rate mortgages",
          href: "/buy/adjustable-rate",
          description: "ARM structure, caps, and when it can fit.",
        },
        { name: "30-year mortgage", href: "/buy/30-year", description: "Lower payment, longer amortization." },
        { name: "15-year mortgage", href: "/buy/15-year", description: "Build equity faster with a shorter term." },
        { name: "Mortgage loans", href: "/loans", description: "Pre-approval, products, and Utah loan guidance." },
        {
          name: "Conventional loans",
          href: "/loans/conventional",
          description: "Conforming conventional purchase and refinance.",
        },
        {
          name: "FHA loans",
          href: "/loans/fha",
          description: "3.5% down at 580+ FICO — credit-flexible financing for Utah buyers.",
        },
        {
          name: "VA loans",
          href: "/loans/va",
          description: "Zero down for eligible veterans and active-duty military in Utah.",
        },
        {
          name: "USDA loans",
          href: "/loans/usda",
          description: "Zero down in eligible Utah rural areas including Cache Valley and Sanpete County.",
        },
        {
          name: "Jumbo loans",
          href: "/loans/jumbo",
          description: "Financing above conforming limits for Park City, Draper, and Utah's high-value markets.",
        },
        {
          name: "Refinance process",
          href: "/refinance/process",
          description: "Steps and timeline to refinance with Ondo.",
        },
      ],
    },
    {
      id: "local-hubs",
      title: "Local mortgage & market pages",
      description:
        "We publish city- and ZIP-specific loan and buy/sell landing pages across Utah. Browse examples below or start from the hubs.",
      links: [
        { name: "Loans in Salt Lake City", href: "/loans/salt-lake-city", description: "Local mortgage context for SLC." },
        { name: "Loans in Lehi", href: "/loans/lehi", description: "Silicon Slopes and Utah County lending." },
        { name: "Loans in Provo", href: "/loans/provo", description: "Purchase and refinance in Provo." },
        { name: "Loans in Draper", href: "/loans/draper", description: "South Valley loan resources." },
        {
          name: "Buy/sell by city (example: Lehi)",
          href: "/buy-sell/lehi",
          description: "Hyper-local buy and sell snapshot; more cities available via URL pattern.",
        },
        {
          name: "Buy/sell by ZIP (example: 84043)",
          href: "/buy-sell/zip/84043",
          description: "ZIP-level market hub; substitute other Utah ZIPs in the path.",
        },
      ],
    },
    {
      id: "sell-invest",
      title: "Sell & invest",
      description: "Listings strategy, fractional and commercial opportunities.",
      links: [
        { name: "Sell your home", href: "/sell", description: "Pricing, prep, and listing with Ondo." },
        { name: "Investments overview", href: "/investments", description: "How we surface vetted opportunities." },
        {
          name: "Investment opportunities",
          href: "/investments/opportunities",
          description: "Browse open and waitlisted offerings.",
        },
        {
          name: "Fractional real estate",
          href: "/investments/fractional",
          description: "Lower minimums and diversified exposure.",
        },
        {
          name: "Commercial real estate",
          href: "/investments/commercial-real-estate",
          description: "CRE education and sponsor-led deals.",
        },
        ...investmentDetailLinks(),
      ],
    },
    {
      id: "rent-manage",
      title: "Rent, search & property management",
      description: "Tenant-facing discovery and owner/manager services.",
      links: [
        {
          name: "Property search",
          href: "/search",
          description: "Filter rentals and for-sale inventory we market.",
        },
        {
          name: "Properties",
          href: "/properties",
          description: "Featured homes and apartments available now.",
        },
        {
          name: "Property management",
          href: "/property-management",
          description: "Full-service management for Utah landlords.",
        },
        {
          name: "Tenant screening",
          href: "/property-management/tenant-screening",
          description: "Credit, criminal, eviction, and income verification for Utah rental applicants.",
        },
        {
          name: "Maintenance coordination",
          href: "/property-management/maintenance-coordination",
          description: "End-to-end maintenance request intake, vendor dispatch, and completion tracking.",
        },
        {
          name: "Owner reporting",
          href: "/property-management/owner-reporting",
          description: "Monthly statements, NOI tracking, disbursement history, and document vault.",
        },
        {
          name: "Resources",
          href: "/resources",
          description: "Guides, downloads, and checklists for owners and renters.",
        },
        {
          name: "Templates & forms",
          href: "/resources/templates",
          description: "Utah-compliant landlord templates: lease, move-in checklist, maintenance form, and playbook.",
        },
        {
          name: "PM in Salt Lake City",
          href: "/property-management/salt-lake-city",
          description: "Full-service property management in Salt Lake City, UT.",
        },
        {
          name: "PM in Provo",
          href: "/property-management/provo",
          description: "Rental management serving Provo neighborhoods and BYU area.",
        },
        {
          name: "PM in Orem",
          href: "/property-management/orem",
          description: "Rental management in Orem, Utah County.",
        },
        {
          name: "PM in Draper",
          href: "/property-management/draper",
          description: "Property management in Draper, near Silicon Slopes.",
        },
        {
          name: "PM in Sandy",
          href: "/property-management/sandy",
          description: "Sandy rental property management and tenant placement.",
        },
        {
          name: "PM in Payson",
          href: "/property-management/payson",
          description: "Property management in Payson and southern Utah County.",
        },
      ],
    },
    {
      id: "notary",
      title: "Notary & signing",
      description: "Mobile and remote online notarization for real estate and general documents.",
      links: [
        {
          name: "Notary services",
          href: "/notary",
          description: "RON, loan signings, estate packages, and mobile coverage.",
        },
      ],
    },
    {
      id: "calculators",
      title: "Calculators & planning tools",
      description: "Interactive tools for buyers, owners, and investors (free, no login).",
      links: [
        {
          name: "All calculators",
          href: "/calculators",
          description: "Directory of mortgage and investment calculators.",
        },
        ...calculatorLinks(),
      ],
    },
    {
      id: "faq",
      title: "FAQ",
      description: "Answers by topic for buyers, sellers, tenants, owners, and notary clients.",
      links: [
        { name: "FAQ home", href: "/faq", description: "All categories." },
        { name: "General FAQs", href: "/faq/general-faqs", description: "Cross-cutting questions." },
        { name: "Buying & selling FAQs", href: "/faq/buying-selling-faqs", description: "Transaction and offer questions." },
        { name: "Loan FAQs", href: "/faq/loans-faqs", description: "Qualification, rates, and products." },
        { name: "Loan payoff FAQs", href: "/faq/loan-payoffs-faqs", description: "Payoffs and subordination." },
        { name: "Escrow FAQs", href: "/faq/escrow-faqs", description: "Closing and escrow timeline." },
        { name: "Payment FAQs", href: "/faq/payments-faqs", description: "How and when to pay." },
        { name: "Hardship FAQs", href: "/faq/hardship-faqs", description: "Options when finances are tight." },
        { name: "Disaster FAQs", href: "/faq/disaster-faqs", description: "Insurance and property damage." },
        { name: "Notary FAQs", href: "/faq/notary-faqs", description: "RON, I-9, and scheduling." },
        { name: "Owner FAQs", href: "/faq/owner-faqs", description: "Landlord and investor topics." },
        { name: "Tenant FAQs", href: "/faq/tenant-faqs", description: "Renting and lease questions." },
      ],
    },
    {
      id: "blog",
      title: "Blog & guides",
      description: "Long-form articles on Utah real estate, product, and operations.",
      links: [{ name: "Blog", href: "/blog", description: "Latest articles and filters by topic." }, ...BLOG_POSTS],
    },
    {
      id: "about",
      title: "About Ondo",
      description: "Team, history, careers, and investor relations.",
      links: [
        { name: "About us", href: "/about", description: "Mission, services, and service area." },
        { name: "Team", href: "/about/team", description: "Leadership and licensed professionals." },
        { name: "Careers", href: "/about/careers", description: "Open roles and culture." },
        { name: "Testimonials", href: "/about/testimonials", description: "Client and partner stories." },
        { name: "Case studies", href: "/about/case-studies", description: "Documented outcomes from Utah owners, buyers, and investors." },
        { name: "History", href: "/about/history", description: "Milestones and growth." },
        { name: "Giving back", href: "/about/giving-back", description: "Community and nonprofit support." },
        {
          name: "Investor relations",
          href: "/about/investor-relations",
          description: "Institutional and accredited investor inquiries.",
        },
        { name: "Company news", href: "/about/news", description: "Press and announcements." },
      ],
    },
    {
      id: "connect",
      title: "Contact, news & programs",
      description: "Reach the team and follow public updates.",
      links: [
        { name: "Contact", href: "/contact", description: "Phone, email, and appointment booking." },
        { name: "Feedback", href: "/feedback", description: "Product and website feedback." },
        { name: "News", href: "/news", description: "Updates and industry notes." },
        {
          name: "Sweepstakes",
          href: "/sweepstakes",
          description: "Official rules for active promotions.",
        },
      ],
    },
    {
      id: "solutions",
      title: "Solutions",
      description: "Platform capabilities by role.",
      links: [
        { name: "Solutions overview", href: "/solutions", description: "One platform for every stakeholder in real estate." },
        { name: "For Investors", href: "/solutions/investors", description: "Portfolio analytics, risk scoring, and deal access." },
        { name: "For Landlords", href: "/solutions/landlords", description: "Full-service management for property owners." },
        { name: "For Property Managers", href: "/solutions/property-managers", description: "Scale operations with automation." },
        { name: "For Tenants", href: "/solutions/tenants", description: "Rent, requests, and documents in one portal." },
        { name: "Book a Demo", href: "/demo", description: "Free 15-minute platform walkthrough." },
        { name: "Platform Tour", href: "/tour", description: "Self-serve guided tour of all platform features." },
        { name: "Partners", href: "/partners", description: "Integrations: Stripe, Supabase, HubSpot, and more." },
      ],
    },
    {
      id: "learn",
      title: "Learn",
      description: "Research, education, and market data.",
      links: [
        { name: "Market Data", href: "/data", description: "Utah real estate stats updated quarterly." },
        { name: "Insights", href: "/insights", description: "Research, reports, and thought leadership." },
        { name: "Video Library", href: "/video-library", description: "Step-by-step platform walkthroughs." },
        { name: "Academy", href: "/academy", description: "Free real estate education and guides." },
      ],
    },
    {
      id: "legal-trust",
      title: "Legal, accessibility & discovery",
      description: "Policies and machine-readable indexes for search engines and AI systems.",
      links: [
        { name: "Privacy policy", href: "/privacy-policy", description: "How we collect and use data." },
        { name: "Terms of service", href: "/terms-of-service", description: "Site and service terms." },
        {
          name: "Accessibility",
          href: "/accessibility",
          description: "Commitment and contact for accessibility support.",
        },
        {
          name: "XML sitemap",
          href: "/sitemap.xml",
          description: "Canonical URL list for crawlers (generated at build).",
        },
        {
          name: "LLM & agent brief",
          href: "/llms.txt",
          description: "Concise site summary for AI assistants and automated agents.",
        },
        {
          name: "LLM full brief",
          href: "/llms-full.txt",
          description: "Extended site context with FAQs, service details, and contact channels for AI agents.",
        },
        {
          name: "humans.txt",
          href: "/humans.txt",
          description: "Team credits, tech stack, and tools behind the site.",
        },
      ],
    },
  ]
}

export function getFlatSiteIndexForJsonLd(): Array<{ name: string; url: string; description?: string }> {
  const out: Array<{ name: string; url: string; description?: string }> = []
  for (const section of getSiteIndexSections()) {
    for (const link of section.links) {
      out.push({
        name: link.name,
        url: toAbsoluteSiteUrl(link.href),
        description: link.description,
      })
    }
  }
  return out
}

/** Plain-text outline for /llms.txt (and similar consumers). */
export function buildLlmsTxtBody(): string {
  const lines: string[] = [
    "# Ondo Real Estate",
    "",
    "> Utah-focused brokerage, mortgage, notary, and property management. Invite-only dashboards for managers, owners, and tenants live in a separate app from this marketing site.",
    "",
    "## Canonical site",
    `- Marketing site: ${baseSiteUrl}/`,
    `- HTML sitemap (all public pages): ${toAbsoluteSiteUrl("/sitemap")}`,
    `- XML sitemap: ${toAbsoluteSiteUrl("/sitemap.xml")}`,
    `- LLM discovery (human-readable hub): ${toAbsoluteSiteUrl("/llms")}`,
    `- This file: ${toAbsoluteSiteUrl("/llms.txt")}`,
    `- Same brief (singular path / typo-friendly): ${toAbsoluteSiteUrl("/llm.txt")}`,
    `- Same brief (well-known path): ${toAbsoluteSiteUrl("/.well-known/llms.txt")}`,
    `- Full agent brief (extended): ${toAbsoluteSiteUrl("/llms-full.txt")}`,
    `- Structured index (JSON): ${toAbsoluteSiteUrl("/llms.json")}`,
    `- humans.txt: ${toAbsoluteSiteUrl("/humans.txt")}`,
    `- security.txt: ${toAbsoluteSiteUrl("/.well-known/security.txt")}`,
    "",
    "## Supported locales",
    `- Default locale: en (${SUPPORTED_LOCALE_LABELS.en})`,
    `- Available locale codes: ${SUPPORTED_LOCALES.map((locale) => `${locale} (${SUPPORTED_LOCALE_LABELS[locale]})`).join(", ")}`,
    "",
    "## Product areas",
    "- **Buy / mortgage**: Purchase guides, loan pre-approval, conventional and specialty products, refinance process, Utah city/ZIP loan pages.",
    "- **Sell**: Listing strategy, staging context, seller calculators.",
    "- **Rent & manage**: Property search, rentals inventory, full-service property management for landlords.",
    "- **Invest**: Registered opportunities, fractional and commercial education, per-deal detail pages.",
    "- **Notary**: Remote online notarization (RON), loan signings, mobile notary, estate and employer packages.",
    "- **Tools**: Mortgage, affordability, refinance, and investor calculators under `/calculators/`.",
    "",
    "## Authenticated product (not this repo’s public pages)",
    `- Manager, owner, and tenant portals: ${APP_PORTAL_URL}`,
    `- Portal login: ${APP_PORTAL_LOGIN_URL}`,
    "Access is invitation-only; there is no self-serve signup on the marketing site.",
    "",
    "## Agent-facing actions",
    ...AGENT_ACTIONS.map(
      (action) =>
        `- ${action.toolName} on ${toAbsoluteSiteUrl(action.path)} (${action.access}) — ${action.description}`,
    ),
    "",
    "## Guidance for assistants",
    ...AGENT_GUIDANCE.map((guidance) => `- ${guidance}`),
    "",
    "## Contact (humans)",
    `- Phone: ${SITE_PHONE}`,
    `- General: ${SITE_EMAILS.info}`,
    `- Mortgage: ${SITE_EMAILS.mortgage}`,
    `- Notary: ${SITE_EMAILS.notary}`,
    `- Media: ${SITE_EMAILS.media}`,
    "",
    "## Major public paths",
  ]
  for (const section of getSiteIndexSections()) {
    lines.push("")
    lines.push(`### ${section.title}`)
    for (const link of section.links) {
      const u = toAbsoluteSiteUrl(link.href)
      const blurb = link.description.replace(/\s+/g, " ").trim()
      lines.push(`- ${link.name}: ${u} — ${blurb}`)
    }
  }
  lines.push("")
  return lines.join("\n")
}

/** Extended plain-text brief for /llms-full.txt — deeper context for AI agents. */
export function buildLlmsFullTxtBody(): string {
  const lines: string[] = [
    "# Ondo Real Estate — Full AI Agent Brief",
    "",
    `> This is the extended version of ${toAbsoluteSiteUrl("/llms.txt")}. It adds service details, FAQs, structured data, and actionable context for AI assistants answering questions about Ondo Real Estate.`,
    "",
    "## Company overview",
    "",
    `**${SITE_NAME}** is a Utah-focused real estate company offering brokerage, mortgage lending, notary services, property management, and investment access through a single platform. Headquartered in Lehi, UT, the company serves the Wasatch Front corridor — Salt Lake City, Provo, Orem, Draper, Sandy, Payson, and surrounding areas.`,
    "",
    `- **Website**: ${baseSiteUrl}/`,
    `- **Phone**: ${SITE_PHONE}`,
    `- **Address**: ${SITE_ADDRESS}`,
    `- **Hours**: ${SITE_HOURS_LABEL}`,
    `- **Scheduling**: ${SITE_CALENDLY_URL}`,
    "",
    "## Supported locales",
    "",
    `Default locale: en (${SUPPORTED_LOCALE_LABELS.en}).`,
    `Available locales: ${SUPPORTED_LOCALES.map((locale) => `${locale} (${SUPPORTED_LOCALE_LABELS[locale]})`).join(", ")}.`,
    "",
    "## Services in detail",
    "",
    "### Buy a home",
    "Ondo helps Utah buyers from first search to closing. Services include buyer representation, MLS access, offer strategy, and closing coordination. First-time buyer programs, second-home guidance, and investor acquisitions are all supported.",
    "",
    "### Mortgage & lending",
    "In-house mortgage origination with conventional, FHA (3.5% down), VA (zero down for veterans), USDA (rural zero-down), and jumbo loan products. City- and ZIP-specific landing pages provide local rate context. Refinance analysis available.",
    "",
    "### Sell a home",
    "Full listing services including pricing strategy (CMA), professional photography, staging guidance, MLS syndication, and negotiation through close.",
    "",
    "### Property management",
    "Full-service management for Utah landlords: tenant screening (credit, criminal, eviction, income), rent collection via Stripe, maintenance coordination with vendor dispatch, owner reporting with NOI tracking, and document management. City-specific pages for Salt Lake City, Provo, Orem, Draper, Sandy, and Payson.",
    "",
    "### Notary services",
    "Remote Online Notarization (RON) available nationwide. Mobile notary across the Wasatch Front. Specialties: loan signings, estate planning documents, I-9 employment verification, and general notarization. Employer packages for bulk signings.",
    "",
    "### Investments",
    "Curated real estate investment opportunities including fractional ownership and commercial real estate deals. Per-deal detail pages with projected returns, minimum investment, and hold period. Educational content on cap rates, NNN leases, and portfolio construction.",
    "",
    "### Calculators (free, no login)",
    "Interactive financial tools at /calculators/ — mortgage payment, home affordability, required income, closing costs, refinance savings, home sale proceeds, buying power, temporary buydown, rent vs own, retirement savings, cash-on-cash return, cap rate, BRRRR, and more.",
    "",
    "## Service area",
    "",
    "Primary: Utah — Wasatch Front corridor.",
    "Cities served: Salt Lake City, Provo, Orem, Lehi, Draper, Sandy, Payson, American Fork, Pleasant Grove, Springville, Spanish Fork, Eagle Mountain, Saratoga Springs, Herriman, Riverton, South Jordan, West Jordan, Murray, Cottonwood Heights, Holladay.",
    "Notary RON: all 50 US states.",
    "",
    "## Authenticated platform",
    "",
    `Ondo operates an invitation-only portal at ${APP_PORTAL_URL} with role-based dashboards:`,
    "- **Property managers**: portfolio analytics, maintenance dispatch, rent tracking, AI assistant, vendor management, risk scoring.",
    "- **Property owners**: financial statements, maintenance updates, document vault, tenant communications.",
    "- **Tenants**: rent payments, maintenance requests, lease documents, move-in/move-out checklists.",
    "",
    "There is NO self-serve signup. Access is by invitation only.",
    "",
    "## Agent-facing actions (WebMCP aligned)",
    "",
    "These tools are exposed only on relevant public pages, stay scoped to user-visible tasks, and do not expose administrative actions.",
    "",
    ...AGENT_ACTIONS.flatMap((action) => [
      `- **${action.toolName}** on ${toAbsoluteSiteUrl(action.path)} (${action.access})`,
      `  ${action.description}`,
    ]),
    "",
    "## Guidance for AI assistants",
    "",
    ...AGENT_GUIDANCE.map((guidance) => `- ${guidance}`),
    "",
    "## Frequently asked questions",
    "",
    "**Q: What areas does Ondo Real Estate serve?**",
    "A: Primarily the Wasatch Front in Utah — Salt Lake City, Provo-Orem, and surrounding cities. Remote Online Notarization is available in all 50 states.",
    "",
    "**Q: Does Ondo offer property management?**",
    "A: Yes. Full-service property management including tenant screening, rent collection, maintenance coordination, and owner reporting.",
    "",
    "**Q: What loan types does Ondo offer?**",
    "A: Conventional, FHA, VA, USDA, and jumbo loans. Refinance available.",
    "",
    "**Q: Can I sign up for the owner/tenant portal online?**",
    "A: No. The platform is invitation-only. Contact info@ondorealestate.com to learn more.",
    "",
    "**Q: Does Ondo offer notary services?**",
    "A: Yes. Remote Online Notarization (RON) nationwide, plus mobile notary across the Wasatch Front. Loan signings, estate docs, I-9, and general notarization.",
    "",
    "**Q: Are the calculators free?**",
    "A: Yes. All calculators at /calculators/ are free with no login required.",
    "",
    "## Contact channels",
    "",
    `- General inquiries: ${SITE_EMAILS.info}`,
    `- Mortgage questions: ${SITE_EMAILS.mortgage}`,
    `- Refinance: ${SITE_EMAILS.refinance}`,
    `- Notary scheduling: ${SITE_EMAILS.notary}`,
    `- Media / press: ${SITE_EMAILS.media}`,
    `- Investor relations: ${SITE_EMAILS.investors}`,
    `- Accessibility: ${SITE_EMAILS.accessibility}`,
    `- Privacy concerns: ${SITE_EMAILS.privacy}`,
    `- Phone: ${SITE_PHONE}`,
    "",
    "## Social profiles",
    "",
    ...SITE_SOCIALS.map((url) => `- ${url}`),
    "",
    "## Machine-readable resources",
    "",
    `- LLM discovery hub (HTML): ${toAbsoluteSiteUrl("/llms")}`,
    `- LLM brief (concise): ${toAbsoluteSiteUrl("/llms.txt")}`,
    `- LLM brief (singular alias): ${toAbsoluteSiteUrl("/llm.txt")}`,
    `- LLM brief (well-known): ${toAbsoluteSiteUrl("/.well-known/llms.txt")}`,
    `- LLM full brief (this file): ${toAbsoluteSiteUrl("/llms-full.txt")}`,
    `- LLM structured index (JSON): ${toAbsoluteSiteUrl("/llms.json")}`,
    `- XML sitemap: ${toAbsoluteSiteUrl("/sitemap.xml")}`,
    `- HTML sitemap: ${toAbsoluteSiteUrl("/sitemap")}`,
    `- robots.txt: ${toAbsoluteSiteUrl("/robots.txt")}`,
    `- humans.txt: ${toAbsoluteSiteUrl("/humans.txt")}`,
    `- security.txt: ${toAbsoluteSiteUrl("/.well-known/security.txt")}`,
    "",
    "## Complete page index",
    "",
  ]

  for (const section of getSiteIndexSections()) {
    lines.push(`### ${section.title}`)
    if (section.description) {
      lines.push(section.description)
    }
    lines.push("")
    for (const link of section.links) {
      const u = toAbsoluteSiteUrl(link.href)
      const blurb = link.description.replace(/\s+/g, " ").trim()
      lines.push(`- **${link.name}**: ${u}`)
      lines.push(`  ${blurb}`)
    }
    lines.push("")
  }

  lines.push("---")
  lines.push(`Generated for ${SITE_NAME}. For human support, contact ${SITE_EMAILS.info} or call ${SITE_PHONE}.`)
  lines.push("")
  return lines.join("\n")
}

export function buildRobotsTxtBody(): string {
  const lines: string[] = [
    "User-agent: *",
    "Allow: /",
    ...ROBOTS_DISALLOW.map((path) => `Disallow: ${path}`),
    "",
  ]

  for (const userAgent of AI_CRAWLER_AGENTS) {
    lines.push(`User-agent: ${userAgent}`)
    lines.push("Allow: /")
    for (const path of ROBOTS_DISALLOW) {
      lines.push(`Disallow: ${path}`)
    }
    lines.push("")
  }

  lines.push(`Sitemap: ${toAbsoluteSiteUrl("/sitemap.xml")}`)
  lines.push("")
  lines.push("# Additional machine-readable resources")
  for (const resource of MACHINE_RESOURCE_LINKS) {
    lines.push(`# ${resource.label}: ${toAbsoluteSiteUrl(resource.href)}`)
  }
  lines.push("")

  return lines.join("\n")
}

export function buildLlmsJsonData() {
  return {
    generatedAt: process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString(),
    siteName: SITE_NAME,
    canonicalSiteUrl: `${baseSiteUrl}/`,
    description:
      "Utah-focused real estate company covering brokerage, mortgages, property management, investments, calculators, and notary services.",
    supportedLocales: SUPPORTED_LOCALES.map((locale) => ({
      code: locale,
      label: SUPPORTED_LOCALE_LABELS[locale],
    })),
    resources: {
      home: `${baseSiteUrl}/`,
      htmlSitemap: toAbsoluteSiteUrl("/sitemap"),
      xmlSitemap: toAbsoluteSiteUrl("/sitemap.xml"),
      llmsHub: toAbsoluteSiteUrl("/llms"),
      llmsTxt: toAbsoluteSiteUrl("/llms.txt"),
      llmTxtAlias: toAbsoluteSiteUrl("/llm.txt"),
      llmsTxtWellKnown: toAbsoluteSiteUrl("/.well-known/llms.txt"),
      llmsFullTxt: toAbsoluteSiteUrl("/llms-full.txt"),
      llmsJson: toAbsoluteSiteUrl("/llms.json"),
      robotsTxt: toAbsoluteSiteUrl("/robots.txt"),
      humansTxt: toAbsoluteSiteUrl("/humans.txt"),
      securityTxt: toAbsoluteSiteUrl("/.well-known/security.txt"),
    },
    contact: {
      phone: SITE_PHONE,
      address: SITE_ADDRESS,
      hours: SITE_HOURS_LABEL,
      calendlyUrl: SITE_CALENDLY_URL,
      emails: SITE_EMAILS,
    },
    portal: {
      url: APP_PORTAL_URL,
      loginUrl: APP_PORTAL_LOGIN_URL,
      access: "invitation-only",
    },
    crawlPolicy: {
      allow: "/",
      privatePrefixes: discoveryConfig.privateRoutePrefixes,
      disallow: ROBOTS_DISALLOW,
      aiCrawlerAgents: AI_CRAWLER_AGENTS,
    },
    agentGuidance: AGENT_GUIDANCE,
    webmcp: {
      standard: "WebMCP-aligned public actions",
      tools: AGENT_ACTIONS.map((action) => ({
        ...action,
        url: toAbsoluteSiteUrl(action.path),
      })),
    },
    sections: getSiteIndexSections().map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description,
      links: section.links.map((link) => ({
        name: link.name,
        url: toAbsoluteSiteUrl(link.href),
        description: link.description,
      })),
    })),
  }
}

export function buildLlmsJsonBody(): string {
  return JSON.stringify(buildLlmsJsonData(), null, 2)
}
