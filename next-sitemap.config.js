/** @type {import('next-sitemap').IConfig} */
const agentDiscoveryConfig = require('./lib/agent-discovery-config.json')

// The site is English only: hreflang is x-default plus en-US (same as lib/i18n-alternates.ts).

// eslint-disable-next-line @typescript-eslint/no-require-imports -- CommonJS config, like the requires above
const { getRouteLastmod } = require('./lib/sitemap-lastmod.cjs')

// eslint-disable-next-line @typescript-eslint/no-require-imports
const APP_DIR = require('path').join(__dirname, 'app')
const PRIVATE_ROUTE_PREFIXES = agentDiscoveryConfig.privateRoutePrefixes
const ROBOTS_DISALLOW = [...PRIVATE_ROUTE_PREFIXES, ...agentDiscoveryConfig.extraDisallow]
const AI_CRAWLER_AGENTS = agentDiscoveryConfig.aiCrawlerAgents
const AGENT_DISCOVERY_PATHS = [
  '/llms',
  '/llms.txt',
  '/llm.txt',
  '/.well-known/llms.txt',
  '/llms-full.txt',
  '/llms.json',
  '/index.md',
  '/sitemap.md',
  '/properties.md',
  '/contact.md',
  '/.well-known/agents.json',
]
const ROBOTS_COMMENT_RESOURCES = [...AGENT_DISCOVERY_PATHS, '/humans.txt', '/.well-known/security.txt']

// Listings live at /{address-slug} (street number first), e.g. /4323-west-11475-south.
const ROOT_LISTING_PATH = /^\/[0-9][a-z0-9-]*$/
const UUID_SEGMENT = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

function normalizeSitemapPath(path) {
  if (!path || path === '/') return '/'
  return path.replace(/\/+$/, '') || '/'
}

// Priority tiers:
//  1.0 — homepage
//  0.9 — primary service pages (buy, sell, loans, contact, properties index)
//  0.8 — secondary landing pages (investments, calculators index, blog index,
//        about, faq index, individual property listing pages)
//  0.7 — content pages (blog posts, calculator sub-pages, faq sub-pages)
//  0.5 — utility pages (resources, notary, news, privacy, terms)
function getPriority(path) {
  const p = normalizeSitemapPath(path)
  if (p === '/') return 1.0
  const tier9 = ['/buy', '/sell', '/loans', '/contact', '/properties']
  if (tier9.includes(p)) return 0.9
  // Individual listing detail pages get tier 8 — they're crawl-worthy but
  // less important than the index.
  if (/^\/properties\/[^/]+$/.test(p) || ROOT_LISTING_PATH.test(p)) return 0.8
  const tier8 = ['/investments', '/calculators', '/blog', '/about', '/faq', '/property-management', '/locations', '/market-reports', '/neighborhoods', '/schools', '/glossary']
  if (tier8.some((x) => p === x)) return 0.8
  const tier5 = [
    '/resources',
    '/notary',
    '/privacy-policy',
    '/terms-of-service',
    '/accessibility',
    '/sitemap',
    '/llms',
  ]
  if (tier5.some((x) => p === x || p.startsWith(`${x}/`))) return 0.5
  // City x sub-service pages (e.g. /loans/sandy/fha, /property-management/draper/tenant-screening)
  const citySubServicePattern = /^\/(property-management|loans|buy-sell)\/[a-z-]+\/[a-z-]+$/
  if (citySubServicePattern.test(p)) return 0.6
  return 0.7
}

/** File-like static export paths (`out/sitemap.xml`, `out/llms.txt`) omit a trailing slash. */
function isFileLikeSitemapPath(path) {
  const p = normalizeSitemapPath(path)
  return /\.[a-z0-9]{2,8}$/i.test(p)
}

function buildAlternateRefs(path, siteUrl) {
  const base = siteUrl.replace(/\/+$/, '')
  const p = normalizeSitemapPath(path)
  const fileLike = isFileLikeSitemapPath(path)
  const canonical = p === '/' ? `${base}/` : fileLike ? `${base}${p}` : `${base}${p}/`
  // next-sitemap appends `loc` onto href unless hrefIsAbsolute is set.
  const abs = (href, hreflang) => ({ href, hreflang, hrefIsAbsolute: true })
  return [abs(canonical, 'x-default'), abs(canonical, 'en-US')]
}

