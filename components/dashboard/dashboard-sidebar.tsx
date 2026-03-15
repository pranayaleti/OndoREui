"use client"

import type React from "react"

import Link from "next/link"
import { APP_PORTAL_LOGIN_URL } from "@/lib/site"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Building,
  ChevronDown,
  DollarSign,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  User,
  Users,
  Wrench,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  disabled?: boolean
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Properties",
    href: "/dashboard/properties",
    icon: <Building className="h-5 w-5" />,
  },
  {
    title: "Tenant Applications",
    href: "/dashboard/leads",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Maintenance",
    href: "/dashboard/maintenance",
    icon: <Wrench className="h-5 w-5" />,
  },
  {
    title: "Leases",
    href: "/dashboard/leases",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Blacklist",
    href: "/dashboard/blacklist",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const filteredNavItems = navItems.filter((item) => 
    item.title === 'Blacklist' ? user?.role === 'admin' : true
  )

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarHeader className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 px-2 hover:opacity-80 transition-opacity">
            <Image
              src="/logo.png"
              alt="Ondo Real Estate"
              width={200}
              height={60}
              className="h-10 w-auto"
              quality={90}
              sizes="160px"
            />
          </Link>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                  <Link href={item.href} className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-2 py-6">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="font-medium">Admin User</span>
                  <span className="text-xs text-foreground/70">admin@example.com</span>
                </div>
                <ChevronDown className="ml-auto h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  href={APP_PORTAL_LOGIN_URL}
                  className="flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
