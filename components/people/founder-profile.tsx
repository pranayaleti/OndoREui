import Image from "next/image"
import Link from "next/link"
import SEO from "@/components/seo"
import { Button } from "@/components/ui/button"
import { founderPersonJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo"
import {
  NMLS_CONSUMER_ACCESS_URL,
  SITE_ADDRESS_CITY,
  SITE_BROKERAGE_NAME,
  SITE_CALENDLY_URL,
  SITE_COMPANY_NMLS_ID,
  SITE_LENDER_NAME,
  SITE_LOAN_OFFICER,
  SITE_RE_LICENSE_NUMBER,
  SITE_URL,
} from "@/lib/site"
import { FOUNDED_MONTH_LABEL, FOUNDED_YEAR } from "@/lib/social-proof-stats"
import { FOUNDER_PROFILE_PATH, founderRoleLabel, getFounder } from "@/lib/team-data"
import { toAbsoluteSiteUrl } from "@/lib/url"

/** Bump when the profile's wording changes; surfaces as dateModified on the ProfilePage. */
const modified = "2026-10-18"

export const FOUNDER_PROFILE_DESCRIPTION =
  "Pranay Reddy Aleti founded Ondo Real Estate in Lehi, Utah, in July 2022: a software engineer turned Utah landlord building simpler property management."

/** Name first so the page ranks for searches on the name; license titles join once licensing is live. */
export function founderProfileTitle(live: boolean): string {
  return live
    ? "Pranay Reddy Aleti: Utah Real Estate Agent & Loan Officer"
    : "Pranay Reddy Aleti: Founder of Ondo Real Estate"
}

const SERVICES = [
  { href: "/property-management/", label: "Property management", detail: "Full-service management with owner and tenant portals." },
  { href: "/buy/", label: "Buying a home", detail: "Search, offers and closing on the Wasatch Front." },
  { href: "/sell/", label: "Selling a home", detail: "Pricing, prep and listing." },
  { href: "/loans/", label: "Home loans", detail: "Conventional, FHA, VA and USDA, explained." },
]

const heading = "text-2xl font-bold text-foreground"
const body = "mt-4 text-lg leading-relaxed text-foreground/80"
const inlineLink = "font-semibold text-primary underline underline-offset-4 hover:text-primary/80"

export function FounderProfile({ live }: { live: boolean }) {
  const founder = getFounder()
  const canonical = toAbsoluteSiteUrl(FOUNDER_PROFILE_PATH)
  const title = founderProfileTitle(live)
  const image = founder.image ?? "/founder-image.webp"

  // ProfilePage is a WebPage subtype; the array type keeps <SEO> from adding a second WebPage block.
  const profilePageJsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "ProfilePage"],
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: title,
    description: FOUNDER_PROFILE_DESCRIPTION,
    dateModified: modified,
    inLanguage: "en-US",
    mainEntity: founderPersonJsonLd(live),
  }

  return (
    <main className="min-h-screen bg-background dark:bg-transparent" aria-labelledby="founder-profile-heading">
      <SEO
        title={title}
        description={FOUNDER_PROFILE_DESCRIPTION}
        pathname={FOUNDER_PROFILE_PATH}
        image={toAbsoluteSiteUrl(image)}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "About", url: `${SITE_URL}/about/` },
            { name: "Team", url: `${SITE_URL}/about/team/` },
            { name: founder.name, url: canonical },
          ]),
          profilePageJsonLd,
        ]}
      />
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-primary">
            <Image
              src={image}
              alt={`${founder.name}, founder of Ondo Real Estate, professional headshot`}
              fill
              priority
              sizes="128px"
              className="object-cover"
            />
          </div>
          <div>
            <h1 id="founder-profile-heading" className="text-4xl font-bold text-foreground md:text-5xl">
              {founder.name}
            </h1>
            <p className="mt-2 text-lg text-primary">{founderRoleLabel(live)}</p>
            <p className="mt-1 text-foreground/70">{SITE_ADDRESS_CITY}, Utah</p>
          </div>
        </div>

        <section aria-labelledby="profile-about-heading" className="mt-12">
          <h2 id="profile-about-heading" className={heading}>
            About
          </h2>
          <p className={body}>
            I spent over a decade as a full stack software engineer before I bought my first home in Utah in 2019.
            That house led to rental property of my own, and the rentals led to Ondo. I started OndoSoft, my software
            consultancy, in May 2022 and founded Ondo Real Estate in {FOUNDED_MONTH_LABEL} {FOUNDED_YEAR}.
          </p>
          <p className={body}>
            I still own and manage rental property myself, so I deal with the same repair calls, lease questions and
            year-end paperwork our owners do. The goal is simple. Owning rental property should not be a second job,
            and renting a home should feel fair and easy.
          </p>
          <p className="mt-4">
            <Link href="/founders-letter/" className={inlineLink}>
              Read the founder&apos;s letter
            </Link>
          </p>
        </section>

        <section aria-labelledby="profile-services-heading" className="mt-12">
          <h2 id="profile-services-heading" className={heading}>
            How I can help
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <li key={service.href} className="rounded-lg border border-border bg-card p-4">
                <Link href={service.href} className="font-semibold text-foreground hover:text-primary">
                  {service.label}
                </Link>
                <p className="mt-1 text-sm text-foreground/70">{service.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="profile-area-heading" className="mt-12">
          <h2 id="profile-area-heading" className={heading}>
            Where I work
          </h2>
          <p className={body}>{(founder.areaServed ?? []).join(", ")}, across Utah&apos;s Wasatch Front.</p>
        </section>

        <section
          aria-labelledby="profile-licensing-heading"
          className="mt-12 rounded-xl border border-border bg-card p-6"
        >
          <h2 id="profile-licensing-heading" className={heading}>
            Licensing
          </h2>
          {live ? (
            <ul className="mt-4 space-y-2 text-foreground/80">
              <li>
                Utah real estate sales agent, license #{SITE_RE_LICENSE_NUMBER}, with {SITE_BROKERAGE_NAME}.
              </li>
              <li>
                Loan officer, NMLS #{SITE_LOAN_OFFICER.nmlsId}, with {SITE_LENDER_NAME} (NMLS #{SITE_COMPANY_NMLS_ID}).{" "}
                <a href={NMLS_CONSUMER_ACCESS_URL} target="_blank" rel="noopener noreferrer" className={inlineLink}>
                  Verify at NMLS Consumer Access
                </a>
              </li>
            </ul>
          ) : (
            <p className="mt-4 text-foreground/80">
              Real estate and mortgage licensing is in progress. License titles and numbers will be listed here once
              active.
            </p>
          )}
          <p className="mt-4 text-sm">
            <Link href="/licensing/" className={inlineLink}>
              Licensing &amp; disclosures
            </Link>
          </p>
        </section>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <a href={SITE_CALENDLY_URL} target="_blank" rel="noopener noreferrer">
              Book a 30-minute call
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact/">Contact Ondo</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
