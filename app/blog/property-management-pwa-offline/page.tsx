import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import Link from "next/link"
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

export const metadata = articleMetadata({
  path: slug,
  title,
  description,
  published,
  modified,
  author,
  keywords,
  category: "Product",
})

export default function PropertyManagementPwaOffline() {
  return (
    <ArticleShell
      meta={{
        path: slug,
        title,
        description,
        published,
        modified,
        author,
        keywords,
        category: "Product",
        bannerSubtitle: "Installable, fast, and usable even when the signal drops.",
      }}
    >
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
          
    </ArticleShell>
  )
}

