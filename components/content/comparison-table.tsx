import Link from "next/link"
import type { ComparisonColumn, ComparisonRow } from "@/lib/content/program-fit"

export type ComparisonTableProps = {
  caption: string
  columns: readonly ComparisonColumn[]
  rows: readonly ComparisonRow[]
  highlightId?: ComparisonColumn["id"]
  footnote?: string
}

export function ComparisonTable({
  caption,
  columns,
  rows,
  highlightId,
  footnote,
}: ComparisonTableProps) {
  if (columns.length === 0 || rows.length === 0) return null

  return (
    <div
      className="not-prose my-8 overflow-x-auto rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      // Keyboard users must be able to focus this overflow region to scroll the table.
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable region, not a fake control
      tabIndex={0}
      role="region"
      aria-label={caption}
    >
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <caption className="mb-3 text-left text-sm text-foreground/70">{caption}</caption>
        <thead>
          <tr className="border-b-2 border-border">
            <th scope="col" className="py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-foreground/50">
              Question
            </th>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={
                  column.id === highlightId
                    ? "bg-primary/10 px-3 py-3 text-sm font-bold text-primary"
                    : "px-3 py-3 text-sm font-bold text-foreground"
                }
              >
                {column.href ? (
                  <Link href={column.href} className="underline underline-offset-4 hover:underline">
                    {column.heading}
                  </Link>
                ) : (
                  column.heading
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border/60">
              <th scope="row" className="py-3 pr-4 align-top text-sm font-medium text-foreground">
                {row.criterion}
              </th>
              {columns.map((column) => (
                <td
                  key={column.id}
                  className={
                    column.id === highlightId
                      ? "bg-primary/5 px-3 py-3 align-top text-sm text-foreground"
                      : "px-3 py-3 align-top text-sm text-foreground/80"
                  }
                >
                  {row.cells[column.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {footnote ? <p className="mt-3 text-xs text-foreground/60">{footnote}</p> : null}
    </div>
  )
}
