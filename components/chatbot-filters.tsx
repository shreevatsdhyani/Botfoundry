"use client"

import { Search, Filter, SortAsc, SortDesc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface FilterState {
  search: string
  status: string
  sortBy: string
  sortOrder: "asc" | "desc"
}

interface ChatbotFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  totalCount: number
  filteredCount: number
}

export function ChatbotFilters({ filters, onFiltersChange, totalCount, filteredCount }: ChatbotFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleSortOrder = () => {
    onFiltersChange({
      ...filters,
      sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: "all",
      sortBy: "name",
      sortOrder: "asc",
    })
  }

  const hasActiveFilters = filters.search || filters.status !== "all"

  return (
    <div className="space-y-4">
      {/* Search and Primary Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search chatbots..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-black dark:focus:border-white"
          />
        </div>

        <div className="flex gap-2">
          <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
            <SelectTrigger className="w-32 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="training">Training</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
            <SelectTrigger className="w-40 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="lastActive">Last Active</SelectItem>
              <SelectItem value="conversations">Conversations</SelectItem>
              <SelectItem value="users">Users</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortOrder}
            className="border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white"
          >
            {filters.sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Filter Summary and Clear */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredCount} of {totalCount} chatbots
          </span>
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Filters:</span>
              {filters.search && (
                <Badge variant="secondary" className="text-xs">
                  Search: "{filters.search}"
                </Badge>
              )}
              {filters.status !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Status: {filters.status}
                </Badge>
              )}
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
          >
            <Filter className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
