import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subvalue?: string
  description?: string
  icon?: React.ReactNode
  isLoading?: boolean
  valueClassName?: string
}

export function StatCard({ title, value, subvalue, description, icon, isLoading, valueClassName }: StatCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3 animate-pulse">
        <div className="h-3.5 w-24 bg-gray-100 dark:bg-zinc-800 rounded" />
        <div className="h-8 w-28 bg-gray-100 dark:bg-zinc-800 rounded" />
        <div className="h-3 w-20 bg-gray-100 dark:bg-zinc-800 rounded" />
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      {/* Title + icon */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">{title}</p>
        {icon && (
          <div className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center text-gray-400 dark:text-zinc-500">
            {icon}
          </div>
        )}
      </div>

      {/* Main value */}
      <motion.p
        className={cn('text-2xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight', valueClassName)}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {value}
      </motion.p>

      {/* Subvalue or description */}
      {subvalue && (
        <p className="mt-1 text-xs text-gray-400 dark:text-zinc-500">{subvalue}</p>
      )}
      {description && (
        <p className="mt-1 text-xs text-gray-400 dark:text-zinc-500">{description}</p>
      )}
    </div>
  )
}
