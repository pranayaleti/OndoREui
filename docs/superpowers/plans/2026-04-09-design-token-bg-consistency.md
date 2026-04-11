# Design Token Background Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate all `bg-*-50` light-mode-only badge/chip colors across both apps and replace with dark-mode-aware semantic equivalents using the `bg-*-500/10 dark:bg-*-500/15` pattern.

**Architecture:** Both apps already share identical unified design tokens (`_design-tokens.css`), the correct `--background`/`--primary` CSS variables, and no `bg-slate-*`/`bg-gray-*`/`bg-zinc-*` classes remain. The only outstanding issue is ~10 files with `bg-blue-50`, `bg-green-50`, `bg-orange-50` used as alert/info panel backgrounds — these render as white/near-white boxes in dark mode. Each fix adds a `dark:bg-*-500/10` or `dark:bg-*-500/15` counterpart (using the spec-approved opacity pattern).

**Tech Stack:** Next.js 15 (OndoREui), Vite + React (OndoREDashboard), Tailwind CSS, CSS custom properties

---

## Pre-flight: verify acceptance criteria baseline

Before making changes, confirm the two items that are already done so we know what to skip.

- [ ] **Step 1: Verify tokens are already synced**

Open a browser to localhost:3000 and run in the console:
```js
getComputedStyle(document.documentElement).getPropertyValue('--background')
// Expected: " 222 20% 7%"
getComputedStyle(document.documentElement).getPropertyValue('--primary')
// Expected: " 25 95% 53%"
```
These should already pass. If they don't, the `_design-tokens.css` import is broken — stop and fix the import chain before continuing.

- [ ] **Step 2: Verify no bg-slate-* / bg-gray-950 classes remain**

```bash
grep -r "bg-slate-\|bg-gray-950\|bg-zinc-950\|bg-stone-50\|bg-\[#1e293b\]" \
  /Users/pranay/Documents/RE/OndoREui/app \
  /Users/pranay/Documents/RE/OndoREui/components \
  /Users/pranay/Documents/RE/OndoREDashboard/src \
  --include="*.tsx" --include="*.jsx"
```
Expected: no output. If any match appears, add a task at the end of this plan to fix it.

- [ ] **Step 3: Verify html element has no gradient class**

```bash
grep -n "dark:bg-gradient\|from-black\|from-gray-900" \
  /Users/pranay/Documents/RE/OndoREui/app/layout.tsx \
  /Users/pranay/Documents/RE/OndoREDashboard/index.html
```
Expected: no output.

---

## Task 1: Fix OndoREui — `addon-marketplace.tsx`

**Files:**
- Modify: `components/tenant/addon-marketplace.tsx:92`

Context: The "Your Add-ons" subscription card uses `bg-orange-50` (nearly white in dark mode) with hardcoded gray text. Add dark variants and fix text colors to use foreground tokens.

- [ ] **Step 1: Read the current file state**

```bash
sed -n '85,110p' /Users/pranay/Documents/RE/OndoREui/components/tenant/addon-marketplace.tsx
```

- [ ] **Step 2: Apply the fix**

Replace line 92:
```tsx
// BEFORE:
className="border rounded-lg p-4 bg-orange-50 flex flex-col justify-between"
```
```tsx
// AFTER:
className="border rounded-lg p-4 bg-orange-500/10 dark:bg-orange-500/15 flex flex-col justify-between"
```

Also fix the hardcoded gray text in the same card block (lines ~94–97):
```tsx
// BEFORE:
<h3 className="font-medium text-gray-900">{sub.addon.name}</h3>
<p className="text-sm text-gray-600 mt-1">{sub.addon.description}</p>
```
```tsx
// AFTER:
<h3 className="font-medium text-foreground">{sub.addon.name}</h3>
<p className="text-sm text-muted-foreground mt-1">{sub.addon.description}</p>
```

- [ ] **Step 3: Confirm change looks correct**

```bash
sed -n '88,100p' /Users/pranay/Documents/RE/OndoREui/components/tenant/addon-marketplace.tsx
```
Expected: `bg-orange-500/10 dark:bg-orange-500/15`, `text-foreground`, `text-muted-foreground`.

---

## Task 2: Fix OndoREui — `pet-registration.tsx`

