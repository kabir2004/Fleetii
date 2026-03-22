import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line,
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, ShieldCheck, Receipt, ArrowRight } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { MOCK_SPEND_BY_MONTH, MOCK_SPEND_BY_CARRIER, MOCK_TOP_LANES, MOCK_SAVINGS } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'

/* ── derived values ──────────────────────────────────────────────────────── */

const current  = MOCK_SPEND_BY_MONTH[5]   // March
const previous = MOCK_SPEND_BY_MONTH[4]   // February

const totalSpend    = current.cost
const totalRevenue  = current.revenue
const grossMargin   = totalRevenue - totalSpend
const marginPct     = ((grossMargin / totalRevenue) * 100)
const spendDelta    = ((totalSpend - previous.cost) / previous.cost * 100)
const ytdSpend      = MOCK_SPEND_BY_MONTH.reduce((s, m) => s + m.cost, 0)
const ytdSavings    = MOCK_SAVINGS.reduce((s, m) => s + m.amount, 0)

const SPEND_BREAKDOWN = [
  { label: 'Driver Pay',        value: 412800, pct: 44 },
  { label: 'Carrier Payments',  value: 284200, pct: 30 },
  { label: 'Fuel',              value: 148400, pct: 16 },
  { label: 'Maintenance',       value: 52200,  pct: 6  },
  { label: 'Tolls & Misc',      value: 36400,  pct: 4  },
]

/* ── chart data with margin % ────────────────────────────────────────────── */

const chartData = MOCK_SPEND_BY_MONTH.map(m => ({
  month:   m.month,
  Revenue: m.revenue,
  Spend:   m.cost,
  Margin:  Math.round(((m.revenue - m.cost) / m.revenue) * 100),
}))

