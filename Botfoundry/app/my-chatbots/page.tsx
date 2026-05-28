"use client"

import { ChatbotCard } from "@/components/chatbot-card"
import { ChatbotFilters } from "@/components/chatbot-filters"
import { useChatbots } from "@/components/chatbots-provider"
import { DeleteChatbotDialog } from "@/components/delete-chatbot-dialog"
import { SharedLayout } from "@/components/shared-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Bot, MessageSquare, Plus, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

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

 

interface FilterState {
  search: string
  status: string
  sortBy: string
  sortOrder: "asc" | "desc"
}

export default function MyChatbots() {
  const { chatbots, toggleStatus, deleteChatbot } = useChatbots()
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
    deleteChatbot(chatbot.id)
    toast({
      title: "Chatbot Deleted",
      description: `${chatbot.name} has been permanently deleted.`,
    })
  }

  const handleToggleStatus = (chatbot: ChatbotData) => {
    toggleStatus(chatbot.id)
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
