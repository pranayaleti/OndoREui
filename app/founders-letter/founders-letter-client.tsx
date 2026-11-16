import Image from "next/image"
import Link from "next/link"
import SEO from "@/components/seo"
import { CalendlyLink } from "@/components/calendly-link"
import { Button } from "@/components/ui/button"
import { analyticsAttributes } from "@/lib/analytics"
import {
  FOUNDERS_LETTER_DESCRIPTION,
  FOUNDERS_LETTER_OG_IMAGE_PATH,
  FOUNDERS_LETTER_PATH,
  FOUNDERS_LETTER_TITLE,
  FOUNDER_IMAGE_ALT,
  FOUNDER_IMAGE_PATH,
  LETTER,
  ONDO_MARK_ALT,
  ONDO_MARK_PATH,
  founderLetterWordCount,
  type Block,
  type Segment,
} from "@/lib/content/founders-letter"
import { SITE_ORGANIZATION_ID, founderPersonRef, generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_PHONE_TEL, SITE_URL } from "@/lib/site"
import { toAbsoluteSiteUrl } from "@/lib/url"
import styles from "./founders-letter.module.css"

export { FOUNDERS_LETTER_DESCRIPTION, FOUNDERS_LETTER_PATH, FOUNDERS_LETTER_TITLE, FOUNDER_IMAGE_PATH }

/** The letter was first published on this date; the page's `modified` is the last read-through. */
const PUBLISHED = "2026-10-19"
const CATEGORY = "founders_letter"

