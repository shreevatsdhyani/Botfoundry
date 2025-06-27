"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { LayoutDashboard, Bot, Plus, Crown, User, Zap, ChevronLeft, ChevronRight, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/components/auth-provider"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, shortcut: "D" },
  { name: "My Chatbots", href: "/my-chatbots", icon: Bot, shortcut: "M" },
  { name: "Create Chatbot", href: "/create-chatbot", icon: Plus, shortcut: "C" },
  { name: "Premium Agent", href: "/premium-agent", icon: Crown, shortcut: "P" },
  { name: "Account", href: "/account", icon: User, shortcut: "A" },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: (collapsed: boolean) => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { logout, isLoggedIn } = useAuth()
  const [isHovering, setIsHovering] = useState<string | null>(null)

  if (!isLoggedIn) {
    return null
  }

  return (
    <TooltipProvider>
      <div
        className={`fixed left-0 top-0 h-full bg-card/90 backdrop-blur-md border-r border-border transition-all duration-300 z-40 ${collapsed ? "w-16" : "w-64"}`}
        onMouseLeave={() => setIsHovering(null)}
      >
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Zap className="h-8 w-8 text-foreground" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                </div>
                <h1 className="text-xl font-bold text-foreground">BotFoundry</h1>
              </div>
            )}
            {collapsed && (
              <div className="flex justify-center w-full">
                <div className="relative">
                  <Zap className="h-8 w-8 text-foreground" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggle(!collapsed)}
              className={`h-8 w-8 text-muted-foreground hover:text-foreground ${collapsed ? "absolute top-6 right-2" : ""}`}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const NavItem = (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group elegant-hover
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
                onMouseEnter={() => setIsHovering(item.name)}
                onMouseLeave={() => setIsHovering(null)}
              >
                <item.icon
                  className={`h-5 w-5 ${collapsed ? "" : "mr-3"} ${isActive ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`}
                />
                {!collapsed && <span className="flex-1">{item.name}</span>}
                {!collapsed && (
                  <kbd className="hidden group-hover:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    {item.shortcut}
                  </kbd>
                )}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>{NavItem}</TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              )
            }

            return NavItem
          })}
        </nav>

        {/* Quick Stats in Sidebar */}
        {!collapsed && (
          <div className="absolute bottom-20 left-4 right-4">
            <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-950/40 dark:to-purple-950/40 rounded-lg p-4 border border-border backdrop-blur-sm elegant-hover">
              <div className="text-xs font-medium text-muted-foreground mb-2">Quick Stats</div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Bots</span>
                  <span className="font-semibold text-foreground">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-semibold text-green-600">+3</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className={`absolute bottom-4 ${collapsed ? "left-0 right-0 flex justify-center" : "left-4 right-4"}`}>
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="h-10 w-10 text-muted-foreground hover:text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start text-muted-foreground hover:text-red-600"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
