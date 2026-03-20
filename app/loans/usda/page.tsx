import { PageBanner } from "@/components/page-banner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DollarSign, MapPin, Home, CheckCircle } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "USDA Rural Loans in Utah | Zero Down | Ondo Real Estate",
  description: "USDA loans offer zero down payment for eligible rural and suburban Utah areas. Learn about income limits, eligible areas (Cache Valley, Sanpete), and how to qualify.",
  alternates: { canonical: `${SITE_URL}/loans/usda/` },
  openGraph: { title: "USDA Rural Loans in Utah | Zero Down | Ondo Real Estate", description: "USDA loans offer zero down payment for eligible rural Utah areas." },
  twitter: { card: "summary_large_image", title: "USDA Loans in Utah | Ondo Real Estate", description: "Zero down payment loans for eligible rural and suburban Utah areas." },
}

const benefits = [
  { title: "Zero Down Payment", description: "100% financing with no down payment required for eligible properties and borrowers", icon: <DollarSign className="h-6 w-6" /> },
  { title: "Rural Utah Coverage", description: "Many suburban Utah areas qualify — Cache Valley, Sanpete County, rural Utah County, and more", icon: <MapPin className="h-6 w-6" /> },
  { title: "Lower Mortgage Insurance", description: "USDA guarantee fee (1%) and annual fee (0.35%) are lower than FHA MIP over the life of the loan", icon: <Home className="h-6 w-6" /> },
  { title: "Competitive Fixed Rates", description: "Government-backed guarantee enables competitive 30-year fixed rates for qualified borrowers", icon: <CheckCircle className="h-6 w-6" /> },
]

export default function USDALoanPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="USDA Rural Loans in Utah"
        description="USDA loans offer zero down payment for eligible rural and suburban Utah areas."
        pathname="/loans/usda"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Loans", url: `${SITE_URL}/loans` },
          { name: "USDA Loans", url: `${SITE_URL}/loans/usda` },
        ])}
      />
      <PageBanner title="USDA Rural Loans" subtitle="Zero down payment financing for eligible rural and suburban Utah communities" backgroundImage="/modern-office-building.png" />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Is a USDA Loan?</h2>
              <p className="text-lg text-foreground/70">
                USDA Rural Development loans are backed by the U.S. Department of Agriculture to support homeownership in rural and suburban communities. They offer zero down payment and competitive rates — and more Utah areas qualify than most buyers realise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {benefits.map((b, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mb-4 text-primary">{b.icon}</div>
                    <CardTitle>{b.title}</CardTitle>
                    <CardDescription>{b.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6">USDA Loan Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Income Limits</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Household income must be ≤115% of area median income (AMI)</li>
                    <li>• Salt Lake County: ~$110,000–130,000 for a family of 4 (verify at eligibility.sc.egov.usda.gov)</li>
                    <li>• All household income counts — not just borrowers on the loan</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Eligible Utah Areas</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Cache Valley (Logan, Hyrum, Richmond)</li>
                    <li>• Sanpete County (Manti, Ephraim, Mt. Pleasant)</li>
                    <li>• Rural Utah County pockets (Elk Ridge, Woodland Hills)</li>
                    <li>• Many Box Elder, Millard, Sevier county communities</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Fees</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Upfront guarantee fee: 1.0% of loan (financed)</li>
                    <li>• Annual fee: 0.35% of remaining balance</li>
                    <li>• No monthly PMI — annual fee is significantly lower than FHA MIP</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3">Property & Credit</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Must be primary residence; no investment properties</li>
                    <li>• Minimum 640 credit score for GUS automated approval</li>
                    <li>• Manual underwrite possible below 640 with strong file</li>
                    <li>• Property must be in USDA-eligible area (verify before offer)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-4">USDA vs. FHA: Which Zero-Down Option Fits?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-primary">USDA Advantages</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• Lower annual fee (0.35% vs FHA's 0.55%+)</li>
                    <li>• No upfront MIP structure — just the 1% guarantee fee</li>
                    <li>• Annual fee can drop off (unlike FHA MIP for life)</li>
                    <li>• Often lower total cost over 30 years vs FHA</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-primary">FHA Advantages</h4>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• No geographic restriction — works anywhere in Utah</li>
                    <li>• Lower minimum credit score (580 vs 640 for USDA)</li>
                    <li>• No household income cap</li>
                    <li>• Higher loan limits for higher-priced markets</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">Check Your Eligibility</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg"><Link href="/qualify">Get Pre-Approved</Link></Button>
                <Button asChild variant="outline" size="lg"><Link href="/loans">Compare All Loan Types</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
