"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SharedLayout } from "@/components/shared-layout"
import { StatCard } from "@/components/stat-card"
import { RecentActivity } from "@/components/recent-activity"
import { Button } from "@/components/ui/button"
import { Bot, Key, Crown, Plus, Zap, BookOpen, Users, BarChart3 } from "lucide-react"
import { useEffect } from "react"

export default function Dashboard() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "c":
            e.preventDefault()
            handleCreateChatbot()
            break
          case "s":
            e.preventDefault()
            // Focus search
            document.querySelector('input[type="search"]')?.focus()
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleCreateChatbot = () => {
    setIsCreating(true)
    setTimeout(() => {
      router.push("/create-chatbot")
      setIsCreating(false)
    }, 500)
  }

  const breadcrumbs = [{ label: "Dashboard" }]

  return (
    <SharedLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, John! 👋</h1>
              <p className="text-lg text-muted-foreground">Welcome to BotFoundry — your personal AI chatbot builder.</p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold text-foreground">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Chatbots Created"
            value="12"
            icon={<Bot className="h-8 w-8" />}
            trend={{ value: 25, isPositive: true }}
            gradient
          />
          <StatCard
            title="API Keys Generated"
            value="5"
            icon={<Key className="h-8 w-8" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Premium Agents Active"
            value="3"
            icon={<Crown className="h-8 w-8" />}
            trend={{ value: 8, isPositive: false }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Action Section */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-card to-muted/30 rounded-lg border border-border p-8 shadow-sm relative overflow-hidden elegant-hover">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>

              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Ready to create your next chatbot?</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Build intelligent AI chatbots with our easy-to-use platform. No coding required — just configure,
                  train, and deploy.
                </p>
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  onClick={handleCreateChatbot}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </div>
                  ) : (
                    <>
                      <Plus className="mr-2 h-5 w-5" />
                      Create New Chatbot
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">⌘C</kbd> for quick access
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow elegant-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Conversations</p>
                <p className="text-2xl font-bold text-foreground">1,247</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow elegant-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold text-foreground">1.2s</p>
              </div>
              <Zap className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow elegant-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">User Satisfaction</p>
                <p className="text-2xl font-bold text-foreground">4.8/5</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow elegant-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-foreground">892</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-20 flex-col space-y-2 border-border hover:border-foreground hover:shadow-lg transition-all duration-200 hover:scale-105 elegant-hover"
            onClick={() => router.push("/my-chatbots")}
          >
            <Bot className="h-6 w-6" />
            <span>View Chatbots</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col space-y-2 border-border hover:border-foreground hover:shadow-lg transition-all duration-200 hover:scale-105 elegant-hover"
            onClick={() => router.push("/account")}
          >
            <Key className="h-6 w-6" />
            <span>Manage API Keys</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col space-y-2 border-border hover:border-foreground hover:shadow-lg transition-all duration-200 hover:scale-105 elegant-hover"
            onClick={() => router.push("/premium-agent")}
          >
            <Crown className="h-6 w-6" />
            <span>Upgrade Plan</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col space-y-2 border-border hover:border-foreground hover:shadow-lg transition-all duration-200 hover:scale-105 elegant-hover"
          >
            <BookOpen className="h-6 w-6" />
            <span>Documentation</span>
          </Button>
        </div>
      </div>
    </SharedLayout>
  )
}