**Files:**
- Modify: `components/tenant/pet-registration.tsx:115`

Context: Policy info panel uses `bg-blue-50 border-blue-100 text-blue-800` — the light surface and text both fail in dark mode.

- [ ] **Step 1: Read context**

```bash
sed -n '112,122p' /Users/pranay/Documents/RE/OndoREui/components/tenant/pet-registration.tsx
```

- [ ] **Step 2: Apply the fix**

```tsx
// BEFORE:
<div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-800 flex gap-6">
```
```tsx
// AFTER:
<div className="bg-blue-500/10 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/30 rounded-lg px-4 py-3 text-sm text-blue-800 dark:text-blue-300 flex gap-6">
```

- [ ] **Step 3: Confirm change**

```bash
sed -n '112,122p' /Users/pranay/Documents/RE/OndoREui/components/tenant/pet-registration.tsx
```

---

## Task 3: Fix OndoREui — `property-comparison.tsx`

**Files:**
- Modify: `components/tenant/property-comparison.tsx:77`

Context: "Best value" cell highlight uses conditional `bg-green-50` with no dark variant.

- [ ] **Step 1: Read context**

```bash
sed -n '73,82p' /Users/pranay/Documents/RE/OndoREui/components/tenant/property-comparison.tsx
```

- [ ] **Step 2: Apply the fix**

```tsx
// BEFORE:
className={`p-3 text-center text-sm ${isBestFn(v, values) ? "font-bold text-green-600 bg-green-50" : ""}`}
```
```tsx
// AFTER:
className={`p-3 text-center text-sm ${isBestFn(v, values) ? "font-bold text-green-600 dark:text-green-400 bg-green-500/10 dark:bg-green-500/15" : ""}`}
```

- [ ] **Step 3: Confirm change**

```bash
sed -n '73,82p' /Users/pranay/Documents/RE/OndoREui/components/tenant/property-comparison.tsx
```

---

## Task 4: Fix OndoREui — `credit-reporting-card.tsx`

**Files:**
- Modify: `components/tenant/credit-reporting-card.tsx:73,149`

Context: Two panels — a benefits list item and a success state banner — both use light green/blue surfaces.

- [ ] **Step 1: Read context**

```bash
sed -n '70,80p' /Users/pranay/Documents/RE/OndoREui/components/tenant/credit-reporting-card.tsx
sed -n '145,155p' /Users/pranay/Documents/RE/OndoREui/components/tenant/credit-reporting-card.tsx
```

- [ ] **Step 2: Fix line ~73 (blue benefits panel)**

```tsx
// BEFORE:
<div key={benefit.title} className="flex gap-3 items-start bg-blue-50 rounded-lg px-3 py-2.5">
```
```tsx
// AFTER:
<div key={benefit.title} className="flex gap-3 items-start bg-blue-500/10 dark:bg-blue-500/15 rounded-lg px-3 py-2.5">
```

- [ ] **Step 3: Fix line ~149 (green success banner)**

```tsx
// BEFORE:
<div className="bg-green-50 border border-green-100 rounded-lg px-3 py-2.5 text-sm text-green-700">
```
```tsx
// AFTER:
<div className="bg-green-500/10 dark:bg-green-500/15 border border-green-200 dark:border-green-500/30 rounded-lg px-3 py-2.5 text-sm text-green-700 dark:text-green-400">
```

- [ ] **Step 4: Confirm both changes**

```bash
sed -n '70,80p' /Users/pranay/Documents/RE/OndoREui/components/tenant/credit-reporting-card.tsx
sed -n '145,155p' /Users/pranay/Documents/RE/OndoREui/components/tenant/credit-reporting-card.tsx
```

---

## Task 5: Fix OndoREui — `financial-wellness-portal.tsx`

**Files:**
- Modify: `components/tenant/financial-wellness-portal.tsx:208`

Context: Link button has `hover:bg-blue-50` as its hover state — lights up white on hover in dark mode.

- [ ] **Step 1: Read context**

```bash
sed -n '204,215p' /Users/pranay/Documents/RE/OndoREui/components/tenant/financial-wellness-portal.tsx
```

- [ ] **Step 2: Apply the fix**

```tsx
// BEFORE:
className="inline-block bg-card text-blue-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition"
```
```tsx
// AFTER:
className="inline-block bg-card text-blue-700 dark:text-blue-400 text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-500/10 transition"
```

