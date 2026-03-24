import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/site"
import Link from "next/link"
import type { Metadata } from "next"

const slug = "/blog/utah-landlord-tenant-law-guide"
const title = "Utah Landlord-Tenant Law: What Every Property Owner Must Know"
const description = "A practical guide to Utah rental laws in 2026 — security deposits, eviction timelines, habitability standards, and Fair Housing requirements."
const published = "2026-03-23"
const modified = "2026-03-23"
const author = "Ondo RE Team"
const category = "Legal"
const image = "/property-manager-meeting.png"
const keywords = [
  "Utah landlord tenant law",
  "Utah rental laws 2026",
  "Utah eviction process",
  "Utah security deposit law",
  "Fit Premises Act Utah",
  "Utah Fair Housing",
]

export const metadata: Metadata = {
  title: `${title} | Ondo RE`,
  description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: {
    title: `${title} | Ondo RE`,
    description,
    type: "article",
    publishedTime: published,
    modifiedTime: modified,
    authors: [author],
  },
  twitter: { card: "summary_large_image", title: `${title} | Ondo RE`, description },
}

export default function UtahLandlordTenantLawGuide() {
  return (
    <main className="min-h-screen">
      <SEO
        title={title}
        description={description}
        pathname={slug}
        image={`${SITE_URL}${image}`}
        publishedTime={published}
        modifiedTime={modified}
        author={author}
        section={category}
        tags={keywords}
      />
      <PageBanner
        title={title}
        subtitle="Know your rights and obligations before a dispute arises."
        backgroundImage={image}
      />
      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">{category}</Badge>
            <Badge variant="outline">Utah</Badge>
            <Badge variant="outline">Landlords</Badge>
          </div>
          <div className="not-prose mb-6">
            <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-6">
              Utah landlord-tenant law sits in the Utah Code under Title 57 (Real Property). Violations — even unintentional ones — can expose you to liability, voided lease clauses, or tenant remedies including rent withholding. Here is what every Utah property owner must know in 2026.
            </p>

            <h2>The Utah Fit Premises Act (Utah Code § 57-22)</h2>
            <p>Utah landlords are legally required to maintain rental properties in a habitable condition. Under the Fit Premises Act, this means:</p>
            <ul>
              <li>Adequate weatherproofing, including roof, walls, windows, and doors</li>
              <li>Functional plumbing, hot and cold running water, and a working sewage system</li>
              <li>Heating capable of maintaining 68°F during winter months</li>
              <li>Electrical systems in good and safe working order</li>
              <li>Common areas kept clean and structurally safe</li>
              <li>No infestation of insects or rodents</li>
            </ul>
            <p>If a landlord fails to address a habitability issue after written notice, a tenant may have the right to repair and deduct, withhold rent into an escrow account, or terminate the lease without penalty. Document every maintenance request and your response with timestamps — this is your best protection against disputes.</p>

            <h2>Security Deposits</h2>
            <p>Utah does not cap the amount a landlord can charge as a security deposit. However, the rules for returning it are strict:</p>
            <ul>
              <li><strong>Return timeline:</strong> 30 days after the tenant vacates and returns the keys</li>
              <li><strong>Itemized deductions:</strong> Any deductions must be accompanied by a written, itemized list explaining what was deducted and why</li>
              <li><strong>Normal wear and tear:</strong> Cannot be deducted — only damage beyond normal use qualifies</li>
              <li><strong>Penalty for non-compliance:</strong> Tenants can sue for the deposit amount plus damages</li>
            </ul>
            <p>Take dated photos at move-in and move-out. Use a written move-in inspection form signed by the tenant. This documentation is your defense if a deposit deduction is contested.</p>

            <h2>Eviction Process in Utah</h2>
            <p>Utah has a relatively landlord-friendly eviction process, but strict procedural compliance is required. There are no shortcuts:</p>
            <ul>
              <li><strong>Non-payment of rent:</strong> 3-day notice to pay or vacate (Utah Code § 78B-6-802)</li>
              <li><strong>Lease violation:</strong> 3-day notice to cure or quit for material violations</li>
              <li><strong>Month-to-month tenancy termination:</strong> 15-day written notice to vacate</li>
              <li><strong>Fixed-term lease expiration:</strong> No notice required — lease ends on the agreed date</li>
            </ul>
            <p>After the notice period, if the tenant has not complied, you may file an Unlawful Detainer action in the local circuit court. Utah's courts move relatively quickly — a hearing is typically set within 10–14 days. However, a single procedural error (improper service, incorrect notice language, wrong statutory cite) can reset the process.</p>
            <p>Never attempt a "self-help" eviction — changing locks, removing belongings, or shutting off utilities to force a tenant out. This is illegal in Utah and exposes you to significant liability.</p>

            <h2>Required Lease Disclosures</h2>
            <p>Utah law requires certain disclosures in or alongside a rental agreement:</p>
            <ul>
              <li>Owner or authorized agent name and address for receiving notices and process of service</li>
              <li>Disclosure of any known lead-based paint hazards (federal requirement for pre-1978 properties)</li>
              <li>Mold disclosure if any mold condition is known</li>
              <li>Methamphetamine contamination history if applicable (Utah Code § 57-27)</li>
            </ul>

            <h2>Utah Fair Housing Requirements</h2>
            <p>Both federal Fair Housing Act (FHA) and the Utah Fair Housing Act prohibit discrimination based on:</p>
            <ul>
              <li>Race, color, national origin</li>
              <li>Sex, including gender identity and sexual orientation (per HUD guidance)</li>
              <li>Religion</li>
              <li>Disability (physical or mental) — you must also allow reasonable accommodations</li>
              <li>Familial status (families with children under 18)</li>
            </ul>
            <p>Apply the same screening criteria — income ratio, credit threshold, eviction history — to every applicant in the same property. Keep records of every application decision for at least 3 years. A complaint to the Utah Antidiscrimination and Labor Division (UALD) or HUD can trigger an investigation even if your intent was not discriminatory.</p>

            <h2>Rent Increases and Notice Requirements</h2>
            <p>Utah has no rent control. Landlords may raise rent to any amount, but must provide proper notice:</p>
            <ul>
              <li><strong>Month-to-month tenancy:</strong> 15 days' written notice before the next rental period</li>
              <li><strong>Fixed-term lease:</strong> Cannot increase during the lease term unless the lease explicitly allows it</li>
            </ul>

            <h2>Entry Rights</h2>
            <p>Utah law requires landlords to give reasonable notice before entering a tenant's unit — generally interpreted as 24 hours. Exceptions include genuine emergencies. Include your entry notice policy in the lease agreement to prevent misunderstandings.</p>

            <div className="not-prose my-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/property-management">Let Ondo RE Handle Compliance</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/faq/owner-faqs">Owner FAQ</Link>
              </Button>
            </div>

            <p>Managing Utah rental law compliance across multiple properties is one of the strongest arguments for professional <Link href="/property-management">property management</Link>. Ondo RE stays current on Utah statutory changes, uses Utah-specific lease agreements, and handles all required notices and disclosures on your behalf. <Link href="/contact">Contact us</Link> to discuss how we protect your investment.</p>
          </div>
        </div>
      </article>
    </main>
  )
}
