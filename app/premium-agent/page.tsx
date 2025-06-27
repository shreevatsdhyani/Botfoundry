"use client"

import { useState } from "react"
import { SharedLayout } from "@/components/shared-layout"
import { PricingToggle } from "@/components/pricing-toggle"
import { PricingCard } from "@/components/pricing-card"
import { HowItWorks } from "@/components/how-it-works"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, Shield, Code, Headphones, ShoppingCart, MousePointer, Workflow, ArrowRight } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

const features = [
  {
    icon: ShoppingCart,
    title: "Automate User Interactions",
    description:
      "Enable your chatbot to perform actions like adding items to cart, completing purchases, and form submissions.",
  },
  {
    icon: MousePointer,
    title: "Real-time Website Control",
    description:
      "Allow your chatbot to interact with your website elements in real-time, providing seamless user experiences.",
  },
  {
    icon: Code,
    title: "Custom Action Scripting",
    description: "Create custom automation scripts and workflows tailored to your specific business needs.",
  },
  {
    icon: Headphones,
    title: "Priority Support",
    description: "Get dedicated support with faster response times and direct access to our premium support team.",
  },
  {
    icon: Workflow,
    title: "Advanced Workflows",
    description: "Build complex automation workflows with conditional logic and multi-step processes.",
  },
  {
    icon: Shield,
    title: "Enhanced Security",
    description: "Advanced security features including encrypted communications and secure action execution.",
  },
]

const pricingPlans = [
  {
    name: "Starter",
    price: { monthly: 29, yearly: 290 },
    description: "Perfect for small businesses getting started with automation",
    features: [
      "Up to 5 automated actions",
      "Basic website control",
      "Email support",
      "Standard response times",
      "Basic analytics",
    ],
    buttonText: "Get Started",
  },
  {
    name: "Professional",
    price: { monthly: 79, yearly: 790 },
    description: "Advanced automation for growing businesses",
    features: [
      "Up to 25 automated actions",
      "Full website control",
      "Custom action scripting",
      "Priority support",
      "Advanced analytics",
      "Workflow automation",
      "API access",
    ],
    isPopular: true,
    buttonText: "Upgrade Now",
  },
  {
    name: "Enterprise",
    price: { monthly: 199, yearly: 1990 },
    description: "Complete automation solution for large organizations",
    features: [
      "Unlimited automated actions",
      "Full website control",
      "Custom action scripting",
      "Dedicated support",
      "Advanced analytics",
      "Workflow automation",
      "Full API access",
      "Custom integrations",
      "SLA guarantee",
    ],
    buttonText: "Contact Sales",
  },
]

export default function PremiumAgent() {
  const [isYearly, setIsYearly] = useState(false)
  const breadcrumbs = [{ label: "Dashboard", href: "/" }, { label: "Premium Agent" }]

  const handlePlanSelect = (plan: any) => {
    toast({
      title: "Plan Selected",
      description: `You selected the ${plan.name} plan. Redirecting to checkout...`,
    })
  }

  return (
    <SharedLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-black dark:text-white mb-4">Premium AI Agent</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Unlock advanced automation capabilities for your chatbot users. Transform conversations into actions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-black dark:text-white text-center mb-8">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-200 hover:scale-105 border-gray-200 dark:border-gray-700"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-200">
                      <feature.icon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-black dark:text-white">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Choose Your Plan</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Select the perfect plan for your automation needs</p>
          </div>

          <PricingToggle onToggle={setIsYearly} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} plan={plan} isYearly={isYearly} onSelect={handlePlanSelect} />
            ))}
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              className="border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white"
            >
              Compare All Features
            </Button>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <HowItWorks />
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Ready to Supercharge Your Chatbots?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Join thousands of businesses already using Premium AI Agent to automate their customer interactions and
            boost conversions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-8"
              onClick={() => handlePlanSelect(pricingPlans[1])}
            >
              <Crown className="mr-2 h-5 w-5" />
              Activate Premium Agent
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white"
            >
              Schedule Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </SharedLayout>
  )
}
