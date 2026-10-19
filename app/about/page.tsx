import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { ChatGptBrandIcon, ClaudeBrandIcon } from "@/components/ai-assistant-brand-icons"
import { generateBreadcrumbJsonLd, generateServiceJsonLd } from "@/lib/seo"
import { SITE_ADDRESS, SITE_URL, SITE_CLAUDE_ASK_ONDO_URL, SITE_CHATGPT_REFERRAL_URL, pageTitle } from "@/lib/site"
import { FOUNDED_YEAR, UTAH_CITIES_SERVED } from "@/lib/social-proof-stats"
import { DEFAULT_OG_IMAGE_URL, pageCanonicalMetadata } from "@/lib/page-canonical"

const DESCRIPTION =
  "Ondo Real Estate is one local team in Lehi, Utah for rentals, property management, buying, selling, home loans and remote online notary."

export const metadata: Metadata = pageCanonicalMetadata("/about", {
  title: pageTitle("About Ondo Real Estate"),
  description: DESCRIPTION,
})

const services = [
  { name: "Rent", href: "/properties/", line: "Homes we manage across the Wasatch Front, with online applications and a tenant portal." },
  { name: "Buy", href: "/buy/", line: "An agent who searches with you, writes the offer and gets you to the keys." },
  { name: "Sell", href: "/sell/", line: "A pricing analysis, professional photos, the MLS and negotiation through close." },
  { name: "Manage", href: "/property-management/", line: "Leasing, rent, maintenance and monthly statements for a percentage of collected rent." },
  { name: "Loans", href: "/loans/", line: "A real conversation about which program fits your file, before you shop." },
  { name: "Notary", href: "/notary/", line: "Remote online notarization by video, accepted in every state." },
]

const howWeWork = [
  { title: "One person answers for the result", body: "Ondo is founder-run. The person you talk to on day one is the one you call when something is off." },
  { title: "You can see everything", body: "Owners get a portal with every dollar, repair and lease. Tenants get one place to pay and report." },
  { title: "Fees you can leave", body: "Management is a percentage of collected rent, with no setup fee and 30 days' notice to cancel." },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="About Ondo Real Estate"
        description={DESCRIPTION}
        pathname="/about"
        image={DEFAULT_OG_IMAGE_URL}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "About", url: `${SITE_URL}/about` },
          ]),
          generateServiceJsonLd({
            name: "Real estate services in Utah",
            description: "Rentals, property management, buying, selling, home loans and remote online notarization in Utah.",
            serviceType: "Real Estate Services",
            areaServed: "Utah",
          }),
        ]}
      />
      <PageBanner
        title="One local team, five services"
        subtitle={`Rent, buy, sell, manage, finance or notarize with the same people in Lehi, Utah, since ${FOUNDED_YEAR}.`}
        backgroundImage="/modern-office-building.webp"
      />

      <section className="bg-background py-16" aria-labelledby="about-services-heading">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 id="about-services-heading" className="mb-8 text-center text-3xl font-bold text-foreground">
            What we do
          </h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <li key={service.href} className="rounded-lg border border-border bg-card p-5">
                <Link href={service.href} className="text-lg font-semibold text-primary underline-offset-4 hover:underline">
                  {service.name}
                </Link>
                <p className="mt-1 text-sm text-foreground/70">{service.line}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-foreground/70">
            We work in {UTAH_CITIES_SERVED} cities across Salt Lake, Utah, Davis and Weber counties.{" "}
            <Link href="/locations/" className="font-medium text-primary underline-offset-4 hover:underline">
              See the city guides
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="border-y border-border/40 bg-muted/30 py-16" aria-labelledby="about-how-heading">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 id="about-how-heading" className="mb-8 text-center text-3xl font-bold text-foreground">
            How we work
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {howWeWork.map((item) => (
              <div key={item.title}>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-foreground/70">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16" aria-labelledby="about-founder-heading">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 id="about-founder-heading" className="mb-4 text-3xl font-bold text-foreground">
            Who runs Ondo
          </h2>
          <p className="text-lg text-foreground/70">
            Ondo Real Estate is founded and run by Pranay Reddy Aleti, a software engineer who became a Utah
            homeowner and landlord. The office is at {SITE_ADDRESS}.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/contact/">Contact us</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/founders-letter/">Read the founder&apos;s letter</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/licensing/">Licensing and disclosures</Link>
            </Button>
          </div>
          <p className="mt-10 text-sm text-foreground/60">
            Checking us out in an AI assistant? Ask{" "}
            <a href={SITE_CLAUDE_ASK_ONDO_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline">
              <ClaudeBrandIcon className="h-4 w-4" />
              Claude
            </a>{" "}
            or{" "}
            <a href={SITE_CHATGPT_REFERRAL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline">
              <ChatGptBrandIcon className="h-4 w-4" />
              ChatGPT
            </a>{" "}
            about Ondo Real Estate.
          </p>
        </div>
      </section>
    </main>
  )
}
