import { ComparisonTable } from "@/components/content/comparison-table"
import {
  BREAK_EVEN_TABLE_IDS,
  REFI_BREAK_EVEN_COPY,
  breakEvenColumns,
  breakEvenRows,
  type BreakEvenTableId,
} from "@/lib/content/break-even"

export type BreakEvenTableProps = {
  table?: BreakEvenTableId
  caption?: string
  footnote?: string
}

const DEFAULT_CAPTIONS: Record<BreakEvenTableId, string> = {
  "stay-scenarios": `Illustrated refinance break-even as of ${REFI_BREAK_EVEN_COPY.asOf}. Dollars are examples, not your file.`,
  "recast-vs-refi": `Recast vs refinance cost shape as of ${REFI_BREAK_EVEN_COPY.asOf}. Not a quote.`,
}

const DEFAULT_FOOTNOTES: Record<BreakEvenTableId, string> = {
  "stay-scenarios": `${REFI_BREAK_EVEN_COPY.formula} ${REFI_BREAK_EVEN_COPY.denominator} ${REFI_BREAK_EVEN_COPY.notAQuote}`,
  "recast-vs-refi":
    "A recast does not buy a lower rate. A refinance does not recast the old note. Confirm the servicer and compare two Loan Estimates.",
}

export function BreakEvenTable({
  table = "stay-scenarios",
  caption,
  footnote,
}: BreakEvenTableProps) {
  const resolved: BreakEvenTableId = BREAK_EVEN_TABLE_IDS.includes(table) ? table : "stay-scenarios"
  return (
    <ComparisonTable
      caption={caption ?? DEFAULT_CAPTIONS[resolved]}
      columns={breakEvenColumns(resolved)}
      rows={breakEvenRows(resolved)}
      footnote={footnote ?? DEFAULT_FOOTNOTES[resolved]}
    />
  )
}
