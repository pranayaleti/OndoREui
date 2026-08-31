import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/property-management-pwa-offline"
const title = "What Is a PWA? Why Your Property Management App Should Work Offline"
const description = "How progressive web apps deliver installable, offline-capable property management — and why that matters in the field."
const published = "2026-07-24"
const modified = "2026-07-24"
const author = "ONDO Team"

const keywords = [
  "property management PWA",
  "offline property management app",
  "progressive web app real estate",
  "landlord app offline",
]

import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: `${title} | Ondo Real Estate`,
  description: description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: {
    title: `${title} | Ondo Real Estate`,
    description: description,
    type: "article",
    publishedTime: published,
    modifiedTime: modified || published,
    authors: [author],
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | Ondo Real Estate`,
    description: description,
    images: [DEFAULT_OG_IMAGE_URL],
  },
}

export default function PropertyManagementPwaOffline() {
  return (
    <main className="min-h-screen">
      <SEO
        title={title}
        description={description}
        pathname={slug}
        image={`${SITE_URL}/modern-townhouse-garage.png`}
        publishedTime={published}
        modifiedTime={modified}
        author={author}
        section="Product"
        tags={["Product", "Mobile", "Technology"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="Installable, fast, and usable even when the signal drops."
        backgroundImage="/modern-townhouse-garage.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Product</Badge>
            <Badge variant="outline">Mobile</Badge>
            <Badge variant="outline">Technology</Badge>
          </div>

          <div className="not-prose mb-6">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              A progressive web app (PWA) installs like a native app and keeps working when the network does not — which is exactly what you need standing in a basement doing a maintenance inspection.
            </p>

            <h2>What a PWA is</h2>
            <ul>
              <li>Installs to your home screen — no app store required.</li>
              <li>Loads instantly from cache, even on flaky connections.</li>
              <li>One codebase across phone, tablet, and desktop.</li>
            </ul>

            <h2>Why offline matters for property work</h2>
            <ul>
              <li>Log maintenance and photos in a dead-zone unit; it syncs when you reconnect.</li>
              <li>Pull up a lease or tenant record without waiting on a signal.</li>
              <li>No lost data when the connection blips mid-form.</li>
            </ul>

            <h2>How it works under the hood</h2>
            <p>A service worker caches the app shell and data; an offline queue (backed by IndexedDB) holds writes and replays them on reconnect via background sync — so the app feels instant and never blocks your work.</p>

            <h2>Takeaway</h2>
            <p>Field work is offline work. A PWA makes property management installable, fast, and resilient — see the <Link href="/platform">platform</Link> for how Ondo builds it in.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
