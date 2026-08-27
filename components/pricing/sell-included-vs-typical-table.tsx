import Link from "next/link"
import { SELL_INCLUDED_ROWS } from "@/lib/sell-included"
import { LICENSING_HREF } from "@/lib/social-proof-stats"

export function SellIncludedVsTypicalTable() {
  return (
    <section className="mx-auto max-w-5xl px-4" aria-labelledby="sell-included-heading">
      <h2
        id="sell-included-heading"
        className="mb-3 text-center text-2xl font-bold text-foreground sm:text-3xl"
      >
        Full-service listing, line by line
      </h2>
      <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-foreground/70">
        Ondo on the left. A typical Utah full-service listing on the right — industry
        pattern, not a named dunk, and not a savings claim. Compensation is quoted in
        writing for your property.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-border">
              <th scope="col" className="py-3 pr-4 text-xs font-semibold uppercase tracking-wide text-foreground/50">
                Line
              </th>
              <th scope="col" className="bg-primary/10 px-3 py-3 text-sm font-bold text-primary">
                Ondo
              </th>
              <th scope="col" className="px-3 py-3 text-sm font-bold text-foreground">
                Typical full-service listing
              </th>
            </tr>
          </thead>
          <tbody>
            {SELL_INCLUDED_ROWS.map((row) => (
              <tr key={row.item} className="border-b border-border/60">
                <th
                  scope="row"
                  className="py-3 pr-4 align-top text-sm font-medium text-foreground/80"
                >
                  {row.item}
                </th>
                <td className="bg-primary/5 px-3 py-3 align-top text-sm text-foreground">
                  {row.ondo}
                  {row.item === "Listing compensation" ? (
                    <>
                      {" "}
                      <Link
                        href={LICENSING_HREF}
                        className="font-medium text-primary underline underline-offset-4"
                      >
                        Licensing disclosures
                      </Link>
                    </>
                  ) : null}
                </td>
                <td className="px-3 py-3 align-top text-sm text-foreground/80">
                  {row.typical}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
