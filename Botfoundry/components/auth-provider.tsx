"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { BotFoundryAPI, AuthManager, type User } from "@/lib/api"

interface AuthContextType {
  isLoggedIn: boolean
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: {
    email: string
    username: string
    password: string
    full_name?: string
  }) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = AuthManager.isAuthenticated()

      if (authenticated) {
        try {
          // Fetch current user data
          const userData = await BotFoundryAPI.getCurrentUser()
          setUser(userData)
          setIsLoggedIn(true)
        } catch (error) {
          console.error("Failed to fetch user:", error)
          // Token is invalid, clear it
          AuthManager.clearTokens()
          setIsLoggedIn(false)
          setUser(null)
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Handle redirects
  useEffect(() => {
    if (isLoading) return

    const publicPaths = ["/login"]
    const isPublicPath = publicPaths.includes(pathname)

    if (!isLoggedIn && !isPublicPath) {
      router.push("/login")
    } else if (isLoggedIn && pathname === "/login") {
      router.push("/")
    }
  }, [isLoggedIn, isLoading, pathname, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Call API login - this stores tokens
      await BotFoundryAPI.login(email, password)

      // Small delay to ensure tokens are stored
      await new Promise(resolve => setTimeout(resolve, 100))

      // Fetch user data
      const userData = await BotFoundryAPI.getCurrentUser()
      setUser(userData)
      setIsLoggedIn(true)

      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const register = async (data: {
    email: string
    username: string
    password: string
    full_name?: string
  }): Promise<boolean> => {
    try {
      // Register user
      await BotFoundryAPI.register(data)

      // Auto-login after registration
      await BotFoundryAPI.login(data.email, data.password)

      // Small delay to ensure tokens are stored
      await new Promise(resolve => setTimeout(resolve, 100))

      // Fetch user data
      const userData = await BotFoundryAPI.getCurrentUser()
      setUser(userData)
      setIsLoggedIn(true)

      return true
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    }
  }

  const logout = () => {
    BotFoundryAPI.logout()
    setIsLoggedIn(false)
    setUser(null)
    router.push("/login")
  }

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
