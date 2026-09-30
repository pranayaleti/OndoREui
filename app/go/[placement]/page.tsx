// NOTE(i18n): server component, English-only per OndoREui/CLAUDE.md i18n rules.
import type { Metadata } from "next"
import { QR_PLACEMENTS, qrRedirectTarget } from "@/lib/qr-placements"
import { pageTitle } from "@/lib/site"
import { QrRedirect } from "./qr-redirect"

/**
 * /go/<placement>/: the short link each printed QR code carries (lib/qr-placements.ts). A static
 * host cannot send a real 301, so the page redirects with a meta refresh plus a client-side
 * replace, and lands on /links with that placement's UTM tags for per-placement analytics.
 */
export const dynamicParams = false

export function generateStaticParams(): { placement: string }[] {
  return QR_PLACEMENTS.map(({ id }) => ({ placement: id }))
}

export const metadata: Metadata = {
  title: pageTitle("Opening links"),
  robots: { index: false, follow: true },
}

export default async function QrRedirectPage({ params }: { params: Promise<{ placement: string }> }) {
  const { placement } = await params
  const target = qrRedirectTarget(placement)
  return (
    <main className="grid min-h-[50vh] place-items-center px-6 text-center">
      <meta httpEquiv="refresh" content={`0;url=${target}`} />
      <QrRedirect to={target} />
      <p className="text-muted-foreground">
        Opening{" "}
        <a href={target} className="font-medium text-primary underline underline-offset-4">
          Ondo Real Estate
        </a>
        …
      </p>
    </main>
  )
}
