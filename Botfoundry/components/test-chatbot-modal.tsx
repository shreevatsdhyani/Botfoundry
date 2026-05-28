"use client"

import { ChatbotTestInterface } from "@/components/chatbot-test-interface"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface TestChatbotModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chatbotName: string
}

export function TestChatbotModal({ open, onOpenChange, chatbotName }: TestChatbotModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Test {chatbotName}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ChatbotTestInterface chatbotName={chatbotName} className="border-0" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
