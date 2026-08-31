import { PageBanner } from "@/components/page-banner";
import SEO from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

const published = "2025-12-10";
const modified = "2025-12-10";
const slug = "/blog/building-high-performance-real-estate-nextjs-supabase";
const title = "Building a High-Performance Real Estate Platform with Next.js 15 and Supabase";
const description = "A technical deep dive into the architecture of Ondo Real Estate, featuring App Router, React Server Components, and Supabase.";
const author = "Engineering Team";

const keywords = [
  "Next.js 15 App Router",
  "Real Estate Tech Stack",
  "Supabase Architecture",
  "React Server Components",
  "Frontend Performance"
];


import type { Metadata } from "next"
import { DEFAULT_OG_IMAGES, DEFAULT_OG_IMAGE_URL } from "@/lib/page-canonical"

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
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | Ondo Real Estate`,
    description: description,
    images: [DEFAULT_OG_IMAGE_URL],
  },
}

export default function BuildingHighPerformanceRealEstatePlatform() {
  return (
    <main className="min-h-screen">
      <SEO
        title={title}
        description={description}
        pathname={slug}
        image={`${SITE_URL}/modern-office-building.png`}
        publishedTime={published}
        modifiedTime={modified}
        author={author}
        section="Engineering"
        tags={["Engineering", "Next.js", "Supabase", "Architecture"]}
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
        subtitle="A technical deep dive into the architecture of Ondo Real Estate."
        backgroundImage="/modern-office-building.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Engineering</Badge>
            <Badge variant="outline">Next.js 15</Badge>
            <Badge variant="outline">Supabase</Badge>
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

          {/* Gestalt: quick anchors to chunk the page */}
          <div className="not-prose grid gap-4 md:grid-cols-3 mb-10">
            <CardSpot title="Core Idea" body="Server-rendered React + Supabase keeps bundles thin and data secure." />
            <CardSpot title="North Star Metric" body="Core Web Vitals on high-intent flows (search, booking, owner portal)." />
            <CardSpot title="Proof Point" body="Lazy-loaded UI (LandingPage) + Supabase-backed data fetches." />
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-8">
              In the competitive proptech landscape, speed and reliability are not just &quot;nice-to-haves&quot;, they are conversion drivers. At <strong>Ondo Real Estate</strong>, we rebuilt our core infrastructure using <strong>Next.js 15</strong> and <strong>Supabase</strong> to deliver a seamless experience for buyers, sellers, and property owners.
            </p>

            <p>
              This article explores the architectural decisions behind our platform, focusing on the App Router, data fetching strategies, and performance optimizations.
            </p>

            <h2>The Core Stack: Next.js 15 App Router</h2>
            <p>
              We migrated to the Next.js App Router to leverage <strong>React Server Components (RSC)</strong>. This architecture allows us to render static content (like property descriptions and legal disclaimers) on the server, significantly reducing the JavaScript bundle sent to the client.
            </p>

            <div className="not-prose my-6 grid gap-3 md:grid-cols-2">
              <KeyLine title="Mental model" detail="Ship HTML first; hydrate only the interactive islands." />
              <KeyLine title="Design principle" detail="Group server fetches; avoid client-side waterfalls." />
            </div>

            <h3>Why Server Components?</h3>
            <p>
              For a content-heavy real estate site, RSCs offer two critical benefits:
            </p>
            <ol>
              <li>
                <strong>Zero-Bundle-Size Data Fetching</strong>: We fetch property details directly from Supabase on the server. The heavy lifting of data transformation happens backend-side.
              </li>
              <li>
                <strong>Automatic Code Splitting</strong>: Client-side interactive elements, such as our <code>ConsultationModal</code> or <code>MortgageCalculator</code>, are lazy-loaded only when needed.
              </li>
            </ol>

            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{`// Example of our lazy loading strategy in app/page.tsx
