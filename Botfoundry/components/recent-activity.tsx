"use client"

import { useState } from "react"
import { Bot, Key, Crown, Settings, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

const activities = [
  {
    id: 1,
    action: "Created new chatbot",
    target: "Customer Support Bot",
    time: "2 hours ago",
    icon: Bot,
    color: "text-blue-600",
  },
  {
    id: 2,
    action: "Generated API key",
    target: "Production Environment",
    time: "4 hours ago",
    icon: Key,
    color: "text-green-600",
  },
  {
    id: 3,
    action: "Upgraded to Premium",
    target: "Sales Assistant Agent",
    time: "1 day ago",
    icon: Crown,
    color: "text-purple-600",
  },
  {
    id: 4,
    action: "Updated settings",
    target: "Account preferences",
    time: "2 days ago",
    icon: Settings,
    color: "text-gray-600",
  },
  {
    id: 5,
    action: "Created new chatbot",
    target: "HR Onboarding Bot",
    time: "3 days ago",
    icon: Bot,
    color: "text-blue-600",
  },
  {
    id: 6,
    action: "Generated API key",
    target: "Development Environment",
    time: "4 days ago",
    icon: Key,
    color: "text-green-600",
  },
  {
    id: 7,
    action: "Updated settings",
    target: "Notification preferences",
    time: "5 days ago",
    icon: Settings,
    color: "text-gray-600",
  },
]

export function RecentActivity() {
  const [expanded, setExpanded] = useState(false)
  const displayActivities = expanded ? activities : activities.slice(0, 3)

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm elegant-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Clock className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        {displayActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className={`p-2 rounded-full bg-muted ${activity.color}`}>
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{activity.action}</p>
              <p className="text-sm text-muted-foreground truncate">{activity.target}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={() => setExpanded(!expanded)}
        variant="ghost"
        className="w-full mt-4 text-sm text-primary hover:text-primary/80 font-medium transition-colors flex items-center justify-center"
      >
        {expanded ? (
          <>
            Show Less <ChevronUp className="ml-1 h-4 w-4" />
          </>
        ) : (
          <>
            View All Activity <ChevronDown className="ml-1 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  )
}
