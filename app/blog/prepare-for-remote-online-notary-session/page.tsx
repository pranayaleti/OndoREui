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
  title: "Checklist: Prepare for Your Remote Online Notary Session | Ondo Real Estate",
  description: "Follow this RON checklist to pass ID verification, avoid rescheduling, and receive sealed documents immediately after your remote online notarization.",
  alternates: { canonical: `${SITE_URL}/blog/prepare-for-remote-online-notary-session/` },
  openGraph: {
    title: "Checklist: Prepare for Your Remote Online Notary Session | Ondo Real Estate",
    description: "Follow this RON checklist to pass ID verification, avoid rescheduling, and receive sealed documents immediately after your remote online notarization.",
    type: "article",
    publishedTime: "2025-01-10",
    modifiedTime: "2025-01-10",
    authors: ["ONDO Notary Team"],
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: "Checklist: Prepare for Your Remote Online Notary Session | Ondo Real Estate",
    description: "Follow this RON checklist to pass ID verification, avoid rescheduling, and receive sealed documents immediately after your remote online notarization.",
    images: [DEFAULT_OG_IMAGE_URL],
  },
}


const published = "2025-01-10";
const modified = "2025-01-10";
const slug = "/blog/prepare-for-remote-online-notary-session";

const keywords = [
  "remote online notary checklist",
  "RON requirements",
  "online notary ID verification",
  "how to prepare for online notarization",
  "virtual notary checklist",
  "RON borrower checklist",
];

const prepSteps = [
  {
    title: "Verify IDs",
    detail: "Government-issued photo ID for every signer; ensure names match the documents.",
  },
  {
    title: "Test Your Tech",
    detail: "Stable internet, camera, microphone, and a quiet, well-lit space for the session.",
  },
  {
    title: "Final Documents",
    detail: "Upload the final PDF, no drafts, so the notarized copy matches lender/title requirements.",
  },
  {
    title: "Know Witness Rules",
    detail: "Some states or lenders require witnesses; confirm early so we can schedule them.",
  },
  {
    title: "Payment Ready",
    detail: "Have payment method available for platform fees, notarizations, and any rush services.",
  },
];

export default function PrepareForRemoteOnlineNotarySession() {
  return (
    <main className="min-h-screen">
      <SEO
        title="Checklist: Prepare for Your Remote Online Notary Session"
        description="Follow this RON checklist to pass ID verification, avoid rescheduling, and receive sealed documents immediately after your remote online notarization."
        pathname={slug}
        image={`${SITE_URL}/modern-office-building.png`}
        publishedTime={published}
        modifiedTime={modified}
        author="ONDO Notary Team"
        section="Notary"
        tags={["Remote Online Notary", "Checklist", "ID Verification", "RON Prep"]}
        keywords={keywords}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Checklist: Prepare for Your Remote Online Notary Session",
          description:
            "A step-by-step checklist to prepare for Remote Online Notarization and avoid delays.",
          author: { "@type": "Organization", name: "ONDO Notary" },
          datePublished: published,
          dateModified: modified,
          mainEntityOfPage: `${SITE_URL}${slug}`,
        }}
      />

      <PageBanner
        title="Checklist: Prepare for Your Remote Online Notary Session"
        subtitle="Pass ID verification, avoid reschedules, and get sealed PDFs right after your RON."
        backgroundImage="/modern-office-building.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Checklist</Badge>
            <Badge variant="outline">Remote Online Notary</Badge>
            <Badge variant="outline">Client Prep</Badge>
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
            <CardSpot title="Goal" body="Pass ID/KBA on the first try and avoid reschedules." />
            <CardSpot title="Prep focus" body="IDs, tech, final PDFs, and any witness rules confirmed early." />
            <CardSpot title="Outcome" body="Sealed PDF + audit trail delivered immediately after the session." />
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p>
              A smooth Remote Online Notary (RON) session starts with preparation. Use this checklist
              to pass identity verification, keep the appointment short, and receive a sealed PDF and
              audit trail immediately after the call.
            </p>

            <h2>Pre-Session Checklist</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prepSteps.map((step) => (
                <Card key={step.title} className="bg-muted border-border">
                  <CardContent className="p-4">
                    <p className="font-semibold text-foreground">{step.title}</p>
                    <p className="text-sm text-foreground/70">{step.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2>Day-of Best Practices</h2>
            <ul>
              <li>Join from a laptop or desktop when possible for the most reliable experience.</li>
              <li>Have all signers present and on-camera; keep IDs within reach.</li>
              <li>Close bandwidth-heavy apps to keep audio and video stable.</li>
              <li>Confirm any witness requirements before the call to avoid rescheduling.</li>
            </ul>

            <h3>Session Flow (Diagram)</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
{`Pre-check: IDs + final PDF + witness rules
          ↓
Join call → KBA → ID scan → live notarization
          ↓
E-seal + audit trail → download & share with title/lender`}
            </pre>

            <h2>After the Session</h2>
            <ul>
              <li>Download the notarized PDF and audit trail immediately.</li>
              <li>Send the file to your title company, lender, or attorney as required.</li>
              <li>Keep the file in your records; request a re-send from us if you misplace it.</li>
            </ul>

            <h2>Need Help or a Rush Appointment?</h2>
            <p>
              If you are new to Remote Online Notarization, we can walk through ID checks, platform
              setup, and witness needs ahead of time. Same-day and after-hours blocks are available.
            </p>
            <ul>
              <li>Call or text: {SITE_PHONE}</li>
              <li>Email: {SITE_EMAILS.primary}</li>
              <li>
                Book online: <Link href="/notary" className="text-primary underline">/notary</Link>
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
