"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, Bot, LayoutDashboard, Plus, Crown, User, Clock, Command } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchResult {
  id: string
  title: string
  description: string
  type: "page" | "chatbot" | "activity" | "action"
  href?: string
  icon: React.ComponentType<{ className?: string }>
  action?: () => void
}

const searchData: SearchResult[] = [
  // Pages
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Main dashboard overview",
    type: "page",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    id: "my-chatbots",
    title: "My Chatbots",
    description: "View and manage your chatbots",
    type: "page",
    href: "/my-chatbots",
    icon: Bot,
  },
  {
    id: "create-chatbot",
    title: "Create Chatbot",
    description: "Build a new AI chatbot",
    type: "page",
    href: "/create-chatbot",
    icon: Plus,
  },
  {
    id: "premium-agent",
    title: "Premium Agent",
    description: "Upgrade to premium features",
    type: "page",
    href: "/premium-agent",
    icon: Crown,
  },
  {
    id: "account",
    title: "Account",
    description: "Manage your account settings",
    type: "page",
    href: "/account",
    icon: User,
  },
  // Chatbots
  {
    id: "customer-support-bot",
    title: "Customer Support Bot",
    description: "Handles customer inquiries and support",
    type: "chatbot",
    href: "/my-chatbots",
    icon: Bot,
  },
  {
    id: "sales-assistant",
    title: "Sales Assistant",
    description: "Qualifies leads and provides product info",
    type: "chatbot",
    href: "/my-chatbots",
    icon: Bot,
  },
  {
    id: "hr-onboarding-bot",
    title: "HR Onboarding Bot",
    description: "Guides new employees through onboarding",
    type: "chatbot",
    href: "/my-chatbots",
    icon: Bot,
  },
  // Activities
  {
    id: "recent-activity",
    title: "Recent Activity",
    description: "View your recent actions and updates",
    type: "activity",
    icon: Clock,
  },
  // Actions
  {
    id: "api-keys",
    title: "API Keys",
    description: "Manage your API keys",
    type: "action",
    href: "/account",
    icon: Command,
  },
]

interface SearchBoxProps {
  onFocus?: () => void
  onBlur?: () => void
}

export function SearchBox({ onFocus, onBlur }: SearchBoxProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Search function
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const filtered = searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setResults(filtered.slice(0, 8)) // Limit to 8 results
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    performSearch(value)
    setSelectedIndex(-1)
  }

  // Handle result selection
  const handleResultSelect = (result: SearchResult) => {
    if (result.href) {
      router.push(result.href)
    } else if (result.action) {
      result.action()
    }
    setQuery("")
    setResults([])
    setIsOpen(false)
    inputRef.current?.blur()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultSelect(results[selectedIndex])
        }
        break
      case "Escape":
        setIsOpen(false)
        setQuery("")
        setResults([])
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Handle focus
  const handleFocus = () => {
    setIsOpen(true)
    if (query) {
      performSearch(query)
    }
    onFocus?.()
  }

  // Handle blur
  const handleBlur = (e: React.FocusEvent) => {
    // Delay hiding to allow clicking on results
    setTimeout(() => {
      if (!searchRef.current?.contains(document.activeElement)) {
        setIsOpen(false)
        onBlur?.()
      }
    }, 150)
  }

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => window.removeEventListener("keydown", handleGlobalKeyDown)
  }, [])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "page":
        return "text-blue-600 dark:text-blue-400"
      case "chatbot":
        return "text-green-600 dark:text-green-400"
      case "activity":
        return "text-purple-600 dark:text-purple-400"
      case "action":
        return "text-orange-600 dark:text-orange-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <Search
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${
            isOpen ? "text-black dark:text-white" : "text-gray-400"
          }`}
        />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search chatbots, pages, or actions..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="pl-10 w-80 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white transition-all duration-200"
        />
        <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 hidden sm:inline-flex">
          ⌘S
        </kbd>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
          {results.length > 0 ? (
            <div className="search-results">
              {results.map((result, index) => (
                <Button
                  key={result.id}
                  variant="ghost"
                  className={`w-full justify-start p-4 h-auto text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    index === selectedIndex ? "bg-gray-100 dark:bg-gray-700" : ""
                  }`}
                  onClick={() => handleResultSelect(result)}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${getTypeColor(result.type)}`}>
                      <result.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-black dark:text-white truncate">{result.title}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize ml-2">{result.type}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{result.description}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          ) : query ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <div className="p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Quick actions:</p>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleResultSelect(searchData.find((item) => item.id === "create-chatbot")!)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create new chatbot
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleResultSelect(searchData.find((item) => item.id === "my-chatbots")!)}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  View my chatbots
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
