"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Home, FileText, MessageSquare } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await logout()
    setIsLoading(false)
  }

  const getInitials = (name: string | undefined) => {
    if (!name || typeof name !== 'string') return '?'
    return name
      .trim()
      .split(/\s+/)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  }

  const getDashboardLink = () => {
    if (!user?.role) return '/dashboard'

    switch (user.role) {
      case 'owner':
      case 'admin':
        return '/dashboard'
      case 'tenant':
        return '/properties'
      default:
        return '/dashboard'
    }
  }

  if (!user) return null

  const u = user as { name?: string; firstName?: string; lastName?: string; email: string }
  const displayName =
    u.name ?? ([u.firstName, u.lastName].filter(Boolean).join(' ').trim() || u.email)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={displayName} />
            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-foreground/70">
              {user.email}
            </p>
            <p className="text-xs leading-none text-foreground/70 capitalize">
              {user.role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push(getDashboardLink())}>
          <Home className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>

        {(user.role === 'owner' || user.role === 'admin') && (
          <>
            <DropdownMenuItem onClick={() => router.push('/properties/manage')}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Manage Properties</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/maintenance')}>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Maintenance Requests</span>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem onClick={() => router.push('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoading}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoading ? 'Logging out...' : 'Log out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}