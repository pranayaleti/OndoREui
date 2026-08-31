import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/switch-from-turbotenant-migration-guide"
const title = "How to Switch from TurboTenant: A Step-by-Step Migration Guide"
const description = "Move off TurboTenant without losing data or disrupting tenants — a checklist for exporting, importing, and cutting over cleanly."
const published = "2026-07-24"
const modified = "2026-07-24"
const author = "ONDO Team"

const keywords = [
  "switch from TurboTenant",
  "TurboTenant migration",
  "export TurboTenant data",
  "TurboTenant alternative free",
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

export default function SwitchFromTurbotenantMigrationGuide() {
  return (
    <main className="min-h-screen">
      <SEO
        title={title}
        description={description}
        pathname={slug}
        image={`${SITE_URL}/modern-office-building.png`}
        publishedTime={published}
        modifiedTime={modified}
        author={author}
        section="Migration"
        tags={["Migration", "Software", "Guide"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="A clean cutover — no lost records, no confused tenants."
        backgroundImage="/modern-office-building.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Migration</Badge>
            <Badge variant="outline">Software</Badge>
            <Badge variant="outline">Guide</Badge>
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
              Switching platforms feels risky, but a staged cutover keeps your data intact and your tenants informed. Here is the checklist to move off TurboTenant without the pain.
            </p>

            <h2>1. Export your data</h2>
            <ul>
              <li>Tenant and lease details, contact info, and balances.</li>
              <li>Payment history and any stored documents.</li>
              <li>Maintenance records and vendor contacts.</li>
            </ul>

            <h2>2. Import and verify</h2>
            <ul>
              <li>Load properties, units, and tenants into the new platform.</li>
              <li>Reconcile balances against your last statement before go-live.</li>
              <li>Re-upload leases and key documents.</li>
            </ul>

            <h2>3. Cut over cleanly</h2>
            <ul>
              <li>Pick a rent-cycle boundary so no payment falls between systems.</li>
              <li>Send tenants a short notice with the new payment link and login.</li>
              <li>Keep the old account read-only for one cycle as a backstop.</li>
            </ul>

            <h2>Takeaway</h2>
            <p>Export, reconcile, then cut over on a clean date — that is the whole trick. Compare where you are landing first: <Link href="/vs/turbotenant">Ondo vs TurboTenant</Link> and the <Link href="/blog/turbotenant-vs-buildium-vs-ondo">three-way honest comparison</Link>.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
