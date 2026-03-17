export interface PlatformRoute {
  href: string
  title: string
  description: string
  allowedRoles: string[]
}

export const platformRoutes: PlatformRoute[] = [
  {
    href: "/platform/properties",
    title: "Public Listings",
    description: "Browse, filter, map toggle, details, and favorites.",
    allowedRoles: ["public", "tenant", "owner", "admin"],
  },
  {
    href: "/platform/contact",
    title: "Contact Agent",
    description: "Inquiry form with offline queue and background sync.",
    allowedRoles: ["public", "tenant", "owner", "admin"],
  },
  {
    href: "/platform/owner",
    title: "Owner Dashboard",
    description: "Owned properties, rent status, documents, maintenance.",
    allowedRoles: ["owner", "admin"],
  },
  {
    href: "/platform/tenant",
    title: "Tenant Dashboard",
    description: "Lease details, maintenance requests, payments UI, documents.",
    allowedRoles: ["tenant", "admin"],
  },
  {
    href: "/platform/admin",
    title: "Admin Panel",
    description: "Manage users and listings with analytics layout.",
    allowedRoles: ["admin"],
  },
]
