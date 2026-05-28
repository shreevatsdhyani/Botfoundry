"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Sidebar } from "./sidebar"
import { Navbar } from "./navbar"
import { Breadcrumbs } from "./breadcrumbs"
import { useAuth } from "./auth-provider"

interface SharedLayoutProps {
  children: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function SharedLayout({ children, breadcrumbs }: SharedLayoutProps) {
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()
  const { isLoggedIn } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      setSidebarCollapsed(savedState === "true")
    }
    setMounted(true)
  }, [])

  // Save sidebar state to localStorage
  const handleToggleSidebar = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed)
    localStorage.setItem("sidebarCollapsed", String(collapsed))
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  // If not logged in, don't render the layout
  if (!isLoggedIn) {
    return <>{children}</>
  }

  const isDark = resolvedTheme === "dark"

  return (
    <div className="min-h-screen relative transition-colors">
      {/* Dynamic Dotted Background */}
      <div
        className={`dotted-background dotted-background-animated ${
          isDark ? "dotted-background-dark" : "dotted-background-light"
        }`}
      />

      {/* Gradient Overlay for Depth */}
      <div className="background-overlay" />

      <div className="flex relative z-10">
        <Sidebar collapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
          <Navbar />
          {breadcrumbs && (
            <div className="px-6 py-2 border-b border-border bg-card/80 backdrop-blur-sm">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          )}
          <main className="flex-1 p-6 relative">{children}</main>
        </div>
      </div>
    </div>
  )
}
