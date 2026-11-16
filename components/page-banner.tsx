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
  /** A photo in /public. Leave it out for the brand banner. Retired stock names map to Utah photos. */
  backgroundImage?: string
  /** Main action for the page, shown under the subtitle. */
  primaryCta?: PageBannerCta
  secondaryCta?: PageBannerCta
  /** Text alignment. Defaults to centered; "left" suits long titles and pages with a lead-in below. */
  align?: "center" | "left"
  /** "tall" gives hero-scale pages (about, landing sections) more room. Defaults to the standard banner height. */
  size?: "default" | "tall"
  /** No photo and no brand ring: just the theme-independent scrim over the page's dark surface. */
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
 * Stock art retired from banners in Nov 2026: an office tower, a high-rise balcony, a staged meeting and
 * two illustrations, none of which shows Utah or Ondo. Pages still name these files (their Open Graph
 * metadata points at the same art), so each one is swapped here for a real photograph of the Wasatch
 * Front. Sources and licences (public domain and CC0) are listed in docs/PHOTO-CREDITS.md.
 */
const UTAH_BANNER_PHOTOS: Record<string, string> = {
  "modern-office-building": "/banners/utah-mount-timpanogos.webp",
  "property-manager-meeting": "/banners/utah-mount-timpanogos.webp",
  "suburban-house-garden": "/banners/utah-lake-wasatch.webp",
  "modern-apartment-balcony": "/banners/utah-mountain-clouds.webp",
  "modern-townhouse-garage": "/banners/utah-mountain-clouds.webp",
}

/**
 * The photo a banner should show, or null for the brand banner (the logo's brush ring on black) when a
 * page names no image. Any other photo a page names renders as given: put it in /public as WebP (content
 * metadata may name the PNG twin for Open Graph, so the extension is mapped here to keep the PNG out of
 * the LCP request).
 */
export function bannerImageSrc(src?: string): string | null {
  if (!src) return null
  const name = src.replace(/^.*\//, "").replace(/\.[a-z0-9]+$/i, "")
  return UTAH_BANNER_PHOTOS[name] ?? src.replace(/\.png$/i, ".webp")
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
  const photo = bannerImageSrc(backgroundImage)
  return (
    // The content sits in flow so the banner grows with long titles on phones instead of clipping them.
    <section className={`relative flex ${SIZE_CLASS[size]} items-center overflow-hidden${plain ? " bg-scrim" : ""}`}>
      {/* Decorative backdrop: the heading and subtitle already say what the page is about. */}
      {plain ? null : photo ? (
        <div className="absolute inset-0">
          <Image
            src={photo}
            alt=""
            fill
            // Monochrome, so photos from different sources read as one texture and the orange button is
            // the only colour on the banner.
            className="object-cover object-[center_30%] grayscale"
            priority
          />
        </div>
      ) : (
        // Brand banner: the brush ring from the logo, cropped by the banner edge. The mask keeps the
        // outer ring and drops the portrait, which turns into a smudge at this size.
        <div className="absolute inset-0 bg-black">
          <div className="absolute -right-24 top-1/2 h-[30rem] w-[30rem] -translate-y-1/2 opacity-60 [mask-image:radial-gradient(circle_closest-side,transparent_60%,black_62%)] md:-right-16 md:h-[40rem] md:w-[40rem]">
            <Image src="/ondo-mark.webp" alt="" fill className="object-contain" sizes="640px" />
          </div>
        </div>
      )}
      {/* Theme-independent scrim: white text on it passes 4.5:1 over any photo in both themes. */}
      <div className="absolute inset-0 bg-scrim/60 z-10" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/0 to-black/20" aria-hidden="true" />
      <div className="relative z-20 w-full py-12">
        <div className={`container px-4 md:px-6 mx-auto ${left ? "text-left" : "text-center"}`}>
          <div className={left ? "max-w-3xl" : "max-w-3xl mx-auto"}>
            <h1 className="mb-4 text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-white md:text-5xl lg:text-6xl">{title}</h1>
            <p className={`text-lg leading-relaxed text-white md:text-xl ${left ? "max-w-2xl" : "mx-auto max-w-2xl"}`}>{subtitle}</p>
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
