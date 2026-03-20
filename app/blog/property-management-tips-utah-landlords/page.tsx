import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/property-management-tips-utah-landlords"
const title = "Property Management Tips for Utah Landlords"
const description = "Essential tips for managing rental properties in Utah's competitive market."
const published = "2024-12-05"
const modified = "2024-12-05"
const author = "Michael Chen"
const category = "Property Management"
const image = "/property-manager-meeting.png"
const keywords = ["Utah landlord tips", "property management Utah", "Utah rental laws", "tenant screening Utah", "Utah Fit Premises Act"]

export const metadata: Metadata = {
  title: `${title} | Ondo Real Estate`,
  description: description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: { title: `${title} | Ondo Real Estate`, description: description, type: "article", publishedTime: published, modifiedTime: modified || published, authors: [author] },
  twitter: { card: "summary_large_image", title: `${title} | Ondo Real Estate`, description: description },
}

export default function PropertyManagementTipsUtahLandlords() {
  return (
    <main className="min-h-screen">
      <SEO title={title} description={description} pathname={slug} image={`${SITE_URL}${image}`} publishedTime={published} modifiedTime={modified} author={author} section={category} tags={keywords} />
      <PageBanner title={title} subtitle="Reduce vacancy, protect your asset, and keep tenants happy." backgroundImage={image} />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Utah</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              Utah's rental market moves fast. Whether you own a single-family rental in Lehi or a multi-unit building in Salt Lake City, these proven tactics help you reduce vacancy, protect your asset, and keep tenants happy.
            </p>

            <h2>Know Utah Landlord-Tenant Law</h2>
            <p>Utah's Fit Premises Act (Utah Code § 57-22) requires landlords to maintain habitable conditions including adequate heating, plumbing, and structural integrity. Violations can allow tenants to withhold rent or terminate their lease. The state also requires a minimum 3-day notice for non-payment of rent before filing an eviction, and 15-day notice for lease violations. Security deposits must be returned within 30 days of move-out with an itemised deduction list.</p>
            <ul>
              <li>Use Utah-specific lease agreements that reference state code — generic templates from other states may be unenforceable</li>
              <li>Document all move-in and move-out conditions with timestamped photos</li>
              <li>Never deduct normal wear and tear from a security deposit</li>
            </ul>

            <h2>Screen Tenants Systematically</h2>
            <p>A poor tenant selection costs more than a month of vacancy. Run a full report: credit (aim for 650+), criminal background, prior eviction history, and income verification (3× monthly rent is a common minimum). Utah Fair Housing laws prohibit discrimination based on race, colour, national origin, sex, religion, disability, and familial status. Apply the same criteria to every applicant.</p>
            <ul>
              <li>Use a written rental application and keep records for at least 3 years</li>
              <li>Call previous landlords — not just the current one (who may be motivated to give a glowing reference to move a problem tenant)</li>
              <li>Verify employment with a pay stub and a direct call to HR</li>
            </ul>

            <h2>Reduce Vacancy with Smart Leasing Timing</h2>
            <p>Utah rental demand peaks in May–August, driven by the academic calendar (BYU, UVU, U of U) and corporate relocation cycles tied to Silicon Slopes hiring. Structuring leases to expire in spring or early summer maximises your applicant pool. If you have a December expiry, consider a short-term renewal to shift it to spring rather than listing in the slow winter window.</p>

            <h2>Maintain Proactively — Not Reactively</h2>
            <p>Utah's climate creates specific maintenance cycles: freeze-thaw cycles stress foundations and pipes; the hot, dry summers accelerate HVAC wear; and dust from inversions clogs filters faster than the national average. Build a maintenance calendar:</p>
            <ul>
              <li><strong>Spring:</strong> HVAC service, irrigation activation, roof inspection after snow load</li>
              <li><strong>Summer:</strong> Exterior paint, fence, landscaping, gutter cleaning</li>
              <li><strong>Fall:</strong> Furnace tune-up, pipe insulation, weatherstripping, dryer vent cleaning</li>
              <li><strong>Winter:</strong> Ice dam prevention, monitor for frozen pipes in crawl spaces</li>
            </ul>
            <p>Budget 1–1.5% of property value annually for maintenance on homes built after 2000; 1.5–2% for older stock.</p>

            <h2>Use a Property Management Platform</h2>
            <p>Manual rent collection, maintenance tracking, and owner reporting is a time sink that grows nonlinearly with every unit you add. Modern PM software automates rent reminders, late fees, maintenance dispatch, and monthly statements. Owners who use a platform typically see 10–15% lower maintenance costs (faster response = smaller repairs) and significantly faster lease-up times from better prospective tenant communication.</p>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/property-management">Explore Full-Service PM</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/property-management/tenant-screening">How We Screen Tenants</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </main>
  )
}
