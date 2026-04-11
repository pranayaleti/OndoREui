import type React from "react"
import { Suspense } from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Inter, Outfit } from "next/font/google"
import "./globals.css"
import "leaflet/dist/leaflet.css"
import { RootProvidersClient } from "@/components/root-providers-client"
import { JsonLd } from "@/components/json-ld"
import { generateRealEstateBusinessJsonLd, generateWebsiteJsonLd } from "@/lib/seo"
import { SITE_BRAND_SHORT, SITE_NAME, SITE_URL } from "@/lib/site"
import { getSpeculationRulesJson } from "@/lib/speculation-rules"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"
import ErrorBoundary from "@/components/error-boundary"
import { CachePurge } from "@/components/cache-purge"
import { AttributionCapture } from "@/components/attribution-capture"
import { FirstVisitLeadPopup } from "@/components/first-visit-lead-popup"
// Push notification prompt disabled until backend push endpoint + VAPID keys are configured.
// Re-enable by importing PushNotificationPrompt from @/components/notifications/push-notification-prompt-loader
// Vercel Analytics is disabled for static exports (GitHub Pages)
// It only works on Vercel's platform, not with static site generation
// const Analytics = dynamic(() => import('@vercel/analytics/react').then(mod => mod.Analytics), { ssr: false })

