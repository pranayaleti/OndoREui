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
  /** Text alignment. Defaults to centered; "left" suits long titles and pages with a lead-in below. */
  align?: "center" | "left"
  /** "tall" gives hero-scale pages (about, landing sections) more room. Defaults to the standard banner height. */
  size?: "default" | "tall"
  /** Skip the photo and show the theme-independent scrim over the page's dark surface. */
  plain?: boolean
}

const SIZE_CLASS = {
  default: "min-h-[300px]",
  tall: "min-h-[320px] md:min-h-[420px]",
} as const

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

/**
 * Every banner photo ships as a ~50-130KB WebP next to a ~1MB PNG original. Content metadata still names
 * the PNG for Open Graph, so map it here and keep the PNG out of the LCP request.
 */
export function bannerImageSrc(src?: string): string {
  if (!src) return "/modern-apartment-balcony.webp"
  return src.replace(/\.png$/i, ".webp")
}

export function PageBanner({
  title,
  subtitle,
  backgroundImage,
  primaryCta,
  secondaryCta,
  align = "center",
  size = "default",
  plain = false,
}: PageBannerProps) {
  const hasCtas = Boolean(primaryCta || secondaryCta)
  const left = align === "left"
  return (
    // The content sits in flow so the banner grows with long titles on phones instead of clipping them.
    <section className={`relative flex ${SIZE_CLASS[size]} items-center overflow-hidden${plain ? " bg-scrim" : ""}`}>
      {/* Decorative photo: the heading and subtitle already say what the page is about. */}
      {plain ? null : (
        <div className="absolute inset-0">
          <Image
            src={bannerImageSrc(backgroundImage)}
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      {/* Theme-independent scrim: white text on it passes 4.5:1 over any photo in both themes. */}
      <div className="absolute inset-0 bg-scrim/60 z-10" />
      <div className="relative z-20 w-full py-12">
        <div className={`container px-4 md:px-6 mx-auto ${left ? "text-left" : "text-center"}`}>
          <div className={left ? "max-w-3xl" : "max-w-3xl mx-auto"}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
            <p className="text-xl text-white">{subtitle}</p>
            {hasCtas ? (
              <div className={`mt-6 flex flex-col gap-3 sm:flex-row ${left ? "items-start" : "items-center justify-center"}`}>
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
