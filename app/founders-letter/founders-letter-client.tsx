import Link from "next/link"
import Image from "next/image"
import { User, Building2, Lightbulb, TrendingUp, Handshake, Rocket, Code, Home, Zap, Target } from "lucide-react"
import SEO from "@/components/seo"
import { SITE_ORGANIZATION_ID, founderPersonRef, generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_ADDRESS_CITY, SITE_NAME, SITE_URL } from "@/lib/site"
import { FOUNDED_MONTH_LABEL, FOUNDED_YEAR, UTAH_CITIES_SERVED } from "@/lib/social-proof-stats"
import { FOUNDER_PROFILE_PATH } from "@/lib/team-data"
import { toAbsoluteSiteUrl } from "@/lib/url"

export const FOUNDERS_LETTER_PATH = "/founders-letter/"
/** Carries the brand inside the head term, so pageTitle() does not append it again. */
export const FOUNDERS_LETTER_TITLE = "Founder's Letter: Why I Built Ondo Real Estate"
export const FOUNDERS_LETTER_DESCRIPTION =
  "Pranay Reddy Aleti, a software engineer turned Utah landlord, on why he started Ondo Real Estate in 2022 and what owners and tenants can expect from us."
export const FOUNDER_IMAGE_PATH = "/founder-image.webp"

const FOUNDER_NAME = "Pranay Reddy Aleti"
const FOUNDER_TITLE = `Founder, ${SITE_NAME}`
/** Bump when the letter's wording changes; surfaces as dateModified on the ProfilePage. */
const modified = "2026-10-17"

const FIRST_YEAR_IN_SOFTWARE = 2013
const FIRST_UTAH_HOME_YEAR = 2019

const CORE_VALUES = ["Innovation first", "Client success", "Transparency", "Community focus"]

const BACKGROUND = [
  { title: "Full stack development", detail: "React, Node.js, modern web apps" },
  { title: "Real estate investing", detail: `Utah homeowner since ${FIRST_UTAH_HOME_YEAR}; owns and manages rentals` },
  { title: "Property management", detail: "Owner and tenant relations" },
  { title: "Technology", detail: "AI and automation for property operations" },
]

const RELATED_LINKS = [
  { href: "/about/", label: "About Ondo Real Estate" },
  { href: "/property-management/", label: "How we manage property" },
  { href: "/why-utah/", label: "Why we work in Utah" },
  { href: FOUNDER_PROFILE_PATH, label: "Pranay's full profile" },
]

const TIMELINE = [
  {
    year: String(FIRST_YEAR_IN_SOFTWARE),
    Icon: Code,
    title: "Started in software",
    body: "Full stack engineering: building and scaling the applications businesses run on, and learning what good tools feel like.",
    tags: ["Full stack", "Engineering"],
  },
  {
    year: String(FIRST_UTAH_HOME_YEAR),
    Icon: Home,
    title: "First home in Utah",
    body: "Bought a house, learned the process the hard way, then started helping friends and family buy homes and place tenants.",
    tags: ["First home", "Utah market"],
  },
  {
    year: String(FOUNDED_YEAR),
    Icon: Zap,
    title: "The launch",
    body: `Started OndoSoft in May and founded Ondo Real Estate in ${FOUNDED_MONTH_LABEL}, then began building the platform behind this site.`,
    tags: ["Ondo launch", "Tech + RE"],
  },
  {
    year: "Now",
    Icon: Target,
    title: "Under one roof",
    body: `Managing property across ${UTAH_CITIES_SERVED}+ Wasatch Front cities with owner and tenant portals, and expanding into buying, selling, and investing.`,
    tags: ["Owner portal", "Tenant portal"],
  },
] as const

