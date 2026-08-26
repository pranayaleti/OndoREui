import type { LucideIcon } from "lucide-react"
import {
  Bot,
  Building2,
  CreditCard,
  FileText,
  HardHat,
  Home,
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  Users,
  Wallet,
  Wrench,
} from "lucide-react"
import { cn } from "@/lib/utils"

export const TOUR_SCREEN_IDS = ["owner", "tenant", "assistant", "vendor"] as const
export type TourScreenId = (typeof TOUR_SCREEN_IDS)[number]

export const TOUR_SAMPLE_DISCLAIMER =
  "Sample product view. Figures are illustrative and are not a live account, an appraisal, or a guarantee of results."

export const TOUR_ASSISTANT_DISCLAIMER =
  "The assistant is automated and may contain errors. It is not legal, tax, or lending advice."

const SCREEN_PATH: Record<TourScreenId, string> = {
  owner: "/owner",
  tenant: "/tenant",
  assistant: "/assistant",
  vendor: "/vendors",
}

const SCREEN_CAPTION: Record<TourScreenId, string> = {
  owner: "Sample owner dashboard",
  tenant: "Sample tenant portal",
  assistant: "Sample AI assistant",
  vendor: "Sample vendor tools",
}

interface TourProductScreenProps {
  id: TourScreenId
}

export function TourProductScreen({ id }: TourProductScreenProps) {
  const caption =
    id === "assistant"
      ? `${SCREEN_CAPTION[id]}. ${TOUR_SAMPLE_DISCLAIMER} ${TOUR_ASSISTANT_DISCLAIMER}`
      : `${SCREEN_CAPTION[id]}. ${TOUR_SAMPLE_DISCLAIMER}`

  return (
    <figure className="m-0">
      <div
        aria-hidden="true"
        inert
        className="overflow-hidden rounded-lg border border-border bg-card shadow-md"
      >
        <BrowserChrome path={SCREEN_PATH[id]} />
        <div className="pointer-events-none select-none bg-background p-3 sm:p-4">
          <TourScreenBody id={id} />
        </div>
      </div>
      <figcaption className="mt-2 text-xs text-foreground/50">{caption}</figcaption>
    </figure>
  )
}

function TourScreenBody({ id }: { id: TourScreenId }) {
  switch (id) {
    case "owner":
      return <OwnerDashboardMock />
    case "tenant":
      return <TenantPortalMock />
    case "assistant":
      return <AssistantMock />
    case "vendor":
      return <VendorToolsMock />
    default: {
      const _exhaustive: never = id
      return _exhaustive
    }
  }
}

function BrowserChrome({ path }: { path: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border bg-muted/70 px-3 py-2">
      <span className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-foreground/20" />
        <span className="h-2 w-2 rounded-full bg-foreground/20" />
        <span className="h-2 w-2 rounded-full bg-foreground/20" />
      </span>
      <p className="min-w-0 flex-1 truncate rounded-md bg-background px-2 py-0.5 text-center text-[11px] text-foreground/50">
        app.ondorealestate.com{path}
      </p>
      <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground/45">
        Sample
      </span>
    </div>
  )
}

function NavRail({
  items,
  active,
}: {
  items: { icon: LucideIcon; label: string }[]
  active: string
}) {
  return (
    <div className="hidden w-11 shrink-0 flex-col items-center gap-1 border-r border-border py-1 sm:flex">
      {items.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md",
            label === active ? "bg-primary/15 text-primary" : "text-foreground/40",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      ))}
    </div>
  )
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-md border border-border bg-card px-2.5 py-2">
      <p className="text-[10px] font-medium text-foreground/50">{label}</p>
      <p className="text-base font-bold tabular-nums text-foreground sm:text-lg">{value}</p>
      {hint ? <p className="mt-0.5 text-[10px] text-foreground/45">{hint}</p> : null}
    </div>
  )
}

function Badge({ children, tone }: { children: string; tone: "primary" | "muted" }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
        tone === "primary"
          ? "bg-primary/15 text-primary"
          : "bg-muted text-foreground/60",
      )}
    >
      {children}
    </span>
  )
}

function OwnerDashboardMock() {
  return (
    <div className="flex gap-3">
      <NavRail
        active="Dashboard"
        items={[
          { icon: LayoutDashboard, label: "Dashboard" },
          { icon: Building2, label: "Properties" },
          { icon: Users, label: "Tenants" },
          { icon: Wallet, label: "Finances" },
        ]}
      />
      <div className="min-w-0 flex-1 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Dashboard</p>
          <p className="text-[11px] text-foreground/50">Portfolio overview</p>
        </div>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          <Stat label="Properties" value="4" hint="Lehi to Ogden" />
          <Stat label="Rent collected" value="$8,450" hint="This month" />
          <Stat label="Occupancy" value="3 of 4" hint="Units occupied" />
          <Stat label="Open requests" value="1" hint="Assigned to vendor" />
        </div>
        <div className="rounded-md border border-border bg-card">
          <p className="border-b border-border px-3 py-1.5 text-[11px] font-medium text-foreground/70">
            Properties
          </p>
          <ul className="divide-y divide-border">
            <PropertyRow name="Lehi townhome" detail="Rent in" status="Occupied" occupied />
            <PropertyRow name="Provo cottage" detail="Rent in" status="Occupied" occupied />
            <PropertyRow name="Sandy rambler" detail="Rent in" status="Occupied" occupied />
            <PropertyRow name="Ogden duplex" detail="Listed" status="Vacant" occupied={false} />
          </ul>
        </div>
      </div>
    </div>
  )
}

