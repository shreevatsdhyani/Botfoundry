"use client"

import { useState } from "react"
import { Key, Copy, Trash2, Plus, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

interface ApiKey {
  id: string
  name: string
  key: string
  status: "active" | "expired"
  createdAt: string
  lastUsed: string
}

export function ApiKeysSection() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production API Key",
      key: "sk-prod_abc123def456ghi789",
      status: "active",
      createdAt: "2024-01-15",
      lastUsed: "2024-01-20",
    },
    {
      id: "2",
      name: "Development API Key",
      key: "sk-dev_xyz789uvw456rst123",
      status: "active",
      createdAt: "2024-01-10",
      lastUsed: "2024-01-19",
    },
    {
      id: "3",
      name: "Legacy API Key",
      key: "sk-legacy_old123key456",
      status: "expired",
      createdAt: "2023-12-01",
      lastUsed: "2023-12-31",
    },
  ])

  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; keyId: string | null }>({
    open: false,
    keyId: null,
  })
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  const copyToClipboard = async (key: string, name: string) => {
    try {
      await navigator.clipboard.writeText(key)
      toast({
        title: "API Key Copied",
        description: `${name} copied to clipboard`,
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually",
        variant: "destructive",
      })
    }
  }

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys)
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId)
    } else {
      newVisibleKeys.add(keyId)
    }
    setVisibleKeys(newVisibleKeys)
  }

  const handleDeleteKey = (keyId: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== keyId))
    setDeleteDialog({ open: false, keyId: null })
    toast({
      title: "API Key Deleted",
      description: "The API key has been permanently deleted.",
    })
  }

  const generateNewKey = () => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: `API Key ${apiKeys.length + 1}`,
      key: `sk-new_${Math.random().toString(36).substr(2, 20)}`,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
    }
    setApiKeys([...apiKeys, newKey])
    toast({
      title: "API Key Generated",
      description: "New API key has been created successfully.",
    })
  }

  const maskKey = (key: string) => {
    return key.substring(0, 8) + "..." + key.substring(key.length - 4)
  }

  const formatDate = (dateString: string) => {
    if (dateString === "Never") return dateString
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>API Keys</span>
          </CardTitle>
          <Button
            onClick={generateNewKey}
            size="sm"
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Generate New Key
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-medium text-black dark:text-white">{apiKey.name}</h3>
                  <Badge
                    className={
                      apiKey.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    }
                  >
                    {apiKey.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <code className="text-sm font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                    className="h-6 w-6"
                  >
                    {visibleKeys.has(apiKey.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>Created: {formatDate(apiKey.createdAt)}</span>
                  <span>Last used: {formatDate(apiKey.lastUsed)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(apiKey.key, apiKey.name)}
                  className="h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteDialog({ open: true, keyId: apiKey.id })}
                  className="h-8 w-8 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {apiKeys.length === 0 && (
            <div className="text-center py-8">
              <Key className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-black dark:text-white mb-2">No API Keys</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Generate your first API key to start using the BotFoundry API.
              </p>
              <Button
                onClick={generateNewKey}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                Generate API Key
              </Button>
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, keyId: null })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete API Key</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this API key? This action cannot be undone and will immediately revoke
                access for any applications using this key.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteDialog.keyId && handleDeleteKey(deleteDialog.keyId)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Key
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