export default function FoundersLetterPage() {
  const currentYear = new Date().getFullYear()
  const yearsInTech = currentYear - FIRST_YEAR_IN_SOFTWARE
  const yearsInUtah = currentYear - FIRST_UTAH_HOME_YEAR

  const canonical = toAbsoluteSiteUrl(FOUNDERS_LETTER_PATH)
  const founderImage = toAbsoluteSiteUrl(FOUNDER_IMAGE_PATH)
  // The full Person lives on the profile page (FOUNDER_PROFILE_PATH); the letter is an Article by it.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${canonical}#article`,
    headline: FOUNDERS_LETTER_TITLE,
    description: FOUNDERS_LETTER_DESCRIPTION,
    url: canonical,
    mainEntityOfPage: canonical,
    image: founderImage,
    datePublished: modified,
    dateModified: modified,
    inLanguage: "en-US",
    author: founderPersonRef(),
    publisher: { "@id": SITE_ORGANIZATION_ID },
  }

  const stats = [
    { value: `${yearsInTech}+`, label: "Years in software", detail: "Full stack engineer" },
    { value: `${yearsInUtah}+`, label: "Years a Utah homeowner", detail: "Owner and landlord" },
    { value: String(FOUNDED_YEAR), label: "Ondo founded", detail: `${SITE_ADDRESS_CITY}, Utah` },
    { value: `${UTAH_CITIES_SERVED}+`, label: "Wasatch Front cities", detail: "Where we manage and sell" },
  ]

  const paragraph = "text-foreground/70 text-lg leading-relaxed"
  const inlineLink =
    "text-primary hover:text-primary/80 font-semibold underline decoration-2 underline-offset-2 transition-colors"

  return (
    <main className="min-h-screen bg-background dark:bg-transparent" aria-labelledby="founders-letter-heading">
      <SEO
        title={FOUNDERS_LETTER_TITLE}
        description={FOUNDERS_LETTER_DESCRIPTION}
        pathname={FOUNDERS_LETTER_PATH}
        image={founderImage}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Founder's Letter", url: canonical },
          ]),
          articleJsonLd,
        ]}
      />

      <div className="relative bg-gradient-to-br from-[var(--gradient-from)] via-[var(--color-gradient-via)] to-[var(--color-gradient-to)]">
        <div className="absolute inset-0 bg-background opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <h1 id="founders-letter-heading" className="text-6xl md:text-7xl font-bold text-foreground mb-6">
            A Letter From the <span className="text-primary">Founder</span>
          </h1>
          <p className="text-2xl text-foreground/70 max-w-3xl">
            I spent a decade writing software before I bought my first house in Utah. That house led to rental property,
            and the rentals led to Ondo Real Estate. Here is the story, and what you can expect from us.
          </p>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-primary/20 backdrop-blur-lg rounded-lg p-6 border border-primary">
                <dd className="text-4xl font-bold text-foreground">{stat.value}</dd>
                <dt className="text-foreground mt-2">{stat.label}</dt>
                <dd className="text-foreground/70 text-sm">{stat.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <article className="lg:col-span-2 space-y-8">
            <section className="bg-card rounded-xl p-8 border border-border" aria-labelledby="meet-founder-heading">
              <div className="flex items-center mb-6">
                <User className="text-primary h-7 w-7 mr-4" aria-hidden="true" />
                <h2 id="meet-founder-heading" className="text-3xl font-bold text-foreground">
                  Meet the founder
                </h2>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                <div className="relative h-32 w-32 rounded-full border-4 border-primary overflow-hidden flex-shrink-0">
                  <Image
                    src={FOUNDER_IMAGE_PATH}
                    alt={`${FOUNDER_NAME}, founder of Ondo Real Estate, professional headshot`}
                    fill
                    className="rounded-full object-cover"
                    priority
                    sizes="128px"
                  />
                </div>
                <p className={paragraph}>
                  Hi, I&apos;m <strong className="text-primary">{FOUNDER_NAME}</strong>, founder of Ondo Real Estate in{" "}
                  {SITE_ADDRESS_CITY}, Utah.
                </p>
              </div>
              <p className={paragraph}>
                I came to the U.S. for a <strong className="text-primary">master&apos;s degree in computer science</strong> and
                figured I would spend my career in software. For over a decade I did: building applications, solving hard
                problems, and shipping code that businesses run on. Somewhere in there I noticed what held my attention was{" "}
                <strong className="text-primary">real estate</strong>. Software is how I work. Real estate is about people,
                growth, and legacy.
              </p>
            </section>

            <section className="bg-card rounded-xl p-8 border border-border" aria-labelledby="founders-journey-heading">
              <div className="flex items-center mb-6">
                <TrendingUp className="text-primary h-7 w-7 mr-4" aria-hidden="true" />
                <h2 id="founders-journey-heading" className="text-3xl font-bold text-foreground">
                  From software engineer to Utah landlord
                </h2>
              </div>
              <p className={`${paragraph} mb-4`}>
                I bought my first home in Utah in <strong className="text-primary">{FIRST_UTAH_HOME_YEAR}</strong>. The
                process was harder than it needed to be, and once I was through it, friends and family started asking for
                help with theirs. I helped them buy, place tenants, and get to closing without the guesswork.
              </p>
              <p className={`${paragraph} mb-4`}>
                That turned into rental property of my own, then into a plan: make real estate the career, not the side
                project. In May {FOUNDED_YEAR} I started{" "}
                <a href="https://www.ondosoft.com/" target="_blank" rel="noopener noreferrer" className={inlineLink}>
                  OndoSoft
                </a>
                , my software consultancy. Two months later, in{" "}
                <strong className="text-primary">
                  {FOUNDED_MONTH_LABEL} {FOUNDED_YEAR}
                </strong>
                , I founded <strong className="text-primary">Ondo Real Estate</strong>. One for the code, one for the
                property.
              </p>
              <p className={paragraph}>
                This website is where the two meet. I started building it the same year and it has not stopped changing
                since. Every release has one job: make owning and renting property simpler and more transparent for the
                people on both sides of the lease.
              </p>
            </section>

            <section className="bg-card rounded-xl p-8 border border-border" aria-labelledby="why-ondo-heading">
              <div className="flex items-center mb-6">
                <Lightbulb className="text-primary h-7 w-7 mr-4" aria-hidden="true" />
                <h2 id="why-ondo-heading" className="text-3xl font-bold text-foreground">
                  Why the name Ondo
                </h2>
              </div>
              <p className={`${paragraph} mb-4`}>
                &ldquo;Ondo&rdquo; means <em className="text-primary">foundation and rhythm</em>. Real estate is both: the
                foundation a family builds on, and the rhythm that keeps a neighborhood going.
              </p>
              <p className={paragraph}>
                I started Ondo because property management was stuck. Owners could not see what was happening with their
                own buildings. Tenants waited days for an answer on a repair. Most of the tools were built in a different
                decade. As an engineer and a landlord, I knew there was a better way to run this.
              </p>
            </section>

            <section className="bg-card rounded-xl p-8 border border-border" aria-labelledby="our-mission-heading">
              <div className="flex items-center mb-6">
                <Rocket className="text-primary h-7 w-7 mr-4" aria-hidden="true" />
                <h2 id="our-mission-heading" className="text-3xl font-bold text-foreground">
                  What Ondo Real Estate is for
                </h2>
              </div>
              <p className={`${paragraph} mb-4`}>
                Ondo is a property management and real estate company with its own software underneath, built on{" "}
                <strong className="text-primary">trust, transparency, and technology</strong>. The goal is simple. Owning
                rental property should not be a second job, and renting a home should feel fair and easy.
              </p>
              <p className={paragraph}>
                Owners get{" "}
                <Link href="/property-management/" className={inlineLink}>
                  full-service management
                </Link>{" "}
                with statements, maintenance, and rent in one portal. Tenants get a{" "}
                <Link href="/solutions/tenants/" className={inlineLink}>
                  portal of their own
                </Link>{" "}
                where paying rent or reporting a problem takes a minute, not a week of phone tag. Nobody should feel like a
                number in a system.
              </p>
            </section>

            <section className="bg-card rounded-xl p-8 border border-border" aria-labelledby="personal-note-heading">
              <div className="flex items-center mb-6">
                <Handshake className="text-primary h-7 w-7 mr-4" aria-hidden="true" />
                <h2 id="personal-note-heading" className="text-3xl font-bold text-foreground">
                  A personal note
                </h2>
              </div>
              <p className={`${paragraph} mb-4`}>
                I am not building Ondo from a distance. I own and manage rental property myself, so I deal with the same
                repair calls, lease questions, and year-end paperwork our owners do.
              </p>
              <p className={paragraph}>
                I have taken real risks in software, real estate, and crypto. Some paid off and some taught me something,
                and all of them taught me resilience. That is why Ondo is built for the long term:{" "}
                <strong className="text-primary">long-term value</strong> for owners, for tenants, and for the Utah
                communities we work in.
              </p>
            </section>

            <section className="bg-card rounded-xl p-8 border border-border" aria-labelledby="looking-ahead-heading">
              <div className="flex items-center mb-6">
                <Building2 className="text-primary h-7 w-7 mr-4" aria-hidden="true" />
                <h2 id="looking-ahead-heading" className="text-3xl font-bold text-foreground">
                  Where we are headed
                </h2>
              </div>
              <p className={`${paragraph} mb-4`}>
                The future of real estate is <strong className="text-primary">human connection</strong> backed by good
                software. That is what Ondo stands for. If you own property on the Wasatch Front and want management you
                can see into, if you are looking for a home to rent, or if you build things and want to partner, I would
                like to hear from you.
              </p>
              <p className={paragraph}>Thank you for reading. This is just the beginning.</p>
            </section>

            <div className="bg-gradient-to-r from-[var(--color-gradient-to)] to-background rounded-xl p-8 border border-primary">
              <p className="text-foreground/70 text-lg mb-4">Sincerely,</p>
              <p className="text-2xl font-bold text-foreground mb-2">{FOUNDER_NAME}</p>
              <p className="text-primary font-semibold">{FOUNDER_TITLE}</p>
              <p className="text-foreground/70 text-sm mt-1">{SITE_ADDRESS_CITY}, Utah</p>
            </div>
          </article>

          <aside className="space-y-6">
            <section className="bg-card rounded-xl p-6 border border-border" aria-labelledby="core-values-heading">
              <h3 id="core-values-heading" className="text-xl font-bold text-primary mb-4">
                Core values
              </h3>
              <ul className="space-y-3">
                {CORE_VALUES.map((value) => (
                  <li key={value} className="flex items-center">
                    <span className="text-primary mr-3" aria-hidden="true">
                      ✓
                    </span>
                    <span className="text-foreground/70">{value}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-card rounded-xl p-6 border border-border" aria-labelledby="expertise-heading">
              <h3 id="expertise-heading" className="text-xl font-bold text-primary mb-4">
                Background
              </h3>
              <ul className="space-y-3">
                {BACKGROUND.map((item) => (
                  <li key={item.title} className="bg-muted rounded-lg p-3">
                    <div className="text-foreground font-semibold">{item.title}</div>
                    <div className="text-foreground/70 text-sm">{item.detail}</div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-card rounded-xl p-6 border border-border" aria-labelledby="related-pages-heading">
              <h3 id="related-pages-heading" className="text-xl font-bold text-primary mb-4">
                Keep reading
              </h3>
              <ul className="space-y-2">
                {RELATED_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-foreground/80 hover:text-primary underline-offset-4 hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section
              className="bg-gradient-to-r from-[var(--color-gradient-to)] to-background rounded-xl p-6 border border-primary"
              aria-labelledby="lets-connect-heading"
            >
              <h3 id="lets-connect-heading" className="text-xl font-bold text-foreground mb-4">
                Let&apos;s talk
              </h3>
              <p className="text-foreground/70 text-sm mb-4">
                Own rental property in Utah, or looking for a place to rent? Start with a call.
              </p>
              <Link
                href="/contact/"
                className="inline-flex w-full items-center justify-center bg-primary hover:bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Schedule a call
              </Link>
            </section>
          </aside>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-24" aria-labelledby="ondo-journey-heading">
        <div className="text-center mb-16">
          <h2 id="ondo-journey-heading" className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            The <span className="text-primary">Ondo</span> journey
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            A decade in software, a first home in Utah, and a company built where the two meet.
          </p>
        </div>

        <div className="relative">
          <div
            className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"
            aria-hidden="true"
          ></div>

          <ol className="grid md:grid-cols-4 gap-8 md:gap-4">
            {TIMELINE.map(({ year, Icon, title, body, tags }) => (
              <li key={year} className="group relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-background font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                      {year}
                    </div>
                  </div>
                  <div className="bg-card rounded-xl p-6 border border-border shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:border-primary/50">
                    <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
                    <p className="text-foreground/70 text-sm leading-relaxed">{body}</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {tags.map((tag) => (
                        <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="bg-gradient-to-b from-background to-card py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Ready to work with Ondo?</h2>
          <p className="text-xl text-foreground mb-8 opacity-90">
            If you own rental property and want to see what is happening with it, or you are looking for a home, start
            with a conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact/"
              className="bg-background hover:bg-background/90 text-primary px-8 py-4 rounded-lg text-lg font-bold transition-colors text-center"
            >
              Talk to us
            </Link>
            <Link
              href="/property-management/"
              className="bg-background hover:bg-background/90 text-primary px-8 py-4 rounded-lg text-lg font-bold transition-colors text-center"
            >
              See how we manage property
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
