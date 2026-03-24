import { useLocation, useNavigate } from 'react-router-dom'
import { Users2, DollarSign, Fuel, TrendingUp, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Driver Performance', href: '/dashboard/insights/drivers',      icon: Users2     },
  { label: 'Profitability',       href: '/dashboard/insights/profitability', icon: DollarSign },
  { label: 'Fuel Intelligence',  href: '/dashboard/insights/fuel',          icon: Fuel       },
  { label: 'Revenue Forecast',   href: '/dashboard/insights/forecast',      icon: TrendingUp },
  { label: 'Health Score',       href: '/dashboard/insights/health',        icon: Activity   },
]

export function InsightsNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {TABS.map(({ label, href, icon: Icon }) => {
        const active = location.pathname === href
        return (
          <button
            key={href}
            onClick={() => navigate(href)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap',
              active
                ? 'bg-gray-900 dark:bg-zinc-50 text-white dark:text-zinc-900'
                : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-800 dark:hover:text-zinc-200'
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            {label}
          </button>
        )
      })}
    </div>
  )
}
