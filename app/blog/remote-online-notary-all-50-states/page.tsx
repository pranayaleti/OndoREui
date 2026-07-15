import { PageBanner } from "@/components/page-banner";
import SEO from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_EMAILS, SITE_PHONE, SITE_URL } from "@/lib/site";
import NOTARY_SERVICE_AREAS from "@/lib/notary-service-areas";
import Link from "next/link";
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Remote Online Notary in All 50 States | Ondo Real Estate",
  description: "How ONDO Notary delivers secure Remote Online Notarization (RON) across all 50 U.S. states with identity verification, compliant records, and fast scheduling.",
  alternates: { canonical: `${SITE_URL}/blog/remote-online-notary-all-50-states/` },
  openGraph: {
    title: "Remote Online Notary in All 50 States | Ondo Real Estate",
    description: "How ONDO Notary delivers secure Remote Online Notarization (RON) across all 50 U.S. states with identity verification, compliant records, and fast scheduling.",
    type: "article",
    publishedTime: "2025-01-10",
    modifiedTime: "2025-01-10",
    authors: ["ONDO Notary Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Remote Online Notary in All 50 States | Ondo Real Estate",
    description: "How ONDO Notary delivers secure Remote Online Notarization (RON) across all 50 U.S. states with identity verification, compliant records, and fast scheduling.",
  },
}


const published = "2025-01-10";
const modified = "2025-01-10";
const slug = "/blog/remote-online-notary-all-50-states";

const topStates = NOTARY_SERVICE_AREAS.states.slice(0, 10);
const keywords = [
  "remote online notary",
  "online notary in all 50 states",
  "nationwide notarization",
  "RON nationwide",
  "online notary USA",
  "digital notarization",
  "apostille assistance",
  "real estate notarization",
];

export default function RemoteOnlineNotaryAllStatesPage() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Remote Online Notary in All 50 States"
        description="How ONDO Notary delivers secure Remote Online Notarization (RON) across all 50 U.S. states with identity verification, compliant records, and fast scheduling."
        pathname={slug}
        image={`${SITE_URL}/modern-office-building.png`}
        publishedTime={published}
        modifiedTime={modified}
        author="ONDO Notary Team"
        section="Notary"
        tags={["Remote Online Notary", "RON", "Nationwide Notary", "Real Estate"]}
        keywords={keywords}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Remote Online Notary in All 50 States",
          description:
            "How ONDO Notary delivers compliant, secure Remote Online Notarization across all 50 states.",
          author: { "@type": "Organization", name: "ONDO Notary" },
          datePublished: published,
          dateModified: modified,
          mainEntityOfPage: `${SITE_URL}${slug}`,
        }}
      />

      <PageBanner
        title="Remote Online Notary in All 50 States"
        subtitle="Nationwide RON coverage with secure ID checks, audit trails, and lender-ready documents."
        backgroundImage="/modern-office-building.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Remote Online Notary</Badge>
            <Badge variant="outline">Nationwide</Badge>
            <Badge variant="outline">Compliance & Security</Badge>
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

          <div className="not-prose mb-6">
            <Link
              href="/notary/locations/"
              className="text-primary underline-offset-4 hover:underline font-semibold"
            >
              Browse all notary locations
            </Link>
          </div>

          {/* Gestalt: quick anchors */}
          <div className="not-prose grid gap-4 md:grid-cols-3 mb-10">
            <CardSpot title="Who it's for" body="Borrowers, sellers, businesses, and estates needing notarization anywhere in the US." />
            <CardSpot title="What you get" body="RON with ID proofing, live session, audit trail, and instant PDF delivery." />
            <CardSpot title="Flow" body="Upload → ID/KBA → live video → e-seal → download + retention." />
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p>
              ONDO Notary delivers Remote Online Notarization (RON) to clients in all 50 U.S. states.
              We use identity verification, secure video, electronic seal, and full audit trails to
              keep your documents lender- and title-ready—without travel or scheduling delays.
            </p>

            <h2>How Nationwide RON Works</h2>
            <ul>
              <li>
                <strong>Identity proofing & KBA:</strong> Government ID scan plus knowledge-based
                authentication for compliant identity verification.
              </li>
              <li>
                <strong>Live audio/video session:</strong> Secure session with credentialed notary,
                including screen recording and tamper-evident electronic seal.
              </li>
              <li>
                <strong>Digital delivery:</strong> Completed, sealed PDFs with audit trail delivered
                immediately after the session.
              </li>
              <li>
                <strong>Retention & logs:</strong> Compliant storage with date/time, IP, device, and
                ID validation details to satisfy lender and title requirements.
              </li>
            </ul>

            <h3>Session Flow (Diagram)</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
{`User uploads docs
    ↓
ID scan + KBA check
    ↓
Live video with notary (recorded)
    ↓
E-seal + journal entry
    ↓
PDF + audit trail delivered`}
            </pre>

            <h2>When to Choose Remote Online Notary</h2>
            <ul>
              <li>Real estate closings, HELOCs, and investment property packages across states</li>
              <li>Power of Attorney, affidavits, estate documents, and sworn statements</li>
              <li>Business agreements, vendor contracts, and board resolutions</li>
              <li>Out-of-state parties who cannot travel but need same-day execution</li>
            </ul>

            <h2>State-by-State Coverage Highlights</h2>
            <p className="mb-4">
              We service every state. Here are the most requested locations for online notarization:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {topStates.map((state) => (
                <Card key={state.slug} className="bg-muted border-border">
                  <CardContent className="p-4">
                    <p className="font-semibold text-foreground">{state.name}</p>
                    <p className="text-sm text-foreground/70">
                      Remote online notarization with ID verification, electronic seal, and download-ready PDFs.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2>Security, Compliance, and Recordkeeping</h2>
            <ul>
              <li>Live ID verification, multi-factor checks, and credential analysis</li>
              <li>Tamper-evident seals and hash-based integrity for completed files</li>
              <li>Recorded sessions with time stamps and signer location disclosures</li>
              <li>Secure document delivery plus optional retention for your records</li>
            </ul>

            <div className="not-prose my-6 grid gap-3 md:grid-cols-2">
              <CardSpot title="Compliance" body="Recording + audit trails satisfy lender, title, and many state RON rules." />
              <CardSpot title="Risk control" body="ID proofing and device/IP logging reduce fraud and rework." />
            </div>

            <h2>Scheduling & Turnaround</h2>
            <ul>
              <li><strong>Same-day appointments:</strong> Priority windows for urgent closings</li>
              <li><strong>Evenings and weekends:</strong> After-hours RON for multi-time-zone teams</li>
              <li><strong>Document prep review:</strong> Quick checks to reduce meeting rework</li>
            </ul>

            <h2>Ready to Notarize Anywhere?</h2>
            <p>
              Book a Remote Online Notary session or ask compliance questions. We’ll align with your
              title company, lender, or legal requirements.
            </p>
            <ul>
              <li>Call or text: {SITE_PHONE}</li>
              <li>Email: {SITE_EMAILS.primary}</li>
              <li>
                Notary services: <Link href="/notary" className="text-primary underline">/notary</Link>
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
