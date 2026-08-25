import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SITE_URL } from "@/lib/site"

const slug = "/blog/real-estate-agents-manage-own-rentals"
const title = "Why Real Estate Agents Should Manage Their Own Rentals"
const description = "Agents already have the market data, network, and licensing edge — here is why self-managing your rentals compounds that advantage."
const published = "2026-07-24"
const modified = "2026-07-24"
const author = "ONDO Team"

const keywords = [
  "real estate agent property manager",
  "agent manage own rentals",
  "realtor rental income",
  "property management for agents",
]

import type { Metadata } from "next"

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
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | Ondo Real Estate`,
    description: description,
  },
}

export default function RealEstateAgentsManageOwnRentals() {
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
        section="For Agents"
        tags={["For Agents", "Investing", "Strategy"]}
        keywords={keywords}
      />

      <PageBanner
        title={title}
        subtitle="Your license is an asset — put it to work on your own doors."
        backgroundImage="/modern-office-building.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">For Agents</Badge>
            <Badge variant="outline">Investing</Badge>
            <Badge variant="outline">Strategy</Badge>
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
              Real estate agents are uniquely positioned to manage rentals: you already read markets, run comps, and know the paperwork. Handing that to a third party leaves money and control on the table.
            </p>

            <h2>The edge you already have</h2>
            <ul>
              <li><strong>Market data:</strong> you price units from real comps, not guesswork.</li>
              <li><strong>Network:</strong> vendors, lenders, and tenants are a text away.</li>
              <li><strong>Licensing:</strong> you understand disclosures, leases, and fair-housing rules.</li>
            </ul>

            <h2>What self-management captures</h2>
            <ul>
              <li>The 8–10% management fee stays in your pocket.</li>
              <li>Direct tenant relationships → faster renewals and fewer surprises.</li>
              <li>Portfolio insight that makes you a better buyer's agent for investor clients.</li>
            </ul>

            <h2>Where the friction usually is</h2>
            <p>The reason agents outsource is operations — rent collection, maintenance tickets, accounting. That is exactly the part software should carry. With <Link href="/calculators/cash-on-cash">the numbers modeled</Link> and the busywork automated, self-management becomes a few minutes a month, not a second job.</p>

            <h2>Takeaway</h2>
            <p>You have the hardest parts — market knowledge and licensing — already. Automate the operations and keep the fee, the data, and the relationship. See how the platform is <Link href="/vs/turbotenant">built for the agent-plus-manager</Link> workflow.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
