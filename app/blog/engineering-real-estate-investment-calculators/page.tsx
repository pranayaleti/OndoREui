import { PageBanner } from "@/components/page-banner";
import SEO from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

const published = "2025-12-10";
const modified = "2025-12-10";
const slug = "/blog/engineering-real-estate-investment-calculators";
const title = "Engineering Accuracy: Behind the Scenes of Real Estate Investment Calculators";
const description = "How we built the web's most accurate real estate financial calculators using React and TypeScript.";
const author = "Engineering Team";

const keywords = [
  "Real Estate ROI Calculator",
  "React Financial Components",
  "TypeScript Financial Modeling",
  "Investment Property Analysis",
  "Cash on Cash Return Formula"
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

export default function EngineeringInvestmentCalculators() {
  return (
    <main className="min-h-screen">
      <SEO
        title={title}
        description={description}
        pathname={slug}
        image={`${SITE_URL}/modern-townhouse-garage.png`}
        publishedTime={published}
        modifiedTime={modified}
        author={author}
        section="Engineering"
        tags={["Development", "React", "TypeScript", "Fintech"]}
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
        subtitle="Precision financial modeling with React and TypeScript."
        backgroundImage="/modern-townhouse-garage.png"
      />

      <article className="bg-background py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 mb-8">
            <Badge variant="secondary">Engineering</Badge>
            <Badge variant="outline">React</Badge>
            <Badge variant="outline">TypeScript</Badge>
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

          {/* Gestalt: fast scanning cues */}
          <div className="not-prose grid gap-4 md:grid-cols-3 mb-10">
            <CardSpot title="What it is" body="Typed ROI engine covering cash flow, amortization, appreciation, and tax." />
            <CardSpot title="Why it matters" body="Shows real returns with vacancy, CapEx, and debt service baked in." />
            <CardSpot title="How it works" body="React + TypeScript state, amortization loop, and Recharts for clarity." />
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="lead text-xl text-foreground/70 mb-8">
              Real estate investing isn't about guessing; it's about math. At Ondo Real Estate, we didn't just embed a widget, we engineered a comprehensive <strong>ROI Calculator</strong> from scratch.
            </p>

            <p>
              This post dissects the logic inside our <code>ROICalculator.tsx</code>, explaining how we model complex financial scenarios like amortization, equity appreciation, and cash-on-cash returns.
            </p>

            <h2>The Mathematics of ROI</h2>
            <p>
              Our calculator doesn't just look at rent; it analyzes the four pillars of real estate return:
            </p>
            <div className="not-prose my-6 grid gap-3 md:grid-cols-2">
              <KeyLine title="Gestalt grouping" detail="Cash flow (now) + wealth-building (amortization, appreciation, tax)." />
              <KeyLine title="Guardrail" detail="Typed inputs and derived values auto-adjust to prevent silent drift." />
            </div>
            <ol>
              <li><strong>Cash Flow</strong>: (Rent - Expenses - Debt Service)</li>
              <li><strong>Amortization</strong>: (Principal Paydown)</li>
              <li><strong>Appreciation</strong>: (Market Value Increase)</li>
              <li><strong>Tax Benefits</strong>: (Depreciation - though handled as a user input buffer)</li>
            </ol>

            <h3>The Algorithm</h3>
            <p>
              We use a compound interest formula combined with an amortization loop to project future values.
            </p>

            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{`// Core logic from our ROI Calculator
const calculateROI = () => {
    // 1. Calculate NOI (Net Operating Income)
    const netOperatingIncome = annualRentalIncome - annualOperatingExpenses;

    // 2. Amortization Loop to find Loan Balance at Sale
    let remainingBalance = loanAmount;
    for (let month = 0; month < paymentsMade; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance = Math.max(0, remainingBalance - principalPayment);
    }

    // 3. Calculate Total Return
    const equityAtSale = propertyValueAtSale - remainingBalance;
    const totalReturn = totalCashFlow + (equityAtSale - downPayment);
}`}</code>
            </pre>

            <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
              <KeyLine title="Step 1" detail="Compute NOI (income minus operating expenses)." />
              <KeyLine title="Step 2" detail="Iterate amortization to find the real loan balance at sale." />
              <KeyLine title="Step 3" detail="Blend cash flow + equity gain for total return and ROI." />
            </div>

            <h2>Handling React State for Financial Models</h2>
            <p>
              We use a large, typed state object (<code>ROIData</code>) to track over 15 variables, from <code>vacancyRate</code> to <code>closingCosts</code>.
            </p>
            <ul>
              <li><strong>Dependency Tracking</strong>: We use <code>useEffect</code> to trigger recalculations whenever a user modifies a variable.</li>
              <li><strong>Derived State</strong>: Crucially, if a user changes the <em>Purchase Price</em>, we automatically adjust the <em>Loan Amount</em> based on the previous down payment percentage, ensuring the model stays consistent.</li>
            </ul>

            <h2>Data Visualization with Recharts</h2>
            <p>
              Numbers can be dry. We integrated <strong>Recharts</strong> to visualize the break-even point and equity growth over time. The charts are dynamically imported to ensure they don't slow down the initial page load.
            </p>

            <h2>Validating "Good" Deals</h2>
            <p>
              We built intelligent analysis directly into the UI.
            </p>
            <ul>
              <li><strong>&gt; 15% ROI</strong>: &quot;Excellent ROI! Strong return potential.&quot;</li>
              <li><strong>&lt; 5% ROI</strong>: &quot;Low ROI. Consider if the risk is acceptable.&quot;</li>
            </ul>
            <p>
              This conditional rendering helps novice investors interpret the raw data immediately.
            </p>

            <div className="not-prose my-8 grid gap-3 md:grid-cols-2">
              <CardSpot title="Signals" body="Green: ≥15% ROI, Yellow: 5–10%, Red: under 5%." />
              <CardSpot title="Action" body="Adjust vacancy, CapEx, and hold period to feel sensitivity quickly." />
            </div>

            <h2>Why It Matters</h2>
            <p>
              Standard calculators often ignore &quot;hidden&quot; costs like vacancy rates or maintenance reserves. By exposing these variables in our <code>ROICalculator</code>, we force investors to underwrite their deals conservatively, leading to safer investment decisions.
            </p>

            <hr className="my-12 border-border" />

            <h3>FAQ</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-lg">Q: How is Cash-on-Cash return different from ROI?</h4>
                <p>A: Cash-on-Cash only measures the cash flow relative to your initial cash investment. ROI includes the invisible wealth you build through loan paydown and property appreciation.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg">Q: Does the calculator account for inflation?</h4>
                <p>A: Yes, via the &quot;Appreciation Rate&quot; and &quot;Annual Rent Increase&quot; inputs, allowing you to model inflation's effect on asset value.</p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-muted rounded-lg">
              <h3 className="text-xl font-bold mb-4">Summary</h3>
              <p className="mb-0">
                Ondo Real Estate's ROI Calculator is a custom React application that models complex real estate investment scenarios. Unlike simple mortgage calculators, it accounts for four wealth generators: cash flow, principal paydown (amortization), appreciation, and tax benefits. The codebase uses TypeScript to enforce strict type safety for financial variables and employs an iterative loop to calculate exact loan balances at the end of a holding period. It provides immediate visual feedback on deal quality based on customizable thresholds.
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
