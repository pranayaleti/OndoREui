// NOTE(i18n): server component, privacy policy is intentionally English-only.
// Legal copy translation requires a lawyer review per jurisdiction; tracked as
// a Phase 1 follow-up. Until then keep the en page authoritative.
import { PageBanner } from "@/components/page-banner"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL, SITE_EMAILS, SITE_PHONE, pageTitle, pageTitleText } from "@/lib/site"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Eye, Lock, Database, Mail, Phone, Cookie, MessageSquare, Bot, Landmark, Share2 } from "lucide-react"
import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: pageTitle("Privacy Policy | Ondo Real Estate"),
  description: "Learn how Ondo Real Estate protects your personal information and privacy. Read our comprehensive privacy policy.",
  alternates: { canonical: `${SITE_URL}/privacy-policy/` },
  openGraph: {
    type: "website",
    title: pageTitleText("Privacy Policy | Ondo Real Estate"),
    description: "Learn how Ondo Real Estate protects your personal information and privacy. Read our comprehensive privacy policy.",
    images: DEFAULT_OG_IMAGES,
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE_URL] },
}


/** Cookies and browser storage the site sets or reads. Keep in step with the code that writes them. */
const STORAGE_ROWS = [
  {
    name: "hubspotutk, __hstc, __hssc, __hssrc",
    who: "HubSpot",
    purpose: "Recognize a browser across visits, tie form submissions to the pages visited, and measure sessions.",
    type: "Cookies",
  },
  {
    name: "Google Analytics and Google Tag Manager cookies (for example _ga)",
    who: "Google",
    purpose: "Measure traffic and page performance. Loaded only when we turn them on.",
    type: "Cookies",
  },
  {
    name: "ondo.marketing_attribution.v1",
    who: "Ondo Real Estate",
    purpose: "Remember the campaign or referrer (UTM tags, ad click IDs) that brought you here, so a form you send is credited to it.",
    type: "Local storage",
  },
  {
    name: "ondo_lead_captured",
    who: "Ondo Real Estate",
    purpose: "Remember that you already left your email on a calculator, so we do not ask again. We do not store the email itself in your browser.",
    type: "Local storage",
  },
  {
    name: "ondo:favorites, listing compare list, rental application draft",
    who: "Ondo Real Estate",
    purpose: "Keep your saved homes, compare list and an unfinished rental application on your device.",
    type: "Local storage",
  },
  {
    name: "ondo_user_zipcode, ondo_user_last_visit, property-match-zipcode",
    who: "Ondo Real Estate",
    purpose: "Remember the ZIP code you searched for during this visit.",
    type: "Session storage",
  },
  {
    name: "Theme and banner choices",
    who: "Ondo Real Estate",
    purpose: "Remember light or dark display and notices you closed.",
    type: "Local storage",
  },
]

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 30, 2026"

  const sections = [
    {
      title: "Information We Collect",
      icon: <Database className="h-6 w-6" />,
      content: [
        "Personal information you provide (name, email, phone number, address)",
        "Property information and preferences, including saved homes and search filters",
        "Financial information you choose to give us for loan questions, rental applications and property management",
        "Messages you send through forms, the contact page and the AI assistant",
        "Usage data from our website: pages viewed, searches, clicks, device and browser type, approximate location from your IP address, and the campaign or referrer that brought you here",
        "Communication records and correspondence, including calls and texts with our team"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: <Eye className="h-6 w-6" />,
      content: [
        "Provide real estate and property management services",
        "Answer loan and financing questions and route your request to the right person",
        "Process rental applications, payments and other transactions",
        "Communicate about properties, services, and updates",
        "Measure and improve our website and services",
        "Comply with legal and regulatory requirements"
      ]
    },
    {
      title: "Information Sharing",
      icon: <Shield className="h-6 w-6" />,
      content: [
        "We do not sell your personal information to third parties",
        "We share information with service providers who help us run the site and our services, and who may use it only to do that work for us. They are listed in the next section",
        "If we turn on advertising or retargeting pixels (for example Meta, TikTok or LinkedIn), we will update this policy first, and sharing with those companies for advertising would be described here",
        "Information may be shared when required for legal compliance, to enforce our terms, or to protect the rights, property, or safety of Ondo Real Estate, our users, or others",
        "Aggregated or de-identified data that cannot reasonably be linked back to you may be used for business purposes"
      ]
    },
    {
      title: "Data Security",
      icon: <Lock className="h-6 w-6" />,
      content: [
        "We use encryption in transit and access controls, and we limit access to personal information to people who need it for their work",
        "No website or storage system is completely secure, so please do not send Social Security numbers, bank account numbers or full credit reports through website forms, chat or text",
        "We keep personal information only as long as we need it for the purposes above or as the law requires"
      ]
    }
  ]

  const vendors = [
    { name: "Supabase", role: "Database, sign-in and our own first-party site analytics (searches, clicks, sessions)" },
    { name: "HubSpot", role: "Contact records, forms, email follow-up and website tracking cookies" },
    { name: "Resend", role: "Sending email from our systems" },
    { name: "Stripe", role: "Payment processing. Card details go to Stripe and are not stored by us" },
    { name: "Calendly", role: "Scheduling calls and tours. If you open a scheduling widget, Calendly sees your visit and what you enter" },
    { name: "Cloudflare and GitHub Pages", role: "Hosting, content delivery, security filtering and DNS. They see your IP address and the pages you request" },
    { name: "Google Analytics and Google Tag Manager", role: "Traffic measurement, loaded only when we turn them on" },
    { name: "OpenStreetMap and Unsplash", role: "Map tiles and some photos load straight from these providers, so they see your IP address and browser details" },
    { name: "AI model providers", role: "Process assistant messages on our behalf, described below" },
    { name: "Visitor identification service (for example rb2b)", role: "Used only if we turn it on and list it here. It is not part of this policy until then" },
  ]

  return (
    <main className="min-h-screen">
      <SEO
        title="Privacy Policy | Ondo Real Estate"
        description="Learn how Ondo Real Estate protects your personal information and privacy. Read our comprehensive privacy policy."
        pathname="/privacy-policy"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Privacy Policy", url: `${SITE_URL}/privacy-policy` },
        ])}
      />
      <PageBanner
        title="Privacy Policy"
        subtitle="Your privacy and data protection are our top priorities"
        backgroundImage="/modern-office-building.webp"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-lg text-foreground/70 mb-4">
                Last updated: <strong>{lastUpdated}</strong>
              </p>
              <p className="text-foreground/70">
                This Privacy Policy describes how Ondo Real Estate collects, uses, and protects your personal information 
                when you use our services or visit our website.
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

            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Share2 className="h-6 w-6" />
                  Service Providers and Third Parties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-foreground/70">
                  These companies handle information for us or load content in your browser while you use the site.
                </p>
                <ul className="space-y-2">
                  {vendors.map((vendor) => (
                    <li key={vendor.name} className="flex items-start gap-2">
                      <span className="text-primary mt-1">&bull;</span>
                      <span className="text-foreground/70">
                        <strong className="text-foreground">{vendor.name}:</strong> {vendor.role}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="mt-8" id="cookies">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Cookie className="h-6 w-6" />
                  Cookies, Tracking and Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/70">
                <p>
                  We use HubSpot tracking cookies to connect visits to the forms you send, so a person on our team can
                  follow up with context. We also run our own analytics in Supabase to see which pages and searches
                  are useful. Google Analytics and Google Tag Manager load only when we turn them on.
                </p>
                <p>
                  You can block or delete cookies and site data in your browser settings, and the site still works
                  without them, though saved homes and drafts will not carry over. Some marketing tags are not loaded
                  for visitors in Europe.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <caption className="sr-only">Cookies and browser storage used by this site</caption>
                    <thead>
                      <tr className="border-b border-border text-foreground">
                        <th scope="col" className="py-2 pr-4 font-semibold">Name</th>
                        <th scope="col" className="py-2 pr-4 font-semibold">Set by</th>
                        <th scope="col" className="py-2 pr-4 font-semibold">Type</th>
                        <th scope="col" className="py-2 font-semibold">Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STORAGE_ROWS.map((row) => (
                        <tr key={row.name} className="border-b border-border align-top">
                          <td className="py-2 pr-4 break-words">{row.name}</td>
                          <td className="py-2 pr-4">{row.who}</td>
                          <td className="py-2 pr-4">{row.type}</td>
                          <td className="py-2">{row.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-8" id="sms">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6" />
                  Text Messages (SMS)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/70">
                <p>
                  If you give us a mobile number and agree to receive texts, we use it to message you about the
                  request you made, such as tour confirmations, application updates, and rent or maintenance notices.
                  Agreeing to texts is never required to rent, buy, sell or get a loan quote from us.
                </p>
                <p>
                  Message frequency varies. Message and data rates may apply. Reply STOP to any text to opt out, or HELP
                  for help. We do not sell your mobile number, and we do not share text-message opt-in data with third
                  parties for their own marketing.
                </p>
              </CardContent>
            </Card>

            <Card className="mt-8" id="ai-assistant">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Bot className="h-6 w-6" />
                  AI Assistant and Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/70">
                <p>
                  When you use the AI assistant or leasing chat, we collect what you type, the answers it gives, the
                  property you were asking about, and any contact details you share. Our team and our service providers
                  can read these conversations to answer you, book a tour, keep records and improve the assistant. The
                  assistant is software, not a person, and it can be wrong, so check anything important with our team.
                </p>
                <p>
                  A chat session is not saved in your browser. Do not put Social Security numbers, bank account numbers
                  or passwords in a chat. We keep conversations only as long as we need them for these purposes or as the law requires.
                </p>
              </CardContent>
            </Card>

            <Card className="mt-8" id="loan-information">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Landmark className="h-6 w-6" />
                  Loan-Related Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/70">
                <p>
                  If you ask about financing, we collect what you tell us, such as income, assets, credit-related
                  details, the property and the loan amount you are considering. Calculators on this site run in your
                  browser, and what you type stays there unless you choose to submit a form.
                </p>
                <p>
                  A contact form on a loan page is a request for information, not a loan application. We use loan
                  information to answer your question and follow up, we do not sell it, and we share it only with the
                  providers listed above and as the law requires.
                </p>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-foreground/70">
                    Depending on where you live and the law that applies, you may have the right to know what personal
                    information we hold about you, get a copy, correct it, delete it, and opt out of targeted advertising,
                    the sale of personal information, or sharing it for advertising. We do not sell personal information.
                    You can also opt out of marketing emails and texts at any time.
                  </p>
                  <p className="text-foreground/70">
                    To make a request, email {SITE_EMAILS.privacy} or call {SITE_PHONE}. Tell us what you want and the
                    email address or phone number you used with us, so we can find your records and confirm it is you.
                    We will answer within the time the law that applies to you requires. If we decline a request, we will
                    explain why.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-sm text-foreground/70">{SITE_EMAILS.privacy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">Phone</p>
                        <p className="text-sm text-foreground/70">{SITE_PHONE}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Changes to This Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-foreground/70">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our services, technology,
                    or legal obligations. When we make changes, we will post the revised policy on this page and update
                    the &ldquo;Last updated&rdquo; date above.
                  </p>
                  <p>
                    For <strong>material changes</strong>, meaning changes that significantly affect your rights or
                    how your information is used, we will provide advance notice (for example, by email or a
                    prominent notice on the site) before the change takes effect, and we will obtain your consent or
                    provide an opt-out where required by applicable law.
                  </p>
                  <p>
                    Continuing to use our services after the effective date of an updated policy means you accept the
                    revised terms, except where additional consent is required by law. We encourage you to review this
                    Privacy Policy periodically.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-12">
              <h2 className="text-2xl font-bold mb-4">Questions About Our Privacy Policy?</h2>
              <p className="text-foreground/70 mb-6">
                If you have any questions about this Privacy Policy or our data practices, please don't hesitate to contact us.
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