/* ── tooltip ─────────────────────────────────────────────────────────────── */

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2.5 shadow-md text-xs">
      <p className="text-gray-500 dark:text-zinc-400 font-medium mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="text-gray-400 dark:text-zinc-500">{p.name}</span>
          <span className="font-semibold text-gray-900 dark:text-zinc-50 tabular-nums">
            {p.name === 'Margin' ? `${p.value}%` : formatCurrency(p.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ── page ────────────────────────────────────────────────────────────────── */

export default function SpendOverviewPage() {
  const { darkMode } = useUIStore()
  const green      = darkMode ? '#C8F400' : '#2D6A4F'
  const gridColor  = darkMode ? '#27272a' : '#f3f4f6'
  const tickColor  = darkMode ? '#71717a' : '#9ca3af'
  const spendColor = '#818cf8'

  return (
    <div className="p-4 md:p-6 w-full space-y-5">

      {/* KPI strip */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {[
          {
            label: 'Total Spend — March',
            value: formatCurrency(totalSpend),
            sub: `${spendDelta > 0 ? '+' : ''}${spendDelta.toFixed(1)}% vs February`,
            up: spendDelta > 0,
            icon: DollarSign,
          },
          {
            label: 'Gross Margin',
            value: formatCurrency(grossMargin),
            sub: `${marginPct.toFixed(1)}% margin rate`,
            up: true,
            icon: TrendingUp,
          },
          {
            label: 'YTD Spend',
            value: formatCurrency(ytdSpend),
            sub: `${MOCK_SPEND_BY_MONTH.length} months tracked`,
            up: null,
            icon: Receipt,
          },
          {
            label: 'YTD Savings Found',
            value: formatCurrency(ytdSavings),
            sub: 'Audit engine recoveries',
            up: true,
            icon: ShieldCheck,
          },
        ].map(({ label, value, sub, up, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">{label}</p>
              <div className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 flex items-center justify-center text-gray-400 dark:text-zinc-500"><Icon className="h-4 w-4" /></div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-zinc-50 tabular-nums tracking-tight">{value}</p>
            <p className={cn('text-xs mt-1.5 flex items-center gap-1',
              up === true ? 'text-green-600' : up === false ? 'text-red-500' : 'text-gray-400 dark:text-zinc-500'
            )}>
              {up === true && <TrendingUp className="h-3 w-3" />}
              {up === false && <TrendingDown className="h-3 w-3" />}
              {sub}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Chart row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Revenue vs Spend trend */}
        <motion.div
          className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Revenue vs Spend</p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Oct 2023 – Mar 2024 · margin % overlaid</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-zinc-500">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full inline-block" style={{ background: green }} />Revenue</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full inline-block" style={{ background: spendColor }} />Spend</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-400 inline-block" />Margin %</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={chartData} margin={{ top: 4, right: 40, left: 0, bottom: -10 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={green} stopOpacity={darkMode ? 0.25 : 0.18} />
                  <stop offset="100%" stopColor={green} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={spendColor} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={spendColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
              <YAxis
                yAxisId="dollars"
                tick={{ fontSize: 11, fill: tickColor }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}K`}
                domain={[400000, 'auto']}
                tickCount={5}
                width={48}
              />
              <YAxis
                yAxisId="pct"
                orientation="right"
                tick={{ fontSize: 11, fill: tickColor }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `${v}%`}
                domain={[0, 40]}
                tickCount={5}
                width={32}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: gridColor, strokeWidth: 1 }} />
              <Area yAxisId="dollars" type="monotone" dataKey="Revenue" stroke={green} strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: green, strokeWidth: 0 }} />
              <Area yAxisId="dollars" type="monotone" dataKey="Spend"   stroke={spendColor} strokeWidth={2.5} fill="url(#spendGrad)" dot={false} activeDot={{ r: 4, fill: spendColor, strokeWidth: 0 }} />
              <Line yAxisId="pct" type="monotone" dataKey="Margin" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Spend breakdown */}
        <motion.div
          className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100 mb-1">Spend by Category</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mb-5">March 2024 · {formatCurrency(totalSpend)} total</p>

          <div className="space-y-4">
            {SPEND_BREAKDOWN.map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-600 dark:text-zinc-400">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 dark:text-zinc-500 tabular-nums">{item.pct}%</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-zinc-50 tabular-nums w-20 text-right">{formatCurrency(item.value)}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                  <div className="h-full rounded-full bg-gray-800 dark:bg-zinc-300" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-zinc-500">Total spend</span>
            <span className="text-base font-bold text-gray-900 dark:text-zinc-50 tabular-nums">{formatCurrency(totalSpend)}</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Top Carriers */}
        <motion.div
          className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Top Carriers by Spend</p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">March 2024</p>
            </div>
            <button className="text-xs text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="overflow-x-auto"><table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide w-8">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Carrier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Loads</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
              {MOCK_SPEND_BY_CARRIER.map((carrier, i) => {
                const share = Math.round((carrier.amount / MOCK_SPEND_BY_CARRIER.reduce((s, c) => s + c.amount, 0)) * 100)
                return (
                  <tr key={carrier.name} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                    <td className="px-6 py-3.5 text-xs text-gray-300 dark:text-zinc-600 tabular-nums">{i + 1}</td>
                    <td className="px-6 py-3.5">
                      <p className="text-sm font-medium text-gray-800 dark:text-zinc-100">{carrier.name}</p>
                      <div className="mt-1 h-1 w-24 rounded-full bg-gray-100 dark:bg-zinc-700 overflow-hidden">
                        <div className="h-full rounded-full bg-gray-400" style={{ width: `${share}%` }} />
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-zinc-400 tabular-nums">{carrier.loads}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-gray-900 dark:text-zinc-50 tabular-nums text-right">{formatCurrency(carrier.amount)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table></div>
        </motion.div>

        {/* Top Lanes */}
        <motion.div
          className="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-zinc-100">Top Lanes by Volume</p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">March 2024 · avg rate per load</p>
            </div>
            <button className="text-xs text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="overflow-x-auto"><table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide w-8">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Lane</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Loads</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide">Avg Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
              {MOCK_TOP_LANES.map((lane, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  <td className="px-6 py-3.5 text-xs text-gray-300 dark:text-zinc-600 tabular-nums">{i + 1}</td>
                  <td className="px-6 py-3.5">
                    <p className="text-sm font-medium text-gray-800 dark:text-zinc-100">
                      {lane.origin.split(',')[0]} → {lane.destination.split(',')[0]}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{lane.total_miles.toLocaleString()} mi total</p>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-500 dark:text-zinc-400 tabular-nums">{lane.loads}</td>
                  <td className="px-6 py-3.5 text-sm font-semibold text-gray-900 dark:text-zinc-50 tabular-nums text-right">{formatCurrency(lane.avg_rate)}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </motion.div>
      </div>
    </div>
  )
}
