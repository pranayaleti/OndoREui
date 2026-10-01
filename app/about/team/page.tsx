import type { Metadata } from "next"
import Link from "next/link"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, pageTitle } from "@/lib/site"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { pageCanonicalMetadata } from "@/lib/page-canonical"
import { getTeam } from "@/lib/team-data"

export const metadata: Metadata = pageCanonicalMetadata("/about/team", {
  title: pageTitle("Our Team | Ondo Real Estate"),
  description: "Meet Pranay Reddy Aleti, the founder of Ondo Real Estate in Utah.",
})

export default function TeamPage() {
  const team = getTeam()

  return (
    <main className="min-h-screen">
      <SEO
        title="Our Team | Ondo Real Estate"
        description="Meet Pranay Reddy Aleti, the founder of Ondo Real Estate in Utah."
        pathname="/about/team"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "About", url: `${SITE_URL}/about` },
          { name: "Team", url: `${SITE_URL}/about/team` },
        ])}
      />
      <PageBanner
        title="Our Team"
        subtitle="Who runs Ondo Real Estate"
        backgroundImage="/modern-office-building.webp"
      />

      <section className="py-16 bg-muted dark:bg-gradient-to-b dark:from-background dark:to-card">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto grid grid-cols-1 gap-8">
            {team.map((member) => (
              <Card key={member.slug}>
                <CardHeader className="text-center">
                  <div
                    className="h-24 w-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl"
                    aria-hidden="true"
                  >
                    {member.name.charAt(0)}
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-primary">{member.title}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-foreground/70 text-sm mb-6">{member.bio}</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                      <Link href="/contact/">Contact us</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/founders-letter/">Read the founder&apos;s letter</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
