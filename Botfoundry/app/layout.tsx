import { AuthProvider } from "@/components/auth-provider"
import { ChatbotsProvider } from "@/components/chatbots-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BotFoundry - AI Chatbot Builder",
  description: "Your personal AI chatbot builder",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ChatbotsProvider>
              {children}
              <Toaster />
            </ChatbotsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
