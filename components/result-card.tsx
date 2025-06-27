"use client"

import { useState } from "react"
import { Copy, Check, ExternalLink, Bot, Key, Globe, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface ChatbotResult {
  id: string
  name: string
  apiKey: string
  endpoint: string
  createdAt: string
}

interface ResultCardProps {
  result: ChatbotResult
}

export function ResultCard({ result }: ResultCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
      })
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-green-800 dark:text-green-200">
          <Bot className="h-5 w-5" />
          <span>Chatbot Created Successfully!</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chatbot Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Chatbot Name</label>
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <Bot className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-black dark:text-white">{result.name}</span>
            </div>
          </div>
        </div>

        {/* API Key */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">API Key</label>
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <Key className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <code className="font-mono text-sm text-black dark:text-white truncate">{result.apiKey}</code>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(result.apiKey, "API Key")}
              className="ml-2 flex-shrink-0"
            >
              {copiedField === "API Key" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Endpoint URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Endpoint URL</label>
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <Globe className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <code className="font-mono text-sm text-black dark:text-white truncate">{result.endpoint}</code>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(result.endpoint, "Endpoint URL")}
              className="ml-2 flex-shrink-0"
            >
              {copiedField === "Endpoint URL" ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Creation Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Created</label>
          <div className="flex items-center space-x-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-black dark:text-white">{formatDate(result.createdAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
            <ExternalLink className="mr-2 h-4 w-4" />
            Test Chatbot
          </Button>
          <Button variant="outline" className="flex-1">
            View Documentation
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
