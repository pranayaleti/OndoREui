import { PageBanner } from "@/components/page-banner";
import SEO from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  NOTARY_AFTER_HOURS_USD,
  NOTARY_HOURS_LABEL,
  NOTARY_LOAN_RANGE,
  NOTARY_RON_ACT_USD,
  NOTARY_SAME_DAY_USD,
} from "@/lib/notary-fees";
import { SITE_EMAILS, SITE_PHONE, SITE_URL } from "@/lib/site";
import Link from "next/link";
import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

const TITLE = "Notary in Utah County: Remote Online Notarization, Fees, and How to Book"
const DESCRIPTION =
  "ONDO Notary serves Utah County by Remote Online Notarization (RON), $25 per remote act, same-day when capacity allows. No mobile travel or in-office appointments."

export const metadata: Metadata = {
  title: `${TITLE} | Ondo Real Estate`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog/mobile-notary-utah-county-guide/` },
  openGraph: {
    title: `${TITLE} | Ondo Real Estate`,
    description: DESCRIPTION,
    type: "article",
    publishedTime: "2025-01-10",
    modifiedTime: "2026-08-13",
    authors: ["ONDO Notary Team"],
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_URL],
  },
}

const published = "2025-01-10";
const modified = "2026-08-13";
const slug = "/blog/mobile-notary-utah-county-guide";

const keywords = [
  "remote online notary Utah County",
  "RON Lehi Utah",
  "online notary Provo",
  "notary American Fork",
  "same day notary Utah",
  "loan signing agent Utah County",
  "real estate notary Utah",
];

const serviceAreas = [
  "Lehi",
  "American Fork",
  "Saratoga Springs",
  "Eagle Mountain",
  "Orem",
  "Provo",
  "Draper",
  "Pleasant Grove",
];

export default function MobileNotaryUtahCountyGuide() {
  return (
    <main className="min-h-screen">
      <SEO
        title={TITLE}
        description={DESCRIPTION}
        pathname={slug}
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        publishedTime={published}
        modifiedTime={modified}
        author="ONDO Notary Team"
        section="Notary"
        tags={["Remote Online Notary", "Utah County", "Loan Signing", "Real Estate"]}
        keywords={keywords}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          author: { "@type": "Organization", name: "ONDO Notary" },
          datePublished: published,
          dateModified: modified,
          mainEntityOfPage: `${SITE_URL}${slug}`,
        }}
      />

      <PageBanner
        title="Notary in Utah County"
        subtitle="Remote Online Notarization (RON) from Lehi, Provo, Orem, and beyond: no travel appointment required."
        backgroundImage="/modern-apartment-balcony.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Remote Online Notary</Badge>
            <Badge variant="outline">Utah County</Badge>
            <Badge variant="outline">Real Estate & Loan Signings</Badge>
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

          <div className="not-prose grid gap-4 md:grid-cols-3 mb-10">
            <CardSpot title="Who it's for" body="Borrowers, title, and residents in Utah County who can complete a video session." />
            <CardSpot title="What you get" body="Secure RON nationwide with posted fees and same-day when capacity allows." />
            <CardSpot title="How it flows" body="Book → ID check on video → e-sign and seal → documents back immediately." />
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p>
              Searching for a mobile notary in Utah County? ONDO Notary now completes sessions by
              <strong> Remote Online Notarization (RON)</strong>, a secure video appointment you can
              join from Lehi, Provo, Orem, or anywhere in the U.S. We do not offer mobile travel or
              in-office appointments. Confirm your title company, lender, or receiving party accepts
              electronic notarization before you book.
            </p>

            <h2>Utah County clients we serve online</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
              {serviceAreas.map((city) => (
                <Card key={city} className="bg-muted border-border">
                  <CardContent className="p-4 text-center text-foreground font-semibold">
                    {city}
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-foreground/70">
              If you are in Utah County (or out of state), the session is the same: laptop or phone,
              camera, microphone, and a stable connection. See{" "}
              <Link href="/notary" className="text-primary underline">/notary</Link> to book.
            </p>

            <h2>Pricing snapshot</h2>
            <ul>
              <li>
                <strong>Remote notarial act (RON):</strong> ${NOTARY_RON_ACT_USD} per act (Utah remote
                maximum; platform included)
              </li>
              <li>
                <strong>Same-day / on-demand:</strong> +${NOTARY_SAME_DAY_USD} when we can take the
                request (best-effort, not a guarantee)
              </li>
              <li>
                <strong>Loan signing packages:</strong> {NOTARY_LOAN_RANGE} when the file can close by RON
              </li>
              <li>
                <strong>After-hours:</strong> +${NOTARY_AFTER_HOURS_USD} after 7 PM MT; hours are{" "}
                {NOTARY_HOURS_LABEL}
              </li>
            </ul>
            <p>
              Full schedule and policies:{" "}
              <Link href="/notary#fees" className="text-primary underline">
                /notary#fees
              </Link>
              .
            </p>

            <div className="not-prose my-6 grid gap-3 md:grid-cols-2">
              <KeyLine title="Clarity" detail="RON fee is posted. Same-day and after-hours add-ons are quoted before we book." />
              <KeyLine title="No travel table" detail="We do not publish mile bands or dispatch a notary to your door." />
            </div>

            <h2>What to expect on the call</h2>
            <ul>
              <li>Government-issued photo ID for every signer</li>
              <li>Camera, microphone, and a quiet space with stable internet</li>
              <li>Unsigned documents ready (no blank spaces to fill in later)</li>
              <li>Electronic seal, audit trail, and documents returned after the session</li>
            </ul>

            <h2>Real estate &amp; loan signing</h2>
            <ul>
              <li>Purchase, refinance, HELOC, and investment packages that accept RON</li>
              <li>Borrower walkthrough on video with identity verification</li>
              <li>Coordination with title and escrow when they accept electronic notarization</li>
              <li>Same-day slots when the calendar allows, request by noon MT</li>
            </ul>

            <h2>Same-day and after-hours</h2>
            <p>
              We try to fit urgent RON sessions when capacity allows. If you need a notary today, or
              after 7 PM, book online or call and tell us it is urgent. Same-day is best-effort, not
              a guaranteed SLA. Details:{" "}
              <Link href="/notary/on-demand" className="text-primary underline">
                /notary/on-demand
              </Link>
              .
            </p>

            <h3>Process at a glance</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
{`Request → Confirm RON acceptance → Quote → Video session
→ ID verified → Electronic seal → Documents returned`}
            </pre>

            <h2>Book a remote session</h2>
            <ul>
              <li>Call or text: {SITE_PHONE}</li>
              <li>Email: {SITE_EMAILS.notary}</li>
              <li>
                Request online: <Link href="/notary" className="text-primary underline">/notary</Link>
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

function KeyLine({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/60 px-4 py-3 h-full">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-sm text-foreground/70">{detail}</p>
    </div>
  );
}