- [ ] **Step 3: Confirm change**

```bash
sed -n '204,215p' /Users/pranay/Documents/RE/OndoREui/components/tenant/financial-wellness-portal.tsx
```

---

## Task 6: Fix OndoREui — `move-in-checklist.tsx`

**Files:**
- Modify: `components/tenant/move-in-checklist.tsx:83`

Context: Completion success banner uses `bg-green-50 border-green-200 text-green-700` — no dark mode.

- [ ] **Step 1: Read context**

```bash
sed -n '80,90p' /Users/pranay/Documents/RE/OndoREui/components/tenant/move-in-checklist.tsx
```

- [ ] **Step 2: Apply the fix**

```tsx
// BEFORE:
<div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-700 font-medium text-sm">
```
```tsx
// AFTER:
<div className="bg-green-500/10 dark:bg-green-500/15 border border-green-200 dark:border-green-500/30 rounded-lg px-4 py-3 text-green-700 dark:text-green-400 font-medium text-sm">
```

- [ ] **Step 3: Confirm change**

```bash
sed -n '80,90p' /Users/pranay/Documents/RE/OndoREui/components/tenant/move-in-checklist.tsx
```

---

## Task 7: Fix OndoREDashboard — `homeowner-search-results.tsx`

**Files:**
- Modify: `src/components/homeowner/homeowner-search-results.tsx:189,265`

Context: AI sources card and follow-up question chips both use `bg-orange-50` surfaces.

- [ ] **Step 1: Read context**

```bash
sed -n '185,200p' /Users/pranay/Documents/RE/OndoREDashboard/src/components/homeowner/homeowner-search-results.tsx
sed -n '260,272p' /Users/pranay/Documents/RE/OndoREDashboard/src/components/homeowner/homeowner-search-results.tsx
```

- [ ] **Step 2: Fix line ~189 (sources card)**

```tsx
// BEFORE:
<Card className="border-orange-200/50 bg-orange-50/30">
```
```tsx
// AFTER:
<Card className="border-orange-200/50 dark:border-orange-500/20 bg-orange-500/10 dark:bg-orange-500/10">
```

- [ ] **Step 3: Fix line ~265 (follow-up chips)**

```tsx
// BEFORE:
className="rounded-full border-orange-200 bg-orange-50/80 text-orange-800 hover:bg-orange-100"
```
```tsx
// AFTER:
className="rounded-full border-orange-200 dark:border-orange-500/30 bg-orange-500/10 dark:bg-orange-500/15 text-orange-800 dark:text-orange-300 hover:bg-orange-500/20"
```

- [ ] **Step 4: Confirm both changes**

```bash
sed -n '185,200p' /Users/pranay/Documents/RE/OndoREDashboard/src/components/homeowner/homeowner-search-results.tsx
sed -n '260,272p' /Users/pranay/Documents/RE/OndoREDashboard/src/components/homeowner/homeowner-search-results.tsx
```

---

## Task 8: Fix OndoREDashboard — `documents-panel.tsx`

**Files:**
- Modify: `src/components/homeowner/documents-panel.tsx:188`

Context: Active/selected document panel highlight uses `bg-orange-50/50` with no dark variant.

- [ ] **Step 1: Read context**

```bash
sed -n '184,195p' /Users/pranay/Documents/RE/OndoREDashboard/src/components/homeowner/documents-panel.tsx
```

- [ ] **Step 2: Apply the fix**

```tsx
// BEFORE:
? "border-orange-400 bg-orange-50/50"
```
```tsx
// AFTER:
? "border-orange-400 bg-orange-500/10 dark:bg-orange-500/15"
```

- [ ] **Step 3: Confirm change**

```bash
sed -n '184,195p' /Users/pranay/Documents/RE/OndoREDashboard/src/components/homeowner/documents-panel.tsx
```

---

## Task 9: Fix OndoREDashboard — `homeowner-dashboard.tsx`

**Files:**
- Modify: `src/components/homeowner/homeowner-dashboard.tsx:179,307,311`

Context: Badge chip, outline button, and ghost button all use `bg-orange-50` hover/surface states.

- [ ] **Step 1: Read context**

