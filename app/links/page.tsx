import { Fragment } from "react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ChevronRight, Mail, MessageSquare, Phone } from "lucide-react"
import { EqualHousingIcon, socialPlatformFor } from "@/components/social-icons"
import { analyticsAttributes } from "@/lib/analytics"
import { LINKS_PAGE_INTRO, LINKS_PAGE_SECTIONS, linksPageSocials, type LinksPageLink } from "@/lib/links-page"
import { SITE_EMAILS, SITE_NAME, SITE_PHONE, SITE_URL, pageTitle } from "@/lib/site"

const canonical = `${SITE_URL}/links/`
const description =
  "Meet the founder of Ondo Real Estate in Lehi, Utah. Book a free call, get a rent estimate, browse homes, or read his story. Every Ondo link in one place."
const ogImage = `${SITE_URL}/modern-office-building.webp`

export const metadata: Metadata = {
  title: pageTitle("Links"),
  description,
  alternates: { canonical },
  // Built for taps from social bios. As a search result it would be a thin copy of the homepage.
  robots: { index: false, follow: true },
  openGraph: {
    title: SITE_NAME,
    description,
    url: canonical,
    images: [{ url: ogImage, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description,
    images: [ogImage],
  },
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

function isOffSite(href: string) {
  return !href.startsWith("/")
}

function LinkLabel({ link }: { link: LinksPageLink }) {
  const Arrow = isOffSite(link.href) ? ArrowUpRight : ChevronRight
  return (
    <>
      <span>
        {link.label}
        {isOffSite(link.href) ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </span>
      <Arrow className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
    </>
  )
}

/** Site paths stay in this tab: AttributionCapture's sessionStorage (and the UTMs in it) does not follow a new tab. */
function PageLink({ link, className }: { link: LinksPageLink; className: string }) {
  if (isOffSite(link.href)) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" {...analyticsAttributes("links_click", "links_page", link.id)} className={className}>
        <LinkLabel link={link} />
      </a>
    )
  }
  // No prefetch: a visitor taps one of these, so fetching all of them on a phone connection wastes their data.
  return (
    <Link href={link.href} prefetch={false} {...analyticsAttributes("links_click", "links_page", link.id)} className={className}>
      <LinkLabel link={link} />
    </Link>
  )
}

const phoneDigits = SITE_PHONE.replace(/[^+\d]/g, "")

export default function LinksPage() {
  const socials = linksPageSocials().flatMap((href) => {
    const platform = socialPlatformFor(href)
    return platform ? [{ href, ...platform }] : []
  })
  const iconButton = `grid h-11 w-11 place-items-center rounded-full border border-primary/70 bg-card text-foreground/85 transition-colors hover:border-primary hover:bg-primary/10 hover:text-foreground ${focusRing}`
  const contactPill = `inline-flex h-11 items-center gap-2 rounded-full border border-primary/70 bg-card px-5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/10 ${focusRing}`

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-md flex-col px-4 pb-12 pt-10 sm:pt-16">
        <header className="flex flex-col items-center text-center">
          <div className="rounded-full bg-gradient-to-br from-orange-500 to-red-800 p-[3px]">
            <Image
              src="/links-avatar.webp"
              alt="Pranay Reddy Aleti, founder of Ondo Real Estate"
              width={104}
              height={104}
              priority
              className="h-[104px] w-[104px] rounded-full border-[3px] border-background object-cover"
            />
          </div>
          <h1 className="mt-4 font-outfit text-[1.75rem] font-bold leading-tight tracking-tight">{SITE_NAME}</h1>
          <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Buy, sell and finance a home in Utah. Property management and notary too.
          </p>
          <ul className="mt-5 flex flex-wrap justify-center gap-2.5" aria-label="Ondo on social media">
            {socials.map(({ href, name, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ondo on ${name}`}
                  {...analyticsAttributes("social_click", "links_page", name.toLowerCase())}
                  className={iconButton}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </header>

        <section aria-labelledby="links-intro" className="mt-8 rounded-2xl border border-primary/70 bg-card p-5">
          <h2 id="links-intro" className="font-outfit text-lg font-semibold">
            {LINKS_PAGE_INTRO.heading}
          </h2>
          {LINKS_PAGE_INTRO.paragraphs.map((segments, paragraphIndex) => (
            <p key={paragraphIndex} className="mt-2 text-[0.95rem] leading-relaxed text-foreground/85">
              {segments.map((segment, index) =>
                typeof segment === "string" ? (
                  <Fragment key={index}>{segment}</Fragment>
                ) : (
                  <strong key={index} className="font-semibold text-primary">
                    {segment.highlight}
                  </strong>
                ),
              )}
            </p>
          ))}
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Quick facts">
            {LINKS_PAGE_INTRO.facts.map((fact) => (
              <li key={fact} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-foreground">
                {fact}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 flex flex-col gap-8">
          {LINKS_PAGE_SECTIONS.map((section) => {
            const primary = section.links.filter((link) => link.primary)
            const rest = section.links.filter((link) => !link.primary)
            return (
              <section key={section.id} aria-labelledby={`links-${section.id}`}>
                <h2
                  id={`links-${section.id}`}
                  className="mb-2.5 px-1 font-outfit text-[0.95rem] font-semibold text-foreground"
                >
                  {section.heading}
                </h2>
                {primary.map((link) => (
                  <PageLink
                    key={link.id}
                    link={link}
                    className={`mb-3 flex min-h-[3.75rem] items-center justify-between gap-3 rounded-2xl bg-primary px-5 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:brightness-110 ${focusRing}`}
                  />
                ))}
                {rest.length > 0 ? (
                  <ul className="divide-y divide-primary/25 overflow-hidden rounded-2xl border border-primary/70 bg-card">
                    {rest.map((link) => (
                      <li key={link.id}>
                        <PageLink
                          link={link}
                          className="flex min-h-[3.5rem] items-center justify-between gap-3 px-4 py-3 text-[0.95rem] font-medium leading-snug text-foreground transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                        />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            )
          })}
        </div>

        <footer className="mt-12 flex flex-col items-center gap-6 text-center">
          <div className="flex gap-3">
            <a href={`mailto:${SITE_EMAILS.primary}`} aria-label="Email Ondo" {...analyticsAttributes("contact_click", "links_page", "email")} className={contactPill}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              Email
            </a>
            <a
              href={`tel:${phoneDigits}`}
              aria-label="Call Ondo"
              {...analyticsAttributes("contact_click", "links_page", "call")}
              className={contactPill}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call
            </a>
            <a href={`sms:${phoneDigits}`} aria-label="Text Ondo" {...analyticsAttributes("contact_click", "links_page", "text")} className={contactPill}>
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              Text
            </a>
          </div>

          <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <EqualHousingIcon className="h-4 w-4" />
              <span>Equal Housing Opportunity. Equal Housing Lender.</span>
            </p>
            <p>{SITE_NAME}, Lehi, Utah. NMLS ID on file.</p>
            <p className="flex justify-center gap-4">
              <Link
                href="/licensing/"
                prefetch={false}
                {...analyticsAttributes("links_click", "links_page", "licensing")}
                className="underline underline-offset-4 hover:text-foreground"
              >
                Licensing
              </Link>
              <Link
                href="/privacy-policy/"
                prefetch={false}
                {...analyticsAttributes("links_click", "links_page", "privacy")}
                className="underline underline-offset-4 hover:text-foreground"
              >
                Privacy
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
