"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Eye, EyeOff, Loader2, Zap, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"

export default function Login() {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const { login, isLoggedIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/")
    }
  }, [isLoggedIn, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const success = await login(formData.email, formData.password)
      if (success) {
        router.push("/")
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  const isDark = resolvedTheme === "dark"

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Dynamic Dotted Background */}
      <div
        className={`dotted-background dotted-background-animated ${
          isDark ? "dotted-background-dark" : "dotted-background-light"
        }`}
      />

      {/* Gradient Overlay */}
      <div className="background-overlay" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center">
            <div className="relative">
              <Zap className="h-12 w-12 text-foreground" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mt-4 text-foreground">BotFoundry</h1>
          <p className="text-muted-foreground mt-2">Your personal AI chatbot builder</p>
        </div>

        <Card className="border-border bg-card/90 backdrop-blur-sm elegant-hover">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-background/80 border-border backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button type="button" variant="ghost" size="sm" className="h-auto p-0 text-sm text-primary">
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-background/80 border-border pr-10 backdrop-blur-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center mt-6">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Button variant="link" className="p-0 h-auto text-primary">
              Sign up
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}
