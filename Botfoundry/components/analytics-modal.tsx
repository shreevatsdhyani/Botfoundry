"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock, MessageSquare, TrendingUp, Users } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface AnalyticsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chatbotName: string
  stats: {
    conversations: number
    users: number
    accuracy: number
    responseTime: string
  }
}

const chartData = [
  { date: "Mon", conversations: 12, accuracy: 94 },
  { date: "Tue", conversations: 19, accuracy: 91 },
  { date: "Wed", conversations: 15, accuracy: 93 },
  { date: "Thu", conversations: 22, accuracy: 95 },
  { date: "Fri", conversations: 18, accuracy: 92 },
  { date: "Sat", conversations: 14, accuracy: 94 },
  { date: "Sun", conversations: 10, accuracy: 96 },
]

export function AnalyticsModal({ open, onOpenChange, chatbotName, stats }: AnalyticsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Analytics - {chatbotName}</DialogTitle>
          <DialogDescription>View detailed performance metrics and analytics for your chatbot</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Conversations</p>
                    <p className="text-2xl font-bold text-black dark:text-white">{stats.conversations}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                    <p className="text-2xl font-bold text-black dark:text-white">{stats.users}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Accuracy</p>
                    <p className="text-2xl font-bold text-black dark:text-white">{stats.accuracy}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response Time</p>
                    <p className="text-2xl font-bold text-black dark:text-white">{stats.responseTime}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Conversations Trend (Weekly)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="conversations" fill="#3b82f6" name="Conversations" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Accuracy Trend (Weekly)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="accuracy" stroke="#8b5cf6" name="Accuracy %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
