"use client"

// Auth is handled entirely by OndoREDashboard.
// This typed stub satisfies components that call useAuth() so they compile without error.

type UserRole = "tenant" | "owner" | "manager" | "admin" | "super_admin" | "maintenance" | null

type UserData = {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  token?: string
} | null

export function useAuth() {
  return {
    user: null as UserData,
    isLoading: false,
    login: async (_email: string, _password: string) => ({ success: false as const, error: "Auth is handled by the dashboard app" }),
    logout: () => {},
    refreshToken: async () => false,
  }
}
