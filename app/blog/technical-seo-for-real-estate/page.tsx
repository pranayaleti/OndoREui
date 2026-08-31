import { PageBanner } from "@/components/page-banner";
import SEO from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

const published = "2025-12-10";
const modified = "2025-12-10";
const slug = "/blog/technical-seo-for-real-estate";
const title = "Technical SEO for Real Estate: JSON-LD, Sitemaps, and Core Web Vitals";
const description = "A blueprint for dominating local real estate search results using Next.js SEO primitives and structured data.";
const author = "Growth Team";

const keywords = [
  "Real Estate SEO",
  "Next.js JSON-LD",
  "Local SEO Utah",
  "Programmatic SEO",
  "Sitemap Generation"
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

export default function TechnicalSEOForRealEstate() {
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
        section="SEO"
        tags={["SEO", "Marketing", "Engineering", "Growth"]}
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
        subtitle="Dominating local search with Next.js SEO primitives."
        backgroundImage="/modern-office-building.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">SEO</Badge>
            <Badge variant="outline">Growth</Badge>
            <Badge variant="outline">Next.js</Badge>
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

          {/* Gestalt: quick scan anchors */}
          <div className="not-prose grid gap-4 md:grid-cols-3 mb-10">
            <CardSpot title="Goal" body="Own local intent for Utah real estate and services." />
            <CardSpot title="Method" body="Structured data + sitemaps + performance baked into components." />
            <CardSpot title="Signal" body="Page 1 visibility through Core Web Vitals and programmatic coverage." />
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-8">
              In real estate, if you aren't on Page 1, you don't exist. Ondo Real Estate utilizes a &quot;Programmatic SEO&quot; approach built on Next.js to ensure our listings and services dominate local search results in Utah.
            </p>

            <h2>Structured Data (JSON-LD)</h2>
            <p>
              Search engines prefer structured data. We don't just hope Google understands our content; we explain it explicitly using <strong>Schema.org</strong> vocabulary.
            </p>

            <h3>Breadcrumbs & LocalBusiness</h3>
            <p>
              In <code>app/page.tsx</code> and <code>lib/seo.ts</code>, we dynamically generate JSON-LD blobs.
            </p>

            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{`// lib/seo.ts
export const generateBreadcrumbJsonLd = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
})`}</code>
            </pre>
            <p>
              This gives us rich snippets in search results, showing the user exactly where a page sits in our hierarchy (e.g., Home &gt; Buy &gt; Utah County &gt; Lehi).
            </p>

            <div className="not-prose my-6 grid gap-3 md:grid-cols-2">
              <KeyLine title="Gestalt grouping" detail="Breadcrumbs keep the crawlable path obvious; LocalBusiness anchors NAP." />
              <KeyLine title="LLM/AEO" detail="Well-structured JSON-LD yields direct-answer snippets and better embeddings." />
            </div>

            <h2>Local SEO Strategy: Targeting the "Wasatch Front"</h2>
            <p>
              We target hyper-local keywords defined in our <code>SEO</code> component:
            </p>
            <ul>
              <li>&quot;Lehi real estate&quot;</li>
              <li>&quot;Utah County property management&quot;</li>
              <li>&quot;Mobile notary Orem&quot;</li>
            </ul>
            <p>
              By injecting these keywords into the <code>metadata</code> export of our Next.js pages, we signal strong local relevance.
            </p>

            <div className="not-prose my-6 grid gap-3 md:grid-cols-2">
              <CardSpot title="Clarity" body="Each city/intent pair lives in metadata for clean topical clusters." />
              <CardSpot title="Coverage" body="Programmatic pages + sitemaps ensure nothing is orphaned." />
            </div>

            <h2>Automated Sitemaps</h2>
            <p>
              We use <code>next-sitemap</code> to automatically crawl our routes during the build process. This ensures that every new blog post, property listing, or calculator page is instantly added to <code>sitemap.xml</code>, helping Google index fresh content faster.
            </p>

            <h2>Performance as a Ranking Signal</h2>
            <p>
              Google's Core Web Vitals are a ranking factor. Our architecture optimizes for this naturally:
            </p>
            <ul>
              <li><strong>Next/Image</strong>: Automatic distinct resizing prevents layout shifts.</li>
              <li><strong>Font Optimization</strong>: <code>next/font</code> eliminates Flash of Unstyled Text (FOUT).</li>
              <li><strong>Static Generation</strong>: Marketing pages are pre-rendered, offering near-instant Time to First Byte (TTFB).</li>
            </ul>

            <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
              <KeyLine title="LCP" detail="Image priority + critical CSS keep hero paint fast." />
              <KeyLine title="CLS" detail="Aspect ratios and reserved space prevent jumps." />
              <KeyLine title="TTFB" detail="SSG where possible; dynamic routes lean on caching." />
            </div>

            <h2>Conclusion</h2>
            <p>
              SEO isn't magic; it's engineering. By building SEO primitives into our component library, every page we launch is optimized by default.
            </p>

            <hr className="my-12 border-border" />

            <h3>FAQ</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-lg">Q: Why is JSON-LD important for real estate?</h4>
                <p>A: It helps Google display &quot;Rich Snippets&quot;, like price, address, and star ratings, directly in the search results, increasing click-through rates.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg">Q: What is Programmatic SEO?</h4>
                <p>A: It's the practice of generating landing pages at scale (e.g., &quot;Homes for sale in [City]&quot;) using a database and templates, ensuring coverage of all local markets.</p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-bold mb-4">Summary</h3>
              <p className="mb-0">
                Ondo Real Estate employs a technical SEO strategy built on Next.js primitives. Key tactics include automated <code>sitemap.xml</code> generation via <code>next-sitemap</code>, dynamic JSON-LD injection for <code>BreadcrumbList</code> and <code>LocalBusiness</code> schemas, and hyper-local keyword targeting for the Utah market. The platform optimizes for Core Web Vitals (LCP, CLS) using server-side rendering and image optimization, treating performance as a primary search ranking signal.
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
