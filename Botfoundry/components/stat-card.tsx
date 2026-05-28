"use client"

import type React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  gradient?: boolean
}

export function StatCard({ title, value, icon, trend, gradient }: StatCardProps) {
  return (
    <div
      className={`
      relative overflow-hidden rounded-lg border border-border p-6 shadow-sm 
      hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group elegant-hover
      ${gradient ? "bg-gradient-to-br from-card to-muted/30" : "bg-card"}
    `}
    >
      {gradient && <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>}

      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground group-hover:scale-110 transition-transform duration-200">
            {value}
          </p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
              {trend.isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              <span>{Math.abs(trend.value)}% from last month</span>
            </div>
          )}
        </div>
        <div className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">{icon}</div>
      </div>
    </div>
  )
}
