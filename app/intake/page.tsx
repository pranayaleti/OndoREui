// NOTE(i18n): server component, English-only per OndoREui/CLAUDE.md i18n rules.
import type { Metadata } from "next"
import { IntakeForm } from "@/components/intake/intake-form"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"
import { SITE_URL, pageTitleText } from "@/lib/site"

const title = pageTitleText("Client Questionnaire | Ondo Real Estate")
const description =
  "Tell us what you need to buy, sell, rent out, or rent a home in Utah. A few minutes of answers gives us a head start, and a real person follows up within one business day."

/**
 * Sent to people directly (Gmail templates, texts) as /intake/?type=buyer|seller|owner|tenant,
 * so it stays out of search: /get-matched is the public entry point.
 */
export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${SITE_URL}/intake/` },
  openGraph: { type: "website", title, description, url: `${SITE_URL}/intake/`, images: DEFAULT_OG_IMAGES },
  twitter: { card: "summary_large_image", title, description, images: [DEFAULT_OG_IMAGE_URL] },
  robots: { index: false, follow: true },
}

export default function IntakePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-card to-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        <header className="mx-auto mb-8 max-w-2xl">
          <h1 className="font-outfit text-3xl font-bold tracking-tight md:text-4xl">Let&apos;s get you started</h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            A few minutes of answers now saves a lot of back and forth later. Your progress saves as you go in this tab.
          </p>
        </header>
        <IntakeForm />
      </div>
    </main>
  )
}
