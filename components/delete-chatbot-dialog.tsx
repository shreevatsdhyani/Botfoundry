"use client"

import { useState } from "react"
import { AlertTriangle, Loader2 } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

interface DeleteChatbotDialogProps {
  chatbot: ChatbotData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (chatbot: ChatbotData) => void
}

export function DeleteChatbotDialog({ chatbot, open, onOpenChange, onConfirm }: DeleteChatbotDialogProps) {
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    if (!chatbot || confirmText !== chatbot.name) return

    setIsDeleting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    onConfirm(chatbot)
    setIsDeleting(false)
    setConfirmText("")
    onOpenChange(false)
  }

  const canDelete = confirmText === chatbot?.name && !isDeleting

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDialogTitle>Delete Chatbot</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3">
            <p>
              Are you sure you want to delete <strong>{chatbot?.name}</strong>? This action cannot be undone.
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-2">This will permanently:</p>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                <li>• Delete all conversation history ({chatbot?.conversations.toLocaleString()} conversations)</li>
                <li>• Remove API access and endpoints</li>
                <li>• Delete all training data and configurations</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-name" className="text-sm font-medium">
                Type <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs">{chatbot?.name}</code>{" "}
                to confirm:
              </Label>
              <Input
                id="confirm-name"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={chatbot?.name}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                disabled={isDeleting}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!canDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Chatbot"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
