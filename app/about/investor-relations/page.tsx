import type { Metadata } from "next"
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_EMAILS, SITE_PHONE } from "@/lib/site"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Download, Phone, Mail, Calendar } from "lucide-react"
import { pageCanonicalMetadata } from "@/lib/page-canonical"

export const metadata: Metadata = pageCanonicalMetadata("/about/investor-relations", {
  title: "Investor Relations | Ondo Real Estate",
  description: "Financial information and resources for investors and stakeholders.",
})


export default function InvestorRelationsPage() {
  const financialHighlights = [
    {
      metric: "Revenue Growth",
      value: "25%",
      period: "YoY 2023",
      description: "Strong revenue growth driven by expanded property management services and increased transaction volume"
    },
    {
      metric: "Properties Under Management",
      value: "1,200+",
      period: "Current",
      description: "Growing portfolio of residential and commercial properties across Utah"
    },
    {
      metric: "Client Retention Rate",
      value: "95%",
      period: "2023",
      description: "Exceptional client satisfaction and retention across all service lines"
    },
    {
      metric: "Market Share",
      value: "12%",
      period: "Utah County",
      description: "Leading market position in Utah County property management"
    }
  ]

  const reports = [
    {
      title: "Annual Report 2023",
      description: "Comprehensive overview of our financial performance, strategic initiatives, and market outlook.",
      date: "2024-01-15",
      type: "PDF",
      size: "2.4 MB"
    },
    {
      title: "Q4 2023 Earnings Report",
      description: "Fourth quarter financial results and key performance indicators.",
      date: "2024-01-10",
      type: "PDF",
      size: "1.8 MB"
    },
    {
      title: "Investor Presentation",
      description: "Strategic overview and growth opportunities in the Utah real estate market.",
      date: "2024-01-05",
      type: "PDF",
      size: "3.2 MB"
    },
    {
      title: "ESG Report 2023",
      description: "Environmental, Social, and Governance initiatives and performance metrics.",
      date: "2023-12-20",
      type: "PDF",
      size: "1.5 MB"
    }
  ]

  const upcomingEvents = [
    {
      title: "Q1 2024 Earnings Call",
      date: "2024-04-15",
      time: "2:00 PM MT",
      type: "Conference Call",
      description: "First quarter 2024 financial results and business update"
    },
    {
      title: "Annual Shareholder Meeting",
      date: "2024-05-20",
      time: "10:00 AM MT",
      type: "In-Person",
      description: "Annual meeting of shareholders and board elections"
    },
    {
      title: "Investor Day",
      date: "2024-06-10",
      time: "9:00 AM MT",
      type: "In-Person",
      description: "Strategic overview and property tour for investors"
    }
  ]

  const leadership = [
    {
      name: "Pranay Reddy Aleti",
      title: "Founder & CEO",
      email: "pranay@ondorealestate.com",
      phone: "(555) 123-4567"
    },
    {
      name: "Sarah Johnson",
      title: "Chief Financial Officer",
      email: "sarah@ondorealestate.com",
      phone: "(555) 123-4568"
    },
    {
      name: "Michael Chen",
      title: "Chief Technology Officer",
      email: "michael@ondorealestate.com",
      phone: "(555) 123-4569"
    }
  ]

  return (
    <main className="min-h-screen">
      <SEO
        title="Investor Relations | Ondo Real Estate"
        description="Access financial reports, earnings information, and investor resources for Ondo Real Estate. Learn about our growth strategy and financial performance."
        pathname="/about/investor-relations"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "About", url: `${SITE_URL}/about` },
          { name: "Investor Relations", url: `${SITE_URL}/about/investor-relations` },
        ])}
      />
      <PageBanner
        title="Investor Relations"
        subtitle="Financial information and resources for investors and stakeholders"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 dark:text-foreground">Financial Performance</h2>
              <p className="text-lg text-foreground/70 dark:text-foreground/70">
                Ondo Real Estate continues to demonstrate strong financial performance and growth in the Utah real estate market.
              </p>
            </div>

            {/* Financial Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {financialHighlights.map((highlight, index) => (
                <Card key={index}>
                  <CardHeader className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{highlight.value}</div>
                    <CardTitle className="text-lg dark:text-foreground">{highlight.metric}</CardTitle>
                    <CardDescription>{highlight.period}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/70 dark:text-foreground/70 text-center">
                      {highlight.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Financial Reports */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 dark:text-foreground">Financial Reports & Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map((report, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-6 w-6 text-primary" />
                          <div>
                            <CardTitle className="dark:text-foreground">{report.title}</CardTitle>
                            <CardDescription>{report.description}</CardDescription>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-foreground/70">
                        <div className="flex items-center gap-4">
                          <span>{report.type}</span>
                          <span>{report.size}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(report.date).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 dark:text-foreground">Upcoming Events</h3>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold dark:text-foreground mb-2">{event.title}</h4>
                          <p className="text-foreground/70 dark:text-foreground/70 mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-sm text-foreground/70">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div>{event.time}</div>
                            <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                              {event.type}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline">
                          Register
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Leadership Contact */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8 dark:text-foreground">Investor Relations Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {leadership.map((person, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="dark:text-foreground">{person.name}</CardTitle>
                      <CardDescription>{person.title}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-foreground/70" />
                          <a href={`mailto:${person.email}`} className="text-primary hover:underline">
                            {person.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-foreground/70" />
                          <a href={`tel:${person.phone}`} className="text-primary hover:underline">
                            {person.phone}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-muted dark:bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6 text-center dark:text-foreground">Investor Inquiries</h3>
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-lg text-foreground/70 dark:text-foreground/70 mb-6">
                  For investor inquiries, financial information requests, or to schedule a meeting with our leadership team, 
                  please contact our investor relations department.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link href="/contact">Contact Investor Relations</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href={`mailto:${SITE_EMAILS.investors}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      {SITE_EMAILS.investors}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href={`tel:${SITE_PHONE.replace(/[^+\\d]/g, "")}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      {SITE_PHONE}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4 dark:text-foreground">Important Information</h3>
              <p className="text-sm text-foreground/70 dark:text-foreground/70 max-w-4xl mx-auto">
                The information provided on this page is for informational purposes only and does not constitute 
                investment advice. Past performance does not guarantee future results. Please consult with a 
                qualified financial advisor before making any investment decisions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
