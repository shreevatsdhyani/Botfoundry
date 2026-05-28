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
  const { login, register, isLoggedIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState("")
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    full_name: "",
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
      if (isRegisterMode) {
        // Register mode
        const success = await register({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          full_name: formData.full_name || undefined,
        })
        if (success) {
          router.push("/")
        } else {
          setError("Registration failed. Email or username may already exist.")
        }
      } else {
        // Login mode
        const success = await login(formData.email, formData.password)
        if (success) {
          router.push("/")
        } else {
          setError("Invalid email or password. Please try again.")
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.")
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
            <CardTitle className="text-2xl text-center">
              {isRegisterMode ? "Create Account" : "Sign In"}
            </CardTitle>
            <CardDescription className="text-center">
              {isRegisterMode
                ? "Create a new account to get started"
                : "Enter your credentials to access your account"}
            </CardDescription>
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
              {isRegisterMode && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="bg-background/80 border-border backdrop-blur-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name (Optional)</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="bg-background/80 border-border backdrop-blur-sm"
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {!isRegisterMode && (
                    <Button type="button" variant="ghost" size="sm" className="h-auto p-0 text-sm text-primary">
                      Forgot password?
                    </Button>
                  )}
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
                    minLength={8}
                    maxLength={128}
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
                {isRegisterMode && (
                  <p className="text-xs text-muted-foreground">Password must be 8-128 characters</p>
                )}
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
                    {isRegisterMode ? "Creating account..." : "Signing in..."}
                  </>
                ) : isRegisterMode ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center mt-6">
          <p className="text-muted-foreground">
            {isRegisterMode ? "Already have an account?" : "Don't have an account?"}{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-primary"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode)
                setError("")
                setFormData({ email: "", username: "", password: "", full_name: "" })
              }}
            >
              {isRegisterMode ? "Sign in" : "Sign up"}
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}
