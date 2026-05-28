"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"

interface EditChatbotDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chatbotName: string
  onSave: (newName: string) => void
}

export function EditChatbotDialog({ open, onOpenChange, chatbotName, onSave }: EditChatbotDialogProps) {
  const [newName, setNewName] = useState(chatbotName)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!newName.trim()) {
      toast({
        title: "Error",
        description: "Chatbot name cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onSave(newName.trim())
    toast({
      title: "Success",
      description: `Chatbot renamed to "${newName}"`,
    })
    setIsSaving(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Chatbot</DialogTitle>
          <DialogDescription>Update the name of your chatbot. This will be visible to users.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="chatbot-name">Chatbot Name</Label>
            <Input
              id="chatbot-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
              disabled={isSaving}
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
