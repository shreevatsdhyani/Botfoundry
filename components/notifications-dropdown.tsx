"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Bot, Key, Crown, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  type: "system" | "activity" | "reminder"
  read: boolean
  icon: React.ComponentType<{ className?: string }>
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Chatbot Deployed",
    message: "Your Customer Support Bot has been successfully deployed and is now live.",
    time: "2 minutes ago",
    type: "system",
    read: false,
    icon: Bot,
  },
  {
    id: "2",
    title: "Daily Activity",
    message: "3 users tested your Sales Assistant chatbot today with 95% satisfaction.",
    time: "1 hour ago",
    type: "activity",
    read: false,
    icon: Settings,
  },
  {
    id: "3",
    title: "API Key Expiring",
    message: "Your production API key will expire in 7 days. Renew it to avoid service interruption.",
    time: "3 hours ago",
    type: "reminder",
    read: true,
    icon: Key,
  },
  {
    id: "4",
    title: "Premium Feature Available",
    message: "New automation features are now available with your Premium Agent subscription.",
    time: "1 day ago",
    type: "system",
    read: true,
    icon: Crown,
  },
  {
    id: "5",
    title: "Weekly Report",
    message: "Your chatbots handled 247 conversations this week, up 15% from last week.",
    time: "2 days ago",
    type: "activity",
    read: true,
    icon: Settings,
  },
]

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "system":
        return "text-blue-600 dark:text-blue-400"
      case "activity":
        return "text-green-600 dark:text-green-400"
      case "reminder":
        return "text-orange-600 dark:text-orange-400"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end" sideOffset={8}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-primary hover:text-primary/80"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="max-h-96">
          {notifications.length > 0 ? (
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group relative p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${
                    !notification.read ? "bg-muted/30" : ""
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-muted ${getTypeColor(notification.type)}`}>
                      <notification.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p
                          className={`text-sm font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {notification.title}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(notification.id)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                    </div>
                    {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-3 border-t border-border">
            <Button variant="ghost" className="w-full text-sm text-primary hover:text-primary/80">
              View All Notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
