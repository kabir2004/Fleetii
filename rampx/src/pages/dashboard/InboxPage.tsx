import { motion } from 'framer-motion'
import {
  Bell, FileText, AlertCircle, Clock, Search,
  CheckCircle2, ArrowRight, Package,
} from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import { CURRENT_MONTH_LABEL } from '@/lib/formatters'

const STAGGER = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  },
}

const priorityDot: Record<string, string> = {
  high:   'bg-red-500',
  medium: 'bg-amber-400',
  low:    'bg-blue-400',
}

const MESSAGES = [
  {
    id: 1,
    priority: 'high',
    icon: FileText,
    title: 'Invoice overdue · INV-2024-0392',
    detail: '$4,292 · 3 days past due from Southeast Auto Dealers',
    time: '2h ago',
    unread: true,
  },
  {
    id: 2,
    priority: 'high',
    icon: Search,
    title: 'Overcharge detected · INV-2024-0391',
    detail: '$460 in overcharges from FastRoute Carrier Services — pending approval',
    time: '4h ago',
    unread: true,
  },
  {
    id: 3,
    priority: 'medium',
    icon: Clock,
    title: 'CDL renewal reminder · Sandra Chen',
    detail: 'Commercial license expires Dec 1, 2025 — schedule renewal to stay compliant',
    time: '1d ago',
    unread: true,
  },
  {
    id: 4,
    priority: 'low',
    icon: Package,
    title: 'Load delivered · LD-2024-0814',
    detail: 'Chicago, IL → Detroit, MI delivered on schedule. Invoice now ready to send.',
    time: '1d ago',
    unread: false,
  },
  {
    id: 5,
    priority: 'low',
    icon: CheckCircle2,
    title: 'Payment received · INV-2024-0383',
    detail: '$12,450 ACH payment confirmed from Midwest Distribution Co.',
    time: '2d ago',
    unread: false,
  },
  {
    id: 6,
    priority: 'low',
    icon: Bell,
    title: `Payroll run complete · ${CURRENT_MONTH_LABEL}`,
    detail: '24 drivers paid — total disbursement $148,200. View breakdown in Payroll.',
    time: '3d ago',
    unread: false,
  },
]

const QUICK_ACTIONS = [
  { label: 'Review overcharge',    detail: 'INV-2024-0391 · $460',         cta: 'Review',  priority: 'high'   },
  { label: 'Approve invoice',      detail: 'INV-2024-0394 · $8,100',       cta: 'Approve', priority: 'medium' },
  { label: 'Schedule CDL renewal', detail: 'Sandra Chen · expires Dec 1',  cta: 'Schedule',priority: 'medium' },
  { label: 'Send overdue notice',  detail: 'INV-2024-0392 · 3 days late',  cta: 'Send',    priority: 'high'   },
]

const ctaColor: Record<string, string> = {
  high:   'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40',
  medium: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100',
}

export default function InboxPage() {
  const unread = MESSAGES.filter(m => m.unread).length

  return (
    <div className="p-4 md:p-6 w-full">
      <motion.div variants={STAGGER.container} initial="initial" animate="animate" className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-zinc-50 tracking-tight">Inbox</h1>
            <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">Northbound Freight LLC · {CURRENT_MONTH_LABEL}</p>
          </div>
          {unread > 0 && (
            <span className="flex h-7 min-w-[28px] items-center justify-center rounded-full bg-[#C8F400] px-2 text-sm font-bold text-zinc-900">
              {unread}
            </span>
          )}
        </div>

        {/* KPI Row */}
        <motion.div variants={STAGGER.item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Unread"
            value={String(unread)}
            description="require your attention"
            icon={<Bell className="h-4 w-4" />}
          />
          <StatCard
            title="Urgent"
            value="2"
            description="high priority alerts"
            icon={<AlertCircle className="h-4 w-4" />}
          />
          <StatCard
            title="Resolved Today"
            value="7"
            description="actions completed"
            icon={<CheckCircle2 className="h-4 w-4" />}
          />
          <StatCard
            title="Avg Response"
            value="1.4h"
            description="this week"
            icon={<Clock className="h-4 w-4" />}
          />
        </motion.div>

        {/* Main Row */}
        <motion.div variants={STAGGER.item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Message Feed */}
          <div className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800/50">
              <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">All Notifications</p>
              <button className="flex items-center gap-1 text-xs text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors">
                Mark all read <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-zinc-800">
              {MESSAGES.map((msg, i) => {
                const Icon = msg.icon
                return (
                  <motion.div
                    key={msg.id}
                    className={`flex gap-3 px-5 py-3.5 cursor-pointer transition-colors ${
                      msg.unread
                        ? 'hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                        : 'hover:bg-gray-50 dark:hover:bg-zinc-800/40 opacity-70'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: msg.unread ? 1 : 0.7 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="mt-0.5 shrink-0 relative">
                      <Icon className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                      <span className={`absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full ${priorityDot[msg.priority]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs leading-snug ${
                          msg.unread
                            ? 'font-semibold text-gray-800 dark:text-zinc-300'
                            : 'font-medium text-gray-600 dark:text-zinc-400'
                        }`}>
                          {msg.title}
                        </p>
                        <span className="text-xs text-gray-400 dark:text-zinc-500 shrink-0">{msg.time}</span>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5 leading-snug">{msg.detail}</p>
                    </div>
                    {msg.unread && (
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#C8F400] shrink-0" />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Action Required */}
          <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800/50">
              <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Action Required</p>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-zinc-800">
              {QUICK_ACTIONS.map((action, i) => (
                <motion.div
                  key={action.label}
                  className="flex items-start justify-between gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-800 dark:text-zinc-300 leading-snug">{action.label}</p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5 leading-snug">{action.detail}</p>
                  </div>
                  <button className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${ctaColor[action.priority]}`}>
                    {action.cta}
                  </button>
                </motion.div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-gray-100 dark:border-zinc-800/50">
              <div className="flex items-center gap-2 text-xs text-[#2D6A4F] dark:text-[#C8F400]">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>4 items need your sign-off today</span>
              </div>
            </div>
          </div>

        </motion.div>
      </motion.div>
    </div>
  )
}
