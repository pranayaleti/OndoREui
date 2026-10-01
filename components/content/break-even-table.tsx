import { ComparisonTable, type ComparisonTableProps } from "@/components/content/comparison-table"
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

function resolveTableProps({
  table = "stay-scenarios",
  caption,
  footnote,
}: BreakEvenTableProps): ComparisonTableProps {
  const resolved: BreakEvenTableId = BREAK_EVEN_TABLE_IDS.includes(table) ? table : "stay-scenarios"
  return {
    caption: caption ?? DEFAULT_CAPTIONS[resolved],
    columns: breakEvenColumns(resolved),
    rows: breakEvenRows(resolved),
    footnote: footnote ?? DEFAULT_FOOTNOTES[resolved],
  }
}

export function BreakEvenTable(props: BreakEvenTableProps) {
  return <ComparisonTable {...resolveTableProps(props)} />
}

/** Text this table renders, for the article word count (see lib/content/article-outline.ts). */
BreakEvenTable.articleText = (props: BreakEvenTableProps): string =>
  ComparisonTable.articleText(resolveTableProps(props))
