import type { Metadata } from "next"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_EMAILS, SITE_PHONE } from "@/lib/site"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Accessibility, Eye, Volume2, MousePointer, Keyboard, Smartphone, Monitor, CheckCircle } from "lucide-react"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

export const metadata: Metadata = pageCanonicalMetadata("/accessibility", {
  title: "Accessibility | Ondo Real Estate",
  description: "Accessibility features and commitment for the Ondo Real Estate website and services.",
})


export default function AccessibilityPage() {
  const accessibilityFeatures = [
    {
      title: "Screen Reader Compatibility",
      icon: <Volume2 className="h-6 w-6" aria-hidden="true" />,
      description: "Our website is fully compatible with screen readers and assistive technologies",
      features: ["Semantic HTML structure", "Alt text for all images", "ARIA labels and roles", "Proper heading hierarchy"]
    },
    {
      title: "Keyboard Navigation",
      icon: <Keyboard className="h-6 w-6" aria-hidden="true" />,
      description: "All interactive elements can be accessed using only a keyboard",
      features: ["Tab navigation support", "Skip links for main content", "Focus indicators", "Keyboard shortcuts"]
    },
    {
      title: "Visual Accessibility",
      icon: <Eye className="h-6 w-6" aria-hidden="true" />,
      description: "High contrast and clear visual design for users with visual impairments",
      features: ["WCAG AA compliant color contrast", "Resizable text", "Clear typography", "Consistent visual hierarchy"]
    },
    {
      title: "Motor Accessibility",
      icon: <MousePointer className="h-6 w-6" aria-hidden="true" />,
      description: "Large click targets and alternative input methods for users with motor disabilities",
      features: ["Large touch targets", "Alternative input methods", "Drag and drop alternatives", "Voice control support"]
    },
    {
      title: "Mobile Accessibility",
      icon: <Smartphone className="h-6 w-6" aria-hidden="true" />,
      description: "Fully responsive design that works on all devices and screen sizes",
      features: ["Responsive design", "Touch-friendly interfaces", "Mobile screen reader support", "Gesture alternatives"]
    },
    {
      title: "Cognitive Accessibility",
      icon: <Monitor className="h-6 w-6" aria-hidden="true" />,
      description: "Clear, simple design that's easy to understand and navigate",
      features: ["Simple language", "Clear navigation", "Consistent layout", "Error prevention"]
    }
  ]

  const standards = [
    { name: "WCAG 2.1 AA", level: "Level AA", description: "Web Content Accessibility Guidelines" },
    { name: "Section 508", level: "Federal", description: "U.S. federal accessibility standards" },
    { name: "ADA Compliance", level: "Legal", description: "Americans with Disabilities Act" }
  ]

  const testingMethods = [
    "Automated accessibility testing tools",
    "Manual testing with assistive technologies",
    "User testing with people with disabilities",
    "Regular accessibility audits and reviews"
  ]

  return (
    <main className="min-h-screen">
      <SEO
        title="Accessibility Statement | Ondo Real Estate"
        description="Learn about Ondo Real Estate's commitment to web accessibility and the features we provide for users with disabilities."
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
        backgroundImage="/modern-office-building.png"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Accessibility Commitment</h2>
              <p className="text-xl text-foreground/70">
                Ondo Real Estate is committed to ensuring digital accessibility for people with disabilities. 
                We continually improve the user experience for everyone and apply the relevant accessibility standards.
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
                  <CardTitle>Compliance Standards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {standards.map((standard, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{standard.name}</p>
                          <p className="text-sm text-foreground/70">{standard.description}</p>
                        </div>
                        <Badge variant="secondary">{standard.level}</Badge>
                      </div>
                    ))}
                  </div>
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
                      <h4 className="font-semibold mb-2">Accessibility Coordinator</h4>
                      <p className="text-sm text-foreground/70">Sarah Johnson</p>
                      <p className="text-sm text-foreground/70">{SITE_EMAILS.accessibility}</p>
                      <p className="text-sm text-foreground/70">{SITE_PHONE}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Response Time</h4>
                      <p className="text-sm text-foreground/70">We aim to respond to accessibility feedback within 2 business days</p>
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
                    We are committed to continuously improving the accessibility of our website. This includes:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground/70">Regular accessibility audits and testing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground/70">Training our team on accessibility best practices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground/70">Implementing user feedback and suggestions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground/70">Staying updated with accessibility standards and guidelines</span>
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
