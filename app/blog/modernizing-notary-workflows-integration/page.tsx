import { PageBanner } from "@/components/page-banner";
import SEO from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SITE_URL, SITE_EMAILS } from "@/lib/site";
import Link from "next/link";

const published = "2025-12-10";
const modified = "2025-12-10";
const slug = "/blog/modernizing-notary-workflows-integration";
const title = "Modernizing Legal Workflows: Integrating Remote Online Notary Services";
const description = "How we integrated seamless booking for remote online notary (RON) services directly into the Ondo platform.";
const author = "Product Team";

const keywords = [
  "Remote Online Notary (RON)",
  "Notary Booking System",
  "Utah Remote Notary",
  "Digital Legal Services",
  "React Scheduling Components"
];


import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `${title} | Ondo Real Estate`,
  description: description,
  alternates: { canonical: `${SITE_URL}${slug}/` },
  openGraph: {
    title: `${title} | Ondo Real Estate`,
    description: description,
    type: "article",
    publishedTime: published,
    modifiedTime: modified || published,
    authors: [author],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | Ondo Real Estate`,
    description: description,
  },
}

export default function ModernizingNotaryWorkflows() {
  return (
    <main className="min-h-screen">
      <SEO
        title={title}
        description={description}
        pathname={slug}
        image={`${SITE_URL}/modern-apartment-balcony.png`}
        publishedTime={published}
        modifiedTime={modified}
        author={author}
        section="Product"
        tags={["Product", "Notary", "Workflow", "UX"]}
        keywords={keywords}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: title,
          description: description,
          author: { "@type": "Organization", name: author },
          datePublished: published,
          dateModified: modified,
          mainEntityOfPage: `${SITE_URL}${slug}`,
        }}
      />

      <PageBanner
        title={title}
        subtitle="Bridging the gap between digital real estate and legal compliance."
        backgroundImage="/modern-apartment-balcony.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Product</Badge>
            <Badge variant="outline">Notary</Badge>
            <Badge variant="outline">UX</Badge>
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

          {/* Gestalt: quick anchors for the story */}
          <div className="not-prose grid gap-4 md:grid-cols-3 mb-10">
            <CardSpot title="Pain" body="Signatures were the offline bottleneck in an otherwise digital journey." />
            <CardSpot title="Solution" body="One booking surface for remote online notarization, routed by document type." />
            <CardSpot title="Outcome" body="Faster closings, fewer reschedules, clearer audit trails for lenders." />
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-8">
              Real estate transactions are 90% digital, until you need a signature. At <strong>Ondo</strong>, we bridged this gap by integrating <strong>Remote Online Notary (RON)</strong> booking directly into our platform.
            </p>

            <h2>The Problem: The "Last Mile" of Real Estate</h2>
            <p>
              You can search for homes, calculate payments, and even apply for loans online. But closing often requires driving to a bank. We aimed to solve this by making notary services as accessible as ordering an Uber.
            </p>

            <div className="not-prose my-6 grid gap-3 md:grid-cols-2">
              <KeyLine title="Friction point" detail="Signatures pull clients out of flow, causing delays and drop-off." />
              <KeyLine title="Design principle" detail="Keep the user in one surface; fulfill by secure video (RON)." />
            </div>

            <h2>The Solution: <code>NotaryBooking</code> Component</h2>
            <p>
              We built a dedicated booking interface located at <code>components/notary-booking.tsx</code>. It abstracts the complexity of coordination into a simple 3-step flow:
            </p>
            <ol>
              <li><strong>Service Selection</strong>: Users request a remote online (RON) session.</li>
              <li><strong>Scheduling</strong>: Integrated calendar logic allows users to pick available slots.</li>
              <li><strong>Confirmation</strong>: Automated email triggers to both the client and our notary team (via <code>SITE_EMAILS</code>).</li>
            </ol>

            <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
              <KeyLine title="Single surface" detail="One dialog for RON: chosen by user intent." />
              <KeyLine title="State clarity" detail="Calendar first, then confirmation; no hidden extra steps." />
              <KeyLine title="Ops handoff" detail="Email routing makes the right specialist respond instantly." />
            </div>

            <h3>Technical Implementation</h3>
            <p>
              The booking system is wrapped in a <code>ConsultationModal</code> component. This modal is designed to be reusable across the site, whether a user is on a &quot;Buy&quot; page or the dedicated &quot;Notary&quot; page.
            </p>

            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{`// Reusable booking logic
<ConsultationModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  variant="notary" // Switches context for the modal
/>`}</code>
            </pre>

            <h2>Service Areas & Local SEO</h2>
            <p>
              We mapped notary coverage to state and city hubs for local SEO. Our <code>notary-service-areas.ts</code> file acts as a source of truth for:
            </p>
            <ul>
              <li><strong>RON coverage</strong>: Nationwide video sessions, including Utah County cities such as Lehi, Provo, Orem, and American Fork.</li>
              <li><strong>Posted fees</strong>: Remote notarial acts at the Utah RON maximum, with same-day and after-hours add-ons disclosed before booking.</li>
            </ul>

            <div className="not-prose my-6 grid gap-3 md:grid-cols-2">
              <CardSpot title="Local SEO" body="City hubs explain RON for nearby clients without promising a travel appointment." />
              <CardSpot title="Operational clarity" body="Posted RON fees avoid surprise trip charges." />
            </div>

            <h2>Beyond Closings: Estate Planning & Loan Signing</h2>
            <p>
              Our system isn't just for buying homes. We configured the backend to route different request types to specialized agents:
            </p>
            <ul>
              <li><code>{SITE_EMAILS.loanSigning}</code> for closings.</li>
              <li><code>{SITE_EMAILS.estatePlanning}</code> for trusts and wills.</li>
              <li><code>{SITE_EMAILS.i9Verification}</code> for employment verification.</li>
            </ul>

            <h2>Conclusion</h2>
            <p>
              By treating notary services as a first-class citizen in our code, not an afterthought, we reduce the &quot;time-to-close&quot; for real estate deals and provide a vital utility to our local community.
            </p>

            <hr className="my-12 border-border" />

            <h3>FAQ</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-lg">Q: What is a Remote Online Notary (RON)?</h4>
                <p>A: RON allows you to sign documents via secure video call. The notary verifies your ID digitally and notarizes the electronic document instantly.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg">Q: Is RON legal in Utah?</h4>
                <p>A: Yes, Utah is a leader in adopting digital notary standards, making it fully legal for real estate and legal documents.</p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-bold mb-4">Summary</h3>
              <p className="mb-0">
                Ondo Real Estate integrates Remote Online Notary (RON) scheduling directly into its React-based platform. The <code>NotaryBooking</code> component simplifies the &quot;last mile&quot; of real estate transactions by allowing users to schedule certified remote sessions for loan signings, estate planning, and I-9 verification. The system uses a specialized routing logic to direct requests to the appropriate department and leverages <code>ConsultationModal</code> for a consistent UX across the application.
              </p>
            </div>
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
