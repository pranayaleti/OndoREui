/** @type {import('next-sitemap').IConfig} */

// Static lastmod dates by path prefix (no trailing slash; paths normalized in getLastmod).
const SECTION_LASTMOD = {
  '/blog': '2026-03-07',
  '/buy': '2026-03-07',
  '/sell': '2026-03-07',
  '/loans': '2026-03-07',
  '/investments': '2026-03-07',
  '/calculators': '2026-03-07',
  '/notary': '2026-03-07',
  '/faq': '2026-03-07',
  '/resources': '2026-03-07',
  '/about': '2026-03-07',
  '/contact': '2026-03-07',
  '/property-management': '2026-04-05',
  '/buy-sell': '2026-04-05',
  '/locations': '2026-04-05',
}

const BUILD_DATE = process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString().split('T')[0]
const PRIVATE_ROUTE_PREFIXES = ['/dashboard', '/owner', '/tenant', '/platform', '/auth', '/admin', '/api']
const ROBOTS_DISALLOW = [...PRIVATE_ROUTE_PREFIXES, '/login', '/feedback', '/health']

function normalizeSitemapPath(path) {
  if (!path || path === '/') return '/'
  return path.replace(/\/+$/, '') || '/'
}

function getLastmod(path) {
  const p = normalizeSitemapPath(path)
  for (const [prefix, date] of Object.entries(SECTION_LASTMOD)) {
    if (p === prefix || p.startsWith(`${prefix}/`)) return date
  }
  return BUILD_DATE
}

// Priority tiers:
//  1.0 — homepage
//  0.9 — primary service pages (buy, sell, loans, contact, properties)
//  0.8 — secondary landing pages (investments, calculators index, blog index, about, faq index)
//  0.7 — content pages (blog posts, calculator sub-pages, faq sub-pages)
//  0.5 — utility pages (resources, notary, news, privacy, terms)
function getPriority(path) {
  const p = normalizeSitemapPath(path)
  if (p === '/') return 1.0
  const tier9 = ['/buy', '/sell', '/loans', '/contact', '/properties']
  if (tier9.includes(p)) return 0.9
  const tier8 = ['/investments', '/calculators', '/blog', '/about', '/faq', '/sweepstakes', '/property-management', '/locations']
  if (tier8.some((x) => p === x)) return 0.8
  const tier5 = ['/resources', '/notary', '/news', '/privacy-policy', '/terms-of-service', '/accessibility', '/sitemap']
  if (tier5.some((x) => p === x || p.startsWith(`${x}/`))) return 0.5
  // City x sub-service pages (e.g. /loans/sandy/fha, /property-management/draper/tenant-screening)
  const citySubServicePattern = /^\/(property-management|loans|buy-sell)\/[a-z-]+\/[a-z-]+$/
  if (citySubServicePattern.test(p)) return 0.6
  return 0.7
}

function isExcludedPath(path) {
  const p = normalizeSitemapPath(path)
  if (p === '/login' || p === '/feedback' || p === '/health') {
    return true
  }

  return PRIVATE_ROUTE_PREFIXES.some((prefix) => p === prefix || p.startsWith(`${prefix}/`))
}

/** Static export writes `out/sitemap.xml` and `out/llms.txt` (no trailing slash). */
function isFileLikeSitemapPath(path) {
  const p = normalizeSitemapPath(path)
  return /\.[a-z0-9]{2,8}$/i.test(p)
}

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://ondorealestate.com',
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
        allow: '/',
        disallow: ROBOTS_DISALLOW,
      },
      // ── AI crawlers: explicitly welcome on public content ──
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ROBOTS_DISALLOW,
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ROBOTS_DISALLOW,
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ROBOTS_DISALLOW,
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ROBOTS_DISALLOW,
      },
      {
        userAgent: 'Anthropic-AI',
        allow: '/',
        disallow: ROBOTS_DISALLOW,
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ROBOTS_DISALLOW,
      },
      {
        userAgent: 'Bytespider',
        allow: '/',
        disallow: ROBOTS_DISALLOW,
      },
      {
        userAgent: 'CCBot',
        allow: '/',
        disallow: ROBOTS_DISALLOW,
      },
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: ROBOTS_DISALLOW,
      },
    ],
    additionalSitemaps: [],
  },
  exclude: [
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
    '/health',
  ],
  transform: async (config, path) => {
    if (isExcludedPath(path)) {
      return null
    }

    const base = {
      loc: path,
      changefreq: 'weekly',
      priority: getPriority(path),
      lastmod: getLastmod(path),
      alternateRefs: [],
    }
    if (isFileLikeSitemapPath(path)) {
      return { ...base, trailingSlash: false }
    }
    return base
  },
  additionalPaths: async (config) => {
    const paths = ['/llms.txt', '/llms-full.txt']
    const entries = await Promise.all(paths.map((p) => config.transform(config, p)))
    return entries.filter(Boolean)
  },
}