function Segments({ segments }: { segments: readonly Segment[] }) {
  return (
    <>
      {segments.map((segment, index) => {
        if (typeof segment === "string") return segment
        if ("accent" in segment) {
          return (
            <strong key={index} className={styles.accent}>
              {segment.text}
            </strong>
          )
        }
        if (segment.external) {
          return (
            <a
              key={index}
              href={segment.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.inlineLink}
              {...analyticsAttributes("founders_letter_click", CATEGORY, "ondosoft")}
            >
              {segment.text}
            </a>
          )
        }
        return (
          <Link
            key={index}
            href={segment.href}
            className={styles.inlineLink}
            {...analyticsAttributes("founders_letter_click", CATEGORY, segment.href.replace(/^\/|\/$/g, "").replace(/\//g, "-"))}
          >
            {segment.text}
          </Link>
        )
      })}
    </>
  )
}

function Blocks({ blocks }: { blocks: readonly Block[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.kind === "quote") {
          return (
            <blockquote key={index} className={styles.pull}>
              <p>{block.text}</p>
            </blockquote>
          )
        }
        if (block.kind === "glance") {
          return (
            <ul key={index} className={styles.glance} data-glance="">
              {block.items.map((item) => (
                <li key={item.year}>
                  <a
                    href={`#chapter-${item.year}`}
                    className={styles.glanceLink}
                    {...analyticsAttributes("founders_letter_click", CATEGORY, `glance-${item.year}`)}
                  >
                    <span className={styles.glanceYear}>{item.year}</span>{" "}
                    <span>
                      <Segments segments={item.segments} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )
        }
        if (block.kind === "habits") {
          return (
            <div key={index} className={styles.habits}>
              {block.items.map((item) => (
                <p key={item.lead}>
                  <strong>{item.lead}</strong> {item.text}
                </p>
              ))}
            </div>
          )
        }
        return (
          <p key={index}>
            <Segments segments={block.segments} />
          </p>
        )
      })}
    </>
  )
}

function BookCall({ contentLabel, label, children }: { contentLabel: string; label: string; children: React.ReactNode }) {
  return (
    <Button asChild size="lg" className={styles.primary}>
      <CalendlyLink contentLabel={contentLabel} {...analyticsAttributes("book_call_click", CATEGORY, label)}>
        {children}
      </CalendlyLink>
    </Button>
  )
}

export default function FoundersLetter({ modified }: { modified: string }) {
  const { masthead, opening, lede, chapters, mark, midCta, why, restraint, closing, keepReading } = LETTER
  const canonical = toAbsoluteSiteUrl(FOUNDERS_LETTER_PATH)
  const ogImage = toAbsoluteSiteUrl(FOUNDERS_LETTER_OG_IMAGE_PATH)
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
    image: [ogImage, founderImage],
    datePublished: PUBLISHED,
    dateModified: modified,
    inLanguage: "en-US",
    wordCount: founderLetterWordCount(),
    author: founderPersonRef(),
    publisher: { "@id": SITE_ORGANIZATION_ID },
  }

  return (
    <main id="founders-letter" className={styles.root} aria-labelledby="founders-letter-heading">
      <SEO
        title={FOUNDERS_LETTER_TITLE}
        description={FOUNDERS_LETTER_DESCRIPTION}
        pathname={FOUNDERS_LETTER_PATH}
        image={ogImage}
        jsonLd={[
          generateBreadcrumbJsonLd([
            { name: "Home", url: SITE_URL },
            { name: "Founder's Letter", url: canonical },
          ]),
          articleJsonLd,
        ]}
      />

      <div className={styles.inner}>
        <p className={styles.masthead}>{masthead.lead}</p>

        <section className={styles.opening} aria-labelledby="founders-letter-heading">
          <div className={styles.openingText}>
            <h1 id="founders-letter-heading" className={styles.headline}>
              {opening.headline}
            </h1>
            <p className={styles.deck}>{opening.deck}</p>
            <p className={styles.category}>{opening.category}</p>
            <div className={styles.ctaRow}>
              <BookCall contentLabel="founders_letter_hero" label="hero-book-call">
                {opening.bookLabel}
              </BookCall>
              <Button asChild size="lg" variant="outline" className={styles.secondary}>
                <a href={`tel:${SITE_PHONE_TEL}`} {...analyticsAttributes("contact_click", CATEGORY, "hero-call")}>
                  {opening.callLabel}
                </a>
              </Button>
            </div>
          </div>
          <figure className={styles.plate}>
            <div className={styles.plateImage}>
              <Image src={FOUNDER_IMAGE_PATH} alt={FOUNDER_IMAGE_ALT} fill priority sizes="(min-width: 1024px) 480px, 100vw" />
            </div>
            <figcaption className={styles.plateCaption}>{opening.plateCaption}</figcaption>
          </figure>
        </section>

        <section className={styles.lede} aria-label="The short version">
          <div className={styles.ledeBody}>
            <Blocks blocks={lede.blocks} />
          </div>
        </section>
      </div>

      <div className={styles.chapters}>
        {chapters.map((chapter) => (
          <section
            key={chapter.id}
            id={chapter.id}
            className={styles.chapter}
            data-temp={chapter.temp}
            aria-labelledby={`${chapter.id}-heading`}
          >
            <div className={styles.inner}>
              <div className={styles.chapterGrid}>
                <h2 id={`${chapter.id}-heading`} className={styles.chapterHeading}>
                  <span className={styles.year}>{chapter.year}</span>
                  <span className="sr-only">: </span>
                  <span className={styles.chapterTitle}>{chapter.title}</span>
                </h2>
                <div className={styles.chapterBody}>
                  <Blocks blocks={chapter.blocks} />
                  {chapter.sideLabels ? (
                    <ul className={styles.sideLabels}>
                      {chapter.sideLabels.map((label) => (
                        <li key={label}>{label}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className={styles.mark} aria-labelledby="mark-heading">
        <div className={styles.inner}>
          <div className={styles.markStage}>
            <figure className={styles.markFigure}>
              <Image src={ONDO_MARK_PATH} alt={ONDO_MARK_ALT} width={1024} height={1024} loading="lazy" className={styles.markImage} />
            </figure>
            <p className={styles.lockup} aria-hidden="true">
              {mark.lockup.map((word, index) => {
                const [caps, rest] = word.slice(0, -1).split(" ")
                return (
                  <span key={word}>
                    {index > 0 ? " " : ""}
                    <span className={styles.lockupCaps}>{caps}</span>{" "}
                    <span className={styles.lockupIt}>{rest}</span>
                    <span className={styles.period}>.</span>
                  </span>
                )
              })}
            </p>
            <p className={styles.decode}>{mark.decode}</p>
          </div>
          <h2 id="mark-heading" className={styles.markHeading}>
            {mark.heading}
          </h2>
          <div className={styles.markBody}>
            <Blocks blocks={mark.blocks} />
          </div>
        </div>
        <div className={styles.band}>
          <div className={styles.inner}>
            <p className={styles.bandText}>{midCta.text}</p>
            <div className={styles.ctaRow}>
              <BookCall contentLabel="founders_letter_mid" label="mid-book-call">
                {midCta.bookLabel}
              </BookCall>
              <Button asChild size="lg" variant="outline" className={styles.secondary}>
                <Link href={midCta.contactHref} {...analyticsAttributes("contact_click", CATEGORY, "mid-contact-owner")}>
                  {midCta.contactLabel}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.why} aria-labelledby="why-heading">
        <div className={styles.inner}>
          <h2 id="why-heading" className={styles.sectionHeading}>
            {why.heading}
          </h2>
          <p className={styles.intro}>{why.intro}</p>
          <div className={styles.pillars}>
            {why.pillars.map((pillar) => (
              <div key={pillar.title} className={styles.pillar}>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.restraint} aria-labelledby="restraint-heading">
        <div className={styles.inner}>
          <h2 id="restraint-heading" className={styles.kicker}>
            {restraint.heading}
          </h2>
          <div className={styles.measure}>
            <Blocks blocks={restraint.blocks} />
          </div>
        </div>
      </section>

      <section className={styles.closing} aria-labelledby="closing-heading">
        <div className={styles.inner}>
          <h2 id="closing-heading" className={styles.sectionHeading}>
            {closing.heading}
          </h2>
          <div className={styles.measure}>
            <Blocks blocks={closing.blocks} />
          </div>
          <div className={styles.signature}>
            <Image src={ONDO_MARK_PATH} alt="" aria-hidden="true" width={48} height={48} loading="lazy" className={styles.signatureMark} />
            <p className={styles.signatureName}>{closing.signature.name}</p>
            <p className={styles.signatureRole}>{closing.signature.role}.</p>
          </div>
          <div className={styles.ctaRow}>
            <BookCall contentLabel="founders_letter_close" label="close-book-call">
              {closing.bookLabel}
            </BookCall>
            <Button asChild size="lg" variant="outline" className={styles.secondary}>
              <a href={`tel:${SITE_PHONE_TEL}`} {...analyticsAttributes("contact_click", CATEGORY, "close-call")}>
                {closing.callLabel}
              </a>
            </Button>
            <Link href="/contact/" className={styles.readLink} {...analyticsAttributes("contact_click", CATEGORY, "close-message")}>
              {closing.messageLabel}
            </Link>
          </div>
        </div>
      </section>

      <nav className={styles.colophon} aria-labelledby="keep-reading-heading">
        <div className={styles.inner}>
          <h2 id="keep-reading-heading" className={styles.kicker}>
            {keepReading.heading}
          </h2>
          <ul>
            {keepReading.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  {...analyticsAttributes("founders_letter_click", CATEGORY, `next-${link.href.replace(/^\/|\/$/g, "").replace(/\//g, "-")}`)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </main>
  )
}
