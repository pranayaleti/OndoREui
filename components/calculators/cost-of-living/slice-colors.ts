import type { ExpenseCategoryId } from "@/lib/cost-of-living"

export const SLICE_COLORS: Record<ExpenseCategoryId, string> = {
  housing: "hsl(var(--primary))",
  transportation: "hsl(var(--color-category-1))",
  food: "hsl(var(--color-category-3))",
  utilities: "hsl(var(--color-category-4))",
  insurance: "hsl(var(--color-category-2))",
  healthcare: "hsl(var(--muted-foreground))",
  personal: "hsl(var(--secondary-foreground))",
  childcare: "hsl(var(--accent))",
  pets: "hsl(var(--color-category-4))",
  debt: "hsl(var(--destructive))",
  lifestyle: "hsl(var(--color-category-2))",
  other: "hsl(var(--border))",
}
