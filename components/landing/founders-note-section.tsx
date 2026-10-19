import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LazyImage } from "@/components/lazy-image"
import { FOUNDED_YEAR } from "@/lib/social-proof-stats"

export function FoundersNoteSection() {
  return (
    <section className="bg-card py-16 text-foreground dark:bg-[var(--gradient-overlay)]" aria-labelledby="founder-note-heading">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
          <div className="flex justify-center md:justify-start">
            <div className="relative h-52 w-52 overflow-hidden rounded-full border-4 border-primary bg-background md:h-64 md:w-64">
              <LazyImage
                src="/founder-image.webp"
                alt="Pranay Reddy Aleti, founder of Ondo Real Estate"
                fill
                className="rounded-full object-cover"
                quality={90}
                sizes="(max-width: 768px) 208px, 256px"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <h2 id="founder-note-heading" className="mb-3 text-2xl font-bold">
              A note from Pranay
            </h2>
            <p className="mb-3 max-w-3xl text-foreground/70">
              I started Ondo in {FOUNDED_YEAR} because owning a rental should not mean guessing. You see every
              dollar, every repair and every lease in one place, and you can call me when something is off.
            </p>
            <p className="mb-6 max-w-3xl text-sm text-foreground/60">
              Real estate and mortgage licensing is in progress. Where each line of business stands is on the{" "}
              <Link href="/licensing" className="text-primary underline-offset-4 hover:underline">
                licensing page
              </Link>
              .
            </p>
            <Button asChild variant="outline">
              <Link href="/founders-letter">Read the full letter</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
