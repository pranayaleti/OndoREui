import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { analyticsAttributes } from "@/lib/analytics"

export interface PageBannerCta {
  label: string
  /** Internal path, "#fragment" or "tel:" link. */
  href: string
  /** Click event name for ClickTracker. Defaults to "page_banner_cta". */
  event?: string
  /** Event label. Defaults to the href. */
  analyticsLabel?: string
}

interface PageBannerProps {
  title: string
  subtitle: string
  backgroundImage?: string
  /** Main action for the page, shown under the subtitle. */
  primaryCta?: PageBannerCta
  secondaryCta?: PageBannerCta
}

function BannerCtaLink({ cta, slot }: { cta: PageBannerCta; slot: "primary" | "secondary" }) {
  const attrs = analyticsAttributes(cta.event ?? "page_banner_cta", "page_banner", cta.analyticsLabel ?? `${slot}:${cta.href}`)
  const isPlainAnchor = cta.href.startsWith("#") || cta.href.startsWith("tel:")
  return (
    <Button
      asChild
      size="lg"
      // The secondary button sits on the photo scrim in both themes, so it uses fixed white, not theme tokens.
      className={slot === "secondary" ? "border border-white bg-transparent text-white hover:bg-white/15" : undefined}
    >
      {isPlainAnchor ? (
        <a href={cta.href} {...attrs}>
          {cta.label}
        </a>
      ) : (
        <Link href={cta.href} prefetch={false} {...attrs}>
          {cta.label}
        </Link>
      )}
    </Button>
  )
}

export function PageBanner({ title, subtitle, backgroundImage, primaryCta, secondaryCta }: PageBannerProps) {
  const hasCtas = Boolean(primaryCta || secondaryCta)
  return (
    // The content sits in flow so the banner grows with long titles on phones instead of clipping them.
    <section className="relative flex min-h-[300px] items-center overflow-hidden">
      {/* Decorative photo: the heading and subtitle already say what the page is about. */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage || "/modern-apartment-balcony.webp"}
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>
      {/* Theme-independent scrim: white text on it passes 4.5:1 over any photo in both themes. */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 w-full py-12">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
            <p className="text-xl text-white">{subtitle}</p>
            {hasCtas ? (
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {primaryCta ? <BannerCtaLink cta={primaryCta} slot="primary" /> : null}
                {secondaryCta ? <BannerCtaLink cta={secondaryCta} slot="secondary" /> : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
