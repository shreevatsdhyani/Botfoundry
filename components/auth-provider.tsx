"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)
    setIsLoading(false)

    // Redirect logic
    if (!loggedIn && pathname !== "/login") {
      router.push("/login")
    } else if (loggedIn && pathname === "/login") {
      router.push("/")
    }
  }, [pathname, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call - accept any email/password for demo
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem("isLoggedIn", "true")
        setIsLoggedIn(true)
        resolve(true)
      }, 1000)
    })
  }

  const logout = () => {
    localStorage.setItem("isLoggedIn", "false")
    setIsLoggedIn(false)
    router.push("/login")
  }

  // Show nothing while checking auth status
  if (isLoading) {
    return null
  }

  return <AuthContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
