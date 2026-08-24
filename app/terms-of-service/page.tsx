import type { Metadata } from "next"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_EMAILS, SITE_PHONE, SITE_ADDRESS_STREET, SITE_ADDRESS_CITY, SITE_ADDRESS_REGION, SITE_ADDRESS_POSTAL_CODE } from "@/lib/site"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Scale, Shield, AlertTriangle, CheckCircle, Users } from "lucide-react"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

export const metadata: Metadata = pageCanonicalMetadata("/terms-of-service", {
  title: "Terms of Service | Ondo Real Estate",
  description: "Terms of service for using the Ondo Real Estate website and related services.",
})


export default function TermsOfServicePage() {
  const lastUpdated = "December 15, 2024"

  const sections = [
    {
      title: "Acceptance of Terms",
      icon: <CheckCircle className="h-6 w-6" />,
      content: [
        "By accessing or using our services, you agree to be bound by these Terms of Service",
        "If you do not agree to these terms, please do not use our services",
        "We reserve the right to modify these terms at any time",
        "Continued use of our services after changes constitutes acceptance of new terms"
      ]
    },
    {
      title: "Description of Services",
      icon: <FileText className="h-6 w-6" />,
      content: [
        "Real estate property management services",
        "Property listing and search services",
        "Mortgage and loan application assistance",
        "Real estate calculators and tools",
        "Property buying and selling assistance"
      ]
    },
    {
      title: "User Responsibilities",
      icon: <Users className="h-6 w-6" />,
      content: [
        "Provide accurate and complete information",
        "Maintain the confidentiality of your account credentials",
        "Use our services only for lawful purposes",
        "Respect the rights of other users and third parties",
        "Comply with all applicable laws and regulations"
      ]
    },
    {
      title: "Prohibited Uses",
      icon: <AlertTriangle className="h-6 w-6" />,
      content: [
        "Violating any applicable laws or regulations",
        "Transmitting harmful or malicious code",
        "Attempting to gain unauthorized access to our systems",
        "Interfering with the proper functioning of our services",
        "Using our services for fraudulent or deceptive purposes"
      ]
    },
    {
      title: "Intellectual Property",
      icon: <Scale className="h-6 w-6" />,
      content: [
        "All content on our website is protected by copyright and other intellectual property laws",
        "You may not reproduce, distribute, or modify our content without permission",
        "User-generated content remains the property of the user",
        "We may use user-generated content for marketing and promotional purposes"
      ]
    },
    {
      title: "Limitation of Liability",
      icon: <Shield className="h-6 w-6" />,
      content: [
        "Our services are provided 'as is' without warranties of any kind",
        "We are not liable for any indirect, incidental, or consequential damages",
        "Our total liability is limited to the amount paid for our services",
        "Some jurisdictions may not allow limitation of liability, so these limitations may not apply to you"
      ]
    }
  ]

  return (
    <main className="min-h-screen">
      <SEO
        title="Terms of Service | Ondo Real Estate"
        description="Read the terms and conditions for using Ondo Real Estate's services. Understand your rights and responsibilities."
        pathname="/terms-of-service"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Terms of Service", url: `${SITE_URL}/terms-of-service` },
        ])}
      />
      <PageBanner
        title="Terms of Service"
        subtitle="Understanding your rights and responsibilities when using our services"
        backgroundImage="/modern-office-building.png"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-lg text-foreground/70 mb-4">
                Last updated: <strong>{lastUpdated}</strong>
              </p>
              <p className="text-foreground/70">
                These Terms of Service govern your use of Ondo Real Estate's website and services. 
                Please read them carefully before using our services.
              </p>
            </div>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      {section.icon}
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-foreground/70">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="mt-12">
              <CardHeader>
                <CardTitle>Governing Law and Dispute Resolution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-foreground/70">
                    These Terms of Service are governed by the laws of the State of Utah, United States. 
                    Any disputes arising from these terms or your use of our services will be resolved 
                    through binding arbitration in accordance with the rules of the American Arbitration Association.
                  </p>
                  <p className="text-foreground/70">
                    If any provision of these terms is found to be unenforceable, the remaining provisions 
                    will remain in full force and effect.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-sm text-foreground/70">{SITE_EMAILS.legal}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-sm text-foreground/70">{SITE_PHONE}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-sm text-foreground/70">
                      Ondo Real Estate<br />
                      {SITE_ADDRESS_STREET}<br />
                      {`${SITE_ADDRESS_CITY}, ${SITE_ADDRESS_REGION} ${SITE_ADDRESS_POSTAL_CODE}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-12">
              <h3 className="text-2xl font-bold mb-4">Need Help Understanding These Terms?</h3>
              <p className="text-foreground/70 mb-6">
                Our legal team is available to answer any questions you may have about these terms and conditions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/contact">Contact Legal Team</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/privacy-policy">Read Privacy Policy</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
