import { ArticleShell, articleMetadata } from "@/components/content/article-shell"
import Link from "next/link"
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

export const metadata = articleMetadata({
  path: slug,
  title,
  description,
  published,
  modified,
  author,
  keywords,
  category: "For Renters",
})

export default function TenantRightsChecklist() {
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
        category: "For Renters",
        bannerSubtitle: "Know your protections before you need them.",
      }}
    >
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
          
    </ArticleShell>
  )
}

