import Link from "next/link"
import { Calendar, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SITE_EMAILS, SITE_PHONE, SITE_PHONE_TEL } from "@/lib/site"
import { analyticsAttributes } from "@/lib/analytics"

export function CTASection() {
  return (
    <section
      className="bg-muted py-16 text-foreground dark:bg-[var(--gradient-overlay)]"
      aria-labelledby="home-cta-heading"
    >
      <div className="container mx-auto px-4 text-center">
        <h2 id="home-cta-heading" className="mb-3 text-3xl font-bold">
          Talk to a person in Lehi
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-lg text-foreground/80">
          Call, book a 30-minute call, or send an email. We reply within one business day.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <a href={`tel:${SITE_PHONE_TEL}`} className="inline-flex items-center gap-2" {...analyticsAttributes("contact_click", "home_cta", "call")}>
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call {SITE_PHONE}
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact#book-a-call" className="inline-flex items-center gap-2" {...analyticsAttributes("book_call_click", "home_cta", "book-a-call")}>
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Book a call
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <a href={`mailto:${SITE_EMAILS.primary}`} className="inline-flex items-center gap-2" {...analyticsAttributes("contact_click", "home_cta", "email")}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              Email us
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
