"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { formatCurrency, type CategorySlice } from "@/lib/cost-of-living"
import { SLICE_COLORS } from "./slice-colors"

/** The only recharts import on the public site. Load it with next/dynamic, never statically. */
export function SummaryPieChart({ slices }: { slices: CategorySlice[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={slices}
          dataKey="amount"
          nameKey="label"
          cx="50%"
          cy="50%"
          innerRadius={48}
          outerRadius={72}
          paddingAngle={1}
        >
          {slices.map((slice) => (
            <Cell key={slice.id} fill={SLICE_COLORS[slice.id]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(typeof value === "number" ? value : 0)} />
      </PieChart>
    </ResponsiveContainer>
  )
}
