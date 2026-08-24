import type { AppProps } from "next/app"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect } from "react"
import {
  legacyCalculatorPathToCanonicalPath,
  toCanonicalPageUrl,
} from "@/lib/page-canonical"

/**
 * Pages Router shell for leftover `/calculators/*-calculator` URLs.
 * Those files still compile as routes (the widgets live under `pages/`), so
 * this _app advertises the App Router canonical and asks Google not to index
 * the duplicate. A meta refresh covers crawlers that do not run our JS.
 */
export default function PagesRouterApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const canonicalPath = legacyCalculatorPathToCanonicalPath(router.pathname)
  const canonicalHref = canonicalPath ? toCanonicalPageUrl(canonicalPath) : null

  useEffect(() => {
    if (!canonicalPath) return
    void router.replace(canonicalPath)
  }, [canonicalPath, router])

  return (
    <>
      <Head>
        {canonicalHref ? <link rel="canonical" href={canonicalHref} /> : null}
        <meta name="robots" content="noindex, follow" />
        {canonicalPath ? <meta httpEquiv="refresh" content={`0;url=${canonicalPath}`} /> : null}
      </Head>
      <Component {...pageProps} />
    </>
  )
}
