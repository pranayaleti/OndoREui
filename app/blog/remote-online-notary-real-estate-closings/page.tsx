import { PageBanner } from "@/components/page-banner";
import SEO from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_EMAILS, SITE_PHONE, SITE_URL } from "@/lib/site";
import Link from "next/link";
import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

export const metadata: Metadata = {
  title: "Remote Online Notary for Real Estate Closings | Ondo Real Estate",
  description: "Use ONDO Remote Online Notary for purchases, refinances, HELOCs, and investor closings with compliant ID checks, audit trails, and title-ready documents.",
  alternates: { canonical: `${SITE_URL}/blog/remote-online-notary-real-estate-closings/` },
  openGraph: {
    title: "Remote Online Notary for Real Estate Closings | Ondo Real Estate",
    description: "Use ONDO Remote Online Notary for purchases, refinances, HELOCs, and investor closings with compliant ID checks, audit trails, and title-ready documents.",
    type: "article",
    publishedTime: "2025-01-10",
    modifiedTime: "2025-01-10",
    authors: ["ONDO Notary Team"],
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: "Remote Online Notary for Real Estate Closings | Ondo Real Estate",
    description: "Use ONDO Remote Online Notary for purchases, refinances, HELOCs, and investor closings with compliant ID checks, audit trails, and title-ready documents.",
    images: [DEFAULT_OG_IMAGE_URL],
  },
}


const published = "2025-01-10";
const modified = "2025-01-10";
const slug = "/blog/remote-online-notary-real-estate-closings";

const keywords = [
  "remote online notary real estate",
  "RON for closings",
  "loan signing agent online",
  "online notary for investors",
  "remote notarization for HELOC",
  "title company notary",
  "virtual closing notary",
];

const closingUseCases = [
  { title: "Buyers & Sellers", detail: "Purchase and sale packages with lender and title approvals." },
  { title: "Investors & 1031", detail: "Remote notarization for multi-state portfolios and exchanges." },
  { title: "Refi & HELOC", detail: "Fast RON appointments to keep rate locks on schedule." },
  { title: "Private Lenders", detail: "Promissory notes, deeds of trust, and guarantees executed online." },
];

export default function RemoteOnlineNotaryRealEstateClosings() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Remote Online Notary for Real Estate Closings"
        description="Use ONDO Remote Online Notary for purchases, refinances, HELOCs, and investor closings with compliant ID checks, audit trails, and title-ready documents."
        pathname={slug}
        image={`${SITE_URL}/modern-townhouse-garage.png`}
        publishedTime={published}
        modifiedTime={modified}
        author="ONDO Notary Team"
        section="Notary"
        tags={["Remote Online Notary", "Real Estate Closing", "Loan Signing", "Investors"]}
        keywords={keywords}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Remote Online Notary for Real Estate Closings",
          description:
            "How ONDO Notary supports purchases, refinances, HELOCs, and investor closings with compliant Remote Online Notarization.",
          author: { "@type": "Organization", name: "ONDO Notary" },
          datePublished: published,
          dateModified: modified,
          mainEntityOfPage: `${SITE_URL}${slug}`,
        }}
      />

      <PageBanner
        title="Remote Online Notary for Real Estate Closings"
        subtitle="Lender- and title-ready RON for purchases, refinances, and investor deals."
        backgroundImage="/modern-townhouse-garage.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Real Estate</Badge>
            <Badge variant="outline">Remote Online Notary</Badge>
            <Badge variant="outline">Loan Signing Agent</Badge>
          </div>

          <div className="not-prose mb-6">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Link href="/blog">← Back to blog</Link>
            </Button>
          </div>

          {/* Gestalt: quick anchors */}
          <div className="not-prose grid gap-4 md:grid-cols-3 mb-10">
            <CardSpot title="Who it's for" body="Purchase, refi, HELOC, investors, private lenders, 1031." />
            <CardSpot title="What you get" body="RON with audit trails, e-seals, scan-backs, and lender/title acceptance." />
            <CardSpot title="Flow" body="Confirm acceptance → upload final docs → ID/KBA → live session → delivery." />
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p>
              Title companies and lenders increasingly accept Remote Online Notarization (RON) for
              closings. ONDO Notary runs secure video sessions with ID proofing, KBA, electronic seals,
              and full audit trails so your package is accepted the first time, without last-minute
              scheduling conflicts.
            </p>

            <h2>Where RON Fits in the Closing Timeline</h2>
            <ol>
              <li>Confirm lender/title acceptance and any state-specific requirements.</li>
              <li>Upload the final document set (purchase, refi, HELOC, assignment, or POA).</li>
              <li>Verify IDs and witnesses (if required) before the appointment.</li>
              <li>Conduct the live session with screen recording and electronic seal.</li>
              <li>Deliver sealed PDFs plus audit trail; send scan-backs or courier if needed.</li>
            </ol>

            <h3>Process Map</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
{`Title/Lender OK → Final docs → ID & witness check
        ↓
  Live RON session (recorded)
        ↓
  E-seal + audit log
        ↓
  Scan-back / courier on request`}
            </pre>

            <h2>Use Cases We Handle Daily</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {closingUseCases.map((item) => (
                <Card key={item.title} className="bg-muted border-border">
                  <CardContent className="p-4">
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-foreground/70">{item.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2>Compliance, Recording, and Delivery</h2>
            <ul>
              <li>Government ID check, credential analysis, and knowledge-based authentication</li>
              <li>Recorded video with time stamps, signer location disclosure, and audit log</li>
              <li>Tamper-evident seal and digital integrity checks on completed PDFs</li>
              <li>Scan-backs and lender/title delivery the same day when requested</li>
            </ul>

            <div className="not-prose my-6 grid gap-3 md:grid-cols-2">
              <CardSpot title="Acceptance" body="Audit trails and seals align with common lender/title requirements." />
              <CardSpot title="Risk control" body="Early ID/witness checks reduce re-signs and funding delays." />
            </div>

            <h2>Tips to Avoid Delays</h2>
            <ul>
              <li>Share lender or title requirements (e.g., witness rules, ink vs. digital) upfront.</li>
              <li>Use final documents, avoid draft PDFs that require re-signing.</li>
              <li>Check device, camera, and connectivity 10 minutes before the session.</li>
              <li>Have all signers present with valid IDs to pass KBA on the first attempt.</li>
            </ul>

            <h2>Book a RON Closing</h2>
            <p>
              We coordinate directly with your title company or lender, confirm state rules, and lock
              in the time that matches funding deadlines.
            </p>
            <ul>
              <li>Call or text: {SITE_PHONE}</li>
              <li>Email: {SITE_EMAILS.primary}</li>
              <li>
                Start online: <Link href="/notary" className="text-primary underline">/notary</Link>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </main>
  );
}

function CardSpot({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/60 p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-primary mb-1">{title}</p>
      <p className="text-sm text-foreground">{body}</p>
    </div>
  );
}
