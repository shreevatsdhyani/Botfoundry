"use client"
import { SharedLayout } from "@/components/shared-layout"
import { ProfileSection } from "@/components/profile-section"
import { SecuritySection } from "@/components/security-section"
import { ApiKeysSection } from "@/components/api-keys-section"
import { BillingSection } from "@/components/billing-section"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, User, Shield, Key, CreditCard } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function Account() {
  const breadcrumbs = [{ label: "Dashboard", href: "/" }, { label: "Account" }]

  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "You have been successfully logged out.",
    })
    // Handle logout logic here
  }

  return (
    <SharedLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Account Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and security settings</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="mt-4 sm:mt-0 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Tabs for Desktop, Stacked for Mobile */}
        <div className="block lg:hidden space-y-6">
          {/* Mobile Layout - Stacked */}
          <ProfileSection />
          <SecuritySection />
          <ApiKeysSection />
          <BillingSection />
        </div>

        <div className="hidden lg:block">
          {/* Desktop Layout - Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="api-keys" className="flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>API Keys</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Billing</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileSection />
            </TabsContent>

            <TabsContent value="security">
              <SecuritySection />
            </TabsContent>

            <TabsContent value="api-keys">
              <ApiKeysSection />
            </TabsContent>

            <TabsContent value="billing">
              <BillingSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SharedLayout>
  )
}
