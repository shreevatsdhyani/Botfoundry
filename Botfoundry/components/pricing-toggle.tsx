"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"

interface PricingToggleProps {
  onToggle: (isYearly: boolean) => void
}

export function PricingToggle({ onToggle }: PricingToggleProps) {
  const [isYearly, setIsYearly] = useState(false)

  const handleToggle = (checked: boolean) => {
    setIsYearly(checked)
    onToggle(checked)
  }

  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <span
        className={`text-sm font-medium ${!isYearly ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
      >
        Monthly
      </span>
      <Switch
        checked={isYearly}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-black dark:data-[state=checked]:bg-white"
      />
      <span
        className={`text-sm font-medium ${isYearly ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
      >
        Yearly
      </span>
      {isYearly && (
        <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-2 py-1 rounded-full">
          Save 20%
        </span>
      )}
    </div>
  )
}
