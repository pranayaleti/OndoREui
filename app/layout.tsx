import type React from "react"
import { Suspense } from "react"
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import "./globals.css"
import "leaflet/dist/leaflet.css"
import { RootProvidersClient } from "@/components/root-providers-client"
import { JsonLd } from "@/components/json-ld"
import { generateRealEstateBusinessJsonLd, generateWebsiteJsonLd } from "@/lib/seo"
import { SITE_BRAND_SHORT, SITE_NAME, SITE_URL, getSupabaseConnectSrc, getSupabaseOrigin } from "@/lib/site"
import { getSiteGeoMetaOther } from "@/lib/seo"
import { buildMetadataLanguages } from "@/lib/i18n-alternates"
import { DEFAULT_LOCALE } from "@/lib/locales"
import { getSpeculationRulesJson } from "@/lib/speculation-rules"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"
import ErrorBoundary from "@/components/error-boundary"
import { CachePurge } from "@/components/cache-purge"
import { AttributionCapture } from "@/components/attribution-capture"
import { FirstVisitLeadPopup } from "@/components/first-visit-lead-popup"
import ServiceWorkerRegistrar from "@/components/sw-register"
import { TrackingTags, GeoGatedGoogleTagManagerNoscript } from "@/components/analytics/tracking-tags"
import { WhatsAppFloatButton } from "@/components/whatsapp-float-button"
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
    languages: buildMetadataLanguages("/"),
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
  other: getSiteGeoMetaOther(),
}

const supabaseOrigin = getSupabaseOrigin()
const supabaseConnectSrc = getSupabaseConnectSrc()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Static export has no request-time locale segment/cookie, so SSR must emit
  // the default locale. I18nProvider updates document.documentElement.lang on
  // the client after reading the user's saved locale.
  return (
    <html lang={DEFAULT_LOCALE} suppressHydrationWarning className="dark">
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        {supabaseOrigin ? (
          <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
        ) : null}
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
          content={`default-src 'self'; script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://ddwl4m2hdecbv.cloudfront.net https://js.hs-scripts.com https://js-na1.hs-scripts.com https://js-na2.hs-scripts.com https://js-eu1.hs-scripts.com https://js.hsforms.net https://js.hs-banner.com https://js.hs-analytics.net https://js.stripe.com https://static.cloudflareinsights.com https://connect.facebook.net https://analytics.tiktok.com https://snap.licdn.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://r2cdn.perplexity.ai data:; img-src 'self' data: https: blob:; connect-src 'self' https://www.google-analytics.com https://ddwl4m2hdecbv.cloudfront.net https://pro.ip-api.com${supabaseConnectSrc ? ` ${supabaseConnectSrc}` : ""} https://api.hubspot.com https://forms.hubspot.com https://track.hubspot.com https://cta-service-cms2.hubspot.com https://api.hubapi.com https://js.hs-scripts.com https://js-na1.hs-scripts.com https://js-na2.hs-scripts.com https://js-eu1.hs-scripts.com https://api.stripe.com https://cloudflareinsights.com https://www.facebook.com https://analytics.tiktok.com https://px.ads.linkedin.com; frame-src 'self' https://calendly.com https://*.calendly.com https://app.hubspot.com https://js.stripe.com https://hooks.stripe.com https://td.doubleclick.net; object-src 'none'; base-uri 'self'; form-action 'self';`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} ${outfit.variable} min-h-screen bg-background text-foreground`}>
        {/* GTM <noscript> iframe — geo-gated when JS is available. No-JS visitors cannot be geo-detected. */}
        <GeoGatedGoogleTagManagerNoscript />
        {/* NOTE(i18n): server component — translate when Next.js i18n routing is added */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <RootProvidersClient>
          <ServiceWorkerRegistrar />
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
          {/* Floating WhatsApp CTA — env-driven, dismissible. No-op without NEXT_PUBLIC_WHATSAPP_NUMBER. */}
          <WhatsAppFloatButton />
        </RootProvidersClient>
        <JsonLd
          id="global-jsonld"
          data={[generateRealEstateBusinessJsonLd(), generateWebsiteJsonLd()].filter(Boolean)}
        />
        {/* Google Analytics moved into the geo-gated <TrackingTags /> bundle
            (below) — GA sets cookies and needs consent in EU/EEA too. */}
        {/* HubSpot tracking moved into geo-gated <TrackingTags /> for privacy parity. */}
        {/*
          Marketing / retargeting tracking pixels.
          Each pixel is a no-op until its env var is set, so the same build
          is safe in dev (no env) and prod (with env vars in deploy config).
          Configure NEXT_PUBLIC_GTM_ID and add Meta/TikTok/LinkedIn inside GTM,
          OR set the individual pixel IDs to load them as standalone scripts.
        */}
        <TrackingTags />
        {/* Vercel Analytics disabled for static exports - only works on Vercel platform */}
        {/* {process.env['NEXT_PUBLIC_VERCEL'] && <Analytics />} */}
        {/* rb2b moved into the geo-gated <TrackingTags /> bundle (above) for
            privacy compliance — see components/analytics/tracking-tags.tsx. */}
      </body>
    </html>
  )
}