const LandingPage = dynamic(() => import("@/components/landing-page"), {
  loading: () => <Loading />,
  ssr: true,
})`}</code>
            </pre>

            <h2>Backend as a Service: Supabase</h2>
            <p>
              We utilize Supabase as our unified backend. It handles:
            </p>
            <ul>
              <li><strong>Authentication</strong>: Secure user sessions for our Property Owner Dashboard.</li>
              <li><strong>Database</strong>: PostgreSQL for structured property data, tenant logs, and maintenance requests.</li>
              <li><strong>Real-time Subscriptions</strong>: Enabling live updates for chat features and maintenance status changes.</li>
            </ul>

            <h3>Data Fetching Pattern</h3>
            <p>
              We avoid the traditional &quot;waterfall&quot; of client-side requests. Instead, we pattern our data access to run in parallel on the server:
            </p>
            <ul>
              <li><strong>Public Listings</strong>: Statically generated (SSG) or cached via Next.js <code>unstable_cache</code> for speed.</li>
              <li><strong>User Dashboards</strong>: Dynamic rendering with strict Row Level Security (RLS) policies enforced by Supabase.</li>
            </ul>

            <h2>Performance Engineering</h2>
            <p>
              Performance is a feature. Our <code>package.json</code> reveals a dedicated suite of optimization scripts:
            </p>
            <ul>
              <li><code>optimize:images</code>: A custom script leveraging <code>sharp</code> to pre-process static assets into WebP/AVIF formats.</li>
              <li><code>analyze:bundle</code>: Using <code>@next/bundle-analyzer</code> to rigorously monitor chunk sizes.</li>
            </ul>

            <h3>Core Web Vitals Optimization</h3>
            <p>
              We aggressively optimize for Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS).
            </p>

            <div className="my-8 overflow-x-auto">
              <table className="min-w-full border border-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left">Metric</th>
                    <th className="px-4 py-2 text-left">Optimization Strategy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="px-4 py-2 font-semibold">LCP</td>
                    <td className="px-4 py-2">Critical CSS extraction and priority loading for hero images.</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-4 py-2 font-semibold">CLS</td>
                    <td className="px-4 py-2">Fixed aspect ratios for property cards and skeleton loaders (<code>Loading.tsx</code>).</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-4 py-2 font-semibold">FID</td>
                    <td className="px-4 py-2">Offloading heavy hydration (like charts) to <code>dynamic</code> imports.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="not-prose my-8 grid gap-3 md:grid-cols-3">
              <KeyLine title="Edge" detail="Critical CSS + image priority deliver fast LCP." />
              <KeyLine title="Stability" detail="Aspect-ratio locks contain layout shifts (CLS)." />
              <KeyLine title="Focus" detail="Dynamic imports ensure only-needed JS per route." />
            </div>

            <h2>Conclusion</h2>
            <p>
              By combining the server-side power of Next.js 15 with the scalability of Supabase, Ondo Real Estate delivers a native-app-like feel on the web. This architecture not only boosts SEO rankings but ensures our users, whether booking a notary or managing a rental portfolio, experience zero friction.
            </p>

            <hr className="my-12 border-border" />

            <h3>FAQ</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-lg">Q: Why use Supabase instead of a custom backend?</h4>
                <p>A: Supabase provides instant APIs, Auth, and Database management out of the box, allowing us to focus on building real estate features rather than boilerplate infrastructure.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg">Q: How does the App Router improve SEO?</h4>
                <p>A: It generates pure HTML on the server for search bots while streaming content to users, ensuring content is indexed immediately.</p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-bold mb-4">Summary</h3>
              <p className="mb-0">
                The Ondo Real Estate platform is architected on Next.js 15 using the App Router and React Server Components to minimize client-side JavaScript. The backend is powered by Supabase, utilizing PostgreSQL for data storage and Row Level Security for authentication. Performance is optimized via custom image processing scripts and dynamic code splitting. This stack ensures high Core Web Vitals scores, essential for SEO and user retention in the competitive real estate market.
              </p>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}

// Lightweight presentational helpers for gestalt-style chunking
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
