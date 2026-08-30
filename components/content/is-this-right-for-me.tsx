import { ComparisonTable } from "@/components/content/comparison-table"
import { LENDING_FACTS_AS_OF, LENDING_FACTS_VERIFY } from "@/lib/content"
import {
  filterProgramColumns,
  rowsForTable,
  type ProgramFitId,
  type ProgramFitTableId,
} from "@/lib/content/program-fit"

type IsThisRightForMeProps = {
  table: ProgramFitTableId
  programs?: readonly ProgramFitId[]
  highlight?: ProgramFitId
  heading?: string
  intro?: string
}

const DEFAULT_HEADING: Record<ProgramFitTableId, string> = {
  purchase: "Is this program a fit for the file?",
  equity: "HELOC vs cash-out: which structure are you actually comparing?",
}

const DEFAULT_INTRO: Record<ProgramFitTableId, string> = {
  purchase:
    "Use this as a map of typical overlays, not a score. A loan officer still has to apply the guide that is in force for your product and your documentation.",
  equity:
    "Both tap equity. They do not have the same payment, lien position, or tax questions. This is education, not a recommendation to take cash out.",
}

export function IsThisRightForMe({
  table,
  programs,
  highlight,
  heading,
  intro,
}: IsThisRightForMeProps) {
  const columns = filterProgramColumns(table, programs)
  const rows = rowsForTable(table)
  const headingId = `is-this-right-${table}${highlight ? `-${highlight}` : ""}`

  return (
    <section className="not-prose my-10" aria-labelledby={headingId}>
      <h2 id={headingId} className="text-2xl font-bold text-foreground">
        {heading ?? DEFAULT_HEADING[table]}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-foreground/70">{intro ?? DEFAULT_INTRO[table]}</p>
      <ComparisonTable
        caption={`Typical program differences as of ${LENDING_FACTS_AS_OF}. Confirm current published rules.`}
        columns={columns}
        rows={rows}
        highlightId={highlight}
        footnote={LENDING_FACTS_VERIFY}
      />
    </section>
  )
}
