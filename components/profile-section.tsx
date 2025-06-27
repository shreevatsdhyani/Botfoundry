"use client"

import { useState } from "react"
import { Camera, User, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"

interface ProfileData {
  name: string
  email: string
  avatar: string
}

export function ProfileSection() {
  const [profile, setProfile] = useState<ProfileData>({
    name: "John Doe",
    email: "john@example.com",
    avatar: "",
  })
  const [isEditing, setIsEditing] = useState({ name: false, email: false })
  const [tempValues, setTempValues] = useState({ name: "", email: "" })

  const startEdit = (field: "name" | "email") => {
    setTempValues({ ...tempValues, [field]: profile[field] })
    setIsEditing({ ...isEditing, [field]: true })
  }

  const cancelEdit = (field: "name" | "email") => {
    setIsEditing({ ...isEditing, [field]: false })
    setTempValues({ ...tempValues, [field]: "" })
  }

  const saveEdit = (field: "name" | "email") => {
    setProfile({ ...profile, [field]: tempValues[field] })
    setIsEditing({ ...isEditing, [field]: false })
    toast({
      title: "Profile Updated",
      description: `Your ${field} has been updated successfully.`,
    })
  }

  const handleAvatarUpload = () => {
    toast({
      title: "Avatar Upload",
      description: "Avatar upload functionality would be implemented here.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Profile Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-2 border-white dark:border-gray-800"
              onClick={handleAvatarUpload}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <h3 className="font-medium text-black dark:text-white">{profile.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{profile.email}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAvatarUpload}
              className="mt-1 h-auto p-0 text-blue-600 dark:text-blue-400"
            >
              Upload new photo
            </Button>
          </div>
        </div>

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          {isEditing.name ? (
            <div className="flex space-x-2">
              <Input
                id="name"
                value={tempValues.name}
                onChange={(e) => setTempValues({ ...tempValues, name: e.target.value })}
                className="flex-1"
              />
              <Button size="icon" onClick={() => saveEdit("name")} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={() => cancelEdit("name")}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => startEdit("name")}
            >
              <span className="text-black dark:text-white">{profile.name}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Click to edit</span>
            </div>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          {isEditing.email ? (
            <div className="flex space-x-2">
              <Input
                id="email"
                type="email"
                value={tempValues.email}
                onChange={(e) => setTempValues({ ...tempValues, email: e.target.value })}
                className="flex-1"
              />
              <Button size="icon" onClick={() => saveEdit("email")} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={() => cancelEdit("email")}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => startEdit("email")}
            >
              <span className="text-black dark:text-white">{profile.email}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Click to edit</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
