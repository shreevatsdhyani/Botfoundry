"use client"

import { useState } from "react"
import {
  MoreHorizontal,
  Bot,
  Users,
  MessageSquare,
  TrendingUp,
  Power,
  PowerOff,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
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

interface ChatbotCardProps {
  chatbot: ChatbotData
  onEdit: (chatbot: ChatbotData) => void
  onDelete: (chatbot: ChatbotData) => void
  onToggleStatus: (chatbot: ChatbotData) => void
}

export function ChatbotCard({ chatbot, onEdit, onDelete, onToggleStatus }: ChatbotCardProps) {
  const [isToggling, setIsToggling] = useState(false)

  const handleToggleStatus = async () => {
    setIsToggling(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onToggleStatus(chatbot)
    setIsToggling(false)
    toast({
      title: `Chatbot ${chatbot.status === "active" ? "deactivated" : "activated"}`,
      description: `${chatbot.name} is now ${chatbot.status === "active" ? "inactive" : "active"}`,
    })
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      case "training":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div
              className={`p-2 rounded-lg ${chatbot.status === "active" ? "bg-green-100 dark:bg-green-900/20" : "bg-gray-100 dark:bg-gray-800"}`}
            >
              <Bot
                className={`h-5 w-5 ${chatbot.status === "active" ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-black dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {chatbot.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{chatbot.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={getStatusColor(chatbot.status)}>
                  {chatbot.status === "active" && <Power className="w-3 h-3 mr-1" />}
                  {chatbot.status === "inactive" && <PowerOff className="w-3 h-3 mr-1" />}
                  {chatbot.status === "training" && (
                    <div className="w-3 h-3 mr-1 rounded-full bg-current animate-pulse" />
                  )}
                  {chatbot.status.charAt(0).toUpperCase() + chatbot.status.slice(1)}
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Created {formatDate(chatbot.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={chatbot.status === "active"}
                onCheckedChange={handleToggleStatus}
                disabled={isToggling || chatbot.status === "training"}
                className="data-[state=checked]:bg-green-600"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(chatbot)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Chatbot
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => copyToClipboard(chatbot.apiKey, "API Key")}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy API Key
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => copyToClipboard(chatbot.endpoint, "Endpoint URL")}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Endpoint
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Test Chatbot
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(chatbot)}
                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Chatbot
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-lg font-semibold text-black dark:text-white">
              {chatbot.conversations.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Conversations</div>
          </div>

          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-lg font-semibold text-black dark:text-white">{chatbot.users.toLocaleString()}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Users</div>
          </div>

          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-lg font-semibold text-black dark:text-white">{chatbot.accuracy}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Accuracy</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 dark:text-gray-400">Response Time:</span>
            <span className="font-medium text-black dark:text-white">{chatbot.responseTime}</span>
          </div>
          <div className="text-gray-500 dark:text-gray-400">Last active: {formatDate(chatbot.lastActive)}</div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Test
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(chatbot)}
            className="flex-1 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
