import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subvalue?: string
  description?: string
  icon?: React.ReactNode
  isLoading?: boolean
  valueClassName?: string
  trend?: 'up' | 'down'
  change?: string
  accent?: boolean
  /** 'card' = standalone bordered card (default). 'tile' = flush tile inside a parent grid card. */
  variant?: 'card' | 'tile'
}

export function StatCard({
  title,
  value,
  subvalue,
  description,
  isLoading,
  valueClassName,
  trend,
  change,
  accent,
  variant = 'card',
}: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown
  const trendCls = trend === 'up'
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-red-500 dark:text-red-400'

  if (isLoading) {
    return (
      <div className={cn(
        'flex flex-col gap-3 animate-pulse',
        variant === 'card'
          ? 'rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5 md:p-6'
          : 'p-4',
      )}>
        <div className="h-2.5 w-20 bg-gray-100 dark:bg-zinc-800 rounded-full" />
        <div className="h-8 w-24 bg-gray-100 dark:bg-zinc-800 rounded-lg" />
        <div className="h-2.5 w-16 bg-gray-100 dark:bg-zinc-800 rounded-full" />
      </div>
    )
  }

  const isCard = variant === 'card'

  return (
    <div className={cn(
      'flex flex-col transition-all duration-200 h-full',
      isCard && [
        'rounded-2xl border bg-white dark:bg-zinc-900 p-4 sm:p-5 md:p-6',
        'shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none',
        'hover:shadow-[0_4px_12px_rgba(0,0,0,0.07)] dark:hover:border-zinc-700',
        accent ? 'border-[#C8F400]/30 dark:border-[#C8F400]/20' : 'border-gray-100 dark:border-zinc-800',
      ],
      !isCard && [
        'p-4 rounded-xl',
        'hover:bg-gray-50 dark:hover:bg-zinc-800/50',
        accent && 'bg-[#C8F400]/5 dark:bg-[#C8F400]/5',
      ],
    )}>
      {/* Label */}
      <p className="text-sm font-bold text-gray-900 dark:text-zinc-50 tracking-tight leading-none">
        {title}
      </p>

      {/* Main value — grows to fill space so bottom row always aligns */}
      <motion.p
        className={cn(
          'font-bold tracking-tight tabular-nums leading-none mt-3 flex-1',
          isCard
            ? 'text-[clamp(1.5rem,3vw,2rem)]'
            : 'text-[clamp(1.25rem,2.5vw,1.6rem)]',
          accent
            ? 'text-[#2D6A4F] dark:text-[#C8F400]'
            : 'text-gray-900 dark:text-zinc-50',
          valueClassName,
        )}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {value}
      </motion.p>

      {/* Bottom row: subvalue + trend — always pinned to bottom */}
      <div className="flex items-center justify-between gap-2 mt-3">
        <p className="text-xs text-gray-400 dark:text-zinc-500 leading-snug min-w-0">
          {subvalue ?? description ?? ''}
        </p>
        {trend && change && (
          <span className={cn('inline-flex items-center gap-1 text-xs font-bold leading-none shrink-0', trendCls)}>
            <TrendIcon className="h-3 w-3" />
            {change}
          </span>
        )}
      </div>
    </div>
  )
}
