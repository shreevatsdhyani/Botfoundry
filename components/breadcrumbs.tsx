import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
      <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link href={item.href} className="hover:text-black dark:hover:text-white transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-black dark:text-white font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
