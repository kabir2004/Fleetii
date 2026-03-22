import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  DollarSign, Package, TrendingUp, PiggyBank,
  ArrowRight, AlertCircle, Clock, FileText, CheckCircle2, Search,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatCard } from '@/components/shared/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency } from '@/lib/formatters'
import { MOCK_LOADS, MOCK_SPEND_BY_MONTH } from '@/lib/mockData'
import { useUIStore } from '@/stores/uiStore'

// Brand greens: neon in dark mode, old growth in light
const GREEN_DARK  = '#C8F400'
const GREEN_LIGHT = '#2D6A4F'
const SPEND_COLOR = '#818cf8' // indigo-400, same both modes

const STAGGER = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  },
}

const AUDIT_STATS = [
  { label: 'Invoices Audited',   value: '94',     sub: 'this month' },
  { label: 'Discrepancies Found',value: '23',     sub: '24.5% hit rate' },
  { label: 'Amount Recovered',   value: '$22,100',sub: 'avg $961 each', highlight: true },
  { label: 'Pending Review',     value: '7',      sub: 'awaiting approval' },
]

const ALERTS = [
  { id: 1, priority: 'high',   icon: FileText,   title: 'Invoice overdue · INV-2024-0392',  detail: '$4,292 · 3 days past due from Southeast Auto Dealers' },
  { id: 2, priority: 'high',   icon: Search,     title: 'Overcharge found · INV-2024-0391', detail: '$460 in overcharges from FastRoute Carrier Services' },
  { id: 3, priority: 'medium', icon: Clock,      title: 'CDL expiring · Sandra Chen',       detail: 'Expires Dec 1, 2025 · Schedule renewal' },
  { id: 4, priority: 'low',    icon: AlertCircle,title: 'Fuel flagged · Derek Johnson',      detail: 'Springfield, MO purchase 12% above market rate' },
]

const priorityDot: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-400',
  low: 'bg-blue-400',
}

const chartData = MOCK_SPEND_BY_MONTH.map((d: any) => ({ ...d }))

function CustomTooltip({ active, payload, label, green }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 shadow-xl text-xs space-y-2">
      <p className="text-gray-400 dark:text-zinc-500 font-medium">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-500 dark:text-zinc-400">{p.name}</span>
          </div>
          <span className="font-semibold tabular-nums text-gray-900 dark:text-zinc-50">
            {formatCurrency(p.value, true)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function OverviewPage() {
  const { darkMode } = useUIStore()
  const green     = darkMode ? GREEN_DARK  : GREEN_LIGHT
  const gridColor = darkMode ? '#27272a'   : '#f3f4f6'
  const tickColor = darkMode ? '#71717a'   : '#9ca3af'

  const recentLoads = MOCK_LOADS.slice(0, 5)

  return (
    <div className="p-4 md:p-6 w-full">
      <motion.div variants={STAGGER.container} initial="initial" animate="animate" className="space-y-5">

        {/* KPI Row */}
        <motion.div variants={STAGGER.item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Revenue This Month"
            value={formatCurrency(1247800, true)}
            subvalue="$1,247,800"
            icon={<DollarSign className="h-4 w-4" />}
          />
          <StatCard
            title="Total Spend"
            value={formatCurrency(934000, true)}
            subvalue="$934,000"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <StatCard
            title="Active Loads"
            value="53"
            description="3 in transit · 2 dispatched · 1 at delivery"
            icon={<Package className="h-4 w-4" />}
          />
          <StatCard
            title="Savings Found"
            value={formatCurrency(22100, true)}
            subvalue="$22,100"
            icon={<PiggyBank className="h-4 w-4" />}
            valueClassName="text-[#2D6A4F] dark:text-[#C8F400]"
          />
        </motion.div>

        {/* Charts Row */}
        <motion.div variants={STAGGER.item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Revenue vs Spend — fluid area chart */}
          <div className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Revenue vs Spend</p>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Last 6 months</p>
              </div>
              <div className="flex items-center gap-5 text-xs text-gray-400 dark:text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full inline-block" style={{ background: green }} />
                  Revenue
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full inline-block" style={{ background: SPEND_COLOR }} />
                  Spend
                </span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={green}       stopOpacity={darkMode ? 0.28 : 0.2} />
                    <stop offset="100%" stopColor={green}       stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor={SPEND_COLOR} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={SPEND_COLOR} stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="0"
                  stroke={gridColor}
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: tickColor }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: tickColor }}
                  tickFormatter={v => v >= 1_000_000
                    ? `$${(v / 1_000_000).toFixed(1)}M`
                    : `$${(v / 1_000).toFixed(0)}K`
                  }
                  axisLine={false}
                  tickLine={false}
                  width={52}
                />
                <Tooltip content={<CustomTooltip green={green} />} cursor={{ stroke: gridColor, strokeWidth: 1 }} />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke={green}
                  strokeWidth={2.5}
                  fill="url(#revGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: green, strokeWidth: 0 }}
                />
                <Area
                  type="monotone"
                  dataKey="cost"
                  name="Spend"
                  stroke={SPEND_COLOR}
                  strokeWidth={2}
                  fill="url(#spendGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: SPEND_COLOR, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Audit Performance */}
          <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Audit Performance</p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">March 2024</p>
            </div>
            <div className="space-y-4">
              {AUDIT_STATS.map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 dark:text-zinc-500">{s.label}</p>
                    <p className="text-xs text-gray-300 dark:text-zinc-600 mt-0.5">{s.sub}</p>
                  </div>
                  <p className={`text-lg font-bold tabular-nums ${
                    s.highlight
                      ? 'text-[#2D6A4F] dark:text-[#C8F400]'
                      : 'text-gray-900 dark:text-zinc-50'
                  }`}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-zinc-800/50">
              <div className="flex items-center gap-2 text-xs text-[#2D6A4F] dark:text-[#C8F400]">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>All invoices audited within 24 hours</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Row */}
        <motion.div variants={STAGGER.item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Recent Loads */}
          <div className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800/50">
              <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Recent Loads</p>
              <Link to="/dashboard/loads" className="flex items-center gap-1 text-xs text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-800/50">
                  {['Load', 'Route', 'Status', 'Driver', 'Revenue'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-400 dark:text-zinc-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentLoads.map((load, i) => (
                  <motion.tr
                    key={load.id}
                    className="border-b border-gray-50 dark:border-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <td className="px-4 py-3 text-xs font-medium text-gray-700 dark:text-zinc-300">{load.load_number}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-zinc-400">
                      {load.shipper_address?.city} → {load.consignee_address?.city}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={load.status} type="load" />
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-zinc-400">
                      {load.driver ? `${load.driver.first_name} ${load.driver.last_name}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold tabular-nums text-gray-900 dark:text-zinc-50">
                      {formatCurrency(load.customer_rate)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {/* Alerts */}
          <div className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800/50">
              <p className="text-sm font-semibold text-gray-900 dark:text-zinc-50">Action Required</p>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-zinc-800">
              {ALERTS.map((alert, i) => {
                const Icon = alert.icon
                return (
                  <motion.div
                    key={alert.id}
                    className="flex gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <div className="mt-0.5 shrink-0 relative">
                      <Icon className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                      <span className={`absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full ${priorityDot[alert.priority]}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-800 dark:text-zinc-300 leading-snug">{alert.title}</p>
                      <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5 leading-snug">{alert.detail}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

        </motion.div>
      </motion.div>
    </div>
  )
}
