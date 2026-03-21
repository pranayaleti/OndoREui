import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import SEO from "@/components/seo"
import { PageBanner } from "@/components/page-banner"
import { VideoTabs } from "./video-tabs"

export const metadata: Metadata = {
  title: "Video Library | Ondo Real Estate",
  description: "Step-by-step video walkthroughs for owners, tenants, investors, and platform administrators.",
}

export default function VideoLibraryPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Video Library | Ondo Real Estate"
        description="Step-by-step video walkthroughs for owners, tenants, investors, and platform administrators."
        pathname="/video-library"
      />
      <PageBanner
        title="Learn how to use Ondo"
        subtitle="Step-by-step walkthroughs for every role on the platform."
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <VideoTabs />
        </div>
      </section>

      <section className="py-12 bg-muted text-center">
        <div className="container mx-auto px-4">
          <Button asChild size="lg">
            <Link href="/demo">Book a live walkthrough</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