const inter = Inter({ 
  subsets: ["latin"], 
  weight: ["400","500","700","800"],
  display: 'swap', // Optimize font loading
  preload: true,
})
const outfit = Outfit({ 
  subsets: ["latin"], 
  weight: ["400","500","600","700","800"], 
  variable: "--font-outfit",
  display: 'swap', // Optimize font loading
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_BRAND_SHORT} | ${SITE_NAME} — Utah real estate & property management`,
    template: `%s | ${SITE_BRAND_SHORT}`,
  },
  description:
    "Ondo RE (Ondo Real Estate): Utah property management, mortgages, buying & selling, and investor tools—modern software with local expertise.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo-favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo-favicon.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/logo-favicon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
  },
  keywords: [
    SITE_BRAND_SHORT,
    "Ondo RE",
    "Ondo Real Estate",
    // Core market/service
    "Utah real estate",
    "real estate Utah",
    "Utah real estate listings",
    "homes for sale Utah",
    "houses for sale Utah",
    "property management Utah",
    "rental property management",
    "tenant screening Utah",
    "home buying Utah",
    "first-time home buyer Utah",
    "home selling Utah",
    "sell my house Utah",
    "Utah home loans",
    "mortgage lender Utah",
    "mortgage pre-approval Utah",
    "refinance Utah",
    // Geos
    "Wasatch Front",
    "Salt Lake City real estate",
    "Lehi real estate",
    "Provo real estate",
    "Orem real estate",
    "Sandy real estate",
    "Draper real estate",
    "American Fork real estate",
    "Pleasant Grove real estate",
    "Utah County real estate",
    "Salt Lake County real estate",
    "Davis County real estate",
    "Payson real estate",
    "Spanish Fork real estate",
    "Springville real estate",
    // Topics
    "property management company Utah",
    "best property management Utah",
    "rental property manager near me",
    "Utah housing market",
    "MLS listings Utah",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_BRAND_SHORT} | ${SITE_NAME} — Utah real estate & property management`,
    description:
      "Ondo RE: Utah property management, mortgages, and real estate services across the Wasatch Front.",
    images: [
      {
        url: `${SITE_URL}/modern-office-building.webp`,
        width: 1200,
        height: 630,
        alt: `${SITE_BRAND_SHORT} (${SITE_NAME}) — Utah headquarters and services`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_BRAND_SHORT} | ${SITE_NAME} — Utah real estate & property management`,
    description:
      "Ondo RE: Utah property management, mortgages, and real estate services across the Wasatch Front.",
    images: [`${SITE_URL}/modern-office-building.webp`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  generator: "Next.js",
  applicationName: SITE_NAME,
  referrer: 'origin-when-cross-origin',
  verification: {
    google: process.env['NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION'],
    other: {
      'p:domain_verify': process.env['NEXT_PUBLIC_PINTEREST_DOMAIN_VERIFY'] ?? '',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const rb2bKey = process.env['NEXT_PUBLIC_RB2B_KEY']
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://lpklmquhxgbpavjngbby.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ddwl4m2hdecbv.cloudfront.net" />
        <link rel="dns-prefetch" href="https://js.hs-scripts.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://supabase.co" />

        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" type="text/plain" title="LLM brief (llms.txt)" href={`${SITE_URL.replace(/\/$/, "")}/llms.txt`} />
        <link rel="alternate" type="application/json" title="Structured LLM index" href={`${SITE_URL.replace(/\/$/, "")}/llms.json`} />
        <meta name="theme-color" content="#0b1220" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Speculation Rules API: prefetch + prerender same-origin pages for faster navigation */}
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{ __html: getSpeculationRulesJson() }}
        />
        {/* CSP: no upgrade-insecure-requests — it forces https://localhost during next start / local HTTP and breaks API fetch. Deployed site is HTTPS already. HubSpot: explicit regional script hosts. Note: unsafe-inline kept for style-src (required by Next.js inline styles). unsafe-eval added only in dev (React Refresh requires it). */}
        <meta
          httpEquiv="Content-Security-Policy"
          content={`default-src 'self'; script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://ddwl4m2hdecbv.cloudfront.net https://js.hs-scripts.com https://js-na1.hs-scripts.com https://js-na2.hs-scripts.com https://js-eu1.hs-scripts.com https://js.hsforms.net https://js.hs-banner.com https://js.hs-analytics.net https://js.stripe.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://r2cdn.perplexity.ai data:; img-src 'self' data: https: blob:; connect-src 'self' https://www.google-analytics.com https://ddwl4m2hdecbv.cloudfront.net https://pro.ip-api.com https://lpklmquhxgbpavjngbby.supabase.co https://lpklmquhxgbpavjngbby.supabase.co/functions/v1 https://api.hubspot.com https://forms.hubspot.com https://track.hubspot.com https://cta-service-cms2.hubspot.com https://api.hubapi.com https://js.hs-scripts.com https://js-na1.hs-scripts.com https://js-na2.hs-scripts.com https://js-eu1.hs-scripts.com https://api.stripe.com https://cloudflareinsights.com; frame-src 'self' https://calendly.com https://*.calendly.com https://app.hubspot.com https://js.stripe.com https://hooks.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self';`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} ${outfit.variable} min-h-screen bg-background text-foreground`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <RootProvidersClient>
          <Suspense fallback={null}>
            <AttributionCapture />
          </Suspense>
          <FirstVisitLeadPopup />
          <CachePurge />
          <ScrollProgress />
          <div className="min-h-screen flex flex-col">
            <Header />
            {/* Each page renders its own <main> landmark; this div provides the skip-link target */}
            <div id="main-content" className="flex-1">
              <ErrorBoundary>{children}</ErrorBoundary>
            </div>
            <Footer />
          </div>
        </RootProvidersClient>
        <JsonLd
          id="global-jsonld"
          data={[generateRealEstateBusinessJsonLd(), generateWebsiteJsonLd()].filter(Boolean)}
        />
        {/* Google Analytics - Deferred to reduce render blocking and unused JS */}
        {process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'] ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID']}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID']}');
              `}
            </Script>
          </>
        ) : null}
        {/* HubSpot Tracking Code — enables page view attribution for leads */}
        {process.env['NEXT_PUBLIC_HUBSPOT_PORTAL_ID'] ? (
          <Script
            id="hubspot-tracking"
            strategy="lazyOnload"
            src={`https://js.hs-scripts.com/${process.env['NEXT_PUBLIC_HUBSPOT_PORTAL_ID']}.js`}
          />
        ) : null}
        {/* Vercel Analytics disabled for static exports - only works on Vercel platform */}
        {/* {process.env['NEXT_PUBLIC_VERCEL'] && <Analytics />} */}
        {/* rb2b Script (optional) - keep off by default for static export */}
        {rb2bKey ? (
          <Script
            id="rb2b-script"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                !function(key) {
                  if (window.reb2b) return;
                  window.reb2b = {loaded: true};
                  var s = document.createElement("script");
                  s.async = true;
                  s.src = "https://ddwl4m2hdecbv.cloudfront.net/b/" + key + "/" + key + ".js.gz";
                  document.getElementsByTagName("script")[0].parentNode.insertBefore(s, document.getElementsByTagName("script")[0]);
                }("${rb2bKey}");
              `,
            }}
          />
        ) : null}
      </body>
    </html>
  )
}
