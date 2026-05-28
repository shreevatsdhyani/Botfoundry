"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { BotFoundryAPI, type Chatbot } from "@/lib/api"
import { useAuth } from "./auth-provider"

interface ChatbotData extends Chatbot {
  // Extended for UI compatibility
  users?: number
  responseTime?: string
  apiKey?: string
  endpoint?: string
}

interface ChatbotsContextType {
  chatbots: ChatbotData[]
  setChatbots: (c: ChatbotData[] | ((prev: ChatbotData[]) => ChatbotData[])) => void
  toggleStatus: (id: string) => Promise<void>
  deleteChatbot: (id: string) => Promise<void>
  addChatbot: (bot: ChatbotData) => void
  isCurrentSessionBot: (botId: string) => boolean
  activeBots: number
  newThisMonth: number
  isLoading: boolean
  refreshChatbots: () => Promise<void>
}

const ChatbotsContext = createContext<ChatbotsContextType | undefined>(undefined)

const SESSION_BOTS_KEY = "bf_session_bots_v2"

export function ChatbotsProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()
  const [chatbots, setChatbots] = useState<ChatbotData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionBotIds, setSessionBotIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set()
    try {
      const raw = sessionStorage.getItem(SESSION_BOTS_KEY)
      if (raw) return new Set(JSON.parse(raw) as string[])
    } catch (e) {
      // ignore
    }
    return new Set()
  })

  // Persist session bots
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      sessionStorage.setItem(SESSION_BOTS_KEY, JSON.stringify(Array.from(sessionBotIds)))
    } catch (e) {
      // ignore
    }
  }, [sessionBotIds])

  // Fetch chatbots from API when user logs in
  useEffect(() => {
    if (!isLoggedIn) {
      setChatbots([])
      return
    }

    refreshChatbots()
  }, [isLoggedIn])

  const refreshChatbots = async () => {
    if (!isLoggedIn) return

    setIsLoading(true)
    try {
      const data = await BotFoundryAPI.getChatbots()

      // Transform API data to UI format
      const transformed: ChatbotData[] = data.map((bot) => ({
        ...bot,
        users: 0, // TODO: Add real user count from conversations
        responseTime: bot.avg_response_time > 0 ? `${bot.avg_response_time.toFixed(1)}s` : "N/A",
        apiKey: undefined, // Fetch separately if needed
        endpoint: `/api/v1/${bot.chatbot_id}/chat`,
      }))

      setChatbots(transformed)
    } catch (error) {
      console.error("Failed to fetch chatbots:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleStatus = async (chatbotId: string) => {
    const chatbot = chatbots.find((b) => b.chatbot_id === chatbotId)
    if (!chatbot) return

    const newStatus = chatbot.status === "active" ? "inactive" : "active"

    try {
      await BotFoundryAPI.updateChatbotStatus(chatbotId, newStatus)

      // Update local state
      setChatbots((prev) =>
        prev.map((b) => (b.chatbot_id === chatbotId ? { ...b, status: newStatus } : b))
      )
    } catch (error) {
      console.error("Failed to toggle status:", error)
      throw error
    }
  }

  const deleteChatbot = async (chatbotId: string) => {
    try {
      await BotFoundryAPI.deleteChatbot(chatbotId)

      // Remove from local state
      setChatbots((prev) => prev.filter((b) => b.chatbot_id !== chatbotId))
    } catch (error) {
      console.error("Failed to delete chatbot:", error)
      throw error
    }
  }

  const addChatbot = (bot: ChatbotData) => {
    setChatbots((prev) => [bot, ...prev])
    setSessionBotIds((prev) => new Set([...prev, bot.chatbot_id]))
  }

  const isCurrentSessionBot = (botId: string) => {
    return sessionBotIds.has(botId)
  }

  const activeBots = useMemo(() => chatbots.filter((b) => b.status === "active").length, [chatbots])

  const newThisMonth = useMemo(() => {
    const now = new Date()
    return chatbots.filter((b) => {
      const d = new Date(b.created_at)
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    }).length
  }, [chatbots])

  return (
    <ChatbotsContext.Provider
      value={{
        chatbots,
        setChatbots,
        toggleStatus,
        deleteChatbot,
        addChatbot,
        isCurrentSessionBot,
        activeBots,
        newThisMonth,
        isLoading,
        refreshChatbots,
      }}
    >
      {children}
    </ChatbotsContext.Provider>
  )
}

export function useChatbots() {
  const ctx = useContext(ChatbotsContext)
  if (!ctx) throw new Error("useChatbots must be used within ChatbotsProvider")
  return ctx
}
