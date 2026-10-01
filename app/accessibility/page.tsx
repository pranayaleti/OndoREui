import type { Metadata } from "next"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_EMAILS, SITE_PHONE, SITE_PHONE_TEL, pageTitle } from "@/lib/site"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accessibility, Eye, Volume2, MousePointer, Keyboard, Smartphone, Monitor, CheckCircle } from "lucide-react"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

export const metadata: Metadata = pageCanonicalMetadata("/accessibility", {
  title: pageTitle("Accessibility | Ondo Real Estate"),
  description: "Our accessibility target, known issues and how to reach us about accessibility on the Ondo Real Estate website.",
})


const ACCESSIBILITY_REVIEWED = "September 30, 2026"

export default function AccessibilityPage() {
  const accessibilityFeatures = [
    {
      title: "Screen Readers",
      icon: <Volume2 className="h-6 w-6" aria-hidden="true" />,
      description: "We build pages with assistive technology in mind and fix the problems we find.",
      features: ["Semantic HTML structure", "ARIA labels and roles on interactive controls", "Heading hierarchy on content pages"]
    },
    {
      title: "Keyboard Navigation",
      icon: <Keyboard className="h-6 w-6" aria-hidden="true" />,
      description: "Interactive elements are intended to be reachable with a keyboard.",
      features: ["Tab navigation", "Skip link to main content", "Visible focus indicators"]
    },
    {
      title: "Visual Design",
      icon: <Eye className="h-6 w-6" aria-hidden="true" />,
      description: "Color contrast is a known weak spot, especially in the Light theme (see Known Issues).",
      features: ["Resizable text", "Light, dark and system themes", "Consistent layout and typography"]
    },
    {
      title: "Motor Accessibility",
      icon: <MousePointer className="h-6 w-6" aria-hidden="true" />,
      description: "Controls are sized for touch and do not require precise gestures.",
      features: ["Touch-friendly buttons and links", "No drag-and-drop required for core tasks"]
    },
    {
      title: "Mobile",
      icon: <Smartphone className="h-6 w-6" aria-hidden="true" />,
      description: "The site is responsive and works on phones and tablets.",
      features: ["Responsive layout", "Touch-friendly interfaces"]
    },
    {
      title: "Plain Language",
      icon: <Monitor className="h-6 w-6" aria-hidden="true" />,
      description: "We aim for clear writing and predictable navigation.",
      features: ["Plain language", "Consistent navigation", "Short, direct form copy"]
    }
  ]

  const knownIssues = [
    "Some text and orange accents in the Light theme do not meet the WCAG AA contrast ratio.",
    "A few scrollable regions, such as long resource lists, cannot be focused with a keyboard.",
    "Some links inside blocks of text are distinguished by color alone, for example on the sitemap page.",
  ]

  const testingMethods = [
    "Automated checks with axe-core",
    "Manual keyboard checks on key pages",
  ]

  return (
    <main className="min-h-screen">
      <SEO
        title="Accessibility Statement | Ondo Real Estate"
        description="Our accessibility target, known issues and how to reach us about accessibility on the Ondo Real Estate website."
        pathname="/accessibility"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Accessibility", url: `${SITE_URL}/accessibility` },
        ])}
      />
      <PageBanner
        title="Accessibility Statement"
        subtitle="Committed to making our website accessible to everyone"
        backgroundImage="/modern-office-building.webp"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Accessibility Commitment</h2>
              <p className="text-xl text-foreground/70">
                Ondo Real Estate is committed to ensuring digital accessibility for people with disabilities. 
                Our target is WCAG 2.1 Level AA. We have not had the site formally audited, and we do not claim full
                conformance. The sections below say what we aim for and what we know is not yet right.
              </p>
            </div>

            <Card className="mb-12" aria-labelledby="accessibility-features-heading">
              <CardHeader>
                <CardTitle
                  id="accessibility-features-heading"
                  className="flex items-center gap-3"
                >
                  <Accessibility className="h-6 w-6" aria-hidden="true" />
                  Accessibility Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {accessibilityFeatures.map((feature, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex items-center gap-3">
                        {feature.icon}
                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                      </div>
                      <p className="text-foreground/70">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.features.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-foreground/70">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>Known Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {knownIssues.map((issue, index) => (
                      <li key={index} className="text-sm text-foreground/70">{issue}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Testing Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {testingMethods.map((method, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground/70">{method}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Feedback and Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-foreground/70">
                    We welcome your feedback on the accessibility of our website. If you encounter any barriers 
                    or have suggestions for improvement, please contact us:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Accessibility Contact</h4>
                      <p className="text-sm text-foreground/70">
                        <a className="underline" href={`mailto:${SITE_EMAILS.accessibility}`}>{SITE_EMAILS.accessibility}</a>
                      </p>
                      <p className="text-sm text-foreground/70">
                        <a className="underline" href={`tel:${SITE_PHONE_TEL}`}>{SITE_PHONE}</a>
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Last Reviewed</h4>
                      <p className="text-sm text-foreground/70">{ACCESSIBILITY_REVIEWED}. If something blocks you, tell us and we will help you complete the task another way.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Ongoing Improvements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-foreground/70">
                    We are working to fix the issues listed above and to improve accessibility over time. This includes:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground/70">Re-running automated accessibility checks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground/70">Implementing user feedback and suggestions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground/70">Fixing contrast and focus problems first</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Questions About Accessibility?</h3>
              <p className="text-foreground/70 mb-6">
                We're here to help ensure everyone can access our services. Contact us if you need assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/about">Learn More About Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
