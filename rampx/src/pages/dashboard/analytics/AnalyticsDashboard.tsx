import { motion } from 'framer-motion'
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { TrendingUp, Route, Award, Truck } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { MOCK_SPEND_BY_MONTH, MOCK_TOP_LANES } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'

const CARRIER_PERFORMANCE = [
  { name: 'Midwest Freight Express', on_time: 96, claims: 1, avg_rate: 5.45 },
  { name: 'Coastal Transport LLC',   on_time: 94, claims: 0, avg_rate: 5.91 },
  { name: 'FastRoute Carrier Svcs',  on_time: 87, claims: 2, avg_rate: 5.90 },
  { name: 'Apex Logistics Partners', on_time: 82, claims: 4, avg_rate: 6.10 },
  { name: 'Southern Star Trucking',  on_time: 78, claims: 3, avg_rate: 5.80 },
]

const MARGIN_TREND = MOCK_SPEND_BY_MONTH.map(m => ({
  month:  m.month,
  Margin: parseFloat(((m.revenue - m.cost) / m.revenue * 100).toFixed(1)),
  RPM:    parseFloat((m.revenue / (m.loads * 850)).toFixed(2)),
}))

const REV_COST = MOCK_SPEND_BY_MONTH.map(m => ({
  month:   m.month,
  Revenue: m.revenue,
  Cost:    m.cost,
}))

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2.5 shadow-md text-xs">
      <p className="text-gray-500 dark:text-zinc-400 font-medium mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="text-gray-400 dark:text-zinc-500">{p.name}</span>
          <span className="font-semibold text-gray-900 dark:text-zinc-50 tabular-nums">
            {typeof p.value === 'number' && p.name !== 'Margin' && p.name !== 'RPM'
              ? formatCurrency(p.value)
              : `${p.value}${p.name === 'Margin' ? '%' : ''}`}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsDashboard() {
  const { darkMode } = useUIStore()
  const green      = darkMode ? '#C8F400' : '#2D6A4F'
  const gridColor  = darkMode ? '#27272a' : '#f3f4f6'
  const tickColor  = darkMode ? '#71717a' : '#9ca3af'
  const spendColor = '#818cf8'

  const current  = MOCK_SPEND_BY_MONTH[5]
  const previous = MOCK_SPEND_BY_MONTH[4]
  const margin   = ((current.revenue - current.cost) / current.revenue * 100).toFixed(1)
  const prevMargin = ((previous.revenue - previous.cost) / previous.revenue * 100)
  const marginDelta = (parseFloat(margin) - prevMargin).toFixed(1)

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* KPI strip */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          { label: 'Gross Margin (MTD)',    value: `${margin}%`,   sub: `${parseFloat(marginDelta) >= 0 ? '+' : ''}${marginDelta}pp vs February`, icon: TrendingUp },
          { label: 'Avg Revenue / Mile',    value: '$1.74/mi',     sub: '+$0.18 vs last month',                                                   icon: Route      },
          { label: 'On-Time Delivery',      value: '91.2%',        sub: 'March 2024 average',                                                     icon: Truck      },
          { label: 'Active Loads (MTD)',     value: String(current.loads), sub: `vs ${previous.loads} last month`,                                 icon: Award      },
        ].map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">{label}</p>
              <div className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center text-gray-400 dark:text-zinc-500"><Icon className="h-4 w-4" /></div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-50 tabular-nums tracking-tight">{value}</p>
            <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-1">{sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <motion.div
          className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100 mb-0.5">Gross Margin Trend</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-5">Oct 2023 – Mar 2024 · % of revenue</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MARGIN_TREND} margin={{ top: 4, right: 8, left: 0, bottom: -10 }}>
              <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[20, 30]} width={36} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: gridColor, strokeWidth: 1 }} />
              <Line type="monotone" dataKey="Margin" stroke={green} strokeWidth={2} dot={{ fill: green, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100 mb-0.5">Revenue vs Cost</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-5">Oct 2023 – Mar 2024</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={REV_COST} margin={{ top: 4, right: 8, left: 0, bottom: -10 }}>
              <defs>
                <linearGradient id="revGradAD" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={green} stopOpacity={darkMode ? 0.25 : 0.18} />
                  <stop offset="100%" stopColor={green} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="costGradAD" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={spendColor} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={spendColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} width={44} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: gridColor, strokeWidth: 1 }} />
              <Area type="monotone" dataKey="Revenue" stroke={green} strokeWidth={2.5} fill="url(#revGradAD)" dot={false} activeDot={{ r: 4, fill: green, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="Cost"    stroke={spendColor} strokeWidth={2.5} fill="url(#costGradAD)" dot={false} activeDot={{ r: 4, fill: spendColor, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Carrier performance */}
        <motion.div
          className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Carrier Performance</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Ranked by on-time delivery · March 2024</p>
          </div>
          <div className="overflow-x-auto"><table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                {['#', 'Carrier', 'On-Time', 'Claims', 'Avg Rate/Mi'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
              {CARRIER_PERFORMANCE.map((c, i) => (
                <tr key={c.name} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <td className="px-6 py-3.5 text-xs text-gray-300 dark:text-zinc-600 tabular-nums">{i + 1}</td>
                  <td className="px-6 py-3.5 text-sm font-medium text-gray-800 dark:text-zinc-100">{c.name}</td>
                  <td className="px-6 py-3.5">
                    <span className={cn('text-sm font-semibold tabular-nums',
                      c.on_time >= 90 ? 'text-green-600' : c.on_time >= 80 ? 'text-amber-600' : 'text-red-500'
                    )}>{c.on_time}%</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={cn('text-sm tabular-nums',
                      c.claims === 0 ? 'text-green-600' : c.claims <= 2 ? 'text-amber-600' : 'text-red-500'
                    )}>{c.claims}</span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-600 dark:text-zinc-400 tabular-nums">${c.avg_rate.toFixed(2)}/mi</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </motion.div>

        {/* Top lanes */}
        <motion.div
          className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Top Lanes by Volume</p>
            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Avg rate per load · March 2024</p>
          </div>
          <div className="overflow-x-auto"><table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                {['#', 'Lane', 'Loads', 'Miles', 'Avg Rate'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
              {MOCK_TOP_LANES.map((lane, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <td className="px-6 py-3.5 text-xs text-gray-300 dark:text-zinc-600 tabular-nums">{i + 1}</td>
                  <td className="px-6 py-3.5 text-sm font-medium text-gray-800 dark:text-zinc-100">
                    {lane.origin.split(',')[0]} → {lane.destination.split(',')[0]}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-zinc-400 tabular-nums">{lane.loads}</td>
                  <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-zinc-400 tabular-nums">{lane.total_miles.toLocaleString()} mi</td>
                  <td className="px-6 py-3.5 text-sm font-semibold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(lane.avg_rate)}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </motion.div>
      </div>
    </div>
  )
}
