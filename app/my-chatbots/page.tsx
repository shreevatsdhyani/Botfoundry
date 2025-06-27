"use client"

import { useState, useMemo } from "react"
import { SharedLayout } from "@/components/shared-layout"
import { ChatbotCard } from "@/components/chatbot-card"
import { ChatbotFilters } from "@/components/chatbot-filters"
import { DeleteChatbotDialog } from "@/components/delete-chatbot-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Bot, Users, MessageSquare, TrendingUp } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

interface ChatbotData {
  id: string
  name: string
  description: string
  status: "active" | "inactive" | "training"
  conversations: number
  users: number
  responseTime: string
  accuracy: number
  createdAt: string
  lastActive: string
  apiKey: string
  endpoint: string
}

// Mock data
const mockChatbots: ChatbotData[] = [
  {
    id: "bot_1",
    name: "Customer Support Bot",
    description: "Handles customer inquiries, order status, and general support questions with 24/7 availability.",
    status: "active",
    conversations: 1247,
    users: 892,
    responseTime: "1.2s",
    accuracy: 94,
    createdAt: "2024-01-15T10:30:00Z",
    lastActive: "2024-01-20T14:22:00Z",
    apiKey: "sk-cs_bot_abc123def456",
    endpoint: "https://api.botfoundry.com/v1/chatbots/bot_1",
  },
  {
    id: "bot_2",
    name: "Sales Assistant",
    description: "Qualifies leads, provides product information, and schedules demos for the sales team.",
    status: "active",
    conversations: 856,
    users: 634,
    responseTime: "0.9s",
    accuracy: 91,
    createdAt: "2024-01-10T09:15:00Z",
    lastActive: "2024-01-20T16:45:00Z",
    apiKey: "sk-sa_bot_xyz789ghi012",
    endpoint: "https://api.botfoundry.com/v1/chatbots/bot_2",
  },
  {
    id: "bot_3",
    name: "HR Onboarding Bot",
    description: "Guides new employees through the onboarding process and answers HR-related questions.",
    status: "inactive",
    conversations: 234,
    users: 156,
    responseTime: "1.8s",
    accuracy: 87,
    createdAt: "2024-01-05T11:20:00Z",
    lastActive: "2024-01-18T10:30:00Z",
    apiKey: "sk-hr_bot_mno345pqr678",
    endpoint: "https://api.botfoundry.com/v1/chatbots/bot_3",
  },
  {
    id: "bot_4",
    name: "Product Knowledge Bot",
    description: "Provides detailed product specifications, comparisons, and technical documentation.",
    status: "training",
    conversations: 0,
    users: 0,
    responseTime: "N/A",
    accuracy: 0,
    createdAt: "2024-01-20T08:00:00Z",
    lastActive: "2024-01-20T08:00:00Z",
    apiKey: "sk-pk_bot_stu901vwx234",
    endpoint: "https://api.botfoundry.com/v1/chatbots/bot_4",
  },
  {
    id: "bot_5",
    name: "FAQ Assistant",
    description: "Answers frequently asked questions about services, policies, and procedures.",
    status: "active",
    conversations: 2103,
    users: 1456,
    responseTime: "0.7s",
    accuracy: 96,
    createdAt: "2023-12-20T14:45:00Z",
    lastActive: "2024-01-20T17:12:00Z",
    apiKey: "sk-faq_bot_yza567bcd890",
    endpoint: "https://api.botfoundry.com/v1/chatbots/bot_5",
  },
  {
    id: "bot_6",
    name: "Booking Assistant",
    description: "Manages appointment scheduling, cancellations, and availability checks.",
    status: "active",
    conversations: 678,
    users: 445,
    responseTime: "1.1s",
    accuracy: 89,
    createdAt: "2024-01-08T13:30:00Z",
    lastActive: "2024-01-20T12:18:00Z",
    apiKey: "sk-ba_bot_efg123hij456",
    endpoint: "https://api.botfoundry.com/v1/chatbots/bot_6",
  },
]

interface FilterState {
  search: string
  status: string
  sortBy: string
  sortOrder: "asc" | "desc"
}

