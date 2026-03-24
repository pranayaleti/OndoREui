import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SITE_BRAND_SHORT } from "@/lib/site"

export function CTASection() {
  return (
    <section className="py-16 bg-muted dark:bg-[var(--gradient-overlay)] text-foreground" aria-labelledby="home-cta-heading">
      <div className="container mx-auto px-4 text-center">
        <h2 id="home-cta-heading" className="text-3xl font-bold mb-6">
          Ready to work with {SITE_BRAND_SHORT}?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-foreground/80">
          Search rentals by ZIP—or{" "}
          <Link href="/contact" className="font-medium text-primary underline-offset-4 hover:underline">
            talk to our team
          </Link>{" "}
          about management, lending, or investments.
        </p>
        <div className="mx-auto max-w-md">
          <form className="flex gap-2">
            <input
              type="text"
              placeholder="Enter ZIP code"
              className="flex-1 px-4 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background dark:bg-card dark:border-border dark:placeholder:text-foreground/70"
            />
            <Button type="submit" className="bg-background hover:bg-muted dark:hover:bg-muted text-foreground">
              Search
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}