function PropertyRow({
  name,
  detail,
  status,
  occupied,
}: {
  name: string
  detail: string
  status: string
  occupied: boolean
}) {
  return (
    <li className="flex items-center justify-between gap-2 px-3 py-1.5">
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-foreground">{name}</p>
        <p className="text-[10px] text-foreground/45">{detail}</p>
      </div>
      <Badge tone={occupied ? "primary" : "muted"}>{status}</Badge>
    </li>
  )
}

function TenantPortalMock() {
  return (
    <div className="flex gap-3">
      <NavRail
        active="Home"
        items={[
          { icon: Home, label: "Home" },
          { icon: CreditCard, label: "Pay" },
          { icon: Wrench, label: "Requests" },
          { icon: MessageSquare, label: "Messages" },
        ]}
      />
      <div className="min-w-0 flex-1 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Your home</p>
          <p className="text-[11px] text-foreground/50">Lehi, UT</p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="rounded-md border border-border bg-card px-3 py-2.5">
            <p className="text-[10px] font-medium text-foreground/50">Rent due Sep 1</p>
            <p className="text-lg font-bold tabular-nums text-foreground">$1,850</p>
            <span className="mt-2 inline-flex rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
              Pay rent
            </span>
          </div>
          <div className="rounded-md border border-border bg-card px-3 py-2.5">
            <p className="text-[10px] font-medium text-foreground/50">Lease</p>
            <p className="text-lg font-bold text-foreground">Ends Mar 2027</p>
            <p className="mt-1 text-[10px] text-foreground/45">8 months remaining</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <ActionTile icon={Wrench} label="Requests" hint="1 open" />
          <ActionTile icon={MessageSquare} label="Messages" hint="1 new" />
          <ActionTile icon={FileText} label="Documents" hint="Lease.pdf" />
        </div>
        <div className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
          <div>
            <p className="text-xs font-medium text-foreground">Kitchen faucet drip</p>
            <p className="text-[10px] text-foreground/45">Assigned to Wasatch Plumbing</p>
          </div>
          <Badge tone="primary">In progress</Badge>
        </div>
      </div>
    </div>
  )
}

function ActionTile({
  icon: Icon,
  label,
  hint,
}: {
  icon: LucideIcon
  label: string
  hint: string
}) {
  return (
    <div className="rounded-md border border-border bg-card px-2 py-2 text-center">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <p className="mt-1 text-[11px] font-medium text-foreground">{label}</p>
      <p className="text-[10px] text-foreground/45">{hint}</p>
    </div>
  )
}

function AssistantMock() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">Ondo Assistant</p>
          <p className="text-[11px] text-foreground/50">Ask about your portfolio</p>
        </div>
      </div>
      <div className="space-y-2 rounded-md border border-border bg-card p-3">
        <div className="flex justify-end">
          <p className="max-w-[85%] rounded-lg bg-primary px-3 py-1.5 text-[11px] text-primary-foreground">
            Any open maintenance?
          </p>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Bot className="h-3.5 w-3.5" />
          </span>
          <p className="max-w-[85%] rounded-lg bg-muted px-3 py-1.5 text-[11px] text-foreground">
            One open request: kitchen faucet drip at the Lehi townhome. Assigned to Wasatch
            Plumbing. Status: in progress.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {["Portfolio stats", "Pending maintenance", "Occupancy"].map((label) => (
          <span
            key={label}
            className="rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-medium text-foreground/70"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

function VendorToolsMock() {
  return (
    <div className="flex gap-3">
      <NavRail
        active="Vendors"
        items={[
          { icon: HardHat, label: "Vendors" },
          { icon: Wrench, label: "Work orders" },
          { icon: Building2, label: "Properties" },
        ]}
      />
      <div className="min-w-0 flex-1 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Vendor directory</p>
          <p className="text-[11px] text-foreground/50">Maintenance network</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Active vendors" value="8" />
          <Stat label="Specialties" value="6" />
          <Stat label="Open jobs" value="1" />
        </div>
        <div className="overflow-hidden rounded-md border border-border bg-card">
          <table className="w-full text-left text-[11px]">
            <thead className="border-b border-border bg-muted/50 text-foreground/50">
              <tr>
                <th className="px-3 py-1.5 font-medium">Vendor</th>
                <th className="px-3 py-1.5 font-medium">Specialty</th>
                <th className="hidden px-3 py-1.5 font-medium sm:table-cell">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              <VendorRow name="Wasatch Plumbing" specialty="Plumbing" status="On a job" />
              <VendorRow name="Peak HVAC" specialty="HVAC" status="Active" />
              <VendorRow name="Cottonwood Electric" specialty="Electrical" status="Active" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function VendorRow({
  name,
  specialty,
  status,
}: {
  name: string
  specialty: string
  status: string
}) {
  return (
    <tr>
      <td className="px-3 py-1.5 font-medium">{name}</td>
      <td className="px-3 py-1.5 text-foreground/70">{specialty}</td>
      <td className="hidden px-3 py-1.5 sm:table-cell">
        <Badge tone={status === "On a job" ? "primary" : "muted"}>{status}</Badge>
      </td>
    </tr>
  )
}
