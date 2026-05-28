"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Bot, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SharedLayout } from "@/components/shared-layout"
import { ChatbotTestInterface } from "@/components/chatbot-test-interface"
import { APIKeyDisplay } from "@/components/api-key-display"
import { BotFoundryAPI, type ChatbotWithAPI } from "@/lib/api"

export default function ChatbotDetailPage() {
  const params = useParams()
  const router = useRouter()
  const chatbotId = params.id as string

  const [chatbot, setChatbot] = useState<ChatbotWithAPI | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadChatbot()
  }, [chatbotId])

  const loadChatbot = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await BotFoundryAPI.getChatbot(chatbotId)
      setChatbot(data)
    } catch (err: any) {
      setError(err.message || "Failed to load chatbot")
    } finally {
      setIsLoading(false)
    }
  }

  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "My Chatbots", href: "/my-chatbots" },
    { label: chatbot?.name || "Chatbot Details" },
  ]

  if (isLoading) {
    return (
      <SharedLayout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </SharedLayout>
    )
  }

  if (error || !chatbot) {
    return (
      <SharedLayout breadcrumbs={breadcrumbs}>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <p className="text-destructive mb-4">{error || "Chatbot not found"}</p>
                <Button onClick={() => router.push("/my-chatbots")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Chatbots
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SharedLayout>
    )
  }

  return (
    <SharedLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/my-chatbots")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold">{chatbot.name}</h1>
                <Badge variant={chatbot.status === "active" ? "default" : "secondary"}>
                  {chatbot.status}
                </Badge>
              </div>
              {chatbot.description && (
                <p className="text-muted-foreground mt-2">{chatbot.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chatbot.total_conversations}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chatbot.total_messages}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {chatbot.avg_response_time > 0 ? `${chatbot.avg_response_time.toFixed(1)}s` : "N/A"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chatbot.accuracy_score}%</div>
            </CardContent>
          </Card>
        </div>

        {/* API Endpoint Info */}
        <Card>
          <CardHeader>
            <CardTitle>API Endpoint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Public API Endpoint:</p>
                <code className="text-sm bg-muted px-3 py-2 rounded block break-all">
                  POST http://localhost:5000/api/{chatbot.chatbot_id}/chat
                </code>
              </div>
              <div className="mt-3">
                <p className="text-sm text-muted-foreground mb-1">Example cURL Request:</p>
                <code className="text-xs bg-muted px-3 py-2 rounded block overflow-x-auto">
                  curl -X POST http://localhost:5000/api/{chatbot.chatbot_id}/chat \<br />
                  &nbsp;&nbsp;-H "X-API-Key: your-api-key" \<br />
                  &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                  &nbsp;&nbsp;-d '{`{"query": "Hello!"}`}'
                </code>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Use this endpoint with an API key to integrate your chatbot anywhere.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* API Keys Management */}
        <APIKeyDisplay
          chatbotId={chatbot.chatbot_id}
          apiKeys={chatbot.api_keys}
          onKeysChange={loadChatbot}
        />

        {/* Test Interface */}
        <ChatbotTestInterface chatbotId={chatbot.chatbot_id} chatbotName={chatbot.name} />
      </div>
    </SharedLayout>
  )
}
