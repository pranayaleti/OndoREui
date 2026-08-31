import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/tenant-rights-checklist"
const title = "Tenant Rights Checklist: What Every Renter Should Know"
const description = "A practical checklist of core renter protections — deposits, repairs, entry notice, and how to document issues."
const published = "2026-07-24"
const modified = "2026-07-24"
const author = "ONDO Team"

const keywords = [
  "tenant rights checklist",
  "renter rights",
  "security deposit rights",
  "landlord entry notice",
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

export default function TenantRightsChecklist() {
  return (
    <main className="min-h-screen">
      <SEO
        title={title}
        description={description}
        pathname={slug}
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        publishedTime={published}
        modifiedTime={modified}
        author={author}
        section="For Renters"
        tags={["For Renters", "Leasing", "Guide"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="Know your protections before you need them."
        backgroundImage="/modern-apartment-balcony.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">For Renters</Badge>
            <Badge variant="outline">Leasing</Badge>
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
              Tenant protections vary by state and city, but a core set of rights shows up almost everywhere. Knowing them — and documenting — keeps small issues from becoming expensive ones.
            </p>

            <h2>Core rights (most places)</h2>
            <ul>
              <li><strong>Habitability:</strong> a safe, working home — heat, water, and essential repairs.</li>
              <li><strong>Deposit protection:</strong> limits on amount, and a timeline for itemized return.</li>
              <li><strong>Entry notice:</strong> advance notice before a landlord enters, except emergencies.</li>
              <li><strong>Anti-retaliation &amp; fair housing:</strong> protection for asserting your rights.</li>
            </ul>

            <h2>Document everything</h2>
            <ul>
              <li>Photograph the unit at move-in and move-out.</li>
              <li>Put repair requests in writing and keep timestamps.</li>
              <li>Save every payment receipt and written notice.</li>
            </ul>

            <h2>Know your local rules</h2>
            <p>City and state laws vary widely — check your local housing authority for specifics on deposits, notice periods, and rent rules. This is general information, not legal advice.</p>

            <h2>Takeaway</h2>
            <p>A documented tenant is a protected tenant. Ondo is built for both sides of the door — see our <Link href="/tenant">tenant tools</Link> and <Link href="/blog/first-time-home-buyer-guide">first-time buyer guide</Link> when you are ready to own.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
