import { CALCULATOR_CATALOG } from "@/lib/calculator-catalog"
import { getCalculatorDetail } from "@/lib/agent-markdown"
import { SITE_URL } from "@/lib/site"

interface CalculatorAgentIntroProps {
  slug: string
}

/**
 * Server-rendered summary block for `/calculators/[slug]/`.
 *
 * The interactive calculator itself mounts client-side via `dynamic(..., { ssr: false })`.
 * That means agents that fetch the HTML shell (or run without JS) previously saw
 * a loading spinner and nothing else. This section keeps the formula, inputs,
 * worked example, and lending disclosures available before hydration, so:
 *   - Cloudflare Markdown for Agents (HTML → MD on `Accept: text/markdown`) has real
 *     content to convert.
 *   - Search engines and no-JS agents get the same information as the sibling
 *     `/calculators/{slug}.md` twin.
 *
 * Styling stays visible to human visitors too, the disclosures satisfy the
 * lending / Fair Housing requirements documented in `LLMS_DISCLOSURES_BLOCK`.
 */
export function CalculatorAgentIntro({ slug }: CalculatorAgentIntroProps) {
  const catalog = CALCULATOR_CATALOG[slug]
  const detail = getCalculatorDetail(slug)
  if (!catalog || !detail) return null

  return (
    <section
      className="border-b border-border/40 bg-background/60 py-8"
      aria-labelledby={`calc-intro-${slug}`}
      data-agent-intro={slug}
    >
      <div className="container mx-auto max-w-3xl px-4">
        <h2 id={`calc-intro-${slug}`} className="text-xl font-semibold text-foreground">
          How the {catalog.name.toLowerCase()} works
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{catalog.description}</p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Formula</h3>
            <p className="mt-2 text-sm text-foreground/90">{detail.formula}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Inputs</h3>
            <ul className="mt-2 space-y-1 text-sm text-foreground/90">
              {detail.inputs.map((input) => (
                <li key={input}>{input}</li>
              ))}
            </ul>
          </div>
        </div>

        {detail.workedExample ? (
          <div className="mt-6">
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Worked example</h3>
            <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-md bg-muted/40 p-4 font-mono text-xs text-foreground/90">
              {detail.workedExample}
            </pre>
          </div>
        ) : null}

        {detail.notes?.length ? (
          <div className="mt-6">
            <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Notes</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
              {detail.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="mt-6 text-xs text-muted-foreground">
          Rates, terms, and payments are illustrative estimates, not a quote or a commitment to lend. Not a substitute
          for underwriting. Equal Housing Lender. See the{" "}
          <a
            href={`${SITE_URL}/calculators/${slug}.md`}
            className="underline hover:text-foreground"
            rel="alternate"
            type="text/markdown"
          >
            Markdown version
          </a>{" "}
          for the full disclosures.
        </p>
      </div>
    </section>
  )
}
