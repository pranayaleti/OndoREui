import Link from "next/link"
import { calculatorInputCopyForSlug } from "@/lib/content/calculator-input-copy"

type CalculatorInputExplainerProps = {
  slug: string
}

export function CalculatorInputExplainer({ slug }: CalculatorInputExplainerProps) {
  const copy = calculatorInputCopyForSlug(slug)
  if (!copy) return null
  const headingId = `calculator-inputs-${slug}`

  return (
    <section className="not-prose my-8 rounded-lg border border-border bg-muted/40 p-6" aria-labelledby={headingId}>
      <h2 id={headingId} className="text-xl font-bold text-foreground">
        {copy.heading}
      </h2>
      <p className="mt-2 text-sm text-foreground/70">{copy.lead}</p>
      <dl className="mt-4 space-y-4">
        {copy.fields.map((field) => (
          <div key={field.name}>
            <dt className="text-sm font-semibold text-foreground">{field.name}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-foreground/80">{field.meaning}</dd>
          </div>
        ))}
      </dl>
      {copy.related.length > 0 ? (
        <p className="mt-4 text-sm text-foreground/70">
          Related:{" "}
          {copy.related.map((item, index) => (
            <span key={item.href}>
              {index > 0 ? " · " : null}
              <Link href={item.href} className="text-primary underline-offset-4 hover:underline">
                {item.label}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
    </section>
  )
}