```bash
sed -n '176,184p' /Users/pranay/Documents/RE/OndoREDashboard/src/components/homeowner/homeowner-dashboard.tsx
sed -n '303,315p' /Users/pranay/Documents/RE/OndoREDashboard/src/components/homeowner/homeowner-dashboard.tsx
```

- [ ] **Step 2: Fix line ~179 (badge chip)**

```tsx
// BEFORE:
className="rounded-full border-orange-200 bg-orange-50/80 text-orange-800 hover:bg-orange-100"
```
```tsx
// AFTER:
className="rounded-full border-orange-200 dark:border-orange-500/30 bg-orange-500/10 dark:bg-orange-500/15 text-orange-800 dark:text-orange-300 hover:bg-orange-500/20"
```

- [ ] **Step 3: Fix line ~307 (outline button hover)**

```tsx
// BEFORE:
className="border-orange-200 text-orange-800 hover:bg-orange-50"
```
```tsx
// AFTER:
className="border-orange-200 dark:border-orange-500/30 text-orange-800 dark:text-orange-300 hover:bg-orange-500/10"
```

- [ ] **Step 4: Fix line ~311 (ghost button hover)**

```tsx
// BEFORE:
className="text-orange-700 hover:text-orange-800 hover:bg-orange-50"
```
```tsx
// AFTER:
className="text-orange-700 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 hover:bg-orange-500/10"
```

- [ ] **Step 5: Confirm all three changes**

```bash
sed -n '176,184p' /Users/pranay/Documents/RE/OndoREDashboard/src/components/homeowner/homeowner-dashboard.tsx
sed -n '303,315p' /Users/pranay/Documents/RE/OndoREDashboard/src/components/homeowner/homeowner-dashboard.tsx
```

---

## Task 10: Fix OndoREDashboard — `property-details.tsx`

**Files:**
- Modify: `src/components/owner/property-details.tsx:134`

Context: Property status badge uses `bg-green-50 text-green-700 border-green-200` and `bg-yellow-50 text-yellow-700 border-yellow-200` without dark variants.

- [ ] **Step 1: Read context**

```bash
sed -n '130,145p' /Users/pranay/Documents/RE/OndoREDashboard/src/components/owner/property-details.tsx
```

- [ ] **Step 2: Apply the fix**

```tsx
// BEFORE:
className={
  property.status === "active"
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-yellow-50 text-yellow-700 border-yellow-200"
}
```
```tsx
// AFTER:
className={
  property.status === "active"
    ? "bg-green-500/10 dark:bg-green-500/15 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30"
    : "bg-yellow-500/10 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30"
}
```

- [ ] **Step 3: Confirm change**

```bash
sed -n '130,145p' /Users/pranay/Documents/RE/OndoREDashboard/src/components/owner/property-details.tsx
```

---

## Task 11: Final acceptance criteria check

- [ ] **Step 1: Verify no bg-*-50 remains without dark variant in OndoREui**

```bash
grep -rn "bg-blue-50\|bg-green-50\|bg-orange-50\|bg-purple-50\|bg-yellow-50" \
  /Users/pranay/Documents/RE/OndoREui/app \
  /Users/pranay/Documents/RE/OndoREui/components \
  --include="*.tsx" | grep -v "dark:bg-"
```
Expected: empty (all remaining uses will have `dark:bg-` companions, or be solid `bg-*-500` indicators which are fine).

- [ ] **Step 2: Verify no bg-*-50 remains without dark variant in OndoREDashboard**

```bash
grep -rn "bg-blue-50\|bg-green-50\|bg-orange-50\|bg-purple-50\|bg-yellow-50" \
  /Users/pranay/Documents/RE/OndoREDashboard/src \
  --include="*.tsx" | grep -v "dark:bg-"
```
Expected: empty.

- [ ] **Step 3: Final browser check**

Load localhost:3000 (marketing) and localhost:3001 (portal) in dark mode. Visually scan:
- No white/near-white boxes in badge chips or info panels
- Alert/info banners have the correct dark tint (blue/green/orange tinted, not white)
- Console: `getComputedStyle(document.documentElement).getPropertyValue('--background')` returns `" 222 20% 7%"` on both ports
- Console: `getComputedStyle(document.documentElement).getPropertyValue('--primary')` returns `" 25 95% 53%"` on both ports
