import type { Metadata } from "next"
import Link from "next/link"
import SEO from "@/components/seo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  title: "LLM & agent discovery | Ondo Real Estate",
  description:
    "Machine-readable briefs and structured data for AI assistants and crawlers covering Ondo Real Estate — Utah brokerage, mortgages, property management, and notary.",
  alternates: {
    canonical: `${SITE_URL}/llms/`,
  },
}

const RESOURCE_LINKS: Array<{
  title: string
  description: string
  href: string
  format: string
}> = [
  {
    title: "Concise LLM brief",
    description:
      "Plain-text summary of the public site, locales, major paths, and assistant guidance. Same body at /llm.txt and /.well-known/llms.txt.",
    href: "/llms.txt",
    format: "text/plain",
  },
  {
    title: "Extended agent brief",
    description: "Deeper context: services, FAQs, social profiles, and the full public page index.",
    href: "/llms-full.txt",
    format: "text/plain",
  },
  {
    title: "Structured JSON index",
    description: "Structured data for tools and agents: resources, contact, crawl policy, and WebMCP actions.",
    href: "/llms.json",
    format: "application/json",
  },
  {
    title: "AI agent manifest",
    description: "Declarative agent discovery (WebMCP-aligned) for compatible clients.",
    href: "/.well-known/agents.json",
    format: "application/json",
  },
  {
    title: "Site overview (Markdown)",
    description: "Human- and machine-friendly Markdown outline of the marketing site.",
    href: "/index.md",
    format: "text/markdown",
  },
]

export default function LlmsDiscoveryPage() {
  const base = SITE_URL.replace(/\/$/, "")
  const structuredData = [
    generateBreadcrumbJsonLd([
      { name: "Home", url: `${base}/` },
      { name: "LLM & agent discovery", url: `${base}/llms/` },
    ]),
  ]

  return (
    <main className="min-h-screen bg-background dark:bg-transparent">
      <SEO
        title="LLM & agent discovery | Ondo Real Estate"
        description="Machine-readable briefs and structured data for AI assistants and crawlers covering Ondo Real Estate."
        pathname="/llms"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={structuredData}
      />

      <div className="container mx-auto max-w-3xl px-4 py-16">
        <header className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">LLM &amp; agent discovery</h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            This page lists machine-readable resources for AI assistants, search engines, and automation. Humans may
            prefer the{" "}
            <Link href="/sitemap/" className="text-primary underline-offset-4 hover:underline">
              HTML sitemap
            </Link>{" "}
            or{" "}
            <Link href="/humans.txt" className="text-primary underline-offset-4 hover:underline">
              humans.txt
            </Link>
            .
          </p>
        </header>

        <ul className="flex flex-col gap-4">
          {RESOURCE_LINKS.map((item) => (
            <li key={item.href}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                  <p className="pt-1 text-xs text-muted-foreground">{item.format}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button asChild variant="secondary" size="sm">
                    <Link href={item.href}>Open {item.href}</Link>
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          XML &amp; robots:{" "}
          <Link href="/sitemap.xml" className="text-primary underline-offset-4 hover:underline">
            sitemap.xml
          </Link>
          {" · "}
          <Link href="/robots.txt" className="text-primary underline-offset-4 hover:underline">
            robots.txt
          </Link>
        </p>
      </div>
    </main>
  )
}
