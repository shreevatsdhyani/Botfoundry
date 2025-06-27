"use client"

import { Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PricingPlan {
  name: string
  price: {
    monthly: number
    yearly: number
  }
  description: string
  features: string[]
  isPopular?: boolean
  buttonText: string
  buttonVariant?: "default" | "outline"
}

interface PricingCardProps {
  plan: PricingPlan
  isYearly: boolean
  onSelect: (plan: PricingPlan) => void
}

export function PricingCard({ plan, isYearly, onSelect }: PricingCardProps) {
  const price = isYearly ? plan.price.yearly : plan.price.monthly
  const yearlyDiscount = isYearly
    ? Math.round(((plan.price.monthly * 12 - plan.price.yearly) / (plan.price.monthly * 12)) * 100)
    : 0

  return (
    <Card
      className={`relative transition-all duration-200 hover:scale-105 hover:shadow-lg ${
        plan.isPopular ? "border-black dark:border-white shadow-lg scale-105" : "border-gray-200 dark:border-gray-700"
      }`}
    >
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-black dark:bg-white text-white dark:text-black px-3 py-1">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold text-black dark:text-white">{plan.name}</CardTitle>
        <div className="mt-4">
          <span className="text-4xl font-bold text-black dark:text-white">${price}</span>
          <span className="text-gray-600 dark:text-gray-400">/{isYearly ? "year" : "month"}</span>
          {isYearly && yearlyDiscount > 0 && (
            <div className="text-sm text-green-600 dark:text-green-400 mt-1">Save {yearlyDiscount}% annually</div>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{plan.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={() => onSelect(plan)}
          className={`w-full mt-6 ${
            plan.isPopular
              ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              : "bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          {plan.buttonText}
        </Button>
      </CardContent>
    </Card>
  )
}
