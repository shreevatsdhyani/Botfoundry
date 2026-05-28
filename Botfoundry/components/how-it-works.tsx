import { Bot, Settings, Zap, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Bot,
    title: "Choose Your Plan",
    description: "Select the premium plan that fits your needs and upgrade your account.",
  },
  {
    icon: Settings,
    title: "Configure Actions",
    description: "Set up custom actions and automation rules for your chatbot.",
  },
  {
    icon: Zap,
    title: "Deploy & Activate",
    description: "Deploy your premium agent and start automating user interactions.",
  },
  {
    icon: CheckCircle,
    title: "Monitor & Optimize",
    description: "Track performance and optimize your automation workflows.",
  },
]

export function HowItWorks() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">How It Works</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Get started with Premium AI Agent in just a few simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="text-center group">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <step.icon className="h-8 w-8 text-white" />
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-x-8"></div>
              )}
            </div>
            <h3 className="font-semibold text-black dark:text-white mb-2">{step.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
