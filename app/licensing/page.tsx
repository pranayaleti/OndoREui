// NOTE(i18n): server component, licensing disclosures are intentionally English-only.
// Legal copy translation requires jurisdiction-specific counsel review; the en
// page is authoritative until then. Reviewed by the license-compliance-guard
// agent — do not add specific NMLS IDs or brokerage license numbers inline;
// the platform-wide convention is "NMLS ID on file" (see public/index.md and
// the calculator disclosures).
import type { Metadata } from "next"
import Link from "next/link"
import { Building2, Landmark, ScrollText, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import {
  SITE_URL,
  SITE_NAME,
  SITE_EMAILS,
  SITE_PHONE,
  SITE_ADDRESS_STREET,
  SITE_ADDRESS_CITY,
  SITE_ADDRESS_REGION,
  SITE_ADDRESS_POSTAL_CODE,
} from "@/lib/site"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

const title = `Licensing & Disclosures | ${SITE_NAME}`
const description =
  "Real estate brokerage, property management, and mortgage licensing disclosures for Ondo Real Estate. Equal Housing Lender / Equal Housing Opportunity."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}/licensing/` },
  openGraph: { title, description, url: `${SITE_URL}/licensing/`, images: DEFAULT_OG_IMAGES },
  twitter: { card: "summary_large_image", title, description, images: [DEFAULT_OG_IMAGE_URL] },
  robots: { index: true, follow: true },
}

export default function LicensingPage() {
  const lastUpdated = "August 25, 2026"

  return (
    <main className="min-h-screen">
      <SEO
        title={title}
        description={description}
        pathname="/licensing"
        image={`${SITE_URL}/modern-office-building.webp`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Licensing", url: `${SITE_URL}/licensing` },
        ])}
      />
      <PageBanner
        title="Licensing & Disclosures"
        subtitle="Who we are, how we're licensed, and how to verify each line of business"
        backgroundImage="/modern-office-building.webp"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="text-sm text-foreground/70">
                Last updated: <strong>{lastUpdated}</strong>
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-foreground/70">
                Ondo Real Estate offers multiple regulated services under one
                brand. Each line of business is licensed separately. This page
                summarizes those disclosures and points you to the state
                registries where you can verify every one of them.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-primary" aria-hidden="true" />
                    Real estate brokerage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-foreground/80">
                  <p>
                    Brokerage services (buyer representation, seller
                    representation, and listing services) are provided by
                    licensed Ondo Real Estate agents under the supervision of
                    the principal broker. License numbers are available on
                    request and are also on file with the Utah Division of
                    Real Estate.
                  </p>
                  <p>
                    <strong>Equal Housing Opportunity.</strong> Ondo Real
                    Estate supports the Fair Housing Act. We do not
                    discriminate on the basis of race, color, religion, sex,
                    handicap, familial status, or national origin.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Landmark className="h-6 w-6 text-primary" aria-hidden="true" />
                    Mortgage &amp; lending
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-foreground/80">
                  <p>
                    Loan information is provided by {SITE_NAME} (NMLS ID on
                    file). Any calculators, estimates, or examples shown on
                    this site are <strong>not a commitment to lend</strong>, a
                    loan approval, or an offer of credit. Rates, terms, and
                    payments are estimates for illustration only, are not a
                    quote, and are subject to credit approval, underwriting,
                    and market conditions.
                  </p>
                  <p>
                    <strong>Equal Housing Lender.</strong> Verify the current
                    NMLS registration for {SITE_NAME} and any individual loan
                    originator on{" "}
                    <a
                      href="https://www.nmlsconsumeraccess.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-4 hover:text-primary/80"
                    >
                      NMLS Consumer Access
                    </a>
                    .
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
                    Property management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-foreground/80">
                  <p>
                    Property management services are provided in Utah under
                    the principal broker&rsquo;s supervision by licensed real
                    estate agents and brokers. Utah&rsquo;s separate property
                    manager license, created by the Utah Real Estate Licensing
                    and Practices Act and amended in the 2026 general session,
                    becomes available January 1, 2027; Ondo will hold that
                    credential as required once the Division of Real Estate
                    finalizes its rules. Fees, contract terms, and
                    cancellation policies are published on our{" "}
                    <Link
                      href="/pricing"
                      className="text-primary underline underline-offset-4 hover:text-primary/80"
                    >
                      pricing page
                    </Link>
                    .
                  </p>
                  <p>
                    Tenant screening is applied consistently across applicants
                    against documented criteria and in accordance with the
                    Fair Housing Act and HUD guidance on the use of criminal
                    records.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <ScrollText className="h-6 w-6 text-primary" aria-hidden="true" />
                    Notary services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-foreground/80">
                  <p>
                    Notary and remote online notarization (RON) services are
                    performed by commissioned notaries public. Utah notary
                    commissions are issued by the Utah Lieutenant Governor and
                    are searchable on the state&rsquo;s notary registry.
                    Notary services are separate from and do not constitute
                    legal advice.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-10">
              <CardHeader>
                <CardTitle>Trade name &amp; business identity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-foreground/80">
                <p>
                  <strong>{SITE_NAME}</strong>
                  <br />
                  {SITE_ADDRESS_STREET}
                  <br />
                  {SITE_ADDRESS_CITY}, {SITE_ADDRESS_REGION}{" "}
                  {SITE_ADDRESS_POSTAL_CODE}
                </p>
                <p>
                  Compliance questions:{" "}
                  <a
                    href={`mailto:${SITE_EMAILS.legal}`}
                    className="text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    {SITE_EMAILS.legal}
                  </a>
                  {" \u00b7 "}
                  <a
                    href={`tel:${SITE_PHONE.replace(/[^+\d]/g, "")}`}
                    className="text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    {SITE_PHONE}
                  </a>
                </p>
              </CardContent>
            </Card>

            <div className="mt-12 text-center">
              <p className="text-foreground/70 mb-6">
                For jurisdiction-specific questions about a brokerage, lending,
                or property management transaction, please contact us before
                relying on marketing copy on this site.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button asChild>
                  <Link href="/contact">Contact compliance</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/privacy-policy">Read privacy policy</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
