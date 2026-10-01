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
  if (/^\/properties\/[^/]+$/.test(p)) return 0.8
  const tier8 = ['/investments', '/calculators', '/blog', '/about', '/faq', '/property-management', '/locations', '/buy-sell', '/market-reports', '/neighborhoods', '/schools', '/glossary']
  if (tier8.some((x) => p === x)) return 0.8
  const tier5 = [
    '/resources',
    '/notary',
    '/news',
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
  // Investment wording is pending counsel review (noindex).
  '/strategy',
  '/brochure',
  // Internal engineering write-ups (noindex): not consumer search content.
  '/blog/technical-seo-for-real-estate',
  '/blog/modernizing-notary-workflows-integration',
  // Duplicates folded into a stronger post (noindex,follow, canonical to the kept post).
  '/blog/utah-repc-deadlines',
  '/blog/utah-county-conforming-loan-limit-lookup',
  '/blog/rent-vs-own-calculator-guide',
  '/blog/renting-vs-owning-hidden-math',
  '/blog/utah-rent-vs-buy-wasatch-front',
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
  // /properties/_placeholder is the build-time stub emitted by
  // generateStaticParams in app/properties/[publicId]/page.tsx when the
  // backend is unreachable during the build (CI without BACKEND_BASE_URL).
  // It must never appear in the public sitemap or robots.txt.
  if (p === '/properties/_placeholder') {
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
    // No events published yet, so the page is noindex and must not be submitted either.
    '/events',
    '/events/',
    // Illustrative scenarios, not verified case studies: noindex until real ones replace them.
    '/about/case-studies',
    '/about/case-studies/',
    // Link-in-bio hub for social profiles; noindex, so it must not be submitted either.
    '/links',
    '/links/',
    // Example stories were removed (unverifiable); the page is a noindex notice.
    '/about/testimonials',
    '/about/testimonials/',
    // QR short links redirect to /links; the contact card is a file, not a page.
    '/go/*',
    '/go/**',
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
