"use client"

import { useState } from "react"
import { CreditCard, Download, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

interface BillingHistory {
  id: string
  date: string
  amount: number
  status: "paid" | "pending" | "failed"
  description: string
  invoice: string
}

export function BillingSection() {
  const [billingHistory] = useState<BillingHistory[]>([
    {
      id: "1",
      date: "2024-01-01",
      amount: 79,
      status: "paid",
      description: "Professional Plan - Monthly",
      invoice: "INV-2024-001",
    },
    {
      id: "2",
      date: "2023-12-01",
      amount: 79,
      status: "paid",
      description: "Professional Plan - Monthly",
      invoice: "INV-2023-012",
    },
    {
      id: "3",
      date: "2023-11-01",
      amount: 79,
      status: "paid",
      description: "Professional Plan - Monthly",
      invoice: "INV-2023-011",
    },
  ])

  const currentPlan = {
    name: "Professional",
    price: 79,
    status: "active",
    nextBilling: "2024-02-01",
    paymentMethod: "**** **** **** 4242",
  }

  const handleUpdateBilling = () => {
    toast({
      title: "Billing Update",
      description: "Redirecting to billing portal...",
    })
  }

  const handleDownloadInvoice = (invoice: string) => {
    toast({
      title: "Download Started",
      description: `Downloading invoice ${invoice}...`,
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Subscription & Billing</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Subscription */}
        <div className="space-y-4">
          <h3 className="font-medium text-black dark:text-white">Current Subscription</h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-black dark:text-white">{currentPlan.name} Plan</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">${currentPlan.price}/month</p>
              </div>
              <Badge className={getStatusColor(currentPlan.status)}>{currentPlan.status}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Next billing:</span>
                <span className="font-medium text-black dark:text-white">{formatDate(currentPlan.nextBilling)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Payment method:</span>
                <span className="font-medium text-black dark:text-white">{currentPlan.paymentMethod}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleUpdateBilling}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              Update Billing Info
            </Button>
            <Button
              variant="outline"
              className="border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white"
            >
              Change Plan
            </Button>
          </div>
        </div>

        {/* Billing History */}
        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-black dark:text-white">Billing History</h3>
            <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
              View All
            </Button>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{formatDate(item.date)}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {item.amount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadInvoice(item.invoice)}
                        className="h-auto p-0 text-blue-600 dark:text-blue-400"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        {item.invoice}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
