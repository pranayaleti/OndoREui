import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LazyImage } from "@/components/lazy-image"

export function FoundersNoteSection() {
  return (
    <section className="py-16 bg-card dark:bg-[var(--gradient-overlay)] text-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex justify-center md:justify-start">
            <div className="relative h-60 w-60 md:h-80 md:w-80 rounded-full border-4 border-primary overflow-hidden bg-background">
              <LazyImage
                src="/founder-image.webp"
                alt="Pranay Reddy Aleti, Founder and CEO of Ondo Real Estate, professional headshot"
                fill
                className="rounded-full object-cover"
                quality={90}
                priority
                sizes="(max-width: 768px) 240px, 320px"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-3">Founder&apos;s note</h2>
            <p className="text-foreground/70 mb-6 max-w-3xl">
              "Real estate is more than property — it is about people, growth, and legacy. At Ondo RE, we are building a
              modern property management and real estate platform rooted in trust, transparency, and technology so Utah
              owners rest easy and tenants feel right at home."
            </p>
            <Button asChild className="bg-primary hover:bg-primary text-primary-foreground">
              <Link href="/founders-letter">Read the full letter</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}