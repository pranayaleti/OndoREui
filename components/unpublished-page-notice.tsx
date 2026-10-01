import type { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type UnpublishedPageNoticeProps = {
  title: string
  children: ReactNode
  /** Optional page that covers the same ground with verified content. */
  alternative?: { href: string; label: string }
}

/**
 * Honest placeholder for company pages whose original content could not be
 * verified (history, news, giving back, investor relations). Pages that use it
 * must also set `robots: { index: false }` in their metadata and stay out of
 * navigation, the footer and the sitemap.
 */
export function UnpublishedPageNotice({ title, children, alternative }: UnpublishedPageNoticeProps) {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{title}</h1>
          <div className="text-foreground/70 text-lg leading-relaxed space-y-4 mb-8">{children}</div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact/">Contact us</Link>
            </Button>
            {alternative ? (
              <Button asChild size="lg" variant="outline">
                <Link href={alternative.href}>{alternative.label}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  )
}