/** Public pages that exist but must not be indexed (noindex metadata or redirect-only). */
const SITEMAP_NOINDEX_PATHS = [
  '/search',
  '/chat',
  '/properties/compare',
  // Invite landing page that only makes sense with a ?ref= code (noindex).
  '/referral',
  // Placeholder pages whose original content could not be verified (noindex).
  '/about/history',
  '/about/news',
  '/about/giving-back',
  '/about/investor-relations',
  '/about/careers',
  '/sweepstakes',
  // Sample deal cards only; no live offering exists.
  '/investments/opportunities',
  // Internal engineering write-ups (noindex): not consumer search content.
  '/blog/technical-seo-for-real-estate',
  '/blog/modernizing-notary-workflows-integration',
  '/blog/building-high-performance-real-estate-nextjs-supabase',
  '/blog/engineering-real-estate-investment-calculators',
  '/blog/dashboards-for-landlords',
  '/blog/designing-property-owner-portal',
  '/blog/full-stack-dev-landlord-gaps',
  '/blog/property-management-pwa-offline',
  '/blog/how-ondo-re-uses-technology-property-management',
  // Duplicates folded into a stronger post (noindex,follow, canonical to the kept post).
  '/blog/utah-repc-deadlines',
  '/blog/utah-county-conforming-loan-limit-lookup',
  '/blog/rent-vs-own-calculator-guide',
  '/blog/renting-vs-owning-hidden-math',
  '/blog/utah-rent-vs-buy-wasatch-front',
  // Oct 2026 blog consolidation: folded into cluster guides (noindex,follow, canonical to the guide).
  '/blog/can-i-get-a-mortgage-if-my-income-changes-every-month',
  '/blog/1099-mortgage-documentation-checklist',
  '/blog/just-went-1099-last-month',
  '/blog/two-years-of-tax-returns-vs-one-year-mortgage',
  '/blog/w2-overtime-likely-to-continue',
  '/blog/commission-income-mortgage-averaging',
  '/blog/gig-plus-w2-income-mortgage-average',
  '/blog/spouse-w2-offset-1099-volatility',
  '/blog/k-1-income-what-usually-counts',
  '/blog/schedule-e-rental-income-purchase-file',
  '/blog/depreciation-add-back-schedule-e',
  '/blog/cpa-letter-vs-tax-returns-underwriting',
  '/blog/business-vs-personal-bank-co-mingling',
  '/blog/bank-statement-loans-when-tax-returns-undercount-income',
  '/blog/relocating-to-utah-job-seasoning',
  '/blog/asset-depletion-qualifying-non-qm',
  '/blog/va-funding-fee-finance-vs-pay-cash',
  '/blog/va-entitlement-second-va-loan',
  '/blog/va-residual-income-vs-dti',
  '/blog/hill-afb-va-coe-occupancy',
  '/blog/selling-with-va-loan-entitlement-restoration',
  '/blog/usda-vs-va-vs-fha-veteran-rural',
  '/blog/how-fha-loan-assumption-works',
  '/blog/fha-condo-roster-project-approval',
  '/blog/house-hacking-duplex-with-fha',
  '/blog/dpa-stacked-with-fha-gift-funds',
  '/blog/usda-map-income-limit-eligibility',
  '/blog/no-closing-cost-refinance-rate-credit-tradeoff',
  '/blog/discount-points-breakeven-without-sales-pitch',
  '/blog/recast-vs-refinance',
  '/blog/biweekly-extra-principal-vs-refinance',
  '/blog/mortgage-paydown-hacks',
  '/blog/fha-va-streamline-refinance-less-docs',
  '/blog/heloc-after-year-two-vs-cash-out',
  '/blog/cash-out-to-buy-a-rental',
  '/blog/cross-collateral-equity-to-buy-another-house',
  '/blog/delayed-financing-after-cash-purchase',
  '/blog/escrow-cushion-how-it-is-set',
  '/blog/impounds-vs-waiving-escrow',
  '/blog/utah-property-tax-calendar-first-escrow-analysis',
  '/blog/understanding-property-taxes-utah',
  '/blog/rate-lock-extension-vs-floating',
  '/blog/mortgage-rate-trends-2025',
  '/blog/apr-vs-rate-on-a-loan-estimate',
  '/blog/temporary-buydown-who-pays-year-three',
  '/blog/arm-caps-in-plain-english',
  '/blog/mip-vs-pmi-how-mortgage-insurance-ends',
  '/blog/pmi-removal-original-value-vs-new-appraisal',
  '/blog/gift-funds-down-payment-rules',
  '/blog/parent-gifting-down-payment-who-signs',
  '/blog/large-deposits-60-day-paper-trail',
  '/blog/mortgage-reserves-months-of-pitia',
  '/blog/utah-cash-to-close-besides-down-payment',
  '/blog/earnest-money-vs-down-payment-vs-closing-costs',
  '/blog/title-insurance-owner-vs-lender',
  '/blog/closing-credit-card-before-mortgage',
  '/blog/authorized-user-tradelines-mortgage',
  '/blog/medical-collections-after-fico-model-change',
  '/blog/no-traditional-credit-alternative-credit',
  '/blog/what-a-tri-merge-credit-report-shows',
  '/blog/new-auto-loan-during-underwriting',
  '/blog/student-loans-dti-idr-save',
  '/blog/declined-after-pre-approval',
  '/blog/compensating-factors-in-aus-findings',
  '/blog/what-a-mortgage-conversation-asks',
  '/blog/first-time-buyer-file-mistakes',
  '/blog/refinancing-condo-aging-hoa',
  '/blog/hazard-vs-ho3-vs-ho6-condo-insurance',
]

