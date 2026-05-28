"use client"

import { useState } from "react"
import { Copy, Eye, EyeOff, Plus, Trash2, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BotFoundryAPI, type APIKey } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

interface APIKeyDisplayProps {
  chatbotId: string
  apiKeys: APIKey[]
  onKeysChange: () => void
}

export function APIKeyDisplay({ chatbotId, apiKeys, onKeysChange }: APIKeyDisplayProps) {
  const [showKeys, setShowKeys] = useState<{ [key: number]: boolean }>({})
  const [copiedKey, setCopiedKey] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [newKeyName, setNewKeyName] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)

  const toggleShowKey = (keyId: number) => {
    setShowKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const copyToClipboard = async (key: string, keyId: number) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKey(keyId)
      toast({
        title: "Copied!",
        description: "API key copied to clipboard",
      })
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy API key",
        variant: "destructive",
      })
    }
  }

  const handleCreateKey = async () => {
    setIsCreating(true)
    try {
      const newKey = await BotFoundryAPI.createAPIKey(chatbotId, newKeyName || undefined)
      setNewlyCreatedKey(newKey.key) // Show the plain key
      toast({
        title: "Success!",
        description: "API key created. Copy it now - you won't see it again!",
      })
      setNewKeyName("")
      onKeysChange()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create API key",
        variant: "destructive",
      })
      setShowCreateDialog(false)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteKey = async (keyId: number) => {
    setIsDeleting(keyId)
    try {
      await BotFoundryAPI.deleteAPIKey(chatbotId, keyId)
      toast({
        title: "Success",
        description: "API key deleted successfully",
      })
      onKeysChange()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete API key",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const maskKey = (key: string) => {
    return `${key.substring(0, 8)}${"•".repeat(32)}${key.substring(key.length - 4)}`
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage API keys for this chatbot</CardDescription>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>
                  Generate a new API key for this chatbot. Keep it secure and don't share it publicly.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="key-name">Key Name (Optional)</Label>
                  <Input
                    id="key-name"
                    placeholder="Production Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateKey} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Key"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {apiKeys.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No API keys yet</p>
            <Button size="sm" variant="outline" onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Key
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{apiKey.name || "Unnamed Key"}</h4>
                    <Badge variant={apiKey.is_active ? "default" : "secondary"} className="text-xs">
                      {apiKey.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono bg-background px-2 py-1 rounded">
                      {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => toggleShowKey(apiKey.id)}
                    >
                      {showKeys[apiKey.id] ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                    >
                      {copiedKey === apiKey.id ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Requests: {apiKey.total_requests}</span>
                    {apiKey.last_used && (
                      <span>Last used: {new Date(apiKey.last_used).toLocaleDateString()}</span>
                    )}
                    <span>Created: {new Date(apiKey.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive/80"
                  onClick={() => handleDeleteKey(apiKey.id)}
                  disabled={isDeleting === apiKey.id}
                >
                  {isDeleting === apiKey.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Show newly created key dialog */}
      <Dialog open={!!newlyCreatedKey} onOpenChange={() => setNewlyCreatedKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              API Key Created Successfully!
            </DialogTitle>
            <DialogDescription>
              Copy this key now - you won't be able to see it again for security reasons!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                ⚠️ Important: Save this key immediately
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                This is the only time you'll see the full key. Store it in a safe place.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Your API Key:</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 bg-muted rounded-lg text-sm font-mono break-all">
                  {newlyCreatedKey}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    navigator.clipboard.writeText(newlyCreatedKey || "")
                    toast({
                      title: "Copied!",
                      description: "API key copied to clipboard",
                    })
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => {
              setNewlyCreatedKey(null)
              setShowCreateDialog(false)
            }}>
              I've Saved It
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