export default function MyChatbots() {
  const [chatbots, setChatbots] = useState<ChatbotData[]>(mockChatbots)
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    sortBy: "name",
    sortOrder: "asc",
  })
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    chatbot: ChatbotData | null
  }>({ open: false, chatbot: null })

  const breadcrumbs = [{ label: "Dashboard", href: "/" }, { label: "My Chatbots" }]

  // Filter and sort chatbots
  const filteredChatbots = useMemo(() => {
    const filtered = chatbots.filter((chatbot) => {
      const matchesSearch =
        chatbot.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        chatbot.description.toLowerCase().includes(filters.search.toLowerCase())
      const matchesStatus = filters.status === "all" || chatbot.status === filters.status
      return matchesSearch && matchesStatus
    })

    // Sort chatbots
    filtered.sort((a, b) => {
      let aValue: any = a[filters.sortBy as keyof ChatbotData]
      let bValue: any = b[filters.sortBy as keyof ChatbotData]

      if (filters.sortBy === "createdAt" || filters.sortBy === "lastActive") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (filters.sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [chatbots, filters])

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const activeBots = chatbots.filter((bot) => bot.status === "active").length
    const totalConversations = chatbots.reduce((sum, bot) => sum + bot.conversations, 0)
    const totalUsers = chatbots.reduce((sum, bot) => sum + bot.users, 0)
    const avgAccuracy =
      chatbots.length > 0 ? Math.round(chatbots.reduce((sum, bot) => sum + bot.accuracy, 0) / chatbots.length) : 0

    return { activeBots, totalConversations, totalUsers, avgAccuracy }
  }, [chatbots])

  const handleEdit = (chatbot: ChatbotData) => {
    toast({
      title: "Edit Chatbot",
      description: `Opening editor for ${chatbot.name}`,
    })
    // Navigate to edit page
  }

  const handleDelete = (chatbot: ChatbotData) => {
    setDeleteDialog({ open: true, chatbot })
  }

  const handleConfirmDelete = (chatbot: ChatbotData) => {
    setChatbots((prev) => prev.filter((bot) => bot.id !== chatbot.id))
    toast({
      title: "Chatbot Deleted",
      description: `${chatbot.name} has been permanently deleted.`,
    })
  }

  const handleToggleStatus = (chatbot: ChatbotData) => {
    setChatbots((prev) =>
      prev.map((bot) =>
        bot.id === chatbot.id ? { ...bot, status: bot.status === "active" ? "inactive" : ("active" as const) } : bot,
      ),
    )
  }

  return (
    <SharedLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">My Chatbots</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and monitor your AI chatbots</p>
          </div>
          <Link href="/create-chatbot">
            <Button className="mt-4 sm:mt-0 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
              <Plus className="mr-2 h-4 w-4" />
              Create New Chatbot
            </Button>
          </Link>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Chatbots</p>
                  <p className="text-2xl font-bold text-black dark:text-white">{summaryStats.activeBots}</p>
                </div>
                <Bot className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Conversations</p>
                  <p className="text-2xl font-bold text-black dark:text-white">
                    {summaryStats.totalConversations.toLocaleString()}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-black dark:text-white">
                    {summaryStats.totalUsers.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Accuracy</p>
                  <p className="text-2xl font-bold text-black dark:text-white">{summaryStats.avgAccuracy}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <ChatbotFilters
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={chatbots.length}
            filteredCount={filteredChatbots.length}
          />
        </div>

        {/* Chatbots Grid */}
        {filteredChatbots.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredChatbots.map((chatbot) => (
              <ChatbotCard
                key={chatbot.id}
                chatbot={chatbot}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bot className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-black dark:text-white mb-2">No chatbots found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filters.search || filters.status !== "all"
                ? "Try adjusting your filters to see more results."
                : "Get started by creating your first chatbot."}
            </p>
            {!filters.search && filters.status === "all" && (
              <Link href="/create-chatbot">
                <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Chatbot
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteChatbotDialog
          chatbot={deleteDialog.chatbot}
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ open, chatbot: null })}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </SharedLayout>
  )
}
