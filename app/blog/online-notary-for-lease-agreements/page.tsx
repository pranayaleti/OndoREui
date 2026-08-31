import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/online-notary-for-lease-agreements"
const title = "Online Notary for Lease Agreements: What Landlords Need to Know"
const description = "When a lease needs notarization, how remote online notarization (RON) works, and what makes it legally sound across states."
const published = "2026-07-24"
const modified = "2026-07-24"
const author = "ONDO Team"

const keywords = [
  "online notary rental agreement",
  "notarize lease online",
  "remote online notarization lease",
  "RON landlord",
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

export default function OnlineNotaryForLeaseAgreements() {
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
        section="Notary"
        tags={["Notary", "Leasing", "Legal"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="Sign and notarize from anywhere — with an audit trail that holds up."
        backgroundImage="/modern-office-building.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Notary</Badge>
            <Badge variant="outline">Leasing</Badge>
            <Badge variant="outline">Legal</Badge>
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
              Most residential leases do not require notarization, but many landlord documents do — and remote online notarization (RON) makes that step painless and defensible.
            </p>

            <h2>When notarization matters</h2>
            <ul>
              <li>Long-term or recorded leases, memoranda of lease, and some addenda.</li>
              <li>Property transfer, power-of-attorney, and financing documents.</li>
              <li>Anywhere a signature must be independently verified against fraud.</li>
            </ul>

            <h2>How RON works</h2>
            <p>A commissioned notary meets the signer over secure video, verifies ID with knowledge-based checks and credential analysis, witnesses the signature, and seals it — producing a tamper-evident record and full audit trail.</p>

            <h2>What makes it hold up</h2>
            <ul>
              <li>Identity proofing (KBA + ID verification).</li>
              <li>A recorded session and tamper-evident seal.</li>
              <li>State commissioning and compliant record retention.</li>
            </ul>

            <h2>Takeaway</h2>
            <p>Know which of your documents truly need a notary, then handle them online with a proper audit trail. Learn more about <Link href="/blog/remote-online-notary-real-estate-closings">RON for real estate closings</Link> and <Link href="/blog/prepare-for-remote-online-notary-session">how to prepare for a session</Link>.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
