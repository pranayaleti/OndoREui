import Image from "next/image"
import dynamic from "next/dynamic"

const ZipServiceSelector = dynamic(
  () => import("@/components/landing/zip-service-selector").then((m) => m.ZipServiceSelector),
  {
    ssr: false,
    loading: () => (
      <div className="flex w-full max-w-sm items-center gap-2" aria-hidden="true">
        <div className="h-11 flex-1 rounded-md bg-white/20" />
        <div className="h-11 w-28 rounded-md bg-white/20" />
      </div>
    ),
  }
)

export function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-r from-background to-card dark:bg-gradient-to-b dark:from-black dark:to-gray-900 py-20 md:py-32 overflow-hidden" role="banner" aria-label="Hero section">
      <div className="absolute inset-0 z-0 opacity-20" aria-hidden="true">
        <Image
          src="/modern-office-building.webp"
          alt="Ondo RE headquarters in Lehi, Utah — property management, mortgage, and real estate services along the Wasatch Front"
          fill
          className="object-cover"
          priority
          quality={75}
          sizes="100vw"
        />
      </div>
      <div className="container relative z-10 mx-auto px-4 text-center">
        <header>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Utah&apos;s Full-Service Real Estate Partner
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-foreground/70">
            Property management, home loans, and brokerage across 55+ Wasatch Front cities.
            Owners get real-time visibility. Tenants get responsive support. Investors see exactly how assets perform.
          </p>
        </header>
        <section aria-label="Property search" className="relative flex justify-center">
          <ZipServiceSelector />
        </section>
        <p className="mt-6 text-sm text-foreground/50">
          Trusted by property owners from North Ogden to Nephi &bull; 4.9★ average rating
        </p>
      </div>
    </section>
  )
}
