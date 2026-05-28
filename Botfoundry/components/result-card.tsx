// "use client"

// import { useState } from "react"
// import { Copy, Check, ExternalLink, Bot, Key, Globe, Calendar } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { toast } from "@/components/ui/use-toast"

// interface ChatbotResult {
//   id: string
//   name: string
//   apiKey: string
//   endpoint: string
//   createdAt: string
// }

// interface ResultCardProps {
//   result: ChatbotResult
// }

// export function ResultCard({ result }: ResultCardProps) {
//   const [copiedField, setCopiedField] = useState<string | null>(null)

//   const copyToClipboard = async (text: string, field: string) => {
//     try {
//       await navigator.clipboard.writeText(text)
//       setCopiedField(field)
//       toast({
//         title: "Copied!",
//         description: `${field} copied to clipboard`,
//       })
//       setTimeout(() => setCopiedField(null), 2000)
//     } catch (err) {
//       toast({
//         title: "Failed to copy",
//         description: "Please copy manually",
//         variant: "destructive",
//       })
//     }
//   }

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   return (
//     <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
//       <CardHeader>
//         <CardTitle className="flex items-center space-x-2 text-green-800 dark:text-green-200">
//           <Bot className="h-5 w-5" />
//           <span>Chatbot Created Successfully!</span>
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {/* Chatbot Name */}
//         <div className="space-y-2">
//           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Chatbot Name</label>
//           <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
//             <div className="flex items-center space-x-2">
//               <Bot className="h-4 w-4 text-gray-500" />
//               <span className="font-medium text-black dark:text-white">{result.name}</span>
//             </div>
//           </div>
//         </div>

//         {/* API Key */}
//         <div className="space-y-2">
//           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">API Key</label>
//           <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
//             <div className="flex items-center space-x-2 flex-1 min-w-0">
//               <Key className="h-4 w-4 text-gray-500 flex-shrink-0" />
//               <code className="font-mono text-sm text-black dark:text-white truncate">{result.apiKey}</code>
//             </div>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => copyToClipboard(result.apiKey, "API Key")}
//               className="ml-2 flex-shrink-0"
//             >
//               {copiedField === "API Key" ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
//             </Button>
//           </div>
//         </div>

//         {/* Endpoint URL */}
//         <div className="space-y-2">
//           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Endpoint URL</label>
//           <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
//             <div className="flex items-center space-x-2 flex-1 min-w-0">
//               <Globe className="h-4 w-4 text-gray-500 flex-shrink-0" />
//               <code className="font-mono text-sm text-black dark:text-white truncate">{result.endpoint}</code>
//             </div>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => copyToClipboard(result.endpoint, "Endpoint URL")}
//               className="ml-2 flex-shrink-0"
//             >
//               {copiedField === "Endpoint URL" ? (
//                 <Check className="h-4 w-4 text-green-600" />
//               ) : (
//                 <Copy className="h-4 w-4" />
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Creation Date */}
//         <div className="space-y-2">
//           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Created</label>
//           <div className="flex items-center space-x-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
//             <Calendar className="h-4 w-4 text-gray-500" />
//             <span className="text-black dark:text-white">{formatDate(result.createdAt)}</span>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-3 pt-4">
//           <Button className="flex-1 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
//             <ExternalLink className="mr-2 h-4 w-4" />
//             Test Chatbot
//           </Button>
//           <Button variant="outline" className="flex-1">
//             View Documentation
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }



"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { BotFoundryAPI } from "@/lib/api"
import { Bot, CheckCircle, Copy, ExternalLink, Globe, Key, Loader2, MessageSquare, Send } from 'lucide-react'
import { useState } from "react"

interface ChatbotResult {
  id: string
  name: string
  apiKey: string
  endpoint: string
  createdAt: string
  vectorStore?: string
}

interface ResultCardProps {
  result: ChatbotResult
}

export function ResultCard({ result }: ResultCardProps) {
  const [testQuery, setTestQuery] = useState("")
  const [testResponse, setTestResponse] = useState<string | null>(null)
  const [isTestingChatbot, setIsTestingChatbot] = useState(false)

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

  const testChatbot = async () => {
    if (!testQuery.trim()) {
      toast({
        title: "Please enter a question",
        description: "Type a question to test your chatbot",
        variant: "destructive",
      })
      return
    }

    setIsTestingChatbot(true)
    setTestResponse(null)

    try {
      const response = await BotFoundryAPI.askChatbot(testQuery)
      setTestResponse(response.answer)
      toast({
        title: "Test successful!",
        description: "Your chatbot responded successfully",
      })
    } catch (error) {
      console.error('Error testing chatbot:', error)
      toast({
        title: "Test failed",
        description: error instanceof Error ? error.message : "Failed to get response from chatbot",
        variant: "destructive",
      })
    } finally {
      setIsTestingChatbot(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <CardTitle className="text-green-800 dark:text-green-200">
              🎉 Chatbot Created Successfully!
            </CardTitle>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Your AI assistant "{result.name}" is ready to use
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Chatbot Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Chatbot Name</label>
              <div className="flex items-center space-x-2 mt-1">
                <Bot className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground">{result.name}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="text-sm text-foreground mt-1">{formatDate(result.createdAt)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Active
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">API Key</label>
              <div className="flex items-center space-x-2 mt-1">
                <Key className="h-4 w-4 text-muted-foreground" />
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono flex-1 truncate">
                  {result.apiKey}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(result.apiKey, "API Key")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Endpoint URL</label>
              <div className="flex items-center space-x-2 mt-1">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono flex-1 truncate">
                  {result.endpoint}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(result.endpoint, "Endpoint URL")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {result.vectorStore && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Vector Store</label>
                <p className="text-xs text-muted-foreground mt-1 font-mono">{result.vectorStore}</p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Test Chatbot Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-foreground">Test Your Chatbot</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask your chatbot a question..."
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isTestingChatbot && testChatbot()}
                disabled={isTestingChatbot}
                className="flex-1"
              />
              <Button 
                onClick={testChatbot} 
                disabled={isTestingChatbot || !testQuery.trim()}
                className="px-4"
              >
                {isTestingChatbot ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {testResponse && (
              <div className="p-4 bg-card border border-border rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-blue-100 dark:bg-blue-900/20 rounded">
                    <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{testResponse}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1" onClick={() => window.open('/my-chatbots', '_self')}>
            <Bot className="mr-2 h-4 w-4" />
            View All Chatbots
          </Button>
          <Button variant="outline" className="flex-1">
            <ExternalLink className="mr-2 h-4 w-4" />
            Integration Guide
          </Button>
        </div>

        {/* Integration Example */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">Quick Integration Example</h4>
          <pre className="text-xs text-muted-foreground overflow-x-auto">
{`curl -X POST "${result.endpoint}" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "Hello, how can you help me?"}'`}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