/**
 * /investments/<static-subpage> (fractional, opportunity-zones, …) are real content.
 * /investments/[slug] pages are rendered from MOCK_OPPORTUNITIES (sample deals for product
 * demos, noindex) and must never reach the sitemap. Derive the allow-list from the route
 * tree so a new static subpage is picked up automatically.
 */
const INVESTMENT_STATIC_SUBPAGES = new Set(
  require('fs')
    .readdirSync(require('path').join(__dirname, 'app', 'investments'), { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('['))
    .map((d) => `/investments/${d.name}`),
)

/** True when the exported page at `path` carries a robots noindex meta (outDir, trailingSlash). */
function isNoindexExport(path) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- CommonJS config, like the requires above
  const fs = require('fs')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const file = require('path').join(__dirname, 'out', path, 'index.html')
  if (!fs.existsSync(file)) return false
  return /<meta name="robots" content="noindex/.test(fs.readFileSync(file, 'utf8'))
}

function isExcludedPath(path) {
  const p = normalizeSitemapPath(path)
  if (SITEMAP_NOINDEX_PATHS.includes(p)) {
    return true
  }
  if (/^\/investments\/[^/]+$/.test(p) && !INVESTMENT_STATIC_SUBPAGES.has(p)) {
    return true
  }
  // Pages Router leftovers — same calculators live at /calculators/{slug}/.
  if (/^\/calculators\/[^/]+-calculator$/.test(p)) {
    return true
  }
  // ZIP pages render their primary city's service page and canonicalize to it
  // (lib/zip-pages.ts), so only the canonical city page belongs in the sitemap.
  if (/^\/(property-management|buy-sell|loans)\/zip\/\d{5}$/.test(p)) {
    return true
  }
  // /neighborhoods/{city}/ only redirects to the hub's city section (the neighborhood pages sit one level down).
  if (/^\/neighborhoods\/[^/]+$/.test(p)) {
    return true
  }
  // /_placeholder and /properties/_placeholder are the build-time stubs emitted by
  // generateStaticParams (app/[listing], app/properties/[publicId]) when the
  // backend is unreachable during the build (CI without BACKEND_BASE_URL).
  // They must never appear in the public sitemap or robots.txt.
  if (p === '/_placeholder' || p === '/properties/_placeholder') {
    return true
  }
  // /properties/{address-slug}/ is a noindex redirect stub to /{address-slug}/. Only a
  // UUID segment (a listing with no usable address, canonical there) belongs in the sitemap.
  if (/^\/properties\/[^/]+$/.test(p) && p !== '/properties/compare' && !UUID_SEGMENT.test(p.slice('/properties/'.length))) {
    return true
  }
  // /properties/{publicId}/ of a listing that has an address is also a noindex redirect
  // stub (old links keep working). Read the exported page to tell it from a canonical one.
  if (/^\/properties\/[^/]+$/.test(p) && isNoindexExport(p)) {
    return true
  }

  // Token shells (/apply/_/, /visit/confirm/__ondo_visit_export_shell__/, etc.)
  // and extraDisallow prefixes (/verify, /invite, /unsubscribe) stay out of XML.
  return ROBOTS_DISALLOW.some((prefix) => p === prefix || p.startsWith(`${prefix}/`))
}

