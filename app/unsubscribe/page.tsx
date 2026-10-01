import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MailX, Phone } from "lucide-react"
import { SITE_EMAILS, SITE_PHONE, SITE_PHONE_TEL, SITE_HOURS_LABEL } from "@/lib/site"

/**
 * There is no automated suppression endpoint yet (backend follow-up), so this page
 * must never claim a removal happened. It tells people how to opt out and who
 * handles the request.
 */
const UNSUBSCRIBE_MAILTO =
  `mailto:${SITE_EMAILS.info}` +
  `?subject=${encodeURIComponent("Unsubscribe me from Ondo Real Estate emails")}` +
  `&body=${encodeURIComponent(
    "Please remove this email address from all Ondo Real Estate marketing emails.\n\nEmail address to remove: ",
  )}`

export default function UnsubscribePage() {
  return (
    <main className="min-h-screen">
      <PageBanner
        title="Unsubscribe"
        subtitle="You can opt out of our marketing emails at any time"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-3">
                  <MailX className="h-10 w-10 text-foreground/40" />
                </div>
                <CardTitle className="text-2xl">How to unsubscribe</CardTitle>
                <CardDescription>
                  This page does not remove anyone automatically. Send us a message or call, and we
                  will take you off our marketing emails by hand.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ol className="list-decimal space-y-3 pl-5 text-sm text-foreground/80">
                  <li>
                    Email{" "}
                    <a href={UNSUBSCRIBE_MAILTO} className="text-primary underline underline-offset-4">
                      {SITE_EMAILS.info}
                    </a>{" "}
                    from the address you want removed. The button below opens a message that is
                    already filled in.
                  </li>
                  <li>
                    Or call{" "}
                    <a
                      href={`tel:${SITE_PHONE_TEL}`}
                      className="text-primary underline underline-offset-4"
                    >
                      {SITE_PHONE}
                    </a>{" "}
                    ({SITE_HOURS_LABEL}) and tell us which email address to remove.
                  </li>
                  <li>
                    We process opt-out requests within 10 business days. You will not get a
                    confirmation page, because nothing happens until we handle your request.
                  </li>
                </ol>

                <Button asChild className="w-full">
                  <a href={UNSUBSCRIBE_MAILTO}>Email us to unsubscribe</a>
                </Button>

                <Button asChild variant="outline" className="w-full">
                  <a href={`tel:${SITE_PHONE_TEL}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call {SITE_PHONE}
                  </a>
                </Button>

                <p className="text-center text-xs text-foreground/60">
                  You will still receive messages about an account or service you have with us
                  (for example rent receipts and maintenance updates). Changed your mind?{" "}
                  <Link href="/subscribe" className="text-primary underline underline-offset-4">
                    Subscribe here
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