function buildRobotsCommentBlock(siteUrl) {
  const normalizedSiteUrl = siteUrl.replace(/\/$/, '')
  return [
    '# Additional machine-readable resources',
    ...ROBOTS_COMMENT_RESOURCES.map((path) => `# ${path.replace(/^\//, '')}: ${normalizedSiteUrl}${path}`),
  ].join('\n')
}

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ondorealestate.com',
  /** Must match `trailingSlash` in next.config.mjs for static export + GitHub Pages. */
  trailingSlash: true,
  generateRobotsTxt: true,
  outDir: 'out',
  changefreq: 'weekly',
  priority: 0.7,
  generateIndexSitemap: true,
  sitemapSize: 5000,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: ['/llms.txt', '/llms-full.txt', '/.well-known/llms.txt', '/sitemap.md', '/index.md', '/'],
        disallow: ROBOTS_DISALLOW,
      },
      ...AI_CRAWLER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: ['/llms.txt', '/llms-full.txt', '/.well-known/llms.txt', '/sitemap.md', '/index.md', '/'],
        disallow: ROBOTS_DISALLOW,
      })),
    ],
    additionalSitemaps: [],
    /**
     * next-sitemap emits a UA=* policy but does not know about
     * [Cloudflare Content-Signal](https://contentsignals.org/). We inject the
     * directive inline so it lands inside the UA=* group per the spec, then
     * append the machine-readable resource comment block.
     */
    transformRobotsTxt: async (config, robotsTxt) => {
      const withContentSignal = robotsTxt.replace(
        /^# \*\nUser-agent: \*\n/m,
        '# *\nUser-agent: *\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\n',
      )
      const output = withContentSignal === robotsTxt
        ? robotsTxt.replace(
            /^User-agent: \*\n/m,
            'User-agent: *\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\n',
          )
        : withContentSignal
      return `${output.trimEnd()}\n${buildRobotsCommentBlock(config.siteUrl)}\n`
    },
  },
  exclude: [
    '/intake',
    '/intake/',
    '/calculators/*-calculator',
    '/calculators/*-calculator/',
    '/auth',
    '/dashboard',
    '/owner',
    '/tenant',
    '/platform',
    '/dashboard/**',
    '/dashboard/*',
    '/owner/**',
    '/owner/*',
    '/tenant/**',
    '/tenant/*',
    '/platform/**',
    '/platform/*',
    '/auth/**',
    '/auth/*',
    '/login',
    '/admin',
    '/admin/**',
    '/admin/*',
    '/api',
    '/api/**',
    '/api/*',
    '/feedback',
    // Reel landing page (noindex); the indexable versions live under /calculators/.
    '/numbers',
    // Illustrative scenarios, not verified case studies: noindex until real ones replace them.
    '/about/case-studies',
    '/about/case-studies/',
    // Link-in-bio hub for social profiles; noindex, so it must not be submitted either.
    '/links',
    '/links/',
    // Instagram feed mirror; noindex, the posts themselves live on Instagram.
    '/instagram',
    '/instagram/',
    // Example stories were removed (unverifiable); the page is a noindex notice.
    '/about/testimonials',
    '/about/testimonials/',
    // QR short links redirect to /links; the contact card is a file, not a page.
    '/go/*',
    '/go/**',
    // City pricing pages redirect to /property-management/<city>/#fees (noindex stubs).
    // Matched without the trailing slash, so this leaves the /pricing hub listed.
    '/pricing/*',
    '/ondo-real-estate.vcf',
    '/health',
    '/search',
    '/search/',
    '/chat',
    '/chat/',
    '/apply',
    '/apply/**',
    '/apply/*',
    '/invite',
    '/invite/**',
    '/invite/*',
    '/tenantOnboarding',
    '/tenantOnboarding/**',
    '/tenantOnboarding/*',
    '/visit',
    '/visit/**',
    '/visit/*',
    '/verify',
    '/unsubscribe',
    // Invite landing page that only makes sense with a ?ref= code; noindex, so it must not be submitted.
    '/referral',
    '/referral/',
  ],
  transform: async (config, path) => {
    // robots.txt, llms.txt, index.md and the like are files, not pages. They are
    // advertised in the robots.txt comment block instead.
    if (isFileLikeSitemapPath(path) || isExcludedPath(path)) {
      return null
    }

    const base = {
      loc: path,
      changefreq: 'weekly',
      priority: getPriority(path),
      alternateRefs: buildAlternateRefs(path, config.siteUrl),
    }
    // lastmod comes from the page's own `modified`/`published` constant; no date, no lastmod.
    const lastmod = getRouteLastmod(path, APP_DIR)
    return lastmod ? { ...base, lastmod } : base
  },
}
